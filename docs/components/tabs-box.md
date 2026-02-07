# 标签页组件

## 组件介绍

用于创建标签页界面的自定义 Web 组件，支持多个标签页切换，适用于内容分组展示。

## 属性说明

| 属性 | 说明 |
|------|------|
| **data-tab** (必需) | 标识这是一个标签页内容（写在子元素上） |
| **label** (必需) | 标签页标题（写在子元素上） |

## 使用示例

### 用户管理界面示例

<tabs-box class="tb-tabs">
    <div data-tab label="用户信息">
        <h3>用户资料</h3>
        <p>姓名: 张三</p>
        <p>邮箱: zhangsan@example.com</p>
        <p>电话: 123456788901</p>
    </div>
    <div data-tab label="订单管理">
        <h3>最近订单</h3>
        <ul>
            <li>订单 #12345 - 已发货</li>
            <li>订单 #12346 - 处理中</li>
            <li>订单 #12347 - 已完成</li>
        </ul>
    </div>
    <div data-tab label="设置">
        <h3>账户设置</h3>
        <p>通知: <input type="checkbox" checked> 接收邮件通知</p>
    </div>
</tabs-box>

### 简单标签页示例

<tabs-box>
   <div data-tab label="Tab 1">Content 1</div>
   <div data-tab label="Tab 2">Content 2</div>
   <div data-tab label="Tab 3">Content 3</div>
   <div data-tab label="Tab 4">Content 4</div>
   <div data-tab label="Tab 5">Content 5</div>
   <div data-tab label="Tab 6">Content 6</div>
</tabs-box>

## HTML 代码

```html
<!-- 用户管理界面示例 -->
<tabs-box class="tb-tabs">
    <div data-tab label="用户信息">
        <h3>用户资料</h3>
        <p>姓名: 张三</p>
        <p>邮箱: zhangsan@example.com</p>
        <p>电话: 123456788901</p>
    </div>
    <div data-tab label="订单管理">
        <h3>最近订单</h3>
        <ul>
            <li>订单 #12345 - 已发货</li>
            <li>订单 #12346 - 处理中</li>
            <li>订单 #12347 - 已完成</li>
        </ul>
    </div>
</tabs-box>

<!-- 简单标签页示例 -->
<tabs-box>
   <div data-tab label="Tab 1">Content 1</div>
   <div data-tab label="Tab 2">Content 2</div>
   <div data-tab label="Tab 3">Content 3</div>
</tabs-box>
```

## 功能特性

- 支持多个标签页
- 点击切换标签内容
- 标签过多时自动滚动
