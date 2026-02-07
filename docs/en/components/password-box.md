# Password Box Component

## Component Introduction

The Password Box is a component that can hide content. Users need to enter the correct password to view the hidden content. It supports custom titles and hint text, providing a good user experience.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **pw** (required) | Set the verification password |
| **title** (optional) | Custom title text (default: "Please enter password to view content") |
| **tip** (optional) | Custom hint text (default: empty) |
| **placeholder** (optional) | Custom password input placeholder text (default: "Please enter password") |
| **error** (optional) | Custom error message text (default: "Incorrect password, please try again") |

## Usage Examples

### Basic Usage

<password-box pw="12345">
  <p>This is hidden content that requires a password to view</p>
</password-box>

### Custom Title and Hint

<password-box pw="secret" title="Please enter access code" tip="Hint: The access code is secret">
  <h2>This is an example with custom title and hint</h2>
</password-box>

### Custom Placeholder Text

<password-box pw="12345" placeholder="Please enter your access password">
  <p>This is an example with custom placeholder text</p>
</password-box>

### Custom Error Message

<password-box pw="12345" error="Access code incorrect, please re-enter">
  <p>This is an example with custom error message</p>
</password-box>

## HTML Code

```html
<!-- Basic usage -->
<password-box pw="12345">
  <p>This is hidden content that requires a password to view</p>
</password-box>

<!-- Custom title and hint -->
<password-box pw="secret" title="Please enter access code" tip="Hint: The access code is secret">
  <p>This is an example with custom title and hint</p>
</password-box>

<!-- Custom placeholder text -->
<password-box pw="12345" placeholder="Please enter your access password">
  <p>This is an example with custom placeholder text</p>
</password-box>

<!-- Custom error message -->
<password-box pw="12345" error="Access code incorrect, please re-enter">
  <p>This is an example with custom error message</p>
</password-box>
```

## Notes

- This component is only for entertainment or non-sensitive content protection, not for high-security scenarios
- The password is stored in plain text in the HTML attribute and is not secure
- Has good visual effects and interactive experience
- Added loading state feedback to enhance user experience
