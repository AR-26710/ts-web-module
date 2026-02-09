/**
 * Gallery组件 (无 Shadow DOM 版本)
 * 使用示例:
 * <gallery-no-shadow pd="4" td="300">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-no-shadow>
 */
import { GALLERY_NO_SHADOW_STYLES } from './styles';
import type { GallerySlideDirection } from './types';

class GalleryNoShadowElement extends HTMLElement {
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

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private readonly SWIPE_THRESHOLD: number = 50;

  constructor() {
    super();
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
    this.setupMediaSession();
    this.loadVisibleImages();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.cleanupIntersectionObserver();
    this.cleanupMediaSession();
  }

  static get observedAttributes() {
    return ['pd', 'td'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
    style.textContent = GALLERY_NO_SHADOW_STYLES;

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

    this.container.append(this.track, this.prevButton, this.nextButton, this.counter);
    this.appendChild(style);
    this.appendChild(this.container);
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
      !child.classList?.contains('gbns-gallery-container') && 
      child.tagName !== 'STYLE'
    );

    this.track.innerHTML = '';

    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gbns-gallery-item';
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
    
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

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

  private throttleResize() {
    if (this.resizeTimeout) return;
    this.resizeTimeout = window.setTimeout(() => {
      this.handleResize();
      this.resizeTimeout = null;
    }, 100);
  }

  private handleTransitionEnd(e: TransitionEvent) {
    if (e.target === this.track) {
      this.isTransitioning = false;
      if (this.currentIndex === 0 && this.track.style.transform !== 'translateX(0%)') {
        this.track.style.transition = 'none';
        this.track.style.transform = 'translateX(0%)';
        void this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      }
      this.loadVisibleImages();
      this.cleanupFarImages();
    }
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
        artist: 'Gallery No Shadow',
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
    const direction: GallerySlideDirection = 'prev';
    this.slideToIndex(newIndex, direction);
  }

  private next() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex + 1) % this.items.length;
    const direction: GallerySlideDirection = 'next';
    this.slideToIndex(newIndex, direction);
  }

  private slideToIndex(newIndex: number, direction: GallerySlideDirection) {
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

  private handleLoopTransition(newIndex: number, direction: GallerySlideDirection) {
    if (direction === 'next') {
      this.currentIndex = this.items.length;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = newIndex;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        void this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
        this.isTransitioning = false;
        this.updateCounter();
      }, this.transitionDuration);
    } else {
      this.track.style.transition = 'none';
      this.currentIndex = -1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      void this.track.offsetWidth;
      
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
      this.currentIndex = newIndex;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.isTransitioning = true;
      this.updateCounter();
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

customElements.define('gallery-no-shadow', GalleryNoShadowElement);

// 导出模块标识
export const GALLERY_NO_SHADOW_MODULE = 'gallery-no-shadow';
