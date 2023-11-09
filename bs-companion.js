import BsTabs from "./src/BsTabs.js";
import BsToggle from "./src/BsToggle.js";
import ResponsiveTable from "./src/ResponsiveTable.js";
import toaster from "./src/toaster.js";
import Toasts from "./src/Toasts.js";
import modalizer from "./src/modalizer.js";
import modalizerConfirm from "./src/modalizerConfirm.js";
import FormValidator from "./src/FormValidator.js";
import LazyLoader from "./src/LazyLoader.js";
import BsProgress from "./src/BsProgress.js";

// BSN Compat
// @link https://github.com/thednp/bootstrap.native
if (window.BSN && !window.bootstrap) {
  window.bootstrap = window.BSN;
}

const def = (n, c) => {
  if (!customElements.get(n)) {
    customElements.define(n, c);
  }
};

// Register elements (you can potentially extend with your own classes or rename element)
def("bs-tabs", BsTabs);
def("bs-toggle", BsToggle);
def("responsive-table", ResponsiveTable);
def("lazy-loader", LazyLoader);
def("bs-progress", BsProgress);

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
