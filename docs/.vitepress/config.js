import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ts-Web-Module',
  description: '基于 TypeScript 的 Web 组件集合，提供多种常用功能组件',
  lang: 'zh-CN',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // 引入 Web 组件库，使文档中的自定义元素生效（开发时可先 build 后使用 /ts-web-module-xxx.js）
    ['script', { src: 'https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js', type: 'module' }],
  ],
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => [
          'bilibili-video',
          'black-curtain',
          'black-text',
          'cloud-drive',
          'gallery-box',
          'gallery-box-v2',
          'gallery-no-shadow',
          'password-box',
          'perspective-view',
          'progress-box',
          'resource-link',
          'tabs-box',
          'text-box'
        ].includes(tag)
      }
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/bilibili-video' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍与引入', link: '/guide/introduction' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件列表',
          items: [
            { text: 'Bilibili 视频嵌入', link: '/components/bilibili-video' },
            { text: '双色链接', link: '/components/resource-link' },
            { text: '文本框', link: '/components/text-box' },
            { text: '网盘链接', link: '/components/cloud-drive' },
            { text: '进度条', link: '/components/progress-box' },
            { text: '标签页', link: '/components/tabs-box' },
            { text: '透视图', link: '/components/perspective-view' },
            { text: '画廊（Shadow DOM）', link: '/components/gallery-box' },
            { text: '画廊（无 Shadow）', link: '/components/gallery-no-shadow' },
            { text: '画廊 v2', link: '/components/gallery-box-v2' },
            { text: '黑幕', link: '/components/black-curtain' },
            { text: '黑幕文字', link: '/components/black-text' },
            { text: '密码验证框', link: '/components/password-box' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AR-26710/ts-web-module' },
    ],
    footer: {
      message: '© 2025 Ts-Web-Module. 保留所有权利。',
      copyright: 'MIT License',
    },
  },
})
