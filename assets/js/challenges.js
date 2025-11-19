import Alpine from "alpinejs";
import dayjs from "dayjs";

import CTFd from "./index";

import { Modal, Tab, Tooltip } from "./utils/bootstrap";
import highlight from "./theme/highlight";

const sortFailures = {
  challenge_category_order: false,
  challenge_order: false,
};

function applyCustomSort(list, { settingKey, label }) {
  if (!Array.isArray(list) || sortFailures[settingKey]) {
    return list;
  }

  const settings = CTFd?.config?.themeSettings;
  const rawComparator = settings?.[settingKey];
  if (!rawComparator) {
    return list;
  }

  let comparator;
  try {
    comparator = new Function(`return (${rawComparator})`)();
  } catch (error) {
    sortFailures[settingKey] = true;
    console.warn(
      `[Superplumber Theme] Failed to parse ${label} sort function from theme setting "${settingKey}".`,
      error,
    );
    return list;
  }

  if (typeof comparator !== "function") {
    sortFailures[settingKey] = true;
    console.warn(
      `[Superplumber Theme] Theme setting "${settingKey}" must evaluate to a function but returned`,
      comparator,
    );
    return list;
  }

  try {
    list.sort(comparator);
  } catch (error) {
    sortFailures[settingKey] = true;
    console.warn(
      `[Superplumber Theme] Theme setting "${settingKey}" threw while sorting ${label}s.`,
      error,
    );
  }

  return list;
}

function decorateExternalLinks(root) {
  if (!root) {
    return;
  }
  const links = root.querySelectorAll('a[href*="://"]');
  links.forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function addTargetBlank(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  decorateExternalLinks(template.content || template);
  return template.innerHTML;
}

window.Alpine = Alpine;

Alpine.store("challenge", {
  data: {
    view: "",
  },
});

Alpine.data("Hint", () => ({
  id: null,
  html: null,

  async showHint(event) {
    if (event.target.open) {
      let response = await CTFd.pages.challenge.loadHint(this.id);

      // Hint has some kind of prerequisite or access prevention
      if (response.errors) {
        event.target.open = false;
        CTFd._functions.challenge.displayUnlockError(response);
        return;
      }
      let hint = response.data;
      if (hint.content) {
        this.html = addTargetBlank(hint.html);
      } else {
        let answer = await CTFd.pages.challenge.displayUnlock(this.id);
        if (answer) {
          let unlock = await CTFd.pages.challenge.loadUnlock(this.id);

          if (unlock.success) {
            let response = await CTFd.pages.challenge.loadHint(this.id);
            let hint = response.data;
            this.html = addTargetBlank(hint.html);
          } else {
            event.target.open = false;
            CTFd._functions.challenge.displayUnlockError(unlock);
          }
        } else {
          event.target.open = false;
        }
      }
    }
  },
}));

Alpine.data("Challenge", () => ({
  id: null,
  next_id: null,
  submission: "",
  tab: null,
  solves: [],
  submissions: [],
  solution: null,
  response: null,
  share_url: null,
  max_attempts: 0,
  attempts: 0,
  ratingValue: 0,
  hoveredRating: 0,
  selectedRating: 0,
  ratingReview: "",
  ratingSubmitted: false,

  async init() {
    highlight();
  },

  getStyles() {
    let styles = {
      "modal-dialog": true,
    };
    try {
      const size =
        CTFd.config?.themeSettings?.challenge_window_size || "xl";
      switch (size) {
        case "sm":
          styles["modal-sm"] = true;
          break;
        case "lg":
          styles["modal-lg"] = true;
          break;
        case "xl":
        default:
          styles["modal-xl"] = true;
          break;
      }
    } catch (error) {
      // Ignore errors with challenge window size
      console.log("Error processing challenge_window_size");
      console.log(error);
      styles["modal-xl"] = true;
    }
    return styles;
  },

  async init() {
    highlight();
  },

  async showChallenge() {
    new Tab(this.$el).show();
  },

  async showSolves() {
    this.solves = await CTFd.pages.challenge.loadSolves(this.id);
    this.solves.forEach(solve => {
      solve.date = dayjs(solve.date).format("MMMM Do, h:mm:ss A");
      return solve;
    });
    new Tab(this.$el).show();
  },

  async showSubmissions() {
    let response = await CTFd.pages.users.userSubmissions("me", this.id);
    this.submissions = response.data;
    this.submissions.forEach(s => {
      s.date = dayjs(s.date).format("MMMM Do, h:mm:ss A");
      return s;
    });
    new Tab(this.$el).show();
  },

  getSolutionId() {
    let data = Alpine.store("challenge").data;
    return data.solution_id;
  },

  async showSolution() {
    let solution_id = this.getSolutionId();
    CTFd._functions.challenge.displaySolution = solution => {
      this.solution = solution.html;
      new Tab(this.$el).show();
    };
    await CTFd.pages.challenge.displaySolution(solution_id);
  },

  getNextId() {
    let data = Alpine.store("challenge").data;
    return data.next_id;
  },

  async nextChallenge() {
    const modalRoot = document.querySelector("[x-ref='challengeWindow']");
    if (!modalRoot) {
      return;
    }
    let modal = Modal.getOrCreateInstance(modalRoot);

    // TODO: Get rid of this private attribute access
    // See https://github.com/twbs/bootstrap/issues/31266
    modal._element.addEventListener(
      "hidden.bs.modal",
      event => {
        // Dispatch load-challenge event to call loadChallenge in the ChallengeBoard
        Alpine.nextTick(() => {
          this.$dispatch("load-challenge", this.getNextId());
        });
      },
      { once: true },
    );
    modal.hide();
  },

  async getShareUrl() {
    let body = {
      type: "solve",
      challenge_id: this.id,
    };
    const response = await CTFd.fetch("/api/v1/shares", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const url = data["data"]["url"];
    this.share_url = url;
  },

  copyShareUrl() {
    navigator.clipboard.writeText(this.share_url);
    let t = Tooltip.getOrCreateInstance(this.$el);
    t.enable();
    t.show();
    setTimeout(() => {
      t.hide();
      t.disable();
    }, 2000);
  },

  async submitChallenge() {
    const isAuthenticated =
      CTFd?.user?.id !== null && CTFd?.user?.id !== undefined;

    if (!isAuthenticated) {
      this.response = {
        data: {
          status: "login_required",
          message: "Please log in to submit flags.",
        },
      };
      await this.renderSubmissionResponse();
      return;
    }

    try {
      const rawResponse = await CTFd.pages.challenge.submitChallenge(
        this.id,
        this.submission,
      );
      this.response = this.normalizeSubmissionResponse(rawResponse);
    } catch (error) {
      console.error("Challenge submission failed", error);
      this.response = {
        data: {
          status: "error",
          message:
            (error?.response?.data?.message) ||
            error?.message ||
            "Something went wrong. Please try again.",
        },
      };
    }

    await this.renderSubmissionResponse();
  },

  async renderSubmissionResponse() {
    const payload = this.response?.data;
    if (!payload) {
      return;
    }

    if (payload.status === "correct") {
      this.submission = "";
    }

    // Increment attempts counter
    if (
      this.max_attempts > 0 &&
      payload.status != "already_solved" &&
      payload.status != "ratelimited"
    ) {
      this.attempts += 1;
    }

    // Dispatch load-challenges event to call loadChallenges in the ChallengeBoard
    this.$dispatch("load-challenges");
  },

  normalizeSubmissionResponse(rawResponse) {
    if (!rawResponse || typeof rawResponse !== "object") {
      return {
        data: {
          status: "error",
          message: "No response received.",
        },
      };
    }

    const fallbackStatus = rawResponse.success ? "correct" : "incorrect";
    const payload =
      rawResponse.data && typeof rawResponse.data === "object"
        ? rawResponse.data
        : {};

    return {
      ...rawResponse,
      data: {
        status: payload.status || fallbackStatus,
        message:
          payload.message ||
          rawResponse.message ||
          (rawResponse.success ? "Challenge solved!" : "Submission received."),
      },
    };
  },

  async submitRating() {
    const response = await CTFd.pages.challenge.submitRating(
      this.id,
      this.selectedRating,
      this.ratingReview,
    );
    if (response.value) {
      this.ratingValue = this.selectedRating;
      this.ratingSubmitted = true;
    } else {
      alert("Error submitting rating");
    }
  },
}));

Alpine.data("ChallengeBoard", () => ({
  loaded: false,
  challenges: [],
  challenge: null,
  scrollCueCleanup: null,

  async init() {
    this.challenges = await CTFd.pages.challenges.getChallenges();
    this.loaded = true;
    this.$nextTick(() => {
      this.setupScrollHint();
    });

    if (window.location.hash) {
      let chalHash = decodeURIComponent(window.location.hash.substring(1));
      let idx = chalHash.lastIndexOf("-");
      if (idx >= 0) {
        let pieces = [chalHash.slice(0, idx), chalHash.slice(idx + 1)];
        let id = pieces[1];
        await this.loadChallenge(id);
      }
    }
  },

  getCategories() {
    const categories = [];

    this.challenges.forEach(challenge => {
      const { category } = challenge;

      if (!categories.includes(category)) {
        categories.push(category);
      }
    });

    applyCustomSort(categories, {
      settingKey: "challenge_category_order",
      label: "challenge category",
    });

    return categories;
  },

  getChallenges(category) {
    let challenges = this.challenges;

    if (category !== null) {
      challenges = this.challenges.filter(challenge => challenge.category === category);
    }

    applyCustomSort(challenges, {
      settingKey: "challenge_order",
      label: "challenge",
    });

    return challenges;
  },

  async loadChallenges() {
    this.challenges = await CTFd.pages.challenges.getChallenges();
    this.$nextTick(() => {
      this.setupScrollHint();
    });
  },

  async loadChallenge(challengeId) {
    await CTFd.pages.challenge.displayChallenge(challengeId, challenge => {
      const challengeStore = Alpine.store("challenge");
      challengeStore.data = { ...challenge.data, view: "" };

      // Ensure Alpine flushes the new reactive object before injecting the view markup
      Alpine.nextTick(() => {
        challengeStore.data.view = challenge.data.view;

        // Wait for Alpine to render the incoming HTML before touching the Bootstrap instance
        Alpine.nextTick(async () => {
          const modalRoot = this.$refs?.challengeWindow || document.querySelector("[x-ref='challengeWindow']");
          if (!modalRoot) {
            return;
          }

          const waitForDialog = () =>
            new Promise(resolve => {
              const check = remaining => {
                if (modalRoot.querySelector(".modal-dialog")) {
                  resolve();
                  return;
                }
                if (remaining <= 0) {
                  console.warn("Bootstrap modal dialog markup not found yet; skipping show()");
                  resolve();
                  return;
                }
                requestAnimationFrame(() => check(remaining - 1));
              };
              check(10);
            });

          await waitForDialog();

          const existingInstance = Modal.getInstance(modalRoot);
          if (existingInstance) {
            existingInstance.dispose();
          }
          const modal = new Modal(modalRoot);
          // TODO: Get rid of this private attribute access
          // See https://github.com/twbs/bootstrap/issues/31266
          modal._element.addEventListener(
            "hidden.bs.modal",
            () => {
              // Remove location hash
              history.replaceState(null, null, " ");
            },
            { once: true },
          );

          decorateExternalLinks(modal._element);
          modal.show();
          history.replaceState(null, null, `#${challenge.data.name}-${challengeId}`);
        });
      });
    });
  },

  setupScrollHint() {
    if (this.scrollCueCleanup) {
      this.scrollCueCleanup();
      this.scrollCueCleanup = null;
    }

    const worldColumns = document.querySelector(".superplumber-world-columns");
    if (!worldColumns) {
      return;
    }

    const toggleCue = () => {
      const totalScrollable = worldColumns.scrollWidth - worldColumns.clientWidth;
      const hasOverflow = totalScrollable > 8;
      if (!hasOverflow) {
        worldColumns.classList.remove("has-scroll");
        return;
      }

      const nearRightEdge =
        worldColumns.scrollLeft + worldColumns.clientWidth >=
        worldColumns.scrollWidth - 16;
      worldColumns.classList.toggle("has-scroll", !nearRightEdge);
    };

    const handleScroll = () => {
      toggleCue();
    };

    worldColumns.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => toggleCue());
    resizeObserver.observe(worldColumns);

    this.scrollCueCleanup = () => {
      worldColumns.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };

    toggleCue();
  },
}));

// Alpine is started globally in assets/js/page.js; the challenge bundle only registers stores/components.
