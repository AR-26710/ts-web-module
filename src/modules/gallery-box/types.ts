// 画廊组件类型定义

// 滑动方向类型
export type GallerySlideDirection = 'prev' | 'next';

// 图片状态类型
export type GalleryImageStatus = 'loading' | 'loaded' | 'error';

// 画廊组件属性接口
export interface GalleryBoxAttributes {
  /** 预加载距离，控制前后预加载的图片数量（默认：4，最大：4） */
  pd?: string;
  /** 过渡动画持续时间，单位毫秒（默认：300） */
  td?: string;
}
