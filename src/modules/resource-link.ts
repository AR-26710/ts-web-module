/**
 * 双色链接组件
 * 使用示例：<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
 */
class ResourceLinkElement extends HTMLElement {
  static get observedAttributes() {
    return ['left-text', 'right-text', 'href', 'target'];
  }

  private readonly shadow: ShadowRoot;

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

  private render() {
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

  private updateContent() {
    const link = this.shadow.querySelector('a')!;
    const href = this.getAttribute('href')?.trim() ?? '#';
    const target = this.getAttribute('target') ?? '_self';
    link.setAttribute('href', href);
    link.setAttribute('target', target);

    const leftText = this.getAttribute('left-text') ?? '';
    const rightText = this.getAttribute('right-text') ?? '';

    const left = this.shadow.querySelector('.rl-left') as HTMLElement;
    const right = this.shadow.querySelector('.rl-right') as HTMLElement;

    left.style.display = leftText.trim() ? 'flex' : 'none';
    left.textContent = leftText;

    right.style.display = rightText.trim() ? 'flex' : 'none';
    right.textContent = rightText;
  }

  private bindEvents() {
    const linkElement = this.shadow.querySelector('a')!;
    linkElement.addEventListener('click', this.handleClick.bind(this));
    linkElement.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  private handleClick(e: Event) {
    const href = this.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
    }
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.dispatchEvent(new MouseEvent('click'));
    }
  }
}

customElements.define('resource-link', ResourceLinkElement);

// 导出模块标识
export const RESOURCE_LINK_MODULE = 'resource-link';