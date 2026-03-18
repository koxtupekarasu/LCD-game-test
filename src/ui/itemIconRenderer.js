(() => {
  "use strict";

  const UiText = window.DotmonUiText;
  if(
    !UiText ||
    typeof UiText.draw !== "function" ||
    typeof UiText.measure !== "function"
  ){
    throw new Error("DotmonUiText is required before DotmonItemIconRenderer.");
  }

  const RANK_TEXT_BY_VALUE = Object.freeze({
    1: "I",
    2: "II",
    3: "III",
  });

  function toInt(value, fallback = 0){
    const num = Number(value);
    if(!Number.isFinite(num)) return fallback;
    return Math.floor(num);
  }

  function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
  }

  function normalizeRank(rank){
    const raw = toInt(rank, 0);
    if(raw <= 0) return 0;
    return clamp(raw, 1, 3);
  }

  function rankToLabel(rank){
    const normalized = normalizeRank(rank);
    return RANK_TEXT_BY_VALUE[normalized] || "";
  }

  function getSpriteMetrics(sprite){
    if(!Array.isArray(sprite) || sprite.length <= 0) return null;
    const height = sprite.length;
    const firstRow = Array.isArray(sprite[0]) ? sprite[0] : null;
    const width = firstRow ? firstRow.length : 0;
    if(width <= 0) return null;
    for(let y = 0; y < height; y++){
      if(!Array.isArray(sprite[y]) || sprite[y].length !== width){
        return null;
      }
    }
    return { width, height };
  }

  function drawSpriteIcon(ctx, sprite, x, y, iconSize, opt = {}){
    if(!ctx) return false;
    const metrics = getSpriteMetrics(sprite);
    if(!metrics) return false;

    const size = Math.max(1, toInt(iconSize, Math.max(metrics.width, metrics.height)));
    const baseDim = Math.max(metrics.width, metrics.height);
    const dotSize = Math.max(1, Math.floor(size / Math.max(1, baseDim)));
    const drawWidth = metrics.width * dotSize;
    const drawHeight = metrics.height * dotSize;
    const drawX = Math.round(x + ((size - drawWidth) / 2));
    const drawY = Math.round(y + ((size - drawHeight) / 2));
    const pixelColor = String(opt.pixelColor || "rgba(14,20,15,0.78)");
    const accentColor = String(opt.accentColor || "rgba(14,20,15,0.92)");

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for(let sy = 0; sy < metrics.height; sy++){
      for(let sx = 0; sx < metrics.width; sx++){
        const value = Number(sprite[sy][sx]);
        if(value <= 0) continue;
        ctx.fillStyle = value === 2 ? accentColor : pixelColor;
        ctx.fillRect(
          drawX + (sx * dotSize),
          drawY + (sy * dotSize),
          dotSize,
          dotSize
        );
      }
    }
    ctx.restore();
    return true;
  }

  function resolveRankScale(iconSize, opt = {}){
    const forced = toInt(opt.rankScale, -1);
    if(forced >= 1) return forced;
    const size = Math.max(1, toInt(iconSize, 16));
    return size >= 112 ? 2 : 1;
  }

  function drawRankLabel(ctx, rank, x, y, iconSize, opt = {}){
    if(!ctx) return false;
    const label = rankToLabel(rank);
    if(label.length <= 0) return false;

    const size = Math.max(1, toInt(iconSize, 16));
    const scale = resolveRankScale(size, opt);
    const letterSpacing = toInt(opt.rankLetterSpacing, 0);
    const insetX = Math.max(1, toInt(opt.rankOffsetX, Math.floor(size / 16)));
    const insetY = Math.max(1, toInt(opt.rankOffsetY, Math.max(2, Math.floor(size / 8))));
    const underOffsetX = toInt(opt.rankUnderOffsetX, 1);
    const underOffsetY = toInt(opt.rankUnderOffsetY, 1);
    const textColor = String(opt.rankColor || "rgba(14,20,15,0.96)");
    const underColor = String(opt.rankUnderColor || "rgba(200,214,194,0.94)");
    const metrics = UiText.measure(label, { scale, letterSpacing });
    const width = Number(metrics?.width) || 0;
    const height = Number(metrics?.height) || 0;
    const drawX = Math.round(x + size - width - insetX);
    const drawY = Math.round(y + size - height - insetY);

    UiText.draw(ctx, label, drawX + underOffsetX, drawY + underOffsetY, {
      scale,
      letterSpacing,
      color: underColor,
    });
    UiText.draw(ctx, label, drawX, drawY, {
      scale,
      letterSpacing,
      color: textColor,
    });
    return true;
  }

  function drawItemIcon(ctx, sprite, x, y, iconSize, opt = {}){
    return drawSpriteIcon(ctx, sprite, x, y, iconSize, opt);
  }

  function drawItemIconWithRank(ctx, sprite, x, y, iconSize, rank, opt = {}){
    const drawn = drawSpriteIcon(ctx, sprite, x, y, iconSize, opt);
    if(!drawn) return false;
    drawRankLabel(ctx, rank, x, y, iconSize, opt);
    return true;
  }

  // Backward-compatible aliases while the UI migrates to the shared API names.
  const getRankText = rankToLabel;
  const drawRankBadge = drawRankLabel;
  const drawIconWithRank = drawItemIconWithRank;

  const api = {
    rankToLabel,
    drawRankLabel,
    drawItemIcon,
    drawItemIconWithRank,
    normalizeRank,
    getRankText,
    drawSpriteIcon,
    drawRankBadge,
    drawIconWithRank,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonItemIconRenderer = Object.freeze(api);
})();
