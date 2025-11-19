import Alpine from "alpinejs";
import CTFd from "./index";
import { getOption } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";

const START_EVENTS_EVENT = "ctfd:start-events";

if (typeof window !== "undefined") {
  window.__CTFdDeferEvents = true;
}

window.Alpine = Alpine;
window.CTFd = CTFd;

// Default scoreboard polling interval to every 5 minutes
const scoreboardUpdateInterval = window.scoreboardUpdateInterval || 300000;

function signalEventStreamReady() {
  if (typeof window === "undefined") {
    return;
  }
  if (window.__CTFdEventsReady) {
    return;
  }
  window.__CTFdEventsReady = true;
  window.dispatchEvent(new CustomEvent(START_EVENTS_EVENT));
}

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  activeBracket: null,

  async update() {
    this.data = await CTFd.pages.scoreboard.getScoreboardDetail(10, this.activeBracket);

    let optionMerge = window.scoreboardChartOptions;
    let option = getOption(CTFd.config.userMode, this.data, optionMerge);

    embed(this.$refs.scoregraph, option);
    this.show = Object.keys(this.data).length > 0;
  },

  async init() {
    this.update();

    setInterval(() => {
      this.update();
    }, scoreboardUpdateInterval);
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async update() {
    this.brackets = await CTFd.pages.scoreboard.getBrackets(CTFd.config.userMode);
    this.standings = await CTFd.pages.scoreboard.getScoreboard();
  },

  async init() {
    this.$watch("activeBracket", value => {
      this.$dispatch("bracket-change", value);
    });

    try {
      await this.update();
    } finally {
      signalEventStreamReady();
    }

    setInterval(() => {
      this.update();
    }, scoreboardUpdateInterval);
  },
}));

// The global Alpine instance is started by assets/js/page.js.
// Avoid starting again here so ScoreboardDetail registers before the global init runs.
