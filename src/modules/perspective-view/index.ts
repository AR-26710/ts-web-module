/**
 * 透视图组件
 * 使用示例:
 * <perspective-view
 *   image1="/upload/images/2024-08-09-ISxm.webp"
 *   image2="/upload/images/2024-08-09-PuEn.webp"
 * ></perspective-view>
 */
import { PERSPECTIVE_VIEW_STYLES } from './styles';
import type { PerspectiveMoveDetail } from './types';

class PerspectiveViewElement extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private container: HTMLElement;
  private image1: HTMLElement;
  private radius = 30;

  static get observedAttributes() {
    return ['image1', 'image2', 'radius'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.container = this.shadow.querySelector('.pv-container1')!;
    this.image1 = this.shadow.querySelector('.pv-image1')!;
  }

  connectedCallback() {
    this.addEventListeners();
    this.updateImages();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      if (name === 'radius') {
        this.radius = parseInt(newValue, 10);
        const valueDisplay = this.shadow.querySelector('.radius-value') as HTMLSpanElement;
        if (valueDisplay) valueDisplay.textContent = `${this.radius}px`;
      } else {
        this.updateImages();
      }
    }
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = PERSPECTIVE_VIEW_STYLES;

    const container = document.createElement('div');
    container.className = 'pv-container1';
    container.innerHTML = `
      <div class="pv-image1"></div>
      <div class="pv-image2"></div>
      <div class="pv-control-panel">
        <span>透视范围:</span>
        <input type="range" min="20" max="200" value="100" class="pv-radius-slider">
        <span class="pv-radius-value">100px</span>
      </div>
    `;

    this.shadow.append(style, container);
  }

  private updateImages() {
    const image1Url = this.getAttribute('image1');
    const image2Url = this.getAttribute('image2');
    const radius = this.getAttribute('radius');

    if (image1Url) {
      this.image1.style.backgroundImage = `url('${image1Url}')`;
    }
    if (image2Url) {
      (this.shadow.querySelector('.pv-image2') as HTMLElement).style.backgroundImage = `url('${image2Url}')`;
    }
    if (radius) {
      this.radius = parseInt(radius, 10);
      const slider = this.shadow.querySelector('.pv-radius-slider') as HTMLInputElement;
      const valueDisplay = this.shadow.querySelector('.pv-radius-value') as HTMLSpanElement;
      if (slider) slider.value = this.radius.toString();
      if (valueDisplay) valueDisplay.textContent = `${this.radius}px`;
    }
  }

  private addEventListeners() {
    const handleMove = (x: number, y: number) => {
      const rect = this.container.getBoundingClientRect();
      const relativeX = x - rect.left;
      const relativeY = y - rect.top;
      this.image1.style.clipPath = `circle(${this.radius}px at ${relativeX}px ${relativeY}px)`;
      
      // 触发自定义事件
      this.dispatchEvent(new CustomEvent('perspective-move', {
        detail: { x: relativeX, y: relativeY, radius: this.radius } as PerspectiveMoveDetail,
        bubbles: true
      }));
    };

    this.container.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    this.container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }, { passive: false });
    
    const slider = this.shadow.querySelector('.pv-radius-slider') as HTMLInputElement;
    const valueDisplay = this.shadow.querySelector('.pv-radius-value') as HTMLSpanElement;
    if (slider && valueDisplay) {
      slider.value = this.radius.toString();
      valueDisplay.textContent = `${this.radius}px`;
      slider.addEventListener('input', (e) => {
        this.radius = parseInt((e.target as HTMLInputElement).value, 10);
        valueDisplay.textContent = `${this.radius}px`;
        this.setAttribute('radius', this.radius.toString());
      });
    }

    this.container.addEventListener('mouseleave', () => {
      this.image1.style.clipPath = 'circle(0 at 0 0)';
    });

    this.container.addEventListener('touchend', () => {
      this.image1.style.clipPath = 'circle(0 at 0 0)';
    });
  }
}

customElements.define('perspective-view', PerspectiveViewElement);

// 导出模块标识
export const PERSPECTIVE_VIEW_MODULE = 'perspective-view';
