import coinIcon from "../../img/mario/coin.svg";
import starIcon from "../../img/mario/star.svg";
import mushroomIcon from "../../img/mario/mushroom.svg";
import fireFlowerIcon from "../../img/mario/fire-flower.svg";
import CTFd from "../index";

const MAX_COINS = 10;
const MAX_STARS = 5;
const COIN_SPAWN_INTERVAL = 1400;
const STAR_SPAWN_INTERVAL = 2600;
const FLOATING_ICON_COUNT = 12;
const FLOATING_ICON_VARIANTS = [
  { name: "star", src: starIcon, min: 32, max: 58 },
  { name: "coin", src: coinIcon, min: 30, max: 48 },
  { name: "mushroom", src: mushroomIcon, min: 40, max: 60 },
  { name: "flower", src: fireFlowerIcon, min: 36, max: 56 },
];
const ACCOUNT_CACHE_TTL = 30 * 1000;
const SCOREBOARD_CACHE_TTL = 2 * 60 * 1000;
const accountCache = new Map();
const scoreboardCache = {
  data: null,
  timestamp: 0,
  promise: null,
};
let marioParticlesStarted = false;
let floatingIconsPlaced = false;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function createContainer() {
  let container = document.querySelector(".mario-coin-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "mario-coin-container";
    document.body.appendChild(container);
  }
  return container;
}

function spawnCoin(container) {
  const coin = document.createElement("span");
  coin.className = "mario-coin";
  coin.style.left = `${Math.random() * 100}%`;
  coin.style.bottom = `${Math.random() * -30}px`;
  const duration = 5 + Math.random() * 3;
  coin.style.animationDuration = `${duration}s`;
  container.appendChild(coin);

  const cleanup = () => {
    coin.removeEventListener("animationend", cleanup);
    coin.remove();
  };
  coin.addEventListener("animationend", cleanup);
}

function spawnStar(container) {
  const star = document.createElement("span");
  star.className = "mario-star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.bottom = `${Math.random() * -40}px`;
  const duration = 6 + Math.random() * 4;
  star.style.animationDuration = `${duration}s`;
  container.appendChild(star);

  const cleanup = () => {
    star.removeEventListener("animationend", cleanup);
    star.remove();
  };
  star.addEventListener("animationend", cleanup);
}

function startMarioCoins() {
  if (marioParticlesStarted || prefersReducedMotion.matches) {
    marioParticlesStarted = true;
    return;
  }
  marioParticlesStarted = true;

  const container = createContainer();

  for (let i = 0; i < 4; i += 1) {
    spawnCoin(container);
  }

  for (let i = 0; i < 2; i += 1) {
    spawnStar(container);
  }

  setInterval(() => {
    if (document.hidden) {
      return;
    }

    if (container.querySelectorAll(".mario-coin").length < MAX_COINS) {
      spawnCoin(container);
    }
  }, COIN_SPAWN_INTERVAL);

  setInterval(() => {
    if (document.hidden) {
      return;
    }

    if (container.querySelectorAll(".mario-star").length < MAX_STARS) {
      spawnStar(container);
    }
  }, STAR_SPAWN_INTERVAL);
}

prefersReducedMotion.addEventListener("change", (event) => {
  if (!event.matches) {
    startMarioCoins();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMarioTheme, { once: true });
} else {
  initMarioTheme();
}

function ensureFloatingLayer() {
  let layer = document.querySelector(".mario-floating-icons");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "mario-floating-icons";
    document.body.appendChild(layer);
  }
  return layer;
}

function choosePosition(taken) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const top = 8 + Math.random() * 74;
    const left = 4 + Math.random() * 92;
    const tooClose = taken.some(pos => {
      const dx = pos.left - left;
      const dy = pos.top - top;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });
    if (!tooClose) {
      return { top, left };
    }
  }
  return { top: 10 + Math.random() * 70, left: 6 + Math.random() * 88 };
}

function placeFloatingIcons() {
  if (floatingIconsPlaced) {
    return;
  }
  floatingIconsPlaced = true;
  const layer = ensureFloatingLayer();
  const takenPositions = [];
  const totalIcons = FLOATING_ICON_COUNT;

  for (let i = 0; i < totalIcons; i += 1) {
    const variant = FLOATING_ICON_VARIANTS[i % FLOATING_ICON_VARIANTS.length];
    const icon = document.createElement("img");
    icon.src = variant.src;
    icon.alt = "";
    icon.loading = "lazy";
    icon.decoding = "async";
    icon.className = `mario-floating-icon mario-floating-icon--${variant.name}`;
    const width = variant.min + Math.random() * (variant.max - variant.min);
    icon.style.width = `${width}px`;
    const position = choosePosition(takenPositions);
    takenPositions.push(position);
    icon.style.top = `${position.top}%`;
    icon.style.left = `${position.left}%`;
    const duration = 7 + Math.random() * 6;
    icon.style.animationDuration = `${duration}s`;
    icon.style.animationDelay = `${Math.random() * 3}s`;
    layer.appendChild(icon);
  }
}

function initMarioTheme() {
  placeFloatingIcons();
  startMarioCoins();
  initStatusBar();
}

function initStatusBar() {
  const scoreEl = document.querySelector(".js-mario-score");
  const rankEl = document.querySelector(".js-mario-rank");

  if (!scoreEl && !rankEl) {
    return;
  }

  const isAuthed = Boolean(window?.init?.userId || window?.init?.teamId);
  if (!isAuthed) {
    if (scoreEl) {
      const fallbackScore = Number(scoreEl.dataset.marioScore || 0);
      scoreEl.textContent = formatScore(fallbackScore);
    }
    if (rankEl) {
      rankEl.textContent = formatRank(Number(rankEl.dataset.marioRank || 0));
    }
    return;
  }

  hydrateStatusCounts(scoreEl, rankEl);
}

async function hydrateStatusCounts(scoreEl, rankEl) {
  const endpoints = getStatusEndpoints();
  if (!endpoints) {
    return;
  }

  try {
    const account = await getCachedAccount(endpoints.account);
    const scoreValue = Number(account?.data?.score ?? scoreEl?.dataset?.marioScore ?? 0);
    const rankValue = await resolveRankValue(account, rankEl);

    if (scoreEl) {
      scoreEl.textContent = formatScore(scoreValue);
      scoreEl.dataset.marioScore = String(scoreValue);
    }
    if (rankEl) {
      rankEl.textContent = formatRank(rankValue);
      rankEl.dataset.marioRank = String(rankValue);
    }
  } catch (error) {
    console.warn("Unable to update Mario status bar", error);
  }
}

function getStatusEndpoints() {
  const init = window?.init || {};
  if (!init.userId && !init.teamId) {
    return null;
  }

  if (init.userMode === "teams" && init.teamId) {
    return {
      account: "/api/v1/teams/me",
    };
  }

  return {
    account: "/api/v1/users/me",
  };
}

async function getCachedAccount(url) {
  const cacheEntry = accountCache.get(url);
  const now = Date.now();

  if (cacheEntry && cacheEntry.data && now - cacheEntry.timestamp < ACCOUNT_CACHE_TTL) {
    return cacheEntry.data;
  }

  if (cacheEntry && cacheEntry.promise) {
    return cacheEntry.promise;
  }

  const promise = fetchJSON(url)
    .then(data => {
      accountCache.set(url, { data, timestamp: Date.now(), promise: null });
      return data;
    })
    .catch(error => {
      const previous = accountCache.get(url) || {};
      accountCache.set(url, { data: previous.data || null, timestamp: previous.timestamp || 0, promise: null });
      throw error;
    });

  accountCache.set(url, { data: cacheEntry?.data ?? null, timestamp: cacheEntry?.timestamp ?? 0, promise });
  return promise;
}



async function fetchJSON(url) {
  const clientFetch = window?.CTFd?.fetch || window.fetch;
  if (typeof clientFetch !== "function") {
    throw new Error("Fetch API unavailable");
  }
  const response = await clientFetch(url, {
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function formatScore(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return safeValue.toString().padStart(6, "0");
}

function formatCoins(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return `×${safeValue.toString().padStart(2, "0")}`;
}

function formatRank(value) {
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  if (safeValue <= 0) {
    return "#---";
  }
  if (safeValue >= 1000) {
    return `#${safeValue}`;
  }
  return `#${safeValue.toString().padStart(3, "0")}`;
}

function parseRankFromAccount(accountResponse) {
  const rankRaw = accountResponse?.data?.place ?? accountResponse?.data?.rank ?? accountResponse?.data?.position;
  const rank = Number(rankRaw);
  return Number.isFinite(rank) && rank > 0 ? rank : null;
}

function getDatasetRankFallback(rankEl) {
  const datasetFallbackRaw = rankEl?.dataset?.marioRank ?? 0;
  const datasetFallback = Number(datasetFallbackRaw);
  return Number.isFinite(datasetFallback) ? datasetFallback : 0;
}

async function resolveRankValue(accountResponse, rankEl) {
  const accountRank = parseRankFromAccount(accountResponse);
  if (accountRank) {
    return accountRank;
  }

  if (rankEl) {
    const scoreboardRank = await resolveRankFromScoreboard(accountResponse);
    if (scoreboardRank) {
      return scoreboardRank;
    }
  }

  return getDatasetRankFallback(rankEl);
}

async function resolveRankFromScoreboard(accountResponse) {
  const accountId = Number(accountResponse?.data?.id);
  if (!Number.isFinite(accountId) || accountId <= 0) {
    return null;
  }

  let standings;
  try {
    standings = await getCachedScoreboard();
  } catch (error) {
    console.warn("Unable to fetch scoreboard for rank fallback", error);
    return null;
  }

  if (!Array.isArray(standings) || standings.length === 0) {
    return null;
  }

  const targetPath = getAccountPathFromResponse(accountResponse);

  for (let index = 0; index < standings.length; index += 1) {
    const entry = standings[index];
    if (!entry) {
      continue;
    }

    if (matchesScoreboardEntry(entry, accountId, targetPath)) {
      return index + 1;
    }
  }

  return null;
}

function matchesScoreboardEntry(entry, accountId, targetPath) {
  const entryPath = normalizeAccountPath(entry?.account_url || entry?.url || "");
  if (entryPath && targetPath && entryPath === targetPath) {
    return true;
  }

  const candidateIds = [entry?.account_id, entry?.team_id, entry?.user_id, entry?.id];
  return candidateIds.some(candidate => Number(candidate) === accountId);
}

function getAccountPathFromResponse(accountResponse) {
  const accountId = Number(accountResponse?.data?.id);
  if (!Number.isFinite(accountId) || accountId <= 0) {
    return null;
  }

  const init = window?.init || {};
  const userMode = init.userMode || CTFd?.config?.userMode;
  const basePath = userMode === "teams" ? "/teams" : "/users";
  const scriptRoot = init.urlRoot || "";
  return normalizeAccountPath(`${scriptRoot}${basePath}/${accountId}`);
}

function normalizeAccountPath(value) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  try {
    const absolute = new URL(value, window.location.origin);
    return absolute.pathname.replace(/\/+$/, "");
  } catch (error) {
    const scriptRoot = window?.init?.urlRoot || "";
    return value.replace(scriptRoot, "").replace(/\/+$/, "");
  }
}

async function getCachedScoreboard() {
  const now = Date.now();
  if (
    Array.isArray(scoreboardCache.data) &&
    now - scoreboardCache.timestamp < SCOREBOARD_CACHE_TTL
  ) {
    return scoreboardCache.data;
  }

  if (scoreboardCache.promise) {
    return scoreboardCache.promise;
  }

  const fetchPromise = fetchJSON("/api/v1/scoreboard")
    .then(body => {
      const standings = Array.isArray(body?.data) ? body.data : [];
      scoreboardCache.data = standings;
      scoreboardCache.timestamp = Date.now();
      scoreboardCache.promise = null;
      return standings;
    })
    .catch(error => {
      scoreboardCache.promise = null;
      throw error;
    });

  scoreboardCache.promise = fetchPromise;
  return fetchPromise;
}
