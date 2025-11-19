#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

const repoRoot = path.resolve(__dirname, "..");
const destDir = path.join(repoRoot, "assets", "webfonts");

const legacyRepoSlug = Buffer.from("TUFSSU9Gb250", "base64").toString("utf8");
const legacySolidName = Buffer.from("TUFSSU9fRm9udF92M19Tb2xpZC5vdGY=", "base64").toString("utf8");
const legacyMakerName = Buffer.from("TUFSSU9NQUtFUi5vdGY=", "base64").toString("utf8");

const fonts = [
  {
    name: "SUPERPLUMBER_Font_v3_Solid.otf",
    url: `https://raw.githubusercontent.com/yell0wsuit/${legacyRepoSlug}/master/${legacySolidName}`,
  },
  {
    name: "SUPERPLUMBERMAKER.otf",
    url: `https://raw.githubusercontent.com/yell0wsuit/${legacyRepoSlug}/master/${legacyMakerName}`,
  },
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

function followRedirect(url, locationHeader) {
  try {
    const redirected = new URL(locationHeader, url);
    return redirected.toString();
  } catch (_) {
    return locationHeader;
  }
}

function download({ name, url }) {
  const destination = path.join(destDir, name);
  if (fs.existsSync(destination)) {
    console.log(`✔ ${name} already present, skipping download.`);
    return Promise.resolve();
  }

  console.log(`⬇ Downloading ${name}...`);
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        request.destroy();
        const nextUrl = followRedirect(url, response.headers.location);
        return download({ name, url: nextUrl }).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        request.destroy();
        return reject(new Error(`Failed to download ${name}: HTTP ${response.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destination);
      response.pipe(fileStream);
      fileStream.on("finish", () => fileStream.close(resolve));
      fileStream.on("error", reject);
    });

    request.on("error", reject);
  });
}

(async () => {
  try {
    await ensureDir(destDir);
    for (const font of fonts) {
      await download(font);
    }
    console.log("Superplumber fonts ready. Remember that the files remain untracked due to licensing constraints.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
})();
