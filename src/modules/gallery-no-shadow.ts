/**
 * Gallery组件 (无 Shadow DOM 版本)
 * 使用示例:
 * <gallery-no-shadow pd="4" td="300">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-no-shadow>
 */
class GalleryNoShadowElement extends HTMLElement {
  private currentIndex: number = 0;
  private items: Element[] = [];
  private container: HTMLDivElement;
  private track: HTMLDivElement;
  private counter: HTMLDivElement;
  private prevButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private loadedIndices: Set<number> = new Set();
  private preloadDistance: number = 4; // 预加载前后多少张图片
  private transitionDuration: number = 300; // 过渡动画时长(ms)
  private isTransitioning: boolean = false; // 过渡状态标记

  constructor() {
    super();
    // 初始化DOM结构
    this.container = document.createElement('div');
    this.track = document.createElement('div');
    this.counter = document.createElement('div');
    this.prevButton = document.createElement('button');
    this.nextButton = document.createElement('button');
    
    this.render();
    this.applyCustomProperties();
  }

  // 组件挂载时调用
  connectedCallback() {
    this.buildGallery();
    this.addEventListeners();
    // 初始加载
    this.loadVisibleImages();
  }

  // 组件卸载时调用
  disconnectedCallback() {
    this.removeEventListeners();
  }

  // 观察自定义属性变化 - 使用简化的pd和td
  static get observedAttributes() {
    return ['pd', 'td'];
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
      }
    }
  }

  // 渲染组件结构和样式
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
      }

      .gbns-gallery-track {
        display: flex;
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
        transition: opacity 0.3s ease;
      }

      .gbns-gallery-item img.loading {
        opacity: 0.3;
        background: #f5f5f5;
      }

      .gbns-gallery-item img.loaded {
        opacity: 1;
      }

      .gbns-gallery-item img.error {
        opacity: 1;
        background: #ffebee;
        color: #b71c1c;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
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
        z-index: 10;
      }

      .gbns-gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .gbns-gallery-nav:focus {
        outline: 2px solid rgba(255, 255, 255, 0.8);
        outline-offset: 2px;
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
        z-index: 10;
      }
    `;

    // 设置元素属性和类名
    this.container.className = 'gbns-gallery-container';
    
    this.track.className = 'gbns-gallery-track';
    this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    
    this.prevButton.className = 'gbns-gallery-nav prev';
    this.prevButton.innerHTML = '‹';
    this.prevButton.setAttribute('aria-label', 'Previous image');
    
    this.nextButton.className = 'gbns-gallery-nav next';
    this.nextButton.innerHTML = '›';
    this.nextButton.setAttribute('aria-label', 'Next image');
    
    this.counter.className = 'gbns-gallery-counter';

    // 组装DOM
    this.container.append(this.track, this.prevButton, this.nextButton, this.counter);
    this.appendChild(style);
    this.appendChild(this.container);
  }

  // 应用自定义属性配置 - 使用简化的pd和td
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
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
    }
  }

  // 构建画廊内容
  private buildGallery() {
    // 保存原始子元素（过滤组件自身创建的元素）
    this.items = Array.from(this.children).filter(child => 
      !child.classList?.contains('gbns-gallery-container') && 
      child.tagName !== 'STYLE'
    );

    // 清空轨道
    this.track.innerHTML = '';

    // 创建画廊项
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gbns-gallery-item';
      itemElement.dataset.index = index.toString();

      // 处理图片延迟加载
      if (item.tagName === 'IMG') {
        const img = item as HTMLImageElement;
        const originalSrc = img.src;
        img.src = ''; // 清空src防止立即加载
        img.dataset.src = originalSrc;
        img.classList.add('loading');
        // 添加错误提示
        img.alt = img.alt || `Image ${index + 1}`;
      } else if (item.querySelector('img')) {
        const img = item.querySelector('img') as HTMLImageElement;
        const originalSrc = img.src;
        img.src = '';
        img.dataset.src = originalSrc;
        img.classList.add('loading');
      }

      itemElement.appendChild(item);
      this.track.appendChild(itemElement);
    });

    // 更新计数器
    this.updateCounter();
  }

  // 添加事件监听
  private addEventListeners() {
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());
    this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // 移除事件监听（防止内存泄漏）
  private removeEventListeners() {
    this.prevButton.removeEventListener('click', () => this.prev());
    this.nextButton.removeEventListener('click', () => this.next());
    this.track.removeEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // 处理过渡结束事件
  private handleTransitionEnd(e: TransitionEvent) {
    if (e.target === this.track) {
      this.isTransitioning = false;
      
      // 检查是否需要处理循环过渡后的位置重置
      if (this.currentIndex === 0 && this.track.style.transform !== 'translateX(0%)') {
        this.track.style.transition = 'none';
        this.track.style.transform = 'translateX(0%)';
        // 强制重绘
        void this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
      
      this.loadVisibleImages();
    }
  }

  // 处理窗口大小变化
  private handleResize() {
    // 重新计算位置，避免窗口大小变化导致的显示问题
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    // 强制重绘
    void this.track.offsetWidth;
    this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
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
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateCounter();
  }

  // 加载可见和预加载范围内的图片
  private loadVisibleImages() {
    if (this.items.length === 0) return;

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

  // 获取元素中的图片（提取重复逻辑）
  private getImageFromItem(item: Element): HTMLImageElement | null {
    if (item.tagName === 'IMG') {
      return item as HTMLImageElement;
    }
    return item.querySelector('img');
  }

  // 加载指定索引的图片
  private loadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length) return;

    const item = this.items[index];
    const img = this.getImageFromItem(item);
    
    if (img && img.dataset.src) {
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
        // 显示错误信息
        img.title = 'Failed to load image';
      };
      
      preloadImg.src = src;
    }
  }

  // 更新计数器显示
  private updateCounter() {
    if (this.items.length > 0) {
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
    if (direction === 'next') {
      // 从最后一张到第一张的循环
      this.currentIndex = this.items.length; // 临时设置为"虚拟"位置
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      // 过渡结束后切换到真实位置
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = newIndex;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        // 强制重绘
        void this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
        this.isTransitioning = false;
        this.updateCounter();
      }, this.transitionDuration);
    } else {
      // 从第一张到最后一张的循环
      this.track.style.transition = 'none';
      this.currentIndex = -1; // 临时设置为"虚拟"位置
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      // 强制重绘
      void this.track.offsetWidth;
      
      // 应用过渡效果到真实位置
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
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

// 注册自定义元素
customElements.define('gallery-no-shadow', GalleryNoShadowElement);
