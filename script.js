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
    id: "zhupassword", title: "《主厨密码》短视频纪实栏目", category: "纪实栏目", type: "视频",
    company: "欣和企业 · 市场运营中心", period: "2025.10 – 2026.01",
    role: "编导实习生：参与栏目全链路制作，独立完成素材筛选与精剪，统一视觉风格。",
    cover: "linear-gradient(135deg, #A9BF7D, #8DA361)", videoUrls: [],
    metrics: [{ label: "成片", value: "3 正片 + 3 预告" }, { label: "分发", value: "公众号 + 爱奇艺" }],
    description: "参与短视频纪实栏目《主厨密码》从选题策划、脚本构思、现场勘景拍摄到后期剪辑包装的全链路内容制作，把控栏目整体内容调性；成片发布于企业公众号并登陆爱奇艺平台。",
    content: "", links: [{ platform: "爱奇艺", url: "" }]
  },
  {
    id: "yujian", title: "《玉见》访谈栏目", category: "纪实栏目", type: "视频",
    company: "蓝色光标 · 《玉见》导演组", period: "2026.03 – 2026.05",
    role: "导演组实习生：嘉宾内容策划、现场拍摄统筹、多版本视频剪辑。",
    cover: "linear-gradient(135deg, #2A3654, #3E4D70)", videoUrls: [],
    metrics: [{ label: "播出", value: "卫视版登陆海南卫视" }],
    description: "梳理嘉宾人物背景与故事脉络，参与访谈逻辑提纲设计，独立撰写拍摄脚本框架；统筹对接嘉宾、摄影及现场执行团队；独立完成多版本视频（含卫视版）粗剪与精剪，其中卫视版在海南卫视播出。",
    content: "", links: []
  },
  {
    id: "ai-next", title: "AI Next 疯享会（活动拍摄 + 传播）", category: "社媒内容", type: "视频",
    company: "腾讯 CDG · 青腾", period: "2026.05 – 至今",
    role: "内容运营实习生：现场拍摄、多平台剪辑、KOC 拓展、社媒内容支持。",
    cover: "linear-gradient(135deg, #D4A574, #C47E54)", videoUrls: [],
    metrics: [{ label: "触达", value: "10,000+" }, { label: "每场报名", value: "约 10 人（线上）" }, { label: "涨粉", value: "800+" }],
    description: "完成 AI Next 疯享会线下活动全程现场拍摄；线上筛选并对接活动相关 KOC，累计触达 10,000+ 人，额外带动每场约 10 人经线上渠道自主报名；为小红书 / 即刻账号提供剪辑与文案，支撑冷启动涨粉 800+。",
    content: "", links: [{ platform: "小红书", url: "" }, { platform: "即刻", url: "" }]
  },
  {
    id: "social", title: "小红书 / 即刻 社媒内容", category: "视频号", type: "视频",
    company: "腾讯 CDG · 青腾", period: "2026.05 – 至今",
    role: "活动社媒内容支持：负责短视频剪辑与种草文案产出，支撑账号冷启动。",
    cover: "linear-gradient(135deg, #8DA361, #A9BF7D)", videoUrls: [],
    metrics: [{ label: "涨粉", value: "800+" }, { label: "关注者", value: "含大几千至万粉量级用户" }],
    description: "负责小红书、即刻双平台活动账号的短视频剪辑与种草文案产出，支撑账号从 0 到 1 冷启动；相关内容发布后账号累计涨粉 800+，吸引含大几千至万粉量级的行业用户关注。",
    content: "", links: [{ platform: "小红书", url: "" }, { platform: "即刻", url: "" }]
  },
  {
    id: "ad-award", title: "大广赛品牌广告短片", category: "广告片", type: "视频",
    company: "全国大学生广告艺术大赛", period: "2024 – 2025",
    role: "创作核心成员：主导脚本撰写、现场拍摄、后期全片剪辑。",
    cover: "linear-gradient(135deg, #5A5A5A, #8A8A8A)", videoUrls: [],
    metrics: [{ label: "奖项", value: "北京赛区三等奖" }, { label: "时长", value: "约 60s" }],
    description: "作为创作核心成员，主导 1 支品牌广告短片从创意策划、脚本撰写、现场拍摄到后期剪辑的全流程；统筹学生摄制组完成场地勘景、演员调度与分镜设计；运用 PR / 剪映完成节奏剪辑与视觉包装，最终获大广赛北京赛区三等奖。",
    content: "", links: []
  }
];

/* 作品类型与栏目配色 */
const WORK_TYPES = ["视频", "策划", "文案", "图文", "其他"];
const DEFAULT_EXPERIENCES = [
  {
    id: "exp-tencent", year: "2026", tag: "实习", role: "内容运营实习生",
    company: "腾讯 CDG · 青腾", location: "深圳，中国", period: "2026.05 – 至今",
    description: "负责小红书账号内容创作与 KOC 资源拓展；完成活动拍摄、多平台剪辑与社媒内容支持。", link: "experience-detail.html?id=exp-tencent"
  },
  {
    id: "exp-yujian", year: "2026", tag: "4A", role: "导演组实习生",
    company: "蓝色光标 · 《玉见》导演组", location: "北京，中国", period: "2026.03 – 2026.05",
    description: "参与嘉宾策划、拍摄统筹、多版本剪辑；卫视版登陆海南卫视。", link: "experience-detail.html?id=exp-yujian"
  },
  {
    id: "exp-zhupassword", year: "2025", tag: "栏目", role: "编导实习生",
    company: "欣和企业 · 市场运营中心", location: "北京，中国", period: "2025.10 – 2026.01",
    description: "《主厨密码》栏目全链路编导，独立完成素材筛选与精剪，成片登陆爱奇艺。", link: "experience-detail.html?id=exp-zhupassword"
  },
  {
    id: "exp-yucai", year: "2025", tag: "公益", role: "慈善助学项目志愿者",
    company: "湖北省育才教育基金会", location: "湖北，中国", period: "2025.08 – 至今",
    description: "参与湖北省育才教育基金会慈善助学项目，协助困境学生资助对接、公益活动策划与传播，推动教育公益落地。", link: "charity-detail.html"
  },
  {
    id: "exp-adaward", year: "2025", tag: "竞赛", role: "创作核心成员",
    company: "全国大学生广告艺术大赛", location: "北京，中国", period: "2025.05",
    description: "主导品牌广告短片从创意到成片，获北京赛区三等奖。", link: "experience-detail.html?id=exp-adaward"
  }
];

const COVER_PALETTE = {
  "纪实栏目": "linear-gradient(135deg, #A9BF7D, #8DA361)",
  "社媒内容": "linear-gradient(135deg, #D4A574, #C47E54)",
  "视频号": "linear-gradient(135deg, #8DA361, #A9BF7D)",
  "广告片": "linear-gradient(135deg, #5A5A5A, #8A8A8A)"
};
function pickCover(category) { return COVER_PALETTE[category] || "linear-gradient(135deg, #ff6b5b, #ff9a76)"; }

/* ---------- 全局状态 ---------- */
const SITE_CONFIG = window.SITE_CONFIG || {};
let texts = {};
let works = [];
let categories = [];
let overlays = [];
let experiences = [];
let editing = false;
let currentFilter = "all";
let theme = defaultTheme();
let styles = {};
let skills = [];
let sectionOrder = { sections: [] };
let images = {};
let educationLayout = null;
let pendingImageFiles = [];
let currentImgSlot = null;
let modalReturnUrl = null;

/* ---------- 本地草稿缓存（防止换 token / 刷新丢失未保存编辑） ---------- */
const DRAFT_KEY = "portfolio_draft_v1";
let draftAutoSaveTimer = null;
function collectDraft() {
  const cleanWorks = (works || []).map((w) => {
    const copy = { ...w };
    copy.media = (copy.media || []).map((m) => {
      const mc = { ...m };
      delete mc.file;
      delete mc.preview;
      delete mc.dataUrl;
      return mc;
    });
    return copy;
  });
  return {
    savedAt: Date.now(),
    texts: { ...texts },
    categories: [...categories],
    works: cleanWorks,
    experiences: (experiences || []).map((e) => ({ ...e })),
    overlays: (overlays || []).map((o) => ({ ...o })),
    theme: JSON.parse(JSON.stringify(theme)),
    styles: JSON.parse(JSON.stringify(styles)),
    skills: [...skills],
    sectionOrder: JSON.parse(JSON.stringify(sectionOrder)),
    images: { ...images },
    educationLayout: educationLayout ? JSON.parse(JSON.stringify(educationLayout)) : null
  };
}
function saveDraft() {
  if (!editing) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft()));
  } catch (e) { console.warn("草稿保存失败", e); }
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  if (draftAutoSaveTimer) { clearInterval(draftAutoSaveTimer); draftAutoSaveTimer = null; }
}
function applyDraft(draft) {
  if (!draft) return;
  if (draft.texts) texts = draft.texts;
  if (draft.categories) categories = draft.categories;
  if (draft.works) works = draft.works;
  if (draft.experiences) experiences = draft.experiences;
  if (draft.overlays) overlays = draft.overlays;
  if (draft.theme) theme = draft.theme;
  if (draft.styles) styles = draft.styles;
  if (draft.skills) skills = draft.skills;
  if (draft.sectionOrder) sectionOrder = draft.sectionOrder;
  if (draft.images) images = draft.images;
  if (draft.educationLayout) educationLayout = draft.educationLayout;
}
function startDraftAutoSave() {
  if (draftAutoSaveTimer) clearInterval(draftAutoSaveTimer);
  draftAutoSaveTimer = setInterval(saveDraft, 5000);
  window.addEventListener("beforeunload", saveDraft);
}

/* ---------- 设计主题（颜色 / 字体 / 排版） ---------- */
function defaultTheme() {
  return {
    colors: { sage: "#A9BF7D", sageDark: "#8DA361", sageSoft: "#E3EBD1", ink: "#2A3654", bg: "#E6E7DE", bgDark: "#2A3654", surface: "#FFFFFF", muted: "#6B7280", line: "#D1D5C7" },
    fonts: { display: "'Outfit', 'Montserrat', 'Noto Sans SC', sans-serif", body: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif" },
    layout: { radius: 20, maxw: 1160, fontScale: 1, sectionPad: 100 }
  };
}
const FONT_OPTIONS = [
  { label: "思源黑体 Noto Sans SC", v: "'Noto Sans SC', sans-serif" },
  { label: "思源宋体 Noto Serif SC", v: "'Noto Serif SC', serif" },
  { label: "Outfit（英文无衬线）", v: "'Outfit', 'Noto Sans SC', sans-serif" },
  { label: "Montserrat（英文无衬线）", v: "'Montserrat', 'Noto Sans SC', sans-serif" },
  { label: "Playfair Display（英文衬线）", v: "'Playfair Display', 'Noto Serif SC', serif" },
  { label: "Dancing Script（手写体）", v: "'Dancing Script', cursive" },
  { label: "系统默认", v: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif" }
];

function applyUserTheme() {
  const c = theme.colors, f = theme.fonts, l = theme.layout;
  const css = `:root{
  --sage:${c.sage}; --sage-dark:${c.sageDark}; --sage-soft:${c.sageSoft};
  --ink:${c.ink}; --bg:${c.bg}; --surface:${c.surface}; --muted:${c.muted};
  --line:${c.line}; --bg-dark:${c.bgDark};
  --display:${f.display}; --sans:${f.body};
  --radius:${l.radius}px; --maxw:${l.maxw}px;
  --font-scale:${l.fontScale}; --section-pad:${l.sectionPad}px;
}`;
  let st = document.getElementById("user-theme");
  if (!st) { st = document.createElement("style"); st.id = "user-theme"; document.head.appendChild(st); }
  st.textContent = css;
  document.body.style.fontSize = (16 * l.fontScale) + "px";
}

function applyUserStyles() {
  document.querySelectorAll("[data-edit]").forEach((el) => {
    const s = styles[el.dataset.edit];
    if (s) {
      el.style.color = s.color || "";
      el.style.fontSize = s.fontSize ? s.fontSize + "px" : "";
      el.style.fontWeight = s.fontWeight || "";
      el.style.textAlign = s.textAlign || "";
      el.style.borderRadius = s.radius ? s.radius + "px" : "";
    } else {
      el.style.color = ""; el.style.fontSize = ""; el.style.fontWeight = ""; el.style.textAlign = ""; el.style.borderRadius = "";
    }
  });
}

function applyAllStyles() { applyUserTheme(); applyUserStyles(); }

const grid = document.getElementById("works-grid");
const overlayLayer = document.getElementById("overlay-layer");
const editorBar = document.getElementById("editor-bar");
const imgInput = document.getElementById("img-input");
const editorStatus = document.getElementById("editor-status");
const expModal = document.getElementById("exp-modal");
const expDetail = document.getElementById("exp-detail");
const expImages = document.getElementById("exp-images");
const expImgInput = document.getElementById("exp-img-input");
let expEditIndex = null;
let expImageList = [];

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
      experiences = Array.isArray(data.experience) ? data.experience : [];
      if (Array.isArray(data.skills) && data.skills.length) skills = data.skills;
      if (data.sectionOrder && Array.isArray(data.sectionOrder.sections)) sectionOrder.sections = data.sectionOrder.sections;
      if (data.theme) {
        const d = defaultTheme();
        theme = {
          colors: Object.assign({}, d.colors, data.theme.colors || {}),
          fonts: Object.assign({}, d.fonts, data.theme.fonts || {}),
          layout: Object.assign({}, d.layout, data.theme.layout || {})
        };
      }
      if (data.styles && typeof data.styles === "object") styles = data.styles;
      if (data.images && typeof data.images === "object") images = data.images;
      if (data.educationLayout && typeof data.educationLayout === "object") educationLayout = data.educationLayout;
    }
  } catch (e) { /* 用兜底数据 */ }
  if (!works.length) works = DEFAULT_WORKS.map((x) => ({ ...x }));
  if (!categories.length) categories = Array.from(new Set(works.map((w) => w.category).filter(Boolean)));
  if (!experiences.length) experiences = DEFAULT_EXPERIENCES.map((x) => ({ ...x }));
  if (!skills.length) skills = DEFAULT_SKILLS.map((x) => ({ ...x }));
  experiences.forEach((e) => {
    if (typeof e.detail !== "string") e.detail = "";
    if (!Array.isArray(e.images)) e.images = [];
  });
  works.forEach((w) => {
    if (!Array.isArray(w.videoUrls)) w.videoUrls = [];
    if (!Array.isArray(w.media)) w.media = [];
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
function applyImages() {
  Object.keys(images).forEach((key) => {
    const el = document.querySelector(`[data-edit="${key}"]`);
    if (!el) return;
    const img = el.tagName === "IMG" ? el : el.querySelector("img");
    if (!img) return;
    img.src = images[key];
    img.style.display = "";
    el.classList.remove("is-empty");
  });
}

/* ---------- 教育背景自定义布局（可拖拽/缩放） ---------- */
function getDefaultEducationLayout() {
  return {
    canvas: { w: 1030, h: 540 },
    box1: { x: 0, y: 0, w: 340, h: 255 },
    box2: { x: 100, y: 273, w: 340, h: 255 },
    text: { x: 510, y: 0, w: 520, h: "auto" }
  };
}
function applyEducationLayout() {
  const text = document.getElementById("edu-text");
  if (!text) return;
  // 移动端保持单列居中，不应用横向偏移
  if (window.innerWidth <= 1024) { text.style.transform = "none"; return; }
  const off = educationLayout && educationLayout.text;
  // 忽略旧绝对定位数据（含 canvas/box1/box2 或 text.w/text.h），避免文字列被推到屏幕外
  if (!off || educationLayout.canvas || educationLayout.box1 || off.w != null || off.h != null) {
    text.style.transform = "";
    return;
  }
  text.style.transform = `translate(${100 + (off.x || 0)}px, ${off.y || 0}px)`;
}
function collectEducationLayout() {
  const text = document.getElementById("edu-text");
  if (!text) return null;
  const m = /translate\(\s*([-\d.]+)px\s*,\s*([-\d.]+)px\s*\)/.exec(text.style.transform || "");
  if (!m) return null;
  const x = Math.round(parseFloat(m[1]) - 100);
  const y = Math.round(parseFloat(m[2]));
  if (x === 0 && y === 0) return null;
  return { text: { x, y } };
}
function enableEducationEditor() {
  const text = document.getElementById("edu-text");
  if (!text || text.dataset.eduBound) return;
  text.dataset.eduBound = "1";
  let active = false, moved = false, startX = 0, startY = 0, baseX = 0, baseY = 0;
  const getBase = () => (educationLayout && educationLayout.text)
    ? { x: educationLayout.text.x || 0, y: educationLayout.text.y || 0 }
    : { x: 0, y: 0 };
  text.addEventListener("mousedown", (e) => {
    if (!editing || e.button !== 0) return;
    active = true; moved = false;
    const b = getBase();
    baseX = b.x; baseY = b.y;
    startX = e.clientX; startY = e.clientY;
    // 不立即阻止默认行为：短按仍可进入文本编辑
  });
  window.addEventListener("mousemove", (e) => {
    if (!active) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
      moved = true;
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      text.style.userSelect = "none";
      text.setAttribute("contenteditable", "false"); // 拖拽时禁用文本编辑
      e.preventDefault();
    }
    if (moved) {
      text.style.transform = `translate(${100 + baseX + dx}px, ${baseY + dy}px)`;
    }
  });
  window.addEventListener("mouseup", (e) => {
    if (!active) return;
    active = false;
    text.style.userSelect = "";
    if (moved) {
      e.preventDefault();
      e.stopPropagation(); // 避免拖拽后触发点击编辑
    } else {
      // 没有移动：恢复 contenteditable，允许正常点击编辑
      text.setAttribute("contenteditable", "true");
    }
    moved = false;
  });
}

function paint() {
  const list = currentFilter === "all" ? works : works.filter((w) => w.category === currentFilter);
  renderCards(list);
}

const DEFAULT_SKILLS = [
  { icon: "🎬", title: "短视频编导与剪辑", desc: "独立负责选题、脚本、拍摄到剪辑包装全流程，作品于海南卫视播出，覆盖纪录片与社媒短视频。", tags: ["PR", "剪映", "分镜"] },
  { icon: "✍️", title: "内容策划与脚本", desc: "搭建嘉宾叙事脉络、撰写拍摄脚本，主导纪录片《主厨密码》选题与广告短片创意。", tags: ["叙事", "脚本", "创意"] },
  { icon: "📱", title: "社媒内容支持", desc: "提供短视频剪辑与文案产出，支撑活动账号从 0 到 1 内容落地，累计涨粉 800+。", tags: ["小红书", "即刻", "文案"] },
  { icon: "🤝", title: "KOC 资源拓展", desc: "筛选对接垂类达人，触达 10000+ 人，带动每场约 10 人线上报名。", tags: ["达人筛选", "传播"] },
  { icon: "🎥", title: "现场拍摄统筹", desc: "统筹勘景、活动拍摄与现场调度，对接嘉宾、摄影与执行团队。", tags: ["勘景", "现场调度"] },
  { icon: "🧩", title: "跨团队协作", desc: "联动设计、运营、摄影等多团队同步需求，完成素材归档与项目进度管理。", tags: ["协作", "项目管理"] }
];

function renderSkills() {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;
  grid.innerHTML = skills.map((s, i) => {
    const tagsHtml = editing
      ? `<div class="skill-card__tags" contenteditable="true" data-skill="tags" data-i="${i}">${(s.tags || []).join("、")}</div>`
      : `<div class="skill-card__tags">${(s.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
    const titleAttr = editing ? ` contenteditable="true" data-skill="title" data-i="${i}"` : "";
    const descAttr = editing ? ` contenteditable="true" data-skill="desc" data-i="${i}"` : "";
    return `
      <div class="skill-card" data-skill-index="${i}">
        <div class="skill-card__icon">${s.icon || ""}</div>
        <div class="skill-card__title"${titleAttr}>${s.title || ""}</div>
        <div class="skill-card__desc"${descAttr}>${s.desc || ""}</div>
        ${tagsHtml}
      </div>`;
  }).join("");
  if (editing) bindSkillEdit(grid);
}

function bindSkillEdit(grid) {
  grid.querySelectorAll("[data-skill]").forEach((el) => {
    el.addEventListener("input", () => {
      const i = Number(el.dataset.i);
      const field = el.dataset.skill;
      if (!skills[i]) return;
      if (field === "tags") {
        skills[i].tags = el.textContent.split(/[、,，\s]+/).map((t) => t.trim()).filter(Boolean);
      } else {
        skills[i][field] = el.textContent.trim();
      }
    });
  });
}

function renderExperience() {
  const wrap = document.getElementById("experience-list");
  if (!wrap) return;
  wrap.innerHTML = experiences.map((exp, idx) => {
    const linkHtml = exp.link
      ? `<a class="exp-card__link" href="${exp.link}" target="_blank" rel="noopener">查看详情 →</a>`
      : (editing ? `<span class="exp-card__link is-empty">（未填写详情链接）</span>` : "");
    const editAttr = editing ? " contenteditable=\"true\"" : "";
    const editDetailBtn = editing
      ? `<button type="button" class="exp-card__edit-detail" data-exp-detail="${idx}">✎ 编辑详情页</button>`
      : "";
    return `
      <div class="experience__item" data-exp-index="${idx}">
        <div class="exp-year"${editAttr} data-exp="year">${exp.year}</div>
        <div class="exp-card">
          <span class="exp-card__tag"${editAttr} data-exp="tag">${exp.tag}</span>
          <div class="exp-card__role"${editAttr} data-exp="role">${exp.role}</div>
          <div class="exp-card__company"${editAttr} data-exp="company">${exp.company}</div>
          <div class="exp-card__meta">
            <span><span class="icon">📅</span><span${editAttr} data-exp="period">${exp.period}</span></span>
            <span><span class="icon">📍</span><span${editAttr} data-exp="location">${exp.location}</span></span>
          </div>
          <div class="exp-card__desc"${editAttr} data-exp="description">${exp.description}</div>
          <div class="exp-card__actions">${linkHtml}${editDetailBtn}</div>
        </div>
      </div>`;
  }).join("");
  if (editing) bindExperienceEdit(wrap);
}

function bindExperienceEdit(wrap) {
  wrap.querySelectorAll("[data-exp]").forEach((el) => {
    const idx = Number(el.closest(".experience__item").dataset.expIndex);
    const field = el.dataset.exp;
    el.addEventListener("input", () => { experiences[idx][field] = el.textContent.trim(); });
  });
  wrap.querySelectorAll("[data-exp-detail]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openExpModal(Number(btn.dataset.expDetail));
    });
  });
}

/* ---------- 经历详情编辑器 ---------- */
function openExpModal(idx) {
  expEditIndex = idx;
  const exp = experiences[idx];
  expDetail.value = exp.detail || "";
  expImageList = (exp.images || []).map((url) => ({ url }));
  renderExpImages();
  expModal.classList.add("is-open");
  expModal.setAttribute("aria-hidden", "false");
}
function closeExpModal() {
  expModal.classList.remove("is-open");
  expModal.setAttribute("aria-hidden", "true");
  expEditIndex = null;
  expImageList = [];
}
function renderExpImages() {
  if (!expImages) return;
  expImages.innerHTML = expImageList.map((it, i) => `
    <div class="exp-image-row">
      <img src="${escAttr(it.preview || it.url)}" alt="" loading="lazy" />
      <input type="text" class="exp-image-url" value="${escAttr(it.url)}" data-i="${i}" placeholder="assets/..." />
      <button type="button" class="exp-image-del" data-i="${i}">×</button>
    </div>
  `).join("");
  expImages.querySelectorAll(".exp-image-url").forEach((inp) => {
    inp.addEventListener("input", () => { expImageList[Number(inp.dataset.i)].url = inp.value.trim(); });
  });
  expImages.querySelectorAll(".exp-image-del").forEach((btn) => {
    btn.addEventListener("click", () => { expImageList.splice(Number(btn.dataset.i), 1); renderExpImages(); });
  });
}
function saveExpModal() {
  if (expEditIndex == null) return;
  experiences[expEditIndex].detail = expDetail.value;
  experiences[expEditIndex].images = expImageList.map((it) => it.url).filter(Boolean);
  closeExpModal();
  renderExperience();
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
function workBadge(w) {
  const kinds = [];
  if ((w.videoUrls || []).length) kinds.push("视频");
  (w.media || []).forEach((m) => { if (m.kind && !kinds.includes(m.kind)) kinds.push(m.kind); });
  if (!kinds.length) return w.type || "视频";
  if (kinds.length === 1) return kinds[0];
  return "合集";
}
function renderCards(list) {
  grid.innerHTML = "";
  list.forEach((w) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    const metricsHtml = (w.metrics || []).map((m, i) =>
      `<span class="tag"${editing ? ` data-edit="metric-${w.id}-${i}"` : ""}>${m.value}</span>`
    ).join("");
    const firstPoster = (w.videoUrls && w.videoUrls[0] && w.videoUrls[0].poster) ? w.videoUrls[0].poster : "";
    const hasVideo = !!(w.videoUrls && w.videoUrls.length);
    const coverStyle = firstPoster ? "" : `style="background:${w.cover}"`;
    const coverMedia = firstPoster ? `<img src="${firstPoster}" alt="${w.title}" />` : "";
    const playBadge = hasVideo ? `<div class="card__play"><span>▶</span></div>` : "";
    card.innerHTML = `
      <div class="card__cover" ${coverStyle}>
        ${coverMedia}
        ${playBadge}
      </div>
      <div class="card__body">
        <span class="card__cat"${editing ? ` data-edit="cat-${w.id}"` : ""}>${w.category}</span>
        <h3 class="card__title"${editing ? ` data-edit="title-${w.id}"` : ""}>${w.title}</h3>
        <p class="card__role"><span${editing ? ` data-edit="company-${w.id}"` : ""}>${w.company || ""}</span> · <span${editing ? ` data-edit="period-${w.id}"` : ""}>${w.period || ""}</span></p>
        <p class="card__role card__role2"${editing ? ` data-edit="role-${w.id}"` : ""}>${w.role || ""}</p>
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

function videoLabel(v, i) {
  if (v && v.label) return v.label;
  const name = (v && v.url ? v.url : "").split("/").pop().replace(/\.mp4$/i, "").replace(/_web$/, "").replace(/《主厨密码》/g, "");
  return name || ("视频 " + (i + 1));
}
function renderVideo(v) {
  if (!v) return "";
  let url = "";
  let meta = {};
  if (typeof v === "string") {
    url = v;
  } else if (typeof v === "object") {
    url = v.url || "";
    meta = v;
  }
  if (!url) return "";
  const type = meta.type || detectVideo(url);
  if (type === "mp4") {
    const poster = meta.poster ? ` poster="${escAttr(meta.poster)}"` : "";
    return `<div class="video-wrap"><video src="${escAttr(url)}"${poster} controls preload="metadata" playsinline></video><div class="video-play" data-play><span>▶</span></div></div>`;
  }
  if (type === "iframe") {
    return `<iframe src="${escAttr(url)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
  // link：普通平台详情页（爱奇艺、腾讯视频、公众号等），不内嵌，改跳转卡片
  let label = "前往观看";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("iqiyi")) label = "前往爱奇艺观看";
    else if (host.includes("qq.com") || host.includes("v.qq")) label = "前往腾讯视频观看";
    else if (host.includes("bilibili")) label = "前往 B 站观看";
    else if (host.includes("weixin.qq")) label = "前往公众号阅读";
    else label = `在 ${host} 观看`;
  } catch (e) {}
  return `
    <div class="modal__link-card">
      <p class="modal__link-card-title">该链接暂不支持站内直接播放</p>
      <a class="btn btn--primary modal__link-card-btn" href="${escAttr(url)}" target="_blank" rel="noopener">${label} ↗</a>
      <p class="modal__link-card-note">外链页面由对应平台提供，可能需要观看广告或登录，敬请谅解。</p>
    </div>`;
}

function initVideoWraps(root) {
  const wraps = (root || document).querySelectorAll(".video-wrap");
  wraps.forEach((wrap) => {
    const video = wrap.querySelector("video");
    const play = wrap.querySelector(".video-play");
    if (!video || !play) return;
    play.addEventListener("click", () => { video.play(); });
    video.addEventListener("play", () => {
      wrap.classList.add("is-playing");
      // 同一弹窗内只保留一个正在播放的视频：开始播放时暂停其它视频
      wraps.forEach((otherWrap) => {
        if (otherWrap === wrap) return;
        const other = otherWrap.querySelector("video");
        if (other && !other.paused) other.pause();
      });
    });
    video.addEventListener("pause", () => { if (!video.ended) wrap.classList.remove("is-playing"); });
    video.addEventListener("ended", () => wrap.classList.remove("is-playing"));
  });
  // 等视频元数据加载后，校准每个视频的横竖版 class
  reorderVideosByOrientation(root);
}

function reorderVideosByOrientation(root) {
  // 等视频元数据加载后，按真实宽高比重新排序：横版在前，竖版三个一排放在最后
  const groups = (root || document).querySelectorAll(".modal__group-items--video");
  groups.forEach((group) => {
    const vids = Array.from(group.querySelectorAll(":scope > .modal__vid"));
    if (!vids.length) return;
    const promises = vids.map((vid) => new Promise((resolve) => {
      const video = vid.querySelector("video");
      function finish(isPortrait) {
        vid.classList.toggle("modal__vid--landscape", !isPortrait);
        vid.classList.toggle("modal__vid--portrait", isPortrait);
        resolve({ vid, isPortrait });
      }
      if (!video) { finish(false); return; }
      function apply() {
        if (!video.videoWidth || !video.videoHeight) { finish(false); return; }
        finish(video.videoWidth / video.videoHeight < 1);
      }
      if (video.readyState >= 1) apply();
      else {
        video.addEventListener("loadedmetadata", apply, { once: true });
        video.addEventListener("loadeddata", apply, { once: true });
      }
      // 慢速 CDN（如 GitHub Pages 上的大视频）可能 3s 内还没就绪，放宽到 8s 再判定
      setTimeout(() => { if (video.readyState >= 1) apply(); }, 8000);
    }));
    Promise.all(promises).then((results) => {
      results.sort((a, b) => a.isPortrait - b.isPortrait); // 横版 0 在前，竖版 1 在后
      results.forEach((r) => group.appendChild(r.vid));
    });
  });
}

function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }
function videoUrlOf(v) { return v && typeof v === "object" ? (v.url || "") : (typeof v === "string" ? v : ""); }
function seriesKeyOfVideo(v) {
  const name = basename(videoUrlOf(v));
  // 把 "_web"、"预告片"、扩展名等公共后缀去掉，得到系列名，用于配对
  return name
    .replace(/(_web|预告片|_poster|poster)(?=\.|$)/g, "")
    .replace(/\.[^.]+$/g, "")
    .replace(/[《》]/g, "")
    .trim();
}
function isPortraitVideo(v) {
  // 优先使用上传时记录的朝向
  if (v && typeof v === "object") {
    if (v.portrait === true) return true;
    if (v.portrait === false) return false;
  }
  const url = videoUrlOf(v);
  // 该用户约定：文件名含"预告"的是竖版
  return /预告/.test(url) || /vertical|portrait|竖版|9.?16/i.test(url);
}
function renderMediaGroups(w) {
  const groups = {};
  (w.videoUrls || []).forEach((v) => { (groups["视频"] = groups["视频"] || []).push({ kind: "视频", v }); });
  (w.media || []).forEach((m) => {
    if (m.kind === "视频") {
      (groups["视频"] = groups["视频"] || []).push({ kind: "视频", v: m });
    } else {
      (groups[m.kind] = groups[m.kind] || []).push({ kind: m.kind, m });
    }
  });
  const order = ["视频", "图片", "图文", "文案", "策划", "Word", "PDF", "社媒链接", "文章", "其他"];
  const kinds = Object.keys(groups).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  if (!kinds.length) return `<div class="media-placeholder">作品内容待补充 —— 编辑模式下点卡片「✎ 详情」添加视频 / 图片 / Word / PDF / 社媒链接 等。</div>`;
  return kinds.map((kind) => {
    const items = groups[kind];
    const isVideo = kind === "视频";
    const isGrid = kind === "图片";
    let inner;
    if (isVideo) {
      // 先放所有横版（每个占满一行），最后把竖版三个一排放在底部
      const lands = items.filter((it) => !isPortraitVideo(it.v));
      const ports = items.filter((it) => isPortraitVideo(it.v));
      inner = lands.map((it) => `<div class="modal__vid modal__vid--landscape" data-orient>${renderVideo(it.v)}</div>`).join("")
            + ports.map((it) => `<div class="modal__vid modal__vid--portrait" data-orient>${renderVideo(it.v)}</div>`).join("");
    } else {
      inner = items.map((it) => {
        if (it.kind === "图片") return `<figure class="modal__fig"><img class="modal__img" src="${escAttr(it.m.url)}" alt="${escAttr(it.m.caption || "")}" loading="lazy" />${it.m.caption ? `<figcaption class="modal__cap">${esc(it.m.caption)}</figcaption>` : ""}</figure>`;
        if (it.kind === "策划") {
          let html = "";
          if (it.m.url) {
            html += `<a class="modal__doc" href="${escAttr(it.m.url)}" target="_blank" rel="noopener"><span class="modal__doc-icon">📋</span><span class="modal__doc-info"><strong>${esc(it.m.label || "策划案")}</strong><span class="modal__doc-meta">点击下载 / 预览</span></span></a>`;
          }
          if (it.m.body || it.m.title) {
            html += `<div class="modal__text"><h4>${esc(it.m.title || it.m.label || "策划说明")}</h4><div class="modal__text-body">${esc(it.m.body || "")}</div></div>`;
          }
          return html || `<div class="modal__text"><div class="modal__text-body">（策划内容待补充）</div></div>`;
        }
        if (it.kind === "Word" || it.kind === "PDF") {
          const ext = it.kind === "Word" ? "docx" : "pdf";
          const label = it.m.label || it.kind + " 文件";
          return `<a class="modal__doc" href="${escAttr(it.m.url)}" target="_blank" rel="noopener"><span class="modal__doc-icon">${it.kind}</span><span class="modal__doc-info"><strong>${esc(label)}</strong><span class="modal__doc-meta">点击下载 / 预览 · .${ext}</span></span></a>`;
        }
        if (it.kind === "社媒链接") {
          const platform = it.m.label || "社媒链接";
          const caption = it.m.caption ? `<div class="modal__link-cap">${esc(it.m.caption)}</div>` : "";
          return `<a class="modal__doc modal__doc--link" href="${escAttr(it.m.url)}" target="_blank" rel="noopener"><span class="modal__doc-icon">🔗</span><span class="modal__doc-info"><strong>${esc(platform)}</strong><span class="modal__doc-meta">${escAttr(it.m.url)}</span></span></a>${caption}`;
        }
        const t = it.kind === "文案" ? "文案正文" : it.kind === "图文" ? "图文内容" : (it.m.title ? it.m.title : "正文");
        return `<div class="modal__text"><h4>${esc(it.m.title || t)}</h4><div class="modal__text-body">${esc(it.m.body || "")}</div></div>`;
      }).join("");
    }
    let wrapClass = "modal__group-items";
    if (isVideo) wrapClass = "modal__group-items modal__group-items--video";
    else if (isGrid) wrapClass = "modal__group-items modal__group-items--grid";
    return `<div class="modal__group"><div class="modal__group-title">${kind}</div><div class="${wrapClass}">${inner}</div></div>`;
  }).join("");
}

function openModal(w) {
  document.getElementById("modal-cat").textContent = `${w.category || ""} · ${workBadge(w)}`;
  document.getElementById("modal-title").textContent = w.title;
  document.getElementById("modal-meta").textContent = `${w.company || ""} · ${w.period || ""}`;
  document.getElementById("modal-role").textContent = w.role || "";
  document.getElementById("modal-metrics").innerHTML =
    (w.metrics || []).map((m) => `<span class="tag">${m.label}：${m.value}</span>`).join("");
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

  modalMedia.innerHTML = renderMediaGroups(w);
  initVideoWraps(modalMedia);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  /* 记录详情页返回地址（从“查看作品”跳转过来时会带 ?return=...） */
  modalReturnUrl = new URLSearchParams(location.search).get("return");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalMedia.innerHTML = "";
  document.body.style.overflow = "";

  /* 如果是从“查看作品”跳转回来，关闭弹窗后回到原详情页 */
  if (modalReturnUrl) {
    const url = modalReturnUrl;
    modalReturnUrl = null;
    window.location.href = url;
  }
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
  if (file.size > 50 * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    alert(`该视频 ${sizeMb} MB，GitHub 在线上传超过 50MB 基本都会失败（422/500）。\n\n请先用剪映 / HandBrake / FFmpeg 压缩到 50MB 以下再传；或者使用对象存储直链：\n1. 把视频传到七牛云 Kodo / 腾讯云 COS / 阿里云 OSS 等对象存储；\n2. 复制公开直链（https 开头）；\n3. 关闭本窗口，点击「＋ 链接」把直链粘进去即可播放。`);
    return;
  }
  if (file.size > 25 * 1024 * 1024) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    if (!confirm(`该视频 ${sizeMb} MB，已超过 25MB。GitHub API 对超过 25MB 的文件容易返回 422/500，最稳的做法是压缩到 25MB 以下。\n\n仍要继续尝试上传吗？`)) {
      return;
    }
  }
  const safe = (file.name || "video.mp4").replace(/[^\w\-.\u4e00-\u9fa5]/g, "_");
  const name = "assets/videos/" + Date.now() + "-" + safe;
  const blobUrl = URL.createObjectURL(file);
  // 保持原始 File 对象，保存时再用 file.arrayBuffer() 读取上传，避免大视频读 base64 失败
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
let wmMedia = [];
function renderWmMedia() {
  const box = document.getElementById("wm-media-list");
  if (!box) return;
  if (!wmMedia.length) { box.innerHTML = '<p class="wm-empty">暂无多媒体。用下方按钮添加视频 / 图片 / 图文 / Word / PDF / 社媒链接 等。</p>'; return; }
  box.innerHTML = "";
  const allKinds = ["视频", "图片", "图文", "文案", "策划", "Word", "PDF", "社媒链接", "文章", "其他"];
  wmMedia.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "wm-media-row";
    const kindSel = `<select class="wm-media-kind" data-i="${i}">${allKinds.map((k) => `<option value="${k}"${k === m.kind ? " selected" : ""}>${k}</option>`).join("")}</select>`;
    let fields = "";
    if (m.kind === "视频") {
      const vname = m.name ? basename(m.name) : (m.url ? basename(m.url) : "");
      const vprev = m.preview ? `<a class="wm-media-prev" href="${escAttr(m.preview)}" target="_blank" rel="noopener">预览</a>` : "";
      const badge = (m.file || (m.url || "").startsWith("assets/videos/")) ? `<span class="wm-media-fname">📹 ${esc(vname)}</span>${vprev}` : "";
      fields = `<input class="wm-media-url" data-i="${i}" placeholder="视频链接或 assets/videos/xxx.mp4" value="${escAttr(m.url || "")}" />
                <input class="wm-media-label" data-i="${i}" placeholder="标签，如：正片 / 预告" value="${escAttr(m.label || "")}" />${badge}`;
    } else if (m.kind === "图片") {
      fields = `<input class="wm-media-url" data-i="${i}" placeholder="图片链接或 assets/xxx.jpg" value="${escAttr(m.url || "")}" />
                <input class="wm-media-cap" data-i="${i}" placeholder="图片说明" value="${escAttr(m.caption || "")}" />`;
    } else if (m.kind === "Word" || m.kind === "PDF") {
      fields = `<input class="wm-media-url" data-i="${i}" placeholder="文件链接或 assets/docs/xxx.${m.kind === "Word" ? "docx" : "pdf"}" value="${escAttr(m.url || "")}" />
                <input class="wm-media-label" data-i="${i}" placeholder="标题 / 文件名" value="${escAttr(m.label || "")}" />`;
    } else if (m.kind === "社媒链接") {
      fields = `<input class="wm-media-url" data-i="${i}" placeholder="链接地址，如 https://www.xiaohongshu.com/..." value="${escAttr(m.url || "")}" />
                <input class="wm-media-label" data-i="${i}" placeholder="平台名称，如：小红书 / 即刻 / 公众号" value="${escAttr(m.label || "")}" />
                <input class="wm-media-cap" data-i="${i}" placeholder="一句话说明" value="${escAttr(m.caption || "")}" />`;
    } else if (m.kind === "策划") {
      fields = `<input class="wm-media-url" data-i="${i}" placeholder="策划案文件链接或 assets/docs/xxx" value="${escAttr(m.url || "")}" />
                <input class="wm-media-label" data-i="${i}" placeholder="策划案标题" value="${escAttr(m.label || "")}" />
                <textarea class="wm-media-body" data-i="${i}" placeholder="策划说明 / 正文" rows="2">${esc(m.body || "")}</textarea>`;
    } else {
      fields = `<input class="wm-media-title" data-i="${i}" placeholder="标题" value="${escAttr(m.title || "")}" />
                <textarea class="wm-media-body" data-i="${i}" placeholder="正文内容" rows="2">${esc(m.body || "")}</textarea>`;
    }
    row.innerHTML = `<div class="wm-media-head">${kindSel}<button type="button" class="wm-media-del" data-i="${i}">删除</button></div>${fields}`;
    box.appendChild(row);
  });
  box.querySelectorAll(".wm-media-kind").forEach((el) => el.addEventListener("change", () => { wmMedia[Number(el.dataset.i)].kind = el.value; renderWmMedia(); }));
  box.querySelectorAll(".wm-media-del").forEach((el) => el.addEventListener("click", () => { wmMedia.splice(Number(el.dataset.i), 1); renderWmMedia(); }));
  box.querySelectorAll(".wm-media-url").forEach((el) => el.addEventListener("input", () => { wmMedia[Number(el.dataset.i)].url = el.value; }));
  box.querySelectorAll(".wm-media-label").forEach((el) => el.addEventListener("input", () => { wmMedia[Number(el.dataset.i)].label = el.value; }));
  box.querySelectorAll(".wm-media-cap").forEach((el) => el.addEventListener("input", () => { wmMedia[Number(el.dataset.i)].caption = el.value; }));
  box.querySelectorAll(".wm-media-title").forEach((el) => el.addEventListener("input", () => { wmMedia[Number(el.dataset.i)].title = el.value; }));
  box.querySelectorAll(".wm-media-body").forEach((el) => el.addEventListener("input", () => { wmMedia[Number(el.dataset.i)].body = el.value; }));
}
function bindWmMediaAdd() {
  const addV = document.getElementById("wm-add-video");
  const addI = document.getElementById("wm-add-image");
  const addT = document.getElementById("wm-add-text");
  const addW = document.getElementById("wm-add-word");
  const addP = document.getElementById("wm-add-pdf");
  const addS = document.getElementById("wm-add-social");
  if (addV) addV.addEventListener("click", () => { wmMedia.push({ kind: "视频", url: "", label: "" }); renderWmMedia(); });
  if (addI) addI.addEventListener("click", () => { wmMedia.push({ kind: "图片", url: "", caption: "" }); renderWmMedia(); });
  if (addT) addT.addEventListener("click", () => { wmMedia.push({ kind: "图文", title: "", body: "" }); renderWmMedia(); });
  if (addW) addW.addEventListener("click", () => { wmMedia.push({ kind: "Word", url: "", label: "" }); renderWmMedia(); });
  if (addP) addP.addEventListener("click", () => { wmMedia.push({ kind: "PDF", url: "", label: "" }); renderWmMedia(); });
  if (addS) addS.addEventListener("click", () => { wmMedia.push({ kind: "社媒链接", url: "", label: "", caption: "" }); renderWmMedia(); });
  const addPlan = document.getElementById("wm-add-plan");
  if (addPlan) addPlan.addEventListener("click", () => { wmMedia.push({ kind: "策划", url: "", label: "", body: "" }); renderWmMedia(); });
  // 作品详情弹窗：直接上传本地视频文件（与卡片视频管理弹窗一致）
  const upV = document.getElementById("wm-upload-video");
  const upF = document.getElementById("wm-video-file");
  if (upV && upF) {
    upV.addEventListener("click", () => upF.click());
    upF.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        alert(`该视频 ${sizeMb} MB，GitHub 在线上传超过 50MB 基本都会失败（422/500）。\n\n请先用剪映 / HandBrake / FFmpeg 压缩到 50MB 以下再传；或者使用对象存储直链：\n1. 把视频传到七牛云 Kodo / 腾讯云 COS / 阿里云 OSS 等对象存储；\n2. 复制公开直链（https 开头）；\n3. 关闭本窗口，在作品详情弹窗点「＋ 视频链接」，把直链粘进去即可播放。`);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        if (!confirm(`该视频 ${sizeMb} MB，已超过 25MB。GitHub API 对超过 25MB 的文件容易返回 422/500，最稳的做法是压缩到 25MB 以下。\n\n仍要继续尝试上传吗？`)) {
          return;
        }
      }
      const safe = (file.name || "video.mp4").replace(/[^\w\-.\u4e00-\u9fa5]/g, "_");
      const name = "assets/videos/" + Date.now() + "-" + safe;
      const preview = URL.createObjectURL(file);
      // 保持原始 File 对象，保存时再用 file.arrayBuffer() 读取上传，避免大视频读 base64 失败
      wmMedia.push({ kind: "视频", url: name, name, label: "", preview, file });
      pendingVideoFiles.push({ name, file });
      renderWmMedia();
      e.target.value = "";
    });
  }
}
bindWmMediaAdd();

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
  wmMedia = (w.media || []).map((m) => Object.assign({}, m));
  renderWmMedia();
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
    links: wmLinks.filter((l) => l.platform || l.url).map((l) => ({ platform: l.platform, url: l.url })),
    media: wmMedia.filter((m) => ["视频", "图片", "Word", "PDF", "社媒链接", "策划"].includes(m.kind) ? !!(m.url || m.file) : !!(m.url || m.title || m.body || m.label)).map((m) => {
      const o = Object.assign({}, m);
      if (o.file || o.preview || (o.url || "").startsWith("blob:")) o.url = o.name || o.url; // 用最终仓库路径，确保上传后能播放
      delete o.file;
      delete o.preview;
      delete o.dataUrl; // base64 缓存不写入 content.json
      return o;
    })
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

// 经历详情编辑器事件
document.getElementById("exp-save").addEventListener("click", saveExpModal);
document.getElementById("exp-cancel").addEventListener("click", closeExpModal);
document.querySelectorAll("[data-exp-close]").forEach((el) => el.addEventListener("click", closeExpModal));
document.getElementById("exp-add-image").addEventListener("click", () => { if (expEditIndex != null) expImgInput.click(); });
expImgInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file || expEditIndex == null) return;
  const filename = `assets/${Date.now()}_${basename(file.name).replace(/\s+/g, "_")}`;
  const preview = URL.createObjectURL(file);
  pendingImageFiles.push({ name: filename, file, url: preview });
  expImageList.push({ url: filename, preview });
  renderExpImages();
  expImgInput.value = "";
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && expModal && expModal.classList.contains("is-open")) closeExpModal(); });

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
  if (currentImgSlot) {
    const key = currentImgSlot.dataset.edit;
    if (key) {
      const filename = `assets/${Date.now()}_${basename(file.name).replace(/\s+/g, "_")}`;
      images[key] = filename;
      const url = URL.createObjectURL(file);
      const img = currentImgSlot.tagName === "IMG" ? currentImgSlot : currentImgSlot.querySelector("img");
      if (img) { img.src = url; img.style.display = ""; }
      currentImgSlot.classList.remove("is-empty");
      pendingImageFiles.push({ name: filename, file, url });
    }
    currentImgSlot = null;
    imgInput.value = "";
    return;
  }
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
function downloadFile(fileOrDataUrl, filename) {
  const a = document.createElement("a");
  if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
    a.href = fileOrDataUrl;
  } else {
    a.href = URL.createObjectURL(fileOrDataUrl);
  }
  a.download = filename;
  a.click();
  if (!a.href.startsWith("data:")) URL.revokeObjectURL(a.href);
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
async function commitBinaryFile(path, fileOrDataUrl) {
  const cfg = SITE_CONFIG.github || {};
  const token = await getToken();
  if (!token) throw new Error("未提供 token");
  if (!fileOrDataUrl) throw new Error("文件内容为空");

  let b64, fileSize = 0;
  if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
    const idx = fileOrDataUrl.indexOf(",");
    b64 = idx === -1 ? "" : fileOrDataUrl.slice(idx + 1);
    fileSize = Math.floor((b64.length * 3) / 4);
  } else {
    try {
      const buf = await fileOrDataUrl.arrayBuffer();
      fileSize = buf.byteLength;
      b64 = base64FromArrayBuffer(buf);
    } catch (readErr) {
      console.error("[commitBinaryFile] 读取文件失败", readErr);
      throw new Error("读取本地文件失败（文件可能被系统清理或已被删除），请重新选择：" + path);
    }
  }

  const baseUrl = `${cfg.apiBase}/repos/${cfg.owner}/${cfg.repo}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };

  // GitHub 实际能稳定在线上传的大小约 25MB；25-50MB 尝试 Git Database API；>50MB 拒绝
  if (fileSize > 50 * 1024 * 1024) {
    throw new Error("视频超过 50MB，GitHub 在线上传极易失败，请先压缩到 50MB 以下，或使用对象存储直链");
  }
  if (fileSize > 25 * 1024 * 1024) {
    return await commitLargeBinaryFile(path, b64, fileSize, baseUrl, headers, cfg);
  }

  const getUrl = `${baseUrl}/contents/${encodeURIComponent(path)}?ref=${cfg.branch}`;
  let sha = null;
  const head = await fetch(getUrl, { headers });
  if (head.ok) sha = (await head.json()).sha;

  const body = { message: "Add media: " + path, content: b64, branch: cfg.branch };
  if (sha) body.sha = sha;

  const putUrl = `${baseUrl}/contents/${encodeURIComponent(path)}`;
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(putUrl, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, headers),
      body: JSON.stringify(body)
    });
    if (res.ok) return;
    lastErr = { status: res.status, detail: await res.text().catch(() => "") };
    if (res.status === 422 || res.status === 404 || res.status === 401) break; // 不重试权限/校验错误
    await new Promise((r) => setTimeout(r, 1000));
  }

  const why = lastErr.status === 404
    ? "：token 没有该仓库的写入权限，或仓库路径错误"
    : lastErr.status === 401
      ? "：token 无效或已过期"
      : fileSize > 30 * 1024 * 1024
        ? "：文件较大，GitHub Contents API 可能拒绝；建议压缩到 50MB 以下或用对象存储直链"
        : "";
  console.error("[commitBinaryFile]", lastErr.status, lastErr.detail);
  throw new Error("上传视频失败（" + lastErr.status + "）" + why);
}

// 通过 Git Database API 上传中等文件（25MB–50MB），超过 50MB 不应进入此函数
async function commitLargeBinaryFile(path, b64, fileSize, baseUrl, headers, cfg) {
  if (fileSize > 50 * 1024 * 1024) {
    throw new Error("视频超过 50MB，GitHub 在线上传极易失败，请先压缩到 50MB 以下，或使用对象存储直链");
  }
  // 1. 创建 blob
  const blobRes = await fetch(`${baseUrl}/git/blobs`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify({ content: b64, encoding: "base64" })
  });
  if (!blobRes.ok) {
    const detail = await blobRes.text().catch(() => "");
    const hint = blobRes.status === 422
      ? "；该视频对 GitHub 来说仍太大，建议压缩到 25MB 以下再传，或使用对象存储直链"
      : "";
    throw new Error(`创建文件 blob 失败（${blobRes.status}）${hint}`);
  }
  const { sha: blobSha } = await blobRes.json();

  // 2. 获取当前分支 commit / tree
  const refRes = await fetch(`${baseUrl}/git/ref/heads/${cfg.branch}`, { headers });
  if (!refRes.ok) throw new Error(`获取分支 ${cfg.branch} 失败（${refRes.status}）`);
  const { object: { sha: commitSha } } = await refRes.json();

  const commitRes = await fetch(`${baseUrl}/git/commits/${commitSha}`, { headers });
  if (!commitRes.ok) throw new Error(`获取当前提交失败（${commitRes.status}）`);
  const { tree: { sha: treeSha } } = await commitRes.json();

  // 3. 创建新 tree
  const treeRes = await fetch(`${baseUrl}/git/trees`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify({
      base_tree: treeSha,
      tree: [{ path, mode: "100644", type: "blob", sha: blobSha }]
    })
  });
  if (!treeRes.ok) throw new Error(`创建文件树失败（${treeRes.status}）`);
  const { sha: newTreeSha } = await treeRes.json();

  // 4. 创建 commit
  const newCommitRes = await fetch(`${baseUrl}/git/commits`, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify({
      message: "Add media: " + path,
      tree: newTreeSha,
      parents: [commitSha]
    })
  });
  if (!newCommitRes.ok) throw new Error(`创建提交失败（${newCommitRes.status}）`);
  const { sha: newCommitSha } = await newCommitRes.json();

  // 5. 更新分支引用
  const updateRes = await fetch(`${baseUrl}/git/refs/heads/${cfg.branch}`, {
    method: "PATCH",
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify({ sha: newCommitSha })
  });
  if (!updateRes.ok) throw new Error(`更新分支失败（${updateRes.status}）`);
}
let tokenResolve = null;
function openTokenModal() {
  const m = document.getElementById("token-modal");
  if (!m) return;
  m.classList.add("is-open");
  m.setAttribute("aria-hidden", "false");
  const inp = document.getElementById("token-input");
  const err = document.getElementById("token-error");
  if (inp) { inp.value = ""; inp.focus(); }
  if (err) { err.textContent = ""; err.hidden = true; }
}
function closeTokenModal() {
  const m = document.getElementById("token-modal");
  if (!m) return;
  m.classList.remove("is-open");
  m.setAttribute("aria-hidden", "true");
}
function showTokenError(msg) {
  const el = document.getElementById("token-error");
  if (el) { el.textContent = msg; el.hidden = false; }
}
function submitToken() {
  const inp = document.getElementById("token-input");
  if (!inp) return;
  const t = (inp.value || "").trim();
  if (!t) { showTokenError("请输入 token"); return; }
  sessionStorage.setItem("gh_token", t);
  closeTokenModal();
  if (tokenResolve) { tokenResolve(t); tokenResolve = null; }
}
function cancelToken() {
  closeTokenModal();
  if (tokenResolve) { tokenResolve(null); tokenResolve = null; }
}
function bindTokenModal() {
  const m = document.getElementById("token-modal");
  if (!m) return;
  m.querySelectorAll("[data-token-close]").forEach((el) => el.addEventListener("click", cancelToken));
  const ok = document.getElementById("token-ok");
  if (ok) ok.addEventListener("click", submitToken);
  const inp = document.getElementById("token-input");
  if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") submitToken(); });
}
bindTokenModal();

async function getToken() {
  let t = sessionStorage.getItem("gh_token");
  if (t) return t;
  // GitHub secret scanning 不允许把 token 写进部署文件，因此这里弹窗让用户粘贴
  return new Promise((resolve) => {
    tokenResolve = resolve;
    openTokenModal();
  });
}
async function commitToGitHub(str) {
  const cfg = SITE_CONFIG.github || {};
  const token = await getToken();
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
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let why = "";
    if (res.status === 404) why = "：token 没有该仓库的写入权限，或仓库/分支路径错误";
    else if (res.status === 401) why = "：token 无效或已过期";
    else if (res.status === 422) why = "：请求参数错误（可打开浏览器控制台查看详情）";
    console.error("[commitToGitHub]", res.status, detail);
    throw new Error("提交失败（" + res.status + "）" + why);
  }
}
async function saveContent() {
  // 收集文本覆盖（剔除样式点，避免污染数据）
  document.querySelectorAll("[data-edit]").forEach((el) => {
    if (el.closest("#works-grid")) return;
    const clone = el.cloneNode(true);
    clone.querySelectorAll(".style-dot").forEach((d) => d.remove());
    texts[el.dataset.edit] = clone.innerHTML;
  });
  // 收集文本类覆盖层
  overlays.forEach((o) => {
    if (o.type === "text") {
      const el = overlayLayer.querySelector(`[data-id="${o.id}"] .ovl__text`);
      if (el) o.content = el.textContent;
    }
  });
  // 收集教育背景自定义布局
  educationLayout = collectEducationLayout();
  const str = JSON.stringify({ texts, categories, works, experience: experiences, overlays, theme, styles, skills, sectionOrder, images, educationLayout }, null, 2);
  const cfg = SITE_CONFIG.github || {};
  if (cfg.owner && cfg.repo) {
    try {
      setStatus("保存中…");
      for (const pi of pendingImageFiles) {
        setStatus("上传图片：" + basename(pi.name) + " …");
        await commitBinaryFile(pi.name, pi.file);
      }
      pendingImageFiles.length = 0;
      for (const pv of pendingVideoFiles) {
        setStatus("上传视频：" + basename(pv.name) + " …");
        await commitBinaryFile(pv.name, pv.file);
      }
      pendingVideoFiles.length = 0;
      await commitToGitHub(str);
      clearDraft();
      setStatus("已保存到 GitHub ✓（本地草稿已清除）");
    } catch (err) {
      setStatus("保存失败：" + err.message + "（已下载备份）");
      downloadJson(str);
      pendingVideoFiles.forEach((pv) => downloadFile(pv.file, basename(pv.name)));
      pendingVideoFiles.length = 0;
    }
  } else {
    downloadJson(str);
    pendingImageFiles.forEach((pi) => downloadFile(pi.file, basename(pi.name)));
    pendingImageFiles.length = 0;
    pendingVideoFiles.forEach((pv) => downloadFile(pv.file, basename(pv.name)));
    pendingVideoFiles.length = 0;
    setStatus("已下载 content.json、图片与视频文件，请放入对应 assets/ 目录并重新部署");
  }
}

/* ============================================================
   编辑模式开关
   ============================================================ */
function showEditorBar(show) {
  const bar = document.getElementById("editor-bar");
  const login = document.getElementById("login-entry");
  if (!bar || !login) return;
  if (show) {
    bar.classList.remove("is-hidden");
    bar.hidden = false;
    bar.style.display = "flex";
    login.classList.add("is-hidden");
    login.hidden = true;
    login.style.display = "none";
  } else {
    bar.classList.add("is-hidden");
    bar.hidden = true;
    bar.style.display = "none";
    login.classList.remove("is-hidden");
    login.hidden = false;
    login.style.display = "block";
  }
}
/* ---------- 板块顺序拖拽（编辑模式） ---------- */
function applySectionOrder() {
  const main = document.querySelector("main");
  if (!main) return;
  const ids = (sectionOrder.sections && sectionOrder.sections.length)
    ? sectionOrder.sections
    : ["about", "education", "skills", "experience", "portfolio", "contact"];
  ids.forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) main.appendChild(sec);
  });
}
function getDragAfterSection(container, y, dragging) {
  const els = Array.from(container.querySelectorAll(".section, .cta")).filter((el) => el !== dragging);
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: -Infinity, element: null }).element;
}
function enableSectionReorder() {
  const main = document.querySelector("main");
  if (!main) return;
  main.querySelectorAll(".section, .cta").forEach((sec) => {
    const handle = document.createElement("div");
    handle.className = "section__handle";
    handle.title = "拖拽调整板块顺序";
    handle.textContent = "⋮⋮";
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sec.classList.add("is-dragging");
      function move(ev) {
        const after = getDragAfterSection(main, ev.clientY, sec);
        if (after == null) main.appendChild(sec);
        else main.insertBefore(sec, after);
      }
      function up() {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        sec.classList.remove("is-dragging");
        sectionOrder.sections = Array.from(main.querySelectorAll(".section, .cta")).map((s) => s.id).filter(Boolean);
      }
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
    sec.insertBefore(handle, sec.firstChild);
  });
}
function disableSectionReorder() {
  document.querySelectorAll(".section__handle").forEach((h) => h.remove());
  document.querySelectorAll(".section, .cta").forEach((s) => s.classList.remove("is-dragging"));
}

function onImgSlotClick(e) {
  if (!editing) return;
  if (window.__eduDragMoved && window.__eduDragMoved()) return;
  e.preventDefault();
  currentImgSlot = e.currentTarget;
  imgInput.click();
}
function enableEditing() {
  editing = true;
  document.body.classList.add("is-editing");
  showEditorBar(true);
  // 静态文本可编辑
  document.querySelectorAll("[data-edit]").forEach((el) => {
    if (el.closest("#works-grid")) return;
    if (el.classList.contains("img-slot")) return; // 图片框只调样式（圆角/形状），不进入文本编辑，避免破坏 img
    el.setAttribute("contenteditable", "true");
    const key = el.dataset.edit;
    el.addEventListener("input", () => {
      const clone = el.cloneNode(true);
      clone.querySelectorAll(".style-dot").forEach((d) => d.remove());
      texts[key] = clone.innerHTML;
    });
  });
  paint();        // 重新渲染卡片（带编辑态）
  renderExperience();
  renderSkills();
  renderOverlays();
  enableSectionReorder();
  addStyleDots();
  applyUserStyles();
  applyEducationLayout();
  enableEducationEditor();
  // 图片占位槽点击上传
  document.querySelectorAll(".img-slot").forEach((slot) => {
    slot.style.cursor = slot.classList.contains("edu__img") ? "move" : "pointer";
    slot.title = "点击上传图片";
    slot.addEventListener("click", onImgSlotClick);
  });
  startDraftAutoSave();
  setStatus("已登录 · 直接点击页面上的文字即可编辑；悬浮右上角 🎨 可改单元素样式；工具栏「🎨 设计」改全局配色/字体/排版（每 5 秒自动保存草稿到浏览器）");
}
function exitEdit() {
  editing = false;
  document.body.classList.remove("is-editing");
  showEditorBar(false);
  removeStyleDots();
  disableSectionReorder();
  document.querySelectorAll("[data-edit]").forEach((el) => el.removeAttribute("contenteditable"));
  document.querySelectorAll(".img-slot").forEach((slot) => {
    slot.style.cursor = "";
    slot.title = "";
    slot.removeEventListener("click", onImgSlotClick);
  });
  history.replaceState(null, "", location.pathname);
  paint();
  renderExperience();
  renderSkills();
  renderOverlays();
  clearDraft();
}

/* ============================================================
   设计面板（颜色 / 字体 / 排版自由编辑）
   ============================================================ */
function openThemePanel() {
  const panel = document.getElementById("theme-modal");
  if (!panel) return;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  const c = theme.colors;
  document.getElementById("tm-sage").value = c.sage;
  document.getElementById("tm-sageDark").value = c.sageDark;
  document.getElementById("tm-sageSoft").value = c.sageSoft;
  document.getElementById("tm-ink").value = c.ink;
  document.getElementById("tm-bg").value = c.bg;
  document.getElementById("tm-bgDark").value = c.bgDark;
  document.getElementById("tm-surface").value = c.surface;
  document.getElementById("tm-muted").value = c.muted;
  document.getElementById("tm-line").value = c.line;
  fillFontSelect("tm-display", theme.fonts.display);
  fillFontSelect("tm-body", theme.fonts.body);
  document.getElementById("tm-radius").value = theme.layout.radius;
  document.getElementById("tm-radius-val").textContent = theme.layout.radius + "px";
  document.getElementById("tm-maxw").value = theme.layout.maxw;
  document.getElementById("tm-maxw-val").textContent = theme.layout.maxw + "px";
  document.getElementById("tm-fontScale").value = theme.layout.fontScale;
  document.getElementById("tm-fontScale-val").textContent = theme.layout.fontScale.toFixed(2) + "×";
  document.getElementById("tm-sectionPad").value = theme.layout.sectionPad;
  document.getElementById("tm-sectionPad-val").textContent = theme.layout.sectionPad + "px";
}
function closeThemePanel() {
  const panel = document.getElementById("theme-modal");
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}
function fillFontSelect(id, current) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = FONT_OPTIONS.map((o) => `<option value='${o.v}'>${o.label}</option>`).join("");
  const match = FONT_OPTIONS.find((o) => o.v === current) || FONT_OPTIONS[0];
  sel.value = match.v;
}
function bindThemePanel() {
  const bindColor = (id, path) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => { theme.colors[path] = el.value; applyUserTheme(); });
  };
  bindColor("tm-sage", "sage"); bindColor("tm-sageDark", "sageDark"); bindColor("tm-sageSoft", "sageSoft");
  bindColor("tm-ink", "ink"); bindColor("tm-bg", "bg"); bindColor("tm-bgDark", "bgDark");
  bindColor("tm-surface", "surface"); bindColor("tm-muted", "muted"); bindColor("tm-line", "line");
  const disp = document.getElementById("tm-display");
  const body = document.getElementById("tm-body");
  if (disp) disp.addEventListener("change", () => { theme.fonts.display = disp.value; applyUserTheme(); });
  if (body) body.addEventListener("change", () => { theme.fonts.body = body.value; applyUserTheme(); });
  const bindRange = (id, valId, path, fmt) => {
    const el = document.getElementById(id), val = document.getElementById(valId);
    if (el) el.addEventListener("input", () => {
      theme.layout[path] = parseFloat(el.value);
      if (val) val.textContent = fmt(el.value);
      applyUserTheme();
    });
  };
  bindRange("tm-radius", "tm-radius-val", "radius", (v) => v + "px");
  bindRange("tm-maxw", "tm-maxw-val", "maxw", (v) => v + "px");
  bindRange("tm-fontScale", "tm-fontScale-val", "fontScale", (v) => parseFloat(v).toFixed(2) + "×");
  bindRange("tm-sectionPad", "tm-sectionPad-val", "sectionPad", (v) => v + "px");
  const reset = document.getElementById("tm-reset");
  if (reset) reset.addEventListener("click", () => {
    theme = defaultTheme(); applyUserTheme(); openThemePanel();
    setStatus("已重置为默认主题（点保存后生效）");
  });
  const close = document.getElementById("tm-close");
  if (close) close.addEventListener("click", closeThemePanel);
  document.querySelectorAll("[data-tm-close]").forEach((el) => el.addEventListener("click", closeThemePanel));
}

/* 元素级样式点：编辑模式下每个 [data-edit] 元素右上角出现画笔，点击调样式 */
function addStyleDots() {
  document.querySelectorAll("[data-edit]").forEach((el) => {
    if (el.closest("#works-grid")) return;
    if (el.querySelector(":scope > .style-dot")) return;
    const dot = document.createElement("span");
    dot.className = "style-dot";
    dot.setAttribute("contenteditable", "false");
    dot.textContent = "🎨";
    dot.title = "调整此元素样式（颜色 / 字号 / 对齐）";
    dot.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); openStylePop(el); });
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.appendChild(dot);
  });
}
function removeStyleDots() {
  document.querySelectorAll(".style-dot").forEach((d) => d.remove());
  closeStylePop();
}
function openStylePop(el) {
  const key = el.dataset.edit;
  let pop = document.getElementById("style-pop");
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "style-pop"; pop.className = "style-pop";
    pop.innerHTML = `
      <div class="style-pop__title">元素样式</div>
      <label>文字颜色 <input type="color" id="sp-color"></label>
      <label>字号(px) <input type="number" id="sp-size" min="10" max="120" step="1"></label>
      <label>字重
        <select id="sp-weight"><option value="">默认</option><option value="400">常规</option><option value="500">中黑</option><option value="700">加粗</option></select>
      </label>
      <label>对齐
        <select id="sp-align"><option value="">默认</option><option value="left">左</option><option value="center">中</option><option value="right">右</option></select>
      </label>
      <label>圆角(px) <input type="number" id="sp-radius" min="0" max="400" step="1"></label>
      <div class="style-pop__actions">
        <button type="button" id="sp-reset" class="btn btn--ghost btn--small">清除</button>
        <button type="button" id="sp-close" class="btn btn--primary btn--small">完成</button>
      </div>`;
    document.body.appendChild(pop);
    pop.querySelector("#sp-color").addEventListener("input", () => setStyle(key, "color", pop.querySelector("#sp-color").value));
    pop.querySelector("#sp-size").addEventListener("input", () => setStyle(key, "fontSize", pop.querySelector("#sp-size").value));
    pop.querySelector("#sp-weight").addEventListener("change", () => setStyle(key, "fontWeight", pop.querySelector("#sp-weight").value));
    pop.querySelector("#sp-align").addEventListener("change", () => setStyle(key, "textAlign", pop.querySelector("#sp-align").value));
    pop.querySelector("#sp-radius").addEventListener("input", () => setStyle(key, "radius", pop.querySelector("#sp-radius").value));
    pop.querySelector("#sp-reset").addEventListener("click", () => { styles[key] = {}; applyUserStyles(); syncStylePop(key); setStatus("已清除该元素样式"); });
    pop.querySelector("#sp-close").addEventListener("click", closeStylePop);
  }
  const s = styles[key] || {};
  pop.querySelector("#sp-color").value = s.color || "#2A3654";
  pop.querySelector("#sp-size").value = s.fontSize || "";
  pop.querySelector("#sp-weight").value = s.fontWeight || "";
  pop.querySelector("#sp-align").value = s.textAlign || "";
  pop.dataset.key = key;
  pop.classList.add("is-open");
  const r = el.getBoundingClientRect();
  pop.style.top = (window.scrollY + r.top) + "px";
  pop.style.left = (window.scrollX + r.right + 8) + "px";
}
function syncStylePop(key) {
  const pop = document.getElementById("style-pop");
  if (!pop || pop.dataset.key !== key) return;
  const s = styles[key] || {};
  pop.querySelector("#sp-color").value = s.color || "#2A3654";
  pop.querySelector("#sp-size").value = s.fontSize || "";
  pop.querySelector("#sp-weight").value = s.fontWeight || "";
  pop.querySelector("#sp-align").value = s.textAlign || "";
  pop.querySelector("#sp-radius").value = s.radius || "";
}
function setStyle(key, prop, val) {
  if (!styles[key]) styles[key] = {};
  if (val === "" || val == null) delete styles[key][prop];
  else styles[key][prop] = (prop === "fontSize" || prop === "radius") ? parseInt(val, 10) : val;
  applyUserStyles();
}
function closeStylePop() {
  const pop = document.getElementById("style-pop");
  if (pop) pop.classList.remove("is-open");
}

// 初始化：确保编辑栏默认隐藏
showEditorBar(false);
editorBar.addEventListener("click", (e) => {
  const add = e.target.dataset.add;
  const act = e.target.dataset.action;
  if (add === "work") openWorkModal(null);
  else if (add === "cat") openCatModal();
  else if (add) addOverlay(add);
  if (act === "save") saveContent();
  if (act === "exit") exitEdit();
  if (act === "theme") openThemePanel();
});
bindThemePanel();

/* 纯 JS SHA-256（不依赖 crypto.subtle，file:// 或受限浏览器也能用） */
function sha256JS(s) {
  const rrot = (x, n) => (x >>> n) | (x << (32 - n));
  const K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);
  const utf8 = new TextEncoder().encode(s);
  const bitLen = utf8.length * 8;
  const withOne = utf8.length + 1;
  const pad = (56 - (withOne % 64) + 64) % 64;
  const total = withOne + pad + 8;
  const msg = new Uint8Array(total);
  msg.set(utf8);
  msg[utf8.length] = 0x80;
  const dv = new DataView(msg.buffer);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
  dv.setUint32(total - 4, bitLen >>> 0);
  let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
  const w = new Uint32Array(64);
  for (let i = 0; i < total; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4);
    for (let j = 16; j < 64; j++) {
      const s0 = rrot(w[j-15],7) ^ rrot(w[j-15],18) ^ (w[j-15] >>> 3);
      const s1 = rrot(w[j-2],17) ^ rrot(w[j-2],19) ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,hh=h7;
    for (let j = 0; j < 64; j++) {
      const S1 = rrot(e,6) ^ rrot(e,11) ^ rrot(e,25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = rrot(a,2) ^ rrot(a,13) ^ rrot(a,22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh=g; g=f; f=e; e=(d + t1) >>> 0; d=c; c=b; b=a; a=(t1 + t2) >>> 0;
    }
    h0=(h0+a)>>>0; h1=(h1+b)>>>0; h2=(h2+c)>>>0; h3=(h3+d)>>>0; h4=(h4+e)>>>0; h5=(h5+f)>>>0; h6=(h6+g)>>>0; h7=(h7+hh)>>>0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7].map((x) => x.toString(16).padStart(8, "0")).join("");
}
async function sha256Hex(str) {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) { /* 降级到纯 JS */ }
  return sha256JS(str);
}
function cleanPasswordInput(raw) {
  if (!raw) return "";
  // 去掉前后空格 + 所有常见 Unicode 空白/零宽字符（包括全角空格、不间断空格、零宽空格等）
  return raw
    .replace(/[\s\u00A0\u2000-\u200D\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g, "")
    .trim();
}
/* ---------- 自定义登录弹窗（替代原生 prompt，避免显示假空格 + 不泄露密码） ---------- */
function openLoginModal() {
  const m = document.getElementById("login-modal");
  if (!m) return;
  m.classList.add("is-open");
  m.setAttribute("aria-hidden", "false");
  const inp = document.getElementById("login-pw");
  if (inp) { inp.value = ""; hideLoginError(); setTimeout(() => inp.focus(), 50); }
  document.body.style.overflow = "hidden";
}
function closeLoginModal() {
  const m = document.getElementById("login-modal");
  if (!m) return;
  m.classList.remove("is-open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function showLoginError(msg) {
  const el = document.getElementById("login-error");
  if (el) { el.textContent = msg; el.hidden = false; }
}
function hideLoginError() {
  const el = document.getElementById("login-error");
  if (el) { el.textContent = ""; el.hidden = true; }
}
async function submitLogin() {
  const inp = document.getElementById("login-pw");
  if (!inp) return;
  const clean = cleanPasswordInput(inp.value);
  if (!clean) { showLoginError("请输入密码"); return; }
  const hash = await sha256Hex(clean);
  if (hash === (SITE_CONFIG.editPasswordHash || "")) {
    closeLoginModal();
    enableEditing();
  } else {
    // 安全：错误提示绝不回显正确密码
    showLoginError("密码错误，请重试。");
    inp.select();
  }
}
function bindLoginModal() {
  const m = document.getElementById("login-modal");
  if (!m) return;
  m.querySelectorAll("[data-login-close]").forEach((el) => el.addEventListener("click", closeLoginModal));
  const ok = document.getElementById("login-ok");
  if (ok) ok.addEventListener("click", submitLogin);
  const inp = document.getElementById("login-pw");
  if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") submitLogin(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && m.classList.contains("is-open")) closeLoginModal();
  });
}
bindLoginModal();

// 入口 1：网址 ?edit=1
(function initEditor() {
  const key = SITE_CONFIG.editQueryKey || "edit";
  if (new URLSearchParams(location.search).get(key) === "1") openLoginModal();
})();
// 入口 2：右下角「站长登录」按钮
document.getElementById("login-entry").addEventListener("click", openLoginModal);

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
  const draft = loadDraft();
  if (draft && draft.savedAt) {
    const ageMin = (Date.now() - draft.savedAt) / 60000;
    if (ageMin < 60 * 24 * 7) {
      if (confirm(`检测到 ${new Date(draft.savedAt).toLocaleString()} 的未保存编辑草稿，是否恢复？\n点击“确定”恢复草稿，点击“取消”丢弃草稿（不可恢复）。`)) {
        applyDraft(draft);
      } else {
        clearDraft();
      }
    }
  }
  applyUserTheme();
  applyTexts();
  applyImages();
  paint();
  renderExperience();
  renderSkills();
  applySectionOrder();
  applyUserStyles();
  applyEducationLayout();

  /* 从经历详情页“查看作品”跳转回来时自动打开作品弹窗 */
  const workParam = new URLSearchParams(location.search).get("work");
  if (workParam) {
    const targetWork = (works || []).find((w) => w.id === workParam);
    if (targetWork) {
      setTimeout(() => {
        openModal(targetWork);
        const portfolio = document.getElementById("portfolio");
        if (portfolio) portfolio.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }
});
