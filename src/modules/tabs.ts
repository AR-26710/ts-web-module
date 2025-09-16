/**
 * Tabs组件
 * 使用示例:
 * <tabs-component>
 *   <div data-tab label="Tab 1">Content 1</div>
 *   <div data-tab label="Tab 2">Content 2</div>
 * </tabs-component>
 */
class TabsElement extends HTMLElement {
  private readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.buildTabs();
    this.addEventListeners();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = `
      .tb-tabs {
        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        --primary-color: #4361ee;
        --hover-color: #3a56d4;
        --text-color: #2b2d42;
        --light-text: #8d99ae;
        --bg-color: #ffffff;
        --border-color: #edf2f4;
        --content-bg: #f8f9fa;
        --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        margin: 8px 0;
      }

      .tb-tabs-header {
        display: flex;
        background-color: var(--bg-color);
        padding: 0 16px;
        position: relative;
        z-index: 1;
      }

      .tb-tab-button {
        padding: 12px 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: var(--light-text);
        position: relative;
        transition: var(--transition);
        outline: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .tb-tab-button.active {
        color: var(--primary-color);
      }

      .tb-tab-button.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 3px;
        background-color: var(--primary-color);
        border-radius: 3px 3px 0 0;
        transition: var(--transition);
      }

      .tb-tab-button:hover:not(.active) {
        color: var(--text-color);
      }

      .tb-tabs-content {
        padding: 24px;
        background-color: var(--content-bg);
        transition: var(--transition);
        height: auto;
      }

      .tb-tab-panel {
        display: none;
        animation: fadeIn 0.3s ease-out;
      }

      .tb-tab-panel.active {
        display: block;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 响应式设计 */
      @media (max-width: 600px) {
        .tb-tabs-header {
          overflow-x: auto;
          white-space: nowrap;
          padding: 0 8px;
          scrollbar-width: none;
        }
        
        .tb-tabs-header::-webkit-scrollbar {
          display: none;
        }
        
        .tb-tab-button {
          display: inline-block;
          width: auto;
          text-align: center;
          padding: 12px 16px;
        }
        
        .tb-tab-button.active::after {
          width: 60%;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
    `;

    const container = document.createElement('div');
    container.className = 'tb-tabs';
    container.innerHTML = `
      <div class="tb-tabs-header"></div>
      <div class="tb-tabs-content"></div>
    `;

    this.shadow.append(style, container);
  }

  private buildTabs() {
    const tabs = Array.from(this.querySelectorAll('[data-tab]'));
    const headerContainer = this.shadow.querySelector('.tb-tabs-header');
    const contentContainer = this.shadow.querySelector('.tb-tabs-content');

    if (!headerContainer || !contentContainer) return;

    tabs.forEach((tab, index) => {
      const label = tab.getAttribute('label') || `Tab ${index + 1}`;
      const content = tab.innerHTML;

      // 创建标签按钮
      const button = document.createElement('button');
      button.className = 'tb-tab-button';
      button.textContent = label;
      button.dataset.tabIndex = index.toString();
      if (index === 0) button.classList.add('active');
      headerContainer.appendChild(button);

      // 创建内容面板
      const panel = document.createElement('div');
      panel.className = 'tb-tab-panel';
      panel.innerHTML = content;
      panel.dataset.tabIndex = index.toString();
      if (index === 0) panel.classList.add('active');
      contentContainer.appendChild(panel);
    });
  }

  private addEventListeners() {
    const buttons = this.shadow.querySelectorAll('.tb-tab-button');
    buttons.forEach(button => {
      button.addEventListener('click', () => this.switchTab((button as HTMLElement).dataset.tabIndex));
    });
  }

  private switchTab(index: string | undefined) {
    if (!index) return;

    // 移除所有活动状态
    this.shadow.querySelectorAll('.tb-tab-button').forEach(btn => btn.classList.remove('active'));
    this.shadow.querySelectorAll('.tb-tab-panel').forEach(panel => panel.classList.remove('active'));

    // 设置选中状态
    const activeButton = this.shadow.querySelector(`.tb-tab-button[data-tab-index="${index}"]`);
    const activePanel = this.shadow.querySelector(`.tb-tab-panel[data-tab-index="${index}"]`);

    activeButton?.classList.add('active');
    activePanel?.classList.add('active');
  }
}

customElements.define('tabs-component', TabsElement);

// 导出模块标识
export const TABS_MODULE = 'tabs';