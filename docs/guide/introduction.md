# 介绍与引入

## 引入方式

### 方法一：使用 jsDelivr CDN

通过 jsDelivr CDN 直接引入，无需下载文件：

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js" type="module"></script>
```

### 方法二：下载本地引用

1. 从 [GitHub Releases](https://github.com/AR-26710/ts-web-module/releases) 下载最新版本
2. 将 `dist/main-1.10.3.es.min.js` 文件复制到项目目录
3. 在 HTML 中引用：

```html
<script src="path/to/main-1.10.3.es.min.js" type="module"></script>
```

### 方法三：自定义 CDN

将文件部署到您的 CDN 服务后引用：

```html
<script src="https://your-custom-cdn.com/path/to/main-1.10.3.es.min.js" type="module"></script>
```

## 使用方法

引入脚本后，在页面中直接使用对应的自定义元素标签即可，详见各 [组件文档](/components/bilibili-video)。

## 项目构建

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 文档开发
npm run docs:dev

# 文档构建
npm run docs:build
```

## 许可证

[MIT](https://github.com/AR-26710/ts-web-module/blob/main/LICENSE)
