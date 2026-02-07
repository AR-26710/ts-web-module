# 透视图组件

## 组件介绍

用于展示透视效果的双图对比组件。

## 属性说明

| 属性 | 说明 |
|------|------|
| **image1** (必需) | 第一张图片的路径 |
| **image2** (必需) | 第二张图片的路径 |

## 使用示例

### 透视图效果展示

<perspective-view
    image1="/images/3.webp"
    image2="/images/4.webp"
></perspective-view>

### 另一组透视图

<perspective-view
    image1="/images/2.jpg"
    image2="/images/1.jpg"
></perspective-view>

## HTML 代码

```html
<!-- 透视图效果展示 -->
<perspective-view
    image1="/images/3.webp"
    image2="/images/4.webp"
></perspective-view>

<!-- 另一组透视图 -->
<perspective-view
    image1="/images/2.jpg"
    image2="/images/1.jpg"
></perspective-view>
```
