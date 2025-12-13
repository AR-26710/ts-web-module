/**
 * 文本显示框组件
 * 使用示例：
 * <text-box type="normal">这是一条普通信息</text-box>
 * <text-box type="warning">这是一条警告信息</text-box>
 * <text-box type="error">这是一条错误信息</text-box>
 * <text-box type="success">这是一条成功信息</text-box>
 */
import { TEXT_BOX_STYLES } from './styles';
import type { TextBoxType } from './types';

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
    style.textContent = TEXT_BOX_STYLES;

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

    const type = (this.getAttribute('type') ?? 'normal') as TextBoxType;
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

// 导出模块标识
export const TEXT_BOX_MODULE = 'text-box';
