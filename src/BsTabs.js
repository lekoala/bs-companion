import whenParsed from "./utils/whenParsed.js";
import ce from "./utils/ce.js";

const tabsSelector = ".nav";
const navLinkSelector = ".nav-link";
const dropdownItemClass = "dropdown-item";
const tabsDropdownClass = "bs-tabs-dropdown";
const activeClass = "active";
const showClass = "show";
const disabledClass = "disabled";

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    /**
     * @type {BsTabs}
     */
    //@ts-ignore
    const container = entry.target;
    const tabs = container.tabs;
    const offset = 30; // We need some space for the caret

    // check inlineSize (width) and not blockSize (height)
    const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
    const size = parseInt(contentBoxSize.inlineSize) - offset - 1; // avoid rounding issues

    const baseWidth = parseInt(tabs.dataset.baseWidth);
    if (size < baseWidth) {
      container.classList.add(tabsDropdownClass);
    } else if (size >= baseWidth) {
      container.classList.remove(tabsDropdownClass);
      container.menu.style.display = "none";
    }
  }
});

/**
 * Improve bs tabs by making them collapsable and linkable
 */
class BsTabs extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  /**
   * This only works if the nav is visible on page load
   */
  setBaseWidth() {
    let totalWidth = 0;
    this.querySelectorAll("li").forEach((tab) => {
      tab.dataset.baseWidth = "" + tab.offsetWidth;
      totalWidth += parseInt(tab.dataset.baseWidth);
    });
    this.tabs.dataset.baseWidth = "" + totalWidth;
  }

  createMobileMenu() {
    this.menu = ce("ul");
    this.menu.classList.add("dropdown-menu");
    this.querySelectorAll("li").forEach((dropdownLink) => {
      const link = dropdownLink.querySelector("a") || dropdownLink.querySelector("button");
      const newChild = ce("li");
      const newChildLink = ce("a");
      const href = link.dataset.bsTarget || link.getAttribute("href");

      // Avoid menu to be crunched on small screens
      // We apply this as a css var because it's only necessary with nav-tabs-dropdown
      // link.style.setProperty("--min-width", `${tab.dataset.baseWidth}px`);

      newChild.append(newChildLink);
      newChildLink.dataset.link = link.getAttribute("id");
      newChildLink.classList.add(...[dropdownItemClass, "text-wrap"]);
      newChildLink.innerHTML = link.innerHTML.replace(/<br[^>]*>/, " "); // Replace any BR
      newChildLink.setAttribute("href", href);
      if (link.classList.contains(disabledClass) || link.hasAttribute(disabledClass)) {
        newChildLink.classList.add(disabledClass);
      }
      this.menu.append(newChild);
    });
    this.append(this.menu);
  }

  /**
   * @link https://gomakethings.com/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/
   * @link https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4#handling-events
   *
   * @param {Event} event
   */
  handleEvent(event) {
    /**
     * @type {HTMLElement}
     */
    // @ts-ignore
    const target = event.target;
    if (event.type === "show.bs.tab") {
      this.handleTabShow(target);
    } else if (target.matches(navLinkSelector)) {
      this.handleNavClick(target);
    } else if (target.matches("." + dropdownItemClass)) {
      event.preventDefault();
      this.handleDropdownClick(target);
    }
  }

  handleDropdownClick(dropdownLink) {
    const linkElement = document.getElementById(dropdownLink.dataset.link);
    linkElement.dispatchEvent(new Event("click", { bubbles: true }));
    this.menu.style.display = "none";
  }

  handleNavClick(navLink) {
    if (!navLink.classList.contains(activeClass)) {
      return;
    }
    if (!this.classList.contains(tabsDropdownClass)) {
      return;
    }

    // Hide current element
    const hidden = this.menu.querySelector("." + dropdownItemClass + "[hidden]");
    if (hidden) {
      hidden.removeAttribute("hidden");
    }
    const href = navLink.dataset.bsTarget || navLink.getAttribute("href");
    const active = this.menu.querySelector("a[href='" + href + "']");
    if (active) {
      active.setAttribute("hidden", "hidden");
    }

    // Toggle menu
    if (this.menu.style.display == "block") {
      this.menu.style.display = "none";
    } else {
      this.menu.style.display = "block";
      this.menu.style.top = navLink.parentElement.offsetHeight + "px";
    }
  }

  makeResponsive() {
    this.setBaseWidth();
    this.createMobileMenu();
  }

  /**
   * Persist hash in forms in case it gets submitted to allow proper redirection
   */
  persistHash() {
    document.querySelectorAll("input[name=_hash]").forEach(
      /**
       * @param {HTMLInputElement} input
       */
      (input) => {
        input.value = document.location.hash;
      }
    );
  }

  /**
   * Restore state based on location hash
   * Support nested tab activation
   */
  restoreState() {
    const hash = document.location.hash;
    if (!hash) {
      return;
    }
    // tabs can be nested, we need to activate each one of them
    const parts = hash.split("__").slice(0, -1);
    parts.push(hash);
    parts.forEach((part) => {
      /**
       * @type {HTMLElement}
       */
      const activeTab = this.querySelector("[data-bs-target='" + part + "']");
      if (activeTab) {
        this.setActiveTab(activeTab);
      }
    });
    this.persistHash();
  }

  /**
   * @param {HTMLElement} tab the link item
   */
  setActiveTab(tab) {
    tab.classList.add(activeClass);
    const target = document.querySelector(tab.dataset.bsTarget);
    if (target) {
      target.classList.add(...[activeClass, showClass]);
    }
    // If bootstrap is already defined, make sure to show the proper tab
    // Otherwise, bootstrap will pick up the active class
    //@ts-ignore
    if (typeof bootstrap !== "undefined") {
      //@ts-ignore
      const inst = bootstrap.Tab.getInstance(tab) || new bootstrap.Tab(tab);
      inst.show();
    }
  }

  removeActiveTab() {
    this.querySelectorAll(navLinkSelector + "." + activeClass).forEach(
      /**
       * @param {HTMLElement} tab
       */
      (tab) => {
        tab.classList.remove(activeClass);
        const target = document.querySelector(tab.dataset.bsTarget);
        if (target) {
          target.classList.remove(...[activeClass, showClass]);
        }
      }
    );
  }

  /**
   * @returns {HTMLElement}
   */
  getActiveTab() {
    return this.tabs.querySelector("." + activeClass);
  }

  setDefaultTab() {
    if (this.getActiveTab()) {
      return;
    }
    // Get the first valid tab
    /**
     * @type {HTMLElement}
     */
    const activeTab = this.tabs.querySelector(navLinkSelector + ":not([" + disabledClass + "]):not(." + disabledClass + ")");
    if (!activeTab) {
      return;
    }
    this.setActiveTab(activeTab);
  }

  /**
   * This doesn't fire if the link is already marked as active
   * @param {HTMLElement} target
   */
  handleTabShow(target) {
    // Track tabs clicks
    if (this.hasAttribute("linkable")) {
      const hash = target.dataset.bsTarget;
      if (hash) {
        const method = this.getAttribute("linkable") == "nav" ? "pushState" : "replaceState";
        const url = new URL(window.location.href);
        url.hash = hash;
        window.history[method](
          {
            bstabs: true,
          },
          "",
          url
        );
        this.persistHash();
      }
    }
  }

  makeLinkable(nav = false) {
    this.removeActiveTab();
    this.restoreState();
    this.setDefaultTab();

    // If we push in state, deal with popstate
    if (nav) {
      window.addEventListener("popstate", (event) => {
        this.removeActiveTab();
        this.restoreState();
      });
    }
  }

  connectedCallback() {
    whenParsed(this);
  }

  parsedCallback() {
    /**
     * @type {HTMLElement}
     */
    this.tabs = this.querySelector(tabsSelector);

    // call handleEvent
    this.addEventListener("show.bs.tab", this);
    if (this.hasAttribute("linkable")) {
      this.makeLinkable(this.getAttribute("linkable") == "nav");
    }
    if (this.hasAttribute("responsive")) {
      this.addEventListener("click", this);
      this.makeResponsive();
      resizeObserver.observe(this);
    }
    this.style.visibility = "visible";
  }

  disconnectedCallback() {
    this.removeEventListener("show.bs.tab", this);
    if (this.hasAttribute("responsive")) {
      this.removeEventListener("click", this);
      resizeObserver.unobserve(this);
    }
  }
}

export default BsTabs;
