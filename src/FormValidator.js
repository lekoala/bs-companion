const INVALID_CLASS = "is-invalid";
const NOVALIDATE = "novalidate";

/**
 * Validation using Constraint validation API
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation
 * @link https://getbootstrap.com/docs/5.3/forms/validation/
 */
class FormValidator {
  /**
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    // Make sure we don't use native validation
    if (!form.hasAttribute(NOVALIDATE)) {
      form.setAttribute(NOVALIDATE, "");
    }
    form.addEventListener(
      "submit",
      (event) => {
        // Remove errors in tabs and accordion
        form.querySelectorAll(".nav-tabs .nav-link." + INVALID_CLASS).forEach((link) => {
          link.classList.remove(INVALID_CLASS);
        });
        form.querySelectorAll(".accordion-item." + INVALID_CLASS).forEach((accordionItem) => {
          accordionItem.classList.remove(INVALID_CLASS);
        });

        /**
         * @type {HTMLInputElement}
         */
        let firstInvalid = null;

        // Show all invalid fields
        Array.from(form.elements).forEach(
          /**
           * @param {HTMLInputElement} el
           */
          (el) => {
            if (el.checkValidity()) {
              return;
            }

            if (!firstInvalid) {
              firstInvalid = el;
            }

            // Mark all tabs and accordions as invalid as well
            let tabPane = el.parentElement;
            let accordion = null;
            while (tabPane && !tabPane.classList.contains("tab-pane")) {
              if (tabPane.classList.contains("accordion-item")) {
                accordion = tabPane;
              }
              tabPane = tabPane.parentElement;
            }
            // This depends on specific styles, see _form-validation.scss
            if (tabPane && !tabPane.classList.contains("active")) {
              // Find matching tab link
              const link = form.querySelector("[data-bs-target='#" + tabPane.getAttribute("id") + "']");
              if (link) {
                link.classList.add(INVALID_CLASS);
              }
            }
            if (accordion) {
              accordion.classList.add(INVALID_CLASS);
            }
          }
        );

        // If the form is invalid
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          // Show message as toast
          //@ts-ignore
          if (form.dataset.validationMessage && typeof window.Toasts !== "undefined") {
            //@ts-ignore
            window.Toasts.error(form.dataset.validationMessage);
          }

          // Focus element
          if (firstInvalid) {
            firstInvalid.focus();
          }
        }

        form.classList.add("was-validated");
      },
      false
    );
  }

  /**
   * @param {string} selector
   */
  static init(selector = ".needs-validation") {
    document.querySelectorAll(selector).forEach(
      /**
       * @param {HTMLFormElement} form
       */
      (form) => {
        new FormValidator(form);
      }
    );
  }
}

export default FormValidator;
