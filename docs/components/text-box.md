# 文本框组件

## 组件介绍

用于显示不同类型信息的自定义 Web 组件，支持普通、警告、错误、成功等多种样式。

## 属性说明

| 属性 | 说明 |
|------|------|
| **type** (必需) | 信息类型，可选值：normal、warning、error、success |

## 使用示例

### 不同类型的信息框

<text-box type="normal">这是一条普通信息</text-box>
<text-box type="warning">这是一条警告信息</text-box>
<text-box type="error">这是一条错误信息</text-box>
<text-box type="success">这是一条成功信息</text-box>

## HTML 代码

```html
<!-- 普通信息 -->
<text-box type="normal">这是一条普通信息</text-box>

<!-- 警告信息 -->
<text-box type="warning">这是一条警告信息</text-box>

<!-- 错误信息 -->
<text-box type="error">这是一条错误信息</text-box>

<!-- 成功信息 -->
<text-box type="success">这是一条成功信息</text-box>
```

## 功能特性

- 不同类型的信息采用不同的颜色和图标
- 响应式设计，自适应容器宽度
- 简洁美观的边框和背景色
