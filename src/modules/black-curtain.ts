/**
 * 黑幕组件
 * 使用示例：
 * <black-curtain>
 *   <p>这是被遮挡的文字内容，鼠标移入或触摸时会显示出来</p>
 * </black-curtain>
 */
class BlackCurtainElement extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'opacity', 'speed'];
  }

  private readonly shadow: ShadowRoot;
  private overlayElement: HTMLDivElement | null = null;
  private isRevealed = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.setupEventListeners();
    this.updateOverlay();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.updateOverlay();
    }
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: relative;
        width: 100%;
        margin: 12px 0;
        font-family: inherit;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
      }

      .bc-container {
        position: relative;
        padding: 16px;
        border-radius: 8px;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        transition: all var(--bc-reveal-speed, 0.3s) ease;
        overflow: hidden;
      }

      .bc-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background-color: var(--bc-overlay-color, #000);
        opacity: var(--bc-overlay-opacity, 0.9);
        transition: opacity var(--bc-reveal-speed, 0.3s) ease;
        pointer-events: none;
      }

      .bc-overlay.revealed {
        opacity: 0;
        pointer-events: none;
      }

      .bc-content {
        position: relative;
        z-index: 1;
        filter: blur(0);
        transition: filter var(--bc-reveal-speed, 0.3s) ease;
      }

      :host(:not(.revealed)) .bc-content {
        filter: blur(2px);
      }

      .bc-hint {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 3;
        transition: opacity var(--bc-reveal-speed, 0.3s) ease;
      }

      .bc-overlay.revealed ~ .bc-hint {
        opacity: 0;
      }

      /* 触摸设备优化 */
      @media (hover: none) and (pointer: coarse) {
        :host {
          cursor: default;
        }
        
        .bc-hint::after {
          content: ' 点击显示';
        }
      }

      /* 桌面设备优化 */
      @media (hover: hover) and (pointer: fine) {
        .bc-hint::after {
          content: ' 悬停显示';
        }
      }

      /* 无障碍支持 */
      :host(:focus) {
        outline: 2px solid #007bff;
        outline-offset: 2px;
      }

      /* 暗色模式支持 */
      @media (prefers-color-scheme: dark) {
        .bc-container {
          background-color: #212529;
          border-color: #495057;
          color: #f8f9fa;
        }
      }
    `;

    const container = document.createElement('div');
    container.className = 'bc-container';

    const overlay = document.createElement('div');
    overlay.className = 'bc-overlay';
    this.overlayElement = overlay;

    const hint = document.createElement('div');
    hint.className = 'bc-hint';
    hint.textContent = '👁️';

    const content = document.createElement('div');
    content.className = 'bc-content';
    
    const slot = document.createElement('slot');
    content.appendChild(slot);

    container.append(overlay, hint, content);
    this.shadow.append(style, container);
  }

  private setupEventListeners() {
    // 鼠标事件
    this.addEventListener('mouseenter', this.handleReveal);
    this.addEventListener('mouseleave', this.handleHide);
    
    // 触摸事件
    this.addEventListener('touchstart', this.handleTouchReveal);
    
    // 键盘事件（无障碍支持）
    this.addEventListener('keydown', this.handleKeyDown);
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', '黑幕组件，悬停或点击显示内容');
  }

  private removeEventListeners() {
    this.removeEventListener('mouseenter', this.handleReveal);
    this.removeEventListener('mouseleave', this.handleHide);
    this.removeEventListener('touchstart', this.handleTouchReveal);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleReveal = () => {
    this.reveal();
  };

  private handleHide = () => {
    // 检查是否是触摸设备，触摸设备需要点击才能隐藏
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouchDevice) {
      this.hide();
    }
  };

  private handleTouchReveal = (event: TouchEvent) => {
    event.preventDefault();
    if (!this.isRevealed) {
      this.reveal();
    } else {
      this.hide();
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isRevealed) {
        this.reveal();
      } else {
        this.hide();
      }
    }
  };

  private reveal() {
    if (this.isRevealed || !this.overlayElement) return;
    
    this.isRevealed = true;
    this.classList.add('revealed');
    this.overlayElement.classList.add('revealed');
    
    // 触发自定义事件
    this.dispatchEvent(new CustomEvent('bc-reveal', {
      bubbles: true,
      detail: { revealed: true }
    }));
  }

  private hide() {
    if (!this.isRevealed || !this.overlayElement) return;
    
    this.isRevealed = false;
    this.classList.remove('revealed');
    this.overlayElement.classList.remove('revealed');
    
    // 触发自定义事件
    this.dispatchEvent(new CustomEvent('bc-hide', {
      bubbles: true,
      detail: { revealed: false }
    }));
  }

  private updateOverlay() {
    const overlayColor = this.getAttribute('color') || '#000';
    const overlayOpacity = this.getAttribute('opacity') || '0.9';
    const revealSpeed = this.getAttribute('speed') || '0.3s';

    this.style.setProperty('--bc-overlay-color', overlayColor);
    this.style.setProperty('--bc-overlay-opacity', overlayOpacity);
    this.style.setProperty('--bc-reveal-speed', revealSpeed);
  }

  // 公共API
  public revealContent() {
    this.reveal();
  }

  public hideContent() {
    this.hide();
  }

  public isContentRevealed(): boolean {
    return this.isRevealed;
  }
}

customElements.define('black-curtain', BlackCurtainElement);

// 导出模块标识
export const BLACK_CURTAIN_MODULE = 'black-curtain';