var s = Object.defineProperty;
var c = (o, e, t) => e in o ? s(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var n = (o, e, t) => (c(o, typeof e != "symbol" ? e + "" : e, t), t);
class d extends HTMLElement {
  constructor() {
    super();
    n(this, "shadow");
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
    const b = document.createElement("div");
    b.className = "tb-text-box", b.setAttribute("role", "alert");
    const a = document.createElement("span");
    a.className = "tb-icon";
    const r = document.createElement("slot");
    b.append(a, r), this.shadow.append(t, b);
  }
  updateContent() {
    const t = this.shadow.querySelector(".tb-text-box"), b = this.shadow.querySelector(".tb-icon"), a = this.getAttribute("type") ?? "normal";
    t.setAttribute("type", a);
    let r = "";
    switch (a) {
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
    b.textContent = r;
  }
}
customElements.define("text-box", d);
