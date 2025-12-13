/**
 * Gallery组件 (Shadow DOM版本)
 * 使用示例:
 * <gallery-box pd="4" td="300">
 *   <img src="image1.jpg" alt="Image 1">
 *   <img src="image2.jpg" alt="Image 2">
 *   <img src="image3.jpg" alt="Image 3">
 * </gallery-box>
 */
import { GALLERY_BOX_STYLES } from './styles';
import type { GallerySlideDirection } from './types';

class GalleryElement extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private currentIndex: number = 0;
  private items: Element[] = [];
  private loadedIndices: Set<number> = new Set();
  private preloadDistance: number = 4; // Preload distance
  private transitionDuration: number = 300; // Transition duration (ms)
  private isTransitioning: boolean = false;
  private observer: IntersectionObserver | null = null;
  private resizeTimeout: number | null = null;

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
        this.track?.style.setProperty('transition', `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`);
      }
    }
  }

  private cacheElements() {
    this.container = this.shadow.querySelector('.gb-gallery-container');
    this.track = this.shadow.querySelector('.gb-gallery-track');
    this.counter = this.shadow.querySelector('.gb-gallery-counter');
    this.prevButton = this.shadow.querySelector('.gb-gallery-nav.prev');
    this.nextButton = this.shadow.querySelector('.gb-gallery-nav.next');
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = GALLERY_BOX_STYLES;

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
      }
    }
  }

  private buildGallery() {
    const track = this.track;
    const counter = this.counter;
    if (!track || !counter) return;

    this.items = Array.from(this.children);
    track.innerHTML = '';

    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'gb-gallery-item';
      itemElement.dataset.index = index.toString();

      const clonedItem = item.cloneNode(true);
      if (clonedItem instanceof Element) {
        const img = clonedItem.tagName === 'IMG' 
          ? clonedItem as HTMLImageElement 
          : clonedItem.querySelector('img');
        
        if (img) {
          const originalSrc = img.src;
          img.src = '';
          img.dataset.src = originalSrc;
          img.classList.add('loading');
          img.alt = img.alt || `Image ${index + 1}`;
        }
      }

      itemElement.appendChild(clonedItem);
      track.appendChild(itemElement);
    });

    this.updateCounter();
  }

  private setupIntersectionObserver() {
    if (!this.container || !this.track) return;

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
      const itemElement = this.track!.children[index] as HTMLElement;
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
    this.prevButton?.addEventListener('click', () => this.prev());
    this.nextButton?.addEventListener('click', () => this.next());
    this.track?.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    window.addEventListener('resize', this.throttleResize.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private removeEventListeners() {
    this.prevButton?.removeEventListener('click', () => this.prev());
    this.nextButton?.removeEventListener('click', () => this.next());
    this.track?.removeEventListener('transitionend', this.handleTransitionEnd.bind(this));
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
    if (e.target !== this.track || !this.track) return;

    this.isTransitioning = false;
    if (this.currentIndex === 0 && this.track.style.transform !== 'translateX(0%)') {
      this.track.style.transition = 'none';
      this.track.style.transform = 'translateX(0%)';
      this.track.offsetWidth;
      this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }
    this.loadVisibleImages();
    this.cleanupFarImages();
  }

  private handleResize() {
    if (!this.track) return;

    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.track.offsetWidth;
    this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
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
    if (this.isTransitioning || !this.track) return;
    
    this.isTransitioning = true;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateCounter();
  }

  private loadVisibleImages() {
    if (this.items.length === 0 || !this.track) return;

    const startIndex = Math.max(0, this.currentIndex - this.preloadDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + this.preloadDistance);

    for (let i = startIndex; i <= endIndex; i++) {
      if (!this.loadedIndices.has(i)) {
        this.loadImageAtIndex(i);
      }
    }
  }

  private cleanupFarImages() {
    if (!this.track) return;

    const cleanupDistance = this.preloadDistance * 2;
    const startIndex = Math.max(0, this.currentIndex - cleanupDistance);
    const endIndex = Math.min(this.items.length - 1, this.currentIndex + cleanupDistance);

    this.loadedIndices.forEach(index => {
      if (index < startIndex || index > endIndex) {
        this.unloadImageAtIndex(index);
      }
    });
  }

  private loadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length || !this.track || this.loadedIndices.has(index)) return;

    const itemElement = this.track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

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

  private unloadImageAtIndex(index: number) {
    if (index < 0 || index >= this.items.length || !this.track) return;

    const itemElement = this.track.children[index] as HTMLElement;
    if (!itemElement) return;

    const img = itemElement.querySelector('img') as HTMLImageElement;
    if (!img || !img.dataset.src) return;

    img.src = '';
    img.classList.remove('loaded', 'error');
    img.classList.add('loading');
    this.loadedIndices.delete(index);
  }

  private updateCounter() {
    if (this.counter && this.items.length > 0) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
      this.counter.setAttribute('aria-label', `Image ${this.currentIndex + 1} of ${this.items.length}`);
    }
  }

  private prev() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.slideToIndex(newIndex, 'prev');
  }

  private next() {
    if (this.isTransitioning || this.items.length <= 1) return;
    
    const newIndex = (this.currentIndex + 1) % this.items.length;
    this.slideToIndex(newIndex, 'next');
  }

  private slideToIndex(newIndex: number, direction: GallerySlideDirection) {
    if (!this.track) return;

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
    if (!this.track) return;

    if (direction === 'next') {
      this.currentIndex = this.items.length;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      setTimeout(() => {
        if (!this.track) return;
        this.track.style.transition = 'none';
        this.currentIndex = newIndex;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.track.offsetWidth;
        this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        this.isTransitioning = false;
        this.updateCounter();
      }, this.transitionDuration);
    } else {
      this.track.style.transition = 'none';
      this.currentIndex = -1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.track.offsetWidth;
      
      this.track.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
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

customElements.define('gallery-box', GalleryElement);

// 导出模块标识
export const GALLERY_MODULE = 'gallery-box';
