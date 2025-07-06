var p = Object.defineProperty;
var h = (r, e, t) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var c = (r, e, t) => (h(r, typeof e != "symbol" ? e + "" : e, t), t);
class v extends HTMLElement {
  constructor() {
    super();
    c(this, "shadow");
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
    const o = {
      默认图标: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return o[t] || o.默认图标;
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
    const o = document.createElement("div");
    o.className = "cd-drive-container", this.shadow.append(t, o);
  }
  updateContent() {
    const t = this.shadow.querySelector(".cd-drive-container"), o = this.getAttribute("type") || "默认网盘", l = this.getAttribute("url") || "#", i = this.getAttribute("password") || "", s = this.getAttribute("title") || "默认标题";
    t.innerHTML = `
      <div class="cd-drive-icon">${this.getDriveIcon(o)}</div>
      <div class="cd-drive-info">
        <div class="cd-drive-title" title="${s}">${s}</div>
        <div class="cd-drive-meta">
          来源: ${o}
          ${i ? `<span class="cd-drive-password" data-password="${i}" title="点击复制提取码">提取码: ${i}</span>` : ""}
        </div>
      </div>
      <a href="${l}" class="cd-download-btn" target="_blank">下载</a>
    `;
    const n = t.querySelector(".cd-drive-password");
    n && n.addEventListener("click", () => {
      const a = n.dataset.password;
      a && navigator.clipboard.writeText(a).then(() => {
        const d = n.textContent;
        n.textContent = "提取码已复制", setTimeout(() => {
          n.textContent = d;
        }, 2e3);
      }).catch((d) => {
        console.error("复制提取码失败:", d);
      });
    });
  }
}
customElements.define("cloud-drive", v);
