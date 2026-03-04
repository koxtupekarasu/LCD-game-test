(() => {
  "use strict";

  const SpriteSpec = window.DotmonSpriteSpec;
  if(!SpriteSpec){
    throw new Error("DotmonSpriteSpec is required before DotmonEditorAdapter.");
  }

  const SPRITE_W = Number(SpriteSpec.SPRITE_W);
  const SPRITE_H = Number(SpriteSpec.SPRITE_H);

  function isRecord(value){
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function makeEmptySprite16(){
    return Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill(0));
  }

  function isSprite16(sprite){
    if(!Array.isArray(sprite) || sprite.length !== SPRITE_H) return false;
    return sprite.every((row) => Array.isArray(row) && row.length === SPRITE_W);
  }

  function cloneSprite16(sprite){
    return sprite.map((row) => row.map((cell) => (Number(cell) > 0 ? 1 : 0)));
  }

  function normalizeSprite16(sprite){
    if(!isSprite16(sprite)) return makeEmptySprite16();
    return cloneSprite16(sprite);
  }

  function ensureSpriteSet(monster){
    if(!isRecord(monster.spriteSet)) monster.spriteSet = {};
    if(!isSprite16(monster.spriteSet.base)){
      monster.spriteSet.base = makeEmptySprite16();
    }else{
      monster.spriteSet.base = normalizeSprite16(monster.spriteSet.base);
    }
    if(!Array.isArray(monster.spriteSet.faces)) monster.spriteSet.faces = [];
    if(!Array.isArray(monster.spriteSet.actions)) monster.spriteSet.actions = [];
    if(!Array.isArray(monster.spriteSet.icons)) monster.spriteSet.icons = [];
  }

  function ensureRuntimeState(monster){
    if(!isRecord(monster.runtimeState)) monster.runtimeState = {};
    if(!Number.isFinite(Number(monster.runtimeState.faceId))){
      monster.runtimeState.faceId = 0;
    }
  }

  function ensureIndexedSprite(list, index){
    while(list.length <= index){
      list.push(makeEmptySprite16());
    }
    if(!isSprite16(list[index])){
      list[index] = makeEmptySprite16();
    }
    return list[index];
  }

  function ensureActionFrame(actions, actionIndex, frameIndex){
    while(actions.length <= actionIndex){
      actions.push([]);
    }
    if(!Array.isArray(actions[actionIndex])){
      actions[actionIndex] = [];
    }
    return ensureIndexedSprite(actions[actionIndex], frameIndex);
  }

  function toIndex(value, fallback = 0){
    const num = Number(value);
    if(!Number.isFinite(num)) return fallback;
    return Math.max(0, Math.floor(num));
  }

  function getTarget(monster, category = "BASE", index = 0, frameIndex = 0){
    if(!isRecord(monster)) return makeEmptySprite16();
    ensureSpriteSet(monster);

    const cat = String(category || "BASE").toUpperCase();
    const idx = toIndex(index, 0);
    const frm = toIndex(frameIndex, 0);

    if(cat === "FACE"){
      return ensureIndexedSprite(monster.spriteSet.faces, idx);
    }
    if(cat === "ICON"){
      return ensureIndexedSprite(monster.spriteSet.icons, idx);
    }
    if(cat === "ACTION"){
      return ensureActionFrame(monster.spriteSet.actions, idx, frm);
    }
    return monster.spriteSet.base;
  }

  function applyPatch(monster, patch){
    if(!isRecord(monster) || !isRecord(patch)) return false;
    ensureSpriteSet(monster);
    ensureRuntimeState(monster);

    const type = String(patch.type || "").toUpperCase();

    if(type === "SET_BASE_SPRITE"){
      const sprite = normalizeSprite16(patch.sprite);
      monster.spriteSet.base = sprite;

      // TODO(step2): temporary behavior to keep existing editor flow.
      // Base edit is mirrored to faces[0] until face-slot editing is fully routed.
      if(monster.spriteSet.faces.length === 0){
        monster.spriteSet.faces.push(cloneSprite16(sprite));
      }else{
        monster.spriteSet.faces[0] = cloneSprite16(sprite);
      }
      monster.runtimeState.faceId = 0;
      return true;
    }

    if(type === "PIXEL_SET"){
      const target = patch.target || {};
      const sprite = getTarget(monster, target.category, target.index, target.frameIndex);
      const x = toIndex(patch.x, -1);
      const y = toIndex(patch.y, -1);
      if(x < 0 || y < 0 || x >= SPRITE_W || y >= SPRITE_H) return false;
      sprite[y][x] = Number(patch.value) > 0 ? 1 : 0;
      return true;
    }

    return false;
  }

  const api = {
    applyPatch,
    getTarget,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonEditorAdapter = Object.freeze(api);
})();
