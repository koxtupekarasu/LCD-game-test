(() => {
  "use strict";

  const BitmapText = window.DotmonBitmapTextRenderer;
  if(
    !BitmapText ||
    typeof BitmapText.drawText !== "function" ||
    typeof BitmapText.measureText !== "function"
  ){
    throw new Error("DotmonBitmapTextRenderer is required before DotmonUiText.");
  }

  function normalizeAlign(align){
    const value = String(align || "left").toLowerCase();
    if(value === "center" || value === "right") return value;
    return "left";
  }

  function measure(text, opt = {}){
    return BitmapText.measureText(String(text ?? ""), opt);
  }

  function draw(ctx, text, x, y, opt = {}){
    if(!ctx) return;
    ctx.imageSmoothingEnabled = false;
    BitmapText.drawText(ctx, String(text ?? ""), Math.round(x), Math.round(y), opt);
  }

  function drawAligned(ctx, text, x, y, align = "left", opt = {}){
    const resolvedAlign = normalizeAlign(align);
    const metrics = measure(text, opt);
    const width = Number(metrics?.width) || 0;
    let drawX = Math.round(x);
    if(resolvedAlign === "center"){
      drawX = Math.round(drawX - (width / 2));
    }else if(resolvedAlign === "right"){
      drawX = Math.round(drawX - width);
    }
    draw(ctx, text, drawX, y, { ...opt, align: "left" });
  }

  function drawInRect(ctx, text, rect, align = "left", opt = {}){
    const r = rect || {};
    const x = Number(r.x) || 0;
    const y = Number(r.y) || 0;
    const w = Number(r.w) || 0;
    const resolvedAlign = normalizeAlign(align);
    let anchorX = x;
    if(resolvedAlign === "center"){
      anchorX = x + (w / 2);
    }else if(resolvedAlign === "right"){
      anchorX = x + w;
    }
    drawAligned(ctx, text, anchorX, y, resolvedAlign, opt);
  }

  const api = {
    draw,
    measure,
    drawAligned,
    drawInRect,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonUiText = Object.freeze(api);
})();
