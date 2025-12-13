// 双色链接组件类型定义

// 资源链接属性接口
export interface ResourceLinkAttributes {
  /** 左侧显示文本 */
  leftText?: string;
  /** 右侧显示文本 */
  rightText?: string;
  /** 链接地址 */
  href?: string;
  /** 链接打开方式，如 "_blank" */
  target?: string;
}

// 链接点击事件详情
export interface ResourceLinkClickDetail {
  /** 链接地址 */
  href: string;
  /** 链接打开方式 */
  target: string;
}

// 资源链接事件类型
export interface ResourceLinkEventMap {
  /** 链接点击时触发 */
  'resource-link-click': CustomEvent<ResourceLinkClickDetail>;
}
