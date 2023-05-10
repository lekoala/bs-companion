/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element
 * @param {Object} props Optional properties
 * @returns {HTMLElementTagNameMap[K]}
 */
export default function ce(tagName, props = {}) {
  const el = document.createElement(tagName);
  for (const [k, v] of Object.entries(props)) {
    el[k] = v;
  }
  //@ts-ignore
  return el;
}
