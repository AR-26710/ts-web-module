/**
 * 文本显示框组件
 * 使用示例：
 * <text-box type="normal">这是一条普通信息</text-box>
 * <text-box type="warning">这是一条警告信息</text-box>
 * <text-box type="error">这是一条错误信息</text-box>
 * <text-box type="success">这是一条成功信息</text-box>
 */
class TextBoxElement extends HTMLElement {
  static get observedAttributes() {
    return ['type'];
  }

  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateContent();
  }

  attributeChangedCallback() {
    this.updateContent();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        --tb-normal-bg: #e7f5ff;
        --tb-normal-text: #1864ab;
        --tb-normal-border: #74c0fc;
        
        --tb-warning-bg: #fff9db;
        --tb-warning-text: #e67700;
        --tb-warning-border: #ffd43b;
        
        --tb-error-bg: #fff5f5;
        --tb-error-text: #c92a2a;
        --tb-error-border: #ff8787;
        
        --tb-success-bg: #ebfbee;
        --tb-success-text: #2b8a3e;
        --tb-success-border: #69db7c;
        
        display: block;
        width: 100%;
        margin: 12px 0;
        font-family: inherit;
      }
      
      .tb-text-box {
        padding: 12px 16px;
        border-radius: 6px;
        border-left: 4px solid;
        background-color: var(--tb-normal-bg);
        color: var(--tb-normal-text);
        border-color: var(--tb-normal-border);
        margin: 6px 0;
        transition: all 0.3s ease;
      }

      .tb-text-box:hover {
        transform: scale(1.01);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .tb-text-box[type="warning"] {
        background-color: var(--tb-warning-bg);
        color: var(--tb-warning-text);
        border-color: var(--tb-warning-border);
      }
      
      .tb-text-box[type="error"] {
        background-color: var(--tb-error-bg);
        color: var(--tb-error-text);
        border-color: var(--tb-error-border);
      }
      
      .tb-text-box[type="success"] {
        background-color: var(--tb-success-bg);
        color: var(--tb-success-text);
        border-color: var(--tb-success-border);
      }
      
      .tb-text-box .tb-icon {
        margin-right: 8px;
        font-weight: bold;
      }
    `;

    const container = document.createElement('div');
    container.className = 'tb-text-box';
    container.setAttribute('role', 'alert');

    const icon = document.createElement('span');
    icon.className = 'tb-icon';

    const slot = document.createElement('slot');

    container.append(icon, slot);
    this.shadow.append(style, container);
  }

  private updateContent() {
    const container = this.shadow.querySelector('.tb-text-box') as HTMLElement;
    const icon = this.shadow.querySelector('.tb-icon') as HTMLElement;

    const type = this.getAttribute('type') ?? 'normal';
    container.setAttribute('type', type);

    // 设置图标
    let iconText = '';
    switch(type) {
      case 'warning':
        iconText = '⚠️';
        break;
      case 'error':
        iconText = '❌';
        break;
      case 'success':
        iconText = '✅';
        break;
      default:
        iconText = 'ℹ️';
    }
    icon.textContent = iconText;

    // 内容通过slot自动投影，无需手动设置
    
  }
}

customElements.define('text-box', TextBoxElement);
