# Ts-Web-Module

一个基于TypeScript的Web模块集合，提供多种常用功能组件，用于丰富网页内容。

## 引入方式

### 方法一：使用jsdelivr
通过jsdelivr CDN直接引入，无需下载文件：
```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.7.10/dist/main-1.7.10.es.min.js"></script>
```

### 方法二：下载本地引用
1. 从 [GitHub Releases](https://github.com/AR-26710/ts-web-module/releases) 下载最新版本
2. 将 `dist/main-1.7.10.es.min.js` 文件复制到项目目录
3. 在HTML中引用：
```html
<script src="path/to/main-1.7.10.es.min.js"></script>
```

### 方法三：自定义CDN加速
将文件部署到您的CDN服务，然后引用：
```html
<script src="https://your-custom-cdn.com/path/to/main-1.7.10.es.min.js"></script>
```

## 项目目录结构

```
├── .env                    # 环境变量配置文件，包含版本号等信息
├── .github/workflows/      # GitHub Actions 工作流配置
│   └── release.yml         # 自动发布配置
├── dist/                   # 构建输出目录
│   ├── css/                # CSS 样式文件
│   ├── examples/           # 示例 HTML 文件
│   ├── images/             # 图片资源
│   ├── js/                 # JavaScript 文件
│   ├── modules/            # 各个模块的独立构建文件
│   └── ts-web-module-*.min.js  # 主要构建文件
├── examples/               # 源码中的示例文件
├── public/                 # 静态资源文件
├── scripts/                # 构建脚本
│   └── generate-modules-config.js  # 生成模块配置脚本
├── src/                    # 源代码目录
│   ├── modules/            # 各功能模块的源代码
│   ├── modules-config.ts   # 模块配置
│   ├── ts-web-module-config.ts  # 主配置文件
│   └── ts-web-module.ts    # 主入口文件
├── package.json            # 项目依赖和脚本配置
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 构建配置
```

## 构建项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 生成模块配置
npm run gen:config
```

## 许可证

[MIT](LICENSE)
