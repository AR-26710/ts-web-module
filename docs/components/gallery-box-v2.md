# 画廊组件 v2

## 组件介绍

用于创建图片画廊的自定义 Web 组件，支持多张图片展示。该版本支持 Shadow DOM，优化了性能加载。

## 使用方式

在 `<gallery-box-v2>` 标签内放置 `<img>` 标签即可，支持任意数量的图片。

## API 说明

**GalleryBoxV2Element** — 支持 Shadow DOM 的图片画廊组件，具有图片懒加载、无限循环、响应式设计和键盘导航等功能。

| 属性 | 说明 |
|------|------|
| **pd** | 预加载距离，控制前后预加载的图片数量（默认：4，最大：4） |
| **td** | 过渡动画持续时间，单位毫秒（默认：300） |
| **mode** | DOM 模式：'shadow' 使用 Shadow DOM，否则使用 Light DOM |

### Shadow DOM 模式

```html
<gallery-box-v2 pd="4" td="300" mode="shadow">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</gallery-box-v2>
```

### Light DOM 模式（默认）

```html
<gallery-box-v2 pd="3" td="500">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
</gallery-box-v2>
```

## 使用示例

### 画廊展示

<gallery-box-v2>
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-7rXM.webp" alt="cosplay-4-7rXM.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-9S8F.webp" alt="cosplay-4-9S8F.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-pRPN.webp" alt="cosplay-4-pRPN.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-5B4j.webp" alt="cosplay-4-5B4j.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-jGSJ.webp" alt="cosplay-4-jGSJ.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-5Zip.webp" alt="cosplay-4-5Zip.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-7135.webp" alt="cosplay-4-7135.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-Qle2.webp" alt="cosplay-4-Qle2.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-4WRY.webp" alt="cosplay-4-4WRY.webp">
    <img src="https://blog-r2.makeinu.cn/cosplay/4/cosplay-4-DTAK.webp" alt="cosplay-4-DTAK.webp">
</gallery-box-v2>

## HTML 代码

```html
<gallery-box-v2>
    <img src="/images/1.jpg" alt="Image 1">
    <img src="/images/2.jpg" alt="Image 2">
</gallery-box-v2>
```
