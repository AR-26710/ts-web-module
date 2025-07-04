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
        font-family: Arial, sans-serif;
      }

      .tb-tabs-header {
        display: flex;
        border-bottom: 1px solid #ccc;
      }

      .tb-tab-button {
        padding: 8px 16px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        position: relative;
      }

      .tb-tab-button.active {
        color: #3498db;
      }

      .tb-tab-button.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #3498db;
      }

      .tb-tab-button:hover {
        color: #3498db;
      }

      .tb-tabs-content {
        padding: 16px;
        border: 1px solid #ccc;
        border-top: none;
        min-height: 100px;
      }

      .tb-tab-panel {
        display: none;
      }

      .tb-tab-panel.active {
        display: block;
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