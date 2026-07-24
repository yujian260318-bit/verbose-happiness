(function () {
  "use strict";

  /* 在当前页插入作品弹窗 DOM（如果尚未存在） */
  if (!document.getElementById("modal")) {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
  <div class="modal" id="modal" aria-hidden="true">
    <div class="modal__backdrop" data-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true">
      <button class="modal__close" data-close aria-label="关闭">×</button>
      <div class="modal__media" id="modal-media"></div>
      <div class="modal__body">
        <span class="modal__cat" id="modal-cat"></span>
        <h3 class="modal__title" id="modal-title"></h3>
        <p class="modal__meta" id="modal-meta"></p>
        <p class="modal__role" id="modal-role"></p>
        <div class="modal__metrics" id="modal-metrics"></div>
        <p class="modal__desc" id="modal-desc"></p>
        <div class="modal__doc" id="modal-content"></div>
        <div class="modal__links" id="modal-links"></div>
      </div>
    </div>
  </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  const modal = document.getElementById("modal");
  const modalMedia = document.getElementById("modal-media");

  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }
  function videoUrlOf(v) { return v && typeof v === "object" ? (v.url || "") : (typeof v === "string" ? v : ""); }
  function basename(p) {
    if (!p) return "";
    return p.split("/").pop().split("\\").pop();
  }
  function safeShort(url) {
    if (!url) return "";
    return url.length > 60 ? url.slice(0, 40) + "…" + url.slice(-12) : url;
  }
  function detectVideo(url) {
    if (!url) return "link";
    if (url.startsWith("data:") || url.startsWith("blob:")) return "mp4";
    if (url.startsWith("assets/")) return "mp4";
    if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(url)) return "mp4";
    const lower = url.toLowerCase();
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
        wraps.forEach((otherWrap) => {
          if (otherWrap === wrap) return;
          const other = otherWrap.querySelector("video");
          if (other && !other.paused) other.pause();
        });
      });
      video.addEventListener("pause", () => { if (!video.ended) wrap.classList.remove("is-playing"); });
      video.addEventListener("ended", () => wrap.classList.remove("is-playing"));
    });
    reorderVideosByOrientation(root);
  }
  function reorderVideosByOrientation(root) {
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
        setTimeout(() => { if (video.readyState >= 1) apply(); }, 8000);
      }));
      Promise.all(promises).then((results) => {
        results.sort((a, b) => a.isPortrait - b.isPortrait);
        results.forEach((r) => group.appendChild(r.vid));
      });
    });
  }
  function isPortraitVideo(v) {
    if (v && typeof v === "object") {
      if (v.portrait === true) return true;
      if (v.portrait === false) return false;
    }
    const url = videoUrlOf(v);
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
  function workBadge(w) {
    const kinds = [];
    if ((w.videoUrls || []).length) kinds.push("视频");
    (w.media || []).forEach((m) => { if (m.kind && !kinds.includes(m.kind)) kinds.push(m.kind); });
    if (!kinds.length) return w.type || "视频";
    if (kinds.length === 1) return kinds[0];
    return "合集";
  }

  function openWorkModal(w) {
    document.getElementById("modal-cat").textContent = `${w.category || ""} · ${workBadge(w)}`;
    document.getElementById("modal-title").textContent = w.title;
    document.getElementById("modal-meta").textContent = `${w.company || ""} · ${w.period || ""}`;
    document.getElementById("modal-role").textContent = w.role || "";
    document.getElementById("modal-metrics").innerHTML =
      (w.metrics || []).map((m) => `<span class="tag">${m.label}：${m.value}</span>`).join("");
    document.getElementById("modal-desc").textContent = w.description;

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
  }

  function closeWorkModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalMedia.innerHTML = "";
    document.body.style.overflow = "";
  }

  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeWorkModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWorkModal(); });

  window.openWorkModal = openWorkModal;
})();
