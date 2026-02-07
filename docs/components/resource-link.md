# 双色链接组件

## 组件介绍

用于显示资源链接的自定义 Web 组件，支持左右双文本显示，适用于文件下载、联系方式等场景。

## 属性说明

| 属性 | 说明 |
|------|------|
| **left-text** (必需) | 左侧主要文本 |
| **right-text** (可选) | 右侧辅助文本，如文件格式 |
| **href** (必需) | 链接地址 |
| **target** (可选) | 链接打开方式，如 "_blank" 表示新窗口打开 |

## 使用示例

### 带文件格式的资源链接

<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
<resource-link left-text="视频" right-text="MP4" href="/video.mp4"></resource-link>

### 普通链接

<resource-link left-text="联系我们" href="mailto:contact@example.com"></resource-link>

## HTML 代码

```html
<!-- 带文件格式的资源链接 -->
<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
<resource-link left-text="视频" right-text="MP4" href="/video.mp4"></resource-link>

<!-- 普通链接 -->
<resource-link left-text="联系我们" href="mailto:contact@example.com"></resource-link>
```

## 功能特性

- 双色文本显示，左侧为主要内容，右侧为辅助信息
- 支持各种链接类型（HTTP、HTTPS、邮件等）
- 现代化的卡片式设计
- 悬停效果增强用户体验
