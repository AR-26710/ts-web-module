# Black Curtain Component

## Component Introduction

A custom Web Component for obscuring text content. When the user hovers over the component area or touches it on a touch device, the overlay is removed and the obscured text content is revealed.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **color** (optional) | Overlay color, default is black (#000) |
| **opacity** (optional) | Overlay opacity, default is 0.9 |
| **speed** (optional) | Show/hide animation speed, default is 0.3s |

## Usage Examples

### Basic Usage

<black-curtain>
    <h4>This is a secret message</h4>
    <p>When you hover over this area, the black curtain will automatically be removed, revealing this hidden content. This feature is perfect for spoiler warnings, answer reveals, or other scenarios requiring progressive content display.</p>
    <p>On touch devices, you need to tap to reveal content, and tap again to re-obscure.</p>
</black-curtain>

### Custom Style

<black-curtain color="#8b0000" opacity="0.8" speed="0.5s">
    <h4>Custom Red Overlay</h4>
    <p>This example uses a dark red overlay with 80% opacity and slower display speed (0.5 seconds). You can adjust these parameters as needed to suit different design requirements.</p>
</black-curtain>

### Fast Reveal Mode

<black-curtain color="#2c3e50" opacity="0.95" speed="0.1s">
    <h4>Quick Content Reveal</h4>
    <p>This example uses a very fast display speed (0.1 seconds), suitable for scenarios requiring quick response. The overlay uses dark blue with 95% opacity, providing a strong obscuring effect.</p>
</black-curtain>

## HTML Code

```html
<!-- Basic usage -->
<black-curtain>
    <h4>This is a secret message</h4>
    <p>Hidden content...</p>
</black-curtain>

<!-- Custom style -->
<black-curtain color="#8b0000" opacity="0.8" speed="0.5s">
    <h4>Custom red overlay</h4>
    <p>Custom content...</p>
</black-curtain>

<!-- Fast reveal -->
<black-curtain color="#2c3e50" opacity="0.95" speed="0.1s">
    <h4>Quick reveal</h4>
    <p>Fast display content...</p>
</black-curtain>
```

## Features

- Supports both mouse hover and touch click interactions
- Customizable overlay color and opacity
- Adjustable show/hide animation speed
- Supports keyboard accessibility (Enter/Space key)
- Responsive design, adapts to various devices
- Supports dark mode
- Supports custom event listeners
