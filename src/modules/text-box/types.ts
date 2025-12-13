// 文本显示框组件类型定义

// 文本框类型枚举
export type TextBoxType = 'normal' | 'warning' | 'error' | 'success';

// 文本框属性接口
export interface TextBoxAttributes {
  /** 文本框类型，决定显示样式和图标 */
  type?: TextBoxType;
}
