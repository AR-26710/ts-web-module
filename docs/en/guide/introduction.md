# Introduction & Usage

## Installation Methods

### Method 1: Using jsDelivr CDN

Import directly via jsDelivr CDN without downloading files:

```html
<script src="https://cdn.jsdelivr.net/gh/AR-26710/ts-web-module@1.10.3/dist/main-1.10.3.es.min.js" type="module"></script>
```

### Method 2: Local Download

1. Download the latest version from [GitHub Releases](https://github.com/AR-26710/ts-web-module/releases)
2. Copy the `dist/main-1.10.3.es.min.js` file to your project directory
3. Reference it in your HTML:

```html
<script src="path/to/main-1.10.3.es.min.js" type="module"></script>
```

### Method 3: Custom CDN

Deploy the file to your CDN service and reference it:

```html
<script src="https://your-custom-cdn.com/path/to/main-1.10.3.es.min.js" type="module"></script>
```

## Usage

After importing the script, use the corresponding custom element tags directly in your page. See [Component Documentation](/en/components/bilibili-video) for details.

## Project Build

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build production version
npm run build

# Preview production version
npm run preview

# Documentation development
npm run docs:dev

# Documentation build
npm run docs:build
```

## License

[MIT](https://github.com/AR-26710/ts-web-module/blob/main/LICENSE)
