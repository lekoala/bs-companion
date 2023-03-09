const LAZY_EVENT = "lazyload";
const IGNORE_CLASS = "lazyload-ignore";
/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, observerRef) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      // We may want to prevent events until event listeners are defined and class removed
      if (target.classList.contains(IGNORE_CLASS)) {
        return;
      }
      observerRef.unobserve(target);
      Array.from(target.children).forEach((el) => {
        el.dispatchEvent(new Event(LAZY_EVENT, { bubbles: true }));
      });
    }
  });
});

/**
 * This is a simple class that triggers a lazyload event on children when visible
 */
class LazyLoader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // innerHTML is not available because not parsed yet
    setTimeout(() => {
      observer.observe(this);
    });
  }

  disconnectedCallback() {
    observer.unobserve(this);
  }
}

export default LazyLoader;
