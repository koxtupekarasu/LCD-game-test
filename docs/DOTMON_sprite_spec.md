# DOTMON Sprite Specification

## Asset Directory Structure

```text
assets/
  food/
  ad/
  ui/
  fx/
```

## Current Placeholder Files

```text
assets/food/meat_small.png
assets/food/drink_simple.png

assets/ad/ad_idle.png
assets/ad/ad_sleep.png

assets/ui/icon_food.png
assets/ui/icon_heal.png

assets/fx/effect_signal.png
```

## Sprite Size Rules

- `food icon`: `16x16`
- `ui icon`: `16x16`
- `fx icon`: `16x16`
- `ad sprite`: `16x16` (future support planned for `32x32`)

## Image Format Rules

- Format: `PNG`
- Background: transparent

## Naming Convention

- Use lowercase snake_case for file names.
- Keep category prefixes clear for shared icon domains.
  - Example: `icon_food.png`, `effect_signal.png`

## Notes for Future Expansion

- Keep each asset category isolated under `assets/<category>/`.
- When moving to `32x32` AD sprites, keep `16x16` compatibility assets until runtime switching is complete.
- Reserve per-asset metadata extension for animation frames and collision/UI anchors if needed.
