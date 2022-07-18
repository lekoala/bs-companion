import BsTabs from "./src/BsTabs.js";
import BsToggle from "./src/BsToggle.js";
import ResponsiveTable from "./src/ResponsiveTable.js";
import toaster from "./src/toaster.js";
import modalizer from "./src/modalizer.js";
import modalizerConfirm from "./src/modalizerConfirm.js";
import FormValidator from "./src/FormValidator.js";

// Register elements (you can potentially extend with your own classes)
customElements.define("bs-tabs", BsTabs);
customElements.define("bs-toggle", BsToggle);
customElements.define("responsive-table", ResponsiveTable);

// Expose to global scope
window.toaster = toaster;
window.modalizer = modalizer;
window.modalizerConfirm = modalizerConfirm;
window.FormValidator = FormValidator;
