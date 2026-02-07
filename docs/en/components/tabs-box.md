# Tabs Box Component

## Component Introduction

A custom Web Component for creating tabbed interfaces, supporting multiple tab switching, suitable for grouped content display.

## Attributes

| Attribute | Description |
|-----------|-------------|
| **data-tab** (required) | Identifies this as tab content (on child element) |
| **label** (required) | Tab title (on child element) |

## Usage Examples

### User Management Interface Example

<tabs-box class="tb-tabs">
    <div data-tab label="User Info">
        <h3>User Profile</h3>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
        <p>Phone: 12345678901</p>
    </div>
    <div data-tab label="Order Management">
        <h3>Recent Orders</h3>
        <ul>
            <li>Order #12345 - Shipped</li>
            <li>Order #12346 - Processing</li>
            <li>Order #12347 - Completed</li>
        </ul>
    </div>
    <div data-tab label="Settings">
        <h3>Account Settings</h3>
        <p>Notifications: <input type="checkbox" checked> Receive email notifications</p>
    </div>
</tabs-box>

### Simple Tabs Example

<tabs-box>
   <div data-tab label="Tab 1">Content 1</div>
   <div data-tab label="Tab 2">Content 2</div>
   <div data-tab label="Tab 3">Content 3</div>
   <div data-tab label="Tab 4">Content 4</div>
   <div data-tab label="Tab 5">Content 5</div>
   <div data-tab label="Tab 6">Content 6</div>
</tabs-box>

## HTML Code

```html
<!-- User management interface example -->
<tabs-box class="tb-tabs">
    <div data-tab label="User Info">
        <h3>User Profile</h3>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
    </div>
    <div data-tab label="Order Management">
        <h3>Recent Orders</h3>
        <ul>
            <li>Order #12345 - Shipped</li>
            <li>Order #12346 - Processing</li>
        </ul>
    </div>
</tabs-box>

<!-- Simple tabs example -->
<tabs-box>
   <div data-tab label="Tab 1">Content 1</div>
   <div data-tab label="Tab 2">Content 2</div>
   <div data-tab label="Tab 3">Content 3</div>
</tabs-box>
```

## Features

- Supports multiple tabs
- Click to switch tab content
- Auto-scroll when too many tabs
