/**
 * Create a toast object
 *
 * @param {string} attr.body Body content. Can also be filled with html tags (eg: Hello <b>World</b>)
 * @param {string} attr.header (none) Header content. Can also be filled with html tags (eg : <h6 class="mb-0">Success</h6>)
 * @param {string} attr.className (none) Additional classes for toast element (eg: 'border-0 bg-danger text-white')
 * @param {boolean} attr.animation (true) Apply transition to the toast
 * @param {boolean} attr.autohide (true) Auto hide the toast
 * @param {number} attr.delay (5000) Delay hiding the toast (ms)
 * @param {string} attr.id (toast-{ts}) Specific id if required
 * @param {string} attr.gap (m-3) Gap class
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
  attr.gap = attr.gap ?? "m-3";
  attr.className = attr.className ?? "";
  attr.placement = attr.placement ?? "top-center";
  attr.btnClose = attr.btnClose ?? true;
  attr.buttonLabel = attr.buttonLabel ?? "Close Notification";
  attr.buttonClassName = attr.buttonClassName ?? "";
  attr.animation = attr.animation ?? true;
  attr.autohide = attr.autohide ?? true;
  attr.delay = attr.delay ?? 5000;

  // Split placement string into positional css elements
  const pos = attr.placement.split("-");
  const posUnit = pos[1] == "center" ? "50%" : "0";
  const animateFrom = pos[1] == "center" ? pos[0] : pos[1];
  if (pos[1] == "center") {
    pos[1] = "left";
  }

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
  toast.className = `position-relative toast border-0 bg-white ${attr.gap}`;
  toast.role = "alert";
  toast.ariaLive = "assertive";
  toast.ariaAtomic = "true";
  if (attr.animation) {
    toast.style[animateFrom] = "-96px";
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
    const styles = `${pos[0]}:0;${pos[1]}:${posUnit};${posUnit === "50%" ? "transform: translateX(-50%)" : ""};z-index:1081`;

    toastContainer = document.createElement("div");
    toastContainer.className = `toast-container position-fixed ${attr.placement}`;
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
    {
      once: true,
    }
  );

  // Cleanup instead of just hiding
  toast.addEventListener(
    "hidden.bs.toast",
    () => {
      // can cause issue with bs5
      // @link https://github.com/twbs/bootstrap/issues/37265
      inst.dispose();
      toast.remove();
    },
    {
      once: true,
    }
  );

  inst.show();
  return inst;
}
