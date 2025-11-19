# Warp Pipe CTF Theme

Warp Pipe is a Superplumber-inspired reskin of the official CTFd core theme. It keeps the Bootstrap 5 + Alpine.js foundation but swaps in chunky pixel fonts, glowing gradients, floating coins, and parallax scenery so your scoreboard feels like it lives inside World 1-1. All art assets here are original vectors created specifically for this project.

## Feature Highlights

- **Fresh palette & typography** – Nintendo's Superplumber Maker font family everywhere, plus updated buttons, cards, and nav pills.
- **Layered skyline** – animated clouds, hills, brick floors, and question blocks that respect `prefers-reduced-motion`.
- **Question-block challenges** – hover lift, solved green glow, and soft shadows keep the board playful without sacrificing usability.
- **Floating coins** – micro-animation powered by `assets/js/theme/superplumber.js` for extra whimsy (easy to disable).
- **Warp-ready scoreboard** – pill headers, neon badges, and softened tables align with the Superplumber look while staying readable.

## Quick Start

Clone the theme next to your CTFd install or develop it standalone:

```bash
git clone https://github.com/CTFd/core-beta.git warp-pipe-theme
cd warp-pipe-theme
```

Install dependencies (Yarn 1.x or modern npm-compatible Yarn works fine):

```bash
yarn install
```

During development run the watch build so Vite recompiles on save:

```bash
yarn dev
```

Create a production build before packaging or syncing into `CTFd/themes`:

```bash
yarn build
```

Copy the resulting directory (excluding `node_modules`) into `CTFd/themes/warp-pipe` and select it inside the CTFd admin UI.

## Customization Pointers

| Area | Files to tweak |
| --- | --- |
| Colors, gradients, parallax layers | `assets/scss/main.scss` |
| Fonts & icon faces | `assets/scss/includes/utils/_fonts.scss` |
| Superplumber artwork (clouds, bricks, coins…) | `assets/img/superplumber/` |
| Floating coins / particle logic | `assets/js/theme/superplumber.js` (imported by `assets/js/page.js`) |
| Layout wrappers & navbar markup | `templates/base.html`, `templates/components/navbar.html` |

The background animation automatically disables when visitors opt into reduced motion. Remove the `import "./theme/superplumber";` line from `assets/js/page.js` if you prefer a static scene.

## Available Scripts

| Script | Description |
| --- | --- |
| `yarn dev` | Runs `vite build --watch` for iterative development |
| `yarn build` | Produces an optimized build in `static/` |
| `yarn format` | Applies Prettier to everything under `assets/` |
| `yarn lint` | Checks formatting without modifying files |
| `yarn verify` | Production build + git diff cleanliness check |
| `yarn fetch:superplumber-font` | Downloads the Superplumber font binaries into `assets/webfonts/` (auto-runs before dev/build) |

## Directory Layout

```
assets/    -> authoring sources (SCSS, JS, images, sounds)
static/    -> compiled output served by CTFd
templates/ -> Jinja templates for each CTFd page
```

Have fun storming the castle! 🎮
