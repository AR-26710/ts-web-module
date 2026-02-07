# Progress Box Component

## Component Introduction

A custom Web Component for displaying progress information, supporting custom colors and percentages.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **percentage** (required) | Progress percentage, format: "XX%" |
| **color** (optional) | Progress bar color, supports hexadecimal color values |

## Usage Examples

### Progress Bars with Different Colors and Progress

<progress-box percentage="99%" color="#6ce766"></progress-box>
<progress-box percentage="50%" color="#E4080A"></progress-box>

## HTML Code

```html
<!-- Green progress bar, 99% progress -->
<progress-box percentage="99%" color="#6ce766"></progress-box>

<!-- Red progress bar, 50% progress -->
<progress-box percentage="50%" color="#E4080A"></progress-box>
```

## Features

- Intuitive progress display
- Supports custom colors
- Clean bar design
- Responsive width
