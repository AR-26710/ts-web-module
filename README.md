# ts-web-module

一个基于TypeScript的Web模块集合，提供多种常用功能组件，包括B站视频嵌入、资源链接处理和文本框功能。

## 模块说明

### Bilibili Embed

提供B站视频嵌入功能，支持自定义尺寸和播放参数。

### Resource Link

处理资源链接的解析和格式化，支持多种资源类型。

### Text Box

提供增强型文本框功能，支持格式化和验证。

## 使用示例

```typescript
// 导入模块
import { BilibiliEmbed, ResourceLink, TextBox } from 'ts-web-module';

// 使用B站嵌入组件
const bilibiliEmbed = new BilibiliEmbed('video-container', { aid: '123456', width: 800, height: 450 });
bilibiliEmbed.render();

// 处理资源链接
const resourceLink = new ResourceLink('https://example.com/file.pdf');
console.log(resourceLink.getFormattedLink());

// 使用文本框组件
const textBox = new TextBox('input-container', { maxLength: 100, allowHtml: false });
textBox.on('change', (value) => console.log('输入变化:', value));
```

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