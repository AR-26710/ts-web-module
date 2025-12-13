// 密码验证框组件类型定义

// 密码框属性接口
export interface PasswordBoxAttributes {
  /** 正确密码 */
  pw?: string;
  /** 标题文本 */
  title?: string;
  /** 提示文本 */
  tip?: string;
  /** 输入框占位符 */
  placeholder?: string;
  /** 错误提示文本 */
  error?: string;
}

// 密码验证事件详情
export interface PasswordEventDetail {
  /** 是否解锁成功 */
  unlocked: boolean;
}

// 密码框事件类型
export interface PasswordBoxEventMap {
  /** 密码验证正确时触发 */
  'password-correct': CustomEvent<PasswordEventDetail>;
}
