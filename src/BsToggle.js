"use strict";

import normalizeData from "./utils/normalizeData";

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
    this.toggle = new bootstrap[cls](this.firstElementChild, options);
  }
}

export default BsToggle;
