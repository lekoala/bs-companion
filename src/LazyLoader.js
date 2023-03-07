const LAZY_EVENT = "lazyload";

/**
 * @var {IntersectionObserver}
 */
const observer = new window.IntersectionObserver((entries, observerRef) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      observerRef.unobserve(entry.target);
      Array.from(entry.target.children).forEach((el) => {
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
