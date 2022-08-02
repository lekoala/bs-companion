"use strict";

/**
 * @param {string} text
 * @param {string} size
 * @returns {Number}
 */
export default function calcTextWidth(text, size = null) {
  const span = document.createElement("span");
  document.body.appendChild(span);
  span.style.fontSize = size || "inherit";
  span.style.height = "auto";
  span.style.width = "auto";
  span.style.position = "absolute";
  span.style.whiteSpace = "no-wrap";
  span.innerHTML = text;

  const width = Math.ceil(span.clientWidth);

  document.body.removeChild(span);
  return width;
}
