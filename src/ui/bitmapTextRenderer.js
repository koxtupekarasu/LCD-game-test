(() => {
  "use strict";

  const FontSpec = window.DotmonBitmapFontSpec;
  const FontData = window.DotmonBitmapFontData;
  if(!FontSpec || !FontData || !FontData.GLYPHS){
    throw new Error("DotmonBitmapFontSpec and DotmonBitmapFontData are required before DotmonBitmapTextRenderer.");
  }

  const GLYPH_W = Number(FontSpec.GLYPH_W);
  const GLYPH_H = Number(FontSpec.GLYPH_H);
  const ADVANCE_X = Number(FontSpec.ADVANCE_X);
  const LINE_H = Number(FontSpec.LINE_H);
  const DEFAULT_SCALE = Number(FontSpec.FONT_SCALE);
  const GLYPHS = FontData.GLYPHS;

  function toInt(value, fallback){
    const num = Number(value);
    if(!Number.isFinite(num)) return fallback;
    return Math.floor(num);
  }

  function resolveScale(opt){
    const scale = toInt(opt?.scale, DEFAULT_SCALE);
    return Math.max(1, scale);
  }

  function resolveLetterSpacing(opt){
    return toInt(opt?.letterSpacing, 0);
  }

  function resolveAlign(opt){
    const align = String(opt?.align || "left").toLowerCase();
    if(align === "center" || align === "right") return align;
    return "left";
  }

  function resolveMode(opt){
    const mode = String(opt?.colorMode || "on").toLowerCase();
    if(mode === "off" || mode === "dim") return mode;
    return "on";
  }

  function resolveColor(opt){
    return String(opt?.color || "rgba(14,20,15,0.85)");
  }

  function resolveGlyph(char){
    if(GLYPHS[char]) return GLYPHS[char];
    const upper = String(char).toUpperCase();
    if(GLYPHS[upper]) return GLYPHS[upper];
    return GLYPHS["?"] || GLYPHS[" "];
  }

  function measureLineWidth(line, scale, letterSpacing){
    const text = String(line ?? "");
    if(text.length <= 0) return 0;
    const step = (ADVANCE_X + letterSpacing) * scale;
    const width = ((text.length - 1) * step) + (GLYPH_W * scale);
    return Math.max(0, Math.round(width));
  }

  function drawGlyph(ctx, glyph, x, y, scale){
    for(let gy = 0; gy < GLYPH_H; gy++){
      const row = glyph[gy] || "";
      for(let gx = 0; gx < GLYPH_W; gx++){
        if(row[gx] !== "1") continue;
        ctx.fillRect(
          x + (gx * scale),
          y + (gy * scale),
          scale,
          scale
        );
      }
    }
  }

  function measureText(text, opt = {}){
    const scale = resolveScale(opt);
    const lineHeight = LINE_H * scale;
    const letterSpacing = resolveLetterSpacing(opt);
    const lines = String(text ?? "").split("\n");
    let maxWidth = 0;
    for(let i = 0; i < lines.length; i++){
      const w = measureLineWidth(lines[i], scale, letterSpacing);
      if(w > maxWidth) maxWidth = w;
    }
    return {
      width: Math.round(maxWidth),
      height: Math.round(lines.length * lineHeight),
    };
  }

  function drawText(ctx, text, x, y, opt = {}){
    if(!ctx) return;
    const mode = resolveMode(opt);
    if(mode === "off") return;

    const scale = resolveScale(opt);
    const letterSpacing = resolveLetterSpacing(opt);
    const align = resolveAlign(opt);
    const step = (ADVANCE_X + letterSpacing) * scale;
    const lineHeight = LINE_H * scale;
    const startX = Math.round(x);
    const startY = Math.round(y);
    const lines = String(text ?? "").split("\n");

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if(mode === "dim"){
      ctx.globalAlpha *= 0.7;
    }
    ctx.fillStyle = resolveColor(opt);

    for(let li = 0; li < lines.length; li++){
      const line = lines[li];
      const lineWidth = measureLineWidth(line, scale, letterSpacing);
      let lineX = startX;
      if(align === "center"){
        lineX = Math.round(startX - (lineWidth / 2));
      }else if(align === "right"){
        lineX = Math.round(startX - lineWidth);
      }

      let penX = lineX;
      const penY = startY + (li * lineHeight);
      for(let ci = 0; ci < line.length; ci++){
        const glyph = resolveGlyph(line[ci]);
        drawGlyph(ctx, glyph, penX, penY, scale);
        penX += step;
      }
    }

    ctx.restore();
  }

  const api = {
    drawText,
    measureText,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonBitmapTextRenderer = Object.freeze(api);
})();
