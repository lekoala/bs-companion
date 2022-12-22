/**
 * @param {*} list
 * @returns {Array}
 */
function sortByPriority(list) {
  return Array.from(list).sort(function (a, b) {
    a = a.dataset.priority || 0;
    b = b.dataset.priority || -1; // Order by last col
    return b - a;
  });
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    /**
     * @type {ResponsiveTable}
     */
    //@ts-ignore
    const container = entry.target;
    const table = container.table;
    // check inlineSize (width) and not blockSize (height)
    const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
    const size = parseInt(contentBoxSize.inlineSize);
    const diff = table.offsetWidth - size;
    let remaining = diff;

    // The table is too big
    if (table.offsetWidth > size) {
      // Find columns with priority
      let cols = container.cols.filter((col) => {
        return !col.hasAttribute("hidden") && col.hasAttribute("data-priority");
      });
      // Or by position
      if (cols.length === 0) {
        cols = container.cols.filter((col) => {
          return !col.hasAttribute("hidden");
        });
        // Always keep one column
        if (cols.length === 1) {
          return;
        }
      }
      cols.forEach((col) => {
        if (remaining < 0) {
          return;
        }

        const colWidth = col.offsetWidth;
        const colIdx = col.ariaColIndex;

        container.toggleColumn(colIdx, false);
        container.toggleAltContent(colIdx, true);

        remaining -= colWidth;
      });
    } else {
      const minWidth = 50;
      const visibleWidth =
        container.cols
          .filter((col) => {
            return !col.hasAttribute("hidden");
          })
          .reduce((result, col) => {
            return result + parseInt(col.dataset.baseWidth);
          }, 0) + minWidth; // Add an offset so that inserting column is smoother

      // Do we have any hidden column that we can restore ?
      container.cols
        .filter((col) => {
          return col.hasAttribute("hidden");
        })
        .forEach((col) => {
          const colWidth = parseInt(col.dataset.baseWidth);
          const colIdx = col.ariaColIndex;

          // We need to have enough space to restore it
          if (size < colWidth + visibleWidth) {
            return;
          }

          container.toggleColumn(colIdx, true);
          container.toggleAltContent(colIdx, false);

          remaining += colWidth;
        });
    }
  }
});

/**
 * Automatically hide col as needed
 */
class ResponsiveTable extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    this.style.display = "block"; // Otherwise resize doesn't happen
    this.style.overflowX = "hidden"; // Prevent scrollbars from appearing

    this.altSelector = this.getAttribute("alt-selector") || ".responsive-table-alt";
  }

  init() {
    this.table = this.querySelector("table");
    this.holder = this.querySelector("thead") || this.querySelector("tr");
    this.assignColIndex();
    this.cols = this.holder.querySelectorAll("th");
    this.cols = sortByPriority(this.cols);

    // Hide alt content
    this.toggleAltContent(null, false);
  }

  connectedCallback() {
    this.init();
    resizeObserver.observe(this);
  }

  disconnectedCallback() {
    resizeObserver.unobserve(this);
  }

  toggleColumn(idx, show) {
    const targetCols = this.table.querySelectorAll("[aria-colindex='" + idx + "']");
    targetCols.forEach((targetCol) => {
      if (show) {
        targetCol.removeAttribute("hidden");
      } else {
        targetCol.setAttribute("hidden", "");
      }
    });
  }

  toggleAltContent(idx, show) {
    const sel = idx ? this.altSelector + "[data-index='" + idx + "']" : this.altSelector;
    const altNodes = this.table.querySelectorAll(sel);
    altNodes.forEach((node) => {
      if (show) {
        node.removeAttribute("hidden");
      } else {
        node.setAttribute("hidden", "");
      }
    });
  }

  /**
   * Ensure we have an index (starts at 1)
   */
  assignColIndex() {
    this.table.dataset.baseWidth = "" + this.table.offsetWidth;
    this.querySelectorAll("tr").forEach((row) => {
      let idx = 0;

      row.querySelectorAll("th,td").forEach(
        /**
         * @param {HTMLTableColElement} col
         */
        (col) => {
          idx += col.hasAttribute("colspan") ? parseInt(col.getAttribute("colspan")) : 1;
          if (!col.ariaColIndex) {
            col.ariaColIndex = "" + idx;
          }
          col.dataset.baseWidth = "" + col.offsetWidth;
        }
      );
    });
  }
}

export default ResponsiveTable;
