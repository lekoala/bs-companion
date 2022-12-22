/**
 * Create a toast object
 *
 * Stacking demo
 * @link https://codepen.io/lekoalabe/pen/poKMprj
 *
 * @param {string} attr.body Body content. Can also be filled with html tags (eg: Hello <b>World</b>)
 * @param {string} attr.header (none) Header content. Can also be filled with html tags (eg : <h6 class="mb-0">Success</h6>)
 * @param {string} attr.className (none) Additional classes for toast element (eg: 'border-0 bg-danger text-white')
 * @param {boolean} attr.animation (true) Apply transition to the toast
 * @param {boolean} attr.autohide (true) Auto hide the toast
 * @param {number} attr.delay (5000) Delay hiding the toast (ms)
 * @param {string} attr.id (toast-{ts}) Specific id if required
 * @param {string} attr.gap (1rem) Gap size
 * @param {string} attr.placement (top-right) Corner position of toast. Available values: top-right, top-center, top-left, bottom-right, bottom-center, bottom-left
 * @param {boolean} attr.btnClose (true) Show close button
 * @param {string} attr.buttonLabel (Close Notification) Close button label
 * @param {string} attr.buttonClassName (none) Additional classes for close button
 * @returns {bootstrap.Toast}
 */
export default function toaster(attr) {
  // Shortcut
  if (typeof attr === "string") {
    attr = {
      body: attr,
    };
  }

  // Set defaults
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
    toastBody.firstChild.append(btnClose);
  }

  const toast = document.createElement("div");
  toast.id = attr.id || "toast-" + Date.now();
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
    toastHeader.firstChild.append(btnClose);
    toastWrapper.append(toastHeader);
  }
  toastWrapper.append(toastBody);

  // Check if we have a container in place for the given placement or create one
  let toastContainer = document.querySelector(`.toast-container.${attr.placement}`);
  if (!toastContainer) {
    const styles = `${posV}:0;${startPos}:${posUnit};${posUnit === "50%" ? "transform: translateX(-50%)" : ""};z-index:1081;position:fixed;padding:${attr.gap};`;

    toastContainer = document.createElement("div");
    toastContainer.className = `toast-container toaster-container ${attr.placement}`;
    toastContainer.style.cssText = styles;

    document.body.insertAdjacentElement("afterbegin", toastContainer);
  }

  // Append to container and init
  toastContainer.append(toast);
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
          toast.style[animateFrom] = 0;
        }, 0);
      }
    },
    once
  );
  toast.addEventListener(
    "hide.bs.toast",
    () => {
      if (attr.animation) {
        setTimeout(() => {
          // Helps dealing with stacked toasts that jumps when hiding
          const styles = window.getComputedStyle(toast);
          const margin = parseFloat(styles["marginBottom"]);
          const height = Math.ceil(toast.offsetHeight + margin);
          toast.style.transform = `scale(0)`;
          toast.style.marginTop = `-${height}px`;
        }, 0);
      }
    },
    once
  );

  // Cleanup instead of just hiding
  toast.addEventListener(
    "hidden.bs.toast",
    () => {
      // prevent issues when double clicking
      // @link https://github.com/twbs/bootstrap/issues/37265
      setTimeout(() => {
        inst.dispose();
        toast.remove();
      }, 1000);
    },
    once
  );

  inst.show();
  return inst;
}
