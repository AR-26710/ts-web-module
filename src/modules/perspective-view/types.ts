// 透视图组件类型定义

// 透视图组件属性接口
export interface PerspectiveViewAttributes {
  /** 第一张图片的URL */
  image1?: string;
  /** 第二张图片的URL */
  image2?: string;
  /** 透视范围的半径，单位像素 */
  radius?: string;
}

// 透视图事件详情
export interface PerspectiveMoveDetail {
  /** 透视中心点的X坐标 */
  x: number;
  /** 透视中心点的Y坐标 */
  y: number;
  /** 当前透视范围半径 */
  radius: number;
}

// 透视图事件类型
export interface PerspectiveViewEventMap {
  /** 透视中心点移动时触发 */
  'perspective-move': CustomEvent<PerspectiveMoveDetail>;
}
