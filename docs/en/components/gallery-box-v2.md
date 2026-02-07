# Gallery Component v2

## Component Introduction

A custom Web Component for creating image galleries, supporting multiple image display. This version supports Shadow DOM with optimized performance loading.

## Usage

Place `<img>` tags inside the `<gallery-box-v2>` tag, supporting any number of images.

## API Documentation

**GalleryBoxV2Element** — Image gallery component supporting Shadow DOM, with features like lazy loading, infinite looping, responsive design, and keyboard navigation.

| Attribute | Description |
|-----------|-------------|
| **pd** | Preload distance, controls the number of images to preload before and after (default: 4, max: 4) |
| **td** | Transition animation duration in milliseconds (default: 300) |
| **mode** | DOM mode: 'shadow' uses Shadow DOM, otherwise uses Light DOM |

### Shadow DOM Mode

```html
<gallery-box-v2 pd="4" td="300" mode="shadow">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</gallery-box-v2>
```

### Light DOM Mode (Default)

```html
<gallery-box-v2 pd="3" td="500">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
</gallery-box-v2>
```

## Usage Examples

### Gallery Display

<gallery-box-v2>
    <img src="/images/1.jpg" alt="Image 1">
    <img src="/images/2.jpg" alt="Image 2">
</gallery-box-v2>

## HTML Code

```html
<gallery-box-v2>
    <img src="/images/1.jpg" alt="Image 1">
    <img src="/images/2.jpg" alt="Image 2">
</gallery-box-v2>
```
