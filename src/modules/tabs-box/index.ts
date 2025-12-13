/**
 * Tabs组件
 * 使用示例:
 * <tabs-box>
 *   <div data-tab label="Tab 1">Content 1</div>
 *   <div data-tab label="Tab 2">Content 2</div>
 * </tabs-box>
 */
import { TABS_BOX_STYLES } from './styles';
import type { TabChangeDetail } from './types';

class TabsElement extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private activeIndex: number = 0;

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
    style.textContent = TABS_BOX_STYLES;

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

    const newIndex = parseInt(index, 10);
    const previousIndex = this.activeIndex;
    
    if (newIndex === previousIndex) return;

    // 移除所有活动状态
    this.shadow.querySelectorAll('.tb-tab-button').forEach(btn => btn.classList.remove('active'));
    this.shadow.querySelectorAll('.tb-tab-panel').forEach(panel => panel.classList.remove('active'));

    // 设置选中状态
    const activeButton = this.shadow.querySelector(`.tb-tab-button[data-tab-index="${index}"]`);
    const activePanel = this.shadow.querySelector(`.tb-tab-panel[data-tab-index="${index}"]`);
    const activeLabel = activeButton?.textContent || '';

    activeButton?.classList.add('active');
    activePanel?.classList.add('active');
    
    // 更新当前活动索引
    this.activeIndex = newIndex;
    
    // 触发标签切换事件
    this.dispatchEvent(new CustomEvent('tab-change', {
      detail: {
        activeIndex: newIndex,
        previousIndex,
        activeLabel
      } as TabChangeDetail,
      bubbles: true
    }));
  }
}

customElements.define('tabs-box', TabsElement);

// 导出模块标识
export const TABS_MODULE = 'tabs-box';
