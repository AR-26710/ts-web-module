/**
 * GalleryBoxV2Element - 支持 Shadow DOM 的图片画廊组件
 * 
 * 这是一个现代化的图片画廊 Web Component，支持 Shadow DOM 和 Light DOM 模式切换，
 * 具有图片懒加载、无限循环、响应式设计和键盘导航等功能。
 * 
 * @example
 * ```html
 * <!-- 使用 Shadow DOM 模式 -->
 * <gallery-box-v2 pd="4" td="300" mode="shadow">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-box-v2>
 * 
 * <!-- 使用 Light DOM 模式（默认） -->
 * <gallery-box-v2 pd="3" td="500">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 * </gallery-box-v2>
 * ```
 * 
 * @attribute {string} pd - 预加载距离，控制前后预加载的图片数量（默认：4，最大：4）
 * @attribute {string} td - 过渡动画持续时间，单位毫秒（默认：300）
 * @attribute {string} mode - DOM 模式：'shadow' 使用 Shadow DOM，否则使用 Light DOM
 *
 */
import { GALLERY_BOX_V2_STYLES } from './styles';
import type { GalleryDOMMode, GalleryEasingFunction, GallerySlideDirection } from './types';

class GalleryBoxV2Element extends HTMLElement {
  /** 当前显示的图片索引 */
  private currentIndex: number = 0;
  
  /** 画廊中的所有图片项 */
  private items: Element[] = [];
  
  /** 画廊容器元素 */
  private container: HTMLDivElement;
  
  /** 图片轨道元素，用于水平滚动 */
  private track: HTMLDivElement;
  
  /** 计数器元素，显示当前图片位置 */
  private counter: HTMLDivElement;
  
  /** 上一张按钮 */
  private prevButton: HTMLButtonElement;
  
  /** 下一张按钮 */
  private nextButton: HTMLButtonElement;
  
  /** 已加载图片的索引集合 */
  private loadedIndices: Set<number> = new Set();
  
  /** 预加载距离，控制前后预加载的图片数量 */
  private preloadDistance: number = 4;
  
  /** 过渡动画持续时间（毫秒） */
  private transitionDuration: number = 300;

  /** 缓动函数类型 */
  private easingFunction: GalleryEasingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

  /** 是否正在执行过渡动画 */
  private isTransitioning: boolean = false;

  /** 当前活动的图片元素 */
  private activeImage: HTMLImageElement | null = null;

  /** 下一张图片元素 */
  private nextImage: HTMLImageElement | null = null;
  
  /** IntersectionObserver 实例，用于图片懒加载 */
  private observer: IntersectionObserver | null = null;
  
  /** 窗口大小调整的定时器 */
  private resizeTimeout: number | null = null;
  
  /** DOM 根节点：ShadowRoot 或 HTMLElement */
  private root: ShadowRoot | HTMLElement;
  
  /** 循环过渡的方向 */
  private loopDirection: GallerySlideDirection | null = null;
  
  /** 用于循环过渡的克隆元素 */
  private cloneElement: HTMLElement | null = null;
  
  /** 预克隆的第一张图片元素 */
  private firstClone: HTMLElement | null = null;
  
  /** 预克隆的最后一张图片元素 */
  private lastClone: HTMLElement | null = null;

  /** 触摸开始时的 X 坐标 */
  private touchStartX: number = 0;

  /** 触摸开始时的 Y 坐标 */
  private touchStartY: number = 0;

  /** 触摸结束时的 X 坐标 */
  private touchEndX: number = 0;

  /** 触摸结束时的 Y 坐标 */
  private touchEndY: number = 0;

  /** 最小滑动距离阈值 */
  private readonly SWIPE_THRESHOLD: number = 50;

  /**
   * 构造函数 - 初始化画廊组件
   * 
   * 根据 mode 属性决定使用 Shadow DOM 还是 Light DOM，
   * 创建必要的 DOM 元素并应用自定义属性。
   */
  constructor() {
    super();
    const mode = this.getAttribute('mode');
    this.root = mode === 'shadow' ? this.attachShadow({ mode: 'open' }) : this;

    this.container = document.createElement('div');
    this.track = document.createElement('div');
    this.counter = document.createElement('div');
    this.prevButton = document.createElement('button');
    this.nextButton = document.createElement('button');
    
    this.render();
    this.applyCustomProperties();
  }

  /**
   * 当元素被插入到文档时调用
   * 
   * 构建画廊、设置 IntersectionObserver、添加事件监听器
   * 并加载可见图片。
   */
  connectedCallback() {
    this.buildGallery();
    this.setupIntersectionObserver();
    this.addEventListeners();
    this.setupMediaSession();
    this.loadVisibleImages();
  }

  /**
   * 当元素从文档中移除时调用
   * 
   * 清理事件监听器和 IntersectionObserver，防止内存泄漏。
   */
  disconnectedCallback() {
    this.removeEventListeners();
    this.cleanupIntersectionObserver();
    this.cleanupMediaSession();
    
    if (this.firstClone && this.firstClone.parentNode) {
      this.firstClone.parentNode.removeChild(this.firstClone);
    }
    if (this.lastClone && this.lastClone.parentNode) {
      this.lastClone.parentNode.removeChild(this.lastClone);
    }
    if (this.cloneElement && this.cloneElement.parentNode) {
      this.cloneElement.parentNode.removeChild(this.cloneElement);
    }
  }

  /**
   * 定义需要监听的属性
   * 
   * @returns {string[]} 需要监听的属性名称数组
   */
  static get observedAttributes() {
    return ['pd', 'td', 'mode', 'easing'];
  }

  /**
   * 当监听的属性发生变化时调用
   * 
   * @param {string} name - 属性名称
   * @param {string} oldValue - 旧值
   * @param {string} newValue - 新值
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'mode') {
      console.warn('Mode cannot be changed dynamically.');
      return;
    }

    if (name === 'pd' && newValue) {
      const distance = parseInt(newValue, 10);
      if (!isNaN(distance) && distance > 0) {
        this.preloadDistance = Math.min(distance, 4); // 限制预加载距离
        this.loadVisibleImages();
      }
    }
    
    if (name === 'td' && newValue) {
      const duration = parseInt(newValue, 10);
      if (!isNaN(duration) && duration > 0) {
        this.transitionDuration = duration;
        this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      }
    }

    if (name === 'easing' && newValue) {
      this.easingFunction = newValue;
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
    }
  }

  /**
   * 渲染画廊的 DOM 结构和样式
   * 
   * 创建并配置画廊的容器、轨道、按钮和计数器元素，
   * 并应用相应的 CSS 样式。
   */
  private render() {
    const style = document.createElement('style');
    style.textContent = GALLERY_BOX_V2_STYLES;

    this.container.className = 'gbv2-gallery-container';
    this.track.className = 'gbv2-gallery-track';
    this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
    
    this.prevButton.className = 'gbv2-gallery-nav prev';
    this.prevButton.innerHTML = '‹';
    this.prevButton.setAttribute('aria-label', 'Previous image');
    
    this.nextButton.className = 'gbv2-gallery-nav next';
    this.nextButton.innerHTML = '›';
    this.nextButton.setAttribute('aria-label', 'Next image');
    
    this.counter.className = 'gbv2-gallery-counter';

    this.container.append(this.track, this.prevButton, this.nextButton, this.counter);
    this.root.appendChild(style);
    this.root.appendChild(this.container);
  }

  /**
   * 应用自定义属性配置
   * 
   * 从元素属性中读取并应用预加载距离和过渡动画持续时间。
   */
  private applyCustomProperties() {
    const preload = this.getAttribute('pd');
    const duration = this.getAttribute('td');
    
    if (preload) {
      const distance = parseInt(preload, 10);
      if (!isNaN(distance) && distance > 0) {
        this.preloadDistance = Math.min(distance, 4);
      }
    }
    
    if (duration) {
      const dur = parseInt(duration, 10);
      if (!isNaN(dur) && dur > 0) {
        this.transitionDuration = dur;
        this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      }
    }

    const easing = this.getAttribute('easing');
    if (easing) {
      this.easingFunction = easing;
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
    }
  }

  /**
   * 构建画廊结构
   * 
   * 处理子元素，创建图片项，设置懒加载属性，
   * 并初始化计数器。
   */
  private buildGallery() {
    this.items = Array.from(this.children).filter(child => 
      !child.classList?.contains('gbv2-gallery-container') && 
      child.tagName !== 'STYLE'
    );

    this.track.innerHTML = '';

    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gbv2-gallery-item';
      itemElement.dataset.index = index.toString();

      if (item.tagName === 'IMG') {
        const img = item as HTMLImageElement;
        const originalSrc = img.src;
        img.src = '';
        img.dataset.src = originalSrc;
        img.classList.add('loading');
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

    if (this.items.length > 1) {
      const firstItem = this.track.children[0] as HTMLElement;
      this.firstClone = firstItem.cloneNode(true) as HTMLElement;
      this.firstClone.dataset.index = '-1';
      this.firstClone.style.opacity = '0';
      
      const lastItem = this.track.children[this.items.length - 1] as HTMLElement;
      this.lastClone = lastItem.cloneNode(true) as HTMLElement;
      this.lastClone.dataset.index = String(this.items.length);
      this.lastClone.style.opacity = '0';
      
      const firstImg = this.firstClone.querySelector('img') as HTMLImageElement;
      if (firstImg && firstImg.dataset.src) {
        firstImg.src = '';
      }
      
      const lastImg = this.lastClone.querySelector('img') as HTMLImageElement;
      if (lastImg && lastImg.dataset.src) {
        lastImg.src = '';
      }
    }

    this.updateCounter();
  }

  /**
   * 设置 IntersectionObserver 用于图片懒加载
   * 
   * 监听图片项是否进入可视区域，自动加载可见图片。
   */
  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt((entry.target as HTMLElement).dataset.index || '0', 10);
          this.loadImageAtIndex(index);
        }
      });
    }, {
      root: this.container,
      threshold: 0.1,
      rootMargin: `${this.preloadDistance * 100}%`
    });

    this.items.forEach((_, index) => {
      const itemElement = this.track.children[index] as HTMLElement;
      this.observer?.observe(itemElement);
    });
  }

  /**
   * 清理 IntersectionObserver
   * 
   * 断开观察器连接，防止内存泄漏。
   */
  private cleanupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * 添加事件监听器
   * 
   * 为按钮、过渡动画、窗口大小调整和键盘事件添加监听器。
   */
  private addEventListeners() {
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());
    this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.addEventListener('resize', this.throttleResize.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  /**
   * 移除事件监听器
   * 
   * 清理所有添加的事件监听器。
   */
  private removeEventListeners() {
    this.prevButton.removeEventListener('click', () => this.prev());
    this.nextButton.removeEventListener('click', () => this.next());
    this.track.removeEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.removeEventListener('resize', this.throttleResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    
    this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * 节流窗口大小调整事件
   * 
   * 防止频繁触发 resize 事件，优化性能。
   */
  private throttleResize() {
    if (this.resizeTimeout) return;
    this.resizeTimeout = window.setTimeout(() => {
      this.handleResize();
      this.resizeTimeout = null;
    }, 100);
  }

  /**
   * 处理过渡动画结束事件
   * 
   * @param {TransitionEvent} e - 过渡事件对象
   */
  private handleTransitionEnd(e: TransitionEvent) {
    if (e.target !== this.track) return;

    this.isTransitioning = false;

    if (this.cloneElement) {
      this.cloneElement.style.opacity = '0';
      this.cloneElement.style.transition = 'none';
      setTimeout(() => {
        if (this.cloneElement && this.cloneElement.parentNode === this.track) {
          this.track.removeChild(this.cloneElement);
        }
        this.cloneElement = null;
      }, 50);
    }

    if (this.loopDirection === 'next') {
      this.track.style.transition = 'none';
      this.currentIndex = 0;
      this.track.style.transform = 'translateX(0%)';
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      this.loopDirection = null;
    } else if (this.loopDirection === 'prev') {
      this.track.style.transition = 'none';
      this.currentIndex = this.items.length - 1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      this.loopDirection = null;
    }

    this.updateCounter();
    this.loadVisibleImages();
    this.cleanupFarImages();
  }

  /**
   * 处理窗口大小调整
   * 
   * 重新计算画廊布局，确保图片正确显示。
   */
  private handleResize() {
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    void this.track.offsetWidth;
    this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
    this.loadVisibleImages();
  }

  /**
   * 处理键盘事件
   * 
   * @param {KeyboardEvent} e - 键盘事件对象
   */
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.prev();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.next();
      e.preventDefault();
    }
  }

  private handleTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  private handleTouchMove(e: TouchEvent) {
    this.touchEndX = e.touches[0].clientX;
    this.touchEndY = e.touches[0].clientY;
  }

  private handleTouchEnd(e: TouchEvent) {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        this.prev();
      } else {
        this.next();
      }
    }
    
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  private setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: '图片画廊',
        artist: 'Gallery Box V2',
        album: 'Image Gallery'
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.prev();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.next();
      });
    }
  }

  private cleanupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }
  }

  /**
   * 更新画廊显示
   * 
   * 根据当前索引更新轨道位置和计数器，添加淡入淡出效果。
   */
  private updateGallery() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // 获取当前和下一个图片元素以实现淡入淡出效果
    const currentItem = this.track.children[this.currentIndex] as HTMLElement;
    const currentImg = currentItem?.querySelector('img') as HTMLImageElement;
    
    if (currentImg) {
      // 确保当前图片完全可见
      currentImg.style.opacity = '1';
      currentImg.style.transform = 'scale(1)';
      currentImg.classList.remove('loading');
      currentImg.classList.add('loaded');
    }
    
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateCounter();
  }

  /**
   * 加载可见图片
   * 
   * 根据预加载距离加载当前可见范围内的图片。
   */
  private loadVisibleImages() {
    if (this.items.length === 0) return;

    const startIndex = this.currentIndex - this.preloadDistance;
    const endIndex = this.currentIndex + this.preloadDistance;

    for (let i = startIndex; i <= endIndex; i++) {
      const normalizedIndex = this.normalizeIndex(i);
      if (!this.loadedIndices.has(normalizedIndex)) {
        this.loadImageAtIndex(normalizedIndex);
      }
    }
  }

  private normalizeIndex(index: number): number {
    if (this.items.length === 0) return 0;
    return ((index % this.items.length) + this.items.length) % this.items.length;
  }

  /**
   * 清理远离当前视图的图片
   * 
   * 释放内存，卸载距离当前视图较远的图片。
   */
  private cleanupFarImages() {
    const cleanupDistance = this.preloadDistance * 2;
    const startIndex = this.currentIndex - cleanupDistance;
    const endIndex = this.currentIndex + cleanupDistance;

    const indicesToKeep = new Set<number>();
    for (let i = startIndex; i <= endIndex; i++) {
      indicesToKeep.add(this.normalizeIndex(i));
    }

    this.loadedIndices.forEach(index => {
      if (!indicesToKeep.has(index)) {
        const item = this.items[index];
        const img = this.getImageFromItem(item);
        if (img && img.src) {
          img.src = '';
          img.classList.remove('loaded', 'error');
          img.classList.add('loading');
          this.loadedIndices.delete(index);
        }
      }
    });
  }

  /**
   * 从图片项中获取图片元素
   * 
   * @param {Element} item - 图片项元素
   * @returns {HTMLImageElement | null} 图片元素或 null
   */
  private getImageFromItem(item: Element): HTMLImageElement | null {
    if (item.tagName === 'IMG') {
      return item as HTMLImageElement;
    }
    return item.querySelector('img');
  }

  /**
   * 加载指定索引的图片
   * 
   * @param {number} index - 图片索引
   */
  private loadImageAtIndex(index: number) {
    if (this.items.length === 0 || this.loadedIndices.has(index)) return;

    const item = this.items[index];
    const img = this.getImageFromItem(item);
    
    if (img && img.dataset.src) {
      const src = img.dataset.src;
      const preloadImg = new Image();
      preloadImg.onload = () => {
        img.src = src;
        img.classList.remove('loading', 'error');
        img.classList.add('loaded');
        this.loadedIndices.add(index);
        
        if (this.firstClone && index === 0) {
          const cloneImg = this.firstClone.querySelector('img') as HTMLImageElement;
          if (cloneImg && cloneImg.dataset.src) {
            cloneImg.src = src;
            cloneImg.classList.remove('loading', 'error');
            cloneImg.classList.add('loaded');
          }
        }
        
        if (this.lastClone && index === this.items.length - 1) {
          const cloneImg = this.lastClone.querySelector('img') as HTMLImageElement;
          if (cloneImg && cloneImg.dataset.src) {
            cloneImg.src = src;
            cloneImg.classList.remove('loading', 'error');
            cloneImg.classList.add('loaded');
          }
        }
      };
      
      preloadImg.onerror = () => {
        img.classList.remove('loading');
        img.classList.add('error');
        img.title = 'Failed to load image';
      };
      
      preloadImg.src = src;
    }
  }

  /**
   * 更新计数器显示
   * 
   * 显示当前图片位置和总图片数量。
   */
  private updateCounter() {
    if (this.items.length > 0) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      this.counter.setAttribute('aria-label', `Image ${this.currentIndex + 1} of ${this.items.length}`);
    }
  }

  /**
   * 显示上一张图片
   */
  private prev() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    const direction: GallerySlideDirection = 'prev';
    this.slideToIndex(newIndex, direction);
  }

  /**
   * 显示下一张图片
   */
  private next() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex + 1) % this.items.length;
    const direction: GallerySlideDirection = 'next';
    this.slideToIndex(newIndex, direction);
  }

  /**
   * 滑动到指定索引
   * 
   * @param {number} newIndex - 目标索引
   * @param {'prev' | 'next'} direction - 滑动方向
   */
  private slideToIndex(newIndex: number, direction: GallerySlideDirection) {
    const isLooping = 
      (direction === 'next' && newIndex === 0 && this.currentIndex === this.items.length - 1) ||
      (direction === 'prev' && newIndex === this.items.length - 1 && this.currentIndex === 0);

    if (isLooping && this.items.length > 1) {
      this.loopDirection = direction;
      this.handleLoopTransition(direction);
    } else {
      this.currentIndex = newIndex;
      // 根据方向调整动画效果
      if (direction === 'next') {
        this.easingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // easeOutQuad
      } else {
        this.easingFunction = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'; // easeInQuad
      }
      // 临时更新轨道过渡效果
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      // 动画完成后恢复默认缓动函数
      setTimeout(() => {
        this.easingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)'; // 恢复默认easeOutCubic
      }, this.transitionDuration);
      this.updateGallery();
    }
  }

  /**
   * 处理循环过渡动画
   * 
   * @param {'prev' | 'next'} direction - 循环方向
   */
  private handleLoopTransition(direction: GallerySlideDirection) {
    if (direction === 'next') {
      this.cloneElement = this.firstClone;
      
      if (this.cloneElement && this.cloneElement.parentNode !== this.track) {
        this.track.appendChild(this.cloneElement);
      }
      
      this.currentIndex = this.items.length;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.isTransitioning = true;
    } else {
      this.cloneElement = this.lastClone;
      
      if (this.cloneElement && this.cloneElement.parentNode !== this.track) {
        this.track.insertBefore(this.cloneElement, this.track.firstChild);
      }
      
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-100%)`;
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ${this.easingFunction}`;
      this.track.style.transform = `translateX(0%)`;
      this.isTransitioning = true;
    }
  }

  /**
   * 跳转到指定索引的图片
   * 
   * @param {number} index - 目标图片索引
   */
  public goTo(index: number) {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex && !this.isTransitioning) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.slideToIndex(index, direction);
    }
  }

  /**
   * 获取当前显示的图片索引
   * 
   * @returns {number} 当前图片索引
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

/**
 * 注册自定义元素
 */
customElements.define('gallery-box-v2', GalleryBoxV2Element);

/**
 * 导出模块标识
 */
export const GALLERY_BOX_V2_MODULE = 'gallery-box-v2';
