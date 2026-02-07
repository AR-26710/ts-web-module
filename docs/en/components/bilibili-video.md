# Bilibili Video Component

## Component Introduction

A custom Web Component for embedding Bilibili videos in web pages, supporting autoplay, mute, and other features.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **bvid** (required) | Bilibili video BV number, format: "BV1xx411x7xx" |
| **autoplay** (optional) | Add this attribute to enable autoplay |
| **muted** (optional) | Add this attribute to enable mute mode |

## Usage Examples

### Autoplay Mute Mode

<bilibili-video bvid="BV1Ut411v74a" autoplay muted></bilibili-video>

### Normal Mode

<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>

## HTML Code

```html
<!-- Autoplay mute mode -->
<bilibili-video bvid="BV1Ut411v74a" autoplay muted></bilibili-video>

<!-- Normal mode -->
<bilibili-video bvid="BV1b44y1q7Cb"></bilibili-video>
```

## Notes

- A valid BV number must be provided, otherwise the component will display an error message
- Autoplay functionality may be restricted by browser policies
- The component uses a 16:9 aspect ratio and adapts to container width
