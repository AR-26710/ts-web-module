# Bilibili 视频嵌入组件

## 组件介绍

用于在网页中嵌入 Bilibili 视频的自定义 Web 组件，支持自动播放、静音等功能。

## 属性说明

| 属性 | 说明 |
|------|------|
| **bvid** (必需) | Bilibili 视频的 BV 号，格式为 "BV1xx411x7xx" |
| **autoplay** (可选) | 添加此属性可启用自动播放 |
| **muted** (可选) | 添加此属性可启用静音模式 |

## 使用示例

### 自动播放静音模式

<bilibili-video bvid="BV1Ut411v74a" autoplay muted></bilibili-video>

### 普通模式

<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>

## HTML 代码

```html
<!-- 自动播放静音模式 -->
<bilibili-video bvid="BV1Ut411v74a" autoplay muted></bilibili-video>

<!-- 普通模式 -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```

## 注意事项

- 必须提供有效的 BV 号，否则组件会显示错误信息
- 自动播放功能可能受到浏览器策略限制
- 组件采用 16:9 宽高比，自适应容器宽度
