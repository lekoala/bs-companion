/**
 * @typedef ParsedCallback
 * @property {Function} parsedCallback
 *
 * @typedef {HTMLElement & ParsedCallback} ParsedHTMLElement
 */
/**
 * Call parsedCallback on a node when it is parsed
 *
 * This replaces the need for domReady since a node cannot be parsed if dom is not interactive
 *
 * @link https://github.com/WebReflection/hyperHTML-Element/blob/418299139c31652502aa843e0c5e7718b597d860/esm/index.js#L401-L407
 * @link https://stackoverflow.com/questions/58354531/custom-elements-connectedcallback-wait-for-parent-node-to-be-available-bef
 * @link https://github.com/WebReflection/html-parsed-element
 * @param {ParsedHTMLElement} el
 * @returns {void}
 */
export default function whenParsed(el) {
  /**
   * @type {Node}
   */
  let ref = el;
  // We could also simply check for el.firstChildElement but that only works if our node has children
  do {
    if (ref.nextSibling) {
      el.parsedCallback();
      return;
    }
    ref = ref.parentNode;
  } while (ref);
  setTimeout(() => {
    whenParsed(el);
  });
}
