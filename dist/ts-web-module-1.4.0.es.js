var p = Object.defineProperty;
var u = (i, s, e) => s in i ? p(i, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[s] = e;
var d = (i, s, e) => (u(i, typeof s != "symbol" ? s + "" : s, e), e);
(function() {
  const s = document.createElement("link").relList;
  if (s && s.supports && s.supports("modulepreload"))
    return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
    t(r);
  new MutationObserver((r) => {
    for (const o of r)
      if (o.type === "childList")
        for (const n of o.addedNodes)
          n.tagName === "LINK" && n.rel === "modulepreload" && t(n);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(r) {
    const o = {};
    return r.integrity && (o.integrity = r.integrity), r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? o.credentials = "include" : r.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function t(r) {
    if (r.ep)
      return;
    r.ep = !0;
    const o = e(r);
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
    var e;
    const s = (e = this.shadowRoot) == null ? void 0 : e.querySelector("iframe");
    s && (s.src = "");
  }
  render() {
    if (!this.shadowRoot)
      return;
    const s = this.getAttribute("bvid");
    if (!s) {
      this.shadowRoot.innerHTML = `
        <style>${h.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
      return;
    }
    const e = this.hasAttribute("autoplay") ? "1" : "0", t = this.hasAttribute("muted") ? "1" : "0", r = new URLSearchParams({ bvid: s, autoplay: e });
    t === "1" && r.append("muted", "1");
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
class g extends HTMLElement {
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
    const e = this.shadow.querySelector("a");
    e && (e.removeEventListener("click", this.handleClick), e.removeEventListener("keydown", this.handleKeyPress));
  }
  attributeChangedCallback() {
    this.updateContent();
  }
  render() {
    const e = document.createElement("style");
    e.textContent = `
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
    const t = document.createElement("a");
    t.className = "rl-container", t.setAttribute("role", "link"), t.tabIndex = 0;
    const r = document.createElement("div");
    r.className = "rl-left";
    const o = document.createElement("div");
    o.className = "rl-right", t.append(r, o), this.shadow.append(e, t);
  }
  updateContent() {
    var c;
    const e = this.shadow.querySelector("a"), t = ((c = this.getAttribute("href")) == null ? void 0 : c.trim()) ?? "#", r = this.getAttribute("target") ?? "_self";
    e.setAttribute("href", t), e.setAttribute("target", r);
    const o = this.getAttribute("left-text") ?? "", n = this.getAttribute("right-text") ?? "", a = this.shadow.querySelector(".rl-left"), l = this.shadow.querySelector(".rl-right");
    a.style.display = o.trim() ? "flex" : "none", a.textContent = o, l.style.display = n.trim() ? "flex" : "none", l.textContent = n;
  }
  bindEvents() {
    const e = this.shadow.querySelector("a");
    e.addEventListener("click", this.handleClick.bind(this)), e.addEventListener("keydown", this.handleKeyPress.bind(this));
  }
  handleClick(e) {
    const t = this.getAttribute("href");
    (!t || t === "#") && e.preventDefault();
  }
  handleKeyPress(e) {
    (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.dispatchEvent(new MouseEvent("click")));
  }
}
customElements.define("resource-link", g);
class f extends HTMLElement {
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
    const e = document.createElement("style");
    e.textContent = `
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
      
      .tb-text-box {
        padding: 12px 16px;
        border-radius: 6px;
        border-left: 4px solid;
        background-color: var(--tb-normal-bg);
        color: var(--tb-normal-text);
        border-color: var(--tb-normal-border);
        margin: 6px 0;
        transition: all 0.3s ease;
      }

      .tb-text-box:hover {
        transform: scale(1.01);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .tb-text-box[type="warning"] {
        background-color: var(--tb-warning-bg);
        color: var(--tb-warning-text);
        border-color: var(--tb-warning-border);
      }
      
      .tb-text-box[type="error"] {
        background-color: var(--tb-error-bg);
        color: var(--tb-error-text);
        border-color: var(--tb-error-border);
      }
      
      .tb-text-box[type="success"] {
        background-color: var(--tb-success-bg);
        color: var(--tb-success-text);
        border-color: var(--tb-success-border);
      }
      
      .tb-text-box .tb-icon {
        margin-right: 8px;
        font-weight: bold;
      }
    `;
    const t = document.createElement("div");
    t.className = "tb-text-box", t.setAttribute("role", "alert");
    const r = document.createElement("span");
    r.className = "tb-icon";
    const o = document.createElement("slot");
    t.append(r, o), this.shadow.append(e, t);
  }
  updateContent() {
    const e = this.shadow.querySelector(".tb-text-box"), t = this.shadow.querySelector(".tb-icon"), r = this.getAttribute("type") ?? "normal";
    e.setAttribute("type", r);
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
    t.textContent = o;
  }
}
customElements.define("text-box", f);
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
  getDriveIcon(e) {
    const t = {
      默认图标: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return t[e] || t.默认图标;
  }
  render() {
    const e = document.createElement("style");
    e.textContent = `
      :host { display: inline-block; }
      .cd-drive-container {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s ease;
        margin: 6px 0;
      }
      .cd-drive-container:hover {
        background-color: #f5f5f5;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .cd-drive-icon {
        flex: 0 0 24px;
        margin-right: 12px;
        color: #3498db;
      }
      .cd-drive-info {
        flex: 1;
      }
      .cd-drive-title {
        font-weight: 500;
        margin-bottom: 4px;
        color: #2c3e50;
        max-width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cd-drive-meta {
        font-size: 0.85rem;
        color: #7f8c8d;
      }
      .cd-drive-password {
        margin-left: 8px;
        padding: 2px 6px;
        background-color: #ecf0f1;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .cd-download-btn {
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
      .cd-download-btn:hover {
        background-color: #c0392b;
      }
    `;
    const t = document.createElement("div");
    t.className = "cd-drive-container", this.shadow.append(e, t);
  }
  updateContent() {
    const e = this.shadow.querySelector(".cd-drive-container"), t = this.getAttribute("type") || "默认网盘", r = this.getAttribute("url") || "#", o = this.getAttribute("password") || "", n = this.getAttribute("title") || "默认标题";
    e.innerHTML = `
      <div class="cd-drive-icon">${this.getDriveIcon(t)}</div>
      <div class="cd-drive-info">
        <div class="cd-drive-title" title="${n}">${n}</div>
        <div class="cd-drive-meta">
          来源: ${t}
          ${o ? `<span class="cd-drive-password" data-password="${o}" title="点击复制提取码">提取码: ${o}</span>` : ""}
        </div>
      </div>
      <a href="${r}" class="cd-download-btn" target="_blank">下载</a>
    `;
    const a = e.querySelector(".cd-drive-password");
    a && a.addEventListener("click", () => {
      const l = a.dataset.password;
      l && navigator.clipboard.writeText(l).then(() => {
        const c = a.textContent;
        a.textContent = "提取码已复制", setTimeout(() => {
          a.textContent = c;
        }, 2e3);
      }).catch((c) => {
        console.error("复制提取码失败:", c);
      });
    });
  }
}
customElements.define("cloud-drive", m);
class x extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" }), this.render();
  }
  static get observedAttributes() {
    return ["percentage", "color"];
  }
  connectedCallback() {
    this.updateProgress();
  }
  attributeChangedCallback() {
    this.updateProgress();
  }
  render() {
    const e = document.createElement("style");
    e.textContent = `
      :host { display: inline-block; width: 100%; }
      .pb-progress-container {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }
      .pb-progress-bar-container {
          flex: 1;
          height: 12px;
          background-color: #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }
      .pb-progress-bar {
        height: 100%;
        background-color: #3498db;
        position: relative;
        z-index: 2;
      }
      .pb-progress-text {
        font-size: 0.85rem;
        color: #666;
        font-weight: 500;
        white-space: nowrap;
      }
      .pb-progress-bar {
        height: 100%;
        transition: width 0.3s ease;
        z-index: 2;
        position: relative;
      }
    `;
    const t = document.createElement("div");
    t.className = "pb-progress-container", t.innerHTML = `
      <div class="pb-progress-bar-container">
        <div class="pb-progress-bar"></div>
      </div>
      <div class="pb-progress-text"></div>
    `, this.shadow.append(e, t);
  }
  updateProgress() {
    const e = this.getAttribute("percentage") || "0%", t = this.getAttribute("color") || "#3498db", r = this.shadow.querySelector(".pb-progress-bar"), o = this.shadow.querySelector(".pb-progress-text"), n = e.endsWith("%") ? e : `${e}%`;
    r.style.width = n, r.style.backgroundColor = t, o.textContent = n;
  }
}
customElements.define("progress-box", x);
