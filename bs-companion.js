import BsTabs from "./src/BsTabs.js";
import ResponsiveTable from "./src/ResponsiveTable.js";
import toaster from "./src/utils/toaster.js";
import modalizer, { modalizerConfirm } from "./src/utils/modalizer.js";
import FormValidator from "./src/utils/form-validator.js";

// Expose to global scope
window.toaster = toaster;
window.modalizer = modalizer;
window.modalizerConfirm = modalizerConfirm;
window.FormValidator = FormValidator;
