# 黑幕文字组件

## 组件介绍

用于遮挡指定文字内容的自定义 Web 组件，只遮挡被包裹的文字区域，而非整个容器。

## 属性说明

| 属性 | 说明 |
|------|------|
| **color** (可选) | 自定义幕布颜色，默认为黑色 |

## 使用示例

### 基本用法

这是<black-text>测试</black-text>文字，其中「测试」为被遮挡区域。

### 自定义颜色

这是<black-text color="#ff0000">红色幕布</black-text>的文字效果。
这是<black-text color="#00ff00">绿色幕布</black-text>的文字效果。
这是<black-text color="#0000ff">蓝色幕布</black-text>的文字效果。

### 在句子中使用

在这个句子中，有一些<black-text>敏感信息</black-text>被遮挡了，用户需要<black-text color="#ff0000">交互</black-text>才能看到。

## HTML 代码

```html
<!-- 基本用法 -->
<p>这是<black-text>测试</black-text>文字</p>

<!-- 自定义颜色 -->
<p>这是<black-text color="#ff0000">红色幕布</black-text>的文字效果</p>

<!-- 在句子中使用 -->
<p>在这个句子中，有一些<black-text>敏感信息</black-text>被遮挡了</p>
```

## 交互方式

- **桌面设备**：鼠标悬停显示内容
- **移动设备**：点击显示内容

## 功能特性

- 只遮挡指定的文字内容区域
- 支持自定义幕布颜色
