const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const PUBLIC_DIR = __dirname;
const MAX_BODY_BYTES = 12 * 1024 * 1024;

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
    if (req.method === "POST" && req.url === "/api/classify") {
      await handleClassify(req, res);
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
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 400, {
      error: "OPENAI_API_KEY is not set. Create a .env or set the environment variable before running the server.",
    });
    return;
  }

  const body = await readJsonBody(req);
  const text = String(body.text || "").trim();
  const imageDataUrl = String(body.imageDataUrl || "").trim();
  const source = imageDataUrl ? "图片识别" : body.source || "文字识别";

  if (!text && !imageDataUrl) {
    sendJson(res, 400, { error: "Please provide text or an image." });
    return;
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
    sendJson(res, apiResponse.status, {
      error: result.error?.message || "OpenAI API request failed.",
    });
    return;
  }

  const outputText = extractOutputText(result);
  const parsed = parseJsonObject(outputText);
  sendJson(res, 200, {
    task: normalizeTask(parsed, source, text),
    raw: outputText,
  });
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
  const requestedPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR) || filePath.includes(`${path.sep}.git${path.sep}`)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}
