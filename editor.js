(function () {
  "use strict";
  const ED = { token: "" };
  const OWNER = "yujian260318-bit", REPO = "verbose-happiness", BRANCH = "main";

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
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
    const opt = { method, headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/vnd.github+json",
      "User-Agent": "portfolio-editor",
      "Content-Type": "application/json"
    }};
    if (body) opt.body = JSON.stringify(body);
    return fetch(url, opt).then(r => r.text().then(t => ({ status: r.status, text: t })));
  }
  function getContent(token) {
    return api("GET", "content.json", null, token).then(({ status, text }) => {
      if (status !== 200) throw new Error("读取 content.json 失败 " + status);
      const j = JSON.parse(text);
      return JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\s/g, "")))));
    });
  }
  function putContent(obj, token) {
    return getContent(token).then(j => api("GET", "content.json", null, token).then(({ text }) => {
      const sha = JSON.parse(text).sha;
      return api("PUT", "content.json", {
        message: "Edit via visual editor",
        content: btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2)))),
        sha, branch: BRANCH
      }, token);
    }));
  }
  function putAsset(relPath, b64, token) {
    return api("GET", relPath, null, token).then(({ status, text }) => {
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
    if (b.h) node.style.minHeight = (b.h || 60) + "px";

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
      v.src = b.src || ""; v.controls = true; v.playsInline = true;
      if (b.poster) v.poster = b.poster;
      node.appendChild(v);
    } else if (b.type === "links") {
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
      bar.appendChild(el("span", "ed-grip", "✥ 拖动"));
      const del = el("button", "ed-del", "✕");
      del.title = "删除";
      del.addEventListener("click", () => { ctx.blocks.splice(idx, 1); ctx.rerender(); });
      bar.appendChild(del);
      node.appendChild(bar);

      const rs = el("div", "ed-resize");
      rs.title = "拖拽调整大小";
      node.appendChild(rs);

      // 拖动移动
      bar.addEventListener("mousedown", (e) => {
        if (e.target === del) return;
        e.preventDefault();
        const sx = e.clientX, sy = e.clientY;
        const ol = parseInt(node.style.left) || 0, ot = parseInt(node.style.top) || 0;
        function mv(ev) {
          node.style.left = (ol + ev.clientX - sx) + "px";
          node.style.top = (ot + ev.clientY - sy) + "px";
        }
        function up() {
          document.removeEventListener("mousemove", mv);
          document.removeEventListener("mouseup", up);
          b.x = parseInt(node.style.left); b.y = parseInt(node.style.top);
        }
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
      });
      // 缩放
      rs.addEventListener("mousedown", (e) => {
        e.preventDefault(); e.stopPropagation();
        const sx = e.clientX, sy = e.clientY;
        const ow = node.offsetWidth, oh = node.offsetHeight;
        function mv(ev) {
          node.style.width = Math.max(80, ow + ev.clientX - sx) + "px";
          node.style.minHeight = Math.max(40, oh + ev.clientY - sy) + "px";
        }
        function up() {
          document.removeEventListener("mousemove", mv);
          document.removeEventListener("mouseup", up);
          b.w = parseInt(node.style.width); b.h = parseInt(node.style.minHeight);
        }
        document.addEventListener("mousemove", mv);
        document.removeEventListener("mouseup", up);
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
    }
    paint();

    if (editable) {
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
        const r = new FileReader();
        r.onload = () => {
          const b = { type: "image", src: r.result, x: 20, y: canvas.scrollHeight + 10, w: 280, _file: f };
          blocks.push(b); paint();
        };
        r.readAsDataURL(f);
      });
      const addVid = el("button", null, "+ 视频框");
      addVid.addEventListener("click", () => {
        const url = prompt("粘贴视频直链（mp4）：", "");
        if (url) { blocks.push({ type: "video", src: url, x: 20, y: canvas.scrollHeight + 10, w: 420 }); paint(); }
      });
      const saveBtn = el("button", "ed-save", "💾 保存");
      saveBtn.addEventListener("click", () => save());

      [addText, addImg, addVid, fileInput, saveBtn].forEach(n => tb.appendChild(n));
      container.insertBefore(tb, canvas);

      async function save() {
        saveBtn.disabled = true; saveBtn.textContent = "保存中…";
        try {
          if (!ED.token) {
            const t = prompt("请输入 GitHub Token 以保存（仅本次使用，不会存储）：");
            if (!t) { alert("未输入 Token，已取消保存。"); return; }
            ED.token = t.trim();
          }
          // 上传新图片
          for (const b of blocks) {
            if (b._file) {
              const rel = "assets/" + Date.now() + "_" + b._file.name.replace(/\s/g, "_");
              const b64 = b.src.split(",")[1];
              const res = await putAsset(rel, b64, ED.token);
              if (res.status >= 400) throw new Error("图片上传失败 " + res.status);
              b.src = rel; delete b._file;
            }
          }
          const data = await getContent(ED.token);
          const arr = source === "exp" ? data.experience : data.works;
          const rec = arr.find(r => r.id === id);
          if (!rec) throw new Error("未找到记录");
          rec.blocks = blocks;
          const r2 = await putContent(data, ED.token);
          if (r2.status >= 400) throw new Error("保存失败 " + r2.status);
          alert("✅ 已保存！刷新页面即可看到效果。");
        } catch (err) {
          alert("保存出错：" + err.message + "\n若提示 401，说明 Token 失效，请重新生成后再次保存。");
        } finally {
          saveBtn.disabled = false; saveBtn.textContent = "💾 保存";
        }
      }
    }
  };

  window.PortfolioEditor = ED;
})();
