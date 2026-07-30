const STORAGE_KEY = "work-dashboard-v1";

const categories = ["全部", "业务端", "文件/合同", "行政类", "采购", "市场营销", "活动追踪"];
const statuses = ["未开始", "进行中", "待确认", "已完成", "已暂停", "已逾期"];
const priorities = ["高", "中", "低"];
const directions = ["CNY to AUD", "CNY to USD", "AUD to CNY", "AUD to USD"];
const today = "2026-07-30";

const seedState = {
  view: "weekly",
  query: "",
  category: "全部",
  status: "全部",
  direction: "全部",
  taskDraft: null,
  weeklyAiText: "把公司客户 Aurora Trading 的 Extract 文件和资金来源证明列入本周待办，2026-08-02 前完成，提前 1 周提醒。",
  weeklyAiImageName: "",
  aiStatus: "",
  intakeText: "公司客户 Aurora Trading 需要在 2026-08-07 前完成 KYC/KYB，操作 CNY to AUD，需要提前 1 周提醒；目前进度：国内付款人确认中。还要补充 Extract 文件和资金来源证明。",
  emailConnected: false,
  emailLastSync: "",
  emailProvider: "Gmail / Outlook",
  emailStatus: "",
  emailMessages: [],
  emailDraftText: "客户邮件要求 2026-08-04 前补充 KYC 材料、地址证明和资金用途证明，需要当周提醒。",
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "补齐 Aurora Trading KYB 材料",
      category: "业务端",
      subcategory: "客户材料收集",
      object: "Aurora Trading",
      clientType: "公司客户",
      direction: "CNY to AUD",
      dueDate: "2026-08-02",
      followDate: "2026-07-31",
      reminder: "提前 1 周提醒",
      status: "进行中",
      priority: "高",
      source: "文字识别",
      sourceLink: "聊天记录",
      owner: "本人",
      updatedAt: "2026-07-30 09:20",
      notes: "缺 Extract 文件、资金来源证明；证件类材料需较高隐私级别。",
      progressTags: ["KYC/KYB 当中", "国内付款人确认中"],
      materials: ["护照", "任意 photo ID", "地址证明信", "ACIS letter"],
    },
    {
      id: crypto.randomUUID(),
      title: "检查老板私人表格并提交",
      category: "文件/合同",
      subcategory: "表格检查",
      object: "老板",
      clientType: "内部",
      direction: "",
      dueDate: "2026-07-31",
      followDate: "2026-07-30",
      reminder: "当日提醒",
      status: "待确认",
      priority: "中",
      source: "邮件读取",
      sourceLink: "邮件附件",
      owner: "本人",
      updatedAt: "2026-07-29 16:05",
      notes: "系统只生成回复草稿，不自动发送邮件。",
      progressTags: [],
      materials: [],
    },
    {
      id: crypto.randomUUID(),
      title: "采购会议室碎纸机并生成询价草稿",
      category: "采购",
      subcategory: "行政类任务 - 采购",
      object: "办公室",
      clientType: "内部",
      direction: "",
      dueDate: "2026-08-05",
      followDate: "2026-08-01",
      reminder: "当周提醒",
      status: "未开始",
      priority: "中",
      source: "手动输入",
      sourceLink: "采购需求",
      owner: "本人",
      updatedAt: "2026-07-30 10:10",
      notes: "预算 AUD 500，比较澳洲本地、Amazon Australia 和淘宝。",
      progressTags: [],
      materials: [],
    },
    {
      id: crypto.randomUUID(),
      title: "跟进 8 月客户活动报名名单",
      category: "活动追踪",
      subcategory: "活动报名",
      object: "8 月客户活动",
      clientType: "客户活动",
      direction: "",
      dueDate: "2026-07-29",
      followDate: "2026-07-30",
      reminder: "逾期提醒",
      status: "已逾期",
      priority: "高",
      source: "图片识别",
      sourceLink: "活动海报截图",
      owner: "本人",
      updatedAt: "2026-07-30 08:30",
      notes: "需要确认嘉宾名单和 follow-up 文案。",
      progressTags: [],
      materials: [],
    },
  ],
  clients: [
    {
      name: "Aurora Trading",
      type: "公司客户",
      direction: "CNY to AUD",
      collected: ["护照", "任意 photo ID", "地址证明信", "ACIS letter"],
      required: ["护照", "任意 photo ID", "国内付款人证件", "澳洲电话", "国内电话", "地址证明信", "资金来源证明", "资金用途证明", "ACIS letter", "Extract 文件"],
      overdue: ["国内付款人证件", "Extract 文件"],
      updatedAt: "2026-07-30 09:20",
      note: "资金证明一个月内补充，证件类本周内补充。",
    },
    {
      name: "Mia Chen",
      type: "个人客户",
      direction: "AUD to CNY",
      collected: ["护照", "任意 photo ID", "澳洲电话", "国内电话"],
      required: ["护照", "任意 photo ID", "国内付款人证件", "澳洲电话", "国内电话", "地址证明信", "资金来源证明", "资金用途证明"],
      overdue: [],
      updatedAt: "2026-07-29 14:15",
      note: "地址证明信待客户确认。",
    },
  ],
  history: [
    { week: "2026-W30", total: 18, done: 13, open: 3, overdue: 2 },
    { week: "2026-W29", total: 16, done: 14, open: 1, overdue: 1 },
  ],
  purchase: {
    keyword: "德龙咖啡机",
    budget: "AUD 500",
    region: "澳洲本地, Amazon Australia, 淘宝",
    quantity: 1,
    requirements: "评分 4.5 以上，配送快，优先含 GST",
    searchedAt: "2026-07-30 12:21",
    status: "已完成",
    products: [
      {
        title: "DeLonghi Dedica Arte Coffee Machine",
        source: "Amazon Australia",
        price: "AUD 279",
        gst: "含 GST",
        shipping: "AUD 0",
        eta: "2-4 天",
        rating: "4.6",
        landed: "AUD 279",
        reliability: "高",
        link: "https://www.delonghi.com/en-au/p/dedica-manual-espresso-makers-dedica-arte-manual-coffee-machine-ec885.m/EC885.M.html",
      },
      {
        title: "Delonghi Magnifica Start",
        source: "澳洲本地网站",
        price: "AUD 489",
        gst: "含 GST",
        shipping: "AUD 15",
        eta: "3-6 天",
        rating: "4.5",
        landed: "AUD 504",
        reliability: "中",
        link: "https://www.delonghi.com/en-au/p/magnifica-start-magnifica-start-silver-black-automatic-coffee-machine-ecam220.31.sb/ECAM220.31.SB.html",
      },
    ],
  },
};

let state = loadState();
let weeklyAiImageDataUrl = "";

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(seedState));
  try {
    return normalizeState({ ...structuredClone(seedState), ...JSON.parse(saved) });
  } catch {
    return normalizeState(structuredClone(seedState));
  }
}

function normalizeState(nextState) {
  const detailLinks = {
    "DeLonghi Dedica Arte Coffee Machine": "https://www.delonghi.com/en-au/p/dedica-manual-espresso-makers-dedica-arte-manual-coffee-machine-ec885.m/EC885.M.html",
    "Delonghi Magnifica Start": "https://www.delonghi.com/en-au/p/magnifica-start-magnifica-start-silver-black-automatic-coffee-machine-ecam220.31.sb/ECAM220.31.SB.html",
  };
  nextState.purchase.products = nextState.purchase.products.map((product) => ({
    ...product,
    link: detailLinks[product.title] || product.link,
  }));
  return nextState;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isOverdue(task) {
  return task.status !== "已完成" && task.dueDate && task.dueDate < today;
}

function filteredTasks() {
  return state.tasks
    .map((task) => (isOverdue(task) ? { ...task, status: "已逾期" } : task))
    .filter((task) => state.category === "全部" || task.category === state.category)
    .filter((task) => state.status === "全部" || task.status === state.status)
    .filter((task) => state.direction === "全部" || task.direction === state.direction)
    .filter((task) => {
      const text = `${task.title} ${task.category} ${task.subcategory} ${task.object} ${task.direction} ${task.source} ${task.notes}`.toLowerCase();
      return text.includes(state.query.toLowerCase());
    });
}

function classifyText(text, source = "文字识别") {
  const rules = [
    { keys: ["护照", "photo id", "地址证明", "资金来源", "资金用途", "材料"], category: "业务端", subcategory: "客户材料收集" },
    { keys: ["kyc", "kyb", "合规", "付款人", "收款人", "交易方向"], category: "业务端", subcategory: "业务机会跟进" },
    { keys: ["表格", "合同", "填写", "签署", "文件", "老板"], category: "文件/合同", subcategory: "文件或合同跟进" },
    { keys: ["采购", "报价", "商品", "供应商", "amazon", "淘宝"], category: "采购", subcategory: "行政类任务 - 采购" },
    { keys: ["市场营销", "活动", "campaign", "event", "海报"], category: "活动追踪", subcategory: "市场营销/活动追踪" },
  ];
  const lower = text.toLowerCase();
  const match = rules.find((rule) => rule.keys.some((key) => lower.includes(key.toLowerCase()))) || rules[0];
  const dateMatch = text.match(/20\d{2}[-/.年]\d{1,2}[-/.月]\d{1,2}/);
  const direction = directions.find((item) => lower.includes(item.toLowerCase())) || "";
  const type = text.includes("公司客户") ? "公司客户" : text.includes("个人客户") ? "个人客户" : "";
  const objectMatch = text.match(/(?:客户|公司客户|个人客户)\s*([A-Za-z0-9\u4e00-\u9fa5 ]{2,24})/);
  const progressTags = ["未合规", "KYC/KYB 当中", "已完成合规", "国内付款人确认中", "澳洲收款人确认中"].filter((tag) =>
    lower.includes(tag.toLowerCase())
  );
  return {
    id: crypto.randomUUID(),
    title: text.slice(0, 32).replace(/[，。；;,.]$/, "") || "新识别任务",
    category: match.category,
    subcategory: match.subcategory,
    object: objectMatch?.[1]?.trim() || "待确认对象",
    clientType: type || "待确认",
    direction,
    dueDate: dateMatch ? dateMatch[0].replace(/[年月/.]/g, "-").replace(/-$/, "") : today,
    followDate: today,
    reminder: lower.includes("提前 1 周") ? "提前 1 周提醒" : lower.includes("当周") ? "当周提醒" : "指定日期提醒",
    status: "待确认",
    priority: lower.includes("紧急") || lower.includes("逾期") ? "高" : "中",
    source,
    sourceLink: source === "图片识别" ? "图片上传" : source === "邮件读取" ? "邮箱同步" : "粘贴文本",
    owner: "本人",
    updatedAt: nowStamp(),
    notes: text,
    progressTags,
    materials: ["护照", "任意 photo ID", "国内付款人证件", "地址证明信", "资金来源证明", "资金用途证明", "ACIS letter", "Extract 文件"].filter((item) =>
      lower.includes(item.toLowerCase())
    ),
  };
}

function nowStamp() {
  return new Date().toLocaleString("zh-CN", { hour12: false }).replaceAll("/", "-");
}

function render() {
  const app = document.querySelector("#app");
  const tasks = filteredTasks();
  const overdue = state.tasks.filter(isOverdue).length;
  const done = state.tasks.filter((task) => task.status === "已完成").length;
  const clientMissing = state.clients.reduce((sum, client) => sum + client.required.length - client.collected.length, 0);
  const dueToday = state.tasks.filter((task) => task.followDate <= today && task.status !== "已完成").length;

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">EV</div>
          <div>
            <h1>工作 Dashboard</h1>
            <p>Weekly operating desk</p>
          </div>
        </div>
        <nav class="nav">
          ${navButton("weekly", "每周总表", state.tasks.length)}
          ${navButton("intake", "手动分类", state.tasks.filter((t) => t.source.includes("识别")).length)}
          ${navButton("email", "链接邮箱", state.emailConnected ? "已连" : "未连")}
          ${navButton("clients", "客户材料", state.clients.length)}
          ${navButton("business", "业务机会", state.tasks.filter((t) => t.subcategory === "业务机会跟进").length)}
          ${navButton("docs", "行政任务", state.tasks.filter((t) => ["文件/合同", "行政类", "市场营销", "活动追踪"].includes(t.category)).length)}
          ${navButton("purchase", "采购 Agent", state.purchase.products.length)}
          ${navButton("history", "历史归档", state.history.length)}
        </nav>
        <div class="sidebar-note">安全规则：邮件、询价和采购订单只生成草稿，不自动发送；客户证件与资金材料默认按高隐私级别处理。</div>
      </aside>
      <main class="main">
        <section class="topbar">
          <div class="hero">
            <h2>${viewTitle()}</h2>
            <p>今天是 2026-07-30。聚合待办、提醒、客户材料、业务进度与历史复盘。</p>
            <p class="motto">人情可送马，买卖不饶针</p>
          </div>
          <div class="toolbar">
            <button class="btn primary" data-action="new">新增任务</button>
          </div>
        </section>
        <section class="alert-strip">
          ${statCard(state.tasks.length, "本周任务", "总入口")}
          ${statCard(dueToday, "需要跟进", "今日/当周提醒")}
          ${statCard(overdue, "逾期事项", "自动高亮")}
          ${statCard(clientMissing, "缺失材料", "客户材料收集")}
        </section>
        ${renderView(tasks)}
      </main>
    </div>
    ${renderModal()}
  `;
  bindEvents();
}

function navButton(view, label, count) {
  return `<button class="${state.view === view ? "active" : ""}" data-view="${view}"><span>${label}</span><span class="count">${count}</span></button>`;
}

function statCard(value, label, caption) {
  return `<div class="alert"><strong>${value}</strong><span>${label} · ${caption}</span></div>`;
}

function viewTitle() {
  return {
    weekly: "每周 To Do List 总表",
    intake: "自动读取与自动分类",
    email: "链接邮箱与邮件任务分类",
    clients: "客户材料收集",
    business: "业务机会跟进",
    docs: "文件、合同与行政任务",
    purchase: "采购 Agent",
    history: "历史任务归档",
  }[state.view];
}

function renderView(tasks) {
  if (state.view === "intake") return renderIntake();
  if (state.view === "email") return renderEmail();
  if (state.view === "clients") return renderClients();
  if (state.view === "business") return renderBusiness();
  if (state.view === "docs") return renderDocs();
  if (state.view === "purchase") return renderPurchase();
  if (state.view === "history") return renderHistory();
  return renderWeekly(tasks);
}

function renderWeekly(tasks) {
  const previewText = state.weeklyAiImageName
    ? `${state.weeklyAiText}\n图片 OCR：从 ${state.weeklyAiImageName} 中识别待办、日期、客户名称和文件事项。`
    : state.weeklyAiText;
  const preview = classifyText(previewText || "");
  return `
    <section class="panel ai-panel">
      <div class="panel-head">
        <h3>AI 识别工作内容</h3>
        <span class="badge private">文字 / 图片识别后需确认</span>
      </div>
      <div class="panel-body ai-intake-grid">
        <div class="source-box">
          <textarea class="textarea" data-weekly-ai-text placeholder="粘贴聊天记录、邮件片段、会议纪要，或描述图片里的工作内容">${escapeHtml(state.weeklyAiText)}</textarea>
          <label class="upload-zone">
            <input type="file" data-weekly-ai-image accept="image/*" />
            <span>选择图片进行 OCR 识别</span>
            <b>${state.weeklyAiImageName ? escapeHtml(state.weeklyAiImageName) : "未选择图片"}</b>
          </label>
        </div>
        <div class="classification-preview compact">
          <div><b>自动分类：</b>${preview.category} / ${preview.subcategory}</div>
          <div><b>对象：</b>${preview.object}　<b>截止：</b>${preview.dueDate}　<b>提醒：</b>${preview.reminder}</div>
          <div><b>来源：</b>${state.weeklyAiImageName ? "图片识别 + 文字识别" : "文字识别"}　<b>状态：</b>${state.aiStatus || "等待识别"}</div>
          <button class="btn primary" data-action="add-weekly-ai-task">调用 AI 并加入本周待办</button>
        </div>
      </div>
    </section>
    <section class="grid">
      <div class="panel">
        <div class="panel-head">
          <h3>任务列表</h3>
          <span class="badge info">${tasks.length} 条匹配</span>
        </div>
        <div class="panel-body">
          ${renderFilters()}
          <div class="task-list">${tasks.length ? tasks.map(taskRow).join("") : `<div class="empty">没有匹配任务</div>`}</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>提醒与来源</h3></div>
        <div class="panel-body detail-list">
          <div><b>当日提醒：</b>${state.tasks.filter((t) => t.followDate <= today && t.status !== "已完成").map((t) => t.title).join("、")}</div>
          <div><b>数据来源：</b>手动输入、文本粘贴、图片 OCR、邮件读取、采购实时搜索、历史任务记录。</div>
          <div><b>归档逻辑：</b>完成任务进入历史周归档；未完成任务可带入下周；逾期任务保留标记。</div>
        </div>
      </div>
    </section>
  `;
}

function renderEmail() {
  const preview = classifyText("邮件读取：客户邮件要求 2026-08-04 前补充 KYC 材料、地址证明和资金用途证明，需要当周提醒。", "邮件读取");
  const messages = state.emailMessages || [];
  return `
    <section class="grid">
      <div class="panel">
        <div class="panel-head">
          <h3>邮箱连接</h3>
          <span class="badge ${state.emailConnected ? "ok" : "private"}">${state.emailConnected ? "已连接" : "未连接"}</span>
        </div>
        <div class="panel-body source-box">
          <div class="email-status">
            <strong>${state.emailProvider}</strong>
            <span>${state.emailConnected ? `上次同步：${state.emailLastSync || "尚未同步"}` : "连接后可读取邮件主题、发件人、正文待办、附件名和截止日期"}</span>
          </div>
          <textarea class="textarea" data-email-text placeholder="这里会显示邮箱读取到的邮件内容；本地版本可先粘贴邮件正文测试 AI 分类">${escapeHtml(state.emailDraftText)}</textarea>
          <div class="toolbar">
            <button class="btn primary" data-action="connect-gmail">链接 Gmail</button>
            <button class="btn primary" data-action="connect-outlook">链接 Outlook</button>
            <button class="btn" data-action="check-email-status">检查连接</button>
            <button class="btn" data-action="sync-email">读取最近邮件并 AI 分类</button>
          </div>
          <div class="classification-preview">
            <div><b>识别示例：</b>${preview.title}</div>
            <div><b>自动匹配：</b>${preview.category} / ${preview.subcategory}</div>
            <div><b>状态：</b>${state.emailStatus || "等待邮箱授权或邮件输入"}</div>
            <div><b>安全边界：</b>只读取并生成待确认任务，不自动发送邮件或回复。</div>
          </div>
          <div class="email-message-list">
            ${messages.length ? messages.map(emailMessageRow).join("") : `<div class="empty">尚未读取邮件</div>`}
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>邮件匹配规则</h3></div>
        <div class="panel-body detail-list">
          <div><b>邮件主题：</b>匹配客户名、公司名、合同、报价、活动和采购关键词。</div>
          <div><b>正文内容：</b>提取待办事项、截止日期、是否需要回复/填写/上传/跟进。</div>
          <div><b>附件名称：</b>识别表格、合同、图片、证件材料，并归入对应模块。</div>
          <div><b>进入总表：</b>读取后自动生成“待确认”任务，用户确认后进入当周 To Do。</div>
        </div>
      </div>
    </section>
  `;
}

function emailMessageRow(message) {
  return `
    <article class="email-message">
      <strong>${escapeHtml(message.subject)}</strong>
      <span>${escapeHtml(message.from)} · ${escapeHtml(message.date)}</span>
      <p>${escapeHtml(message.preview)}</p>
    </article>
  `;
}

function renderFilters() {
  return `
    <div class="filters">
      <input class="field" data-filter="query" placeholder="全局搜索：客户、任务、材料、附件、备注" value="${escapeHtml(state.query)}" />
      <select class="field" data-filter="category">${categories.map((item) => option(item, state.category)).join("")}</select>
      <select class="field" data-filter="status">${["全部", ...statuses].map((item) => option(item, state.status)).join("")}</select>
      <select class="field" data-filter="direction">${["全部", ...directions].map((item) => option(item, state.direction)).join("")}</select>
    </div>
  `;
}

function taskRow(task) {
  const overdue = isOverdue(task) || task.status === "已逾期";
  return `
    <article class="task-row ${overdue ? "overdue" : ""}">
      <div class="task-title">
        <input type="checkbox" ${task.status === "已完成" ? "checked" : ""} data-complete="${task.id}" aria-label="切换完成状态" />
        <div>
          <strong>${escapeHtml(task.title)}</strong>
          <small>${escapeHtml(task.object)} · ${escapeHtml(task.subcategory)} · 更新 ${escapeHtml(task.updatedAt)}</small>
          <div class="badge-row">
            <span class="badge ${task.priority === "高" ? "high" : task.priority === "中" ? "mid" : ""}">${task.priority}</span>
            <span class="badge">${task.source}</span>
            ${task.direction ? `<span class="badge info">${task.direction}</span>` : ""}
            ${overdue ? `<span class="badge high">逾期</span>` : ""}
          </div>
        </div>
      </div>
      <span class="badge">${task.category}</span>
      <span>${task.dueDate || "无截止"}</span>
      <div class="mini-actions">
        <button title="编辑" data-edit="${task.id}">✎</button>
        <button title="归档" data-archive="${task.id}">✓</button>
        <button title="删除" data-delete="${task.id}">×</button>
      </div>
    </article>
  `;
}

function renderIntake() {
  const preview = classifyText(state.intakeText || "");
  return `
    <section class="grid">
      <div class="panel">
        <div class="panel-head"><h3>文本识别入口</h3><span class="badge private">需人工确认</span></div>
        <div class="panel-body source-box">
          <textarea class="textarea" data-intake placeholder="粘贴聊天记录、邮件正文或 OCR 文本">${escapeHtml(state.intakeText)}</textarea>
          <div class="toolbar">
            <button class="btn" data-action="simulate-ocr">模拟图片 OCR</button>
            <button class="btn" data-action="simulate-email">模拟邮件读取</button>
            <button class="btn primary" data-action="confirm-intake">确认生成任务</button>
          </div>
          <div class="classification-preview">
            <div><b>分类：</b>${preview.category} / ${preview.subcategory}</div>
            <div><b>对象：</b>${preview.object}　<b>交易方向：</b>${preview.direction || "待确认"}　<b>截止：</b>${preview.dueDate}</div>
            <div><b>提醒：</b>${preview.reminder}　<b>状态：</b>${preview.status}　<b>隐私：</b>证件、地址、资金来源材料高隐私</div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>自动分类规则</h3></div>
        <div class="panel-body detail-list">
          <div><b>客户材料：</b>护照、photo ID、地址证明、资金来源。</div>
          <div><b>业务机会：</b>KYC/KYB、合规、付款人、收款人、交易方向。</div>
          <div><b>文件合同：</b>表格、合同、填写、签署、老板私人表格。</div>
          <div><b>采购行政：</b>采购、报价、商品、供应商、Amazon、淘宝。</div>
          <div><b>市场活动：</b>市场营销、活动、campaign、event。</div>
        </div>
      </div>
    </section>
  `;
}

function renderClients() {
  return `
    <section class="panel">
      <div class="panel-head"><h3>客户材料收集</h3><div class="tabs">${directions.map((dir) => `<button class="tab ${state.direction === dir ? "active" : ""}" data-dir="${dir}">${dir}</button>`).join("")}</div></div>
      <div class="panel-body module-grid">
        ${state.clients
          .map((client, index) => ({ ...client, index }))
          .filter((client) => state.direction === "全部" || client.direction === state.direction)
          .map((client) => {
            const pct = Math.round((client.collected.length / client.required.length) * 100);
            const missing = client.required.filter((item) => !client.collected.includes(item));
            return `
              <article class="client-card">
                <div class="card-head">
                  <h4>${escapeHtml(client.name)}</h4>
                  <div class="mini-actions">
                    <button title="编辑客户材料" data-client-edit="${client.index}">✎</button>
                    <button title="删除客户材料" data-client-delete="${client.index}">×</button>
                  </div>
                </div>
                <div class="badge-row"><span class="badge info">${client.type}</span><span class="badge">${client.direction}</span>${client.overdue.length ? `<span class="badge high">${client.overdue.length} 项逾期</span>` : `<span class="badge ok">无逾期</span>`}</div>
                <div class="progress"><span style="width:${pct}%"></span></div>
                <div class="detail-list">
                  <div><b>完成率：</b>${client.collected.length}/${client.required.length} (${pct}%)</div>
                  <div><b>已收集：</b>${client.collected.join("、")}</div>
                  <div><b>未收集：</b>${missing.join("、") || "已齐全"}</div>
                  <div><b>最近更新：</b>${client.updatedAt}</div>
                  <div><b>备注：</b>${client.note}</div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderBusiness() {
  const business = state.tasks.filter((task) => task.category === "业务端");
  return `
    <section class="panel">
      <div class="panel-head"><h3>业务机会与合规进度</h3><span class="badge info">支持多进度标签并存</span></div>
      <div class="panel-body module-grid">
        ${business.map(
          (task) => `
          <article class="opportunity-card">
            <div class="card-head">
              <h4>${escapeHtml(task.object)}</h4>
              <div class="mini-actions">
                <button title="编辑业务机会" data-edit="${task.id}">✎</button>
                <button title="删除业务机会" data-delete="${task.id}">×</button>
              </div>
            </div>
            <div class="badge-row"><span class="badge">${task.clientType}</span><span class="badge info">${task.direction || "无交易方向"}</span><span class="badge ${isOverdue(task) ? "high" : "mid"}">${task.reminder}</span></div>
            <div class="detail-list">
              <div><b>任务：</b>${task.title}</div>
              <div><b>操作截止：</b>${task.dueDate}　<b>跟进：</b>${task.followDate}</div>
              <div><b>当前进度：</b>${task.progressTags.length ? task.progressTags.join("、") : "待选择"}</div>
              <div><b>备注：</b>${task.notes}</div>
            </div>
          </article>`
        ).join("")}
      </div>
    </section>
  `;
}

function renderDocs() {
  const docs = state.tasks.filter((task) => ["文件/合同", "行政类", "市场营销", "活动追踪"].includes(task.category));
  return `
    <section class="panel">
      <div class="panel-head"><h3>文件、合同、市场与活动</h3><span class="badge">二期模块预留完整字段</span></div>
      <div class="panel-body">
        <div class="task-list">${docs.map(taskRow).join("") || `<div class="empty">暂无文件/行政类任务</div>`}</div>
      </div>
    </section>
  `;
}

function renderPurchase() {
  const purchase = state.purchase;
  const quote = `您好，\n\n我们计划采购 ${purchase.keyword}，数量 ${purchase.quantity}，预算 ${purchase.budget}。希望了解含 GST 报价、配送费用、预计到货时间以及保修/退换政策。\n\n请提供可选型号和正式报价。谢谢。\n\n注：此为系统生成草稿，发送前需要人工确认。`;
  return `
    <section class="purchase-layout">
      <div class="panel">
        <div class="panel-head">
          <h3>采购需求</h3>
          <div class="toolbar compact-toolbar">
            <span class="badge private">不自动下单</span>
            <button class="btn ghost" data-action="edit-purchase">编辑需求</button>
          </div>
        </div>
        <div class="panel-body detail-list">
          <div><b>关键词：</b>${purchase.keyword}</div>
          <div><b>预算：</b>${purchase.budget}</div>
          <div><b>地区：</b>${purchase.region}</div>
          <div><b>数量：</b>${purchase.quantity}</div>
          <div><b>要求：</b>${purchase.requirements}</div>
          <div><b>采集：</b>${purchase.searchedAt} · ${purchase.status}</div>
          <div class="quote">${quote}</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>商品比较</h3><span class="badge info">示例结果，可替换实时搜索源</span></div>
        <div class="panel-body module-grid">
          ${purchase.products.map(
            (product, index) => `
              <article class="product-card">
                <div class="card-head">
                  <h4>${escapeHtml(product.title)}</h4>
                  <div class="mini-actions">
                    <button title="编辑商品" data-product-edit="${index}">✎</button>
                    <button title="删除商品" data-product-delete="${index}">×</button>
                  </div>
                </div>
                <div class="badge-row"><span class="badge">${product.source}</span><span class="badge ok">可靠性 ${product.reliability}</span></div>
                <div class="detail-list">
                  <div><b>标价：</b>${product.price}　<b>GST：</b>${product.gst}</div>
                  <div><b>配送：</b>${product.shipping}　<b>预计：</b>${product.eta}</div>
                  <div><b>评分：</b>${product.rating}　<b>落地成本：</b>${product.landed}</div>
                  <div><a href="${product.link}" target="_blank" rel="noreferrer">查看原始来源</a></div>
                </div>
              </article>`
          ).join("") || `<div class="empty">暂无商品比较</div>`}
        </div>
      </div>
    </section>
  `;
}

function renderHistory() {
  return `
    <section class="panel">
      <div class="panel-head"><h3>按周归档</h3><button class="btn warn" data-action="archive-done">归档已完成</button></div>
      <div class="panel-body module-grid">
        ${state.history.map(
          (week, index) => `
          <article class="history-card">
            <div class="card-head">
              <h4>${escapeHtml(week.week)}</h4>
              <div class="mini-actions">
                <button title="编辑历史归档" data-history-edit="${index}">✎</button>
                <button title="删除历史归档" data-history-delete="${index}">×</button>
              </div>
            </div>
            <div class="detail-list">
              <div><b>任务总数：</b>${week.total}</div>
              <div><b>已完成：</b>${week.done}</div>
              <div><b>未完成：</b>${week.open}</div>
              <div><b>逾期：</b>${week.overdue}</div>
            </div>
          </article>`
        ).join("")}
      </div>
    </section>
  `;
}

function renderModal() {
  const task = state.taskDraft;
  if (!task) return `<div class="modal-backdrop"></div>`;
  return `
    <div class="modal-backdrop show">
      <div class="modal">
        <div class="panel-head"><h3>${task.id && state.tasks.some((item) => item.id === task.id) ? "编辑任务" : "新增任务"}</h3><button class="btn ghost" data-action="close-modal">关闭</button></div>
        <div class="panel-body">
          <form class="form-grid" data-form>
            ${input("title", "任务标题", task.title)}
            ${input("object", "客户名称/对象", task.object)}
            ${select("category", "任务分类", ["业务端", "文件/合同", "行政类", "采购", "市场营销", "活动追踪"], task.category)}
            ${input("subcategory", "二级分类", task.subcategory)}
            ${select("clientType", "客户类型", ["待确认", "个人客户", "公司客户", "内部", "客户活动"], task.clientType)}
            ${select("direction", "交易方向", ["", ...directions], task.direction)}
            ${input("dueDate", "截止日期", task.dueDate, "date")}
            ${input("followDate", "跟进日期", task.followDate, "date")}
            ${select("reminder", "提醒规则", ["当日提醒", "当周提醒", "提前 1 周提醒", "指定日期提醒", "逾期提醒"], task.reminder)}
            ${select("status", "当前状态", statuses, task.status)}
            ${select("priority", "优先级", priorities, task.priority)}
            ${select("source", "来源", ["手动输入", "文字识别", "图片识别", "邮件读取", "采购实时搜索", "历史任务记录"], task.source)}
            <label class="wide">备注<textarea class="textarea" name="notes">${escapeHtml(task.notes || "")}</textarea></label>
            <div class="toolbar wide">
              <button class="btn primary" type="submit">保存任务</button>
              <button class="btn ghost" type="button" data-action="close-modal">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function input(name, labelText, value, type = "text") {
  return `<label>${labelText}<input class="field" name="${name}" type="${type}" value="${escapeHtml(value || "")}" /></label>`;
}

function select(name, labelText, items, value) {
  return `<label>${labelText}<select class="field" name="${name}">${items.map((item) => option(item, value)).join("")}</select></label>`;
}

function option(item, value) {
  return `<option value="${escapeHtml(item)}" ${item === value ? "selected" : ""}>${item || "无"}</option>`;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      render();
    })
  );
  document.querySelectorAll("[data-filter]").forEach((field) =>
    field.addEventListener("input", () => {
      state[field.dataset.filter] = field.value;
      render();
    })
  );
  document.querySelectorAll("[data-dir]").forEach((button) =>
    button.addEventListener("click", () => {
      state.direction = state.direction === button.dataset.dir ? "全部" : button.dataset.dir;
      render();
    })
  );
  document.querySelector("[data-intake]")?.addEventListener("input", (event) => {
    state.intakeText = event.target.value;
    saveState();
  });
  document.querySelector("[data-intake]")?.addEventListener("blur", () => {
    render();
  });
  document.querySelector("[data-weekly-ai-text]")?.addEventListener("input", (event) => {
    state.weeklyAiText = event.target.value;
    state.aiStatus = "已输入，等待 AI 识别";
    saveState();
  });
  document.querySelector("[data-weekly-ai-text]")?.addEventListener("blur", () => {
    render();
  });
  document.querySelector("[data-weekly-ai-image]")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    state.weeklyAiImageName = file ? file.name : "";
    state.aiStatus = file ? "图片已选择，等待 AI 识别" : "";
    if (!file) {
      weeklyAiImageDataUrl = "";
      saveState();
      render();
      return;
    }
    readFileAsDataUrl(file).then((dataUrl) => {
      weeklyAiImageDataUrl = dataUrl;
      saveState();
      render();
    });
  });
  document.querySelector("[data-email-text]")?.addEventListener("input", (event) => {
    state.emailDraftText = event.target.value;
    saveState();
  });
  document.querySelector("[data-email-text]")?.addEventListener("blur", () => {
    render();
  });
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action)));
  document.querySelectorAll("[data-edit]").forEach((button) =>
    button.addEventListener("click", () => {
      state.taskDraft = structuredClone(state.tasks.find((task) => task.id === button.dataset.edit));
      render();
    })
  );
  document.querySelectorAll("[data-delete]").forEach((button) =>
    button.addEventListener("click", () => {
      state.tasks = state.tasks.filter((task) => task.id !== button.dataset.delete);
      saveState();
      render();
    })
  );
  document.querySelectorAll("[data-client-edit]").forEach((button) =>
    button.addEventListener("click", () => editClient(Number(button.dataset.clientEdit)))
  );
  document.querySelectorAll("[data-client-delete]").forEach((button) =>
    button.addEventListener("click", () => {
      state.clients.splice(Number(button.dataset.clientDelete), 1);
      saveState();
      render();
    })
  );
  document.querySelectorAll("[data-history-edit]").forEach((button) =>
    button.addEventListener("click", () => editHistory(Number(button.dataset.historyEdit)))
  );
  document.querySelectorAll("[data-history-delete]").forEach((button) =>
    button.addEventListener("click", () => {
      state.history.splice(Number(button.dataset.historyDelete), 1);
      saveState();
      render();
    })
  );
  document.querySelectorAll("[data-product-edit]").forEach((button) =>
    button.addEventListener("click", () => editProduct(Number(button.dataset.productEdit)))
  );
  document.querySelectorAll("[data-product-delete]").forEach((button) =>
    button.addEventListener("click", () => {
      state.purchase.products.splice(Number(button.dataset.productDelete), 1);
      saveState();
      render();
    })
  );
  document.querySelectorAll("[data-archive]").forEach((button) =>
    button.addEventListener("click", () => archiveTask(button.dataset.archive))
  );
  document.querySelectorAll("[data-complete]").forEach((box) =>
    box.addEventListener("change", () => {
      const task = state.tasks.find((item) => item.id === box.dataset.complete);
      task.status = box.checked ? "已完成" : "进行中";
      task.updatedAt = nowStamp();
      saveState();
      render();
    })
  );
  document.querySelector("[data-form]")?.addEventListener("submit", saveTaskForm);
}

async function handleAction(action) {
  if (action === "new") {
    state.taskDraft = {
      id: crypto.randomUUID(),
      title: "",
      category: "业务端",
      subcategory: "客户材料收集",
      object: "",
      clientType: "待确认",
      direction: "",
      dueDate: today,
      followDate: today,
      reminder: "当周提醒",
      status: "未开始",
      priority: "中",
      source: "手动输入",
      sourceLink: "",
      owner: "本人",
      updatedAt: nowStamp(),
      notes: "",
      progressTags: [],
      materials: [],
    };
  }
  if (action === "close-modal") state.taskDraft = null;
  if (action === "edit-purchase") {
    editPurchase();
    return;
  }
  if (action === "reset") {
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(seedState);
  }
  if (action === "confirm-intake") {
    state.tasks.unshift(classifyText(state.intakeText));
    state.view = "weekly";
  }
  if (action === "add-weekly-ai-task") {
    const source = state.weeklyAiImageName ? "图片识别" : "文字识别";
    const text = state.weeklyAiImageName
      ? `${state.weeklyAiText}\n图片 OCR：从 ${state.weeklyAiImageName} 中识别待办、日期、客户名称和文件事项。`
      : state.weeklyAiText;
    state.aiStatus = "AI 识别中...";
    saveState();
    render();
    try {
      const task = await classifyWithAi({ text, imageDataUrl: weeklyAiImageDataUrl, source });
      state.tasks.unshift(task);
      state.weeklyAiText = "";
      state.weeklyAiImageName = "";
      weeklyAiImageDataUrl = "";
      state.aiStatus = "已加入本周待办";
    } catch (error) {
      state.aiStatus = `AI 识别失败：${error.message}`;
    }
  }
  if (action === "connect-gmail") {
    location.href = "./auth/google";
    return;
  }
  if (action === "connect-outlook") {
    location.href = "./auth/microsoft";
    return;
  }
  if (action === "check-email-status") {
    state.emailStatus = "正在检查邮箱连接...";
    saveState();
    render();
    try {
      const status = await fetchEmailStatus();
      state.emailConnected = status.connected;
      state.emailProvider = status.provider || "Gmail / Outlook";
      state.emailStatus = status.connected
        ? `已连接 ${status.provider === "google" ? "Gmail" : "Outlook"}`
        : `尚未连接。Gmail 配置：${status.configured.google ? "已配置" : "未配置"}；Outlook 配置：${status.configured.microsoft ? "已配置" : "未配置"}`;
    } catch (error) {
      state.emailStatus = `连接检查失败：${error.message}`;
    }
  }
  if (action === "sync-email") {
    state.emailStatus = "正在读取邮箱最近邮件并交给 AI 分类...";
    saveState();
    render();
    try {
      const result = await syncEmailWithAi();
      state.emailLastSync = nowStamp();
      state.emailConnected = true;
      state.emailMessages = result.messages || [];
      state.tasks.unshift(...(result.tasks || []));
      state.emailStatus = `已读取 ${state.emailMessages.length} 封邮件，并生成 ${(result.tasks || []).length} 条待确认任务`;
      state.view = "weekly";
    } catch (error) {
      state.emailStatus = `邮箱读取失败：${error.message}`;
    }
  }
  if (action === "simulate-ocr") {
    state.intakeText = "图片 OCR：活动海报显示 2026-08-12 举办客户沙龙，需要本周确认嘉宾邀请、海报文案和报名表。";
  }
  if (action === "simulate-email") {
    state.intakeText = "邮件读取：供应商报价碎纸机，预算 AUD 500，需要 2026-08-05 前确认采购数量、配送时间和是否含 GST，不自动发送回复。";
  }
  if (action === "archive-done") {
    const doneCount = state.tasks.filter((task) => task.status === "已完成").length;
    state.history.unshift({ week: "2026-W31", total: state.tasks.length, done: doneCount, open: state.tasks.length - doneCount, overdue: state.tasks.filter(isOverdue).length });
    state.tasks = state.tasks.filter((task) => task.status !== "已完成");
  }
  saveState();
  render();
}

async function classifyWithAi(payload) {
  const response = await fetch("./api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "无法连接 AI 后端，请确认使用 npm start 启动，并设置 OPENAI_API_KEY。");
  }
  return result.task;
}

async function fetchEmailStatus() {
  const response = await fetch("./api/email/status");
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "无法检查邮箱连接");
  return result;
}

async function syncEmailWithAi() {
  const response = await fetch("./api/email/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 5 }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (state.emailDraftText) {
      const task = await classifyWithAi({ text: `邮件读取：${state.emailDraftText}`, source: "邮件读取" });
      return { messages: [{ subject: "手动粘贴邮件内容", from: "本地输入", date: nowStamp(), preview: state.emailDraftText }], tasks: [task] };
    }
    throw new Error(result.error || "无法读取邮箱，请先完成 Gmail/Outlook 授权。");
  }
  return result;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function saveTaskForm(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  const task = { ...state.taskDraft, ...data, updatedAt: nowStamp() };
  const index = state.tasks.findIndex((item) => item.id === task.id);
  if (index >= 0) state.tasks[index] = task;
  else state.tasks.unshift(task);
  state.taskDraft = null;
  saveState();
  render();
}

function archiveTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (task) task.status = "已完成";
  saveState();
  render();
}

function editClient(index) {
  const client = state.clients[index];
  if (!client) return;
  const nextName = prompt("客户名称", client.name);
  if (nextName === null) return;
  const nextType = prompt("客户类型", client.type);
  if (nextType === null) return;
  const nextDirection = prompt("交易方向", client.direction);
  if (nextDirection === null) return;
  const nextCollected = prompt("已收集材料，用顿号或逗号分隔", client.collected.join("、"));
  if (nextCollected === null) return;
  const nextRequired = prompt("所需材料，用顿号或逗号分隔", client.required.join("、"));
  if (nextRequired === null) return;
  const nextOverdue = prompt("逾期/缺失材料，用顿号或逗号分隔", client.overdue.join("、"));
  if (nextOverdue === null) return;
  const nextNote = prompt("备注", client.note);
  if (nextNote === null) return;

  state.clients[index] = {
    ...client,
    name: nextName.trim() || client.name,
    type: nextType.trim() || client.type,
    direction: nextDirection.trim(),
    collected: splitList(nextCollected),
    required: splitList(nextRequired),
    overdue: splitList(nextOverdue),
    updatedAt: nowStamp(),
    note: nextNote.trim(),
  };
  saveState();
  render();
}

function editHistory(index) {
  const week = state.history[index];
  if (!week) return;
  const nextWeek = prompt("归档周", week.week);
  if (nextWeek === null) return;
  const nextTotal = prompt("任务总数", week.total);
  if (nextTotal === null) return;
  const nextDone = prompt("已完成", week.done);
  if (nextDone === null) return;
  const nextOpen = prompt("未完成", week.open);
  if (nextOpen === null) return;
  const nextOverdue = prompt("逾期", week.overdue);
  if (nextOverdue === null) return;

  state.history[index] = {
    week: nextWeek.trim() || week.week,
    total: Number(nextTotal) || 0,
    done: Number(nextDone) || 0,
    open: Number(nextOpen) || 0,
    overdue: Number(nextOverdue) || 0,
  };
  saveState();
  render();
}

function editPurchase() {
  const purchase = state.purchase;
  const keyword = prompt("采购关键词", purchase.keyword);
  if (keyword === null) return;
  const budget = prompt("预算", purchase.budget);
  if (budget === null) return;
  const region = prompt("地区/平台", purchase.region);
  if (region === null) return;
  const quantity = prompt("数量", purchase.quantity);
  if (quantity === null) return;
  const requirements = prompt("采购要求", purchase.requirements);
  if (requirements === null) return;

  state.purchase = {
    ...purchase,
    keyword: keyword.trim() || purchase.keyword,
    budget: budget.trim() || purchase.budget,
    region: region.trim(),
    quantity: Number(quantity) || 1,
    requirements: requirements.trim(),
    searchedAt: nowStamp(),
  };
  saveState();
  render();
}

function editProduct(index) {
  const product = state.purchase.products[index];
  if (!product) return;
  const title = prompt("商品名称", product.title);
  if (title === null) return;
  const source = prompt("来源平台", product.source);
  if (source === null) return;
  const price = prompt("标价", product.price);
  if (price === null) return;
  const gst = prompt("GST", product.gst);
  if (gst === null) return;
  const shipping = prompt("配送费用", product.shipping);
  if (shipping === null) return;
  const eta = prompt("预计到货", product.eta);
  if (eta === null) return;
  const rating = prompt("评分", product.rating);
  if (rating === null) return;
  const landed = prompt("落地成本", product.landed);
  if (landed === null) return;
  const reliability = prompt("可靠性", product.reliability);
  if (reliability === null) return;
  const link = prompt("商品详情页链接", product.link);
  if (link === null) return;

  state.purchase.products[index] = {
    title: title.trim() || product.title,
    source: source.trim() || product.source,
    price: price.trim() || product.price,
    gst: gst.trim() || product.gst,
    shipping: shipping.trim() || product.shipping,
    eta: eta.trim() || product.eta,
    rating: rating.trim() || product.rating,
    landed: landed.trim() || product.landed,
    reliability: reliability.trim() || product.reliability,
    link: link.trim() || product.link,
  };
  saveState();
  render();
}

function splitList(value) {
  return String(value || "")
    .split(/[、,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

render();
