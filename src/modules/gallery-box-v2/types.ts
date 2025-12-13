// 图片画廊组件类型定义

// DOM 模式类型
export type GalleryDOMMode = 'shadow' | 'light';

// 缓动函数类型
export type GalleryEasingFunction = 
  'linear' | 
  'ease' | 
  'ease-in' | 
  'ease-out' | 
  'ease-in-out' | 
  string; // 允许自定义 cubic-bezier

// 滑动方向类型
export type GallerySlideDirection = 'prev' | 'next';

// 画廊属性接口
export interface GalleryBoxV2Attributes {
  pd?: string; // 预加载距离
  td?: string; // 过渡动画持续时间
  mode?: GalleryDOMMode; // DOM 模式
  easing?: GalleryEasingFunction; // 缓动函数
}

// 画廊事件类型
export interface GalleryBoxV2EventMap {
  'gallery-slide': CustomEvent<{
    currentIndex: number;
    total: number;
    direction: GallerySlideDirection;
  }>;
  'gallery-load': CustomEvent<{
    index: number;
    success: boolean;
  }>;
}
