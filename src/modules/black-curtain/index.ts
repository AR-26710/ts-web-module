/**
 * 黑幕组件
 * 使用示例：
 * <black-curtain>
 *   <p>这是被遮挡的文字内容，鼠标移入或触摸时会显示出来</p>
 * </black-curtain>
 */
import { BLACK_CURTAIN_STYLES } from './styles';
import type { BlackCurtainEventDetail } from './types';

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
    style.textContent = BLACK_CURTAIN_STYLES;

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
      detail: { revealed: true } as BlackCurtainEventDetail
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
      detail: { revealed: false } as BlackCurtainEventDetail
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
