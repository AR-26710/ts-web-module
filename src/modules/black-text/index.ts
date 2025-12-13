/**
 * 黑幕文字组件 - 只遮挡指定的文字内容
 * 使用示例：
 * 这是<black-text>测试</black-text>文字，其中"测试"为被遮挡区域
 * 支持自定义幕布颜色
 */
import { BLACK_TEXT_STYLES } from './styles';

class BlackTextElement extends HTMLElement {
  static get observedAttributes() {
    return ['color'];
  }

  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && name === 'color') {
      this.updateOverlayColor();
    }
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = BLACK_TEXT_STYLES;

    const container = document.createElement('span');
    
    const overlay = document.createElement('div');
    overlay.className = 'bt-overlay';

    const content = document.createElement('span');
    content.className = 'bt-content';
    
    const slot = document.createElement('slot');
    content.appendChild(slot);

    container.append(overlay, content);
    this.shadow.append(style, container);
  }

  private setupEventListeners() {
    // 触摸事件
    this.addEventListener('touchstart', this.handleTouch);
    
    // 键盘事件（无障碍支持）
    this.addEventListener('keydown', this.handleKeyDown);
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', '黑幕文字组件，点击或悬停显示内容');
  }

  private removeEventListeners() {
    this.removeEventListener('touchstart', this.handleTouch);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleTouch = (event: TouchEvent) => {
    event.preventDefault();
    this.toggleReveal();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleReveal();
    }
  };

  private toggleReveal() {
    if (this.classList.contains('revealed')) {
      this.classList.remove('revealed');
    } else {
      this.classList.add('revealed');
    }
  }

  private updateOverlayColor() {
    const color = this.getAttribute('color');
    if (color) {
      this.style.setProperty('--bt-overlay-color', color);
    } else {
      this.style.removeProperty('--bt-overlay-color');
    }
  }
}

customElements.define('black-text', BlackTextElement);

// 导出模块标识
export const BLACK_TEXT_MODULE = 'black-text';
