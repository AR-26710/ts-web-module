/**
 * Gallery组件 (无 Shadow DOM 版本)
 * 使用示例:
 * <gallery-no-shadow>
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-no-shadow>
 */
class GalleryNoShadowElement extends HTMLElement {
  private currentIndex: number = 0;
  private items: Element[] = [];
  private container: HTMLDivElement | null = null;
  private track: HTMLDivElement | null = null;
  private counter: HTMLDivElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.buildGallery();
    this.addEventListeners();
  }

  private render() {
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      .gbns-gallery-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .gbns-gallery-track {
        display: flex;
        transition: transform 0.3s ease;
      }

      .gbns-gallery-item {
        min-width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .gbns-gallery-item img {
        max-width: 100%;
        max-height: 600px;
        object-fit: contain;
      }

      .gbns-gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        font-size: 24px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.3s;
        user-select: none;
      }

      .gbns-gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .gbns-gallery-nav.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .gbns-gallery-nav.prev {
        left: 16px;
      }

      .gbns-gallery-nav.next {
        right: 16px;
      }

      .gbns-gallery-counter {
        position: absolute;
        bottom: 16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
      }
    `;

    // 创建容器
    this.container = document.createElement('div');
    this.container.className = 'gbns-gallery-container';
    this.container.innerHTML = `
      <div class="gbns-gallery-track"></div>
      <button class="gbns-gallery-nav prev">‹</button>
      <button class="gbns-gallery-nav next">›</button>
      <div class="gbns-gallery-counter"></div>
    `;

    // 获取元素引用
    this.track = this.container.querySelector('.gbns-gallery-track');
    this.counter = this.container.querySelector('.gbns-gallery-counter');
    this.prevButton = this.container.querySelector('.gbns-gallery-nav.prev');
    this.nextButton = this.container.querySelector('.gbns-gallery-nav.next');

    // 添加到组件
    this.appendChild(style);
    this.appendChild(this.container);
  }

  private buildGallery() {
    if (!this.track || !this.counter) return;

    // 获取原始子元素（排除容器和样式）
    this.items = Array.from(this.children).filter(
      (child) => child !== this.container && child.tagName !== 'STYLE'
    );

    // 清空容器
    this.track.innerHTML = '';

    // 创建项目并移除原始子元素
    this.items.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gbns-gallery-item';
      itemElement.appendChild(item); // 直接移动原始元素，而非克隆
      this.track!.appendChild(itemElement);
    });

    // 更新计数器
    this.updateCounter();
  }

  private addEventListeners() {
    this.prevButton?.addEventListener('click', () => this.prev());
    this.nextButton?.addEventListener('click', () => this.next());
  }

  private updateGallery() {
    if (!this.track || !this.counter || !this.prevButton || !this.nextButton) return;

    // 更新轨道位置
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // 更新导航按钮状态
    if (this.currentIndex === 0) {
      this.prevButton.classList.add('disabled');
    } else {
      this.prevButton.classList.remove('disabled');
    }

    if (this.currentIndex === this.items.length - 1) {
      this.nextButton.classList.add('disabled');
    } else {
      this.nextButton.classList.remove('disabled');
    }

    // 更新计数器
    this.updateCounter();
  }

  private updateCounter() {
    if (this.counter && this.items.length > 0) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
  }

  private prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateGallery();
  }

  private next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateGallery();
  }

  private goTo(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.updateGallery();
    }
  }
}

customElements.define('gallery-no-shadow', GalleryNoShadowElement);