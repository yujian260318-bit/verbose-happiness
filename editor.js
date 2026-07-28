(function () {
  "use strict";
  const ED = { token: "" };
  const OWNER = "yujian260318-bit", REPO = "verbose-happiness", BRANCH = "main";
  // 体积阈值：超过此大小的图片/PDF 一律作为 assets/ 资源外置上传，禁止内嵌进 content.json，
  // 避免文件体积膨胀触发 GitHub "file is too large" 422。
  const MAX_INLINE_BYTES = 200 * 1024;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    }[c]));
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function api(method, path, body, token) {
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    if (method === "GET") url += `?ref=${BRANCH}`;
    const opt = { method, headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/vnd.github+json",
      "User-Agent": "portfolio-editor",
      "Content-Type": "application/json"
    }};
    if (body) opt.body = JSON.stringify(body);
    return fetch(url, opt).then(async r => {
      const text = await r.text().catch(() => "");
      return { status: r.status, text };
    });
  }
  function getContent(token) {
    return api("GET", "content.json", null, token).then(({ status, text }) => {
      if (status !== 200) throw new Error(`读取 content.json 失败 (${status})：${text.slice(0, 240)}`);
      if (!text.trim()) throw new Error("读取 content.json 失败：服务器返回空响应");
      const j = JSON.parse(text);
      const data = JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\s/g, "")))));
      return { sha: j.sha, data };
    });
  }
  function putContent(obj, token) {
    return getContent(token).then(({ sha }) => {
      return api("PUT", "content.json", {
        message: "Edit via visual editor",
        content: btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2)))),
        sha, branch: BRANCH
      }, token);
    });
  }
  function putAsset(relPath, b64, token) {
    return api("GET", relPath, null, token).then(({ status, text }) => {
      if (status !== 200 && status !== 404) throw new Error(`读取 ${relPath} 失败 (${status})：${text.slice(0, 240)}`);
      if (status === 200 && !text.trim()) throw new Error(`读取 ${relPath} 失败：服务器返回空响应`);
      const body = { message: "Upload " + relPath, content: b64, branch: BRANCH };
      if (status === 200) body.sha = JSON.parse(text).sha;
      return api("PUT", relPath, body, token);
    });
  }

  // 渲染一个 block 为可拖拽/可缩放节点
  function renderBlock(b, idx, ctx) {
    const node = el("div", "ed-block ed-block--" + b.type);
    node.style.left = (b.x != null ? b.x : 20) + "px";
    node.style.top = (b.y != null ? b.y : 20 + idx * 60) + "px";
    if (b.w) node.style.width = b.w + "px";
    if (b.h) {
      if (b.type === "text") node.style.minHeight = (b.h || 60) + "px";
      else if (b.type === "pdf") { if (ctx.editable) node.style.height = (b.h || 60) + "px"; }
      else node.style.height = (b.h || 60) + "px";
    }

    if (b.type === "text") {
      const c = el("div", "ed-text");
      c.innerHTML = b.html != null ? b.html : esc(b.text || "");
      if (ctx.editable) c.contentEditable = "true";
      node.appendChild(c);
    } else if (b.type === "image") {
      const im = el("img", "ed-img");
      im.src = b.src || "";
      im.alt = b.caption || "";
      node.appendChild(im);
      if (b.caption) node.appendChild(el("figcaption", null, esc(b.caption)));
    } else if (b.type === "video") {
      const v = el("video", "ed-video");
      v.src = b.src || "";
      v.controls = !ctx.editable;
      v.playsInline = true;
      v.muted = true;
      v.preload = "metadata";
      v.crossOrigin = "anonymous";
      if (b.poster) v.poster = b.poster;
      node.appendChild(v);
      if (ctx.editable) {
        // 编辑模式：优先显示视频画面；若未设置 poster，自动抓取第一帧
        const ensurePoster = () => {
          if (b.poster || !v.videoWidth) return;
          try {
            v.currentTime = 0.1;
            v.addEventListener("seeked", function once() {
              v.removeEventListener("seeked", once);
              try {
                const canvas = document.createElement("canvas");
                canvas.width = v.videoWidth || 320;
                canvas.height = v.videoHeight || 180;
                const ctx2d = canvas.getContext("2d");
                ctx2d.drawImage(v, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                b.poster = dataUrl;
                v.poster = dataUrl;
              } catch (_) {}
            });
          } catch (_) {}
        };
        v.addEventListener("loadedmetadata", ensurePoster, { once: true });
        if (v.readyState >= 1) ensurePoster();
        // 网络异常或加载极慢时显示备用提示，而不是纯黑
        const showHint = () => {
          let hint = node.querySelector(".ed-video-hint");
          if (!hint) {
            hint = el("div", "ed-video-hint");
            hint.innerHTML = `<div class="ed-video-hint__icon">▶</div><div class="ed-video-hint__label">${esc(b.label || "视频")}</div><div class="ed-video-hint__dim">${(b.w || 280)} × ${(b.h || 160)}</div>`;
            node.appendChild(hint);
          }
        };
        v.addEventListener("error", showHint);
        const hintTimer = setTimeout(showHint, 4000);
        const hideHint = () => {
          const hint = node.querySelector(".ed-video-hint");
          if (hint) hint.remove();
        };
        v.addEventListener("loadeddata", () => { clearTimeout(hintTimer); hideHint(); }, { once: true });
        v.addEventListener("canplay", () => { clearTimeout(hintTimer); hideHint(); }, { once: true });
      }
      if (b.label) node.appendChild(el("figcaption", null, esc(b.label)));
    } else if (b.type === "pdf") {
      // href 编码：相对路径含中文/空格时需 encodeURI；data: 内联不做编码
      const rawHref = b.src || "#";
      const href = (rawHref && rawHref.startsWith("data:")) ? rawHref : (rawHref ? encodeURI(rawHref) : "#");
      // 卡片：图标 + 文件名 + 一行纯文字链接（点击预览 / 下载，二者同样式、同字号）
      const card = el("div", "ed-pdf");
      const icon = el("span", "ed-pdf-icon", "📄");
      const info = el("span", "ed-pdf-info");
      info.appendChild(el("strong", null, esc(b.label || "PDF 文件")));
      const meta = el("span", "ed-pdf-meta");
      const view = el("a", "ed-pdf-link");
      view.href = href;
      view.target = "_blank";
      view.rel = "noopener";
      view.textContent = "点击预览";
      meta.appendChild(view);
      meta.appendChild(document.createTextNode("     ")); // 5 个空格分隔
      const dl = el("a", "ed-pdf-link");
      dl.href = href;
      dl.setAttribute("download", (b.label || "pdf") + ".pdf");
      dl.rel = "noopener";
      dl.textContent = "下载";
      meta.appendChild(dl);
      info.appendChild(meta);
      card.appendChild(icon);
      card.appendChild(info);
      node.appendChild(card);
      const wrap = el("div", "ed-links");
      (b.items || []).forEach(it => {
        const a = el("a", null, esc(it.platform || "链接") + " ↗");
        a.href = it.url || "#"; a.target = "_blank"; a.rel = "noopener";
        wrap.appendChild(a);
      });
      node.appendChild(wrap);
    } else if (b.type === "heading") {
      const h = el("h3", "ed-heading", esc(b.text || ""));
      if (ctx.editable) h.contentEditable = "true";
      node.appendChild(h);
    } else {
      node.appendChild(el("div", null, esc(JSON.stringify(b)).slice(0, 80)));
    }

    if (ctx.editable) {
      const bar = el("div", "ed-bar");
      bar.appendChild(el("span", "ed-grip", "✥ 拖动移动"));
      const dimBadge = el("span", "ed-dim", `${b.w || 0} × ${b.h || 0}`);
      bar.appendChild(dimBadge);
      const del = el("button", "ed-del", "✕");
      del.title = "删除";
      del.addEventListener("click", () => { ctx.blocks.splice(idx, 1); ctx.rerender(); });
      bar.appendChild(del);
      node.appendChild(bar);

      const rs = el("div", "ed-resize");
      rs.title = "拖拽调整大小";
      node.appendChild(rs);

      // 判断点击目标是否应触发拖拽（排除文字编辑区、删除按钮、缩放柄、PDF 链接）
      function shouldDrag(e) {
        if (e.target === del || e.target.closest(".ed-resize")) return false;
        if (e.target.closest(".ed-text") || e.target.closest(".ed-heading")) return false;
        if (e.target.closest(".ed-pdf")) return false;
        return true;
      }

      // 拖动移动：点击块内任意有效区域即可拖动
      node.addEventListener("pointerdown", (e) => {
        if (!shouldDrag(e)) return;
        e.preventDefault();
        try { node.setPointerCapture(e.pointerId); } catch (_) {}
        const sx = e.clientX, sy = e.clientY;
        const ol = parseInt(node.style.left) || 0, ot = parseInt(node.style.top) || 0;
        node.classList.add("is-dragging");
        function mv(ev) {
          node.style.left = (ol + ev.clientX - sx) + "px";
          node.style.top = (ot + ev.clientY - sy) + "px";
        }
        function up() {
          try { node.releasePointerCapture(e.pointerId); } catch (_) {}
          node.removeEventListener("pointermove", mv);
          node.removeEventListener("pointerup", up);
          node.classList.remove("is-dragging");
          b.x = parseInt(node.style.left); b.y = parseInt(node.style.top);
        }
        node.addEventListener("pointermove", mv);
        node.addEventListener("pointerup", up);
      });
      // 缩放
      rs.addEventListener("pointerdown", (e) => {
        e.preventDefault(); e.stopPropagation();
        try { rs.setPointerCapture(e.pointerId); } catch (_) {}
        const sx = e.clientX, sy = e.clientY;
        const ow = node.offsetWidth, oh = node.offsetHeight;
        const dim = node.querySelector(".ed-dim");
        function mv(ev) {
          const nw = Math.max(80, ow + ev.clientX - sx);
          const nh = Math.max(40, oh + ev.clientY - sy);
          node.style.width = nw + "px";
          node.style.height = nh + "px";
          node.style.minHeight = nh + "px";
          if (dim) dim.textContent = `${Math.round(nw)} × ${Math.round(nh)}`;
          const hintDim = node.querySelector(".ed-video-hint__dim");
          if (hintDim) hintDim.textContent = `${Math.round(nw)} × ${Math.round(nh)}`;
        }
        function up() {
          try { rs.releasePointerCapture(e.pointerId); } catch (_) {}
          rs.removeEventListener("pointermove", mv);
          rs.removeEventListener("pointerup", up);
          b.w = parseInt(node.style.width);
          b.h = parseInt(node.style.height) || parseInt(node.style.minHeight);
          if (dim) dim.textContent = `${b.w} × ${b.h}`;
          const hintDim = node.querySelector(".ed-video-hint__dim");
          if (hintDim) hintDim.textContent = `${b.w} × ${b.h}`;
        }
        rs.addEventListener("pointermove", mv);
        rs.addEventListener("pointerup", up);
      });
      // 文字实时同步
      node.addEventListener("input", () => {
        if (b.type === "text") b.html = node.querySelector(".ed-text").innerHTML;
        if (b.type === "heading") b.text = node.querySelector(".ed-heading").innerText;
      });
    }
    return node;
  }

  ED.render = function (container, record, opts) {
    opts = opts || {};
    const editable = !!opts.editable;
    const source = opts.source; // 'exp' | 'work'
    const id = record.id;
    let blocks = Array.isArray(record.blocks) ? JSON.parse(JSON.stringify(record.blocks)) : [];

    // 作品弹窗编辑：把已有的 videoUrls 也导入成可拖拽视频块
    if (source === "work" && Array.isArray(record.videoUrls)) {
      record.videoUrls.forEach((v, i) => {
        const isObj = typeof v === "object";
        const url = isObj ? (v.url || "") : v;
        if (!url || blocks.some((b) => b.type === "video" && b.src === url)) return;
        const lower = url.toLowerCase();
        const isPortrait = (isObj && v.portrait === true) || /vertical|portrait|竖版|9.?16|预告/.test(lower);
        const w0 = isPortrait ? 320 : 760;
        const h0 = isPortrait ? 568 : 428;
        blocks.push({
          type: "video",
          src: url,
          poster: isObj ? (v.poster || "") : "",
          label: isObj ? (v.label || "") : "",
          x: 20,
          y: 60 + i * (h0 + 32),
          w: w0,
          h: h0,
          _fromVideoUrl: true,
          _meta: isObj ? v : { type: "mp4", url: v, label: "视频 " + (i + 1) }
        });
      });
    }

    container.innerHTML = "";
    // 固定头部（仅详情页需要；作品弹窗已有标题，可跳过）
    if (!opts.skipHead) {
      const head = el("div", "ed-head");
      head.innerHTML =
        (record.tag ? `<span class="tag">${esc(record.tag)}</span>` : "") +
        `<h1>${esc(record.role || record.company || "")}</h1>` +
        (record.company ? `<div class="company">${esc(record.company)}</div>` : "") +
        (record.period ? `<div class="meta">${esc(record.location ? record.location + " ｜ " : "")}${esc(record.period)}</div>` : "");
      container.appendChild(head);
    }

    const canvas = el("div", "ed-canvas");
    if (editable) canvas.classList.add("ed-canvas--edit");
    container.appendChild(canvas);

    const ctx = { editable, blocks, rerender: paint };
    function paint() {
      canvas.innerHTML = "";
      if (!blocks.length && !editable) {
        canvas.appendChild(el("p", null, "暂无内容块。"));
        return;
      }
      blocks.forEach((b, i) => canvas.appendChild(renderBlock(b, i, ctx)));
      // 根据内容撑开画布，避免绝对定位块被截断
      requestAnimationFrame(() => {
        const nodes = canvas.querySelectorAll(".ed-block");
        let maxH = 0;
        nodes.forEach((node) => {
          const top = parseInt(node.style.top) || 0;
          const h = node.offsetHeight || parseInt(node.style.minHeight) || 60;
          if (top + h > maxH) maxH = top + h;
        });
        if (maxH > 0) canvas.style.height = (maxH + 20) + "px";
      });
    }
    paint();

    const showToolbar = opts.showToolbar !== false;
    const showSave = opts.showSave !== false;
    const onSave = opts.onSave;

    if (editable && showToolbar) {
      const hint = el("div", "ed-hint", "提示：拖动视频/图片块移动位置，拖右下角绿色方块改大小；文字块双击编辑。");
      container.insertBefore(hint, canvas);

      // 工具栏
      const tb = el("div", "ed-toolbar");
      const addText = el("button", null, "+ 文字");
      addText.addEventListener("click", () => {
        blocks.push({ type: "text", html: "双击编辑文字", x: 20, y: canvas.scrollHeight + 10, w: 360 });
        paint();
      });
      const addImg = el("button", null, "+ 图片");
      const fileInput = el("input"); fileInput.type = "file"; fileInput.accept = "image/*"; fileInput.style.display = "none";
      addImg.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (f.size > MAX_INLINE_BYTES) {
          console.info(`[editor] 图片 ${f.name} (${(f.size/1024).toFixed(0)}KB) 超过内嵌阈值，将作为 assets/ 资源上传，不写入 content.json`);
        }
        const r = new FileReader();
        r.onload = () => {
          const filename = `assets/${Date.now()}_${f.name.replace(/\s+/g, "_")}`;
          if (opts.pendingImageFiles && Array.isArray(opts.pendingImageFiles)) {
            opts.pendingImageFiles.push({ name: filename, file: r.result, url: r.result });
            // 本地预览用 dataURL，推送时再换成 GitHub 路径
            blocks.push({ type: "image", x: 20, y: canvas.scrollHeight + 10, w: 280, src: r.result, _name: filename });
          } else {
            // 在独立详情页编辑时，本地暂存文件名，保存时直接上传
            blocks.push({ type: "image", x: 20, y: canvas.scrollHeight + 10, w: 280, src: r.result, _name: filename, _file: { name: f.name } });
          }
          paint();
        };
        r.readAsDataURL(f);
      });
      const addVid = el("button", null, "+ 视频框");
      addVid.addEventListener("click", () => {
        const url = prompt("粘贴视频直链（mp4）：", "");
        if (!url) return;
        const label = prompt("视频标签（可选，如“Talib 正片”）：", "") || "";
        blocks.push({ type: "video", src: url, x: 20, y: canvas.scrollHeight + 10, w: 420, h: 240, label: label });
        paint();
      });
      const addPdf = el("button", null, "+ PDF");
      const pdfInput = el("input"); pdfInput.type = "file"; pdfInput.accept = ".pdf,application/pdf"; pdfInput.style.display = "none";
      addPdf.addEventListener("click", () => pdfInput.click());
      pdfInput.addEventListener("change", (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (f.size > MAX_INLINE_BYTES) {
          console.info(`[editor] PDF ${f.name} (${(f.size/1024).toFixed(0)}KB) 超过内嵌阈值，将作为 assets/ 资源上传，不写入 content.json`);
        }
        const r = new FileReader();
        r.onload = () => {
          const filename = `assets/${Date.now()}_${f.name.replace(/\s+/g, "_")}`;
          if (opts.pendingImageFiles && Array.isArray(opts.pendingImageFiles)) {
            opts.pendingImageFiles.push({ name: filename, file: r.result, url: r.result });
          }
          blocks.push({ type: "pdf", x: 20, y: canvas.scrollHeight + 10, w: 260, h: 80, src: r.result, _name: filename, label: f.name, _file: { name: f.name } });
          paint();
        };
        r.readAsDataURL(f);
      });
      tb.appendChild(addText);
      tb.appendChild(addImg);
      tb.appendChild(addVid);
      tb.appendChild(addPdf);
      tb.appendChild(fileInput);
      tb.appendChild(pdfInput);

      if (showSave) {
        const saveBtn = el("button", "ed-save", "💾 保存");
        saveBtn.addEventListener("click", () => save());
        tb.appendChild(saveBtn);
      }
      container.insertBefore(tb, canvas);

      async function save() {
        const saveBtn = container.querySelector(".ed-save");
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "保存中…"; }
        try {
          if (!ED.token) {
            const pageToken = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("gh_token")) || "";
            if (pageToken) ED.token = pageToken;
          }
          if (!ED.token) {
            const t = prompt("请输入 GitHub Token 以保存（仅本次使用，不会存储）：");
            if (!t) { alert("未输入 Token，已取消保存。"); return; }
            ED.token = t.trim();
          }
          // 上传新图片 / PDF（dataURL 且不是外部链接）
          for (const b of blocks) {
            if ((b._file || (b._name && b.src && b.src.startsWith("data:"))) && !opts.pendingImageFiles) {
              const rel = b._name || ("assets/" + Date.now() + "_" + (b._file ? b._file.name.replace(/\s/g, "_") : "upload.jpg"));
              const b64 = b.src.split(",")[1];
              const res = await putAsset(rel, b64, ED.token);
              if (res.status >= 400) throw new Error(`${b.type === "pdf" ? "PDF" : "图片"}上传失败 (${res.status})：${res.text.slice(0, 240)}`);
              b.src = rel; delete b._file; delete b._name;
            }
          }
          if (typeof onSave === "function") {
            await onSave(blocks);
          } else {
            const { data } = await getContent(ED.token);
            const arr = source === "exp" ? data.experience : data.works;
            const rec = arr.find(r => r.id === id);
            if (!rec) throw new Error("未找到记录");

            if (source === "work") {
              // 作品：视频块保持到 videoUrls，同时把视频块（含位置）也保存到 blocks，
              // 这样弹窗渲染时才能按用户拖拽的位置显示，而不是回到默认网格。
              const newVideoUrls = [];
              const newBlocks = [];
              blocks.forEach((b) => {
                const copy = { ...b };
                delete copy._file; delete copy._name; delete copy._fromVideoUrl;
                if (b._meta) Object.assign(copy, b._meta);
                delete copy._meta;
                if (b.type === "video") {
                  const v = { ...(b._meta || {}) };
                  v.url = b.src;
                  if (!v.type) v.type = "mp4";
                  if (!v.label) v.label = b.label || "视频 " + (newVideoUrls.length + 1);
                  newVideoUrls.push(v);
                  // 关键：视频块也写入 blocks，保留 x/y/w/h 排版信息
                  newBlocks.push(copy);
                } else {
                  newBlocks.push(copy);
                }
              });
              rec.videoUrls = newVideoUrls;
              rec.blocks = newBlocks;
              // 同步回传入的原始对象，保证弹窗内存对象也更新，保存后无需刷新即可见
              record.videoUrls = newVideoUrls;
              record.blocks = newBlocks;
            } else {
              rec.blocks = blocks.map((b) => {
                const copy = { ...b };
                delete copy._file; delete copy._name;
                return copy;
              });
              record.blocks = rec.blocks;
            }

            const r2 = await putContent(data, ED.token);
            if (r2.status >= 400) throw new Error(`保存失败 (${r2.status})：${r2.text.slice(0, 240)}`);
            alert("✅ 已保存！刷新页面即可看到效果。");
            if (typeof opts.postSave === "function") opts.postSave(blocks);
          }
        } catch (err) {
          alert("保存出错：" + err.message + "\n若提示 401，说明 Token 失效，请重新生成后再次保存。");
        } finally {
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "💾 保存"; }
        }
      }
    }

    return {
      container,
      getBlocks: () => JSON.parse(JSON.stringify(blocks)),
      setBlocks: (newBlocks) => {
        blocks = Array.isArray(newBlocks) ? JSON.parse(JSON.stringify(newBlocks)) : [];
        paint();
      }
    };
  };

  window.PortfolioEditor = ED;
})();
