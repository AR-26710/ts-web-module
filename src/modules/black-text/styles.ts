export const BLACK_TEXT_STYLES = `
  :host {
    display: inline-block;
    position: relative;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .bt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bt-overlay-color, #000);
    opacity: 0.9;
    transition: opacity 0.3s ease;
    pointer-events: none;
    border-radius: 2px;
  }

  .bt-overlay.revealed {
    opacity: 0;
  }

  .bt-content {
    position: relative;
    display: inline-block;
    transition: filter 0.3s ease;
  }

  :host(:not(.revealed)) .bt-content {
    filter: blur(2px);
  }

  /* 桌面设备优化 */
  @media (hover: hover) and (pointer: fine) {
    :host(:hover) .bt-overlay {
      opacity: 0;
    }
    
    :host(:hover) .bt-content {
      filter: blur(0);
    }
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    :host(.revealed) .bt-overlay {
      opacity: 0;
    }
    
    :host(.revealed) .bt-content {
      filter: blur(0);
    }
  }

  /* 无障碍支持 */
  :host(:focus) {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  /* 暗色模式支持 */
  @media (prefers-color-scheme: dark) {
    .bt-overlay {
      opacity: 0.7;
    }
  }
`;
