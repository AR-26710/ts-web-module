/**
 * 进度条组件
 * 使用示例：<progress-box percentage="50%" color="#6ce766"></progress-box>
 */
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
    style.textContent = `
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
  }
}

customElements.define('progress-box', ProgressBoxElement);

// 导出模块标识
export const PROGRESS_BOX_MODULE = 'progress-box';