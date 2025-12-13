export const PROGRESS_BOX_STYLES = `
  :host { display: inline-block; width: 100%; }
  .pb-progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .pb-progress-bar-container {
      flex: 1;
      height: 12px;
      background-color: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
    }
  .pb-progress-bar {
    height: 100%;
    background-color: #3498db;
    position: relative;
    z-index: 2;
  }
  .pb-progress-text {
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
    white-space: nowrap;
  }
  .pb-progress-bar {
    height: 100%;
    transition: width 0.3s ease;
    z-index: 2;
    position: relative;
  }
`;
