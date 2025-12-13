// 进度条组件类型定义

// 进度条属性接口
export interface ProgressBoxAttributes {
  /** 进度百分比，如 "50%" 或 50 */
  percentage?: string | number;
  /** 进度条颜色，如 "#3498db" */
  color?: string;
}

// 进度更新事件详情
export interface ProgressUpdateDetail {
  /** 当前进度百分比 */
  percentage: string;
  /** 当前进度条颜色 */
  color: string;
}

// 进度条事件类型
export interface ProgressBoxEventMap {
  /** 进度更新时触发 */
  'progress-update': CustomEvent<ProgressUpdateDetail>;
}
