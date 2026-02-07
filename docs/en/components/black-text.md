# Black Text Component

## Component Introduction

A custom Web Component for obscuring specified text content, only covering the wrapped text area rather than the entire container.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **color** (optional) | Custom curtain color, default is black |

## Usage Examples

### Basic Usage

This is <black-text>test</black-text> text, where "test" is the obscured area.

### Custom Colors

This is <black-text color="#ff0000">red curtain</black-text> text effect.
This is <black-text color="#00ff00">green curtain</black-text> text effect.
This is <black-text color="#0000ff">blue curtain</black-text> text effect.

### Usage in Sentences

In this sentence, there is some <black-text>sensitive information</black-text> obscured, and users need to <black-text color="#ff0000">interact</black-text> to see it.

## HTML Code

```html
<!-- Basic usage -->
<p>This is <black-text>test</black-text> text</p>

<!-- Custom colors -->
<p>This is <black-text color="#ff0000">red curtain</black-text> text effect</p>

<!-- Usage in sentences -->
<p>In this sentence, there is some <black-text>sensitive information</black-text> obscured</p>
```

## Interaction Methods

- **Desktop**: Hover to reveal content
- **Mobile**: Tap to reveal content

## Features

- Only obscures the specified text content area
- Supports custom curtain color
