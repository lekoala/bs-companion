const tabsSelector = ".nav";
const navLinkSelector = ".nav-link";
const dropdownItemClass = "dropdown-item";
const tabsDropdownClass = "bs-tabs-dropdown";
const activeClass = "active";
const showClass = "show";
const disabledClass = "disabled";

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const container = entry.target;
    const tabs = container.tabs;
    const offset = 30; // We need some space for the caret

    // check inlineSize (width) and not blockSize (height)
    const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
    const size = parseInt(contentBoxSize.inlineSize) - offset;

    if (size < tabs.dataset.baseWidth) {
      container.classList.add(tabsDropdownClass);
    } else if (size >= tabs.dataset.baseWidth) {
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

    this.lazySelector = ".lazy-loadable";
    this.lazyEvent = "lazyload";
  }

  /**
   * This only works if the nav is visible on page load
   */
  setBaseWidth() {
    let totalWidth = 0;
    this.querySelectorAll("li").forEach((tab) => {
      tab.dataset.baseWidth = tab.offsetWidth;
      totalWidth += parseInt(tab.dataset.baseWidth);
    });
    this.tabs.dataset.baseWidth = totalWidth;
  }

  createMobileMenu() {
    this.menu = document.createElement("ul");
    this.menu.classList.add("dropdown-menu");
    this.querySelectorAll("li").forEach((tab) => {
      const link = tab.querySelector("a, button");
      const newChild = document.createElement("li");
      const newChildLink = document.createElement("a");
      const href = link.dataset.bsTarget || link.getAttribute("href");

      // Avoid menu to be crunched on small screens
      // We apply this as a css var because it's only necessary with nav-tabs-dropdown
      // link.style.setProperty("--min-width", `${tab.dataset.baseWidth}px`);

      newChild.append(newChildLink);
      newChildLink.linkElement = link;
      newChildLink.classList.add(...[dropdownItemClass]);
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
   */
  handleEvent(event) {
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
    dropdownLink.linkElement.dispatchEvent(new Event("click", { bubbles: true }));
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
    document.querySelectorAll("input[name=_hash]").forEach((input) => {
      input.value = document.location.hash;
    });
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
    if (typeof bootstrap !== "undefined") {
      const inst = bootstrap.Tab.getInstance(tab) || new bootstrap.Tab(tab);
      inst.show();
    }
  }

  removeActiveTab() {
    this.querySelectorAll(navLinkSelector + "." + activeClass).forEach((tab) => {
      tab.classList.remove(activeClass);
      const target = document.querySelector(tab.dataset.bsTarget);
      if (target) {
        target.classList.remove(...[activeClass, showClass]);
      }
    });
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
    const activeTab = this.tabs.querySelector(navLinkSelector + ":not([" + disabledClass + "]):not(." + disabledClass + ")");
    if (!activeTab) {
      return;
    }
    this.setActiveTab(activeTab);
  }

  /**
   * @param {HTMLElement} tab the link item
   */
  triggerLazyElements(tab) {
    if (!tab) {
      return; // not visible
    }
    const target = document.querySelector(tab.dataset.bsTarget);
    if (!target) {
      return; // no valid target
    }
    const lazySelector = target.dataset.lazySelector ?? this.lazySelector;
    const lazyEvent = target.dataset.lazyEvent ?? this.lazyEvent;
    target.querySelectorAll(lazySelector).forEach((el) => {
      // make sure we are targeting the right tab
      if (el.closest(".tab-pane") !== target) {
        return;
      }
      el.dispatchEvent(new Event(lazyEvent, { bubbles: true }));
    });
    // Is there any nested tab ?
    target.querySelectorAll(navLinkSelector + "." + activeClass).forEach((nestedTab) => {
      this.triggerLazyElements(nestedTab);
    });
  }

  /**
   * This doesn't fire if the link is already marked as active
   * @param {HTMLElement} target
   */
  handleTabShow(target) {
    // Trigger lazy loading
    this.triggerLazyElements(target);

    // Track tabs clicks
    if (this.hasAttribute("linkable")) {
      const hash = target.dataset.bsTarget;
      if (hash) {
        const url = new URL(window.location);
        url.hash = hash;
        window.history.pushState({}, "", url);
        this.persistHash();
      }
    }
  }

  makeLinkable() {
    this.removeActiveTab();
    this.restoreState();
    this.setDefaultTab();
  }

  connectedCallback() {
    this.tabs = this.querySelector(tabsSelector);

    this.addEventListener("show.bs.tab", this);
    if (this.hasAttribute("linkable")) {
      this.makeLinkable();
    }
    if (this.hasAttribute("responsive")) {
      this.addEventListener("click", this);
      this.makeResponsive();
      resizeObserver.observe(this);
    }
    this.style.visibility = "visible";
    if (this.offsetWidth) {
      this.triggerLazyElements(this.getActiveTab());
    }
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
