# bs-companion

[![NPM](https://nodei.co/npm/bs-companion.png?mini=true)](https://nodei.co/npm/bs-companion/)
[![Downloads](https://img.shields.io/npm/dt/bs-companion.svg)](https://www.npmjs.com/package/bs-companion)

> Components with super powers for your Bootstrap apps!

This packages includes:

- Responsive Table: Nice responsive tables without ugly scrollbars
- BS Tabs: Improved tabs, that collapse down to a dropdown and with linkable tabs
- Toaster: Generate beautiful toast message without markup
- Toasts: Easily generate basic ui toasts (success, warning, error) and enforce default styling
- Modalizer: Generate beautiful modals without markup
- Form Validator: Consistent validator that works across tabs and accordions

## Tabs

Simply wrap your regular tabs in a `bs-tabs` component

```html
<bs-tabs responsive>
  <ul class="nav nav-tabs" id="myTab" role="tablist" style="width: 100%">
    <li class="nav-item" role="presentation">...</li>
    <li class="nav-item" role="presentation">...</li>
    <li class="nav-item" role="presentation">...</li>
  </ul>
</bs-tabs>
```

Supported features (add attributes)

- Linkable: clicking on the tab will update the hash
- Responsive: when there is not enough space to fit everything on one line, it will collapse to a dropdown

It can also lazy load content in the tabs. It will trigger a `lazyload` on any `lazy-loadable` element

## Modals

Basic usage using the `modalizer` function

```js
modalizer({
  body: "Hello!",
  title: "This is a modal",
  icon: btn.dataset.icon,
});
```

For confirm modals, you can use

```js
modalizerConfirm(
  {
    body: btn.dataset.confirm,
    icon: "question",
  },
  (res) => {
    // form elements are exposed as FormData inside detail
    let name = res.detail.get("your_name");

    console.log("accepted", res);
  },
  (res) => {
    console.log("denied", res);
  }
);
```

## Toasts

Basic usage using the `toaster` function

```js
// You can simply pass a string
toaster("Hello world");
// Or an array
toaster({
  body: "Hello world <a href='#'>some link here</a>",
  header: `<div class="d-flex align-items-center"><l-i name="star" class="me-2"></l-i> My header</div>`,
  autohide: false,
});
```

However, it can be bothersome to always specify all options. Enters the `Toasts` class

```js
Toasts.success("Hello world");
```

## Form validation

You can easily validate all your forms using `FormValidator`

```html
<script type="module">
    FormValidator.init();
</script>
<form action="" class="needs-validation" data-validation-message="Some fields are not valid">...</form>
```

Simply set a `needs-validation` class. You can also set a message that will be shown in case some fields are invalid.
It will also checks in tabs and accordion and show invalid icons.

## Also check out

- [Bootstrap 5 Tags](https://github.com/lekoala/bootstrap5-tags): tags input for bootstrap
- [Bootstrap5 autocomplete](https://github.com/lekoala/bootstrap5-autocomplete): the autocomplete input for bootstrap 5 (and more!)
- [Admini](https://github.com/lekoala/admini): the minimalistic bootstrap 5 admin panel
