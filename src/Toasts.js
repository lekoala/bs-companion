import toaster from "./toaster.js";

let soft = false;
let gradient = false;

function styles() {
  if (gradient) {
    return "bg-gradient text-white";
  }
  return soft ? "text-dark bg-opacity-10" : "text-white";
}

class Toasts {
  static get gradient() {
    return gradient;
  }

  static set gradient(v) {
    gradient = !!v;
  }

  static get soft() {
    return soft;
  }

  static set soft(v) {
    soft = !!v;
  }

  static toast(msg, opts = {}) {
    opts.body = msg;
    toaster(opts);
  }

  static success(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-success " + styles(),
      },
      ...opts,
    });
  }

  static error(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-danger " + styles(),
      },
      ...opts,
    });
  }

  static warning(msg, opts = {}) {
    this.toast(msg, {
      ...{
        className: "bg-warning " + styles(),
      },
      ...opts,
    });
  }
}

export default Toasts;
