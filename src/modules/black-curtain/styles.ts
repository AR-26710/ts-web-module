export const BLACK_CURTAIN_STYLES = `
  :host {
    display: block;
    position: relative;
    width: 100%;
    margin: 12px 0;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  :host::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    pointer-events: none;
  }

  .bc-container {
    position: relative;
    padding: 16px;
    border-radius: 8px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    transition: all var(--bc-reveal-speed, 0.3s) ease;
    overflow: hidden;
  }

  .bc-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: var(--bc-overlay-color, #000);
    opacity: var(--bc-overlay-opacity, 0.9);
    transition: opacity var(--bc-reveal-speed, 0.3s) ease;
    pointer-events: none;
  }

  .bc-overlay.revealed {
    opacity: 0;
    pointer-events: none;
  }

  .bc-content {
    position: relative;
    z-index: 1;
    filter: blur(0);
    transition: filter var(--bc-reveal-speed, 0.3s) ease;
  }

  :host(:not(.revealed)) .bc-content {
    filter: blur(2px);
  }

  .bc-hint {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 3;
    transition: opacity var(--bc-reveal-speed, 0.3s) ease;
  }

  .bc-overlay.revealed ~ .bc-hint {
    opacity: 0;
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    :host {
      cursor: default;
    }
    
    .bc-hint::after {
      content: ' 点击显示';
    }
  }

  /* 桌面设备优化 */
  @media (hover: hover) and (pointer: fine) {
    .bc-hint::after {
      content: ' 悬停显示';
    }
  }

  /* 无障碍支持 */
  :host(:focus) {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* 暗色模式支持 */
  @media (prefers-color-scheme: dark) {
    .bc-container {
      background-color: #212529;
      border-color: #495057;
      color: #f8f9fa;
    }
  }
`;
