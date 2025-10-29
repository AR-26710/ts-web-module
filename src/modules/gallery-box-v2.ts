/**
 * Gallery组件 (支持 Shadow DOM 版本，可通过 mode 属性切换)
 * 使用示例:
 * <gallery-box-v2 pd="4" td="300" mode="shadow">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-box-v2>
 * 
 * mode 属性: 'shadow' 使用 Shadow DOM，否则使用 Light DOM (默认)。
 */
class GalleryBoxV2Element extends HTMLElement {
  private currentIndex: number = 0;
  private items: Element[] = [];
  private container: HTMLDivElement;
  private track: HTMLDivElement;
  private counter: HTMLDivElement;
  private prevButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private loadedIndices: Set<number> = new Set();
  private preloadDistance: number = 4; // Preload distance
  private transitionDuration: number = 300; // Transition duration (ms)
  private isTransitioning: boolean = false;
  private observer: IntersectionObserver | null = null;
  private resizeTimeout: number | null = null;
  private root: ShadowRoot | HTMLElement;
  private loopDirection: 'prev' | 'next' | null = null;
  private cloneElement: HTMLElement | null = null;

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

  connectedCallback() {
    this.buildGallery();
    this.setupIntersectionObserver();
    this.addEventListeners();
    this.loadVisibleImages();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.cleanupIntersectionObserver();
  }

  static get observedAttributes() {
    return ['pd', 'td', 'mode'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'mode') {
      console.warn('Mode cannot be changed dynamically.');
      return;
    }

    if (name === 'pd' && newValue) {
      const distance = parseInt(newValue, 10);
      if (!isNaN(distance) && distance > 0) {
        this.preloadDistance = Math.min(distance, 4); // Cap preload distance
        this.loadVisibleImages();
      }
    }
    
    if (name === 'td' && newValue) {
      const duration = parseInt(newValue, 10);
      if (!isNaN(duration) && duration > 0) {
        this.transitionDuration = duration;
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
    }
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      .gbv2-gallery-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 8px;
      }

      .gbv2-gallery-track {
        display: flex;
      }

      .gbv2-gallery-item {
        min-width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .gbv2-gallery-item img {
        max-width: 100%;
        max-height: 600px;
        object-fit: contain;
        transition: opacity 0.3s ease;
      }

      .gbv2-gallery-item img.loading {
        opacity: 0.3;
        background: #f5f5f5;
      }

      .gbv2-gallery-item img.loaded {
        opacity: 1;
      }

      .gbv2-gallery-item img.error {
        opacity: 1;
        background: #ffebee;
        color: #b71c1c;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }

      .gbv2-gallery-nav {
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

      .gbv2-gallery-nav:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      .gbv2-gallery-nav:focus {
        outline: 2px solid rgba(255, 255, 255, 0.8);
        outline-offset: 2px;
      }

      .gbv2-gallery-nav.prev {
        left: 16px;
      }

      .gbv2-gallery-nav.next {
        right: 16px;
      }

      .gbv2-gallery-counter {
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

    this.container.className = 'gbv2-gallery-container';
    this.track.className = 'gbv2-gallery-track';
    this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    
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
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
    }
  }

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

    this.updateCounter();
  }

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

  private cleanupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private addEventListeners() {
    this.prevButton.addEventListener('click', () => this.prev());
    this.nextButton.addEventListener('click', () => this.next());
    this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.addEventListener('resize', this.throttleResize.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private removeEventListeners() {
    this.prevButton.removeEventListener('click', () => this.prev());
    this.nextButton.removeEventListener('click', () => this.next());
    this.track.removeEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.removeEventListener('resize', this.throttleResize.bind(this));
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private throttleResize() {
    if (this.resizeTimeout) return;
    this.resizeTimeout = window.setTimeout(() => {
      this.handleResize();
      this.resizeTimeout = null;
    }, 100);
  }

  private handleTransitionEnd(e: TransitionEvent) {
    if (e.target !== this.track) return;

    this.isTransitioning = false;

    if (this.cloneElement) {
      this.track.removeChild(this.cloneElement);
      this.cloneElement = null;
    }

    if (this.loopDirection === 'next') {
      this.track.style.transition = 'none';
      this.currentIndex = 0;
      this.track.style.transform = 'translateX(0%)';
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      this.loopDirection = null;
    } else if (this.loopDirection === 'prev') {
      this.track.style.transition = 'none';
      this.currentIndex = this.items.length - 1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      this.loopDirection = null;
    }

    this.updateCounter();
    this.loadVisibleImages();
    this.cleanupFarImages();
  }

  private handleResize() {
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    void this.track.offsetWidth;
    this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    this.loadVisibleImages();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.prev();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.next();
      e.preventDefault();
    }
  }

  private updateGallery() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateCounter();
  }

  private loadVisibleImages() {
    if (this.items.length === 0) return;

    const startIndex = Math.max(0, this.currentIndex - this.preloadDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + this.preloadDistance);

    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.loadedIndices.has(i)) {
        this.loadImageAtIndex(i);
      }
    }
  }

  private cleanupFarImages() {
    const cleanupDistance = this.preloadDistance * 2;
    const startIndex = Math.max(0, this.currentIndex - cleanupDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + cleanupDistance);

    this.loadedIndices.forEach(index => {
      if (index < startIndex || index > endIndex) {
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

  private getImageFromItem(item: Element): HTMLImageElement | null {
    if (item.tagName === 'IMG') {
      return item as HTMLImageElement;
    }
    return item.querySelector('img');
  }

  private loadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length || this.loadedIndices.has(index)) return;

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
      };
      
      preloadImg.onerror = () => {
        img.classList.remove('loading');
        img.classList.add('error');
        img.title = 'Failed to load image';
      };
      
      preloadImg.src = src;
    }
  }

  private updateCounter() {
    if (this.items.length > 0) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      this.counter.setAttribute('aria-label', `Image ${this.currentIndex + 1} of ${this.items.length}`);
    }
  }

  private prev() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    const direction: 'prev' | 'next' = 'prev';
    this.slideToIndex(newIndex, direction);
  }

  private next() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex + 1) % this.items.length;
    const direction: 'prev' | 'next' = 'next';
    this.slideToIndex(newIndex, direction);
  }

  private slideToIndex(newIndex: number, direction: 'prev' | 'next') {
    const isLooping = 
      (direction === 'next' && newIndex === 0 && this.currentIndex === this.items.length - 1) ||
      (direction === 'prev' && newIndex === this.items.length - 1 && this.currentIndex === 0);

    if (isLooping && this.items.length > 1) {
      this.loopDirection = direction;
      this.handleLoopTransition(direction);
    } else {
      this.currentIndex = newIndex;
      this.updateGallery();
    }
  }

  private handleLoopTransition(direction: 'prev' | 'next') {
    if (direction === 'next') {
      const firstItem = this.track.children[0] as HTMLElement;
      this.cloneElement = firstItem.cloneNode(true) as HTMLElement;
      this.track.appendChild(this.cloneElement);
      this.currentIndex = this.items.length;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.isTransitioning = true;
    } else {
      const lastItem = this.track.children[this.items.length - 1] as HTMLElement;
      this.cloneElement = lastItem.cloneNode(true) as HTMLElement;
      this.track.insertBefore(this.cloneElement, this.track.firstChild);
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-100%)`;
      void this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      this.track.style.transform = `translateX(0%)`;
      this.isTransitioning = true;
    }
  }

  public goTo(index: number) {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex && !this.isTransitioning) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.slideToIndex(index, direction);
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

customElements.define('gallery-box-v2', GalleryBoxV2Element);

// 导出模块标识
export const GALLERY_BOX_V2_MODULE = 'gallery-box-v2';