"use strict";

/**
 * Parse data attribute and return properly typed data
 * @param {string} val
 * @returns {mixed}
 */
export default function normalizeData(val) {
  // Bool
  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  // Null or empty
  if (val === "" || val === "null") {
    return null;
  }
  // Numeric attributes
  if (val === Number(val).toString()) {
    return Number(val);
  }
  // Only attempt json parsing for array or objects
  if (val.indexOf("[") === 0 || val.indexOf("{") === 0) {
    try {
      // In case we have only single quoted values
      if (val.indexOf('"') === -1) {
        val = val.replaceAll("'", '"');
      }
      return JSON.parse(decodeURIComponent(val));
    } catch {
      console.log("Failed to parse " + val);
      return {};
    }
  }
  return val;
}
