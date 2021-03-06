"use strict";

/**
 * @link https://getbootstrap.com/docs/5.2/forms/validation/
 */
class FormValidator {
  /**
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    if (!form.hasAttribute("novalidate")) {
      form.setAttribute("novalidate", "");
    }
    form.addEventListener(
      "submit",
      (event) => {
        // Remove errors in tabs and accordion
        form.querySelectorAll(".nav-tabs .nav-link.is-invalid").forEach((link) => {
          link.classList.remove("is-invalid");
        });
        form.querySelectorAll(".accordion-item.is-invalid").forEach((accordionItem) => {
          accordionItem.classList.remove("is-invalid");
        });

        // Show all invalid fields
        Array.from(form.elements).forEach((el) => {
          if (!el.checkValidity()) {
            // Mark all tabs and accordions as invalid as well
            let parent = el.parentElement;
            let accordion = null;
            while (parent && !parent.classList.contains("tab-pane")) {
              if (parent.classList.contains("accordion-item")) {
                accordion = parent;
              }
              parent = parent.parentElement;
            }
            if (parent && !parent.classList.contains("active")) {
              const link = form.querySelector("[data-bs-target='#" + parent.getAttribute("id") + "']");
              if (link) {
                link.classList.add("is-invalid");
              }
            }
            if (accordion) {
              accordion.classList.add("is-invalid");
            }
          }
        });

        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          // Show message
          if (form.dataset.validationMessage) {
            window.toaster({
              body: form.dataset.validationMessage,
              className: "border-0 bg-danger text-white",
            });
          }
        }

        form.classList.add("was-validated");
      },
      false
    );
  }
  static init(selector = ".needs-validation") {
    document.querySelectorAll(selector).forEach((form) => {
      new FormValidator(form);
    });
  }
}

export default FormValidator;
