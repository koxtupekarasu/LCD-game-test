(() => {
  "use strict";

  const SpriteSpec = Object.freeze({
    SPRITE_W: 16,
    SPRITE_H: 16,
    COLOR_DEPTH: 1,
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonSpriteSpec = SpriteSpec;
})();
