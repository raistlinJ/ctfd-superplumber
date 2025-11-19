# Pixel Font Assets

This folder stores the Mario-styled typefaces required by the theme.

- `SUPERPLUMBER_Font_v3_Solid.otf` and `SUPERPLUMBERMAKER.otf` are still fetched from https://github.com/yell0wsuit/SUPERPLUMBERFont via `yarn fetch:superplumber-font` for legacy fallbacks.
- `TypefaceMarioWorldPixelFilledRegular.otf` must be supplied manually (place the `.otf` in this directory with that exact filename) because it ships outside this repository.

Because these fonts remain under third-party licenses, the binaries are ignored by git. Always run `yarn fetch:superplumber-font` and copy the Mario World Pixel font into place before building.
