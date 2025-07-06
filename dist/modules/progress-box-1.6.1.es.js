var c = Object.defineProperty;
var d = (r, t, e) => t in r ? c(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => (d(r, typeof t != "symbol" ? t + "" : t, e), e);
class p extends HTMLElement {
  constructor() {
    super();
    i(this, "shadow");
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
    const s = document.createElement("div");
    s.className = "pb-progress-container", s.innerHTML = `
      <div class="pb-progress-bar-container">
        <div class="pb-progress-bar"></div>
      </div>
      <div class="pb-progress-text"></div>
    `, this.shadow.append(e, s);
  }
  updateProgress() {
    const e = this.getAttribute("percentage") || "0%", s = this.getAttribute("color") || "#3498db", o = this.shadow.querySelector(".pb-progress-bar"), a = this.shadow.querySelector(".pb-progress-text"), n = e.endsWith("%") ? e : `${e}%`;
    o.style.width = n, o.style.backgroundColor = s, a.textContent = n;
  }
}
customElements.define("progress-box", p);
