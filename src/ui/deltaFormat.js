(() => {
  "use strict";

  const DELTA_SYMBOLS = Object.freeze({
    increase_small: "+",
    increase_mid: "++",
    increase_large: "+++",
    decrease_small: "-",
    decrease_mid: "--",
    decrease_large: "---",
    neutral: "0",
  });

  const DEFAULT_MID_THRESHOLD = 2;
  const DEFAULT_LARGE_THRESHOLD = 3;

  function toNumber(value, fallback = 0){
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function roundToDisplay(value){
    return Math.round(toNumber(value, 0) * 10) / 10;
  }

  function formatNumber(value){
    const rounded = roundToDisplay(value);
    const integer = Math.round(rounded);
    if(Math.abs(rounded - integer) < 0.001){
      return String(integer);
    }
    return rounded.toFixed(1).replace(/\.0$/, "");
  }

  function getDeltaSymbol(value, opt = {}){
    const num = toNumber(value, 0);
    const midThreshold = Math.max(0.1, toNumber(opt.midThreshold, DEFAULT_MID_THRESHOLD));
    const largeThreshold = Math.max(midThreshold, toNumber(opt.largeThreshold, DEFAULT_LARGE_THRESHOLD));

    if(num >= largeThreshold) return DELTA_SYMBOLS.increase_large;
    if(num >= midThreshold) return DELTA_SYMBOLS.increase_mid;
    if(num > 0) return DELTA_SYMBOLS.increase_small;
    if(num <= -largeThreshold) return DELTA_SYMBOLS.decrease_large;
    if(num <= -midThreshold) return DELTA_SYMBOLS.decrease_mid;
    if(num < 0) return DELTA_SYMBOLS.decrease_small;
    return DELTA_SYMBOLS.neutral;
  }

  function formatDeltaValue(value){
    const num = roundToDisplay(value);
    if(num > 0){
      return `+${formatNumber(num)}`;
    }
    if(num < 0){
      return formatNumber(num);
    }
    return DELTA_SYMBOLS.neutral;
  }

  const api = {
    SYMBOLS: DELTA_SYMBOLS,
    DEFAULT_MID_THRESHOLD,
    DEFAULT_LARGE_THRESHOLD,
    getDeltaSymbol,
    formatDeltaValue,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonDeltaFormat = Object.freeze(api);
})();
