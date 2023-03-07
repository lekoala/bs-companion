import BsTabs from "./src/BsTabs.js";
import BsToggle from "./src/BsToggle.js";
import ResponsiveTable from "./src/ResponsiveTable.js";
import toaster from "./src/toaster.js";
import Toasts from "./src/Toasts.js";
import modalizer from "./src/modalizer.js";
import modalizerConfirm from "./src/modalizerConfirm.js";
import FormValidator from "./src/FormValidator.js";
import LazyLoader from "./src/LazyLoader.js";

// BSN Compat
// @link https://github.com/thednp/bootstrap.native
if (window.BSN && !window.bootstrap) {
  window.bootstrap = window.BSN;
}

// Register elements (you can potentially extend with your own classes or rename element)
customElements.define("bs-tabs", BsTabs);
customElements.define("bs-toggle", BsToggle);
customElements.define("responsive-table", ResponsiveTable);
customElements.define("lazy-loader", LazyLoader);

// Expose to global scope
window.toaster = toaster;
window.Toasts = Toasts;
window.modalizer = modalizer;
window.modalizerConfirm = modalizerConfirm;
window.FormValidator = FormValidator;

const BsCompanion = {
  BsTabs,
  BsToggle,
  ResponsiveTable,
  toaster,
  Toasts,
  modalizer,
  modalizerConfirm,
  FormValidator,
};
export default BsCompanion;
