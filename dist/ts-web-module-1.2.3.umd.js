(function(n){typeof define=="function"&&define.amd?define(n):n()})(function(){"use strict";var p=Object.defineProperty;var m=(n,i,l)=>i in n?p(n,i,{enumerable:!0,configurable:!0,writable:!0,value:l}):n[i]=l;var c=(n,i,l)=>(m(n,typeof i!="symbol"?i+"":i,l),l);const a=class a extends HTMLElement{static get observedAttributes(){return["bvid","autoplay","muted"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}disconnectedCallback(){var t;const s=(t=this.shadowRoot)==null?void 0:t.querySelector("iframe");s&&(s.src="")}render(){if(!this.shadowRoot)return;const s=this.getAttribute("bvid");if(!s){this.shadowRoot.innerHTML=`
        <style>${a.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;return}const t=this.hasAttribute("autoplay")?"1":"0",e=this.hasAttribute("muted")?"1":"0",o=new URLSearchParams({bvid:s,autoplay:t});e==="1"&&o.append("muted","1");const r=`https://player.bilibili.com/player.html?${o.toString()}`;this.shadowRoot.innerHTML=`
      <style>${a.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${r}" frameborder="0" allow="autoplay; fullscreen; encrypted-media"></iframe>
      </div>
    `}};c(a,"STYLES",`
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
  `);let n=a;customElements.define("bilibili-video",n);class i extends HTMLElement{constructor(){super();c(this,"shadow");this.shadow=this.attachShadow({mode:"open"}),this.render()}static get observedAttributes(){return["left-text","right-text","href","target"]}connectedCallback(){this.updateContent(),this.bindEvents()}disconnectedCallback(){const t=this.shadow.querySelector("a");t&&(t.removeEventListener("click",this.handleClick),t.removeEventListener("keydown",this.handleKeyPress))}attributeChangedCallback(){this.updateContent()}render(){const t=document.createElement("style");t.textContent=`
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
    `;const e=document.createElement("a");e.className="rl-container",e.setAttribute("role","link"),e.tabIndex=0;const o=document.createElement("div");o.className="rl-left";const r=document.createElement("div");r.className="rl-right",e.append(o,r),this.shadow.append(t,e)}updateContent(){var f;const t=this.shadow.querySelector("a"),e=((f=this.getAttribute("href"))==null?void 0:f.trim())??"#",o=this.getAttribute("target")??"_self";t.setAttribute("href",e),t.setAttribute("target",o);const r=this.getAttribute("left-text")??"",d=this.getAttribute("right-text")??"",b=this.shadow.querySelector(".rl-left"),u=this.shadow.querySelector(".rl-right");b.style.display=r.trim()?"flex":"none",b.textContent=r,u.style.display=d.trim()?"flex":"none",u.textContent=d}bindEvents(){const t=this.shadow.querySelector("a");t.addEventListener("click",this.handleClick.bind(this)),t.addEventListener("keydown",this.handleKeyPress.bind(this))}handleClick(t){const e=this.getAttribute("href");(!e||e==="#")&&t.preventDefault()}handleKeyPress(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.dispatchEvent(new MouseEvent("click")))}}customElements.define("resource-link",i);class l extends HTMLElement{constructor(){super();c(this,"shadow");this.shadow=this.attachShadow({mode:"open"}),this.render()}static get observedAttributes(){return["type"]}connectedCallback(){this.updateContent()}attributeChangedCallback(){this.updateContent()}render(){const t=document.createElement("style");t.textContent=`
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
    `;const e=document.createElement("div");e.className="text-box",e.setAttribute("role","alert");const o=document.createElement("span");o.className="icon";const r=document.createElement("slot");e.append(o,r),this.shadow.append(t,e)}updateContent(){const t=this.shadow.querySelector(".text-box"),e=this.shadow.querySelector(".icon");this.shadow.querySelector(".content");const o=this.getAttribute("type")??"normal";t.setAttribute("type",o);let r="";switch(o){case"warning":r="⚠️";break;case"error":r="❌";break;case"success":r="✅";break;default:r="ℹ️"}e.textContent=r}}customElements.define("text-box",l)});
