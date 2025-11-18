# Super Mario CTFd Theme

A Super Mario Bros themed CTFd theme based on the core-beta theme, featuring retro pixel art aesthetics, iconic Mario elements, and a playful gaming experience.

## Features

- 🍄 Classic Super Mario Bros visual style with pixel art elements
- 🪙 Coin-based scoring indicators
- 🏰 Castle and pipe-themed challenge categories
- 🎮 Retro 8-bit inspired color scheme
- ⭐ Mario-themed icons and graphics
- 🎵 Nostalgic gaming aesthetics

## Installation

1. Clone or download this theme to your CTFd themes directory:
   ```bash
   cd CTFd/themes/
   git clone <your-repo> mario-theme
   ```

2. Install dependencies:
   ```bash
   cd mario-theme
   npm install
   ```

3. Build the theme (this also generates the `static/manifest.json` file expected by CTFd):
   ```bash
   npm run build
   ```

4. In CTFd admin panel:
   - Navigate to Config → Theme
   - Select "mario-theme" from the dropdown
   - Save changes

## Development

To develop the theme with automatic rebuilds:

```bash
npm run dev
```

This will watch for changes in the `assets/` directory and automatically rebuild.

## Theme Structure

```
mario-theme/
├── assets/              # Source files (edit these)
│   ├── css/
│   │   └── main.scss   # Main stylesheet with Mario theming
│   └── js/
│       └── main.js     # JavaScript functionality
├── static/             # Compiled files (auto-generated)
│   └── assets/
├── templates/          # Jinja2 templates
│   ├── base.html
│   ├── page.html
│   └── ...
├── package.json
├── vite.config.js
└── theme.toml         # Theme metadata
```

## Customization

### Colors
The main colors are defined in `assets/css/main.scss`:
- Primary (Mario Red): `#E52521`
- Secondary (Mushroom): `#F0AF20`
- Success (Luigi Green): `#00A651`
- Info (Sky Blue): `#049CD8`
- Blocks (Brown): `#8B4513`

### Images
Place custom Mario-themed images in `assets/images/` and reference them in your CSS or templates.

### Fonts
The theme uses a pixel-art style font for headers. You can customize this in the CSS file.

## Building for Production

When ready to deploy:

```bash
npm run build
```

Then zip the theme folder (excluding `node_modules/`) and upload to your CTFd instance.

## Troubleshooting

- **500 error when loading the theme**: Ensure `static/manifest.json` exists. Run `npm run build` after pulling changes or editing assets so the manifest maps `main.css`/`main.js` to their hashed files.

## Credits

- Based on CTFd core-beta theme
- Super Mario Bros is a trademark of Nintendo
- This is a fan-made theme for educational purposes

## License

MIT License - See LICENSE file for details