var u = Object.defineProperty;
var g = (i, n, t) => n in i ? u(i, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[n] = t;
var l = (i, n, t) => (g(i, typeof n != "symbol" ? n + "" : n, t), t);
(function() {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload"))
    return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
    e(r);
  new MutationObserver((r) => {
    for (const o of r)
      if (o.type === "childList")
        for (const a of o.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && e(a);
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
l(h, "STYLES", `
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
let p = h;
customElements.define("bilibili-video", p);
class f extends HTMLElement {
  constructor() {
    super();
    l(this, "shadow");
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
    var s;
    const t = this.shadow.querySelector("a"), e = ((s = this.getAttribute("href")) == null ? void 0 : s.trim()) ?? "#", r = this.getAttribute("target") ?? "_self";
    t.setAttribute("href", e), t.setAttribute("target", r);
    const o = this.getAttribute("left-text") ?? "", a = this.getAttribute("right-text") ?? "", c = this.shadow.querySelector(".rl-left"), d = this.shadow.querySelector(".rl-right");
    c.style.display = o.trim() ? "flex" : "none", c.textContent = o, d.style.display = a.trim() ? "flex" : "none", d.textContent = a;
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
class m extends HTMLElement {
  constructor() {
    super();
    l(this, "shadow");
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
    const e = document.createElement("div");
    e.className = "tb-text-box", e.setAttribute("role", "alert");
    const r = document.createElement("span");
    r.className = "tb-icon";
    const o = document.createElement("slot");
    e.append(r, o), this.shadow.append(t, e);
  }
  updateContent() {
    const t = this.shadow.querySelector(".tb-text-box"), e = this.shadow.querySelector(".tb-icon"), r = this.getAttribute("type") ?? "normal";
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
customElements.define("text-box", m);
class x extends HTMLElement {
  constructor() {
    super();
    l(this, "shadow");
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
    const e = document.createElement("div");
    e.className = "cd-drive-container", this.shadow.append(t, e);
  }
  updateContent() {
    const t = this.shadow.querySelector(".cd-drive-container"), e = this.getAttribute("type") || "默认网盘", r = this.getAttribute("url") || "#", o = this.getAttribute("password") || "", a = this.getAttribute("title") || "默认标题";
    t.innerHTML = `
      <div class="cd-drive-icon">${this.getDriveIcon(e)}</div>
      <div class="cd-drive-info">
        <div class="cd-drive-title" title="${a}">${a}</div>
        <div class="cd-drive-meta">
          来源: ${e}
          ${o ? `<span class="cd-drive-password" data-password="${o}" title="点击复制提取码">提取码: ${o}</span>` : ""}
        </div>
      </div>
      <a href="${r}" class="cd-download-btn" target="_blank">下载</a>
    `;
    const c = t.querySelector(".cd-drive-password");
    c && c.addEventListener("click", () => {
      const d = c.dataset.password;
      d && navigator.clipboard.writeText(d).then(() => {
        const s = c.textContent;
        c.textContent = "提取码已复制", setTimeout(() => {
          c.textContent = s;
        }, 2e3);
      }).catch((s) => {
        console.error("复制提取码失败:", s);
      });
    });
  }
}
customElements.define("cloud-drive", x);
class v extends HTMLElement {
  constructor() {
    super();
    l(this, "shadow");
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
    const t = document.createElement("style");
    t.textContent = `
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
    const e = document.createElement("div");
    e.className = "pb-progress-container", e.innerHTML = `
      <div class="pb-progress-bar-container">
        <div class="pb-progress-bar"></div>
      </div>
      <div class="pb-progress-text"></div>
    `, this.shadow.append(t, e);
  }
  updateProgress() {
    const t = this.getAttribute("percentage") || "0%", e = this.getAttribute("color") || "#3498db", r = this.shadow.querySelector(".pb-progress-bar"), o = this.shadow.querySelector(".pb-progress-text"), a = t.endsWith("%") ? t : `${t}%`;
    r.style.width = a, r.style.backgroundColor = e, o.textContent = a;
  }
}
customElements.define("progress-box", v);
class w extends HTMLElement {
  constructor() {
    super();
    l(this, "shadow");
    this.shadow = this.attachShadow({ mode: "open" }), this.render();
  }
  connectedCallback() {
    this.buildTabs(), this.addEventListeners();
  }
  render() {
    const t = document.createElement("style");
    t.textContent = `
      .tb-tabs {
        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        --primary-color: #4361ee;
        --hover-color: #3a56d4;
        --text-color: #2b2d42;
        --light-text: #8d99ae;
        --bg-color: #ffffff;
        --border-color: #edf2f4;
        --content-bg: #f8f9fa;
        --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        margin: 8px 0;
      }

      .tb-tabs-header {
        display: flex;
        background-color: var(--bg-color);
        padding: 0 16px;
        position: relative;
        z-index: 1;
      }

      .tb-tab-button {
        padding: 12px 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: var(--light-text);
        position: relative;
        transition: var(--transition);
        outline: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .tb-tab-button.active {
        color: var(--primary-color);
      }

      .tb-tab-button.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 3px;
        background-color: var(--primary-color);
        border-radius: 3px 3px 0 0;
        transition: var(--transition);
      }

      .tb-tab-button:hover:not(.active) {
        color: var(--text-color);
      }

      .tb-tabs-content {
        padding: 24px;
        background-color: var(--content-bg);
        transition: var(--transition);
        height: auto;
      }

      .tb-tab-panel {
        display: none;
        animation: fadeIn 0.3s ease-out;
      }

      .tb-tab-panel.active {
        display: block;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 响应式设计 */
      @media (max-width: 600px) {
        .tb-tabs-header {
          overflow-x: auto;
          white-space: nowrap;
          padding: 0 8px;
          scrollbar-width: none;
        }
        
        .tb-tabs-header::-webkit-scrollbar {
          display: none;
        }
        
        .tb-tab-button {
          display: inline-block;
          width: auto;
          text-align: center;
          padding: 12px 16px;
        }
        
        .tb-tab-button.active::after {
          width: 60%;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
    `;
    const e = document.createElement("div");
    e.className = "tb-tabs", e.innerHTML = `
      <div class="tb-tabs-header"></div>
      <div class="tb-tabs-content"></div>
    `, this.shadow.append(t, e);
  }
  buildTabs() {
    const t = Array.from(this.querySelectorAll("[data-tab]")), e = this.shadow.querySelector(".tb-tabs-header"), r = this.shadow.querySelector(".tb-tabs-content");
    !e || !r || t.forEach((o, a) => {
      const c = o.getAttribute("label") || `Tab ${a + 1}`, d = o.innerHTML, s = document.createElement("button");
      s.className = "tb-tab-button", s.textContent = c, s.dataset.tabIndex = a.toString(), a === 0 && s.classList.add("active"), e.appendChild(s);
      const b = document.createElement("div");
      b.className = "tb-tab-panel", b.innerHTML = d, b.dataset.tabIndex = a.toString(), a === 0 && b.classList.add("active"), r.appendChild(b);
    });
  }
  addEventListeners() {
    this.shadow.querySelectorAll(".tb-tab-button").forEach((e) => {
      e.addEventListener("click", () => this.switchTab(e.dataset.tabIndex));
    });
  }
  switchTab(t) {
    if (!t)
      return;
    this.shadow.querySelectorAll(".tb-tab-button").forEach((o) => o.classList.remove("active")), this.shadow.querySelectorAll(".tb-tab-panel").forEach((o) => o.classList.remove("active"));
    const e = this.shadow.querySelector(`.tb-tab-button[data-tab-index="${t}"]`), r = this.shadow.querySelector(`.tb-tab-panel[data-tab-index="${t}"]`);
    e == null || e.classList.add("active"), r == null || r.classList.add("active");
  }
}
customElements.define("tabs-component", w);
