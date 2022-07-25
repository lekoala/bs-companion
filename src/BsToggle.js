"use strict";

import normalizeData from "./utils/normalizeData.js";

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target;

    const tooltip = bootstrap.Tooltip.getInstance(el) || new bootstrap.Tooltip(el);
    const prop = normalizeData(getComputedStyle(el).getPropertyValue("--tooltip-enable").trim());
    if (prop) {
      tooltip.enable();
    } else {
      tooltip.disable();
    }
  }
});

/**
 * Self initializing tooltip and popover
 */
class BsToggle extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    let options = { ...this.dataset };
    // The js api expects properly typed data
    for (var key in options) {
      options[key] = normalizeData(options[key]);
    }
    const cls = options.toggle ? options.toggle[0].toUpperCase() + options.toggle.substring(1) : "Tooltip";
    const el = this.firstElementChild;
    if (!el.hasAttribute("title") && !options.title) {
      options.title = el.textContent.trim();
    }
    this.toggle = new bootstrap[cls](el, options);
    if (this.hasAttribute("mobile")) {
      resizeObserver.observe(el);
    }
  }
}

export default BsToggle;
