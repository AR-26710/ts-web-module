// 标签页组件类型定义

// 标签页项接口
export interface TabItem {
  /** 标签页标题 */
  label: string;
  /** 标签页内容 */
  content: string;
  /** 标签页索引 */
  index: number;
}

// 标签切换事件详情
export interface TabChangeDetail {
  /** 当前激活的标签页索引 */
  activeIndex: number;
  /** 上一个激活的标签页索引 */
  previousIndex: number;
  /** 激活的标签页标签 */
  activeLabel: string;
}

// 标签页事件类型
export interface TabsBoxEventMap {
  /** 标签页切换时触发 */
  'tab-change': CustomEvent<TabChangeDetail>;
}
