"use strict";

import "./modalizer.js";

/**
 * A shorthand function to create a confirm dialog
 * @param {object} attr
 * @param {function(ev)} onResolve
 * @param {function(ev)} onReject
 * @returns {bootstrap.Modal}
 */
export default function modalizerConfirm(attr = {}, onResolve = null, onReject = null) {
  if (typeof attr === "string") {
    attr = {
      body: attr,
    };
  }
  attr = Object.assign(
    {
      static: true,
      showClose: false,
      showCancel: true,
      showConfirm: true,
    },
    attr
  );
  const modal = modalizer(attr);
  // Bootstrap 5 use _element and BSN use element
  const element = modal.element || modal._element;
  if (onResolve) {
    element.addEventListener("modal.confirm", (ev) => onResolve(ev), {
      once: true,
    });
  }
  if (onReject) {
    element.addEventListener("modal.cancel", (ev) => onReject(ev), {
      once: true,
    });
  }
  return modal;
}
