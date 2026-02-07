export const GALLERY_BOX_V2_STYLES = `
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
    will-change: transform;
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
    transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    will-change: opacity, transform;
  }

  .gbv2-gallery-item img.loading {
    opacity: 0;
    transform: scale(0.95);
    background: #f5f5f5;
  }

  .gbv2-gallery-item img.loaded {
    opacity: 1;
    transform: scale(1);
  }

  .gbv2-gallery-item img.error {
    opacity: 1;
    transform: scale(1);
    background: #ffebee;
    color: #b71c1c;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }

  .gbv2-gallery-item {
    position: relative;
    overflow: hidden;
  }

  .gbv2-gallery-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0),
                linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
    opacity: 0.3;
    z-index: -1;
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
