/**
 * 双色链接组件
 * 使用示例：<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
 */
import { RESOURCE_LINK_STYLES } from './styles';
import type { ResourceLinkClickDetail } from './types';

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
    style.textContent = RESOURCE_LINK_STYLES;

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

    // 触发自定义点击事件
    this.dispatchEvent(new CustomEvent('resource-link-click', {
      detail: {
        href: href || '#',
        target: this.getAttribute('target') || '_self'
      } as ResourceLinkClickDetail,
      bubbles: true
    }));
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
