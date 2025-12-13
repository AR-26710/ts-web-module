// 黑幕组件类型定义

// 黑幕组件属性接口
export interface BlackCurtainAttributes {
  color?: string;
  opacity?: string;
  speed?: string;
}

// 黑幕组件自定义事件详情
export interface BlackCurtainEventDetail {
  revealed: boolean;
}

// 黑幕组件自定义事件类型
export interface BlackCurtainEventMap {
  'bc-reveal': CustomEvent<BlackCurtainEventDetail>;
  'bc-hide': CustomEvent<BlackCurtainEventDetail>;
}
