# 网盘链接组件

## 组件介绍

用于展示网盘下载链接的自定义 Web 组件，支持显示网盘类型、标题、提取码等信息。

## 属性说明

| 属性 | 说明 |
|------|------|
| **type** (必需) | 网盘类型，如 "百度网盘"、"腾讯微云" 等 |
| **url** (必需) | 网盘链接地址 |
| **title** (必需) | 资源标题 |
| **password** (可选) | 提取码，点击可自动复制 |

## 使用示例

### 无提取码的网盘链接

<cloud-drive type="百度网盘" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI"></cloud-drive>

### 带提取码的网盘链接

<cloud-drive type="百度网盘" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI" password="e2rr"></cloud-drive>

## HTML 代码

```html
<!-- 无提取码的网盘链接 -->
<cloud-drive type="百度网盘" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI"></cloud-drive>

<!-- 带提取码的网盘链接 -->
<cloud-drive type="百度网盘" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI" password="e2rr"></cloud-drive>
```

## 功能特性

- 显示网盘类型图标
- 点击提取码可自动复制到剪贴板
- 悬停效果增强用户体验
- 标题过长时自动省略
