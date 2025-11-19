import Alpine from "alpinejs";
import CTFd from "../index";
import { colorHash } from "@ctfdio/ctfd-js/ui";
import { getOption as getUserScoreOption } from "../utils/graphs/echarts/userscore";
import { embed } from "../utils/graphs/echarts";

const ensureAlpine = () => window.Alpine || Alpine;

const userGraphs = () => ({
  solves: null,
  fails: null,
  awards: null,
  solveCount: 0,
  failCount: 0,
  awardCount: 0,

  getSolvePercentage() {
    const total = this.solveCount + this.failCount;
    if (!total) {
      return 0;
    }
    return ((this.solveCount / total) * 100).toFixed(2);
  },

  getFailPercentage() {
    const total = this.solveCount + this.failCount;
    if (!total) {
      return 0;
    }
    return ((this.failCount / total) * 100).toFixed(2);
  },

  getCategoryBreakdown() {
    if (!this.solves?.data?.length) {
      return [];
    }

    const categories = [];
    const breakdown = {};

    this.solves.data.forEach(solve => {
      categories.push(solve.challenge.category);
    });

    categories.forEach(category => {
      if (category in breakdown) {
        breakdown[category] += 1;
      } else {
        breakdown[category] = 1;
      }
    });

    const data = [];
    for (const property in breakdown) {
      data.push({
        name: property,
        count: breakdown[property],
        color: colorHash(property),
        percent: ((breakdown[property] / categories.length) * 100).toFixed(2),
      });
    }

    return data;
  },

  async init() {
    this.solves = await CTFd.pages.users.userSolves("me");
    this.fails = await CTFd.pages.users.userFails("me");
    this.awards = await CTFd.pages.users.userAwards("me");

    this.solveCount = this.solves.meta.count;
    this.failCount = this.fails.meta.count;
    this.awardCount = this.awards.meta.count;

    const optionMerge = window.userScoreGraphChartOptions;

    embed(
      this.$refs.scoregraph,
      getUserScoreOption(
        CTFd.user.id,
        CTFd.user.name,
        this.solves.data,
        this.awards.data,
        optionMerge,
      ),
    );
  },
});

const registerUserComponents = () => {
  const AlpineInstance = ensureAlpine();

  if (!AlpineInstance) {
    return;
  }

  AlpineInstance.data("UserGraphs", userGraphs);
  window.UserGraphs = userGraphs;
};

if (window.Alpine) {
  registerUserComponents();
} else {
  document.addEventListener("alpine:init", registerUserComponents, { once: true });
}
