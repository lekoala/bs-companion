import toaster from "./toaster.js";

/**
 * @typedef BaseToastsOptions
 * @property {string} [baseClassName]
 * @typedef {import("./toaster.js").ToasterOptions & BaseToastsOptions} ToastsOptions
 */

/**
 * @type {ToastsOptions}
 */
const defaultOptions = {
  baseClassName: "text-white",
};

/**
 * Manage toast message using common styling and default options
 */
class Toasts {
  static getOption(k) {
    return defaultOptions[k] ?? null;
  }

  static setOption(k, v) {
    defaultOptions[k] = v;
  }

  /**
   * @link https://getbootstrap.com/docs/5.3/utilities/background/#background-gradient
   */
  static enableGradient() {
    defaultOptions.baseClassName = "bg-gradient text-white";
  }

  static enableSoft() {
    defaultOptions.baseClassName = "text-dark bg-opacity-10";
  }

  static enableDefault() {
    defaultOptions.baseClassName = "text-white";
  }

  /**
   * @param {string} msg
   * @param {import("./toaster.js").ToasterOptions} opts
   */
  static toast(msg, opts = {}) {
    opts = Object.assign({}, defaultOptions, opts);
    opts.body = msg;
    opts.className = opts.className + " " + defaultOptions.baseClassName;
    toaster(opts);
  }

  /**
   * @param {string} msg
   * @param {import("./toaster.js").ToasterOptions} opts
   */
  static success(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-success",
      },
      ...opts,
    });
  }

  /**
   * @param {string} msg
   * @param {import("./toaster.js").ToasterOptions} opts
   */
  static error(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-danger",
      },
      ...opts,
    });
  }

  /**
   * @param {string} msg
   * @param {import("./toaster.js").ToasterOptions} opts
   */
  static warning(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-warning",
      },
      ...opts,
    });
  }

  /**
   * @param {string} msg
   * @param {import("./toaster.js").ToasterOptions} opts
   */
  static info(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-info",
      },
      ...opts,
    });
  }
}

export default Toasts;
