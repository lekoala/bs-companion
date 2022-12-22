import modalizer from "./modalizer.js";

/**
 * @callback modalCallback
 * @param {Event} event
 */

/**
 * A shorthand function to create a confirm dialog
 * @param {object} attr
 * @param {modalCallback} onResolve
 * @param {modalCallback} onReject
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
  const once = {
    once: true,
  };
  const modal = modalizer(attr);
  // Bootstrap 5 use _element and BSN use element
  //@ts-ignore
  const element = modal.element || modal._element;
  if (onResolve) {
    element.addEventListener("modal.confirm", (ev) => onResolve(ev), once);
  }
  if (onReject) {
    element.addEventListener("modal.cancel", (ev) => onReject(ev), once);
  }
  return modal;
}
