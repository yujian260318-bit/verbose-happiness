/* ============================================================
   站点配置（部署前请修改）
   ------------------------------------------------------------
   1. github：填你的 GitHub 仓库信息，编辑功能「保存」时会把
      content.json 写回该仓库（需你的 Personal Access Token）。
      仓库名建议：lixinyi-portfolio；分支默认 main。
   2. editPasswordHash：编辑入口密码的 SHA-256（小写十六进制）。
      默认密码为 xinyi2026，部署后请务必改成你自己的，并重新生成哈希。
      生成方式（浏览器控制台 / node）：
        node -e "console.log(require('crypto').createHash('sha256').update('你的密码').digest('hex'))"
   注意：密码仅做前端校验，真正的写权限靠 GitHub token。
   所以即使别人猜到密码进入编辑模式，没有你的 token 也无法改动线上。
   ============================================================ */
window.SITE_CONFIG = {
  github: {
    owner: "yujian260318-bit", // ← 你的 GitHub 用户名
    repo: "verbose-happiness", // ← 仓库名
    branch: "main",       // ← 默认分支
    contentPath: "content.json",
    apiBase: "https://api.github.com"
  },
  editQueryKey: "edit",   // 进入编辑模式：在网址后加 ?edit=1
  editPasswordHash: "aa700178de7ba97853387e28364cdc4dcf324e460ae5e707fbe069b4f3f4fef4"
};
