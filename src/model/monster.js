(() => {
  "use strict";

  const SpriteSpec = window.DotmonSpriteSpec;
  const SpriteCodec = window.DotmonSpriteCodec;
  if(!SpriteSpec || !SpriteCodec){
    throw new Error("DotmonSpriteSpec and DotmonSpriteCodec are required before DotmonMonsterModel.");
  }

  const SPRITE_W = Number(SpriteSpec.SPRITE_W);
  const SPRITE_H = Number(SpriteSpec.SPRITE_H);
  const SPRITE_SIZE = SPRITE_W;
  const DEFAULT_MONSTER_ID = "mon001";
  const DEFAULT_MODE = "IDLE";
  const decodeSprite = SpriteCodec.decodeSprite;

  function isRecord(value){
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
  }

  function makeEmptySprite16(){
    return Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill(0));
  }

  function cloneSprite16(sprite){
    return sprite.map((row) => row.slice());
  }

  function isValidSprite16(sprite){
    if(!Array.isArray(sprite) || sprite.length !== SPRITE_H) return false;
    for(let y = 0; y < SPRITE_H; y++){
      const row = sprite[y];
      if(!Array.isArray(row) || row.length !== SPRITE_W) return false;
      for(let x = 0; x < SPRITE_W; x++){
        const pix = row[x];
        if(pix !== 0 && pix !== 1) return false;
      }
    }
    return true;
  }

  function normalizeSprite16(input, fallbackSprite = null){
    const fallback = cloneSprite16(fallbackSprite || makeEmptySprite16());
    if(!Array.isArray(input) || input.length !== SPRITE_H) return fallback;

    const decoded = decodeSprite(input);
    if(decoded) return decoded;

    const out = makeEmptySprite16();
    for(let y = 0; y < SPRITE_H; y++){
      const row = input[y];

      if(Array.isArray(row) && row.length === SPRITE_W){
        for(let x = 0; x < SPRITE_W; x++){
          const n = Number(row[x]);
          out[y][x] = Number.isFinite(n) && n > 0 ? 1 : 0;
        }
        continue;
      }

      return fallback;
    }
    return out;
  }

  function toNumber(value, fallback){
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function toPositiveNumber(value, fallback){
    const n = Number(value);
    if(!Number.isFinite(n) || n <= 0) return fallback;
    return n;
  }

  function toNonNegativeNumber(value, fallback){
    const n = Number(value);
    if(!Number.isFinite(n) || n < 0) return fallback;
    return n;
  }

  function toStringValue(value, fallback){
    if(typeof value !== "string") return fallback;
    const s = value.trim();
    return s.length > 0 ? s : fallback;
  }

  function toStageValue(value, fallback){
    if(typeof value === "string"){
      const s = value.trim();
      if(s.length === 0) return fallback;
      const asNum = Number(s);
      return Number.isFinite(asNum) ? asNum : s;
    }
    if(Number.isFinite(value)) return value;
    return fallback;
  }

  function toFaceOrActionId(value, fallback){
    if(typeof value === "string"){
      const s = value.trim();
      return s.length > 0 ? s : fallback;
    }
    if(Number.isFinite(value)) return value;
    return fallback;
  }

  function normalizeSpriteSet(input, fallback){
    const src = isRecord(input) ? input : {};
    const normalized = {
      base: normalizeSprite16(src.base, fallback.base),
      faces: [],
      actions: [],
      icons: [],
    };

    const srcFaces = Array.isArray(src.faces) ? src.faces : [];
    normalized.faces = srcFaces
      .slice(0, 256)
      .map((sprite) => normalizeSprite16(sprite, makeEmptySprite16()));

    const srcActions = Array.isArray(src.actions) ? src.actions : [];
    normalized.actions = srcActions
      .slice(0, 128)
      .map((frames) => {
        if(!Array.isArray(frames)) return [];
        return frames
          .slice(0, 256)
          .map((sprite) => normalizeSprite16(sprite, makeEmptySprite16()));
      });

    const srcIcons = Array.isArray(src.icons) ? src.icons : [];
    normalized.icons = srcIcons
      .slice(0, 256)
      .map((sprite) => normalizeSprite16(sprite, makeEmptySprite16()));

    return normalized;
  }

  function createDefaultMonster(id = DEFAULT_MONSTER_ID){
    const safeId = toStringValue(id, DEFAULT_MONSTER_ID);
    const stats = {
      maxHp: 100,
      attack: 10,
      defence: 10,
      speed: 10,
      staminaMax: 100,
    };

    return {
      id: safeId,
      age: 0,
      weight: 0,
      stage: 1,
      spriteSet: {
        base: makeEmptySprite16(),
        faces: [],
        actions: [],
        icons: [],
      },
      stats,
      personality: {
        aggression: 0,
        curiosity: 0,
        calmness: 0,
      },
      runtimeState: {
        hp: stats.maxHp,
        stamina: stats.staminaMax,
        mode: DEFAULT_MODE,
        faceId: 0,
        actionId: null,
        actionFrame: 0,
        actionTimer: 0,
        mood: null,
      },
    };
  }

  function normalizeMonster(input){
    const fallbackId = isRecord(input) ? toStringValue(input.id, DEFAULT_MONSTER_ID) : DEFAULT_MONSTER_ID;
    const base = createDefaultMonster(fallbackId);
    if(!isRecord(input)) return base;

    const normalized = createDefaultMonster(toStringValue(input.id, base.id));
    normalized.age = toNumber(input.age, base.age);
    normalized.weight = toNumber(input.weight, base.weight);
    normalized.stage = toStageValue(input.stage, base.stage);

    const legacyBaseSprite = input.monSprite ?? input.sprite ?? null;
    const spriteSetInput = isRecord(input.spriteSet)
      ? input.spriteSet
      : (legacyBaseSprite ? { base: legacyBaseSprite } : {});
    normalized.spriteSet = normalizeSpriteSet(spriteSetInput, base.spriteSet);

    const statsInput = isRecord(input.stats) ? input.stats : {};
    normalized.stats.maxHp = toPositiveNumber(statsInput.maxHp ?? input.maxHp, base.stats.maxHp);
    normalized.stats.attack = toNumber(statsInput.attack ?? input.attack, base.stats.attack);
    normalized.stats.defence = toNumber(statsInput.defence ?? input.defence, base.stats.defence);
    normalized.stats.speed = toNumber(statsInput.speed ?? input.speed, base.stats.speed);
    normalized.stats.staminaMax = toPositiveNumber(statsInput.staminaMax ?? input.staminaMax, base.stats.staminaMax);

    const personalityInput = isRecord(input.personality) ? input.personality : {};
    normalized.personality.aggression = toNumber(personalityInput.aggression, base.personality.aggression);
    normalized.personality.curiosity = toNumber(personalityInput.curiosity, base.personality.curiosity);
    normalized.personality.calmness = toNumber(personalityInput.calmness, base.personality.calmness);

    const runtimeInput = isRecord(input.runtimeState) ? input.runtimeState : {};
    normalized.runtimeState.mode = toStringValue(runtimeInput.mode ?? input.mode, base.runtimeState.mode);
    normalized.runtimeState.faceId = toFaceOrActionId(runtimeInput.faceId ?? input.faceId, base.runtimeState.faceId);
    normalized.runtimeState.actionId = (runtimeInput.actionId ?? input.actionId) == null
      ? null
      : toFaceOrActionId(runtimeInput.actionId ?? input.actionId, null);
    normalized.runtimeState.actionFrame = toNonNegativeNumber(runtimeInput.actionFrame, base.runtimeState.actionFrame);
    normalized.runtimeState.actionTimer = toNonNegativeNumber(runtimeInput.actionTimer, base.runtimeState.actionTimer);
    normalized.runtimeState.mood = runtimeInput.mood == null ? null : String(runtimeInput.mood);

    const hpRaw = runtimeInput.hp ?? input.hp ?? normalized.stats.maxHp;
    const staminaRaw = runtimeInput.stamina ?? input.stamina ?? normalized.stats.staminaMax;
    normalized.runtimeState.hp = clamp(toNumber(hpRaw, normalized.stats.maxHp), 0, normalized.stats.maxHp);
    normalized.runtimeState.stamina = clamp(toNumber(staminaRaw, normalized.stats.staminaMax), 0, normalized.stats.staminaMax);

    return normalized;
  }

  function validateMonster(monster){
    const errors = [];
    if(!isRecord(monster)){
      errors.push("monster must be an object");
      return errors;
    }

    if(!isRecord(monster.stats)){
      errors.push("stats is missing");
      monster.stats = createDefaultMonster(monster.id).stats;
    }
    monster.stats.maxHp = toPositiveNumber(monster.stats.maxHp, 100);
    monster.stats.staminaMax = toPositiveNumber(monster.stats.staminaMax, 100);

    if(!isRecord(monster.runtimeState)){
      errors.push("runtimeState is missing");
      monster.runtimeState = createDefaultMonster(monster.id).runtimeState;
    }
    monster.runtimeState.hp = clamp(toNumber(monster.runtimeState.hp, monster.stats.maxHp), 0, monster.stats.maxHp);
    monster.runtimeState.stamina = clamp(
      toNumber(monster.runtimeState.stamina, monster.stats.staminaMax),
      0,
      monster.stats.staminaMax
    );

    if(!isRecord(monster.spriteSet)){
      errors.push("spriteSet is missing");
      monster.spriteSet = createDefaultMonster(monster.id).spriteSet;
    }
    const spriteBefore = monster.spriteSet.base;
    monster.spriteSet.base = normalizeSprite16(spriteBefore, makeEmptySprite16());
    if(!isValidSprite16(monster.spriteSet.base)){
      errors.push("spriteSet.base is invalid");
      monster.spriteSet.base = makeEmptySprite16();
    }

    return errors;
  }

  const api = {
    SPRITE_SIZE,
    makeEmptySprite16,
    createDefaultMonster,
    normalizeMonster,
    validateMonster,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonMonsterModel = Object.freeze(api);
})();
