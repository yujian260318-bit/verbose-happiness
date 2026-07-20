/* ============================================================
   李欣怡作品集 · 交互逻辑（全量可编辑版）
   - 内容全部来自 content.json（texts / works / overlays）
   - 作品卡支持多条视频，模态框内可切换
   - 编辑模式：所有文字内联可改，可加图片/视频/文本覆盖层
   - 保存：写回 GitHub（需 token）或下载 content.json 手动提交
   ============================================================ */

/* ---------- 兜底默认作品（content.json 加载失败时使用） ---------- */
const DEFAULT_WORKS = [
  {
    id: "zhupassword", title: "《主厨密码》短视频纪实栏目", category: "栏目纪实", type: "视频",
    company: "欣和企业 · 市场运营中心", period: "2025.10 – 2026.01",
    role: "编导实习生：参与栏目全链路制作，独立完成素材筛选与精剪，统一视觉风格。",
    cover: "linear-gradient(135deg, #ff6b5b, #ff9a76)", videoUrls: [],
    metrics: [{ label: "成片", value: "3 正片 + 3 预告" }, { label: "分发", value: "公众号 + 爱奇艺" }],
    description: "参与短视频纪实栏目《主厨密码》从选题策划、脚本构思、现场勘景拍摄到后期剪辑包装的全链路内容制作，把控栏目整体内容调性；成片发布于企业公众号并登陆爱奇艺平台。",
    content: "", links: [{ platform: "爱奇艺", url: "" }]
  },
  {
    id: "yujian", title: "《玉见》访谈栏目", category: "栏目纪实", type: "视频",
    company: "蓝色光标 · 《玉见》导演组", period: "2026.03 – 2026.05",
    role: "导演组实习生：嘉宾内容策划、现场拍摄统筹、多版本视频剪辑。",
    cover: "linear-gradient(135deg, #2d6cdf, #5b8def)", videoUrls: [],
    metrics: [{ label: "播出", value: "卫视版登陆海南卫视" }],
    description: "梳理嘉宾人物背景与故事脉络，参与访谈逻辑提纲设计，独立撰写拍摄脚本框架；统筹对接嘉宾、摄影及现场执行团队；独立完成多版本视频（含卫视版）粗剪与精剪，其中卫视版在海南卫视播出。",
    content: "", links: []
  },
  {
    id: "ai-next", title: "AI Next 疯享会（活动拍摄 + 传播）", category: "活动拍摄", type: "视频",
    company: "腾讯 CDG · 青腾", period: "2026.05 – 至今",
    role: "内容运营实习生：现场拍摄、多平台剪辑、KOC 拓展、社媒内容支持。",
    cover: "linear-gradient(135deg, #7b5bff, #b18bff)", videoUrls: [],
    metrics: [{ label: "触达", value: "10,000+" }, { label: "每场报名", value: "约 10 人（线上）" }, { label: "涨粉", value: "800+" }],
    description: "完成 AI Next 疯享会线下活动全程现场拍摄；线上筛选并对接活动相关 KOC，累计触达 10,000+ 人，额外带动每场约 10 人经线上渠道自主报名；为小红书 / 即刻账号提供剪辑与文案，支撑冷启动涨粉 800+。",
    content: "", links: [{ platform: "小红书", url: "" }, { platform: "即刻", url: "" }]
  },
  {
    id: "social", title: "小红书 / 即刻 社媒内容", category: "社媒内容", type: "视频",
    company: "腾讯 CDG · 青腾", period: "2026.05 – 至今",
    role: "活动社媒内容支持：负责短视频剪辑与种草文案产出，支撑账号冷启动。",
    cover: "linear-gradient(135deg, #ff4d7e, #ff8aa8)", videoUrls: [],
    metrics: [{ label: "涨粉", value: "800+" }, { label: "关注者", value: "含大几千至万粉量级用户" }],
    description: "负责小红书、即刻双平台活动账号的短视频剪辑与种草文案产出，支撑账号从 0 到 1 冷启动；相关内容发布后账号累计涨粉 800+，吸引含大几千至万粉量级的行业用户关注。",
    content: "", links: [{ platform: "小红书", url: "" }, { platform: "即刻", url: "" }]
  },
  {
    id: "ad-award", title: "大广赛品牌广告短片", category: "广告片", type: "视频",
    company: "全国大学生广告艺术大赛", period: "2024 – 2025",
    role: "创作核心成员：主导脚本撰写、现场拍摄、后期全片剪辑。",
    cover: "linear-gradient(135deg, #1d1d1f, #4a4a52)", videoUrls: [],
    metrics: [{ label: "奖项", value: "北京赛区三等奖" }, { label: "时长", value: "约 60s" }],
    description: "作为创作核心成员，主导 1 支品牌广告短片从创意策划、脚本撰写、现场拍摄到后期剪辑的全流程；统筹学生摄制组完成场地勘景、演员调度与分镜设计；运用 PR / 剪映完成节奏剪辑与视觉包装，最终获大广赛北京赛区三等奖。",
    content: "", links: []
  }
];

/* 作品类型与栏目配色 */
const WORK_TYPES = ["视频", "策划", "文案", "图文", "其他"];
const COVER_PALETTE = {
  "栏目纪实": "linear-gradient(135deg, #ff6b5b, #ff9a76)",
  "活动拍摄": "linear-gradient(135deg, #7b5bff, #b18bff)",
  "社媒内容": "linear-gradient(135deg, #ff4d7e, #ff8aa8)",
  "广告片": "linear-gradient(135deg, #1d1d1f, #4a4a52)"
};
function pickCover(category) { return COVER_PALETTE[category] || "linear-gradient(135deg, #ff6b5b, #ff9a76)"; }

/* ---------- 全局状态 ---------- */
const SITE_CONFIG = window.SITE_CONFIG || {};
let texts = {};
let works = [];
let categories = [];
let overlays = [];
let editing = false;
let currentFilter = "all";

const grid = document.getElementById("works-grid");
const overlayLayer = document.getElementById("overlay-layer");
const editorBar = document.getElementById("editor-bar");
const imgInput = document.getElementById("img-input");
const editorStatus = document.getElementById("editor-status");

/* ============================================================
   加载与渲染
   ============================================================ */
async function loadContent() {
  try {
    const path = (SITE_CONFIG.github && SITE_CONFIG.github.contentPath) || "content.json";
    const res = await fetch(path, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      texts = (data.texts && typeof data.texts === "object") ? data.texts : {};
      if (Array.isArray(data.works)) works = data.works;
      if (Array.isArray(data.categories) && data.categories.length) categories = data.categories;
      overlays = Array.isArray(data.overlays) ? data.overlays : [];
    }
  } catch (e) { /* 用兜底数据 */ }
  if (!works.length) works = DEFAULT_WORKS.map((x) => ({ ...x }));
  if (!categories.length) categories = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
  works.forEach((w) => {
    if (!Array.isArray(w.videoUrls)) w.videoUrls = [];
    if (!w.type) w.type = "视频";
    if (typeof w.content !== "string") w.content = "";
    if (!w.cover) w.cover = pickCover(w.category);
    // 重新判定视频类型：早期存成 iframe 的爱奇艺/腾讯普通页会被重新归类为 link
    w.videoUrls.forEach((v) => { v.type = detectVideo(v.url); });
  });
  renderFilters();
  renderOverlays();
}

function applyTexts() {
  Object.keys(texts).forEach((key) => {
    const el = document.querySelector(`[data-edit="${key}"]`);
    if (el && !el.closest("#works-grid")) el.innerHTML = texts[key];
  });
}

function paint() {
  const list = currentFilter === "all" ? works : works.filter((w) => w.category === currentFilter);
  renderCards(list);
}

/* ---------- 栏目筛选（动态渲染，可编辑） ---------- */
function renderFilters() {
  if (currentFilter !== "all" && !categories.includes(currentFilter)) currentFilter = "all";
  filters.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "filter" + (currentFilter === "all" ? " is-active" : "");
  allBtn.dataset.filter = "all";
  allBtn.textContent = "全部";
  filters.appendChild(allBtn);
  categories.forEach((c) => {
    const b = document.createElement("button");
    b.className = "filter" + (currentFilter === c ? " is-active" : "");
    b.dataset.filter = c;
    b.textContent = c;
    filters.appendChild(b);
  });
}

/* ---------- 作品卡 ---------- */
function renderCards(list) {
  grid.innerHTML = "";
  list.forEach((w) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    const metricsHtml = w.metrics.map((m, i) =>
      `<span class="tag"${editing ? ` data-edit="metric-${w.id}-${i}"` : ""}>${m.value}</span>`
    ).join("");
    card.innerHTML = `
      <div class="card__cover" style="background:${w.cover}">
        <span class="card__type">${w.type}</span>
        ${w.title}
      </div>
      <div class="card__body">
        <span class="card__cat"${editing ? ` data-edit="cat-${w.id}"` : ""}>${w.category}</span>
        <h3 class="card__title"${editing ? ` data-edit="title-${w.id}"` : ""}>${w.title}</h3>
        <p class="card__role"><span${editing ? ` data-edit="company-${w.id}"` : ""}>${w.company}</span> · <span${editing ? ` data-edit="period-${w.id}"` : ""}>${w.period}</span></p>
        <p class="card__role card__role2"${editing ? ` data-edit="role-${w.id}"` : ""}>${w.role}</p>
        <div class="card__metrics">${metricsHtml}</div>
        ${editing ? `<div class="card__editrow"><button type="button" class="card__vm" data-vm="${w.id}">🎬 视频（${w.videoUrls.length}）</button><button type="button" class="card__wm" data-wm="${w.id}">✎ 详情</button></div>` : ""}
      </div>`;
    if (editing) {
      bindWorkEdit(card, w);
    } else {
      card.addEventListener("click", () => openModal(w));
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") openModal(w); });
    }
    grid.appendChild(card);
  });
}

function bindWorkEdit(card, w) {
  card.querySelectorAll("[data-edit]").forEach((el) => {
    el.setAttribute("contenteditable", "true");
    const key = el.dataset.edit;
    el.addEventListener("input", () => {
      if (key.startsWith("metric-")) {
        const i = parseInt(key.split("-").pop(), 10);
        if (w.metrics[i]) w.metrics[i].value = el.innerHTML;
      } else if (key.startsWith("cat-")) w.category = el.innerHTML;
      else if (key.startsWith("title-")) w.title = el.innerHTML;
      else if (key.startsWith("company-")) w.company = el.innerHTML;
      else if (key.startsWith("period-")) w.period = el.innerHTML;
      else if (key.startsWith("role-")) w.role = el.innerHTML;
    });
  });
  const vmBtn = card.querySelector(".card__vm");
  if (vmBtn) vmBtn.addEventListener("click", (e) => { e.stopPropagation(); openVideoManager(w); });
  const wmBtn = card.querySelector(".card__wm");
  if (wmBtn) wmBtn.addEventListener("click", (e) => { e.stopPropagation(); openWorkModal(w); });
}

/* ---------- 分类筛选 ---------- */
const filters = document.getElementById("filters");
filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  filters.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  currentFilter = btn.dataset.filter;
  paint();
});

/* ---------- 作品详情模态框（支持多条视频切换） ---------- */
const modal = document.getElementById("modal");
const modalMedia = document.getElementById("modal-media");

function renderVideo(v) {
  if (!v || !v.url) return "";
  if (v.type === "mp4") {
    return `<video src="${v.url}" controls preload="none" playsinline></video>`;
  }
  if (v.type === "iframe") {
    return `<iframe src="${v.url}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  // link：普通平台详情页（爱奇艺、腾讯视频、公众号等），不内嵌，改跳转卡片
  let label = "前往观看";
  try {
    const host = new URL(v.url).hostname.replace(/^www\./, "");
    if (host.includes("iqiyi")) label = "前往爱奇艺观看";
    else if (host.includes("qq.com") || host.includes("v.qq")) label = "前往腾讯视频观看";
    else if (host.includes("bilibili")) label = "前往 B 站观看";
    else if (host.includes("weixin.qq")) label = "前往公众号阅读";
    else label = `在 ${host} 观看`;
  } catch (e) {}
  return `
    <div class="modal__link-card">
      <p class="modal__link-card-title">该链接暂不支持站内直接播放</p>
      <a class="btn btn--primary modal__link-card-btn" href="${v.url}" target="_blank" rel="noopener">${label} ↗</a>
      <p class="modal__link-card-note">外链页面由对应平台提供，可能需要观看广告或登录，敬请谅解。</p>
    </div>`;
}

function openModal(w) {
  document.getElementById("modal-cat").textContent = `${w.category} · ${w.type}`;
  document.getElementById("modal-title").textContent = w.title;
  document.getElementById("modal-meta").textContent = `${w.company} · ${w.period}`;
  document.getElementById("modal-role").textContent = w.role;
  document.getElementById("modal-metrics").innerHTML =
    w.metrics.map((m) => `<span class="tag">${m.label}：${m.value}</span>`).join("");
  document.getElementById("modal-desc").textContent = w.description;

  // 策划 / 文案类作品：渲染正文
  const docEl = document.getElementById("modal-content");
  if (w.content && w.content.trim()) {
    docEl.hidden = false;
    docEl.innerHTML = "";
    const h = document.createElement("h4");
    h.className = "modal__doc-title";
    h.textContent = (w.type === "文案" ? "文案正文" : w.type === "图文" ? "图文内容" : "策划正文");
    const body = document.createElement("div");
    body.className = "modal__doc-body";
    body.textContent = w.content;
    docEl.appendChild(h);
    docEl.appendChild(body);
  } else {
    docEl.hidden = true;
    docEl.innerHTML = "";
  }

  document.getElementById("modal-links").innerHTML = w.links && w.links.length
    ? w.links.map((l) => `<a class="tag" href="${l.url || "#"}" target="_blank" rel="noopener">${l.platform}${l.url ? " ↗" : "（待补充）"}</a>`).join("")
    : "";

  const vids = w.videoUrls || [];
  if (!vids.length) {
    modalMedia.innerHTML = `<span>▶ 视频链接待补充 —— 编辑模式下点卡片「🎬 视频」逐条添加</span>`;
  } else if (vids.length === 1) {
    modalMedia.innerHTML = renderVideo(vids[0]);
  } else {
    modalMedia.innerHTML = `<div id="vm-player">${renderVideo(vids[0])}</div>`;
    const bar = document.createElement("div");
    bar.className = "modal__vswitch";
    vids.forEach((v, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tag" + (i === 0 ? " is-active" : "");
      b.textContent = "视频 " + (i + 1);
      b.addEventListener("click", () => {
        document.getElementById("vm-player").innerHTML = renderVideo(v);
        bar.querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
        b.classList.add("is-active");
      });
      bar.appendChild(b);
    });
    modalMedia.appendChild(bar);
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalMedia.innerHTML = "";
  document.body.style.overflow = "";
}

modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeVideoManager(); } });

/* ---------- 视频管理（编辑模式，支持上传本地视频 + 多平台链接） ---------- */
let vmWork = null;
let vmList = [];
let pendingVideoFiles = [];
function detectVideo(url) {
  if (!url) return "link";
  if (url.startsWith("data:") || url.startsWith("blob:")) return "mp4";
  if (url.startsWith("assets/")) return "mp4";
  if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(url)) return "mp4";
  const lower = url.toLowerCase();
  // 仅允许真正可内嵌的 iframe URL（B站/腾讯视频/embed），普通详情页走外链卡片
  const embedHosts = [
    "player.bilibili.com",
    "v.qq.com/iframe",
    "v.qq.com/txp/iframe",
    "youtube.com/embed",
    "youtube-nocookie.com/embed",
    "open.iqiyi.com"
  ];
  if (embedHosts.some((h) => lower.includes(h.toLowerCase()))) return "iframe";
  return "link";
}
function safeShort(url) {
  if (!url) return "";
  return url.length > 60 ? url.slice(0, 40) + "…" + url.slice(-12) : url;
}
function basename(p) {
  if (!p) return "";
  return p.split("/").pop().split("\\").pop();
}
function isLocalVideo(v) {
  const u = v.url || "";
  return !!v.file || u.startsWith("blob:") || u.startsWith("assets/videos/") || u.startsWith("data:");
}
function renderVmList() {
  const box = document.getElementById("vm-list");
  box.innerHTML = "";
  if (!vmList.length) {
    box.innerHTML = `<p class="vm-empty">暂无视频。支持：① 上传本地视频（自动存为文件，站内直接播放，无广告）② 粘贴可内嵌的 iframe 链接（B站 / 腾讯 embed）③ 粘贴普通平台详情页链接，将显示为「跳转观看」卡片。</p>`;
    return;
  }
  vmList.forEach((v, i) => {
    const row = document.createElement("div");
    row.className = "vm-row";
    const local = isLocalVideo(v);
    let kind, bodyHtml;
    if (local) {
      if ((v.url || "").startsWith("data:")) {
        kind = "本地";
        bodyHtml = `<span class="vm-local">📹 内嵌视频（旧数据）</span>`;
      } else {
        kind = v.file || v.url.startsWith("blob:") ? "待上传" : "视频";
        const pathVal = v.name || v.url;
        const preview = v.url.startsWith("blob:")
          ? `<a class="vm-preview" href="${v.url}" target="_blank" rel="noopener">预览</a>` : "";
        bodyHtml = `<span class="vm-local">📹</span><input class="vm-url vm-path" type="text" value="${pathVal.replace(/"/g, "&quot;")}" placeholder="assets/videos/文件名.mp4" /><span class="vm-fname">${basename(pathVal)}</span>${preview}`;
      }
    } else {
      const t = detectVideo(v.url);
      kind = t === "mp4" ? "MP4" : t === "iframe" ? "内嵌" : "外链";
      bodyHtml = `<input class="vm-url" type="text" placeholder="mp4 / iframe embed / 平台详情页链接" value="${v.url.replace(/"/g, "&quot;")}" />`;
    }
    row.innerHTML = `
      <span class="vm-tag">${kind}</span>
      ${bodyHtml}
      <button type="button" class="vm-del" title="删除">×</button>`;
    if (local && !((v.url || "").startsWith("data:"))) {
      row.querySelector(".vm-path").addEventListener("input", (e) => {
        const val = e.target.value.trim();
        vmList[i].name = val;
        if (!vmList[i].file && !vmList[i].url.startsWith("blob:")) vmList[i].url = val;
      });
    }
    if (!local) {
      row.querySelector(".vm-url").addEventListener("input", (e) => { vmList[i].url = e.target.value.trim(); });
    }
    row.querySelector(".vm-del").addEventListener("click", () => { vmList.splice(i, 1); renderVmList(); });
    box.appendChild(row);
  });
}
function openVideoManager(w) {
  vmWork = w;
  vmList = (w.videoUrls || []).map((v) => ({ type: v.type || detectVideo(v.url), url: v.url }));
  renderVmList();
  document.getElementById("vm-modal").classList.add("is-open");
  document.getElementById("vm-modal").setAttribute("aria-hidden", "false");
}
function closeVideoManager() {
  document.getElementById("vm-modal").classList.remove("is-open");
  document.getElementById("vm-modal").setAttribute("aria-hidden", "true");
  vmWork = null;
}
function saveVideoManager() {
  if (!vmWork) return;
  vmWork.videoUrls = vmList
    .filter((v) => v.url)
    .map((v) => {
      if ((v.url || "").startsWith("data:")) return { type: "mp4", url: v.url }; // 旧内嵌数据保留
      if (v.file || v.url.startsWith("blob:") || v.url.startsWith("assets/videos/"))
        return { type: "mp4", url: v.name || v.url }; // 文件路径（可编辑重定向）
      return { type: detectVideo(v.url), url: v.url };
    });
  closeVideoManager();
  paint();
}
document.getElementById("vm-add-link").addEventListener("click", () => { vmList.push({ type: "iframe", url: "" }); renderVmList(); });
document.getElementById("vm-upload").addEventListener("click", () => document.getElementById("vm-file").click());
document.getElementById("vm-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const safe = (file.name || "video.mp4").replace(/[^\w\-.\u4e00-\u9fa5]/g, "_");
  const name = "assets/videos/" + Date.now() + "-" + safe;
  const blobUrl = URL.createObjectURL(file);
  vmList.push({ type: "mp4", url: blobUrl, name, file });
  pendingVideoFiles.push({ name, file });
  renderVmList();
  e.target.value = "";
});
document.getElementById("vm-save").addEventListener("click", saveVideoManager);
document.getElementById("vm-cancel").addEventListener("click", closeVideoManager);
document.querySelectorAll("[data-vm-close]").forEach((el) => el.addEventListener("click", closeVideoManager));

/* ---------- 作品新增 / 编辑（支持多类型：视频 / 策划 / 文案） ---------- */
let wmWork = null;
let wmLinks = [];
function renderWmLinks() {
  const box = document.getElementById("wm-links");
  box.innerHTML = "";
  if (!wmLinks.length) {
    box.innerHTML = `<p class="vm-empty">暂无外部链接，点「＋ 添加链接」添加爱奇艺 / 腾讯视频 / 公众号 等。</p>`;
    return;
  }
  wmLinks.forEach((l, i) => {
    const row = document.createElement("div");
    row.className = "wm-link-row";
    row.innerHTML = `
      <input class="wm-link-name" type="text" placeholder="平台名，如：爱奇艺" value="${(l.platform || "").replace(/"/g, "&quot;")}" />
      <input class="wm-link-url" type="text" placeholder="链接地址 https://…" value="${(l.url || "").replace(/"/g, "&quot;")}" />
      <button type="button" class="wm-link-del" title="删除">×</button>`;
    row.querySelector(".wm-link-name").addEventListener("input", (e) => { wmLinks[i].platform = e.target.value.trim(); });
    row.querySelector(".wm-link-url").addEventListener("input", (e) => { wmLinks[i].url = e.target.value.trim(); });
    row.querySelector(".wm-link-del").addEventListener("click", () => { wmLinks.splice(i, 1); renderWmLinks(); });
    box.appendChild(row);
  });
}
function parseMetrics(text) {
  return (text || "").split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
    const idx = line.indexOf("：");
    const idx2 = line.indexOf(":");
    const cut = idx >= 0 ? idx : idx2;
    if (cut > 0) return { label: line.slice(0, cut).trim(), value: line.slice(cut + 1).trim() };
    return { label: "", value: line };
  });
}
function openWorkModal(existing) {
  wmWork = existing || null;
  const catSel = document.getElementById("wm-category");
  catSel.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join("");

  const w = existing || {};
  document.getElementById("wm-title").textContent = existing ? "编辑作品" : "新增作品";
  document.getElementById("wm-title-input").value = w.title || "";
  catSel.value = w.category || (currentFilter !== "all" ? currentFilter : categories[0]);
  document.getElementById("wm-type").value = w.type || "视频";
  document.getElementById("wm-company").value = w.company || "";
  document.getElementById("wm-period").value = w.period || "";
  document.getElementById("wm-role").value = w.role || "";
  document.getElementById("wm-desc").value = w.description || "";
  document.getElementById("wm-content").value = w.content || "";
  document.getElementById("wm-metrics").value = (w.metrics || []).map((m) => `${m.label}：${m.value}`).join("\n");
  wmLinks = (w.links || []).map((l) => ({ platform: l.platform || "", url: l.url || "" }));
  renderWmLinks();
  document.getElementById("wm-delete").hidden = !existing;

  document.getElementById("wm-modal").classList.add("is-open");
  document.getElementById("wm-modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeWorkModal() {
  document.getElementById("wm-modal").classList.remove("is-open");
  document.getElementById("wm-modal").setAttribute("aria-hidden", "true");
  wmWork = null;
  document.body.style.overflow = "";
}
function saveWorkModal() {
  const title = document.getElementById("wm-title-input").value.trim();
  if (!title) { alert("请填写作品标题"); return; }
  const data = {
    title,
    category: document.getElementById("wm-category").value,
    type: document.getElementById("wm-type").value,
    company: document.getElementById("wm-company").value.trim(),
    period: document.getElementById("wm-period").value.trim(),
    role: document.getElementById("wm-role").value.trim(),
    description: document.getElementById("wm-desc").value.trim(),
    content: document.getElementById("wm-content").value,
    metrics: parseMetrics(document.getElementById("wm-metrics").value),
    links: wmLinks.filter((l) => l.platform || l.url).map((l) => ({ platform: l.platform, url: l.url }))
  };
  if (wmWork) {
    Object.assign(wmWork, data);
  } else {
    const w = Object.assign({
      id: "wk-" + Date.now(),
      cover: pickCover(data.category),
      videoUrls: [],
      links: []
    }, data);
    works.push(w);
  }
  closeWorkModal();
  paint();
}
function deleteWork() {
  if (!wmWork) return;
  if (!confirm("确定删除该作品？")) return;
  works = works.filter((x) => x.id !== wmWork.id);
  closeWorkModal();
  paint();
}
document.getElementById("wm-save").addEventListener("click", saveWorkModal);
document.getElementById("wm-cancel").addEventListener("click", closeWorkModal);
document.getElementById("wm-delete").addEventListener("click", deleteWork);
document.getElementById("wm-add-link").addEventListener("click", () => { wmLinks.push({ platform: "", url: "" }); renderWmLinks(); });
document.querySelectorAll("[data-wm-close]").forEach((el) => el.addEventListener("click", closeWorkModal));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWorkModal(); });

/* ---------- 栏目管理（添加 / 重命名 / 删除） ---------- */
function openCatModal() {
  renderCatList();
  document.getElementById("cat-new-input").value = "";
  document.getElementById("cat-modal").classList.add("is-open");
  document.getElementById("cat-modal").setAttribute("aria-hidden", "false");
}
function closeCatModal() {
  document.getElementById("cat-modal").classList.remove("is-open");
  document.getElementById("cat-modal").setAttribute("aria-hidden", "true");
}
function renderCatList() {
  const box = document.getElementById("cat-list");
  box.innerHTML = "";
  if (!categories.length) {
    box.innerHTML = `<p class="vm-empty">暂无栏目，请在下方输入名称添加。</p>`;
    return;
  }
  categories.forEach((name, i) => {
    const count = works.filter((w) => w.category === name).length;
    const row = document.createElement("div");
    row.className = "cat-row";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "cat-name";
    input.value = name;
    input.dataset.idx = i;
    input.dataset.prev = name;
    input.addEventListener("input", () => {
      const idx = parseInt(input.dataset.idx, 10);
      const prev = input.dataset.prev;
      const newv = input.value.trim();
      if (!newv || newv === prev) return;
      if (categories.includes(newv) && newv !== prev) { alert("已存在同名栏目：" + newv); input.value = prev; return; }
      categories[idx] = newv;
      works.forEach((w) => { if (w.category === prev) w.category = newv; });
      input.dataset.prev = newv;
      renderFilters();
      paint();
    });
    const del = document.createElement("button");
    del.type = "button";
    del.className = "cat-del";
    del.title = "删除栏目";
    del.textContent = "×";
    del.addEventListener("click", () => deleteCategory(name));
    const tag = document.createElement("span");
    tag.className = "cat-count";
    tag.textContent = count + " 个作品";
    row.appendChild(input);
    row.appendChild(tag);
    row.appendChild(del);
    box.appendChild(row);
  });
}
function deleteCategory(name) {
  if (!confirm(`确定删除栏目「${name}」？`)) return;
  const inCat = works.filter((w) => w.category === name);
  if (inCat.length) {
    const others = categories.filter((c) => c !== name);
    if (!others.length) {
      if (!confirm(`「${name}」下还有 ${inCat.length} 个作品，且没有其他栏目可移动。确认连同作品一起删除？`)) return;
      works = works.filter((w) => w.category !== name);
    } else {
      const target = prompt(
        `「${name}」下还有 ${inCat.length} 个作品，请输入要移动到的目标栏目名称（可选：${others.join(" / ")}）：`,
        others[0]
      );
      if (!target || !others.includes(target.trim())) { alert("未提供有效目标栏目，已取消删除。"); return; }
      inCat.forEach((w) => { w.category = target.trim(); });
    }
  }
  categories = categories.filter((c) => c !== name);
  renderCatList();
  renderFilters();
  paint();
}
document.getElementById("cat-add").addEventListener("click", () => {
  const inp = document.getElementById("cat-new-input");
  const v = (inp.value || "").trim();
  if (!v) { alert("请输入栏目名称"); return; }
  if (categories.includes(v)) { alert("已存在同名栏目：" + v); return; }
  categories.push(v);
  inp.value = "";
  renderCatList();
  renderFilters();
  paint();
});
document.getElementById("cat-new-input").addEventListener("keydown", (e) => { if (e.key === "Enter") document.getElementById("cat-add").click(); });
document.getElementById("cat-save").addEventListener("click", closeCatModal);
document.getElementById("cat-cancel").addEventListener("click", closeCatModal);
document.querySelectorAll("[data-cat-close]").forEach((el) => el.addEventListener("click", closeCatModal));

/* ============================================================
   覆盖层（编辑添加的图片 / 视频 / 文本，自由摆放）
   ============================================================ */
function sizeLayer() {
  const h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  overlayLayer.style.height = h + "px";
}
window.addEventListener("resize", sizeLayer);

function renderOverlays() {
  overlayLayer.innerHTML = "";
  overlays.forEach((o) => overlayLayer.appendChild(createOverlayEl(o)));
  sizeLayer();
}

function createOverlayEl(o) {
  const el = document.createElement("div");
  el.className = "ovl ovl--" + o.type;
  el.dataset.id = o.id;
  el.style.left = (o.x || 0) + "px";
  el.style.top = (o.y || 0) + "px";
  el.style.width = (o.w || 240) + "px";
  el.style.height = (o.h || 120) + "px";

  if (o.type === "image") {
    el.style.backgroundImage = `url("${o.src}")`;
  } else if (o.type === "video") {
    if (/\.(mp4|webm|ogg)$/i.test(o.src || "")) {
      el.innerHTML = `<video src="${o.src}" controls preload="none"></video>`;
    } else {
      el.innerHTML = `<iframe src="${o.src}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    }
  } else if (o.type === "text") {
    if (o.bg) el.style.background = o.bg;
    const t = document.createElement("div");
    t.className = "ovl__text";
    t.textContent = o.content || "双击编辑文本";
    if (editing) t.setAttribute("contenteditable", "true");
    if (o.color) t.style.color = o.color;
    if (o.fontSize) t.style.fontSize = o.fontSize + "px";
    el.appendChild(t);
  }

  if (editing) enableInteractions(el, o);
  return el;
}

function enableInteractions(el, o) {
  el.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("ovl__resize") || e.target.classList.contains("ovl__del")) return;
    selectEl(el);
    startDrag(e, el, o);
  });

  const handle = document.createElement("div");
  handle.className = "ovl__resize";
  handle.addEventListener("pointerdown", (e) => { e.stopPropagation(); startResize(e, el, o); });
  el.appendChild(handle);

  const del = document.createElement("button");
  del.className = "ovl__del";
  del.type = "button";
  del.textContent = "×";
  del.title = "删除";
  del.addEventListener("pointerdown", (e) => e.stopPropagation());
  del.addEventListener("click", (e) => { e.stopPropagation(); removeOverlay(o.id); });
  el.appendChild(del);

  if (o.type === "text") {
    const t = el.querySelector(".ovl__text");
    t.addEventListener("pointerdown", (e) => e.stopPropagation());
    t.addEventListener("blur", () => { o.content = t.textContent; });
  }
}

function selectEl(el) {
  overlayLayer.querySelectorAll(".ovl.is-selected").forEach((n) => n.classList.remove("is-selected"));
  el.classList.add("is-selected");
}
function selectById(id) {
  const el = overlayLayer.querySelector(`[data-id="${id}"]`);
  if (el) selectEl(el);
}
function startDrag(e, el, o) {
  e.preventDefault();
  const sx = e.clientX, sy = e.clientY, ox = o.x || 0, oy = o.y || 0;
  function move(ev) {
    o.x = Math.max(0, ox + (ev.clientX - sx));
    o.y = Math.max(0, oy + (ev.clientY - sy));
    el.style.left = o.x + "px";
    el.style.top = o.y + "px";
  }
  function up() { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}
function startResize(e, el, o) {
  const sx = e.clientX, sy = e.clientY, ow = o.w || 240, oh = o.h || 120;
  function move(ev) {
    o.w = Math.max(60, ow + (ev.clientX - sx));
    o.h = Math.max(40, oh + (ev.clientY - sy));
    el.style.width = o.w + "px";
    el.style.height = o.h + "px";
  }
  function up() { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); }
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", up);
}
function removeOverlay(id) {
  overlays = overlays.filter((o) => o.id !== id);
  renderOverlays();
}

/* ---------- 新增覆盖层元素 ---------- */
function newOverlay(type) {
  const y = window.scrollY + 80;
  const base = { id: "ov-" + Date.now() + "-" + Math.floor(Math.random() * 1000), type, x: 40, y: Math.round(y) };
  if (type === "image") return Object.assign(base, { w: 320, h: 200, src: "" });
  if (type === "video") return Object.assign(base, { w: 480, h: 270, src: "" });
  if (type === "text") return Object.assign(base, { w: 240, h: 80, content: "双击编辑文本", fontSize: 18, color: "#1d1d1f" });
  return base;
}
function addOverlay(type) {
  if (type === "image") { imgInput.click(); return; }
  let o;
  if (type === "video") {
    const url = prompt("粘贴视频链接（mp4 直链，或 B站 / 腾讯 embed 链接）：");
    if (!url) return;
    o = newOverlay("video"); o.src = url;
  } else if (type === "text") {
    o = newOverlay("text");
  } else return;
  overlays.push(o);
  renderOverlays();
  selectById(o.id);
}
imgInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const o = newOverlay("image");
    o.src = reader.result;
    overlays.push(o);
    renderOverlays();
    selectById(o.id);
  };
  reader.readAsDataURL(file);
  imgInput.value = "";
});

/* ============================================================
   保存
   ============================================================ */
function setStatus(msg) { if (editorStatus) editorStatus.textContent = msg; }
function downloadJson(str) {
  const blob = new Blob([str], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "content.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function downloadFile(file, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
// 将二进制文件转为 base64（分块，避免 btoa 超出参数长度限制）
function base64FromArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
async function commitBinaryFile(path, file) {
  const cfg = SITE_CONFIG.github || {};
  const token = getToken();
  const url = `${cfg.apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };
  const buf = await file.arrayBuffer();
  const b64 = base64FromArrayBuffer(buf);
  let sha = null;
  const head = await fetch(url, { headers });
  if (head.ok) sha = (await head.json()).sha;
  const body = { message: "Add media: " + path, content: b64, branch: cfg.branch };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("上传视频失败（" + res.status + "）");
}
function getToken() {
  let t = sessionStorage.getItem("gh_token");
  if (!t) {
    t = prompt("请输入 GitHub Personal Access Token（仅本会话保存在浏览器，不会写入代码）：");
    if (t) sessionStorage.setItem("gh_token", t.trim());
  }
  return t;
}
async function commitToGitHub(str) {
  const cfg = SITE_CONFIG.github || {};
  const token = getToken();
  if (!token) throw new Error("未提供 token");
  const url = `${cfg.apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.contentPath}?ref=${cfg.branch}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };

  let sha = null;
  const head = await fetch(url, { headers });
  if (head.status === 404) sha = null;
  else if (head.ok) sha = (await head.json()).sha;
  else throw new Error("读取仓库失败（" + head.status + "）");

  const body = {
    message: "Update portfolio content via site editor",
    content: btoa(unescape(encodeURIComponent(str))),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("提交失败（" + res.status + "）");
}
async function saveContent() {
  // 收集文本覆盖
  document.querySelectorAll("[data-edit]").forEach((el) => {
    if (el.closest("#works-grid")) return;
    texts[el.dataset.edit] = el.innerHTML;
  });
  // 收集文本类覆盖层
  overlays.forEach((o) => {
    if (o.type === "text") {
      const el = overlayLayer.querySelector(`[data-id="${o.id}"] .ovl__text`);
      if (el) o.content = el.textContent;
    }
  });
  const str = JSON.stringify({ texts, categories, works, overlays }, null, 2);
  const cfg = SITE_CONFIG.github || {};
  if (cfg.owner && cfg.repo) {
    try {
      setStatus("保存中…");
      for (const pv of pendingVideoFiles) {
        setStatus("上传视频：" + basename(pv.name) + " …");
        await commitBinaryFile(pv.name, pv.file);
      }
      pendingVideoFiles.length = 0;
      await commitToGitHub(str);
      setStatus("已保存到 GitHub ✓");
    } catch (err) {
      setStatus("保存失败：" + err.message + "（已下载备份）");
      downloadJson(str);
      pendingVideoFiles.forEach((pv) => downloadFile(pv.file, basename(pv.name)));
      pendingVideoFiles.length = 0;
    }
  } else {
    downloadJson(str);
    pendingVideoFiles.forEach((pv) => downloadFile(pv.file, basename(pv.name)));
    pendingVideoFiles.length = 0;
    setStatus("已下载 content.json 与视频文件，请将视频放入 assets/videos/ 并重新部署");
  }
}

/* ============================================================
   编辑模式开关
   ============================================================ */
function enableEditing() {
  editing = true;
  document.body.classList.add("is-editing");
  editorBar.hidden = false;
  // 静态文本可编辑
  document.querySelectorAll("[data-edit]").forEach((el) => {
    if (el.closest("#works-grid")) return;
    el.setAttribute("contenteditable", "true");
    const key = el.dataset.edit;
    el.addEventListener("input", () => { texts[key] = el.innerHTML; });
  });
  paint();        // 重新渲染卡片（带编辑态）
  renderOverlays();
  setStatus("编辑模式已开启 · 点文字直接改，卡片「🎬 视频」加多条");
}
function exitEdit() {
  editing = false;
  document.body.classList.remove("is-editing");
  editorBar.hidden = true;
  document.querySelectorAll("[data-edit]").forEach((el) => el.removeAttribute("contenteditable"));
  history.replaceState(null, "", location.pathname);
  paint();
  renderOverlays();
}
editorBar.addEventListener("click", (e) => {
  const add = e.target.dataset.add;
  const act = e.target.dataset.action;
  if (add === "work") openWorkModal(null);
  else if (add === "cat") openCatModal();
  else if (add) addOverlay(add);
  if (act === "save") saveContent();
  if (act === "exit") exitEdit();
});

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function tryEnterEdit() {
  (async () => {
    const pw = prompt("请输入编辑密码：");
    if (!pw) return;
    const hash = await sha256Hex(pw);
    if (hash === (SITE_CONFIG.editPasswordHash || "")) enableEditing();
    else alert("密码错误，无法进入编辑模式。");
  })();
}

// 入口 1：网址 ?edit=1
(function initEditor() {
  const key = SITE_CONFIG.editQueryKey || "edit";
  if (new URLSearchParams(location.search).get(key) === "1") tryEnterEdit();
})();
// 入口 2：右下角「站长登录」按钮
document.getElementById("login-entry").addEventListener("click", tryEnterEdit);

/* ============================================================
   滚动渐显 + 初始化
   ============================================================ */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

loadContent().then(() => {
  applyTexts();
  paint();
});
