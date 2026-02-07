# Text Box Component

## Component Introduction

A custom Web Component for displaying different types of information, supporting normal, warning, error, success, and other styles.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **type** (required) | Information type, optional values: normal, warning, error, success |

## Usage Examples

### Different Types of Message Boxes

<text-box type="normal">This is a normal message</text-box>
<text-box type="warning">This is a warning message</text-box>
<text-box type="error">This is an error message</text-box>
<text-box type="success">This is a success message</text-box>

## HTML Code

```html
<!-- Normal message -->
<text-box type="normal">This is a normal message</text-box>

<!-- Warning message -->
<text-box type="warning">This is a warning message</text-box>

<!-- Error message -->
<text-box type="error">This is an error message</text-box>

<!-- Success message -->
<text-box type="success">This is a success message</text-box>
```

## Features

- Different information types use different colors and icons
- Responsive design, adapts to container width
- Clean and beautiful borders and background colors
