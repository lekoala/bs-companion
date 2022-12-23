/**
 * @typedef ToasterOptions
 * @property {string} [body] Body content. Can also be filled with html tags (eg: Hello <b>World</b>)
 * @property {string} [header] (none) Header content. Can also be filled with html tags (eg : <h6 class="mb-0">Success</h6>)
 * @property {string} [className] (none) Additional classes for toast element (eg: 'border-0 bg-danger text-white')
 * @property {boolean} [animation] (true) Apply transition to the toast
 * @property {boolean} [autohide] (true) Auto hide the toast
 * @property {number} [delay] (5000) Delay hiding the toast (ms)
 * @property {string} [id] (toast-{ts}) Specific id if required
 * @property {string} [gap] (1rem) Gap size
 * @property {string} [placement] (top-right) Corner position of toast. Available values: top-right, top-center, top-left, bottom-right, bottom-center, bottom-left
 * @property {boolean} [btnClose] (true) Show close button
 * @property {string} [buttonLabel] (Close Notification) Close button label
 * @property {string} [buttonClassName] (none) Additional classes for close button
 */

let counter = 0;

/**
 * Create a toast object
 *
 * Stacking demo
 * @link https://codepen.io/lekoalabe/pen/poKMprj
 *
 * @param {ToasterOptions} attr
 * @returns {bootstrap.Toast}
 */
export default function toaster(attr) {
  // Shortcut
  if (typeof attr === "string") {
    attr = {
      body: attr,
    };
  }

  /**
   * @type {ToasterOptions}
   */
  const defaults = {
    gap: "1rem", // this is 1.5rem in bs 5.2 and .75rem in 5.0/5.1
    className: "",
    placement: "top-center",
    btnClose: true,
    buttonLabel: "Close Notification",
    buttonClassName: "",
    animation: true,
    autohide: true,
    delay: 5000,
  };
  attr = Object.assign({}, defaults, attr);

  const once = {
    once: true,
  };
  const ucfirst = (string) => {
    return string[0].toUpperCase() + string.substring(1);
  };

  // Container placement
  // Split placement string into positional css elements
  // posV: top or bottom
  // posH: left, center or right
  const [posV, posH] = attr.placement.split("-");
  // In the middle means 50%
  const posUnit = posH == "center" ? "50%" : "0";
  const animateFrom = "margin" + ucfirst(posV);
  const positionFrom = "margin" + ucfirst(posV == "top" ? "bottom" : "top");
  // We set posUnit to 50%, then position from left
  const startPos = posH == "center" ? "left" : posH;

  // Auto white close
  if (attr.className.includes("text-white") && !attr.buttonClassName) {
    attr.buttonClassName = "btn-close-white";
  }

  // Create toast element
  const btnClose = document.createElement("button");
  btnClose.className = `btn-close flex-shrink-0 ${attr.buttonClassName}`;
  btnClose.ariaLabel = attr.buttonLabel;
  btnClose.setAttribute("data-bs-dismiss", "toast");

  const toastBody = document.createElement("div");
  toastBody.className = `toast-body`;
  toastBody.innerHTML = `<div class="d-flex w-100"><div class="flex-grow-1">${attr.body}</div></div></div>`;
  if (!attr.header) {
    toastBody.firstChild.appendChild(btnClose);
  }

  const toast = document.createElement("div");
  toast.id = attr.id || `toast-${++counter}`;
  toast.className = `toast toaster border-0 bg-white`;
  toast.role = "alert";
  toast.ariaLive = "assertive";
  toast.ariaAtomic = "true";
  toast.style[positionFrom] = attr.gap;
  if (attr.animation) {
    toast.style[animateFrom] = "-48px";
  }

  // Wrap in a bg div (for opacity support)
  const toastWrapper = document.createElement("div");
  toastWrapper.className = `${attr.className}`;
  toastWrapper.style.borderRadius = `var(--bs-toast-border-radius)`;
  toast.append(toastWrapper);

  if (attr.header) {
    const toastHeader = document.createElement("div");
    toastHeader.className = `toast-header`;
    toastHeader.innerHTML = `<div class="d-flex align-items-center justify-content-between flex-grow-1">${attr.header}</div></div>`;
    toastHeader.firstChild.appendChild(btnClose);
    toastWrapper.append(toastHeader);
  }
  toastWrapper.append(toastBody);

  // Check if we have a container in place for the given placement or create one
  /**
   * @type {HTMLElement}
   */
  let toastContainer = document.querySelector(`.toast-container.${attr.placement}`);
  if (!toastContainer) {
    const styles = `${posV}:0;${startPos}:${posUnit};${posUnit === "50%" ? "transform: translateX(-50%)" : ""};z-index:1081;position:fixed;padding:${
      attr.gap
    };`;

    toastContainer = document.createElement("div");
    toastContainer.className = `toast-container toaster-container ${attr.placement}`;
    toastContainer.style.cssText = styles;

    document.body.insertAdjacentElement("afterbegin", toastContainer);
  }

  // Append to container and init
  toastContainer.appendChild(toast);
  //@ts-ignore
  const inst = new bootstrap.Toast(toast, {
    animation: attr.animation,
    autohide: attr.autohide,
    delay: attr.delay,
  });

  toast.addEventListener(
    "show.bs.toast",
    () => {
      // Additional slide animation
      if (attr.animation) {
        setTimeout(() => {
          const transition = parseFloat(getComputedStyle(toast).transitionDuration) * 1e3;
          toast.style.transition = `all ${transition * 4}ms cubic-bezier(0.165, 0.840, 0.440, 1.000), opacity ${transition}ms linear`;
          toast.style[animateFrom] = "0px";
          toast.style.opacity = "1"; // This is required for BSN
        }, 0);
      }
    },
    once
  );
  toast.addEventListener(
    "hide.bs.toast",
    () => {
      // As soon as it starts hiding, don't allow anymore clicks
      toast.style.pointerEvents = "none";
      if (attr.animation) {
        setTimeout(() => {
          // Helps dealing with stacked toasts that jumps when hiding
          const styles = window.getComputedStyle(toast);
          const margin = parseFloat(styles["marginBottom"]);
          const height = Math.ceil(toast.offsetHeight + margin);
          toast.style.transform = `scale(0)`;
          toast.style.marginTop = `-${height}px`;
          toast.style.opacity = "0"; // This is required for BSN
        }, 0);
      }
    },
    once
  );

  // Cleanup instead of just hiding
  toast.addEventListener(
    "hidden.bs.toast",
    (ev) => {
      // prevent issues when double clicking
      // @link https://github.com/twbs/bootstrap/issues/37265
      //@ts-ignore
      const element = inst.element || inst._element;
      if (element) {
        inst.dispose();
      }
      toast.remove();
    },
    once
  );

  inst.show();
  return inst;
}
