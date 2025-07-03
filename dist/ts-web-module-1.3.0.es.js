var u = Object.defineProperty;
var p = (i, n, t) => n in i ? u(i, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[n] = t;
var d = (i, n, t) => (p(i, typeof n != "symbol" ? n + "" : n, t), t);
(function() {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload"))
    return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
    e(r);
  new MutationObserver((r) => {
    for (const o of r)
      if (o.type === "childList")
        for (const s of o.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && e(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(r) {
    const o = {};
    return r.integrity && (o.integrity = r.integrity), r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? o.credentials = "include" : r.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function e(r) {
    if (r.ep)
      return;
    r.ep = !0;
    const o = t(r);
    fetch(r.href, o);
  }
})();
const h = class h extends HTMLElement {
  static get observedAttributes() {
    return ["bvid", "autoplay", "muted"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  disconnectedCallback() {
    var t;
    const n = (t = this.shadowRoot) == null ? void 0 : t.querySelector("iframe");
    n && (n.src = "");
  }
  render() {
    if (!this.shadowRoot)
      return;
    const n = this.getAttribute("bvid");
    if (!n) {
      this.shadowRoot.innerHTML = `
        <style>${h.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
      return;
    }
    const t = this.hasAttribute("autoplay") ? "1" : "0", e = this.hasAttribute("muted") ? "1" : "0", r = new URLSearchParams({ bvid: n, autoplay: t });
    e === "1" && r.append("muted", "1");
    const o = `https://player.bilibili.com/player.html?${r.toString()}`;
    this.shadowRoot.innerHTML = `
      <style>${h.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${o}" frameborder="0" allow="autoplay; fullscreen; encrypted-media"></iframe>
      </div>
    `;
  }
};
d(h, "STYLES", `
    .bilibili-video-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%; /* 16:9 宽高比 */
    }
    .bilibili-video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .error-message {
      color: red;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
  `);
let b = h;
customElements.define("bilibili-video", b);
class f extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["left-text", "right-text", "href", "target"];
  }
  connectedCallback() {
    this.updateContent(), this.bindEvents();
  }
  disconnectedCallback() {
    const t = this.shadow.querySelector("a");
    t && (t.removeEventListener("click", this.handleClick), t.removeEventListener("keydown", this.handleKeyPress));
  }
  attributeChangedCallback() {
    this.updateContent();
  }
  render() {
    const t = document.createElement("style");
    t.textContent = `
      :host {
        --rl-left-color: #2c3e50;
        --rl-right-color: #3498db;
        --rl-left-hover: #34495e;
        --rl-right-hover: #2980b9;
        --rl-divider-color: #95a5a6;
        --rl-text-color: #ecf0f1;
        display: inline-block;
        width: fit-content;
        min-width: 120px;
        font-family: inherit;
      }
      .rl-container {
        display: inline-flex;
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.3s ease;
        text-decoration: none;
        color: var(--rl-text-color);
        position: relative;
        margin: 10px 0;
      }
      .rl-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .rl-left, .rl-right {
        padding: 12px 20px;
        flex: 0 1 auto;
        display: flex;
        align-items: center;
        transition: background 0.3s ease;
      }
      .rl-left {
        background: var(--rl-left-color);
      }
      .rl-right {
        background: var(--rl-right-color);
      }
      /* 只有当 right-text 存在时才显示左边框 */
      .rl-container:has(.rl-right:not(:empty)) .rl-left {
        border-right: 2px solid var(--rl-divider-color);
      }
      .rl-container:hover .rl-left {
        background: var(--rl-left-hover);
      }
      .rl-container:hover .rl-right {
        background: var(--rl-right-hover);
      }
    `;
    const e = document.createElement("a");
    e.className = "rl-container", e.setAttribute("role", "link"), e.tabIndex = 0;
    const r = document.createElement("div");
    r.className = "rl-left";
    const o = document.createElement("div");
    o.className = "rl-right", e.append(r, o), this.shadow.append(t, e);
  }
  updateContent() {
    var l;
    const t = this.shadow.querySelector("a"), e = ((l = this.getAttribute("href")) == null ? void 0 : l.trim()) ?? "#", r = this.getAttribute("target") ?? "_self";
    t.setAttribute("href", e), t.setAttribute("target", r);
    const o = this.getAttribute("left-text") ?? "", s = this.getAttribute("right-text") ?? "", a = this.shadow.querySelector(".rl-left"), c = this.shadow.querySelector(".rl-right");
    a.style.display = o.trim() ? "flex" : "none", a.textContent = o, c.style.display = s.trim() ? "flex" : "none", c.textContent = s;
  }
  bindEvents() {
    const t = this.shadow.querySelector("a");
    t.addEventListener("click", this.handleClick.bind(this)), t.addEventListener("keydown", this.handleKeyPress.bind(this));
  }
  handleClick(t) {
    const e = this.getAttribute("href");
    (!e || e === "#") && t.preventDefault();
  }
  handleKeyPress(t) {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.dispatchEvent(new MouseEvent("click")));
  }
}
customElements.define("resource-link", f);
class g extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["type"];
  }
  connectedCallback() {
    this.updateContent();
  }
  attributeChangedCallback() {
    this.updateContent();
  }
  render() {
    const t = document.createElement("style");
    t.textContent = `
      :host {
        --tb-normal-bg: #e7f5ff;
        --tb-normal-text: #1864ab;
        --tb-normal-border: #74c0fc;
        
        --tb-warning-bg: #fff9db;
        --tb-warning-text: #e67700;
        --tb-warning-border: #ffd43b;
        
        --tb-error-bg: #fff5f5;
        --tb-error-text: #c92a2a;
        --tb-error-border: #ff8787;
        
        --tb-success-bg: #ebfbee;
        --tb-success-text: #2b8a3e;
        --tb-success-border: #69db7c;
        
        display: block;
        width: 100%;
        margin: 12px 0;
        font-family: inherit;
      }
      
      .text-box {
        padding: 12px 16px;
        border-radius: 6px;
        border-left: 4px solid;
        background-color: var(--tb-normal-bg);
        color: var(--tb-normal-text);
        border-color: var(--tb-normal-border);
      }
      
      .text-box[type="warning"] {
        background-color: var(--tb-warning-bg);
        color: var(--tb-warning-text);
        border-color: var(--tb-warning-border);
      }
      
      .text-box[type="error"] {
        background-color: var(--tb-error-bg);
        color: var(--tb-error-text);
        border-color: var(--tb-error-border);
      }
      
      .text-box[type="success"] {
        background-color: var(--tb-success-bg);
        color: var(--tb-success-text);
        border-color: var(--tb-success-border);
      }
      
      .text-box .icon {
        margin-right: 8px;
        font-weight: bold;
      }
      
      .text-box ::slotted(*) {
        display: inline;
      }
    `;
    const e = document.createElement("div");
    e.className = "text-box", e.setAttribute("role", "alert");
    const r = document.createElement("span");
    r.className = "icon";
    const o = document.createElement("slot");
    e.append(r, o), this.shadow.append(t, e);
  }
  updateContent() {
    const t = this.shadow.querySelector(".text-box"), e = this.shadow.querySelector(".icon");
    this.shadow.querySelector(".content");
    const r = this.getAttribute("type") ?? "normal";
    t.setAttribute("type", r);
    let o = "";
    switch (r) {
      case "warning":
        o = "⚠️";
        break;
      case "error":
        o = "❌";
        break;
      case "success":
        o = "✅";
        break;
      default:
        o = "ℹ️";
    }
    e.textContent = o;
  }
}
customElements.define("text-box", g);
class m extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["type", "url", "password", "title"];
  }
  connectedCallback() {
    this.updateContent();
  }
  attributeChangedCallback() {
    this.updateContent();
  }
  getDriveIcon(t) {
    const e = {
      默认图标: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return e[t] || e.默认图标;
  }
  render() {
    const t = document.createElement("style");
    t.textContent = `
      :host { display: inline-block; }
      .drive-container {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s ease;
        margin: 6px 0;
      }
      .drive-container:hover {
        background-color: #f5f5f5;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .drive-icon {
        flex: 0 0 24px;
        margin-right: 12px;
        color: #3498db;
      }
      .drive-info {
        flex: 1;
      }
      .drive-title {
        font-weight: 500;
        margin-bottom: 4px;
        color: #2c3e50;
        max-width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .drive-meta {
        font-size: 0.85rem;
        color: #7f8c8d;
      }
      .drive-password {
        margin-left: 8px;
        padding: 2px 6px;
        background-color: #ecf0f1;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .download-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        margin-left: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
        text-decoration: none;
      }
      .download-btn:hover {
        background-color: #c0392b;
      }
    `;
    const e = document.createElement("div");
    e.className = "drive-container", this.shadow.append(t, e);
  }
  updateContent() {
    const t = this.shadow.querySelector(".drive-container"), e = this.getAttribute("type") || "默认网盘", r = this.getAttribute("url") || "#", o = this.getAttribute("password") || "", s = this.getAttribute("title") || "默认标题";
    t.innerHTML = `
      <div class="drive-icon">${this.getDriveIcon(e)}</div>
      <div class="drive-info">
        <div class="drive-title" title="${s}">${s}</div>
        <div class="drive-meta">
          来源: ${e}
          ${o ? `<span class="drive-password" data-password="${o}" title="点击复制提取码">提取码: ${o}</span>` : ""}
        </div>
      </div>
      <a href="${r}" class="download-btn" target="_blank">下载</a>
    `;
    const a = t.querySelector(".drive-password");
    a && a.addEventListener("click", () => {
      const c = a.dataset.password;
      c && navigator.clipboard.writeText(c).then(() => {
        const l = a.textContent;
        a.textContent = "提取码已复制", setTimeout(() => {
          a.textContent = l;
        }, 2e3);
      }).catch((l) => {
        console.error("复制提取码失败:", l);
      });
    });
  }
}
customElements.define("cloud-drive", m);
