var n = Object.defineProperty;
var c = (i, t, e) => t in i ? n(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var o = (i, t, e) => (c(i, typeof t != "symbol" ? t + "" : t, e), e);
const r = class r extends HTMLElement {
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
    const t = (e = this.shadowRoot) == null ? void 0 : e.querySelector("iframe");
    t && (t.src = "");
  }
  render() {
    if (!this.shadowRoot)
      return;
    const t = this.getAttribute("bvid");
    if (!t) {
      this.shadowRoot.innerHTML = `
        <style>${r.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
      return;
    }
    const e = this.hasAttribute("autoplay") ? "1" : "0", d = this.hasAttribute("muted") ? "1" : "0", s = new URLSearchParams({ bvid: t, autoplay: e });
    d === "1" && s.append("muted", "1");
    const l = `https://player.bilibili.com/player.html?${s.toString()}`;
    this.shadowRoot.innerHTML = `
      <style>${r.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${l}" frameborder="0" allow="autoplay; fullscreen; encrypted-media"></iframe>
      </div>
    `;
  }
};
o(r, "STYLES", `
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
let a = r;
customElements.define("bilibili-video", a);
