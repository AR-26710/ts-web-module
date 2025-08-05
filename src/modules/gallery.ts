/**
 * Gallery组件
 * 使用示例:
 * <gallery-component>
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-component>
 */
class GalleryElement extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private currentIndex: number = 0;
  private items: Element[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.buildGallery();
    this.addEventListeners();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      .gb-gallery-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .gb-gallery-track {
        display: flex;
        transition: transform 0.3s ease;
      }

      .gb-gallery-item {
        min-width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .gb-gallery-item img {
        max-width: 100%;
        max-height: 600px;
        object-fit: contain;
      }

      .gb-gallery-nav {
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

      .gb-gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .gb-gallery-nav.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .gb-gallery-nav.prev {
        left: 16px;
      }

      .gb-gallery-nav.next {
        right: 16px;
      }



      .gb-gallery-counter {
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

    const container = document.createElement('div');
    container.className = 'gb-gallery-container';
    container.innerHTML = `
      <div class="gb-gallery-track"></div>
      <button class="gb-gallery-nav prev">‹</button>
      <button class="gb-gallery-nav next">›</button>
      <div class="gb-gallery-counter"></div>
    `;

    this.shadow.append(style, container);
  }

  private buildGallery() {
    this.items = Array.from(this.children);
    const track = this.shadow.querySelector('.gb-gallery-track');
    const counter = this.shadow.querySelector('.gb-gallery-counter');

    if (!track || !counter) return;

    // 清空容器
    track.innerHTML = '';

    // 创建项目
    this.items.forEach((item, index) => {
      // 创建项目
      const itemElement = document.createElement('div');
      itemElement.className = 'gb-gallery-item';
      itemElement.appendChild(item.cloneNode(true));
      track.appendChild(itemElement);
    });

    // 更新计数器
    this.updateCounter();
  }

  private addEventListeners() {
    const prevButton = this.shadow.querySelector('.gb-gallery-nav.prev');
    const nextButton = this.shadow.querySelector('.gb-gallery-nav.next');

    prevButton?.addEventListener('click', () => this.prev());
    nextButton?.addEventListener('click', () => this.next());
  }

  private updateGallery() {
    const track = this.shadow.querySelector('.gb-gallery-track') as HTMLElement;
    const counter = this.shadow.querySelector('.gb-gallery-counter');
    const prevButton = this.shadow.querySelector('.gb-gallery-nav.prev') as HTMLElement;
    const nextButton = this.shadow.querySelector('.gb-gallery-nav.next') as HTMLElement;

    if (!track || !counter || !prevButton || !nextButton) return;

    // 更新轨道位置
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // 更新导航按钮状态
    if (this.currentIndex === 0) {
      prevButton.classList.add('disabled');
    } else {
      prevButton.classList.remove('disabled');
    }

    if (this.currentIndex === this.items.length - 1) {
      nextButton.classList.add('disabled');
    } else {
      nextButton.classList.remove('disabled');
    }

    // 更新计数器
    this.updateCounter();
  }

  private updateCounter() {
    const counter = this.shadow.querySelector('.gb-gallery-counter');
    if (counter && this.items.length > 0) {
      counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
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

customElements.define('gallery-component', GalleryElement);