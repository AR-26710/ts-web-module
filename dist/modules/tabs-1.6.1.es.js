var h = Object.defineProperty;
var p = (o, e, t) => e in o ? h(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var c = (o, e, t) => (p(o, typeof e != "symbol" ? e + "" : e, t), t);
class u extends HTMLElement {
  constructor() {
    super();
    c(this, "shadow");
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
    const a = document.createElement("div");
    a.className = "tb-tabs", a.innerHTML = `
      <div class="tb-tabs-header"></div>
      <div class="tb-tabs-content"></div>
    `, this.shadow.append(t, a);
  }
  buildTabs() {
    const t = Array.from(this.querySelectorAll("[data-tab]")), a = this.shadow.querySelector(".tb-tabs-header"), n = this.shadow.querySelector(".tb-tabs-content");
    !a || !n || t.forEach((r, s) => {
      const l = r.getAttribute("label") || `Tab ${s + 1}`, d = r.innerHTML, i = document.createElement("button");
      i.className = "tb-tab-button", i.textContent = l, i.dataset.tabIndex = s.toString(), s === 0 && i.classList.add("active"), a.appendChild(i);
      const b = document.createElement("div");
      b.className = "tb-tab-panel", b.innerHTML = d, b.dataset.tabIndex = s.toString(), s === 0 && b.classList.add("active"), n.appendChild(b);
    });
  }
  addEventListeners() {
    this.shadow.querySelectorAll(".tb-tab-button").forEach((a) => {
      a.addEventListener("click", () => this.switchTab(a.dataset.tabIndex));
    });
  }
  switchTab(t) {
    if (!t)
      return;
    this.shadow.querySelectorAll(".tb-tab-button").forEach((r) => r.classList.remove("active")), this.shadow.querySelectorAll(".tb-tab-panel").forEach((r) => r.classList.remove("active"));
    const a = this.shadow.querySelector(`.tb-tab-button[data-tab-index="${t}"]`), n = this.shadow.querySelector(`.tb-tab-panel[data-tab-index="${t}"]`);
    a == null || a.classList.add("active"), n == null || n.classList.add("active");
  }
}
customElements.define("tabs-component", u);
