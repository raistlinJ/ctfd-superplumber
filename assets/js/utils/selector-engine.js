import { parseSelector, isDisabled, isVisible } from "bootstrap/js/src/util/index.js";

const isFunction = (candidate, prop) =>
  Boolean(candidate) && typeof candidate[prop] === "function";

const getDocumentElement = () => {
  if (typeof document === "undefined") {
    return null;
  }
  return document.documentElement;
};

const safeQuerySelectorAll = (element, selector) => {
  if (!isFunction(element, "querySelectorAll")) {
    return [];
  }
  try {
    return Array.from(element.querySelectorAll(selector));
  } catch (error) {
    console.warn("SelectorEngine.find caught selector error", error);
    return [];
  }
};

const safeQuerySelector = (element, selector) => {
  if (!isFunction(element, "querySelector")) {
    return null;
  }
  try {
    return element.querySelector(selector);
  } catch (error) {
    console.warn("SelectorEngine.findOne caught selector error", error);
    return null;
  }
};

const safeMatches = (element, selector) =>
  isFunction(element, "matches") ? element.matches(selector) : false;

const safeClosest = (element, selector) =>
  isFunction(element, "closest") ? element.closest(selector) : null;

const normalizeSelectorTarget = element => element ?? getDocumentElement();

const getSelector = element => {
  if (!element || typeof element.getAttribute !== "function") {
    return null;
  }

  let selector = element.getAttribute("data-bs-target");
  if (!selector || selector === "#") {
    let hrefAttribute = element.getAttribute("href");
    if (!hrefAttribute || (!hrefAttribute.includes("#") && !hrefAttribute.startsWith("."))) {
      return null;
    }
    if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
      hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
  }

  return selector
    ? selector
        .split(",")
        .map(sel => parseSelector(sel))
        .join(",")
    : null;
};

const SelectorEngine = {
  find(selector, element = getDocumentElement()) {
    return safeQuerySelectorAll(normalizeSelectorTarget(element), selector);
  },
  findOne(selector, element = getDocumentElement()) {
    return safeQuerySelector(normalizeSelectorTarget(element), selector);
  },
  children(element, selector) {
    if (!element || !element.children) {
      return [];
    }
    return Array.from(element.children).filter(child => safeMatches(child, selector));
  },
  parents(element, selector) {
    const parents = [];
    if (!element) {
      return parents;
    }
    let ancestor = safeClosest(element.parentNode, selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = safeClosest(ancestor.parentNode, selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element?.previousElementSibling ?? null;
    const matches = [];
    while (previous) {
      if (safeMatches(previous, selector)) {
        matches.push(previous);
        break;
      }
      previous = previous.previousElementSibling;
    }
    return matches;
  },
  next(element, selector) {
    let next = element?.nextElementSibling ?? null;
    const matches = [];
    while (next) {
      if (safeMatches(next, selector)) {
        matches.push(next);
        break;
      }
      next = next.nextElementSibling;
    }
    return matches;
  },
  focusableChildren(element) {
    const focusables = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "details",
      "[tabindex]",
      '[contenteditable="true"]',
    ]
      .map(selector => `${selector}:not([tabindex^="-"])`)
      .join(",");

    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return this.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? this.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? this.find(selector) : [];
  },
};

export default SelectorEngine;
