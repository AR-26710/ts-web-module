/**
 * Gallery组件 (Shadow DOM版本)
 * 使用示例:
 * <gallery-component pd="4" td="300">
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
  private preloadDistance: number = 4; // 预加载前后多少张图片
  private transitionDuration: number = 300; // 过渡动画时长(ms)
  private isTransitioning: boolean = false; // 过渡状态标记

  // 缓存DOM元素引用
  private container: HTMLDivElement | null = null;
  private track: HTMLDivElement | null = null;
  private counter: HTMLDivElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
    this.cacheElements();
    this.applyCustomProperties();
  }

  // 组件挂载时调用
  connectedCallback() {
    this.buildGallery();
    this.addEventListeners();
    this.loadVisibleImages();
  }

  // 组件卸载时调用
  disconnectedCallback() {
    this.removeEventListeners();
  }

  // 观察自定义属性变化
  static get observedAttributes() {
    return ['pd', 'td']; // 使用简化属性名
  }

  // 自定义属性变化时触发
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'pd' && newValue) {
      const distance = parseInt(newValue, 10);
      if (!isNaN(distance) && distance > 0) {
        this.preloadDistance = distance;
        this.loadVisibleImages();
      }
    }
    
    if (name === 'td' && newValue) {
      const duration = parseInt(newValue, 10);
      if (!isNaN(duration) && duration > 0) {
        this.transitionDuration = duration;
        this.track?.style.setProperty('transition', `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`);
      }
    }
  }

  // 缓存DOM元素引用，减少查询次数
  private cacheElements() {
    this.container = this.shadow.querySelector('.gb-gallery-container');
    this.track = this.shadow.querySelector('.gb-gallery-track');
    this.counter = this.shadow.querySelector('.gb-gallery-counter');
    this.prevButton = this.shadow.querySelector('.gb-gallery-nav.prev');
    this.nextButton = this.shadow.querySelector('.gb-gallery-nav.next');
  }

  // 渲染组件结构和样式
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
        transition: transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
        min-height: 200px;
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
        z-index: 10;
      }

      .gb-gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .gb-gallery-nav:focus {
        outline: 2px solid rgba(255, 255, 255, 0.8);
        outline-offset: 2px;
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
        z-index: 10;
      }
    `;

    const container = document.createElement('div');
    container.className = 'gb-gallery-container';
    container.innerHTML = `
      <div class="gb-gallery-track"></div>
      <button class="gb-gallery-nav prev" aria-label="Previous image">‹</button>
      <button class="gb-gallery-nav next" aria-label="Next image">›</button>
      <div class="gb-gallery-counter" aria-live="polite"></div>
    `;

    this.shadow.append(style, container);
  }

  // 应用自定义属性配置
  private applyCustomProperties() {
    const preload = this.getAttribute('pd');
    const duration = this.getAttribute('td');
    
    if (preload) {
      const distance = parseInt(preload, 10);
      if (!isNaN(distance) && distance > 0) {
        this.preloadDistance = distance;
      }
    }
    
    if (duration) {
      const dur = parseInt(duration, 10);
      if (!isNaN(dur) && dur > 0) {
        this.transitionDuration = dur;
      }
    }
  }

  // 构建画廊内容
  private buildGallery() {
    const track = this.track;
    const counter = this.counter;
    if (!track || !counter) return;

    // 保存原始子元素
    this.items = Array.from(this.children);

    // 清空轨道
    track.innerHTML = '';

    // 创建画廊项
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gb-gallery-item';
      itemElement.dataset.index = index.toString();

      // 克隆原始元素
      const clonedItem = item.cloneNode(true);

      // 处理图片延迟加载
      if (clonedItem instanceof Element) {
        const img = clonedItem.tagName === 'IMG' 
          ? clonedItem as HTMLImageElement 
          : clonedItem.querySelector('img');
        
        if (img) {
          const originalSrc = img.src;
          img.src = ''; // 清空src防止立即加载
          img.dataset.src = originalSrc;
          img.classList.add('loading');
          img.alt = img.alt || `Image ${index + 1}`; // 确保有alt属性
        }
      }

      itemElement.appendChild(clonedItem);
      track.appendChild(itemElement);
    });

    // 更新计数器
    this.updateCounter();
  }

  // 添加事件监听
  private addEventListeners() {
    this.prevButton?.addEventListener('click', () => this.prev());
    this.nextButton?.addEventListener('click', () => this.next());
    this.track?.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // 移除事件监听（防止内存泄漏）
  private removeEventListeners() {
    this.prevButton?.removeEventListener('click', () => this.prev());
    this.nextButton?.removeEventListener('click', () => this.next());
    this.track?.removeEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // 处理过渡结束事件
  private handleTransitionEnd(e: TransitionEvent) {
    if (e.target !== this.track || !this.track) return;

    this.isTransitioning = false;
    
    // 处理循环过渡后的位置重置
    if (this.currentIndex === 0 && this.track.style.transform !== 'translateX(0%)') {
      this.track.style.transition = 'none';
      this.track.style.transform = 'translateX(0%)';
      // 强制重绘
      this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }
    
    this.loadVisibleImages();
  }

  // 处理窗口大小变化
  private handleResize() {
    if (!this.track) return;

    // 重新计算位置，避免窗口大小变化导致的显示问题
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    // 强制重绘
    this.track.offsetWidth;
    this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    this.loadVisibleImages();
  }

  // 处理键盘事件（支持左右箭头导航）
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.prev();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.next();
      e.preventDefault();
    }
  }

  // 更新画廊显示
  private updateGallery() {
    if (this.isTransitioning || !this.track) return;
    
    this.isTransitioning = true;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateCounter();
  }

  // 加载可见和预加载范围内的图片
  private loadVisibleImages() {
    if (this.items.length === 0 || !this.track) return;

    // 计算需要加载的范围
    const startIndex = Math.max(0, this.currentIndex - this.preloadDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + this.preloadDistance);

    // 加载范围内的图片
    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.loadedIndices.has(i)) {
        this.loadImageAtIndex(i);
      }
    }
  }

  // 加载指定索引的图片
  private loadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length || !this.track) return;

    const itemElement = this.track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

    const src = img.dataset.src;
    
    // 使用新Image对象预加载
    const preloadImg = new Image();
    preloadImg.onload = () => {
      img.src = src;
      img.classList.remove('loading', 'error');
      img.classList.add('loaded');
      this.loadedIndices.add(index);
    };
    
    preloadImg.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      img.title = 'Failed to load image';
    };
    
    preloadImg.src = src;
  }

  // 卸载指定索引的图片（按需启用）
  private unloadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length || !this.track) return;

    const itemElement = this.track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

    img.src = ''; // 清空src释放内存
    img.classList.remove('loaded', 'error');
    img.classList.add('loading');
    this.loadedIndices.delete(index);
  }

  // 更新计数器显示
  private updateCounter() {
    if (this.counter && this.items.length > 0) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      this.counter.setAttribute('aria-label', `Image ${this.currentIndex + 1} of ${this.items.length}`);
    }
  }

  // 切换到上一张
  private prev() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.slideToIndex(newIndex, 'prev');
  }

  // 切换到下一张
  private next() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex + 1) % this.items.length;
    this.slideToIndex(newIndex, 'next');
  }

  // 滑动到指定索引
  private slideToIndex(newIndex: number, direction: 'prev' | 'next') {
    if (!this.track) return;

    // 处理循环逻辑
    const isLooping = 
      (direction === 'next' && newIndex === 0 && this.currentIndex === this.items.length - 1) ||
      (direction === 'prev' && newIndex === this.items.length - 1 && this.currentIndex === 0);

    if (isLooping && this.items.length > 1) {
      this.handleLoopTransition(newIndex, direction);
    } else {
      this.currentIndex = newIndex;
      this.updateGallery();
    }
  }

  // 处理循环过渡
  private handleLoopTransition(newIndex: number, direction: 'prev' | 'next') {
    if (!this.track) return;

    if (direction === 'next') {
      // 从最后一张到第一张的循环
      this.currentIndex = this.items.length; // 临时设置为"虚拟"位置
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      // 过渡结束后切换到真实位置
      setTimeout(() => {
        if (!this.track) return;
        this.track.style.transition = 'none';
        this.currentIndex = newIndex;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        // 强制重绘
        this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        this.isTransitioning = false;
        this.updateCounter();
      }, this.transitionDuration);
    } else {
      // 从第一张到最后一张的循环
      this.track.style.transition = 'none';
      this.currentIndex = -1; // 临时设置为"虚拟"位置
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      // 强制重绘
      this.track.offsetWidth;
      
      // 应用过渡效果到真实位置
      this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      this.currentIndex = newIndex;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.isTransitioning = true;
      this.updateCounter();
    }
  }

  // 公共方法：跳转到指定索引
  public goTo(index: number) {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex && !this.isTransitioning) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.slideToIndex(index, direction);
    }
  }

  // 公共方法：获取当前索引
  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

customElements.define('gallery-component', GalleryElement);
