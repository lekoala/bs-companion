const INVALID_CLASS = "is-invalid";
const NOVALIDATE = "novalidate";
const WAS_VALIDATED_CLASS = "was-validated";
const NEEDS_VALIDATION_CLASS = "needs-validation";

// extend built in rules: required, minlength & maxlength, min and max, type, pattern
const rules = {
  same: (v, el, selector) => {
    const target = document.querySelector(selector);
    return v == target.value;
  },
  number: (v) => {
    return v.length === 0 || isNaN(+v);
  },
  digits: (v) => {
    return v.length === 0 || /^\d+$/.test(v);
  },
  alnum: (v) => {
    return v.length === 0 || /^[a-z0-9]+$/i.test(v);
  },
};
/**
 * @param {HTMLInputElement} field
 * @returns {Boolean}
 */
function ignoreField(field) {
  return field.disabled || ["file", "reset", "submit", "button"].includes(field.type);
}

/**
 * @param {Boolean} v
 * @returns {string}
 */
function addRemove(v) {
  return v ? "remove" : "add";
}

/**
 *
 * @param {HTMLInputElement} el
 * @param {string} n
 * @param {Array} opts
 * @returns {Boolean}
 */
function checkRule(el, n, opts = []) {
  const h = rules[n];
  if (!h) {
    throw `Invalid rule ${n}`;
  }
  return h(el.value, el, ...opts);
}

/**
 *
 * @param {HTMLInputElement} el
 * @returns {Boolean}
 */
function checkRules(el) {
  el.dataset.validationErrors = "";
  el.setCustomValidity(""); // we need to reset this otherwise checkValidity will always return false

  let result = el.checkValidity();

  const rules = el.dataset.validationRules;
  if (rules) {
    const arr = rules.split(",");
    let failed = [];
    arr.forEach((rule) => {
      const [rName, ...rOpts] = rule.split(" ");
      const ruleResult = checkRule(el, rName, rOpts);
      if (!ruleResult) {
        failed.push(rName);
      }
    });
    if (failed.length > 0) {
      // mark as failed
      result = false;
      // this will set el.validity.customError to true
      el.setCustomValidity("err");
      // since we cannot read validation errors, expose them as data attribute
      el.dataset.validationErrors = failed.join(",");
    }
  }
  return result;
}

/**
 *
 * @param {HTMLInputElement} el
 * @param {string} trigger
 */
function validateField(el, trigger) {
  const form = el.form;
  if (!form) {
    return;
  }
  const validationTrigger = el.dataset.validationTrigger || "";
  const validate = (validationTrigger.includes(trigger) && el.value.length > 0) || el.classList.contains(INVALID_CLASS) || el.dataset.validationErrors;
  if (form.classList.contains(NEEDS_VALIDATION_CLASS) && validate && !ignoreField(el)) {
    const result = checkRules(el);
    // Manually add/remove invalid class for this specific element
    // We don't rely on form was validated class since it would show all messages
    el.classList[addRemove(result)](INVALID_CLASS);
  }
}

document.addEventListener("focusout", (event) => {
  //@ts-ignore
  validateField(event.target, "blur");
});

// Triggers validation if it has a invalid class or a keydown trigger
document.addEventListener("keydown", (event) => {
  //@ts-ignore
  validateField(event.target, "keydown");
});

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

    // Track validation alert
    const serverAlert = form.querySelector(".alert.validation");
    if (serverAlert && !form.classList.contains("no-scroll")) {
      serverAlert.scrollIntoView();
    }

    // Handle submit
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

        // Show all invalid fields
        Array.from(form.elements).forEach(
          /**
           * @param {HTMLInputElement} el
           */
          (el) => {
            if (ignoreField(el)) {
              return;
            }
            const isValid = checkRules(el);
            if (isValid) {
              el.classList.remove(INVALID_CLASS);
              return;
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

          // Focus first visible invalid element
          const activeTab = form.querySelector(".tab-pane.active") || form;
          const firstInvalid = activeTab.querySelector(":invalid");
          if (firstInvalid) {
            //@ts-ignore
            firstInvalid.focus();
          }
        }

        form.classList.add(WAS_VALIDATED_CLASS);
      },
      false
    );
  }

  /**
   * @param {string} n
   * @param {Function} callback
   */
  static registerRule(n, callback) {
    rules[n] = callback;
  }

  /**
   * @param {string} selector
   */
  static init(selector = `.${NEEDS_VALIDATION_CLASS}`) {
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
