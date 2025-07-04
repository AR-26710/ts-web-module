# Ts-Web-Module

一个基于TypeScript的Web模块集合，提供多种常用功能组件。

## 引入方式

### 方法一：使用jsdelivr
通过jsdelivr CDN直接引入，无需下载文件：
```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.3.7/dist/ts-web-module-1.3.7.es.min.js"></script>
```

### 方法二：下载本地引用
1. 从 [GitHub Releases](https://github.com/AR-26710/ts-web-module/releases) 下载最新版本
2. 将 `dist/ts-web-module-1.3.7.es.min.js` 文件复制到项目目录
3. 在HTML中引用：
```html
<script src="path/to/ts-web-module-1.3.7.es.min.js"></script>
```

### 方法三：自定义CDN加速
将文件部署到您的CDN服务，然后引用：
```html
<script src="https://your-custom-cdn.com/path/to/ts-web-module-1.3.7.es.min.js"></script>
```

## 模块使用说明

### Bilibili Embed

提供B站视频嵌入功能，通过自定义元素 `<bilibili-video>` 实现。

#### 属性

- `bvid` (必填): B站视频的BV号
- `autoplay` (可选): 是否自动播放（无需值，存在即启用）
- `muted` (可选): 是否静音播放（无需值，存在即启用）

#### 使用示例

```html
<bilibili-video bvid="BV1xx411x7xx" autoplay muted></bilibili-video>
```

#### 特性

- 默认采用16:9宽高比，自适应容器宽度

### Resource Link

提供双色链接展示组件，通过自定义元素 `<resource-link>` 实现。

#### 属性

- `left-text` (可选): 左侧文本内容
- `right-text` (可选): 右侧文本内容
- `href` (必填): 链接目标地址
- `target` (可选): 链接打开方式（默认`_self`）

#### 使用示例

```html
<resource-link left-text="文档" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
```

#### 特性

- 支持悬停效果和阴影过渡动画
- 可通过CSS变量自定义颜色

### Text Box

提供不同类型的文本显示框，通过自定义元素 `<text-box>` 实现。

#### 属性
- `type` (可选): 文本框类型，可选值：`normal`(默认)、`warning`、`error`、`success`

#### 使用示例
```html
<text-box type="normal">这是一条普通信息</text-box>
<text-box type="warning">这是一条警告信息</text-box>
<text-box type="error">这是一条错误信息</text-box>
<text-box type="success">这是一条成功信息</text-box>
```

#### 特性
- 不同类型自动应用对应颜色和图标
- 支持自定义样式变量

### Cloud Drive

提供网盘链接展示组件，通过自定义元素 `<cloud-drive>` 实现，支持提取码复制功能。

#### 属性
- `type` (可选): 网盘类型（如"百度网盘"、"阿里云盘"），用于显示对应图标
- `url` (必填): 网盘资源链接
- `password` (可选): 提取码（存在时显示复制按钮）
- `title` (可选): 资源标题（默认"默认标题"）

#### 使用示例
```html
<cloud-drive type="百度网盘" url="#" password="bn6f" title="项目文档"></cloud-drive>
```

#### 特性
- 点击提取码区域可自动复制到剪贴板
- 支持悬停效果和阴影过渡动画
- 标题过长时自动省略并显示完整提示

## 构建项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 许可证

[MIT](LICENSE)
