(() => {
  "use strict";

  function clampDuty(duty){
    const value = Number(duty);
    if(!Number.isFinite(value)) return 0.5;
    if(value <= 0) return 0;
    if(value >= 1) return 1;
    return value;
  }

  function toPositiveNumber(value, fallback){
    const num = Number(value);
    if(!Number.isFinite(num) || num <= 0) return fallback;
    return num;
  }

  function isBlinkOn(nowMs, periodMs = 500, duty = 0.5){
    const period = toPositiveNumber(periodMs, 500);
    const ratio = clampDuty(duty);
    const now = Number(nowMs);
    if(!Number.isFinite(now)) return true;
    const phase = ((now % period) + period) % period;
    return phase < (period * ratio);
  }

  function shouldShowCursor(nowMs, flashUntilMs){
    const now = Number(nowMs);
    const flashUntil = Number(flashUntilMs);
    if(Number.isFinite(now) && Number.isFinite(flashUntil) && now < flashUntil){
      return true;
    }
    return isBlinkOn(nowMs);
  }

  function onCursorMoved(nowMs, flashMs = 120){
    const now = Number(nowMs);
    const flash = toPositiveNumber(flashMs, 120);
    const base = Number.isFinite(now) ? now : 0;
    return base + flash;
  }

  const api = {
    isBlinkOn,
    shouldShowCursor,
    onCursorMoved,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonUiCursor = Object.freeze(api);
})();
