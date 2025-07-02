"use strict";
/**
 * Bilibili 视频嵌入组件
 * 使用示例：<bilibili-video bvid="BV1xx411x7xx" autoplay muted></bilibili-video>
 */
class BilibiliEmbed extends HTMLElement {
    static get observedAttributes() {
        return ['bvid', 'autoplay', 'muted'];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback() {
        this.render();
    }
    disconnectedCallback() {
        var _a;
        // 清理资源（如事件监听器）
        const iframe = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('iframe');
        if (iframe) {
            iframe.src = ''; // 停止视频加载
        }
    }
    render() {
        if (!this.shadowRoot)
            return;
        const bvid = this.getAttribute('bvid');
        if (!bvid) {
            this.shadowRoot.innerHTML = `
        <style>${BilibiliEmbed.STYLES}</style>
        <div class="error-message">错误：缺少 bvid 属性</div>
      `;
            return;
        }
        // 默认不自动播放，默认不静音
        const autoplay = this.hasAttribute('autoplay') ? '1' : '0';
        const muted = this.hasAttribute('muted') ? '1' : '0';
        const params = new URLSearchParams({ bvid, autoplay });
        if (muted === '1')
            params.append('muted', '1');
        const iframeSrc = `https://player.bilibili.com/player.html?${params.toString()}`;
        this.shadowRoot.innerHTML = `
      <style>${BilibiliEmbed.STYLES}</style>
      <div class="bilibili-video-wrapper">
        <iframe src="${iframeSrc}" frameborder="0" allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>
      </div>
    `;
    }
}
BilibiliEmbed.STYLES = `
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
  `;
customElements.define('bilibili-video', BilibiliEmbed);
/**
 * 双色链接组件
 * 使用示例：<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
 */
class ResourceLinkElement extends HTMLElement {
    static get observedAttributes() {
        return ['left-text', 'right-text', 'href', 'target'];
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        this.updateContent();
        this.bindEvents();
    }
    disconnectedCallback() {
        const linkElement = this.shadow.querySelector('a');
        if (linkElement) {
            linkElement.removeEventListener('click', this.handleClick);
            linkElement.removeEventListener('keydown', this.handleKeyPress);
        }
    }
    attributeChangedCallback() {
        this.updateContent();
    }
    render() {
        const style = document.createElement('style');
        style.textContent = `
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
        const link = document.createElement('a');
        link.className = 'rl-container';
        link.setAttribute('role', 'link');
        link.tabIndex = 0;
        const left = document.createElement('div');
        left.className = 'rl-left';
        const right = document.createElement('div');
        right.className = 'rl-right';
        link.append(left, right);
        this.shadow.append(style, link);
    }
    updateContent() {
        var _a, _b, _c, _d, _e;
        const link = this.shadow.querySelector('a');
        const href = (_b = (_a = this.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '#';
        const target = (_c = this.getAttribute('target')) !== null && _c !== void 0 ? _c : '_self';
        link.setAttribute('href', href);
        link.setAttribute('target', target);
        const leftText = (_d = this.getAttribute('left-text')) !== null && _d !== void 0 ? _d : '';
        const rightText = (_e = this.getAttribute('right-text')) !== null && _e !== void 0 ? _e : '';
        const left = this.shadow.querySelector('.rl-left');
        const right = this.shadow.querySelector('.rl-right');
        left.style.display = leftText.trim() ? 'flex' : 'none';
        left.textContent = leftText;
        right.style.display = rightText.trim() ? 'flex' : 'none';
        right.textContent = rightText;
    }
    bindEvents() {
        const linkElement = this.shadow.querySelector('a');
        linkElement.addEventListener('click', this.handleClick.bind(this));
        linkElement.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    handleClick(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();
        }
    }
    handleKeyPress(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.dispatchEvent(new MouseEvent('click'));
        }
    }
}
customElements.define('resource-link', ResourceLinkElement);
/**
 * 文本显示框组件
 * 使用示例：
 * <text-box type="normal">这是一条普通信息</text-box>
 * <text-box type="warning">这是一条警告信息</text-box>
 * <text-box type="error">这是一条错误信息</text-box>
 * <text-box type="success">这是一条成功信息</text-box>
 */
class TextBoxElement extends HTMLElement {
    static get observedAttributes() {
        return ['type'];
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        this.updateContent();
    }
    attributeChangedCallback() {
        this.updateContent();
    }
    render() {
        const style = document.createElement('style');
        style.textContent = `
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
    `;
        const container = document.createElement('div');
        container.className = 'text-box';
        container.setAttribute('role', 'alert');
        const icon = document.createElement('span');
        icon.className = 'icon';
        const slot = document.createElement('slot');
        container.append(icon, slot);
        this.shadow.append(style, container);
    }
    updateContent() {
        var _a;
        const container = this.shadow.querySelector('.text-box');
        const icon = this.shadow.querySelector('.icon');
        const content = this.shadow.querySelector('.content');
        const type = (_a = this.getAttribute('type')) !== null && _a !== void 0 ? _a : 'normal';
        container.setAttribute('type', type);
        // 设置图标
        let iconText = '';
        switch (type) {
            case 'warning':
                iconText = '⚠️';
                break;
            case 'error':
                iconText = '❌';
                break;
            case 'success':
                iconText = '✅';
                break;
            default:
                iconText = 'ℹ️';
        }
        icon.textContent = iconText;
        // 内容通过slot自动投影，无需手动设置
    }
}
customElements.define('text-box', TextBoxElement);
/**
 * 选项卡组件
 * 使用示例：
 * <tabs-box>
 *   <tabs-pane title="第一个">单身狗的故事</tabs-pane>
 *   <tabs-pane title="第二个">小说家的故事</tabs-pane>
 * </tabs-box>
 */
class TabsBoxElement extends HTMLElement {
    static get observedAttributes() {
        return ['active-tab'];
    }
    constructor() {
        super();
        this.activeTabIndex = 0;
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        this.updateContent();
        this.addEventListeners();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active-tab' && newValue !== null) {
            this.activeTabIndex = parseInt(newValue, 10) || 0;
            this.updateContent();
        }
    }
    render() {
        const style = document.createElement('style');
        style.textContent = `
      :host {
        --tabs-bg: #f8f9fa;
        --tabs-border: #dee2e6;
        --tabs-active-bg: #ffffff;
        --tabs-active-text: #1864ab;
        --tabs-active-border: #1864ab;
        --tabs-text: #495057;
        
        display: block;
        width: 100%;
        margin: 12px 0;
        font-family: inherit;
      }

      .tabs-container {
        background-color: var(--tabs-bg);
        border: 1px solid var(--tabs-border);
        border-radius: 6px;
      }

      .tabs-header {
        display: flex;
        border-bottom: 1px solid var(--tabs-border);
      }

      .tab-item {
        padding: 12px 16px;
        cursor: pointer;
        color: var(--tabs-text);
        transition: all 0.2s ease-in-out;
      }

      .tab-item.active {
        background-color: var(--tabs-active-bg);
        color: var(--tabs-active-text);
        border-bottom: 2px solid var(--tabs-active-border);
        font-weight: bold;
      }

      .tab-item:hover:not(.active) {
        background-color: #e9ecef;
      }

      .tabs-content {
        padding: 16px;
      }

      .tabs-pane {
        display: none;
      }

      .tabs-pane.active {
        display: block;
      }

      .tabs-pane ::slotted(*) {
        display: block;
      }
    `;
        const container = document.createElement('div');
        container.className = 'tabs-container';
        container.setAttribute('role', 'tablist');
        const header = document.createElement('div');
        header.className = 'tabs-header';
        const content = document.createElement('div');
        content.className = 'tabs-content';
        container.append(header, content);
        this.shadow.append(style, container);
    }
    updateContent() {
        const header = this.shadow.querySelector('.tabs-header');
        const content = this.shadow.querySelector('.tabs-content');
        const panes = this.querySelectorAll('tabs-pane');
        // Clear existing headers
        header.innerHTML = '';
        // Create tab headers
        panes.forEach((pane, index) => {
            const title = pane.getAttribute('title') || `Tab ${index + 1}`;
            const tabItem = document.createElement('div');
            tabItem.className = `tab-item${index === this.activeTabIndex ? ' active' : ''}`;
            tabItem.setAttribute('role', 'tab');
            tabItem.setAttribute('aria-selected', index === this.activeTabIndex ? 'true' : 'false');
            tabItem.textContent = title;
            tabItem.dataset.index = index.toString();
            header.appendChild(tabItem);
            // Update pane visibility
            pane.className = `tabs-pane${index === this.activeTabIndex ? ' active' : ''}`;
            pane.setAttribute('role', 'tabpanel');
            pane.setAttribute('aria-hidden', index === this.activeTabIndex ? 'false' : 'true');
            if (index === this.activeTabIndex) {
                content.innerHTML = '';
                const slot = document.createElement('slot');
                slot.setAttribute('name', `pane-${index}`);
                pane.setAttribute('slot', `pane-${index}`);
                content.appendChild(slot);
            }
        });
    }
    addEventListeners() {
        const header = this.shadow.querySelector('.tabs-header');
        header.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('tab-item')) {
                const index = parseInt(target.dataset.index || '0', 10);
                this.activeTabIndex = index;
                this.setAttribute('active-tab', index.toString());
                this.updateContent();
            }
        });
    }
}
class TabsPaneElement extends HTMLElement {
    constructor() {
        super();
    }
}
customElements.define('tabs-box', TabsBoxElement);
customElements.define('tabs-pane', TabsPaneElement);
define("ts-web-module", ["require", "exports", "./modules/bilibili-embed", "./modules/resource-link", "./modules/text-box", "./modules/tabs-box"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
