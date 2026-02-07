# Perspective View Component

## Component Introduction

A component for displaying perspective effects with dual-image comparison.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **image1** (required) | Path to the first image |
| **image2** (required) | Path to the second image |

## Usage Examples

### Perspective View Display

<perspective-view
    image1="/images/3.webp"
    image2="/images/4.webp"
></perspective-view>

### Another Perspective View

<perspective-view
    image1="/images/2.jpg"
    image2="/images/1.jpg"
></perspective-view>

## HTML Code

```html
<!-- Perspective view display -->
<perspective-view
    image1="/images/3.webp"
    image2="/images/4.webp"
></perspective-view>

<!-- Another perspective view -->
<perspective-view
    image1="/images/2.jpg"
    image2="/images/1.jpg"
></perspective-view>
```
