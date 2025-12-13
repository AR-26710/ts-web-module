export const RESOURCE_LINK_STYLES = `
  :host {
    --rl-left-color: #2c3e50;
    --rl-right-color: #3498db;
    --rl-left-hover: #34495e;
    --rl-right-hover: #2980b9;
    --rl-divider-color: #95a5a6;
    --rl-text-color: #ecf0f1;
    display: inline-block;
    width: fit-content;
    min-width: 120px;
    font-family: inherit;
  }
  .rl-container {
    display: inline-flex;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-decoration: none;
    color: var(--rl-text-color);
    position: relative;
    margin: 10px 0;
  }
  .rl-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .rl-left, .rl-right {
    padding: 12px 20px;
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    transition: background 0.3s ease;
  }
  .rl-left {
    background: var(--rl-left-color);
  }
  .rl-right {
    background: var(--rl-right-color);
  }
  /* 只有当 right-text 存在时才显示左边框 */
  .rl-container:has(.rl-right:not(:empty)) .rl-left {
    border-right: 2px solid var(--rl-divider-color);
  }
  .rl-container:hover .rl-left {
    background: var(--rl-left-hover);
  }
  .rl-container:hover .rl-right {
    background: var(--rl-right-hover);
  }
`;
