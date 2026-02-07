# Resource Link Component

## Component Introduction

A custom Web Component for displaying resource links, supporting dual-text display on left and right sides, suitable for file downloads, contact information, and other scenarios.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **left-text** (required) | Left-side main text |
| **right-text** (optional) | Right-side auxiliary text, such as file format |
| **href** (required) | Link address |
| **target** (optional) | Link opening method, such as "_blank" for new window |

## Usage Examples

### Resource Link with File Format

<resource-link left-text="Document" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
<resource-link left-text="Video" right-text="MP4" href="/video.mp4"></resource-link>

### Regular Link

<resource-link left-text="Contact Us" href="mailto:contact@example.com"></resource-link>

## HTML Code

```html
<!-- Resource link with file format -->
<resource-link left-text="Document" right-text="PDF" href="/file.pdf" target="_blank"></resource-link>
<resource-link left-text="Video" right-text="MP4" href="/video.mp4"></resource-link>

<!-- Regular link -->
<resource-link left-text="Contact Us" href="mailto:contact@example.com"></resource-link>
```

## Features

- Dual-color text display, left side for main content, right side for auxiliary information
- Supports various link types (HTTP, HTTPS, email, etc.)
- Modern card-style design
- Hover effects enhance user experience
