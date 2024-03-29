const closeIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
const blockIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>';
const checkIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

/**
 * @typedef ModalizerOptions
 * @property {string} [body] Body content. Can also be filled with html tags (eg: Hello <b>World</b>)
 * @property {string} [title] (none) Title content. Can also be filled with html tags (eg : <h6 class="mb-0">Success</h6>)
 * @property {string} [id] (modal-{ts}) Specific id if required
 * @property {boolean} [static] (false) Static backdrop
 * @property {boolean} [scrollable] (true) Scrollable modal
 * @property {boolean} [centered] (true) Centered modal
 * @property {boolean} [animated] (true) Animated modal
 * @property {boolean} [fullscreen] (false) Fullscreen modal
 * @property {boolean} [showClose] (true)
 * @property {boolean} [showConfirm] (false)
 * @property {boolean} [showCancel] (false)
 * @property {boolean} [showDeny] (false)
 * @property {string} [closeLabel] (Close)
 * @property {string} [confirmText] (v)
 * @property {string} [confirmClass] (success)
 * @property {string} [cancelText] (x)
 * @property {string} [cancelClass] (light|dark)
 * @property {string} [denyText] (/)
 * @property {string} [denyClass] (danger)
 * @property {string} [size] (none) Size of the modal (sm|md|lg)
 * @property {boolean} [showIcon] (true)
 * @property {string} [icon] (alert)
 */

let counter = 0;

/**
 * Create a modal object.
 *
 * @param {ModalizerOptions} attr
 * @returns {bootstrap.Modal}
 */
export default function modalizer(attr = {}) {
  // Shortcut
  if (typeof attr === "string") {
    attr = {
      body: attr,
    };
  }

  /**
   * @type {ModalizerOptions}
   */
  const defaults = {
    id: "",
    size: "",
    static: false,
    animated: true,
    scrollable: true,
    centered: true,
    fullscreen: false,
    showClose: true,
    closeLabel: "Close",
    showConfirm: false,
    confirmText: checkIcon,
    confirmClass: "success",
    showCancel: false,
    cancelText: closeIcon,
    cancelClass: document.documentElement.dataset.bsTheme == "dark" ? "dark" : "light",
    showDeny: false,
    denyText: blockIcon,
    denyClass: "danger",
    showIcon: true,
    icon: "warning",
  };
  attr = Object.assign({}, defaults, attr);
  attr.id = attr.id || `modal-${++counter}`;

  const once = { once: true };

  // Build template
  let staticAttr = ` data-bs-backdrop="static" data-bs-keyboard="false"`;
  let template = document.createElement("template");
  template.innerHTML = `<div class="modal${attr.scrollable ? " fade" : ""}${attr.size ? " modal-" + attr.size : ""}" id="${attr.id}"${
    attr.static ? staticAttr : ""
  } tabindex="-1" aria-hidden="true">
  <div class="modal-dialog${attr.scrollable ? " modal-dialog-scrollable" : ""}${attr.scrollable ? " modal-dialog-centered " : ""}${
    attr.fullscreen ? " modal-fullscreen" : ""
  }">
    <div class="modal-content text-center" style="border:0">
     <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="${attr.closeLabel}"></button>
      <div class="modal-icon-holder p-3 pt-4 pb-0"><div class="modal-icon modal-${attr.icon}"></div></div>
      <div class="modal-title d-flex p-3 pt-4 pb-0 align-items-center justify-content-center">
        <h5 class="fs-2">${attr.title}</h4>
      </div>
      <div class="modal-body"><form>
        ${attr.body}
      </form></div>
      <div class="modal-actions d-flex mt-2 justify-content-center">
        <div class="btn-group flex-fill" style="min-height:44px">
          <button type="button" data-event="cancel" class="btn btn-${attr.cancelClass} rounded-0">${attr.cancelText}</button>
          <button type="button" data-event="deny" class="btn btn-${attr.denyClass} rounded-0">${attr.denyText}</button>
          <button type="button" data-event="confirm" class="btn btn-${attr.confirmClass} rounded-0">${attr.confirmText}</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</div>
`;
  /**
   * @type {HTMLElement}
   */
  //@ts-ignore
  const el = template.content.firstChild;
  if (!attr.title) {
    el.querySelector(".modal-title").remove();
  }
  if (!attr.showIcon) {
    el.querySelector(".modal-icon-holder").remove();
  }
  if (!attr.showClose) {
    el.querySelector(".btn-close").remove();
  }
  if (!attr.showCancel) {
    el.querySelector('[data-event="cancel"]').remove();
  }
  if (!attr.showDeny) {
    el.querySelector('[data-event="deny"]').remove();
  }
  if (!attr.showConfirm) {
    el.querySelector('[data-event="confirm"]').remove();
  }
  if (!attr.showCancel && !attr.showDeny && !attr.showConfirm) {
    el.querySelector(".modal-actions").remove();
  }
  document.body.insertAdjacentElement("afterbegin", el);
  //@ts-ignore
  let modal = new bootstrap.Modal(el);
  // Cleanup instead of just hiding
  el.addEventListener(
    "hide.bs.modal",
    () => {
      // As soon as it starts hiding, don't allow anymore clicks
      // @link https://github.com/twbs/bootstrap/issues/37265
      el.style.pointerEvents = "none";
    },
    once
  );
  el.addEventListener(
    "hidden.bs.modal",
    () => {
      //@ts-ignore
      el.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((n) => bootstrap.Tooltip.getInstance(n).dispose());
      //@ts-ignore
      el.querySelectorAll('[data-bs-toggle="popover"]').forEach((n) => bootstrap.Popover.getInstance(n).dispose());
      modal.dispose();
      el.remove();
    },
    once
  );

  // Trigger hide
  el.querySelectorAll(".modal-actions button").forEach(
    /**
     * @param {HTMLButtonElement} btn
     */
    (btn) => {
      btn.addEventListener(
        "click",
        (ev) => {
          modal.hide();
          // Attach form data to the event
          el.dispatchEvent(
            new CustomEvent("modal." + btn.dataset.event, {
              detail: new FormData(el.querySelector("form")),
              bubbles: true,
            })
          );
        },
        once
      );
    }
  );

  // BSN needs explicit init
  //@ts-ignore
  el.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((n) => bootstrap.Tooltip.getInstance(n) || new bootstrap.Tooltip(n));
  //@ts-ignore
  el.querySelectorAll('[data-bs-toggle="popover"]').forEach((n) => bootstrap.Popover.getInstance(n) || new bootstrap.Popover(n));

  modal.show();

  // Show animation
  if (attr.icon && attr.animated && attr.showIcon) {
    el.addEventListener("shown.bs.modal", () => el.querySelector(".modal-icon").classList.add("modal-icon-show"), once);
  }

  return modal;
}
