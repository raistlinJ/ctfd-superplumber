const { resolve, basename, extname } = require("path");
const { readFileSync } = require("fs");
import { defineConfig, normalizePath } from "vite";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";

const selectorEngineSourcePath = normalizePath(
  resolve(__dirname, "./node_modules/bootstrap/js/src/dom/selector-engine.js")
);
const selectorEngineShimPath = resolve(
  __dirname,
  "./assets/js/utils/selector-engine.js"
);
const windowControllerSourcePath = normalizePath(
  resolve(__dirname, "./node_modules/@ctfdio/ctfd-js/events/controller.js")
);
const ctfdMainSourcePath = normalizePath(
  resolve(__dirname, "./node_modules/@ctfdio/ctfd-js/main.js")
);

const selectorEngineShim = () => ({
  name: "selector-engine-shim",
  enforce: "pre",
  load(id) {
    if (normalizePath(id) === selectorEngineSourcePath) {
      this.addWatchFile(selectorEngineShimPath);
      return readFileSync(selectorEngineShimPath, "utf8");
    }
    return null;
  },
});

const windowControllerPagehidePatch = () => ({
  name: "ctfd-window-controller-pagehide",
  enforce: "pre",
  transform(code, id) {
    if (normalizePath(id) !== windowControllerSourcePath) {
      return null;
    }

    if (!code.includes("\"unload\"")) {
      return null;
    }

    return {
      code: code.replace(/"unload"/g, '"pagehide"'),
      map: null,
    };
  },
});

const ctfdInitAuthGate = () => ({
  name: "ctfd-init-auth-gate",
  enforce: "pre",
  transform(code, id) {
    if (normalizePath(id) !== ctfdMainSourcePath) {
      return null;
    }

    const sentinel = "  events.init(config.urlRoot, config.eventSounds);\n};";
    if (!code.includes(sentinel)) {
      return null;
    }

    return {
      code: code.replace(
        sentinel,
        "  if (data.userId !== null && data.userId !== undefined) {\n" +
          "    events.init(config.urlRoot, config.eventSounds);\n" +
          "  }\n" +
          "};"
      ),
      map: null,
    };
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    selectorEngineShim(),
    windowControllerPagehidePatch(),
    ctfdInitAuthGate(),
    vue(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./node_modules/"),
      "bootstrap/js/dist/dom/selector-engine": resolve(
        __dirname,
        "./assets/js/utils/selector-engine.js"
      ),
      "bootstrap/js/dist/dom/selector-engine.js": resolve(
        __dirname,
        "./assets/js/utils/selector-engine.js"
      ),
      "bootstrap/js/src/dom/selector-engine": resolve(
        __dirname,
        "./assets/js/utils/selector-engine.js"
      ),
      "bootstrap/js/src/dom/selector-engine.js": resolve(
        __dirname,
        "./assets/js/utils/selector-engine.js"
      ),
    },
  },
  build: {
    manifest: true,
    outDir: "static",
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            // https://github.com/vitejs/vite/issues/1618#issuecomment-764579557
            {
              src: "./node_modules/@fortawesome/fontawesome-free/webfonts/**/*",
              dest: "static/webfonts",
            },
            {
              src: "./assets/webfonts/**/*",
              dest: "static/webfonts",
            },
            {
              src: "./assets/img/**",
              dest: "static/img",
            },
            {
              src: "./assets/sounds/**",
              dest: "static/sounds",
            },
          ],
          hook: "writeBundle",
        }),
      ],
      output: {
        manualChunks: {
          echarts: ["echarts", "zrender"],
        },
        entryFileNames: "assets/[name].js",
        assetFileNames: assetInfo => {
          const assetName = assetInfo.name ? basename(assetInfo.name) : "asset";
          const assetExt = extname(assetName);
          const baseName = assetName.replace(assetExt, "");
          if (assetExt === ".css") {
            return `assets/${baseName}${assetExt}`;
          }
          return `assets/${baseName}.[hash]${assetExt}`;
        },
      },
      input: {
        index: resolve(__dirname, "assets/js/index.js"),
        page: resolve(__dirname, "assets/js/page.js"),
        setup: resolve(__dirname, "assets/js/setup.js"),
        settings: resolve(__dirname, "assets/js/settings.js"),
        challenges: resolve(__dirname, "assets/js/challenges.js"),
        scoreboard: resolve(__dirname, "assets/js/scoreboard.js"),
        notifications: resolve(__dirname, "assets/js/notifications.js"),
        teams_public: resolve(__dirname, "assets/js/teams/public.js"),
        teams_private: resolve(__dirname, "assets/js/teams/private.js"),
        teams_list: resolve(__dirname, "assets/js/teams/list.js"),
        users_public: resolve(__dirname, "assets/js/users/public.js"),
        users_private: resolve(__dirname, "assets/js/users/private.js"),
        users_list: resolve(__dirname, "assets/js/users/list.js"),
        main: resolve(__dirname, "assets/scss/main.scss"),
        color_mode_switcher: resolve(__dirname, "assets/js/color_mode_switcher.js"),
      },
    },
  },
});
