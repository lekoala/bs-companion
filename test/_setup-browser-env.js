import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

window["IntersectionObserver"] = class IntersectionObserver {
  constructor(cb) {
    this.map = new Map();
    this.cb = cb;
  }
  observe(el) {
    this.map.set(el);
    let entries = [];
    this.map.forEach((v, k) => {
      entries.push({
        target: k,
        isIntersecting: true,
      });
    });
    setTimeout(() => {
      this.cb(entries, this); // call immediately
    }, 0);
  }
  unobserve(el) {
    this.map.delete(el);
  }
};
