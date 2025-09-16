/**
 * 黑幕文字组件 - 只遮挡指定的文字内容
 * 使用示例：
 * 这是<black-text>测试</black-text>文字，其中"测试"为被遮挡区域
 * 支持自定义幕布颜色
 */
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
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      .bt-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--bt-overlay-color, #000);
        opacity: 0.9;
        transition: opacity 0.3s ease;
        pointer-events: none;
        border-radius: 2px;
      }

      .bt-overlay.revealed {
        opacity: 0;
      }

      .bt-content {
        position: relative;
        display: inline-block;
        transition: filter 0.3s ease;
      }

      :host(:not(.revealed)) .bt-content {
        filter: blur(2px);
      }

      /* 桌面设备优化 */
      @media (hover: hover) and (pointer: fine) {
        :host(:hover) .bt-overlay {
          opacity: 0;
        }
        
        :host(:hover) .bt-content {
          filter: blur(0);
        }
      }

      /* 触摸设备优化 */
      @media (hover: none) and (pointer: coarse) {
        :host(.revealed) .bt-overlay {
          opacity: 0;
        }
        
        :host(.revealed) .bt-content {
          filter: blur(0);
        }
      }

      /* 无障碍支持 */
      :host(:focus) {
        outline: 2px solid #007bff;
        outline-offset: 2px;
      }

      /* 暗色模式支持 */
      @media (prefers-color-scheme: dark) {
        .bt-overlay {
          opacity: 0.7;
        }
      }
    `;

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