# 进度条组件

## 组件介绍

用于显示进度信息的自定义 Web 组件，支持自定义颜色和百分比。

## 属性说明

| 属性 | 说明 |
|------|------|
| **percentage** (必需) | 进度百分比，格式为 "XX%" |
| **color** (可选) | 进度条颜色，支持十六进制颜色值 |

## 使用示例

### 不同颜色和进度的进度条

<progress-box percentage="99%" color="#6ce766"></progress-box>
<progress-box percentage="50%" color="#E4080A"></progress-box>

## HTML 代码

```html
<!-- 绿色进度条，99% 进度 -->
<progress-box percentage="99%" color="#6ce766"></progress-box>

<!-- 红色进度条，50% 进度 -->
<progress-box percentage="50%" color="#E4080A"></progress-box>
```

## 功能特性

- 直观的进度显示
- 支持自定义颜色
- 简洁的条形设计
- 响应式宽度
