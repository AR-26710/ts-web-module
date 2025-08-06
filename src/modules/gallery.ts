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
  private loadedIndices: Set<number> = new Set();
  private preloadDistance: number = 6; // 预加载前后多少张图片

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
        transition: opacity 0.3s ease;
      }

      .gb-gallery-item img.loading {
        opacity: 0.3;
        background: #f5f5f5;
      }

      .gb-gallery-item img.loaded {
        opacity: 1;
      }

      .gb-gallery-item img.error {
        opacity: 1;
        background: #ffebee;
        color: #b71c1c;
        display: flex;
        align-items: center;
        justify-content: center;
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
      itemElement.dataset.index = index.toString();

      // 克隆原始元素
      const clonedItem = item.cloneNode(true);

      // 存储原始图片信息，但不立即加载
      if (clonedItem instanceof Element && clonedItem.tagName === 'IMG') {
        const img = clonedItem as HTMLImageElement;
        const originalSrc = img.src;
        img.src = ''; // 清空src以防止立即加载
        img.dataset.src = originalSrc; // 存储原始src

        // 添加加载状态类
        img.classList.add('loading');
      } else if (clonedItem instanceof Element && clonedItem.querySelector('img')) {
        // 如果项目不是直接的img标签，查找其中的img标签
        const img = clonedItem.querySelector('img') as HTMLImageElement;
        const originalSrc = img.src;
        img.src = '';
        img.dataset.src = originalSrc;
        img.classList.add('loading');
      }

      itemElement.appendChild(clonedItem);
      track.appendChild(itemElement);
    });

    // 更新计数器
    this.updateCounter();
    // 加载初始图片
    this.loadVisibleImages();
  }

  private addEventListeners() {
    const prevButton = this.shadow.querySelector('.gb-gallery-nav.prev');
    const nextButton = this.shadow.querySelector('.gb-gallery-nav.next');

    prevButton?.addEventListener('click', () => this.prev());
    nextButton?.addEventListener('click', () => this.next());
    window.addEventListener('resize', () => this.loadVisibleImages());
    window.addEventListener('scroll', () => this.loadVisibleImages());
  }

  private updateGallery() {
    const track = this.shadow.querySelector('.gb-gallery-track') as HTMLElement;
    const counter = this.shadow.querySelector('.gb-gallery-counter');
    const prevButton = this.shadow.querySelector('.gb-gallery-nav.prev') as HTMLElement;
    const nextButton = this.shadow.querySelector('.gb-gallery-nav.next') as HTMLElement;

    if (!track || !counter || !prevButton || !nextButton) return;

    // 更新轨道位置
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // 更新导航按钮状态 - 在循环模式下始终启用
    prevButton.classList.remove('disabled');
    nextButton.classList.remove('disabled');

    // 更新计数器
    this.updateCounter();

    // 加载可见和需要预加载的图片
    this.loadVisibleImages();
  }

  private loadVisibleImages() {
    // 加载当前索引的图片以及前后preloadDistance张图片
    const startIndex = Math.max(0, this.currentIndex - this.preloadDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + this.preloadDistance);

    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.loadedIndices.has(i)) {
        this.loadImageAtIndex(i);
      }
    }

    // 可以选择卸载超出范围的图片以节省内存
    // 这里注释掉卸载逻辑，因为频繁卸载/加载可能影响用户体验
    /*
    this.loadedIndices.forEach(index => {
      if (index < startIndex || index > endIndex) {
        this.unloadImageAtIndex(index);
      }
    });
    */
  }

  private loadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length) return;

    const track = this.shadow.querySelector('.gb-gallery-track');
    if (!track) return;

    const itemElement = track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

    const src = img.dataset.src;

    // 创建新图片对象预加载
    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      img.classList.remove('loading');
      img.classList.add('loaded');
      this.loadedIndices.add(index);
    };
    newImg.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      // 占位图
      // img.src = 'error-placeholder.jpg';
    };
    newImg.src = src;
  }

  private unloadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length) return;

    const track = this.shadow.querySelector('.gb-gallery-track');
    if (!track) return;

    const itemElement = track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

    img.src = ''; // 清空src释放内存
    img.classList.remove('loaded', 'error');
    img.classList.add('loading');
    this.loadedIndices.delete(index);
  }

  private updateCounter() {
    const counter = this.shadow.querySelector('.gb-gallery-counter');
    if (counter && this.items.length > 0) {
      counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
  }

  private prev() {
    const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.slideToIndex(newIndex, 'prev');
  }

  private next() {
    const newIndex = (this.currentIndex + 1) % this.items.length;
    this.slideToIndex(newIndex, 'next');
  }

  private slideToIndex(newIndex: number, direction: 'prev' | 'next') {
    const track = this.shadow.querySelector('.gb-gallery-track') as HTMLElement;
    if (!track) return;

    // 设置过渡动画
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // 检查是否需要循环效果
    const isLooping = 
      (direction === 'next' && newIndex === 0 && this.currentIndex === this.items.length - 1) ||
      (direction === 'prev' && newIndex === this.items.length - 1 && this.currentIndex === 0);

    if (isLooping) {
      // 创建平滑的循环过渡
      this.performLoopTransition(newIndex, direction);
    } else {
      // 普通过渡
      this.currentIndex = newIndex;
      track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      // 动画结束后更新状态
      setTimeout(() => {
        this.updateCounter();
        this.loadVisibleImages();
      }, 500);
    }
  }

  private performLoopTransition(newIndex: number, direction: 'prev' | 'next') {
    const track = this.shadow.querySelector('.gb-gallery-track') as HTMLElement;
    if (!track) return;

    // 创建无缝循环效果
    if (direction === 'next' && newIndex === 0 && this.currentIndex === this.items.length - 1) {
      // 从最后一张到第一张的循环
      this.currentIndex = newIndex;
      
      // 使用缓动效果
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      track.style.transform = `translateX(-${this.items.length * 100}%)`;
      
      // 动画结束后重置到第一张
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';
        
        // 恢复过渡效果
        setTimeout(() => {
          track.style.transition = 'transform 0.3s ease';
          this.updateCounter();
          this.loadVisibleImages();
        }, 50);
      }, 500);
    } else if (direction === 'prev' && newIndex === this.items.length - 1 && this.currentIndex === 0) {
      // 从第一张到最后一张的循环
      this.currentIndex = newIndex;
      
      // 先快速移动到"虚拟"位置
      track.style.transition = 'none';
      track.style.transform = `translateX(-${this.items.length * 100}%)`;
      
      // 然后平滑过渡到最后一张
      setTimeout(() => {
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = `translateX(-${(this.items.length - 1) * 100}%)`;
        
        // 动画结束后更新状态
        setTimeout(() => {
          track.style.transition = 'transform 0.3s ease';
          this.updateCounter();
          this.loadVisibleImages();
        }, 500);
      }, 50);
    }
  }

  private goTo(index: number) {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.slideToIndex(index, direction);
    }
  }
}

customElements.define('gallery-component', GalleryElement);