(() => {
  "use strict";

  const BitmapFontSpec = Object.freeze({
    GLYPH_W: 5,
    GLYPH_H: 7,
    ADVANCE_X: 6,
    LINE_H: 8,
    FONT_SCALE: 2,
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonBitmapFontSpec = BitmapFontSpec;
})();
