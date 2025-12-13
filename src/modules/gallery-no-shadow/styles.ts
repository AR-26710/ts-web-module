export const GALLERY_NO_SHADOW_STYLES = `
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
