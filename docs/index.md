---
layout: doc
---

# Ts-Web-Module

一个基于 TypeScript 的 **Web 组件集合**，提供多种常用功能组件，用于丰富网页内容。

## 快速开始

通过 CDN 引入后即可使用自定义元素：

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js" type="module"></script>

<!-- 示例：Bilibili 视频 -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```

## 组件一览

| 组件 | 说明 |
|------|------|
| [Bilibili 视频嵌入](/components/bilibili-video) | 在网页中嵌入 B 站视频 |
| [双色链接](/components/resource-link) | 左右双文本的资源/下载链接 |
| [文本框](/components/text-box) | 普通/警告/错误/成功信息框 |
| [网盘链接](/components/cloud-drive) | 网盘类型、标题、提取码展示 |
| [进度条](/components/progress-box) | 可自定义颜色与百分比的进度条 |
| [标签页](/components/tabs-box) | 多标签切换内容 |
| [透视图](/components/perspective-view) | 双图透视效果 |
| [画廊](/components/gallery-box) | 图片画廊（含 Shadow / 无 Shadow / v2） |
| [黑幕](/components/black-curtain) | 悬停/点击后显示被遮挡内容 |
| [黑幕文字](/components/black-text) | 仅遮挡包裹的文字 |
| [密码验证框](/components/password-box) | 输入密码后显示内容 |

## 下一步

- [介绍与引入方式](/guide/introduction) — 安装与引用说明
- [组件文档](/components/bilibili-video) — 各组件属性与示例
