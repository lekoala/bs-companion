import whenParsed from "./utils/whenParsed.js";

/**
 * Initialize custom speed for indeterminate progress
 */
class BsProgress extends HTMLElement {
  connectedCallback() {
    whenParsed(this);
  }

  parsedCallback() {
    /**
     * @type {HTMLElement}
     */
    //@ts-ignore
    const el = this.firstElementChild;
    if (el.classList.contains("progress-ratio")) {
      BsProgress.setRatio(el);
    }
  }

  /**
   * @param {HTMLElement} el
   */
  static setRatio(el) {
    let ratio = el.offsetWidth / 300;
    if (ratio > 8) ratio = ratio / 3;
    if (ratio > 4) ratio = ratio / 2;
    if (ratio < 0.5) ratio = 0.5;
    el.style.setProperty("--indeterminate-speed", ratio.toFixed(2));
  }
}

export default BsProgress;
