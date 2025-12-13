/**
 * 进度条组件
 * 使用示例：<progress-box percentage="50%" color="#6ce766"></progress-box>
 */
import { PROGRESS_BOX_STYLES } from './styles';
import type { ProgressUpdateDetail } from './types';

class ProgressBoxElement extends HTMLElement {
  static get observedAttributes() {
    return ['percentage', 'color'];
  }

  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateProgress();
  }

  attributeChangedCallback() {
    this.updateProgress();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = PROGRESS_BOX_STYLES;

    const container = document.createElement('div');
    container.className = 'pb-progress-container';
    container.innerHTML = `
      <div class="pb-progress-bar-container">
        <div class="pb-progress-bar"></div>
      </div>
      <div class="pb-progress-text"></div>
    `;

    this.shadow.append(style, container);
  }

  private updateProgress() {
    const percentage = this.getAttribute('percentage') || '0%';
    const color = this.getAttribute('color') || '#3498db';
    const progressBar = this.shadow.querySelector('.pb-progress-bar')!;
    const progressText = this.shadow.querySelector('.pb-progress-text')!;

    // 确保百分比格式正确
    const validPercentage = percentage.endsWith('%') ? percentage : `${percentage}%`;
    (progressBar as HTMLElement).style.width = validPercentage;
    (progressBar as HTMLElement).style.backgroundColor = color;
    progressText.textContent = validPercentage;

    // 触发进度更新事件
    this.dispatchEvent(new CustomEvent('progress-update', {
      detail: { percentage: validPercentage, color } as ProgressUpdateDetail,
      bubbles: true
    }));
  }
}

customElements.define('progress-box', ProgressBoxElement);

// 导出模块标识
export const PROGRESS_BOX_MODULE = 'progress-box';
