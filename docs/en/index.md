---
layout: home

hero:
  name: Ts-Web-Module
  text: Web Components Collection
  tagline: A variety of commonly used functional components to enrich your web content
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/introduction
    - theme: alt
      text: Browse Components
      link: /en/components/bilibili-video
    - theme: alt
      text: GitHub
      link: https://github.com/AR-26710/ts-web-module

features:
  - icon: 🎬
    title: Bilibili Video
    details: Easily embed Bilibili videos in web pages with customizable parameters
    link: /en/components/bilibili-video
  - icon: 🔗
    title: Resource Link
    details: Dual-text resource/download links, beautiful and practical
    link: /en/components/resource-link
  - icon: 📦
    title: Cloud Drive
    details: Display cloud drive type, title, and extraction code with one-click copy
    link: /en/components/cloud-drive
  - icon: 📊
    title: Progress Box
    details: Progress bar component with customizable colors and percentages
    link: /en/components/progress-box
  - icon: 🗂️
    title: Tabs Box
    details: Multi-tab content switching for better information organization
    link: /en/components/tabs-box
  - icon: 🖼️
    title: Gallery
    details: Image gallery display with multiple style variants
    link: /en/components/gallery-box
  - icon: 🎭
    title: Black Curtain
    details: Hover/click to reveal hidden content, adding interactive fun
    link: /en/components/black-curtain
  - icon: 🔒
    title: Password Box
    details: Content revealed after password verification, protecting sensitive info
    link: /en/components/password-box
  - icon: 📝
    title: Text Box
    details: Normal/warning/error/success message boxes for various states
    link: /en/components/text-box

---

## Quick Start

Import via CDN and use custom elements directly:

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js" type="module"></script>

<!-- Example: Bilibili Video -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```
or import individually:

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/modules/bilibili-video-1.10.3.es.min.js" type="module"></script>

<!-- Example: Bilibili Video -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```
