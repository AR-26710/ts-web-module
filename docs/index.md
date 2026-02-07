---
layout: home

hero:
  name: Ts-Web-Module
  text: 基于 TypeScript 的 Web 组件集合
  tagline: 提供多种常用功能组件，轻松丰富你的网页内容
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/introduction
    - theme: alt
      text: 浏览组件
      link: /components/bilibili-video
    - theme: alt
      text: GitHub
      link: https://github.com/AR-26710/ts-web-module

features:
  - icon: 🎬
    title: Bilibili 视频嵌入
    details: 在网页中轻松嵌入 B 站视频，支持自定义参数
    link: /components/bilibili-video
  - icon: 🔗
    title: 双色链接
    details: 左右双文本的资源/下载链接，美观实用
    link: /components/resource-link
  - icon: 📦
    title: 网盘链接
    details: 展示网盘类型、标题、提取码，一键复制
    link: /components/cloud-drive
  - icon: 📊
    title: 进度条
    details: 可自定义颜色与百分比的进度条组件
    link: /components/progress-box
  - icon: 🗂️
    title: 标签页
    details: 多标签切换内容，组织信息更清晰
    link: /components/tabs-box
  - icon: 🖼️
    title: 画廊
    details: 图片画廊展示，支持多种样式变体
    link: /components/gallery-box
  - icon: 🎭
    title: 黑幕效果
    details: 悬停/点击后显示被遮挡内容，增加互动趣味
    link: /components/black-curtain
  - icon: 🔒
    title: 密码验证框
    details: 输入密码后显示内容，保护敏感信息
    link: /components/password-box
  - icon: 📝
    title: 文本框
    details: 普通/警告/错误/成功多种状态信息框
    link: /components/text-box

---

## 快速开始

通过 CDN 引入后即可使用自定义元素：

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js" type="module"></script>

<!-- 示例：Bilibili 视频 -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```

或者单独引入：

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/modules/bilibili-video-1.10.3.es.min.js" type="module"></script>

<!-- 示例：Bilibili 视频 -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```
