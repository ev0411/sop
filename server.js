const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const PUBLIC_DIR = __dirname;
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const sessions = new Map();
const oauthStates = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, BASE_URL);

    if (req.method === "POST" && url.pathname === "/api/classify") {
      await handleClassify(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/auth/")) {
      await handleAuth(req, res, url);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/email/status") {
      await handleEmailStatus(req, res);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/email/sync") {
      await handleEmailSync(req, res);
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Work Dashboard running at http://localhost:${PORT}`);
});

async function handleClassify(req, res) {
  const body = await readJsonBody(req);
  const text = String(body.text || "").trim();
  const imageDataUrl = String(body.imageDataUrl || "").trim();
  const source = imageDataUrl ? "图片识别" : body.source || "文字识别";

  if (!text && !imageDataUrl) {
    sendJson(res, 400, { error: "Please provide text or an image." });
    return;
  }

  const task = await classifyTaskWithOpenAI({ text, imageDataUrl, source });
  sendJson(res, 200, { task });
}

async function handleAuth(req, res, url) {
  const [, , provider, callback] = url.pathname.split("/");
  if (!["google", "microsoft"].includes(provider)) {
    sendText(res, 404, "Unknown email provider.");
    return;
  }

  if (callback === "callback") {
    await handleAuthCallback(req, res, url, provider);
    return;
  }

  const config = getOAuthConfig(provider);
  if (!config.clientId || !config.clientSecret) {
    sendText(res, 400, `${provider} OAuth is not configured. Set ${config.clientIdKey} and ${config.clientSecretKey}.`);
    return;
  }

  const state = randomUUID();
  oauthStates.set(state, { provider, createdAt: Date.now() });
  const authUrl = new URL(config.authUrl);
  Object.entries(config.authParams(state)).forEach(([key, value]) => authUrl.searchParams.set(key, value));
  redirect(res, authUrl.toString());
}

async function handleAuthCallback(req, res, url, provider) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = oauthStates.get(state);
  oauthStates.delete(state);

  if (!code || !savedState || savedState.provider !== provider) {
    sendText(res, 400, "Invalid OAuth callback.");
    return;
  }

  const config = getOAuthConfig(provider);
  const tokenResponse = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = await tokenResponse.json();
  if (!tokenResponse.ok) {
    sendText(res, tokenResponse.status, token.error_description || token.error || "OAuth token exchange failed.");
    return;
  }

  const sessionId = randomUUID();
  sessions.set(sessionId, {
    provider,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: Date.now() + Number(token.expires_in || 3600) * 1000,
    createdAt: Date.now(),
  });
  res.writeHead(302, {
    Location: "/?email=connected",
    "Set-Cookie": `work_dashboard_session=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`,
  });
  res.end();
}

async function handleEmailStatus(req, res) {
  const session = getSession(req);
  sendJson(res, 200, {
    connected: Boolean(session),
    provider: session?.provider || null,
    configured: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      microsoft: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
    },
  });
}

async function handleEmailSync(req, res) {
  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, { error: "Please connect Gmail or Outlook first." });
    return;
  }

  const body = await readJsonBody(req);
  const limit = Math.min(Number(body.limit || 5), 10);
  const messages = session.provider === "google" ? await fetchGmailMessages(session, limit) : await fetchMicrosoftMessages(session, limit);
  if (!messages.length) {
    sendJson(res, 200, { messages: [], tasks: [] });
    return;
  }

  const text = messages
    .map((message, index) =>
      [
        `邮件 ${index + 1}`,
        `主题：${message.subject}`,
        `发件人：${message.from}`,
        `时间：${message.date}`,
        `内容：${message.preview}`,
      ].join("\n")
    )
    .join("\n\n");
  const task = await classifyTaskWithOpenAI({ text: `邮件读取：\n${text}`, source: "邮件读取" });
  sendJson(res, 200, { messages, tasks: [task] });
}

async function classifyTaskWithOpenAI({ text, imageDataUrl = "", source = "文字识别" }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Create a .env or set the environment variable before running the server.");
  }

  const content = [
    {
      type: "input_text",
      text: [
        "你是个人工作 Dashboard 的任务识别助手。",
        "请从用户输入的文字或图片中提取工作待办，并分类到以下模块之一：业务端、文件/合同、行政类、采购、市场营销、活动追踪。",
        "业务端二级分类可用：客户材料收集、业务机会跟进。",
        "必须只返回 JSON，不要返回 Markdown。",
        "JSON 字段：title, category, subcategory, object, clientType, direction, dueDate, followDate, reminder, status, priority, source, sourceLink, owner, notes, progressTags, materials。",
        "状态默认待确认；负责人默认本人；日期若无法识别，用 2026-07-30；优先级在高/中/低中选择。",
        `来源字段使用：${source}。`,
        `用户文字：${text || "无文字，仅识别图片"}`,
      ].join("\n"),
    },
  ];

  if (imageDataUrl) {
    content.push({
      type: "input_image",
      image_url: imageDataUrl,
      detail: "auto",
    });
  }

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        {
          role: "user",
          content,
        },
      ],
    }),
  });

  const result = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(result.error?.message || "OpenAI API request failed.");
  }

  const outputText = extractOutputText(result);
  const parsed = parseJsonObject(outputText);
  return normalizeTask(parsed, source, text);
}

async function fetchGmailMessages(session, limit) {
  await ensureFreshToken(session);
  const list = await authedJson("https://gmail.googleapis.com/gmail/v1/users/me/messages?" + new URLSearchParams({ maxResults: String(limit), q: "newer_than:30d" }), session);
  const ids = list.messages || [];
  const messages = [];
  for (const item of ids.slice(0, limit)) {
    const message = await authedJson(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, session);
    const headers = Object.fromEntries((message.payload?.headers || []).map((header) => [header.name.toLowerCase(), header.value]));
    messages.push({
      subject: headers.subject || "(无主题)",
      from: headers.from || "未知发件人",
      date: headers.date || "",
      preview: message.snippet || "",
    });
  }
  return messages;
}

async function fetchMicrosoftMessages(session, limit) {
  await ensureFreshToken(session);
  const data = await authedJson("https://graph.microsoft.com/v1.0/me/messages?" + new URLSearchParams({
    "$top": String(limit),
    "$orderby": "receivedDateTime desc",
    "$select": "subject,from,receivedDateTime,bodyPreview",
  }), session);
  return (data.value || []).map((message) => ({
    subject: message.subject || "(无主题)",
    from: message.from?.emailAddress?.address || message.from?.emailAddress?.name || "未知发件人",
    date: message.receivedDateTime || "",
    preview: message.bodyPreview || "",
  }));
}

async function ensureFreshToken(session) {
  if (session.expiresAt > Date.now() + 60000 || !session.refreshToken) return;
  const config = getOAuthConfig(session.provider);
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: session.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const token = await response.json();
  if (!response.ok) throw new Error(token.error_description || token.error || "OAuth refresh failed.");
  session.accessToken = token.access_token;
  session.refreshToken = token.refresh_token || session.refreshToken;
  session.expiresAt = Date.now() + Number(token.expires_in || 3600) * 1000;
}

async function authedJson(url, session) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || data.error_description || "Email API request failed.");
  return data;
}

function getOAuthConfig(provider) {
  if (provider === "google") {
    const redirectUri = `${BASE_URL}/auth/google/callback`;
    return {
      clientIdKey: "GOOGLE_CLIENT_ID",
      clientSecretKey: "GOOGLE_CLIENT_SECRET",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri,
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      authParams: (state) => ({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        access_type: "offline",
        prompt: "consent",
        state,
      }),
    };
  }

  const redirectUri = `${BASE_URL}/auth/microsoft/callback`;
  return {
    clientIdKey: "MICROSOFT_CLIENT_ID",
    clientSecretKey: "MICROSOFT_CLIENT_SECRET",
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    redirectUri,
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    authParams: (state) => ({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      response_mode: "query",
      scope: "openid email profile offline_access https://graph.microsoft.com/Mail.Read",
      state,
    }),
  };
}

function getSession(req) {
  const cookie = req.headers.cookie || "";
  const sessionId = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("work_dashboard_session="))
    ?.split("=")[1];
  return sessionId ? sessions.get(sessionId) : null;
}

function normalizeTask(task, source, originalText) {
  return {
    id: randomUUID(),
    title: task.title || "AI 识别任务",
    category: task.category || "业务端",
    subcategory: task.subcategory || "客户材料收集",
    object: task.object || "待确认对象",
    clientType: task.clientType || "待确认",
    direction: task.direction || "",
    dueDate: task.dueDate || "2026-07-30",
    followDate: task.followDate || "2026-07-30",
    reminder: task.reminder || "指定日期提醒",
    status: task.status || "待确认",
    priority: task.priority || "中",
    source: task.source || source,
    sourceLink: task.sourceLink || (source === "图片识别" ? "图片上传" : source === "邮件读取" ? "邮箱同步" : "AI 识别"),
    owner: task.owner || "本人",
    updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-"),
    notes: task.notes || originalText || "由 AI 识别生成",
    progressTags: Array.isArray(task.progressTags) ? task.progressTags : [],
    materials: Array.isArray(task.materials) ? task.materials : [],
  };
}

function extractOutputText(result) {
  if (result.output_text) return result.output_text;
  return (result.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI response did not contain valid JSON.");
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, BASE_URL);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR) || filePath.includes(`${path.sep}.git${path.sep}`)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error && !path.extname(filePath)) {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (indexError, indexData) => {
        if (indexError) {
          sendText(res, 404, "Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
        res.end(indexData);
      });
      return;
    }
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...parts] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = parts.join("=").replace(/^["']|["']$/g, "");
  }
}
