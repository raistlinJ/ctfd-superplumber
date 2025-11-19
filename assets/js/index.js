import CTFd from "@ctfdio/ctfd-js";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import times from "./theme/times";
import styles from "./theme/styles";
import highlight from "./theme/highlight";

import "./utils/selector-engine";

import alerts from "./utils/alerts";
import tooltips from "./utils/tooltips";
import collapse from "./utils/collapse";

import eventAlerts from "./utils/notifications/alerts";
import eventToasts from "./utils/notifications/toasts";
import eventRead from "./utils/notifications/read";

import "./components/language";

dayjs.extend(advancedFormat);
const START_EVENTS_EVENT = "ctfd:start-events";
const shouldDeferEvents = typeof window !== "undefined" && Boolean(window.__CTFdDeferEvents);
let pendingEventsInit = null;

if (shouldDeferEvents) {
  const originalEventsInit = CTFd.events?.init;
  if (typeof originalEventsInit === "function") {
    CTFd.events.init = (...args) => {
      pendingEventsInit = () => {
        CTFd.events.init = originalEventsInit;
        originalEventsInit(...args);
      };
    };
  }
}

CTFd.init(window.init);

(() => {
  styles();
  times();
  highlight();

  alerts();
  tooltips();
  collapse();

  const isAuthenticated = CTFd.user.id !== null && CTFd.user.id !== undefined;
  let eventsStarted = false;

  const startEventStreams = () => {
    if (!isAuthenticated || eventsStarted) {
      return;
    }

    if (typeof pendingEventsInit === "function") {
      pendingEventsInit();
      pendingEventsInit = null;
    }

    eventRead();
    eventAlerts();
    eventToasts();
    eventsStarted = true;
  };

  if (isAuthenticated) {
    if (shouldDeferEvents && typeof window !== "undefined") {
      const fallbackId = window.setTimeout(startEventStreams, 12000);
      window.addEventListener(
        START_EVENTS_EVENT,
        () => {
          window.clearTimeout(fallbackId);
          startEventStreams();
        },
        { once: true },
      );
    } else {
      startEventStreams();
    }
  }

  const controller = CTFd.events?.controller;
  if (controller && typeof window !== "undefined") {
    if (!isAuthenticated && typeof controller.destroy === "function") {
      controller.destroy();
      return;
    }

    // Detect legacy ctfd-js builds that still register unload handlers.
    const usesDeprecatedUnload =
      typeof controller.handleEvent === "function" &&
      controller.handleEvent.toString().includes("unload");

    if (usesDeprecatedUnload) {
      window.removeEventListener("unload", controller);

      const handlePageHide = () => {
        try {
          controller.destroy();
        } finally {
          window.removeEventListener("pagehide", handlePageHide);
        }
      };

      window.addEventListener("pagehide", handlePageHide);
    }
  }
})();

export default CTFd;
