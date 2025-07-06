var p = Object.defineProperty;
var u = (n, a, e) => a in n ? p(n, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[a] = e;
var o = (n, a, e) => (u(n, typeof a != "symbol" ? a + "" : a, e), e);
class h extends HTMLElement {
  constructor() {
    super();
    o(this, "shadow");
    o(this, "container");
    o(this, "image1");
    o(this, "radius", 30);
    this.shadow = this.attachShadow({ mode: "open" }), this.render(), this.container = this.shadow.querySelector(".pv-container1"), this.image1 = this.shadow.querySelector(".pv-image1");
  }
  static get observedAttributes() {
    return ["image1", "image2", "radius"];
  }
  connectedCallback() {
    this.addEventListeners(), this.updateImages();
  }
  attributeChangedCallback(e, i, s) {
    if (i !== s)
      if (e === "radius") {
        this.radius = parseInt(s, 10);
        const t = this.shadow.querySelector(".radius-value");
        t && (t.textContent = `${this.radius}px`);
      } else
        this.updateImages();
  }
  render() {
    const e = document.createElement("style");
    e.textContent = `
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
    const i = document.createElement("div");
    i.className = "pv-container1", i.innerHTML = `
      <div class="pv-image1"></div>
      <div class="pv-image2"></div>
      <div class="pv-control-panel">
        <span>透视范围:</span>
        <input type="range" min="20" max="200" value="100" class="pv-radius-slider">
        <span class="pv-radius-value">100px</span>
      </div>
    `, this.shadow.append(e, i);
  }
  updateImages() {
    const e = this.getAttribute("image1"), i = this.getAttribute("image2"), s = this.getAttribute("radius");
    if (e && (this.image1.style.backgroundImage = `url('${e}')`), i && (this.shadow.querySelector(".pv-image2").style.backgroundImage = `url('${i}')`), s) {
      this.radius = parseInt(s, 10);
      const t = this.shadow.querySelector(".pv-radius-slider"), r = this.shadow.querySelector(".pv-radius-value");
      t && (t.value = this.radius.toString()), r && (r.textContent = `${this.radius}px`);
    }
  }
  addEventListeners() {
    const e = (t, r) => {
      const d = this.container.getBoundingClientRect(), c = t - d.left, l = r - d.top;
      this.image1.style.clipPath = `circle(${this.radius}px at ${c}px ${l}px)`;
    };
    this.container.addEventListener("mousemove", (t) => {
      e(t.clientX, t.clientY);
    }), this.container.addEventListener("touchmove", (t) => {
      t.preventDefault();
      const r = t.touches[0];
      e(r.clientX, r.clientY);
    }, { passive: !1 });
    const i = this.shadow.querySelector(".pv-radius-slider"), s = this.shadow.querySelector(".pv-radius-value");
    i && s && (i.value = this.radius.toString(), s.textContent = `${this.radius}px`, i.addEventListener("input", (t) => {
      this.radius = parseInt(t.target.value, 10), s.textContent = `${this.radius}px`, this.setAttribute("radius", this.radius.toString());
    })), this.container.addEventListener("mouseleave", () => {
      this.image1.style.clipPath = "circle(0 at 0 0)";
    }), this.container.addEventListener("touchend", () => {
      this.image1.style.clipPath = "circle(0 at 0 0)";
    });
  }
}
customElements.define("perspective-view", h);
