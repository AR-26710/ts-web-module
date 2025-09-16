# 模块配置生成脚本

这个脚本用于自动生成 TypeScript Web 模块的配置文件。

## 文件说明

- `generate-modules-config.js` - 主脚本，用于生成模块配置文件
- `special-case.json` - 特殊情况配置文件，用于定义模块名到文件名和标签名的映射关系

## 配置说明

### special-case.json

该文件包含两个主要的配置对象：

#### moduleFileMap
定义模块名到文件名的映射关系。如果模块名和文件名相同，可以省略。

```json
{
  "moduleFileMap": {
    "tabs-box": "tabs-box",
    "bilibili-video": "bilibili-video"
  }
}
```

#### tagNameMap
定义模块名到HTML标签名的映射关系。如果模块名和标签名相同，可以省略。

```json
{
  "tagNameMap": {
    "tabs-box": "tabs-box",
    "bilibili-video": "bilibili-video"
  }
}
```

## 使用方法

```bash
node scripts/generate-modules-config.js
```

## 输出文件

脚本会生成两个配置文件：

1. `src/modules-config.ts` - Vite构建配置
2. `src/ts-web-module-config.ts` - 模块加载配置

## 错误处理

如果 `special-case.json` 文件不存在或格式错误，脚本会使用默认配置继续运行。