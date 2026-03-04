(() => {
  "use strict";

  const SpriteSpec = window.DotmonSpriteSpec;
  if(!SpriteSpec){
    throw new Error("DotmonSpriteSpec is required before DotmonRuntime.");
  }

  const SPRITE_W = Number(SpriteSpec.SPRITE_W);
  const SPRITE_H = Number(SpriteSpec.SPRITE_H);
  const DEFAULT_MODE = "IDLE";

  function isRecord(value){
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isSprite16(sprite){
    if(!Array.isArray(sprite) || sprite.length !== SPRITE_H) return false;
    return sprite.every((row) => Array.isArray(row) && row.length === SPRITE_W);
  }

  function cloneSprite16(sprite){
    return sprite.map((row) => row.map((cell) => (Number(cell) > 0 ? 1 : 0)));
  }

  function makeEmptySprite16(){
    return Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill(0));
  }

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function toFiniteNumber(value, fallback){
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function toIndex(value, fallback = 0){
    const num = Number(value);
    if(!Number.isFinite(num)) return fallback;
    return Math.max(0, Math.floor(num));
  }

  function resolveActionSprite(spriteSet, runtimeState){
    const actions = Array.isArray(spriteSet.actions) ? spriteSet.actions : [];
    const actionIdRaw = runtimeState.actionId;
    const actionFrame = toIndex(runtimeState.actionFrame, 0);

    const action = {
      id: actionIdRaw ?? null,
      frame: actionFrame,
      sprite: null,
    };

    const actionIdNum = Number(actionIdRaw);
    if(!Number.isInteger(actionIdNum) || actionIdNum < 0 || actionIdNum >= actions.length) return action;
    const frames = actions[actionIdNum];
    if(!Array.isArray(frames) || frames.length <= 0) return action;

    const frameIndex = actionFrame % frames.length;
    const sprite = frames[frameIndex];
    if(isSprite16(sprite)){
      action.sprite = cloneSprite16(sprite);
    }
    return action;
  }

  function getView(monster){
    const fallback = makeEmptySprite16();
    const spriteSet = isRecord(monster?.spriteSet) ? monster.spriteSet : {};
    const runtimeState = isRecord(monster?.runtimeState) ? monster.runtimeState : {};
    const stats = isRecord(monster?.stats) ? monster.stats : {};

    const baseSprite = isSprite16(spriteSet.base) ? cloneSprite16(spriteSet.base) : fallback;

    let faceSprite = null;
    const faces = Array.isArray(spriteSet.faces) ? spriteSet.faces : [];
    const faceIndex = toIndex(runtimeState.faceId, 0);
    if(faceIndex < faces.length && isSprite16(faces[faceIndex])){
      faceSprite = cloneSprite16(faces[faceIndex]);
    }

    const action = resolveActionSprite(spriteSet, runtimeState);
    const maxHp = Math.max(1, toFiniteNumber(stats.maxHp, 100));
    const staminaMax = Math.max(1, toFiniteNumber(stats.staminaMax, 100));
    const hp = clamp(toFiniteNumber(runtimeState.hp, maxHp), 0, maxHp);
    const stamina = clamp(toFiniteNumber(runtimeState.stamina, staminaMax), 0, staminaMax);
    const mode = (typeof runtimeState.mode === "string" && runtimeState.mode.length > 0)
      ? runtimeState.mode
      : DEFAULT_MODE;

    return {
      baseSprite,
      faceSprite,
      action,
      hp,
      stamina,
      mode,
    };
  }

  function update(monster, dtSec){
    // dtSec: elapsed seconds from previous frame (e.g. 0.016)
    void monster;
    void dtSec;
  }

  function setMode(monster, mode){
    if(!isRecord(monster)) return false;
    if(!isRecord(monster.runtimeState)) monster.runtimeState = {};

    const nextMode = (typeof mode === "string" && mode.trim().length > 0)
      ? mode
      : DEFAULT_MODE;
    if(monster.runtimeState.mode === nextMode) return false;
    monster.runtimeState.mode = nextMode;
    return true;
  }

  const api = {
    getView,
    update,
    setMode,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonRuntime = Object.freeze(api);
})();
