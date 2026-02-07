# Cloud Drive Component

## Component Introduction

A custom Web Component for displaying cloud drive download links, supporting display of cloud drive type, title, extraction code, and other information.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **type** (required) | Cloud drive type, such as "Baidu Netdisk", "Tencent Weiyun", etc. |
| **url** (required) | Cloud drive link address |
| **title** (required) | Resource title |
| **password** (optional) | Extraction code, click to auto-copy |

## Usage Examples

### Cloud Drive Link without Extraction Code

<cloud-drive type="Baidu Netdisk" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI"></cloud-drive>

### Cloud Drive Link with Extraction Code

<cloud-drive type="Baidu Netdisk" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI" password="e2rr"></cloud-drive>

## HTML Code

```html
<!-- Cloud drive link without extraction code -->
<cloud-drive type="Baidu Netdisk" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI"></cloud-drive>

<!-- Cloud drive link with extraction code -->
<cloud-drive type="Baidu Netdisk" url="https://pan.baidu.com/s/1MMJxnZRhIJu-Rph_4yTjkQ?pwd=e2rr" title="HaloThemeZipToolGUI" password="e2rr"></cloud-drive>
```

## Features

- Displays cloud drive type icon
- Click extraction code to auto-copy to clipboard
- Hover effects enhance user experience
- Auto-ellipsis for long titles
