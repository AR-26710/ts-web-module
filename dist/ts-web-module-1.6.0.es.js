var u = Object.defineProperty;
var g = (c, a, t) => a in c ? u(c, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[a] = t;
var d = (c, a, t) => (g(c, typeof a != "symbol" ? a + "" : a, t), t);
(function() {
  const a = document.createElement("link").relList;
  if (a && a.supports && a.supports("modulepreload"))
    return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]'))
    e(o);
  new MutationObserver((o) => {
    for (const r of o)
      if (r.type === "childList")
        for (const s of r.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && e(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(o) {
    const r = {};
    return o.integrity && (r.integrity = o.integrity), o.referrerPolicy && (r.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? r.credentials = "include" : o.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
  }
  function e(o) {
    if (o.ep)
      return;
    o.ep = !0;
    const r = t(o);
    fetch(o.href, r);
  }
})();
const p = class p extends HTMLElement {
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
    const a = (t = this.shadowRoot) == null ? void 0 : t.querySelector("iframe");
    a && (a.src = "");
  }
  render() {
    if (!this.shadowRoot)
      return;
    const a = this.getAttribute("bvid");
    if (!a) {
      this.shadowRoot.innerHTML = `
        <style>${p.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
      return;
    }
    const t = this.hasAttribute("autoplay") ? "1" : "0", e = this.hasAttribute("muted") ? "1" : "0", o = new URLSearchParams({ bvid: a, autoplay: t });
    e === "1" && o.append("muted", "1");
    const r = `https://player.bilibili.com/player.html?${o.toString()}`;
    this.shadowRoot.innerHTML = `
      <style>${p.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${r}" frameborder="0" allow="autoplay; fullscreen; encrypted-media"></iframe>
      </div>
    `;
  }
};
d(p, "STYLES", `
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
let b = p;
customElements.define("bilibili-video", b);
class v extends HTMLElement {
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
    const o = document.createElement("div");
    o.className = "rl-left";
    const r = document.createElement("div");
    r.className = "rl-right", e.append(o, r), this.shadow.append(t, e);
  }
  updateContent() {
    var n;
    const t = this.shadow.querySelector("a"), e = ((n = this.getAttribute("href")) == null ? void 0 : n.trim()) ?? "#", o = this.getAttribute("target") ?? "_self";
    t.setAttribute("href", e), t.setAttribute("target", o);
    const r = this.getAttribute("left-text") ?? "", s = this.getAttribute("right-text") ?? "", i = this.shadow.querySelector(".rl-left"), l = this.shadow.querySelector(".rl-right");
    i.style.display = r.trim() ? "flex" : "none", i.textContent = r, l.style.display = s.trim() ? "flex" : "none", l.textContent = s;
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
customElements.define("resource-link", v);
class m extends HTMLElement {
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
    const o = document.createElement("span");
    o.className = "tb-icon";
    const r = document.createElement("slot");
    e.append(o, r), this.shadow.append(t, e);
  }
  updateContent() {
    const t = this.shadow.querySelector(".tb-text-box"), e = this.shadow.querySelector(".tb-icon"), o = this.getAttribute("type") ?? "normal";
    t.setAttribute("type", o);
    let r = "";
    switch (o) {
      case "warning":
        r = "⚠️";
        break;
      case "error":
        r = "❌";
        break;
      case "success":
        r = "✅";
        break;
      default:
        r = "ℹ️";
    }
    e.textContent = r;
  }
}
customElements.define("text-box", m);
class f extends HTMLElement {
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
    const t = this.shadow.querySelector(".cd-drive-container"), e = this.getAttribute("type") || "默认网盘", o = this.getAttribute("url") || "#", r = this.getAttribute("password") || "", s = this.getAttribute("title") || "默认标题";
    t.innerHTML = `
      <div class="cd-drive-icon">${this.getDriveIcon(e)}</div>
      <div class="cd-drive-info">
        <div class="cd-drive-title" title="${s}">${s}</div>
        <div class="cd-drive-meta">
          来源: ${e}
          ${r ? `<span class="cd-drive-password" data-password="${r}" title="点击复制提取码">提取码: ${r}</span>` : ""}
        </div>
      </div>
      <a href="${o}" class="cd-download-btn" target="_blank">下载</a>
    `;
    const i = t.querySelector(".cd-drive-password");
    i && i.addEventListener("click", () => {
      const l = i.dataset.password;
      l && navigator.clipboard.writeText(l).then(() => {
        const n = i.textContent;
        i.textContent = "提取码已复制", setTimeout(() => {
          i.textContent = n;
        }, 2e3);
      }).catch((n) => {
        console.error("复制提取码失败:", n);
      });
    });
  }
}
customElements.define("cloud-drive", f);
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
    const t = this.getAttribute("percentage") || "0%", e = this.getAttribute("color") || "#3498db", o = this.shadow.querySelector(".pb-progress-bar"), r = this.shadow.querySelector(".pb-progress-text"), s = t.endsWith("%") ? t : `${t}%`;
    o.style.width = s, o.style.backgroundColor = e, r.textContent = s;
  }
}
customElements.define("progress-box", x);
class w extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
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
    const t = Array.from(this.querySelectorAll("[data-tab]")), e = this.shadow.querySelector(".tb-tabs-header"), o = this.shadow.querySelector(".tb-tabs-content");
    !e || !o || t.forEach((r, s) => {
      const i = r.getAttribute("label") || `Tab ${s + 1}`, l = r.innerHTML, n = document.createElement("button");
      n.className = "tb-tab-button", n.textContent = i, n.dataset.tabIndex = s.toString(), s === 0 && n.classList.add("active"), e.appendChild(n);
      const h = document.createElement("div");
      h.className = "tb-tab-panel", h.innerHTML = l, h.dataset.tabIndex = s.toString(), s === 0 && h.classList.add("active"), o.appendChild(h);
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
    this.shadow.querySelectorAll(".tb-tab-button").forEach((r) => r.classList.remove("active")), this.shadow.querySelectorAll(".tb-tab-panel").forEach((r) => r.classList.remove("active"));
    const e = this.shadow.querySelector(`.tb-tab-button[data-tab-index="${t}"]`), o = this.shadow.querySelector(`.tb-tab-panel[data-tab-index="${t}"]`);
    e == null || e.classList.add("active"), o == null || o.classList.add("active");
  }
}
customElements.define("tabs-component", w);
class y extends HTMLElement {
  constructor() {
    super();
    d(this, "shadow");
    d(this, "container");
    d(this, "image1");
    d(this, "radius", 30);
    this.shadow = this.attachShadow({ mode: "open" }), this.render(), this.container = this.shadow.querySelector(".pv-container1"), this.image1 = this.shadow.querySelector(".pv-image1");
  }
  static get observedAttributes() {
    return ["image1", "image2", "radius"];
  }
  connectedCallback() {
    this.addEventListeners(), this.updateImages();
  }
  attributeChangedCallback(t, e, o) {
    if (e !== o)
      if (t === "radius") {
        this.radius = parseInt(o, 10);
        const r = this.shadow.querySelector(".radius-value");
        r && (r.textContent = `${this.radius}px`);
      } else
        this.updateImages();
  }
  render() {
    const t = document.createElement("style");
    t.textContent = `
      .pv-container1 {
        position: relative;
        height: 40vh;
        margin: 8px 0;
        border: 1px solid #ccc;
      }
      .pv-image1, .pv-image2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      }
      .pv-image1 {
        z-index: 2;
        clip-path: circle(0 at 0 0);
      }
      .pv-image2 {
        z-index: 1;
      }
      .pv-control-panel {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        background: rgba(255, 255, 255, 0.8);
        padding: 8px 16px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pv-radius-slider {
        width: 150px;
        cursor: pointer;
      }
      .pv-radius-value {
        font-size: 14px;
        color: #333;
        min-width: 40px;
        text-align: center;
      }
    `;
    const e = document.createElement("div");
    e.className = "pv-container1", e.innerHTML = `
      <div class="pv-image1"></div>
      <div class="pv-image2"></div>
      <div class="pv-control-panel">
        <span>透视范围:</span>
        <input type="range" min="20" max="200" value="100" class="pv-radius-slider">
        <span class="pv-radius-value">100px</span>
      </div>
    `, this.shadow.append(t, e);
  }
  updateImages() {
    const t = this.getAttribute("image1"), e = this.getAttribute("image2"), o = this.getAttribute("radius");
    if (t && (this.image1.style.backgroundImage = `url('${t}')`), e && (this.shadow.querySelector(".pv-image2").style.backgroundImage = `url('${e}')`), o) {
      this.radius = parseInt(o, 10);
      const r = this.shadow.querySelector(".pv-radius-slider"), s = this.shadow.querySelector(".pv-radius-value");
      r && (r.value = this.radius.toString()), s && (s.textContent = `${this.radius}px`);
    }
  }
  addEventListeners() {
    const t = (r, s) => {
      const i = this.container.getBoundingClientRect(), l = r - i.left, n = s - i.top;
      this.image1.style.clipPath = `circle(${this.radius}px at ${l}px ${n}px)`;
    };
    this.container.addEventListener("mousemove", (r) => {
      t(r.clientX, r.clientY);
    }), this.container.addEventListener("touchmove", (r) => {
      r.preventDefault();
      const s = r.touches[0];
      t(s.clientX, s.clientY);
    }, { passive: !1 });
    const e = this.shadow.querySelector(".pv-radius-slider"), o = this.shadow.querySelector(".pv-radius-value");
    e && o && (e.value = this.radius.toString(), o.textContent = `${this.radius}px`, e.addEventListener("input", (r) => {
      this.radius = parseInt(r.target.value, 10), o.textContent = `${this.radius}px`, this.setAttribute("radius", this.radius.toString());
    })), this.container.addEventListener("mouseleave", () => {
      this.image1.style.clipPath = "circle(0 at 0 0)";
    }), this.container.addEventListener("touchend", () => {
      this.image1.style.clipPath = "circle(0 at 0 0)";
    });
  }
}
customElements.define("perspective-view", y);
