// app.js
(() => {
  "use strict";

  // ====== Config ======
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d", { alpha: false });

  // ====== Logical Resolution (BASE) ======
  const BASE_W = 384;
  const BASE_H = 288;
  const W = BASE_W;
  const H = BASE_H;

  const SpriteSpecModule = window.DotmonSpriteSpec;
  const SpriteCodecModule = window.DotmonSpriteCodec;
  const SaveMigratorAPI = window.DotmonSaveMigrator;
  const BitmapFontSpecModule = window.DotmonBitmapFontSpec;
  const UiTextAPI = window.DotmonUiText;
  const UiCursorAPI = window.DotmonUiCursor;
  const I18nAPI = window.DotmonI18n;
  const SPRITE_W = Number(SpriteSpecModule?.SPRITE_W);
  const SPRITE_H = Number(SpriteSpecModule?.SPRITE_H);
  const BITMAP_GLYPH_H = Number(BitmapFontSpecModule?.GLYPH_H);
  const SPRITE_SIZE = SPRITE_W;
  const DEFAULT_TEXT_SCALE = 2;
  const DOT_SCALE = 4;
  const SPRITE_STORAGE_KEY = "dotmon_sprite_v3";
  const MONSTER_STORAGE_KEY = "dotmon_monster_v1";
  const SAVE_SCHEMA_VERSION = Number(SaveMigratorAPI?.CURRENT_SAVE_VERSION);
  const DEBUG_MENU = true;
  const MENU_IDLE_ALPHA = 0.16;
  const MENU_FADE_SPEED = 0.22;
  const MENU_BASELINE_ALPHA = 0.32;
  const MENU_BASELINE_GAP_PX = 2;
  const TOP_MENU_CURSOR_SAFE_INSET_PX = 10;
  const BOTTOM_MENU_Y_OFFSET = 12;
  const CURSOR_GAP = 2;
  const DIFF_PAGE_SIZE = 12;
  const DIFF_GRID_COLS = 3;
  const DIFF_GRID_ROWS = 4;
  const DIFF_CATEGORIES = ["FACE", "ACTION", "ICON"];
  const EDITOR_MODE = {
    BROWSE: "browse",
    EDIT: "edit",
    SELECT: "select",
    PASTE: "paste",
  };
  const C_LONGPRESS_MS = 500;
  const DIR_REPEAT_DELAY_MS = 450;
  const DIR_REPEAT_INTERVAL_MS = 45;
  const HUNGER_IS_FULLNESS = true;
  const SLEEP_STAMINA_GAIN_RATE = 0.35;
  const SLEEP_HUNGER_DELTA = 2;
  const SLEEP_STABILITY_GAIN_RATE = 0.10;
  const SLEEP_STABILITY_GAIN_CAP = 2;
  const HEAL_COST_STAMINA = 2;
  const HEAL_HP_BASE = 2;
  const HEAL_HP_GAIN_RATE = 0.25;
  const HEAL_DAMAGE_HEAL = 1;
  const DEV_ALLOW_ACTIONS_DURING_SLEEP = true;
  const TRN_MODE_SCREEN = "trnmode";
  const TRN_SCREEN = "trn";
  const TRN_LOG_SCREEN = "trnlog";
  const BTTL_LOG_SCREEN = "bttllog";
  const TRN_MAX_MS = 9500;
  const TRN_MIN_BAND_R_RATIO = 0.30;
  const TRN_MAX_BAND_R_RATIO = 0.82;
  const TRN_PLAY_RING_SAFE_MARGIN_PX = 3;
  const TRN_BAND_HIT_FLASH_MS = 180;
  const TRN_CRIT_HIT_FLASH_MS = 210;
  const TRN_BAND_PULSE_RADIUS_MAX_PX = 12;
  const TRN_CRIT_PULSE_RADIUS_MAX_PX = 15;
  const TRN_OK_CENTER_FLASH_MS = 180;
  const TRN_SUCCESS_CENTER_FLASH_MS = 240;
  const TRN_SUCCESS_OUTER_RIPPLE_MS = 320;
  const TRN_SUCCESS_OUTER_RIPPLE_DELTA_PX = 8;
  const TRN_BAND_BREATH_HZ = 2.4;
  const TRN_BAND_BREATH_ALPHA_BOOST = 0.14;
  const TRN_BAD_SHAKE_MS = 120;
  const TRN_BAD_GHOST_ALPHA = 0.35;
  const TRN_BAD_GHOST_MS = 60;
  const TRN_RIGHT_FB_BOX_H = 84; // leaves headroom for one extra line in future
  const TRN_RIGHT_FB_PAD_X = 3;
  const TRN_RIGHT_FB_PAD_TOP = 8;
  const TRN_RIGHT_FB_LINE_GAP = 16;
  const TRN_RIGHT_FB_HEADER_GAP = 4;
  const TRN_RIGHT_TEXT_COLOR = "rgba(14,20,15,1.00)";
  const TRN_RIGHT_FB_FILL = "rgba(200,214,194,0.16)";
  const TRN_RIGHT_FB_DIVIDER = "rgba(14,20,15,0.26)";
  const TRN_RIGHT_TEXT_PRESETS = Object.freeze({
    trnFeedbackNumbers: Object.freeze({
      scale: 2,
      color: "rgba(14,20,15,1.00)",
      edgeColor: "rgba(14,20,15,0.84)",
      edgeOffsetX: 1,
    }),
  });
  const TRN_MODE_FB_LINES = Object.freeze({
    // Internal normalized model: { stat, dir, level }, level is clamped to 1..3.
    calib: Object.freeze([
      Object.freeze({ stat: "SIG", dir: +1, level: 2 }),
      Object.freeze({ stat: "STA", dir: -1, level: 2 }),
    ]),
    boost: Object.freeze([
      Object.freeze({ stat: "SIG", dir: +1, level: 3 }),
      Object.freeze({ stat: "STA", dir: -1, level: 3 }),
    ]),
    noise: Object.freeze([
      Object.freeze({ stat: "STB", dir: +1, level: 2 }),
      Object.freeze({ stat: "STA", dir: -1, level: 3 }),
    ]),
  });
  const TRN_MODE_FB_DEBUG_FALLBACK = Object.freeze(["SIG +", "STA -"]);
  const TRN_MODE_FB_NO_STA_LINES = Object.freeze(["NO STA", "NO STA"]);
  const TRN_RESULT_SUMMARY_STAMINA_EMPTY = "ENERGY EMPTY. REST.";
  const BTTL_STATE = Object.freeze({
    INIT: "INIT",
    PLAYER_WINDOW: "PLAYER_WINDOW",
    TURN: "TURN",
    CHECK: "CHECK",
    RESULT: "RESULT",
  });
  const BTTL_RIGHTPANE_MODE = Object.freeze({
    LOG: "log",
    SIGNAL_MENU: "signal_menu",
    SIGNAL_GAME: "signal_game",
  });
  const BTTL_INIT_MS = 420;
  const BTTL_ACTION_POST_RESOLVE_MS = 90;
  const BTTL_PROJECTILE_SPEED = 88;
  const BTTL_PROJECTILE_SPEED_DEBUG = 88;
  const BTTL_PROJECTILE_MISS_EXTRA_PX = 24;
  const BTTL_PROJECTILE_HIT_WINDOW_RATIO = 0.16;
  const BTTL_PROJECTILE_SIZE = 30;
  const BTTL_PROJECTILE_PIXEL_GRID = 16;
  const BTTL_PROJECTILE_ROUND_PASSES = 2;
  const BTTL_PROJECTILE_COLOR = "rgba(14,20,15,0.95)";
  const BTTL_HIT_FLASH_MS = 120;
  const BTTL_KNOCK_MS = 90;
  const BTTL_LOG_KEEP_MAX = 24;
  const BTTL_LOG_DRAW_LINES = 10;
  const BTTL_MAX_TURNS = 24;
  const BTTL_DEBUG_SHOW_RING_POINTS = false;
  const BTTL_DEBUG_SLOW_PROJECTILES = false;
  const BTTL_DEBUG_RING_STEP_PX = 14;
  const BTTL_DEBUG_ENEMY_HP_LOCK = false;
  const BTTL_HIT_BASE = 0.38;
  const BTTL_HIT_SIG_WEIGHT = 0.42;
  const BTTL_HIT_SYNC_WEIGHT = 0.12;
  const BTTL_HIT_MIN = 0.08;
  const BTTL_HIT_MAX = 0.95;
  const BTTL_ENEMY_SIG = 46;
  const BTTL_ENEMY_SYNC = 38;
  const BTTL_ENEMY_HP_RATIO = 0.45;
  const BTTL_ENEMY_HP_MIN = 3;
  const BTTL_ENEMY_HP_MAX = 50;
  const BTTL_SIGNAL_GAME_RESULT_HOLD_MS = 240;
  const BTTL_SIGNAL_GAME_MAX_MS = 4200;
  const BTTL_SIGNAL_MENU_ITEMS = Object.freeze([
    Object.freeze({ id: "boost", label: "BOOST" }),
    Object.freeze({ id: "stabilize", label: "STABILIZE" }),
    Object.freeze({ id: "calibrate", label: "CALIBRATE" }),
  ]);
  const BTTL_SIGNAL_CMD_TO_TRN_MODE = Object.freeze({
    boost: "boost",
    stabilize: "noise",
    calibrate: "calib",
  });
  const BTTL_SIGNAL_CMD_LOG_LABEL = Object.freeze({
    boost: "BST",
    stabilize: "STB",
    calibrate: "CAL",
  });
  const BTTL_SIGNAL_HIT_BONUS_BY_TIER = Object.freeze({
    boost: Object.freeze([0, 0.04, 0.10, 0.16]),
    stabilize: Object.freeze([0, 0.05, 0.12, 0.18]),
    calibrate: Object.freeze([0, 0.03, 0.08, 0.14]),
  });
  const BTTL_SIGNAL_INTERVAL_MULT_BY_TIER = Object.freeze({
    boost: Object.freeze([1.14, 1.05, 0.95, 0.86]),
    stabilize: Object.freeze([1.10, 1.02, 0.95, 0.88]),
    calibrate: Object.freeze([1.12, 1.03, 0.96, 0.90]),
  });
  const BTTL_SIGNAL_GCD_MS = 600;
  const BTTL_SIGNAL_MODE_COOLDOWN_MS = Object.freeze({
    boost: 3400,
    stabilize: 2800,
    calibrate: 2400,
  });
  const BTTL_SIGNAL_PENDING_BLINK_MS = 520;
  const BTTL_SIGNAL_PROC_FLASH_MS = 1400;
  const BTTL_SIGNAL_COST_BY_CMD = Object.freeze({
    boost: 2,
    stabilize: 1,
    calibrate: 1,
  });
  const BTTL_ATTACK_INTERVAL_ALLY_BASE_MS = 2400;
  const BTTL_ATTACK_INTERVAL_ENEMY_BASE_MS = 2800;
  const BTTL_ATTACK_INTERVAL_MIN_MS = 1400;
  const BTTL_ATTACK_INTERVAL_MAX_MS = 4200;
  const BTTL_ATTACK_INTERVAL_SIG_SPEEDUP_MAX = 0.10;
  const BTTL_ATTACK_INTERVAL_SYNC_SPEEDUP_MAX = 0.06;
  const BTTL_ATTACK_INTERVAL_HP_PENALTY_MAX_ALLY = 0.30;
  const BTTL_ATTACK_INTERVAL_HP_PENALTY_MAX_ENEMY = 0.22;
  const BTTL_ENEMY_ACTION = Object.freeze({
    PRESS: "PRESS",
    STABLE: "STABLE",
    DEFEND: "DEFEND",
  });
  const BTTL_ENEMY_ACTION_INTERVAL_MULT = Object.freeze({
    PRESS: 0.88,
    STABLE: 1.00,
    DEFEND: 1.18,
  });
  const BTTL_ENEMY_DEFEND_DMG_MULT = 0.88;
  const BTTL_ENEMY_AI_RECENT_WINDOW = 8;
  const BTTL_ENEMY_AI_DECIDE_INTERVAL_MS = 260;
  const BTTL_ENEMY_AI_MIN_HOLD_MS = 2100;
  const BTTL_ENEMY_AI_SWITCH_COOLDOWN_MS = 1200;
  const BTTL_ENEMY_AI_AUDIT_LOG = false;
  const BTTL_RESULT_FLAVORS = Object.freeze({
    WIN: Object.freeze([
      "同調は安定した。対象を制圧。",
      "連結を維持。脅威を排除した。",
    ]),
    LOSE: Object.freeze([
      "信号が途切れた。再調整が必要だ。",
      "連結が崩れた。休息後に再試行。",
    ]),
  });
  const TRN_MODE_CURSOR_INSET_PX = 10;
  const TRN_RECENT_WINDOW_MS = 6 * 60 * 1000;
  const TRN_BAND_PENALTY_PER_RUN = 0.015;
  const TRN_BAND_PENALTY_MAX = 0.08;
  const TRN_BASE_NEAR_MARGIN = 5;
  const TRN_MODE_ORDER = Object.freeze(["calib", "boost", "noise"]);
  const TRN_MODE_LABELS = Object.freeze({
    calib: "CALIBRATION",
    boost: "BOOST SYNC",
    noise: "NOISE CUT",
  });
  const TRN_MODE_CONFIGS = Object.freeze({
    calib: Object.freeze({
      bpm: 100,
      bandWMin: 16,
      bandWMax: 30,
      critW: 5,
      nearMargin: 5,
      staminaCost: 2,
      cancelStaminaCost: 1,
      critChanceBase: 0.08,
      critChanceBySync: 0.18,
      critChanceMax: 0.34,
      baseSuccessBias: 0.08,
      signalDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 1,
        SUCCESS: 4,
        CRIT: 6,
      }),
      stabilityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 0,
        SUCCESS: 0,
        CRIT: 0,
      }),
    }),
    boost: Object.freeze({
      bpm: 120,
      bandWMin: 12,
      bandWMax: 22,
      critW: 4,
      nearMargin: 4,
      staminaCost: 3,
      cancelStaminaCost: 1,
      critChanceBase: 0.06,
      critChanceBySync: 0.14,
      critChanceMax: 0.26,
      baseSuccessBias: -0.10,
      signalDeltaByTier: Object.freeze({
        FAIL: -2,
        NEAR: -1,
        SUCCESS: 6,
        CRIT: 9,
      }),
      stabilityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 0,
        SUCCESS: 0,
        CRIT: 0,
      }),
    }),
    noise: Object.freeze({
      bpm: 110,
      bandWMin: 14,
      bandWMax: 26,
      critW: 5,
      nearMargin: 5,
      staminaCost: 2,
      cancelStaminaCost: 1,
      critChanceBase: 0.07,
      critChanceBySync: 0.16,
      critChanceMax: 0.30,
      baseSuccessBias: 0.03,
      signalDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 1,
        SUCCESS: 3,
        CRIT: 5,
      }),
      stabilityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 0,
        SUCCESS: 1,
        CRIT: 2,
      }),
    }),
  });
  const TRN_RESULT_LOG_FALLBACK = Object.freeze({
    calib: Object.freeze({
      fail: "信号が揺らぐ。同期が外れた",
      near: "位相は近い。調整は続く",
      success: "信号が澄む。同期した",
      crit: "同調が跳ねた。入力が冴えた",
    }),
    boost: Object.freeze({
      fail: "ノイズが走る。同期が乱れた",
      near: "同調は触れたが、届かない",
      success: "同調が跳ねた。同期を捉えた",
      crit: "出力が鋭い。完全同期を達成",
    }),
    noise: Object.freeze({
      fail: "除去は不発。変化なし",
      near: "ざらつきが薄い。あと一歩",
      success: "ノイズが退く。信号が整う",
      crit: "静寂が走る。位相が澄み切った",
    }),
  });
  const DETAIL_STORAGE_KEY = "dotmon_detail_v1";
  const DETAIL_STATE_VERSION = 1;
  const STAT_PAGE_COUNT = 2;
  const LAST_DELTA_NONE_TEXT = "なし";
  const SIGNAL_TREND_DIFF_THRESHOLD = 0.5;
  const AD_DECAY_PER_HOUR = 0.02;
  const SIGNAL_DECAY_PER_HOUR = 0.05;
  const SIGNAL_SLEEP_RECOVERY_PER_HOUR_FULL = 0.04;
  const SIGNAL_SLEEP_RECOVERY_PER_HOUR_HALF = 0.02;
  const DETERIORATION_MAX_DELTA_PER_UPDATE = 3;
  const CHRONOTYPE_WINDOWS = Object.freeze({
    morning: Object.freeze({ startMin: 21 * 60, endMin: 5 * 60 }),
    day: Object.freeze({ startMin: 0, endMin: 8 * 60 }),
    night: Object.freeze({ startMin: 4 * 60, endMin: 12 * 60 }),
  });
  const OVERLAY_LOG_RECT = Object.freeze({
    x: 34,
    y: 70,
    w: W - 68,
    h: 110,
  });
  const OVERLAY_BTTL_RESULT_RECT = Object.freeze({
    x: 24,
    y: 66,
    w: W - 48,
    h: 156,
  });
  const OVERLAY_STAT_RECT = Object.freeze({
    x: 24,
    y: 70,
    w: W - 48,
    h: 194,
  });
  const LOG_DEFAULT_NO_CHANGE_TEXT = "変化なし。";
  const LOG_NO_CHANGE_TEXT_BY_ACTION = Object.freeze({
    feed: "反応なし。",
    sleep: "変化なし。",
    heal: "効果なし。",
  });
  const LOG_STAT_SPECS = Object.freeze([
    Object.freeze({ key: "hunger", label: "充足値" }),
    Object.freeze({ key: "stamina", label: "スタミナ" }),
    Object.freeze({ key: "hp", label: "HP" }),
    Object.freeze({ key: "damage", label: "損傷", sign: -1 }),
    Object.freeze({ key: "stability", label: "安定度" }),
  ]);
  const DIFF_ROLE_TEMPLATES = {
    FACE: ["B", "E1", "E2", "E3", "M1", "M2", "M3", "R8", "R9", "R10", "R11", "R12"],
    ACTION: ["A1", "A2", "A3", "A4", "A5", "A6", "R7", "R8", "R9", "R10", "R11", "R12"],
    ICON: ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "R8", "R9", "R10", "R11", "R12"],
  };

  // UI
  const hudTitle = document.getElementById("hudTitle");
  const hudHint  = document.getElementById("hudHint");
  const hudClock = document.getElementById("hudClock");
  const uiClock  = document.getElementById("uiClock");
  const uiDay    = document.getElementById("uiDay");
  const overlayRoot = document.getElementById("overlayRoot");
  const overlayLog = document.getElementById("overlayLog");
  const overlayLogTitle = document.getElementById("overlayLogTitle");
  const overlayLogBody = document.getElementById("overlayLogBody");
  const overlayLogHint = document.getElementById("overlayLogHint");
  const uiState = {
    isLogOpen: false,
    overlayMode: null,
    statPage: 0,
    trnMode: TRN_MODE_ORDER[0],
    trnSession: null,
    trnResultBuffer: [],
    trnLastFeedback: null,
    trnOkCenterFlashUntilMs: 0,
    trnSuccessCenterFlashUntilMs: 0,
    trnSuccessOuterRippleUntilMs: 0,
    trnBadShakeUntilMs: 0,
    trnBadShakeDir: 0,
    trnRecentCount: 0,
    trnRecentWindowStartMs: 0,
  };

  // Buttons
  const btnA = document.getElementById("btnA");
  const btnB = document.getElementById("btnB");
  const btnC = document.getElementById("btnC");
  const btnUp = document.getElementById("btnUp");
  const btnDown = document.getElementById("btnDown");
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");

  ctx.imageSmoothingEnabled = false;

  // ====== HiDPI ======
  function resizeCanvasToHiDPI(){
    const dpr = Math.min(window.devicePixelRatio || 1, 4);
    canvas.width  = Math.floor(BASE_W * dpr);
    canvas.height = Math.floor(BASE_H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    document.documentElement.style.setProperty("--base-w", String(BASE_W));
    document.documentElement.style.setProperty("--base-h", String(BASE_H));
  }
  resizeCanvasToHiDPI();
  window.addEventListener("resize", resizeCanvasToHiDPI);

  // ====== Sprite helpers ======
  function spriteFromStrings(rows){
    return rows.map((r) => r.split("").map((c) => {
      const n = Number(c);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }));
  }
  function spriteToStrings(sprite){
    return encodeSprite(sprite);
  }
  function spriteTo01Array(sprite){
    return sprite.map(row => row.map(v => (v ? 1 : 0)));
  }
  function cloneSprite(sprite){
    return sprite.map(row => row.slice());
  }
  function makeEmptySprite(){
    return Array.from({length: SPRITE_H}, () => Array(SPRITE_W).fill(0));
  }
  function isSprite16(sprite){
    if(!Array.isArray(sprite) || sprite.length !== SPRITE_H) return false;
    return sprite.every((row) => Array.isArray(row) && row.length === SPRITE_W);
  }
  function isRecord(value){
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function log(level, tag, message, data = null){
    const time = new Date().toISOString();
    const line = `[${time}] [${tag}] ${message}`;
    if(level === "error"){
      if(data == null) console.error(line);
      else console.error(line, data);
      return;
    }
    if(level === "warn"){
      if(data == null) console.warn(line);
      else console.warn(line, data);
      return;
    }
    if(data == null) console.log(line);
    else console.log(line, data);
  }

  function t(key, params){
    if(!I18nAPI || typeof I18nAPI.t !== "function"){
      return `[${String(key ?? "")}]`;
    }
    return I18nAPI.t(key, params);
  }

  function setOverlayLogRect(rect = OVERLAY_LOG_RECT){
    if(!overlayRoot || !overlayLog || !canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const sx = bounds.width / W;
    const sy = bounds.height / H;
    overlayLog.style.left = `${Math.floor(rect.x * sx)}px`;
    overlayLog.style.top = `${Math.floor(rect.y * sy)}px`;
    overlayLog.style.width = `${Math.floor(rect.w * sx)}px`;
    overlayLog.style.height = `${Math.floor(rect.h * sy)}px`;
  }

  function setOverlayMode(mode){
    const nextMode = (mode === "log" || mode === "stat") ? mode : null;
    uiState.overlayMode = nextMode;
    uiState.isLogOpen = nextMode === "log";
  }

  function normalizeStatPage(value){
    const num = Math.floor(Number(value));
    if(!Number.isFinite(num)) return 0;
    const mod = num % STAT_PAGE_COUNT;
    return mod < 0 ? mod + STAT_PAGE_COUNT : mod;
  }

  function setStatPage(page){
    const next = normalizeStatPage(page);
    uiState.statPage = next;
    return next;
  }

  function normalizeTrnMode(value){
    const id = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(TRN_MODE_CONFIGS, id)
      ? id
      : TRN_MODE_ORDER[0];
  }

  function setTrnMode(mode){
    const next = normalizeTrnMode(mode);
    uiState.trnMode = next;
    return next;
  }

  function cycleTrnMode(delta){
    const current = setTrnMode(uiState.trnMode);
    const len = TRN_MODE_ORDER.length;
    const idx = TRN_MODE_ORDER.indexOf(current);
    const next = TRN_MODE_ORDER[(idx + delta + len) % len];
    return setTrnMode(next);
  }

  function getTrnModeConfig(mode){
    const id = normalizeTrnMode(mode);
    return TRN_MODE_CONFIGS[id] || TRN_MODE_CONFIGS[TRN_MODE_ORDER[0]];
  }

  function trnLoopMsFromBpm(bpm, fallbackMs = 375){
    const beatsPerMinute = Number(bpm);
    if(!Number.isFinite(beatsPerMinute) || beatsPerMinute <= 0){
      return Math.max(120, Math.floor(toNumber(fallbackMs, 375)));
    }
    return Math.max(120, Math.round(60000 / beatsPerMinute));
  }

  function getTrnLayout(){
    const frame = {
      x: 16,
      y: 28,
      w: W - 32,
      h: H - 44,
    };
    const left = {
      x: frame.x + 8,
      y: frame.y + 14,
      w: 236,
      h: frame.h - 24,
    };
    const right = {
      x: left.x + left.w + 8,
      y: left.y,
      w: frame.x + frame.w - (left.x + left.w + 8) - 8,
      h: left.h,
    };
    const minR = 12;
    const maxR = Math.max(minR + 8, Math.floor(Math.min(left.w, left.h) * 0.44));
    const ring = {
      minR,
      maxR,
      cx: left.x + Math.floor(left.w * 0.48),
      cy: left.y + Math.floor(left.h * 0.52),
    };
    return { frame, left, right, ring };
  }

  function getTrnPlayRingMetrics(){
    const layout = getTrnLayout();
    const left = layout.left;
    const innerPad = 4;
    const headerH = 22;
    const footerH = 24;
    const innerX = left.x + innerPad;
    const innerY = left.y + innerPad;
    const innerW = left.w - (innerPad * 2);
    const innerH = left.h - (innerPad * 2);
    const headerRect = {
      x: innerX + 2,
      y: innerY + 1,
      w: Math.max(8, innerW - 4),
      h: headerH,
    };
    const footerRect = {
      x: innerX + 2,
      y: innerY + innerH - footerH,
      w: Math.max(8, innerW - 4),
      h: footerH,
    };
    const playRect = {
      x: innerX,
      y: innerY + headerH,
      w: Math.max(12, innerW),
      h: Math.max(12, innerH - headerH - footerH),
    };
    const minR = 12;
    const maxR = Math.max(
      minR + 8,
      Math.floor((Math.min(playRect.w, playRect.h) / 2) - TRN_PLAY_RING_SAFE_MARGIN_PX)
    );
    return { headerRect, playRect, footerRect, minR, maxR };
  }

  function getTrnRightPaneRects(rightRect){
    const paneX = toNumber(rightRect?.x, 0);
    const paneY = toNumber(rightRect?.y, 0);
    const paneW = Math.max(0, toNumber(rightRect?.w, 0));
    const paneH = Math.max(0, toNumber(rightRect?.h, 0));
    const fbBoxH = Math.max(24, Math.floor(toNumber(TRN_RIGHT_FB_BOX_H, 84)));
    const fbRect = {
      x: paneX + 2,
      y: paneY + paneH - fbBoxH - 2,
      w: Math.max(10, paneW - 4),
      h: fbBoxH,
    };
    const spriteArea = {
      x: paneX,
      y: paneY,
      w: paneW,
      h: Math.max(8, paneH - fbBoxH - 4),
    };
    return { fbRect, spriteArea };
  }

  function drawTrnRightPaneFeedbackBox(fbRect){
    if(!fbRect) return;
    ctx.save();
    ctx.fillStyle = TRN_RIGHT_FB_FILL;
    ctx.fillRect(fbRect.x, fbRect.y, fbRect.w, fbRect.h);
    ctx.fillStyle = TRN_RIGHT_FB_DIVIDER;
    ctx.fillRect(fbRect.x, fbRect.y, fbRect.w, 1);
    ctx.restore();
  }

  function drawTrnRightPaneSprite(view, spriteArea){
    if(!spriteArea) return;
    const spritePx = SPRITE_SIZE * DOT_SCALE;
    const anim = getIdleMonsterAnim(state.t, view);
    const monX = spriteArea.x + Math.floor((spriteArea.w - spritePx) / 2) + anim.ox;
    const monY = spriteArea.y + Math.floor((spriteArea.h - spritePx) / 2) + anim.oy;
    drawSprite16x16(monX, monY, anim.sprite, DOT_SCALE);
  }

  function normalizeTrnMarkLevel(value){
    const num = Math.round(Number(value));
    if(!Number.isFinite(num)) return 1;
    return clamp(num, 1, 3);
  }

  function resolveTrnMarkChar(dir){
    const text = String(dir ?? "").trim();
    if(text.startsWith("-")) return "-";
    if(text.startsWith("+")) return "+";
    const num = Number(dir);
    if(Number.isFinite(num)){
      return num < 0 ? "-" : "+";
    }
    return null;
  }

  function buildTrnMarksFromLevel(dir, level){
    const markChar = resolveTrnMarkChar(dir);
    if(markChar == null) return "";
    return markChar.repeat(normalizeTrnMarkLevel(level));
  }

  function getTrnRightTextPreset(name){
    const key = String(name || "trnFeedbackNumbers");
    return TRN_RIGHT_TEXT_PRESETS[key] || TRN_RIGHT_TEXT_PRESETS.trnFeedbackNumbers;
  }

  function normalizeTrnModeStatMarks(line){
    if(isRecord(line)){
      const label = String(line.stat ?? line.label ?? "").trim().toUpperCase();
      if(!/^[A-Z]{3}$/.test(label)) return null;

      const marksText = String(line.marks ?? "").trim();
      const markMatch = marksText.match(/^([+\-]+)$/);
      let marks = "";
      if(markMatch){
        const markChar = markMatch[1][0];
        marks = markChar.repeat(normalizeTrnMarkLevel(markMatch[1].length));
      }else{
        marks = buildTrnMarksFromLevel(line.dir, line.level);
      }
      if(!/^[+\-]{1,3}$/.test(marks)) return null;
      return { label, marks };
    }

    const text = String(line || "").trim().toUpperCase();
    const matched = text.match(/^([A-Z]{3})([+\-]+)$/);
    if(!matched) return null;
    const markChar = matched[2][0];
    return {
      label: matched[1],
      marks: markChar.repeat(normalizeTrnMarkLevel(matched[2].length)),
    };
  }

  function getTrnModeFeedbackLines(modeId){
    const id = normalizeTrnMode(modeId);
    const sourceRows = TRN_MODE_FB_LINES[id];
    if(!Array.isArray(sourceRows) || sourceRows.length <= 0){
      return TRN_MODE_FB_DEBUG_FALLBACK;
    }
    const normalizedRows = sourceRows
      .map((line) => normalizeTrnModeStatMarks(line))
      .filter(Boolean)
      .slice(0, 2);
    if(normalizedRows.length > 0){
      return normalizedRows.map((row) => `${row.label} ${row.marks}`);
    }
    return TRN_MODE_FB_DEBUG_FALLBACK;
  }

  function parseTrnModeStatMarks(line){
    return normalizeTrnModeStatMarks(line);
  }

  function fitRepeatedMarkString(marks, maxWidth, drawOpt){
    const source = String(marks || "").trim();
    if(source.length <= 0) return "";
    const safeMaxWidth = Math.max(0, Math.floor(toNumber(maxWidth, 0)));
    if(safeMaxWidth <= 0) return "";
    if((Number(uiTextMeasure(source, drawOpt)?.width) || 0) <= safeMaxWidth){
      return source;
    }
    const markChar = source[0];
    if((markChar !== "+") && (markChar !== "-")){
      return fitTrnRightPaneText(source, safeMaxWidth, drawOpt);
    }
    let count = source.length;
    while(count > 1){
      const candidate = markChar.repeat(count);
      const candidateWidth = Number(uiTextMeasure(candidate, drawOpt)?.width) || 0;
      if(candidateWidth <= safeMaxWidth){
        return candidate;
      }
      count -= 1;
    }
    return markChar;
  }

  function fitTrnRightPaneText(text, maxWidth, drawOpt){
    const source = String(text ?? "").trim();
    if(source.length <= 0) return "";
    const safeMaxWidth = Math.max(0, Math.floor(toNumber(maxWidth, 0)));
    if(safeMaxWidth <= 0) return "";
    const sourceWidth = Number(uiTextMeasure(source, drawOpt)?.width) || 0;
    if(sourceWidth <= safeMaxWidth) return source;
    const ellipsis = "...";
    const ellipsisWidth = Number(uiTextMeasure(ellipsis, drawOpt)?.width) || 0;
    if(ellipsisWidth >= safeMaxWidth) return "";
    let sliced = source;
    while(sliced.length > 0){
      sliced = sliced.slice(0, -1);
      const candidate = `${sliced}${ellipsis}`;
      const candidateWidth = Number(uiTextMeasure(candidate, drawOpt)?.width) || 0;
      if(candidateWidth <= safeMaxWidth){
        return candidate;
      }
    }
    return "";
  }

  function drawTrnRightPaneFeedbackLines(fbRect, lines, options = {}){
    if(!fbRect || !Array.isArray(lines) || lines.length <= 0) return;
    const preset = getTrnRightTextPreset(options.preset);
    ctx.save();
    try{
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "source-over";
      // Keep caller transform/alpha so TRN shake and ghost passes also affect feedback text.

      const mainOpt = {
        scale: Math.max(1, Math.floor(toNumber(preset.scale, 2))),
        color: String(options.color || preset.color || TRN_RIGHT_TEXT_COLOR),
      };
      const edgeOpt = {
        scale: mainOpt.scale,
        color: String(options.edgeColor || preset.edgeColor || "rgba(14,20,15,0.84)"),
      };
      const edgeOffsetX = Math.max(0, Math.floor(toNumber(options.edgeOffsetX, preset.edgeOffsetX)));
      const emphasizeHeader = Boolean(options.emphasizeHeader);
      const align = String(options.align || "right").toLowerCase();
      const maxW = Math.max(0, fbRect.w - (TRN_RIGHT_FB_PAD_X * 2));
      const rightX = Math.round(fbRect.x + fbRect.w - TRN_RIGHT_FB_PAD_X);
      const leftX = Math.round(fbRect.x + TRN_RIGHT_FB_PAD_X);
      const lineStartY = Math.round(fbRect.y + TRN_RIGHT_FB_PAD_TOP);
      const statMarkColumns = Boolean(options.statMarkColumns);
      const parsedRows = statMarkColumns
        ? lines.map((line) => parseTrnModeStatMarks(line))
        : [];
      const useColumns = statMarkColumns && parsedRows.some(Boolean);
      const labelGapPx = 4;
      const labelWByRow = useColumns
        ? parsedRows.map((row) => {
          if(!row) return 0;
          return Number(uiTextMeasure(row.label, mainOpt)?.width) || 0;
        })
        : [];
      const labelColW = useColumns
        ? labelWByRow.reduce((max, w) => Math.max(max, w), 0)
        : 0;
      const marksMaxW = useColumns
        ? Math.max(0, maxW - labelColW - labelGapPx)
        : 0;
      for(let i = 0; i < lines.length; i++){
        const rawText = String(lines[i] || "").trim();
        if(rawText.length <= 0) continue;
        const drawOpt = mainOpt;
        const rowY = Math.round(i === 0
          ? lineStartY
          : lineStartY + TRN_RIGHT_FB_HEADER_GAP + (i * TRN_RIGHT_FB_LINE_GAP));
        if(useColumns && parsedRows[i]){
          const row = parsedRows[i];
          const label = fitTrnRightPaneText(row.label, labelColW, drawOpt);
          const marks = fitRepeatedMarkString(row.marks, marksMaxW, drawOpt);
          if(label.length > 0){
            const labelX = Math.round(leftX);
            drawText(labelX, rowY, label, drawOpt);
          }
          if(marks.length > 0){
            const marksW = Number(uiTextMeasure(marks, drawOpt)?.width) || 0;
            const marksX = Math.round(Math.max(leftX, rightX - Math.min(marksW, maxW)));
            drawText(marksX, rowY, marks, drawOpt);
          }
          continue;
        }
        const text = fitTrnRightPaneText(rawText, maxW, drawOpt);
        if(text.length <= 0) continue;
        const textW = Number(uiTextMeasure(text, drawOpt)?.width) || 0;
        const drawX = Math.round(align === "left"
          ? leftX
          : Math.max(leftX, rightX - Math.min(textW, maxW)));
        if(i === 0 && emphasizeHeader){
          drawText(drawX, rowY, text, mainOpt);
          drawText(Math.round(drawX + edgeOffsetX), rowY, text, edgeOpt);
        }else{
          drawText(drawX, rowY, text, mainOpt);
        }
      }
    }finally{
      ctx.restore();
    }
  }

  function getTrnRecentPenaltyRatio(nowMs = Date.now()){
    const startedAt = toNumber(uiState.trnRecentWindowStartMs, 0);
    const countNow = Math.max(0, Math.floor(toNumber(uiState.trnRecentCount, 0)));
    if(startedAt <= 0 || (nowMs - startedAt) > TRN_RECENT_WINDOW_MS){
      uiState.trnRecentWindowStartMs = nowMs;
      uiState.trnRecentCount = 0;
      return 0;
    }
    const penaltySteps = Math.max(0, countNow - 1);
    return clamp(penaltySteps * TRN_BAND_PENALTY_PER_RUN, 0, TRN_BAND_PENALTY_MAX);
  }

  function noteTrnRun(nowMs = Date.now()){
    const startedAt = toNumber(uiState.trnRecentWindowStartMs, 0);
    if(startedAt <= 0 || (nowMs - startedAt) > TRN_RECENT_WINDOW_MS){
      uiState.trnRecentWindowStartMs = nowMs;
      uiState.trnRecentCount = 1;
      return;
    }
    uiState.trnRecentCount = Math.max(0, Math.floor(toNumber(uiState.trnRecentCount, 0))) + 1;
  }

  function getTrnLoopPhase(session, nowMs = performance.now()){
    if(!session) return 0;
    const fallbackLoopMs = trnLoopMsFromBpm(getTrnModeConfig(session.mode)?.bpm, 375);
    const loopMs = Math.max(1, Math.floor(toNumber(session.loopMs, fallbackLoopMs)));
    const elapsed = Math.max(0, nowMs - toNumber(session.startedAtMs, nowMs));
    return (elapsed % loopMs) / loopMs;
  }

  function getTrnEasedProgress(phase01){
    const t = clamp(toNumber(phase01, 0), 0, 1);
    // Radar-like sweep: slow -> fast -> slow across the whole interval.
    return 0.5 - (0.5 * Math.cos(Math.PI * t));
  }

  function getTrnWaveStrokeStyle(){
    return {
      lineWidth: 2,
      color: "rgba(14,20,15,0.55)",
    }
  }

  function getTrnCurrentRadius(session, nowMs = performance.now()){
    if(!session) return 0;
    const ring = getTrnPlayRingMetrics();
    const phase = getTrnLoopPhase(session, nowMs);
    const eased = getTrnEasedProgress(phase);
    return ring.minR + (ring.maxR - ring.minR) * eased;
  }

  function getTrnInternalSuccessBase(mode){
    const cfg = getTrnModeConfig(mode);
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stabilityNow / stabilityMax : 0;

    const hungerMax = toPositiveInt(state.stats?.hungerMax, 10);
    const hungerNow = clamp(toNumber(state.stats?.hunger, hungerMax), 0, hungerMax);
    const hungerRatio = hungerMax > 0 ? hungerNow / hungerMax : 0;

    const staminaMax = getRuntimeMax("stamina", 100);
    const staminaNow = clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
    const staminaRatio = staminaMax > 0 ? staminaNow / staminaMax : 0;

    const base = 0.28 + (stabilityRatio * 0.34) + (staminaRatio * 0.26) + (hungerRatio * 0.12);
    return clamp(base + toNumber(cfg.baseSuccessBias, 0), 0.08, 0.95);
  }

  function drawDistortedRing(cx, cy, radius, amplitude, seed, lineWidth, strokeStyle){
    const steps = 72;
    ctx.save();
    ctx.beginPath();
    for(let i = 0; i <= steps; i++){
      const t = (i / steps) * Math.PI * 2;
      const wobble = (Math.sin((t * 4.0) + seed) + Math.sin((t * 7.0) - (seed * 1.3))) * 0.5;
      const rr = Math.max(1, radius + (wobble * amplitude));
      const x = cx + Math.cos(t) * rr;
      const y = cy + Math.sin(t) * rr;
      if(i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.restore();
  }

  function drawIdealRing(cx, cy, radius, width, color){
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
  }

  function drawTrnStopSuccessFx(nowMs, playRect, ringCx, ringCy, ringMinR, ringMaxR){
    const okCenterRemain = toNumber(uiState.trnOkCenterFlashUntilMs, 0) - nowMs;
    const successCenterRemain = toNumber(uiState.trnSuccessCenterFlashUntilMs, 0) - nowMs;
    const successOuterRippleRemain = toNumber(uiState.trnSuccessOuterRippleUntilMs, 0) - nowMs;
    const okCenterActive = okCenterRemain > 0;
    const successCenterActive = successCenterRemain > 0;
    const successOuterRippleActive = successOuterRippleRemain > 0;

    function drawRipple(baseR, remainMs, totalMs, deltaPx, alphaPeak, lineWidth){
      if(remainMs <= 0 || totalMs <= 0) return;
      const remain01 = clamp(remainMs / totalMs, 0, 1);
      const progress01 = 1 - remain01;
      const expand = 1 - Math.pow(1 - progress01, 3);
      const fade = Math.pow(remain01, 0.82);
      const rippleR = baseR + (expand * deltaPx);
      drawIdealRing(
        ringCx,
        ringCy,
        rippleR,
        lineWidth,
        `rgba(14,20,15,${(alphaPeak * fade).toFixed(3)})`
      );
    }

    // Keep reward ripples inside the play area so the effect stays readable.
    ctx.save();
    ctx.beginPath();
    ctx.rect(playRect.x, playRect.y, playRect.w, playRect.h);
    ctx.clip();
    if(okCenterActive){
      // OK: inner-ring-origin ripple only.
      drawRipple(ringMinR, okCenterRemain, TRN_OK_CENTER_FLASH_MS, 8, 0.28, 2);
    }
    if(successCenterActive){
      // SUCCESS: stronger inner-ring ripple.
      drawRipple(ringMinR, successCenterRemain, TRN_SUCCESS_CENTER_FLASH_MS, 10, 0.34, 2);
    }
    if(successOuterRippleActive){
      // SUCCESS: additional ripple from outer ring toward outside.
      drawRipple(ringMaxR, successOuterRippleRemain, TRN_SUCCESS_OUTER_RIPPLE_MS, TRN_SUCCESS_OUTER_RIPPLE_DELTA_PX, 0.22, 1);
    }
    ctx.restore();
  }

  function getCurrentStaminaForTrn(){
    const staminaMax = getRuntimeMax("stamina", 100);
    return clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
  }

  function canStartTrnSession(mode){
    const cfg = getTrnModeConfig(mode);
    const required = Math.max(0, Math.floor(toNumber(cfg?.staminaCost, 0)));
    if(required <= 0) return true;
    return getCurrentStaminaForTrn() >= required;
  }

  function startTrnSession(nowMs = performance.now()){
    const mode = setTrnMode(uiState.trnMode);
    if(!canStartTrnSession(mode)){
      uiState.trnSession = null;
      triggerTrnBadShake(nowMs);
      return false;
    }
    const cfg = getTrnModeConfig(mode);
    const loopMs = trnLoopMsFromBpm(cfg.bpm, 375);
    const ring = getTrnPlayRingMetrics();
    const minBandR = ring.minR + ((ring.maxR - ring.minR) * TRN_MIN_BAND_R_RATIO);
    const maxBandR = ring.minR + ((ring.maxR - ring.minR) * TRN_MAX_BAND_R_RATIO);
    const spanR = Math.max(1, maxBandR - minBandR);
    const u = Math.random();
    const innerBiased = u * u;
    const centerR = minBandR + (innerBiased * spanR);

    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stabilityNow / stabilityMax : 0;
    const bandBase = cfg.bandWMin + ((cfg.bandWMax - cfg.bandWMin) * stabilityRatio);
    const penaltyRatio = getTrnRecentPenaltyRatio(Date.now());
    const bandW = clamp(
      bandBase * (1 - penaltyRatio),
      cfg.bandWMin * 0.7,
      cfg.bandWMax
    );

    const ad = clamp(toNumber(state.detailed?.adIntegrity, 100), 0, 100);
    const signal = clamp(toNumber(state.detailed?.signalQuality, 100), 0, 100);
    const syncRate = resolveSyncRate(ad, signal);
    const critChance = clamp(
      toNumber(cfg.critChanceBase, 0.05) + ((syncRate / 100) * toNumber(cfg.critChanceBySync, 0.1)),
      0.03,
      toNumber(cfg.critChanceMax, 0.35)
    );
    const critEnabled = Math.random() < critChance;
    const critW = clamp(Math.round(Math.min(toNumber(cfg.critW, 4), Math.max(2, bandW - 2))), 2, Math.max(2, bandW));

    uiState.trnLastFeedback = null;
    clearTrnSuccessFx();
    uiState.trnBadShakeUntilMs = 0;
    uiState.trnBadShakeDir = 0;
    uiState.trnSession = {
      mode,
      startedAtMs: nowMs,
      loopMs,
      centerR,
      bandW,
      critEnabled,
      critW,
      nearMargin: Math.max(0, Math.floor(toNumber(cfg.nearMargin, TRN_BASE_NEAR_MARGIN))),
      internalP: getTrnInternalSuccessBase(mode),
      wasInBand: false,
      wasInCrit: false,
      bandHitFlashUntilMs: 0,
      critHitFlashUntilMs: 0,
    };
    noteTrnRun(Date.now());
    setOverlayMode(null);
    return true;
  }

  function enterTrnPlayScreen(nowMs = performance.now()){
    hideOverlayLog();
    setOverlayMode(null);
    if(!canStartTrnSession(uiState.trnMode)){
      triggerTrnBadShake(nowMs);
      return false;
    }
    state.screen = TRN_SCREEN;
    return startTrnSession(nowMs);
  }

  function getTrnGameTier(session, stopR){
    if(!session) return "FAIL";
    const dist = Math.abs(toNumber(stopR, 0) - toNumber(session.centerR, 0));
    const bandHalf = Math.max(1, toNumber(session.bandW, 10) / 2);
    const critHalf = Math.max(1, toNumber(session.critW, 4) / 2);
    const nearMargin = Math.max(0, toNumber(session.nearMargin, TRN_BASE_NEAR_MARGIN));
    if(session.critEnabled && dist <= critHalf) return "CRIT";
    if(dist <= bandHalf) return "SUCCESS";
    if(dist <= (bandHalf + nearMargin)) return "NEAR";
    return "FAIL";
  }

  function resolveTrnFinalTier(gameTier, internalSuccess){
    const tier = String(gameTier || "FAIL").toUpperCase();
    if(tier === "CRIT") return "CRIT";
    if(tier === "SUCCESS"){
      return internalSuccess ? "SUCCESS" : "NEAR";
    }
    if(tier === "NEAR"){
      return internalSuccess ? "NEAR" : "FAIL";
    }
    return "FAIL";
  }

  function consumeStamina(amount){
    const cost = Math.max(0, Math.floor(toNumber(amount, 0)));
    if(cost <= 0) return 0;
    const staminaMax = getRuntimeMax("stamina", 100);
    const staminaNow = clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
    const staminaNext = clamp(staminaNow - cost, 0, staminaMax);
    setRuntimeStat("stamina", staminaNext);
    return staminaNext - staminaNow;
  }

  function applyTrnResult(mode, tier){
    const cfg = getTrnModeConfig(mode);
    const normalizedTier = String(tier || "FAIL").toUpperCase();
    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    state.detailed = detail;

    const deltaStamina = consumeStamina(cfg.staminaCost);
    const signalBefore = clamp(toNumber(detail.signalQuality, 100), 0, 100);
    const adCap = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const signalDeltaRaw = toNumber(cfg.signalDeltaByTier?.[normalizedTier], 0);
    const signalAfter = clamp(signalBefore + signalDeltaRaw, 0, adCap);
    detail.signalQuality = signalAfter;
    detail.lastSignalQualityForTrend = signalAfter;
    detail.lastUpdateAt = Date.now();

    const signalApplied = signalAfter - signalBefore;
    if(signalApplied > 0) detail.signalTrend = "↑";
    else if(signalApplied < 0) detail.signalTrend = "↓";
    else detail.signalTrend = "→";

    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityDeltaRaw = toNumber(cfg.stabilityDeltaByTier?.[normalizedTier], 0);
    const stabilityAfter = clamp(stabilityNow + stabilityDeltaRaw, 0, stabilityMax);
    state.stats.stability = stabilityAfter;
    const stabilityApplied = stabilityAfter - stabilityNow;

    const deltaForLast = sanitizeDelta({
      stamina: deltaStamina,
      stability: stabilityApplied,
    });
    recordLastDeltaLine(deltaForLast);
    saveDetailedState();
    return {
      tier: normalizedTier,
      deltaStamina,
      deltaSignal: signalApplied,
      deltaStability: stabilityApplied,
    };
  }

  function applyTrnCancelCost(mode){
    const cfg = getTrnModeConfig(mode);
    const deltaStamina = consumeStamina(cfg.cancelStaminaCost);
    const deltaForLast = sanitizeDelta({ stamina: deltaStamina });
    if(Object.keys(deltaForLast).length > 0){
      recordLastDeltaLine(deltaForLast);
    }
    saveDetailedState();
  }

  function resolveTrnLogText(mode, tier){
    const modeId = normalizeTrnMode(mode);
    const tierId = String(tier || "fail").trim().toLowerCase();
    const style = state.logStyle === "corrupted" ? "corrupted" : "normal";
    const requestedKey = `log.${style}.trn_${modeId}_${tierId}`;
    const fallbackKey = `log.normal.trn_${modeId}_${tierId}`;
    const preferred = t(requestedKey);
    if(!isMissingI18nValue(preferred, requestedKey)){
      return preferred;
    }
    const fallback = t(fallbackKey);
    if(!isMissingI18nValue(fallback, fallbackKey)){
      return fallback;
    }
    return TRN_RESULT_LOG_FALLBACK[modeId]?.[tierId] || "同期が乱れた。";
  }

  function resolveTrnFeedbackGrade(finalTier, timeout = false){
    if(timeout) return "TIMEOUT";
    const tier = String(finalTier || "FAIL").toUpperCase();
    if(tier === "CRIT") return "SUCCESS";
    if(tier === "SUCCESS") return "OK";
    if(tier === "NEAR") return "NEAR";
    return "BAD";
  }

  const TRN_RESULT_FLAVORS = Object.freeze({
    great: Object.freeze([
      "同期は安定した。確かな前進があった。",
      "信号は整流された。成果は明白だ。",
    ]),
    slightGain: Object.freeze([
      "揺らぎは残るが、改善は見られる。",
      "微弱だが、確かな変化があった。",
    ]),
    neutral: Object.freeze([
      "大きな変化はない。調整は続けるべきだ。",
      "信号は現状維持。停滞とも安定とも言える。",
    ]),
    drain: Object.freeze([
      "信号は乱れた。無理は禁物だ。",
      "消耗が目立つ。休息を検討すべきだ。",
    ]),
    stabilize: Object.freeze([
      "揺らぎは抑制された。基礎が整う。",
    ]),
    unstable: Object.freeze([
      "あと一歩が届かない。精度を上げよ。",
    ]),
  });

  function pickTrnResultFlavor(category){
    const list = TRN_RESULT_FLAVORS[String(category)] || TRN_RESULT_FLAVORS.neutral;
    if(!Array.isArray(list) || list.length <= 0){
      return "大きな変化はない。調整は続けるべきだ。";
    }
    const idx = Math.floor(Math.random() * list.length);
    return String(list[idx] || list[0] || "大きな変化はない。調整は続けるべきだ。");
  }

  function resolveTrnResultCategory(stats){
    const totalStabilityDelta = Math.round(toNumber(stats?.totalStabilityDelta, 0));
    const totalSignalDelta = Math.round(toNumber(stats?.totalSignalDelta, 0));
    const totalRuns = Math.max(1, Math.floor(toNumber(stats?.totalRuns, 1)));
    const successCount = Math.max(0, Math.floor(toNumber(stats?.successCount, 0)));
    const nearCount = Math.max(0, Math.floor(toNumber(stats?.nearCount, 0)));
    const successRate = successCount / totalRuns;

    if(totalStabilityDelta > 0) return "stabilize";
    if(totalSignalDelta >= 6 && successRate >= 0.5) return "great";
    if(totalSignalDelta > 0) return "slightGain";
    if(totalSignalDelta === 0) return "neutral";
    if(nearCount > successCount && totalSignalDelta <= 0) return "unstable";
    return "drain";
  }

  function formatSignedDeltaValue(value){
    const n = Math.round(toNumber(value, 0));
    const sign = n >= 0 ? "+" : "-";
    return `${sign}${Math.abs(n)}`;
  }

  function formatTrnMetricToken(label, value){
    return `${label}${formatSignedDeltaValue(value)}`;
  }

  function formatTrnFormalMetric(label, value){
    return `${label} ${formatSignedDeltaValue(value)}`;
  }

  function buildTrnCompactFeedback(grade, applied){
    const deltaStability = Math.round(toNumber(applied?.deltaStability, 0));
    return {
      line1: String(grade || "BAD"),
      lineSta: formatTrnMetricToken("STA", applied?.deltaStamina),
      lineSig: formatTrnMetricToken("SIG", applied?.deltaSignal),
      lineStb: deltaStability !== 0 ? formatTrnMetricToken("STB", deltaStability) : "",
    };
  }

  function clearTrnSuccessFx(){
    uiState.trnOkCenterFlashUntilMs = 0;
    uiState.trnSuccessCenterFlashUntilMs = 0;
    uiState.trnSuccessOuterRippleUntilMs = 0;
  }

  function triggerTrnBadShake(nowMs = performance.now()){
    const baseMs = toNumber(nowMs, performance.now());
    uiState.trnBadShakeUntilMs = baseMs + TRN_BAD_SHAKE_MS;
    uiState.trnBadShakeDir = Math.random() < 0.5 ? -1 : 1;
  }

  function triggerTrnSuccessFx(feedbackGrade, nowMs = performance.now()){
    clearTrnSuccessFx();
    const grade = String(feedbackGrade || "").toUpperCase();
    if(grade === "SUCCESS"){
      uiState.trnSuccessCenterFlashUntilMs = nowMs + TRN_SUCCESS_CENTER_FLASH_MS;
      uiState.trnSuccessOuterRippleUntilMs = nowMs + TRN_SUCCESS_OUTER_RIPPLE_MS;
      return;
    }
    if(grade === "OK"){
      uiState.trnOkCenterFlashUntilMs = nowMs + TRN_OK_CENTER_FLASH_MS;
    }
  }

  function clearTrnResultBuffer(){
    uiState.trnResultBuffer = [];
    uiState.trnLastFeedback = null;
    clearTrnSuccessFx();
    uiState.trnBadShakeUntilMs = 0;
    uiState.trnBadShakeDir = 0;
    state.trnResultLogText = "";
  }

  function pushTrnResultEntry(entry){
    const list = Array.isArray(uiState.trnResultBuffer) ? uiState.trnResultBuffer : [];
    list.push(entry);
    if(list.length > 64){
      list.shift();
    }
    uiState.trnResultBuffer = list;
  }

  function buildTrnSummaryLogText(reason = null){
    const list = Array.isArray(uiState.trnResultBuffer) ? uiState.trnResultBuffer : [];
    if(list.length <= 0) return "";
    const lines = [`TRN RESULT x${list.length}`];
    const totalRuns = list.length;
    const successCount = list.reduce((acc, item) => {
      const g = String(item?.grade || "").toUpperCase();
      return acc + ((g === "OK" || g === "SUCCESS") ? 1 : 0);
    }, 0);
    const nearCount = list.reduce((acc, item) => {
      const g = String(item?.grade || "").toUpperCase();
      return acc + (g === "NEAR" ? 1 : 0);
    }, 0);
    const badCount = list.reduce((acc, item) => {
      const g = String(item?.grade || "").toUpperCase();
      return acc + ((g === "BAD" || g === "TIMEOUT") ? 1 : 0);
    }, 0);
    const totalSignalDelta = list.reduce((acc, item) => acc + Math.round(toNumber(item?.deltaSignal, 0)), 0);
    const totalStaminaDelta = list.reduce((acc, item) => acc + Math.round(toNumber(item?.deltaStamina, 0)), 0);
    const totalStabilityDelta = list.reduce((acc, item) => acc + Math.round(toNumber(item?.deltaStability, 0)), 0);
    lines.push(formatTrnFormalMetric("信号品質", totalSignalDelta));
    lines.push(formatTrnFormalMetric("スタミナ", totalStaminaDelta));
    if(totalStabilityDelta !== 0){
      lines.push(formatTrnFormalMetric("安定度", totalStabilityDelta));
    }
    lines.push("――――――――");
    if(String(reason || "") === "stamina_empty"){
      lines.push(TRN_RESULT_SUMMARY_STAMINA_EMPTY);
    }else{
      const category = resolveTrnResultCategory({
        totalRuns,
        successCount,
        nearCount,
        badCount,
        totalSignalDelta,
        totalStaminaDelta,
        totalStabilityDelta,
      });
      lines.push(pickTrnResultFlavor(category));
    }
    return lines.join("\n");
  }

  function openTrnSummaryLogOrReturnMode(reason = null){
    const list = Array.isArray(uiState.trnResultBuffer) ? uiState.trnResultBuffer : [];
    if(list.length <= 0){
      state.screen = TRN_MODE_SCREEN;
      hideOverlayLog();
      return;
    }
    state.trnResultLogText = buildTrnSummaryLogText(reason);
    state.screen = TRN_LOG_SCREEN;
    setOverlayMode("log");
  }

  function closeTrnSummaryLog(){
    clearTrnResultBuffer();
    state.screen = TRN_MODE_SCREEN;
    hideOverlayLog();
  }

  function finishTrnSession(resultTier, nowMs = performance.now(), options = null){
    const session = uiState.trnSession;
    if(!session) return;
    const currentR = getTrnCurrentRadius(session, nowMs);
    const gameTier = resultTier || getTrnGameTier(session, currentR);
    const internalRoll = Math.random() < clamp(toNumber(session.internalP, 0.5), 0, 1);
    const finalTier = resolveTrnFinalTier(gameTier, internalRoll);
    const applied = applyTrnResult(session.mode, finalTier);
    const timeout = Boolean(options?.timeout);
    const feedbackGrade = resolveTrnFeedbackGrade(finalTier, timeout);
    pushTrnResultEntry({
      timestamp: Date.now(),
      mode: session.mode,
      grade: feedbackGrade,
      deltaSignal: applied.deltaSignal,
      deltaStamina: applied.deltaStamina,
      deltaStability: applied.deltaStability,
    });
    uiState.trnLastFeedback = buildTrnCompactFeedback(feedbackGrade, applied);
    triggerTrnSuccessFx(feedbackGrade, toNumber(nowMs, performance.now()));
    const isBadGrade = String(feedbackGrade || "").toUpperCase() === "BAD";
    if(isBadGrade){
      triggerTrnBadShake(nowMs);
    }else{
      uiState.trnBadShakeUntilMs = 0;
      uiState.trnBadShakeDir = 0;
    }
    const staminaNow = getCurrentStaminaForTrn();
    uiState.trnSession = null;
    state.trnResultLogText = resolveTrnLogText(session.mode, finalTier);
    if(staminaNow <= 0){
      openTrnSummaryLogOrReturnMode("stamina_empty");
      return;
    }
    state.screen = TRN_SCREEN;
    setOverlayMode(null);
  }

  function cancelTrnSession(){
    const session = uiState.trnSession;
    if(session){
      applyTrnCancelCost(session.mode);
    }
    uiState.trnSession = null;
  }

  function updateTrnTimeout(nowMs = performance.now()){
    if(state.screen !== TRN_SCREEN) return;
    const session = uiState.trnSession;
    if(!session) return;
    if((nowMs - toNumber(session.startedAtMs, nowMs)) >= TRN_MAX_MS){
      finishTrnSession("FAIL", nowMs, { timeout: true });
    }
  }

  function showOverlayShell(mode, rectOverride = null){
    if(!overlayLog || !overlayLogTitle || !overlayLogBody || !overlayLogHint) return false;
    const rect = rectOverride || (mode === "stat" ? OVERLAY_STAT_RECT : OVERLAY_LOG_RECT);
    setOverlayLogRect(rect);
    overlayLog.classList.remove("mode-log", "mode-stat");
    overlayLog.classList.add(mode === "stat" ? "mode-stat" : "mode-log");
    overlayLog.classList.remove("hidden");
    setOverlayMode(mode);
    return true;
  }

  function showOverlayLog(text, rectOverride = null){
    if(!showOverlayShell("log", rectOverride)) return;
    overlayLogTitle.textContent = "";
    overlayLogBody.textContent = String(text ?? "");
    overlayLogHint.textContent = "";
  }

  function showOverlayStat(){
    if(!showOverlayShell("stat")) return;
    overlayLogTitle.textContent = "";
    overlayLogHint.textContent = "";
    overlayLogBody.textContent = "";

    const page = setStatPage(state.ui?.statPage);
    if(page !== 0){
      const page2 = document.createElement("div");
      page2.className = "overlay-stat-page2";
      const page2Main = document.createElement("div");
      page2Main.className = "overlay-stat-page2-main";
      const page2Footer = document.createElement("div");
      page2Footer.className = "overlay-stat-page2-footer";
      const lines = getStatusPage2Lines();
      const footerStartIndex = Math.max(0, lines.length - 2);
      for(let i = 0; i < lines.length; i++){
        const line = lines[i];
        const lineEl = document.createElement("div");
        lineEl.className = `overlay-stat-line${line.isSeparator ? " is-separator" : ""}`;
        lineEl.textContent = line.text;
        if(i >= footerStartIndex){
          page2Footer.appendChild(lineEl);
        }else{
          page2Main.appendChild(lineEl);
        }
      }
      page2.appendChild(page2Main);
      page2.appendChild(page2Footer);
      overlayLogBody.appendChild(page2);
      return;
    }

    const rows = getStatusRows();
    const grid = document.createElement("div");
    grid.className = "overlay-stat-grid";
    for(const row of rows){
      const rowEl = document.createElement("div");
      rowEl.className = "overlay-stat-row";

      const labelEl = document.createElement("div");
      labelEl.className = "overlay-stat-label";
      labelEl.textContent = row.label;

      const barEl = document.createElement("div");
      barEl.className = "overlay-stat-bar";
      const fillEl = document.createElement("div");
      fillEl.className = "overlay-stat-barFill";
      if(row.ratio == null){
        barEl.classList.add("is-unavailable");
        fillEl.style.width = "0%";
      }else{
        fillEl.style.width = `${Math.round(row.ratio * 1000) / 10}%`;
      }
      barEl.appendChild(fillEl);

      const valueEl = document.createElement("div");
      valueEl.className = "overlay-stat-value";
      valueEl.textContent = row.value;

      rowEl.appendChild(labelEl);
      rowEl.appendChild(barEl);
      rowEl.appendChild(valueEl);
      grid.appendChild(rowEl);
    }
    overlayLogBody.appendChild(grid);
  }

  function hideOverlayLog(){
    if(!overlayLog) return;
    overlayLog.classList.add("hidden");
    overlayLog.classList.remove("mode-log", "mode-stat");
    if(overlayLogTitle) overlayLogTitle.textContent = "";
    if(overlayLogBody) overlayLogBody.textContent = "";
    if(overlayLogHint) overlayLogHint.textContent = "";
    setOverlayMode(null);
  }

  function isMissingI18nValue(text, key){
    return text === `[${key}]` || String(text).trim().length <= 0;
  }

  function resolveLogTemplate(style, action, params){
    const requestedKey = `log.${style}.${action}`;
    const fallbackKey = `log.normal.${action}`;
    const preferred = t(requestedKey, params);
    if(!isMissingI18nValue(preferred, requestedKey)){
      return preferred;
    }
    const fallback = t(fallbackKey, params);
    if(!isMissingI18nValue(fallback, fallbackKey)){
      return fallback;
    }
    return `[missing:${requestedKey}]`;
  }

  function resolveNoChangeLogTemplate(style, action, params){
    const actionNoChange = `${action}_nochange`;
    const requestedKey = `log.${style}.${actionNoChange}`;
    const fallbackNoChangeKey = `log.normal.${actionNoChange}`;
    const preferred = t(requestedKey, params);
    if(!isMissingI18nValue(preferred, requestedKey)){
      return preferred;
    }
    const fallbackNoChange = t(fallbackNoChangeKey, params);
    if(!isMissingI18nValue(fallbackNoChange, fallbackNoChangeKey)){
      return fallbackNoChange;
    }
    return resolveLogTemplate(style, action, params);
  }

  function buildOverlayLogByScreen(screen){
    let action = null;
    if(screen === "feed") action = "feed";
    if(screen === "sleep") action = "sleep";
    if(screen === "heal") action = "heal";
    if(!action) return null;

    const style = state.logStyle === "corrupted" ? "corrupted" : "normal";
    const delta = sanitizeDelta(state.logParamsByAction[action] || {});
    const statLineRaw = buildLogStatLine(delta);
    const isNoChange = statLineRaw.length <= 0;
    const noChangeText = LOG_NO_CHANGE_TEXT_BY_ACTION[action] || LOG_DEFAULT_NO_CHANGE_TEXT;
    const params = {
      ...delta,
      statLine: isNoChange ? noChangeText : statLineRaw,
    };
    if(isNoChange){
      return resolveNoChangeLogTemplate(style, action, params);
    }
    return resolveLogTemplate(style, action, params);
  }

  function toNumber(value, fallback){
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function toPositiveInt(value, fallback){
    const num = Math.floor(toNumber(value, fallback));
    return num > 0 ? num : fallback;
  }

  function normalizeChronotype(value, fallback = "morning"){
    if(typeof value !== "string") return fallback;
    const id = value.trim().toLowerCase();
    if(id === "morning" || id === "day" || id === "night") return id;
    return fallback;
  }

  function pickChronotypeByMonsterId(monsterId){
    const source = String(monsterId || "mon001");
    let hash = 0;
    for(let i = 0; i < source.length; i++){
      hash = ((hash * 31) + source.charCodeAt(i)) % 9973;
    }
    const ids = ["morning", "day", "night"];
    return ids[hash % ids.length];
  }

  function createDefaultDetailedState(monsterId){
    const now = Date.now();
    return {
      version: DETAIL_STATE_VERSION,
      adIntegrity: 100,
      signalQuality: 100,
      signalTrend: "→",
      lastSignalQualityForTrend: 100,
      lastUpdateAt: now,
      chronotype: pickChronotypeByMonsterId(monsterId),
      isTuckedIn: false,
      battleCount: 0,
      battleWins: 0,
    };
  }

  function normalizeDetailedState(input, fallback){
    const base = fallback || createDefaultDetailedState("mon001");
    const src = isRecord(input) ? input : {};
    const signalTrendRaw = String(src.signalTrend ?? base.signalTrend);
    const signalTrend = (signalTrendRaw === "↑" || signalTrendRaw === "↓" || signalTrendRaw === "→")
      ? signalTrendRaw
      : "→";
    const battleCount = Math.max(0, Math.floor(toNumber(src.battleCount, base.battleCount)));
    const battleWins = clamp(Math.floor(toNumber(src.battleWins, base.battleWins)), 0, battleCount);
    const chronotype = normalizeChronotype(src.chronotype, base.chronotype);

    return {
      version: DETAIL_STATE_VERSION,
      adIntegrity: clamp(toNumber(src.adIntegrity, base.adIntegrity), 0, 100),
      signalQuality: clamp(toNumber(src.signalQuality, base.signalQuality), 0, 100),
      signalTrend,
      lastSignalQualityForTrend: clamp(
        toNumber(src.lastSignalQualityForTrend, base.lastSignalQualityForTrend),
        0,
        100
      ),
      lastUpdateAt: Math.max(0, Math.floor(toNumber(src.lastUpdateAt, base.lastUpdateAt))),
      chronotype,
      isTuckedIn: Boolean(src.isTuckedIn),
      battleCount,
      battleWins,
    };
  }

  function loadDetailedState(){
    const fallback = createDefaultDetailedState(state.monster?.id || "mon001");
    const parsed = safeParse(localStorage.getItem(DETAIL_STORAGE_KEY));
    const normalized = normalizeDetailedState(parsed, fallback);
    normalized.signalQuality = Math.min(normalized.signalQuality, normalized.adIntegrity);
    state.detailed = normalized;
    if(isRecord(parsed) && typeof parsed.lastDeltaLine === "string"){
      state.lastDeltaLine = parsed.lastDeltaLine.trim().length > 0
        ? parsed.lastDeltaLine
        : LAST_DELTA_NONE_TEXT;
    }else{
      state.lastDeltaLine = LAST_DELTA_NONE_TEXT;
    }
  }

  function saveDetailedState(){
    if(!isRecord(state.detailed)) return false;
    const payload = {
      ...state.detailed,
      version: DETAIL_STATE_VERSION,
      lastDeltaLine: state.lastDeltaLine || LAST_DELTA_NONE_TEXT,
    };
    try{
      localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(payload));
      return true;
    }catch(_err){
      log("error", "SAVE", "Failed to save detailed state");
      return false;
    }
  }

  function getLocalMinuteNow(){
    const d = new Date();
    return (d.getHours() * 60) + d.getMinutes();
  }

  function isMinuteWithinWindow(minute, startMin, endMin){
    if(startMin === endMin) return true;
    if(startMin < endMin){
      return minute >= startMin && minute < endMin;
    }
    return minute >= startMin || minute < endMin;
  }

  function isInAutoSleepWindow(chronotype, minute){
    const key = normalizeChronotype(chronotype, "morning");
    const window = CHRONOTYPE_WINDOWS[key] || CHRONOTYPE_WINDOWS.morning;
    return isMinuteWithinWindow(minute, window.startMin, window.endMin);
  }

  function updateAutoSleepState(){
    const detail = state.detailed;
    if(!isRecord(detail)){
      state.isSleeping = false;
      return;
    }
    const shouldSleep = isInAutoSleepWindow(detail.chronotype, getLocalMinuteNow());
    if(!shouldSleep && detail.isTuckedIn){
      detail.isTuckedIn = false;
    }
    state.isSleeping = shouldSleep;
  }

  function sleepSupportLevel(){
    if(!state.isSleeping) return 0;
    return state.detailed?.isTuckedIn ? 1 : 0.5;
  }

  function updateDetailedMetricsRealtime(nowMs = Date.now()){
    const detail = state.detailed;
    if(!isRecord(detail)){
      updateAutoSleepState();
      return;
    }

    updateAutoSleepState();
    const prevAd = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const prevSignal = clamp(toNumber(detail.signalQuality, 100), 0, 100);
    const prevForTrend = clamp(toNumber(detail.lastSignalQualityForTrend, prevSignal), 0, 100);

    const elapsedMs = Math.max(0, nowMs - Math.max(0, toNumber(detail.lastUpdateAt, nowMs)));
    if(elapsedMs <= 0){
      detail.adIntegrity = prevAd;
      detail.signalQuality = Math.min(prevSignal, prevAd);
      return;
    }

    const elapsedHours = elapsedMs / 3_600_000;
    const damage = clamp(toNumber(state.stats?.damage, 0), 0, toPositiveInt(state.stats?.damageMax, 10));
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stability = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? (stability / stabilityMax) : 0;
    const support = sleepSupportLevel();

    let adRate = AD_DECAY_PER_HOUR;
    if(damage > 0) adRate *= 1.5;
    if(stabilityRatio >= 0.7) adRate *= 0.5;
    if(support > 0){
      const mitigation = support >= 1 ? 0.7 : 0.35;
      adRate *= (1 - mitigation);
    }
    let adDelta = -(adRate * elapsedHours);
    adDelta = Math.max(adDelta, -DETERIORATION_MAX_DELTA_PER_UPDATE);
    const nextAd = clamp(prevAd + adDelta, 0, 100);

    let signalDelta = 0;
    let signalRate = SIGNAL_DECAY_PER_HOUR;
    if(damage > 0) signalRate *= 1.4;
    if(stabilityRatio < 0.4) signalRate *= 1.25;
    if(support > 0){
      const recovery = support >= 1
        ? SIGNAL_SLEEP_RECOVERY_PER_HOUR_FULL
        : SIGNAL_SLEEP_RECOVERY_PER_HOUR_HALF;
      signalDelta = (recovery - (signalRate * 0.2)) * elapsedHours;
    }else{
      signalDelta = -(signalRate * elapsedHours);
    }
    signalDelta = clamp(
      signalDelta,
      -DETERIORATION_MAX_DELTA_PER_UPDATE,
      DETERIORATION_MAX_DELTA_PER_UPDATE
    );
    let nextSignal = clamp(prevSignal + signalDelta, 0, 100);
    nextSignal = Math.min(nextSignal, nextAd);

    const diff = nextSignal - prevForTrend;
    if(diff >= SIGNAL_TREND_DIFF_THRESHOLD){
      detail.signalTrend = "↑";
    }else if(diff <= -SIGNAL_TREND_DIFF_THRESHOLD){
      detail.signalTrend = "↓";
    }else{
      detail.signalTrend = "→";
    }

    detail.adIntegrity = nextAd;
    detail.signalQuality = nextSignal;
    detail.lastSignalQualityForTrend = nextSignal;
    detail.lastUpdateAt = nowMs;
  }

  function recordLastDeltaLine(delta){
    const line = buildLogStatLine(sanitizeDelta(delta));
    state.lastDeltaLine = line.length > 0 ? line : LAST_DELTA_NONE_TEXT;
  }

  function applyClampedDelta(current, delta, min, max){
    const currentNum = toNumber(current, min);
    const next = clamp(currentNum + delta, min, max);
    return {
      value: next,
      appliedDelta: next - currentNum,
    };
  }

  function sanitizeDelta(delta){
    const sanitized = {};
    if(!delta || typeof delta !== "object") return sanitized;
    const keys = Object.keys(delta);
    for(const key of keys){
      const value = toNumber(delta[key], 0);
      if(value !== 0){
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  function formatSignedDelta(value){
    const num = toNumber(value, 0);
    if(num > 0) return `+${num}`;
    return String(num);
  }

  function buildLogStatLine(delta){
    const parts = [];
    for(const spec of LOG_STAT_SPECS){
      const key = spec?.key;
      if(typeof key !== "string" || !Object.prototype.hasOwnProperty.call(delta, key)){
        continue;
      }
      const sign = toNumber(spec?.sign, 1);
      const value = toNumber(delta[key], 0) * sign;
      if(value === 0) continue;
      parts.push(`${spec.label} ${formatSignedDelta(value)}`);
    }
    return parts.join(" / ");
  }

  function updateLogParams(action, params){
    state.logParamsByAction[action] = sanitizeDelta(params);
  }

  function getRuntimeStat(field, fallback){
    return toNumber(state.monster?.runtimeState?.[field], fallback);
  }

  function setRuntimeStat(field, value){
    if(!state.monster.runtimeState) state.monster.runtimeState = {};
    state.monster.runtimeState[field] = value;
  }

  function getRuntimeMax(field, fallback){
    if(field === "hp"){
      return toPositiveInt(state.monster?.stats?.maxHp, fallback);
    }
    if(field === "stamina"){
      return toPositiveInt(state.monster?.stats?.staminaMax, fallback);
    }
    return fallback;
  }

  function applyFeed(){
    const hungerMax = toPositiveInt(state.stats.hungerMax, 10);
    const stabilityMax = toPositiveInt(state.stats.stabilityMax, 10);
    const hunger = applyClampedDelta(state.stats.hunger, 2, 0, hungerMax);
    const stability = applyClampedDelta(state.stats.stability, 1, 0, stabilityMax);
    state.stats.hunger = hunger.value;
    state.stats.stability = stability.value;
    const delta = sanitizeDelta({
      hunger: hunger.appliedDelta,
      stability: stability.appliedDelta,
    });
    updateLogParams("feed", delta);
    recordLastDeltaLine(delta);
    return {
      logKey: `log.${state.logStyle || "normal"}.feed`,
      delta,
    };
  }

  function applySleep(){
    const staminaMax = getRuntimeMax("stamina", 100);
    const staminaNow = clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
    const missingStamina = staminaMax - staminaNow;
    const staminaGainRaw = missingStamina > 0
      ? Math.max(Math.ceil(missingStamina * SLEEP_STAMINA_GAIN_RATE), 1)
      : 0;
    const staminaNext = clamp(staminaNow + staminaGainRaw, 0, staminaMax);
    const staminaGain = staminaNext - staminaNow;
    setRuntimeStat("stamina", staminaNext);

    const hungerMax = toPositiveInt(state.stats.hungerMax, 10);
    const sleepHungerDelta = HUNGER_IS_FULLNESS ? -SLEEP_HUNGER_DELTA : SLEEP_HUNGER_DELTA;
    const hungerResult = applyClampedDelta(state.stats.hunger, sleepHungerDelta, 0, hungerMax);
    state.stats.hunger = hungerResult.value;

    const stabilityMax = toPositiveInt(state.stats.stabilityMax, 10);
    const stabilityNow = clamp(toNumber(state.stats.stability, stabilityMax), 0, stabilityMax);
    const missingStability = stabilityMax - stabilityNow;
    const stabilityGainRaw = Math.ceil(missingStability * SLEEP_STABILITY_GAIN_RATE);
    const stabilityGain = clamp(stabilityGainRaw, 0, SLEEP_STABILITY_GAIN_CAP);
    const stabilityNext = clamp(stabilityNow + stabilityGain, 0, stabilityMax);
    state.stats.stability = stabilityNext;

    const delta = sanitizeDelta({
      stamina: staminaGain,
      hunger: hungerResult.appliedDelta,
      stability: stabilityNext - stabilityNow,
    });
    updateLogParams("sleep", delta);
    recordLastDeltaLine(delta);
    return {
      logKey: `log.${state.logStyle || "normal"}.sleep`,
      delta,
    };
  }

  function applyHeal(){
    const hpMax = getRuntimeMax("hp", 100);
    const staminaMax = getRuntimeMax("stamina", 100);
    const damageMax = toPositiveInt(state.stats.damageMax, 10);

    const hpNow = clamp(getRuntimeStat("hp", hpMax), 0, hpMax);
    const staminaNow = clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
    const damageNow = clamp(toNumber(state.stats.damage, 0), 0, damageMax);

    let staminaSpent = 0;
    let hpGain = 0;
    let damageReduced = 0;

    if(staminaNow >= HEAL_COST_STAMINA){
      staminaSpent = HEAL_COST_STAMINA;
      const staminaNext = clamp(staminaNow - staminaSpent, 0, staminaMax);
      setRuntimeStat("stamina", staminaNext);

      const missingHp = hpMax - hpNow;
      const hpGainRaw = HEAL_HP_BASE + Math.ceil(missingHp * HEAL_HP_GAIN_RATE);
      hpGain = clamp(hpGainRaw, 0, missingHp);
      const hpNext = clamp(hpNow + hpGain, 0, hpMax);
      setRuntimeStat("hp", hpNext);

      damageReduced = Math.min(HEAL_DAMAGE_HEAL, damageNow);
      state.stats.damage = clamp(damageNow - damageReduced, 0, damageMax);
    }else{
      setRuntimeStat("hp", hpNow);
      setRuntimeStat("stamina", staminaNow);
      state.stats.damage = damageNow;
    }

    state.stats.hygiene = clamp(state.stats.hygiene + 3, 0, 10);
    state.stats.mood = clamp(state.stats.mood + 1, 0, 10);

    const delta = sanitizeDelta({
      hp: hpGain,
      damage: damageReduced,
      stamina: -staminaSpent,
    });
    updateLogParams("heal", delta);
    recordLastDeltaLine(delta);
    return {
      logKey: `log.${state.logStyle || "normal"}.heal`,
      delta,
    };
  }

  // ====== Crow (16x16) ======
  // 1=body, 2=eye/beak accent (豼・＞繧・
  const CROW_SPRITE = [
    "0000000000000000",
    "0000001002000000",
    "0000011110000000",
    "0000111111100000",
    "0001111111100000",
    "0001111111110000",
    "0001111111100000",
    "0011111111100000",
    "0000111111111100",
    "0001111111111100",
    "0000111111111000",
    "0000011111100000",
    "0000111111110000",
    "0000011111110000",
    "0000000000000000",
    "0000000000000000",
  ].map(r => r.replace(/2/g, "2")); // just to be explicit
  const CROW = spriteFromStrings(CROW_SPRITE);

  // Blink: eye accent off
  const CROW_BLINK = spriteFromStrings([
    "0000000000000000",
    "0000001001000000",
    "0000011110000000",
    "0000111111100000",
    "0001111111100000",
    "0001111111110000",
    "0001111111100000",
    "0011111111100000",
    "0000111111111100",
    "0001111111111100",
    "0000111111111000",
    "0000011111100000",
    "0000111111110000",
    "0000011111110000",
    "0000000000000000",
    "0000000000000000",
  ]);

  const MonsterModel = window.DotmonMonsterModel;
  const RuntimeAPI = window.DotmonRuntime;
  const EditorAdapterAPI = window.DotmonEditorAdapter;
  const uiTextDrawFallback = (
    UiTextAPI &&
    typeof UiTextAPI.draw === "function"
  ) ? UiTextAPI.draw : null;

  function showBootError(message){
    hudTitle.textContent = "BOOT ERROR";
    hudHint.textContent = "Required module missing";
    uiClock.textContent = "--:--";
    uiDay.textContent = "DAY --";

    ctx.fillStyle = "#c8d6c2";
    ctx.fillRect(0, 0, W, H);
    if(uiTextDrawFallback){
      uiTextDrawFallback(ctx, "BOOT ERROR", 20, 24, {
        scale: DEFAULT_TEXT_SCALE,
        color: "rgba(14,20,15,0.92)",
      });
      uiTextDrawFallback(ctx, String(message), 20, 48, {
        scale: 1,
        color: "rgba(14,20,15,0.92)",
      });
    }
  }

  const bootErrors = [];
  if(
    !SpriteSpecModule ||
    !Number.isInteger(SPRITE_W) ||
    !Number.isInteger(SPRITE_H) ||
    SPRITE_W <= 0 ||
    SPRITE_H <= 0
  ){
    bootErrors.push("DotmonSpriteSpec");
  }
  if(
    !SpriteCodecModule ||
    typeof SpriteCodecModule.encodeSprite !== "function" ||
    typeof SpriteCodecModule.decodeSprite !== "function" ||
    typeof SpriteCodecModule.isEncodedSprite !== "function"
  ){
    bootErrors.push("DotmonSpriteCodec");
  }
  if(
    !SaveMigratorAPI ||
    typeof SaveMigratorAPI.migrateSave !== "function" ||
    !Number.isInteger(SAVE_SCHEMA_VERSION) ||
    SAVE_SCHEMA_VERSION <= 0
  ){
    bootErrors.push("DotmonSaveMigrator");
  }
  if(!MonsterModel || typeof MonsterModel.createDefaultMonster !== "function" || typeof MonsterModel.normalizeMonster !== "function" || typeof MonsterModel.validateMonster !== "function"){
    bootErrors.push("DotmonMonsterModel");
  }
  if(!RuntimeAPI || typeof RuntimeAPI.getView !== "function" || typeof RuntimeAPI.update !== "function" || typeof RuntimeAPI.setMode !== "function"){
    bootErrors.push("DotmonRuntime");
  }
  if(!EditorAdapterAPI || typeof EditorAdapterAPI.applyPatch !== "function" || typeof EditorAdapterAPI.getTarget !== "function"){
    bootErrors.push("DotmonEditorAdapter");
  }
  if(
    !UiTextAPI ||
    typeof UiTextAPI.draw !== "function" ||
    typeof UiTextAPI.measure !== "function" ||
    typeof UiTextAPI.drawAligned !== "function" ||
    typeof UiTextAPI.drawInRect !== "function"
  ){
    bootErrors.push("DotmonUiText");
  }
  if(!Number.isInteger(BITMAP_GLYPH_H) || BITMAP_GLYPH_H <= 0){
    bootErrors.push("DotmonBitmapFontSpec");
  }
  if(
    !UiCursorAPI ||
    typeof UiCursorAPI.isBlinkOn !== "function" ||
    typeof UiCursorAPI.shouldShowCursor !== "function" ||
    typeof UiCursorAPI.onCursorMoved !== "function"
  ){
    bootErrors.push("DotmonUiCursor");
  }
  if(!I18nAPI || typeof I18nAPI.t !== "function"){
    bootErrors.push("DotmonI18n");
  }
  if(!overlayRoot || !overlayLog || !overlayLogTitle || !overlayLogBody || !overlayLogHint){
    bootErrors.push("OverlayLogDom");
  }
  if(bootErrors.length > 0){
    log("error", "BOOT", "Required module missing", bootErrors);
    showBootError(bootErrors.join(", "));
    return;
  }

  const createDefaultMonster = MonsterModel.createDefaultMonster;
  const normalizeMonster = MonsterModel.normalizeMonster;
  const validateMonster = MonsterModel.validateMonster;
  const runtimeGetView = RuntimeAPI.getView;
  const runtimeUpdate = RuntimeAPI.update;
  const runtimeSetMode = RuntimeAPI.setMode;
  const editorApplyPatch = EditorAdapterAPI.applyPatch;
  const encodeSprite = SpriteCodecModule.encodeSprite;
  const decodeSprite = SpriteCodecModule.decodeSprite;
  const migrateSave = SaveMigratorAPI.migrateSave;
  const uiTextDraw = UiTextAPI.draw;
  const uiTextMeasure = UiTextAPI.measure;
  const uiTextDrawInRect = UiTextAPI.drawInRect;
  const uiCursorShouldShow = UiCursorAPI.shouldShowCursor;
  const uiCursorOnMoved = UiCursorAPI.onCursorMoved;
  hideOverlayLog();

  function createAppDefaultMonster(id){
    const mon = normalizeMonster(createDefaultMonster(id));
    const base01 = spriteTo01Array(CROW);
    if(!editorApplyPatch(mon, { type: "SET_BASE_SPRITE", sprite: base01 })){
      log("error", "BOOT", "Failed to initialize default monster sprite");
    }
    return mon;
  }

  function isMonsterSeverelyBroken(monster){
    if(!isRecord(monster)) return true;
    if(!isRecord(monster.stats) || !Number.isFinite(monster.stats.maxHp) || monster.stats.maxHp <= 0) return true;
    if(!isRecord(monster.runtimeState) || !Number.isFinite(monster.runtimeState.hp)) return true;
    if(!isRecord(monster.spriteSet) || !isSprite16(monster.spriteSet.base)) return true;
    return false;
  }

  function ensureMonsterSchema(input, fallbackId = "mon001"){
    let normalized;
    try{
      normalized = normalizeMonster(input);
    }catch(_err){
      return createAppDefaultMonster(fallbackId);
    }

    try{
      const errors = validateMonster(normalized);
      if(Array.isArray(errors) && errors.length > 0 && isMonsterSeverelyBroken(normalized)){
        return createAppDefaultMonster(fallbackId);
      }
    }catch(_err){
      return createAppDefaultMonster(fallbackId);
    }

    if(isMonsterSeverelyBroken(normalized)){
      return createAppDefaultMonster(fallbackId);
    }
    return normalized;
  }

  function safeParse(jsonString){
    if(typeof jsonString !== "string" || jsonString.length <= 0) return null;
    try{
      return JSON.parse(jsonString);
    }catch(_err){
      log("error", "SAVE_PARSE", "Invalid save data");
      return null;
    }
  }

  function saveWithVersion(monster){
    const payload = {
      version: SAVE_SCHEMA_VERSION,
      monster,
    };
    try{
      localStorage.setItem(MONSTER_STORAGE_KEY, JSON.stringify(payload));
      log("info", "SAVE", "Monster saved", monster?.id ?? null);
      return true;
    }catch(_err){
      log("error", "SAVE", "Failed to save monster", monster?.id ?? null);
      return false;
    }
  }

  // ====== Game State ======
  const state = {
    day: 1,
    t: 0,
    screen: "menu", // menu | status | feed | toilet | trnmode | trn | trnlog | bttl | bttllog | adv | sleep | heal | edit
    ui: uiState,
    menu: {
      active: false,
      row: 0,
      colByRow: [0, 0],
      alpha: MENU_IDLE_ALPHA,
    },
    logStyle: "normal",
    logParamsByAction: {
      feed: {},
      sleep: {},
      heal: {},
    },
    cursorFlashUntilMs: 0,
    stats: {
      hunger: 6,
      hungerMax: 10,
      mood: 6,
      hygiene: 6,
      ageMin: 0,
      stability: 7,
      stabilityMax: 10,
      damage: 0,
      damageMax: 10,
    },
    detailed: createDefaultDetailedState("mon001"),
    lastDeltaLine: LAST_DELTA_NONE_TEXT,
    trnResultLogText: "",
    bttlResultLogText: "",
    bttl: null,
    mon: { x: 0, y: 0 },
    monster: createAppDefaultMonster("mon001"),

    // time/sleep
    timeMin: 8 * 60,
    isSleeping: false,
    lastFrameTime: performance.now(),
    realLastMs: Date.now(),
    realCarryMs: 0,
    input: {
      cPressed: false,
      cPressedAt: 0,
      cLongFired: false,
      dirHold: {
        left: { pressed: false, startMs: 0, lastMs: 0 },
        right: { pressed: false, startMs: 0, lastMs: 0 },
        up: { pressed: false, startMs: 0, lastMs: 0 },
        down: { pressed: false, startMs: 0, lastMs: 0 },
      },
    },

    // editor
    editor: {
      grid: makeEmptySprite(),
      cursorX: 0,
      cursorY: 0,
      pointerId: null,
      drawValue: 1,
      mode: EDITOR_MODE.BROWSE,
      selectedCategory: "FACE",
      selectedPageByCategory: { FACE: 0, ACTION: 0, ICON: 0 },
      cursorIndex: 0, // 0..11
      editingSlotRef: null, // {category, page, index}
      slotsByCategory: { FACE: [], ACTION: [], ICON: [] },
      ghostBaseOn: false,
      selectState: {
        phase: 0, // 0=start wait, 1=end wait
        start: null,
        end: null,
        contextOpen: false,
        contextIndex: 0,
        commands: ["COPY", "CUT", "PASTE", "FLIPH", "FLIPV", "SHL", "SHR", "SHU", "SHD", "CANCEL"],
      },
      clipboard: null, // { w, h, bits:number[] }
      pasteMode: "OVR", // OVR | OR (future)
      undoStack: [],
      redoStack: [],
      historyBatchSnapshot: null,
    }
  };

  function modeFromScreen(screen){
    return screen === "menu" ? "IDLE" : String(screen).toUpperCase();
  }

  function setMonsterMode(newMode){
    const changed = runtimeSetMode(state.monster, newMode);
    if(changed) log("info", "MODE", `Mode changed to ${newMode}`);
  }

  function syncMonsterModeFromScreen(){
    setMonsterMode(modeFromScreen(state.screen));
  }

  function makeDiffRole(category, page, index){
    if(page === 0){
      return DIFF_ROLE_TEMPLATES[category]?.[index] ?? `R${index + 1}`;
    }
    const p = page + 1;
    const i = index + 1;
    return `${category[0]}${p}-${i}`;
  }

  function makeDiffSlot(category, page, index){
    return {
      category,
      role: makeDiffRole(category, page, index),
      bitmap: makeEmptySprite(),
      isEmpty: true,
      dirty: false,
    };
  }

  function ensureDiffPage(category, page){
    const pages = state.editor.slotsByCategory[category];
    while(pages.length <= page){
      const p = pages.length;
      pages.push(Array.from({ length: DIFF_PAGE_SIZE }, (_v, i) => makeDiffSlot(category, p, i)));
    }
    return pages[page];
  }

  function getSelectedPage(category){
    return state.editor.selectedPageByCategory[category] ?? 0;
  }

  function setSelectedPage(category, page){
    state.editor.selectedPageByCategory[category] = Math.max(0, page);
    ensureDiffPage(category, state.editor.selectedPageByCategory[category]);
  }

  function getSelectedSlot(){
    const cat = state.editor.selectedCategory;
    const page = getSelectedPage(cat);
    const slots = ensureDiffPage(cat, page);
    const index = clamp(state.editor.cursorIndex, 0, DIFF_PAGE_SIZE - 1);
    return { slot: slots[index], category: cat, page, index };
  }

  function setEditingSlotRef(category, page, index){
    state.editor.editingSlotRef = { category, page, index };
  }

  function getEditingSlot(){
    const ref = state.editor.editingSlotRef;
    if(!ref) return null;
    const slots = ensureDiffPage(ref.category, ref.page);
    return slots[ref.index] ?? null;
  }

  function syncPanePreviewFromSelection(){
    const { slot } = getSelectedSlot();
    state.editor.grid = cloneSprite(slot.isEmpty ? makeEmptySprite() : slot.bitmap);
  }

  function getBaseBitmapForDiffInit(){
    const baseFacePage = ensureDiffPage("FACE", 0);
    const baseSlot = baseFacePage[0];
    if(baseSlot && !baseSlot.isEmpty){
      return cloneSprite(baseSlot.bitmap);
    }
    const view = runtimeGetView(state.monster);
    return isSprite16(view.baseSprite)
      ? cloneSprite(view.baseSprite)
      : cloneSprite(spriteTo01Array(CROW));
  }

  function initSlotFromBase(slot){
    slot.bitmap = getBaseBitmapForDiffInit();
    slot.isEmpty = false;
    slot.dirty = true;
  }

  function gridToKey(grid){
    const rows = spriteToStrings(grid);
    return Array.isArray(rows) ? rows.join("|") : "";
  }

  function cloneCurrentGrid(){
    return cloneSprite(state.editor.grid);
  }

  function resetEditorHistory(){
    state.editor.undoStack = [];
    state.editor.redoStack = [];
    state.editor.historyBatchSnapshot = null;
  }

  function pushUndoSnapshot(snapshot){
    const snapKey = gridToKey(snapshot);
    const last = state.editor.undoStack[state.editor.undoStack.length - 1];
    if(last && gridToKey(last) === snapKey) return;
    state.editor.undoStack.push(cloneSprite(snapshot));
    if(state.editor.undoStack.length > 200){
      state.editor.undoStack.shift();
    }
    state.editor.redoStack = [];
  }

  function beginHistoryBatch(){
    if(state.editor.historyBatchSnapshot) return;
    state.editor.historyBatchSnapshot = cloneCurrentGrid();
  }

  function endHistoryBatch(){
    const snap = state.editor.historyBatchSnapshot;
    state.editor.historyBatchSnapshot = null;
    if(!snap) return;
    if(gridToKey(state.editor.grid) === gridToKey(snap)) return;
    pushUndoSnapshot(snap);
  }

  function applyGridSnapshot(snapshot, markDirty = true){
    state.editor.grid = cloneSprite(snapshot);
    const slot = getEditingSlot();
    if(slot){
      slot.bitmap = cloneSprite(state.editor.grid);
      slot.isEmpty = false;
      if(markDirty) slot.dirty = true;
    }
    applyEditorToMonster();
    saveMonsterSprite();
  }

  function undoEditor(){
    if(state.editor.mode !== EDITOR_MODE.EDIT) return;
    endHistoryBatch();
    if(state.editor.undoStack.length <= 0) return;
    const prev = state.editor.undoStack.pop();
    state.editor.redoStack.push(cloneCurrentGrid());
    applyGridSnapshot(prev, true);
  }

  function redoEditor(){
    if(state.editor.mode !== EDITOR_MODE.EDIT) return;
    endHistoryBatch();
    if(state.editor.redoStack.length <= 0) return;
    const next = state.editor.redoStack.pop();
    state.editor.undoStack.push(cloneCurrentGrid());
    applyGridSnapshot(next, true);
  }

  function resyncEditingSlotFromBaseConfirmed(){
    if(state.editor.mode !== EDITOR_MODE.EDIT) return;
    const slot = getEditingSlot();
    if(!slot) return;
    const ok = window.confirm("Reset current diff to Base(B)? Current edits will be cleared.");
    if(!ok) return;
    pushUndoSnapshot(cloneCurrentGrid());
    initSlotFromBase(slot);
    applyGridSnapshot(slot.bitmap, true);
  }

  function clearSelectedSlotToEmpty(){
    const { slot, category, page, index } = getSelectedSlot();
    slot.bitmap = makeEmptySprite();
    slot.isEmpty = true;
    slot.dirty = false;
    const ref = state.editor.editingSlotRef;
    if(ref && ref.category === category && ref.page === page && ref.index === index){
      state.editor.editingSlotRef = null;
      resetEditorHistory();
    }
    syncPanePreviewFromSelection();
  }

  function startEditingSelectedSlot(){
    const { slot, category, page, index } = getSelectedSlot();
    if(slot.isEmpty){
      initSlotFromBase(slot);
    }
    state.editor.grid = cloneSprite(slot.bitmap);
    state.editor.cursorX = 0;
    state.editor.cursorY = 0;
    setEditingSlotRef(category, page, index);
    state.editor.mode = EDITOR_MODE.EDIT;
    clearSelectionState();
    resetEditorHistory();
  }

  function saveMonsterSprite(){
    state.monster = ensureMonsterSchema(state.monster, state.monster?.id || "mon001");
    syncMonsterModeFromScreen();

    saveWithVersion(state.monster);
  }

  function loadMonsterSprite(){
    const parsed = safeParse(localStorage.getItem(MONSTER_STORAGE_KEY));
    const raw = migrateSave(parsed);
    if(raw){
      if(raw.version === SAVE_SCHEMA_VERSION){
        state.monster = ensureMonsterSchema(raw.monster, "mon001");
        log("info", "LOAD", "Monster loaded", state.monster.id);
        return;
      }
      if(raw.version === undefined){
        log("info", "SAVE_MIGRATION", "Old save format detected. Migrating to v1");
        state.monster = ensureMonsterSchema(raw, "mon001");
        saveMonsterSprite();
        log("info", "LOAD", "Monster loaded", state.monster.id);
        return;
      }
      log("warn", "SAVE_VERSION", "Version mismatch", raw.version);
      state.monster = createAppDefaultMonster("mon001");
      saveMonsterSprite();
      log("info", "LOAD", "Monster loaded", state.monster.id);
      return;
    }

    // backward compatibility: very old saves only had sprite rows.
    const legacyRows = safeParse(localStorage.getItem(SPRITE_STORAGE_KEY));
    const loaded = decodeSprite(legacyRows);
    if(loaded){
      state.monster = ensureMonsterSchema(state.monster, "mon001");
      editorApplyPatch(state.monster, {
        type: "SET_BASE_SPRITE",
        sprite: loaded,
      });
      saveMonsterSprite();
      log("info", "LOAD", "Monster loaded", state.monster.id);
      return;
    }

    state.monster = createAppDefaultMonster("mon001");
    saveMonsterSprite();
    log("info", "LOAD", "Monster loaded", state.monster.id);
  }

  function initDiffEditorSlots(){
    const basePage = ensureDiffPage("FACE", 0);
    const baseSlot = basePage[0];
    baseSlot.bitmap = getBaseBitmapForDiffInit();
    baseSlot.isEmpty = false;
    baseSlot.dirty = false;
    setEditingSlotRef("FACE", 0, 0);
  }

  // ===== time sync (boot) =====
  function loadTimeSync(){
    const now = Date.now();
    const last = Number(localStorage.getItem("dotmon_lastRealMs") || now);

    const d = new Date();
    state.timeMin = d.getHours() * 60 + d.getMinutes();

    state.realLastMs = Date.now();
    state.realCarryMs = 0;

    // 蟆・擂謾ｾ鄂ｮ險育ｮ礼畑
    const deltaMin = Math.floor((now - last) / 60000);
    void deltaMin;
  }
  function saveTimeSync(){
    localStorage.setItem("dotmon_lastRealMs", String(Date.now()));
  }
  loadTimeSync();
  loadMonsterSprite();
  loadDetailedState();
  updateDetailedMetricsRealtime(Date.now());
  saveDetailedState();
  initDiffEditorSlots();

  const MENU_ROWS = [
    [
      { id: "stat", label: "STAT" },
      { id: "feed", label: "FEED" },
      { id: "trn",  label: "TRN"  },
      { id: "bttl", label: "BTTL" },
      { id: "adv",  label: "ADV"  },
    ],
    [
      { id: "wc",    label: "WC"    },
      { id: "sleep", label: "SLEEP" },
      { id: "heal",  label: "HEAL"  },
      ...(DEBUG_MENU ? [{ id: "edit", label: "EDIT" }] : []),
    ],
  ];

  // ====== Helpers ======
  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function menuItemsAt(row){ return MENU_ROWS[row] ?? MENU_ROWS[0]; }
  function menuColAt(row){
    const items = menuItemsAt(row);
    return clamp(state.menu.colByRow[row], 0, Math.max(0, items.length - 1));
  }
  function menuCurrentItem(){
    const row = state.menu.row;
    const col = menuColAt(row);
    return menuItemsAt(row)[col];
  }
  function menuActivate(){
    state.menu.active = true;
  }
  function menuDeactivate(){
    state.menu.active = false;
  }
  function markCursorMoved(){
    state.cursorFlashUntilMs = uiCursorOnMoved(performance.now());
  }
  function menuShiftRow(nextRow, preferredCol = null){
    const prevRow = state.menu.row;
    const prevCol = menuColAt(prevRow);
    const row = clamp(nextRow, 0, MENU_ROWS.length - 1);
    state.menu.row = row;
    const items = menuItemsAt(row);
    const baseCol = (preferredCol == null) ? state.menu.colByRow[row] : preferredCol;
    state.menu.colByRow[row] = clamp(baseCol, 0, Math.max(0, items.length - 1));
    const nextCol = menuColAt(state.menu.row);
    return (prevRow !== state.menu.row) || (prevCol !== nextCol);
  }
  function menuMoveHorizontal(delta){
    const row = state.menu.row;
    const items = menuItemsAt(row);
    if(items.length <= 0) return false;
    const now = menuColAt(row);
    const len = items.length;
    const next = (now + delta + len) % len;
    if(next === now) return false;
    state.menu.colByRow[row] = next;
    return true;
  }

  function gameHHMM(){
    const hh = String(Math.floor(state.timeMin / 60)).padStart(2, "0");
    const mm = String(state.timeMin % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function isNight(){
    return (state.timeMin >= 21*60) || (state.timeMin < 7*60);
  }

  function resolveBitmapScale(opts = {}){
    if(Number.isInteger(opts.scale) && opts.scale > 0) return opts.scale;
    if(typeof opts.font === "string"){
      const m = opts.font.match(/^(\d+)px/i);
      if(m){
        const px = Number(m[1]);
        if(Number.isFinite(px)){
          if(px <= 11) return 1;
          return Number.isInteger(DEFAULT_TEXT_SCALE) ? DEFAULT_TEXT_SCALE : 2;
        }
      }
    }
    return Number.isInteger(DEFAULT_TEXT_SCALE) ? DEFAULT_TEXT_SCALE : 2;
  }

  function drawText(x, y, text, opts = {}){
    const scale = resolveBitmapScale(opts);
    const letterSpacing = Number.isInteger(opts.letterSpacing) ? opts.letterSpacing : 0;
    const align = opts.align ?? "left";
    const colorMode = opts.colorMode ?? "on";
    const color = opts.color ?? "rgba(14,20,15,0.85)";
    uiTextDraw(ctx, String(text), Math.round(x), Math.round(y), {
      scale,
      letterSpacing,
      align,
      colorMode,
      color,
    });
  }

  function drawBox(x, y, w, h){
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function drawBar(x, y, label, val, max){
    drawText(x, y, `${label}:`);
    const bx = x + 62, by = y + 2, bw = 110, bh = 10;

    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.55)";
    ctx.strokeRect(bx, by, bw, bh);

    const fillW = Math.round((bw - 2) * (val / max));
    ctx.fillStyle = "rgba(14,20,15,0.55)";
    ctx.fillRect(bx + 1, by + 1, fillW, bh - 2);
    ctx.restore();

    drawText(bx + bw + 10, y, `${val}/${max}`);
  }

  function readMetricNumber(value){
    if(value == null) return null;
    const num = Number(value);
    if(!Number.isFinite(num)) return null;
    return num;
  }

  function formatMetricNumber(value){
    if(value == null) return "--";
    const rounded = Math.round(value);
    if(Math.abs(value - rounded) < 0.001){
      return String(rounded);
    }
    return value.toFixed(1);
  }

  function formatMetricPair(currentValue, maxValue){
    const current = readMetricNumber(currentValue);
    const max = readMetricNumber(maxValue);
    if(current == null) return "--";
    if(max == null || max <= 0) return formatMetricNumber(current);
    return `${formatMetricNumber(current)}/${formatMetricNumber(max)}`;
  }

  function calcMetricRatio(currentValue, maxValue){
    const current = readMetricNumber(currentValue);
    const max = readMetricNumber(maxValue);
    if(current == null) return null;
    if(max == null || max <= 0) return null;
    return clamp(current / max, 0, 1);
  }

  function getStatusRows(){
    return [
      {
        label: "HP",
        value: formatMetricPair(state.monster?.runtimeState?.hp, state.monster?.stats?.maxHp),
        ratio: calcMetricRatio(state.monster?.runtimeState?.hp, state.monster?.stats?.maxHp),
      },
      {
        label: "スタミナ",
        value: formatMetricPair(state.monster?.runtimeState?.stamina, state.monster?.stats?.staminaMax),
        ratio: calcMetricRatio(state.monster?.runtimeState?.stamina, state.monster?.stats?.staminaMax),
      },
      {
        label: "充足値",
        value: formatMetricPair(state.stats?.hunger, state.stats?.hungerMax),
        ratio: calcMetricRatio(state.stats?.hunger, state.stats?.hungerMax),
      },
      {
        label: "損傷",
        value: formatMetricPair(state.stats?.damage, state.stats?.damageMax),
        ratio: calcMetricRatio(state.stats?.damage, state.stats?.damageMax),
      },
      {
        label: "安定度",
        value: formatMetricPair(state.stats?.stability, state.stats?.stabilityMax),
        ratio: calcMetricRatio(state.stats?.stability, state.stats?.stabilityMax),
      },
    ];
  }

  function resolveAdStateText(adIntegrity){
    const value = clamp(toNumber(adIntegrity, 100), 0, 100);
    if(value >= 80) return "正常";
    if(value >= 60) return "軽微な劣化";
    if(value >= 40) return "破損";
    if(value >= 20) return "重度破損";
    return "崩壊寸前";
  }

  function resolveSignalTierText(signalQuality){
    const value = clamp(toNumber(signalQuality, 100), 0, 100);
    if(value >= 80) return "安定";
    if(value >= 60) return "軽微なノイズ";
    if(value >= 40) return "断続的乱れ";
    if(value >= 20) return "深刻な劣化";
    return "崩壊寸前";
  }

  function resolveConditionSummary(adIntegrity, signalQuality){
    const hpMax = getRuntimeMax("hp", 100);
    const hpNow = clamp(getRuntimeStat("hp", hpMax), 0, hpMax);
    const hpRatio = hpMax > 0 ? hpNow / hpMax : 0;
    const damageMax = toPositiveInt(state.stats?.damageMax, 10);
    const damage = clamp(toNumber(state.stats?.damage, 0), 0, damageMax);
    const damageRatio = damageMax > 0 ? damage / damageMax : 0;
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stability = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stability / stabilityMax : 0;
    const ad = clamp(toNumber(adIntegrity, 100), 0, 100);
    const signal = clamp(toNumber(signalQuality, 100), 0, 100);

    if(hpRatio < 0.25 || ad < 20 || signal < 20){
      return "危険";
    }
    if(damageRatio > 0.6 || ad < 40 || signal < 40 || stabilityRatio < 0.4){
      return "不安定";
    }
    if(state.isSleeping){
      return state.detailed?.isTuckedIn ? "睡眠安定" : "睡眠中";
    }
    return "安定";
  }

  function resolveTemperamentText(){
    const personality = isRecord(state.monster?.personality) ? state.monster.personality : {};
    const aggression = toNumber(personality.aggression, 0);
    const curiosity = toNumber(personality.curiosity, 0);
    const calmness = toNumber(personality.calmness, 0);
    const maxValue = Math.max(aggression, curiosity, calmness);
    if(maxValue <= 0){
      return "中庸";
    }
    if(maxValue === calmness){
      return "穏健型";
    }
    if(maxValue === curiosity){
      return "探索型";
    }
    return "闘争型";
  }

  function formatWeightKgNumber(){
    const weight = toNumber(state.monster?.weight, NaN);
    if(!Number.isFinite(weight)) return "--";
    const normalized = Math.max(0, weight);
    return normalized.toFixed(1);
  }

  function resolveMutationSummary(){
    const stageRaw = Number(state.monster?.stage);
    const stageNum = Number.isFinite(stageRaw) ? stageRaw : 1;
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stability = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stability / stabilityMax : 0;
    if(stageNum > 1){
      return stabilityRatio >= 0.6
        ? "進化兆候あり（安定傾向）"
        : "進化兆候あり（不安定）";
    }
    return stabilityRatio >= 0.6 ? "進化兆候なし（安定）" : "進化兆候なし";
  }

  function resolveSyncRate(adIntegrity, signalQuality){
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stability = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityScore = stabilityMax > 0 ? (stability / stabilityMax) * 100 : 0;
    const ad = clamp(toNumber(adIntegrity, 100), 0, 100);
    const signal = clamp(toNumber(signalQuality, 100), 0, 100);
    return clamp(Math.round((ad + signal + stabilityScore) / 3), 0, 100);
  }

  function resolveWinRatePercent(){
    const detail = isRecord(state.detailed) ? state.detailed : {};
    const battleCount = Math.max(0, Math.floor(toNumber(detail.battleCount, 0)));
    const battleWins = clamp(Math.floor(toNumber(detail.battleWins, 0)), 0, battleCount);
    if(battleCount <= 0) return 0;
    return clamp(Math.round((battleWins / battleCount) * 100), 0, 100);
  }

  function getStatusPage2Lines(){
    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    const adIntegrity = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const signalQuality = Math.min(clamp(toNumber(detail.signalQuality, 100), 0, 100), adIntegrity);
    const adStateText = resolveAdStateText(adIntegrity);
    const signalTierText = resolveSignalTierText(signalQuality);
    const trendArrow = (detail.signalTrend === "↑" || detail.signalTrend === "↓" || detail.signalTrend === "→")
      ? detail.signalTrend
      : "→";
    const conditionSummary = resolveConditionSummary(adIntegrity, signalQuality);
    const temperamentText = resolveTemperamentText();
    const weightKg = formatWeightKgNumber();
    const mutationSummary = resolveMutationSummary();
    const syncRate = resolveSyncRate(adIntegrity, signalQuality);
    const battleCount = Math.max(0, Math.floor(toNumber(detail.battleCount, 0)));
    const winRate = resolveWinRatePercent();
    const lastDelta = (typeof state.lastDeltaLine === "string" && state.lastDeltaLine.trim().length > 0)
      ? state.lastDeltaLine
      : LAST_DELTA_NONE_TEXT;

    return [
      { text: `DAY：${state.day}`, isSeparator: false },
      { text: `AD：${adStateText}`, isSeparator: false },
      { text: `信号品質：${signalTierText} ${trendArrow}`, isSeparator: false },
      { text: `コンディション：${conditionSummary}`, isSeparator: false },
      { text: `気質：${temperamentText}`, isSeparator: false },
      { text: `体重：${weightKg}kg`, isSeparator: false },
      { text: `変質度：${mutationSummary}`, isSeparator: false },
      { text: `同調率：${syncRate}%`, isSeparator: false },
      { text: `戦闘数：${battleCount}`, isSeparator: false },
      { text: `勝率：${winRate}%`, isSeparator: false },
      { text: "――――――――", isSeparator: true },
      { text: `直近変化  ${lastDelta}`, isSeparator: false },
    ];
  }

  function drawSprite16x16(x, y, sprite, dotScale){
    ctx.save();
    for(let r=0;r<SPRITE_SIZE;r++){
      for(let c=0;c<SPRITE_SIZE;c++){
        const v = sprite[r][c];
        if(!v) continue;
        // 1=body, 2=accent
        ctx.fillStyle = (v === 2)
          ? "rgba(14,20,15,0.85)"
          : "rgba(14,20,15,0.70)";
        ctx.fillRect(x + c*dotScale, y + r*dotScale, dotScale, dotScale);
      }
    }
    ctx.restore();
  }

  function drawSprite16x16Facing(x, y, sprite, dotScale, facing = "right"){
    if(facing !== "left"){
      drawSprite16x16(x, y, sprite, dotScale);
      return;
    }
    const w = SPRITE_SIZE * dotScale;
    ctx.save();
    ctx.translate(Math.round(x + w), Math.round(y));
    ctx.scale(-1, 1);
    drawSprite16x16(0, 0, sprite, dotScale);
    ctx.restore();
  }

  function getBttlProjectileMask(){
    if(getBttlProjectileMask.cache){
      return getBttlProjectileMask.cache;
    }
    const grid = BTTL_PROJECTILE_PIXEL_GRID;
    const fill = Array.from({ length: grid }, () => Array(grid).fill(false));
    const edge = Array.from({ length: grid }, () => Array(grid).fill(false));
    const cy = grid / 2;
    for(let y = 0; y < grid; y++){
      for(let x = 0; x < grid; x++){
        const nx = x + 0.5;
        const ny = y + 0.5;
        const halfHeight = ((grid - nx) / grid) * (grid / 2);
        if(Math.abs(ny - cy) <= halfHeight){
          fill[y][x] = true;
        }
      }
    }
    // Round hard corners so the projectile feels closer to sprite pixels.
    let roundedFill = fill.map((row) => row.slice());
    for(let pass = 0; pass < BTTL_PROJECTILE_ROUND_PASSES; pass++){
      const next = roundedFill.map((row) => row.slice());
      for(let y = 0; y < grid; y++){
        for(let x = 0; x < grid; x++){
          if(!roundedFill[y][x]){
            continue;
          }
          const up = y > 0 && roundedFill[y - 1][x];
          const down = y < (grid - 1) && roundedFill[y + 1][x];
          const left = x > 0 && roundedFill[y][x - 1];
          const right = x < (grid - 1) && roundedFill[y][x + 1];
          const orthCount = (up ? 1 : 0) + (down ? 1 : 0) + (left ? 1 : 0) + (right ? 1 : 0);
          const isConvexCorner = (
            (!up && !left) ||
            (!up && !right) ||
            (!down && !left) ||
            (!down && !right)
          );
          if(isConvexCorner && orthCount <= 2){
            next[y][x] = false;
          }
        }
      }
      roundedFill = next;
    }
    for(let y = 0; y < grid; y++){
      for(let x = 0; x < grid; x++){
        if(!roundedFill[y][x]){
          continue;
        }
        const touchesOutside = (
          x === 0 || y === 0 || x === (grid - 1) || y === (grid - 1) ||
          !roundedFill[y][x - 1] || !roundedFill[y][x + 1] || !roundedFill[y - 1][x] || !roundedFill[y + 1][x]
        );
        if(touchesOutside){
          edge[y][x] = true;
        }
      }
    }
    const mask = { grid, fill: roundedFill, edge };
    getBttlProjectileMask.cache = mask;
    return mask;
  }

  function drawBttlProjectileShape(x, y, owner, size){
    const mask = getBttlProjectileMask();
    const drawSize = getBttlProjectileDrawSize(size);
    const dot = Math.max(1, Math.round(drawSize / mask.grid));
    const left = Math.round(x - (drawSize / 2));
    const top = Math.round(y - (drawSize / 2));
    const isEnemy = owner === "enemy";
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BTTL_PROJECTILE_COLOR;
    for(let gy = 0; gy < mask.grid; gy++){
      for(let gx = 0; gx < mask.grid; gx++){
        const srcX = isEnemy ? (mask.grid - 1 - gx) : gx;
        if(!mask.fill[gy][srcX]){
          continue;
        }
        if(isEnemy && !mask.edge[gy][srcX]){
          // Enemy projectile is transparent inside, only outline pixels remain.
          continue;
        }
        ctx.fillRect(left + (gx * dot), top + (gy * dot), dot, dot);
      }
    }
    ctx.restore();
  }

  function drawCursorTriangle(x, y){
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.85)";
    ctx.fillRect(x,     y + 2, 2, 2);
    ctx.fillRect(x + 2, y + 1, 2, 4);
    ctx.fillRect(x + 4, y,     2, 6);
    ctx.restore();
  }

  function drawMenuRow(x, y, w, h, row, alpha, showCursor){
    const items = menuItemsAt(row);
    const col = menuColAt(row);
    const itemW = w / items.length;
    const rowSafeInset = row === 0 ? TOP_MENU_CURSOR_SAFE_INSET_PX : 0;
    const labelOpt = { scale: 2, color: "rgba(14,20,15,0.85)" };
    const labelY = Math.floor(y + 8);
    const labelScale = Number.isInteger(labelOpt.scale) && labelOpt.scale > 0
      ? labelOpt.scale
      : DEFAULT_TEXT_SCALE;
    const fontPxH = BITMAP_GLYPH_H * labelScale;
    const cursorWidth = Number(uiTextMeasure("▶", labelOpt)?.width) || 0;
    const baselineY = (row === 1)
      ? Math.floor(labelY - MENU_BASELINE_GAP_PX)
      : Math.floor(labelY + fontPxH + MENU_BASELINE_GAP_PX);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = `rgba(14,20,15,${MENU_BASELINE_ALPHA})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.floor(x), baselineY);
    ctx.lineTo(Math.floor(x + w - 1), baselineY);
    ctx.stroke();
    ctx.restore();

    for(let i=0; i<items.length; i++){
      const cellX = x + i * itemW;
      const labelRectX = cellX + rowSafeInset;
      const labelRectW = Math.max(1, itemW - rowSafeInset);
      const label = items[i].label;
      const selected = state.menu.active && row === state.menu.row && i === col;

      if(selected){
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(14,20,15,0.12)";
        ctx.fillRect(Math.round(cellX + 4), y + 4, Math.round(itemW - 8), h - 8);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      uiTextDrawInRect(
        ctx,
        label,
        { x: labelRectX, y: labelY, w: labelRectW, h },
        "center",
        labelOpt
      );
      ctx.restore();

      if(selected && showCursor){
        const labelCenterX = Math.floor(labelRectX + (labelRectW / 2));
        const labelWidth = Number(uiTextMeasure(label, labelOpt)?.width) || 0;
        const labelLeftX = Math.floor(labelCenterX - (labelWidth / 2));
        const cursorX = Math.floor(labelLeftX - cursorWidth - CURSOR_GAP);
        ctx.save();
        ctx.globalAlpha = alpha;
        drawCursorTriangle(cursorX, labelY);
        ctx.restore();
      }
    }
  }

  function drawMainMenu(showCursor){
    const x = 24;
    const w = W - 48;
    const rowH = 28;
    const topY = 64;
    const bottomY = (H - 82) + BOTTOM_MENU_Y_OFFSET;
    drawMenuRow(x, topY, w, rowH, 0, state.menu.alpha, showCursor);
    drawMenuRow(x, bottomY, w, rowH, 1, state.menu.alpha, showCursor);
  }

  // ===== idle anim =====
  function getIdleMonsterAnim(t, view){
    const jiggleSpeed = 55;
    const jiggleX = (Math.floor(t / jiggleSpeed) % 2 === 0) ? 0 : 1;

    const blinkCycle = 360;
    const blinkLen = 24;
    const isBlink = (t % blinkCycle) >= (blinkCycle - blinkLen);

    const hopCycle = 300;
    const hopLen = 20;
    const hopPhase = t % hopCycle;

    let hopY = 0;
    if(hopPhase < hopLen){
      const half = Math.floor(hopLen / 2);
      const up = (hopPhase <= half) ? hopPhase : (hopLen - 1 - hopPhase);
      hopY = -Math.min(5, up);
    }

    const jiggleY = (Math.floor(t / 180) % 4 === 0) ? 1 : 0;
    const baseSprite = isSprite16(view?.baseSprite) ? view.baseSprite : makeEmptySprite();
    const faceSprite = isSprite16(view?.faceSprite) ? view.faceSprite : baseSprite;
    const actionSprite = isSprite16(view?.action?.sprite) ? view.action.sprite : null;

    return {
      sprite: actionSprite || (isBlink ? faceSprite : baseSprite),
      ox: jiggleX,
      oy: jiggleY + hopY
    };
  }

  // ===== editor =====
  function enterEditor(loadCurrent = true){
    state.screen = "edit";
    if(loadCurrent) syncPanePreviewFromSelection();
    else state.editor.grid = makeEmptySprite();
    state.editor.mode = EDITOR_MODE.BROWSE;
    clearSelectionState();
    resetEditorHistory();
    state.editor.cursorX = 0;
    state.editor.cursorY = 0;
  }

  function applyEditorToMonster(){
    state.monster = ensureMonsterSchema(state.monster, "mon001");
    editorApplyPatch(state.monster, {
      type: "SET_BASE_SPRITE",
      sprite: state.editor.grid,
    });
  }

  function syncEditorToMonsterAndSave(){
    const slot = getEditingSlot();
    if(slot){
      slot.bitmap = cloneSprite(state.editor.grid);
      slot.isEmpty = false;
      slot.dirty = true;
    }
    applyEditorToMonster();
    saveMonsterSprite();
  }

  function commitCurrentEditingSlot(){
    endHistoryBatch();
    const slot = getEditingSlot();
    if(slot){
      slot.bitmap = cloneSprite(state.editor.grid);
      slot.isEmpty = false;
      slot.dirty = false;
    }
    applyEditorToMonster();
    saveMonsterSprite();
  }

  function printEditorExport(){
    const grid = state.editor.grid;
    const encoded = spriteToStrings(grid) || [];
    log("info", "EDITOR_EXPORT", "=== DOTMON EXPORT ===");
    log("info", "EDITOR_EXPORT", "Strings");
    log("info", "EDITOR_EXPORT", encoded.map(s => `"${s}",`).join("\n"));
    log("info", "EDITOR_EXPORT", "Array 0/1");
    log("info", "EDITOR_EXPORT", JSON.stringify(spriteTo01Array(grid)));
    log("info", "EDITOR_EXPORT", "=====================");
  }

  function getEditorLayout(){
    const bx = 24, by = 68, bw = W - 48, bh = 168;
    const cell = 8;
    const leftW = 190;
    const paneGap = 8;
    const paneX = bx + leftW + paneGap;
    const paneW = bw - leftW - paneGap;
    const gx = bx + 12;
    const gy = Math.round(by + 14);
    return { bx, by, bw, bh, cell, gx, gy, leftW, paneX, paneW };
  }

  function getEditorCellFromLogicalPoint(px, py){
    const { cell, gx, gy } = getEditorLayout();
    const cx = Math.floor((px - gx) / cell);
    const cy = Math.floor((py - gy) / cell);
    if(cx < 0 || cy < 0 || cx >= SPRITE_SIZE || cy >= SPRITE_SIZE) return null;
    return { x: cx, y: cy };
  }

  function applyEditorCell(x, y, value){
    if(x < 0 || y < 0 || x >= SPRITE_SIZE || y >= SPRITE_SIZE) return;
    if(state.editor.grid[y][x] === value) return;
    state.editor.grid[y][x] = value;
    state.editor.cursorX = x;
    state.editor.cursorY = y;
    syncEditorToMonsterAndSave();
  }

  function clearSelectionState(){
    const sel = state.editor.selectState;
    sel.phase = 0;
    sel.start = null;
    sel.end = null;
    sel.contextOpen = false;
    sel.contextIndex = 0;
  }

  function getSelectionRect(includeCursorPreview = false){
    const sel = state.editor.selectState;
    if(!sel.start) return null;
    const end = (sel.end)
      ? sel.end
      : (includeCursorPreview || sel.phase === 1 ? { x: state.editor.cursorX, y: state.editor.cursorY } : null);
    if(!end) return null;
    const x0 = clamp(Math.min(sel.start.x, end.x), 0, SPRITE_SIZE - 1);
    const y0 = clamp(Math.min(sel.start.y, end.y), 0, SPRITE_SIZE - 1);
    const x1 = clamp(Math.max(sel.start.x, end.x), 0, SPRITE_SIZE - 1);
    const y1 = clamp(Math.max(sel.start.y, end.y), 0, SPRITE_SIZE - 1);
    return { x0, y0, x1, y1, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }

  function copySelectionToClipboard(rect){
    const bits = [];
    for(let y = rect.y0; y <= rect.y1; y++){
      for(let x = rect.x0; x <= rect.x1; x++){
        bits.push(state.editor.grid[y][x] ? 1 : 0);
      }
    }
    state.editor.clipboard = { w: rect.w, h: rect.h, bits };
  }

  function executeCopy(){
    const before = cloneCurrentGrid();
    const rect = getSelectionRect(false);
    if(!rect) return;
    copySelectionToClipboard(rect);
    // Safety: COPY must never mutate grid.
    if(gridToKey(before) !== gridToKey(state.editor.grid)){
      state.editor.grid = before;
    }
    state.editor.cursorX = rect.x0;
    state.editor.cursorY = rect.y0;
    state.editor.mode = EDITOR_MODE.PASTE;
    state.editor.selectState.contextOpen = false;
  }

  function executeCut(){
    const rect = getSelectionRect(false);
    if(!rect) return;
    copySelectionToClipboard(rect);
    pushUndoSnapshot(cloneCurrentGrid());
    for(let y = rect.y0; y <= rect.y1; y++){
      for(let x = rect.x0; x <= rect.x1; x++){
        state.editor.grid[y][x] = 0;
      }
    }
    syncEditorToMonsterAndSave();
    state.editor.cursorX = rect.x0;
    state.editor.cursorY = rect.y0;
    state.editor.mode = EDITOR_MODE.PASTE;
    state.editor.selectState.contextOpen = false;
  }

  function applyPasteToGrid(){
    const cb = state.editor.clipboard;
    if(!cb) return false;
    const sx = state.editor.cursorX;
    const sy = state.editor.cursorY;
    let changed = false;
    pushUndoSnapshot(cloneCurrentGrid());
    for(let y=0; y<cb.h; y++){
      for(let x=0; x<cb.w; x++){
        const tx = sx + x;
        const ty = sy + y;
        if(tx < 0 || ty < 0 || tx >= SPRITE_SIZE || ty >= SPRITE_SIZE) continue;
        const src = cb.bits[y * cb.w + x] ? 1 : 0;
        const dst = state.editor.grid[ty][tx] ? 1 : 0;
        const next = (state.editor.pasteMode === "OR") ? (dst | src) : src;
        if(dst !== next){
          state.editor.grid[ty][tx] = next;
          changed = true;
        }
      }
    }
    if(changed){
      syncEditorToMonsterAndSave();
    }else{
      state.editor.undoStack.pop();
    }
    return changed;
  }

  function executeSelectCommand(cmd){
    if(cmd === "COPY"){ executeCopy(); return; }
    if(cmd === "CUT"){ executeCut(); return; }
    if(cmd === "PASTE"){
      if(!state.editor.clipboard) return;
      state.editor.mode = EDITOR_MODE.PASTE;
      state.editor.selectState.contextOpen = false;
      return;
    }
    if(cmd === "FLIPH"){
      commitGridTransform((src, w, h) => flipHTransform(src, w, h));
      return;
    }
    if(cmd === "FLIPV"){
      commitGridTransform((src, w, h) => flipVTransform(src, w, h));
      return;
    }
    if(cmd === "SHL"){
      commitGridTransform((src, w, h) => shiftTransform(src, w, h, -1, 0));
      return;
    }
    if(cmd === "SHR"){
      commitGridTransform((src, w, h) => shiftTransform(src, w, h, 1, 0));
      return;
    }
    if(cmd === "SHU"){
      commitGridTransform((src, w, h) => shiftTransform(src, w, h, 0, -1));
      return;
    }
    if(cmd === "SHD"){
      commitGridTransform((src, w, h) => shiftTransform(src, w, h, 0, 1));
      return;
    }
    if(cmd === "CANCEL"){
      state.editor.selectState.contextOpen = false;
      clearSelectionState();
      state.editor.mode = EDITOR_MODE.EDIT;
    }
  }

  function canExecuteSelectCommand(cmd){
    const sel = state.editor.selectState;
    const isRangePending = (sel.phase === 1 && sel.start && !sel.end);
    if(cmd === "PASTE" && !state.editor.clipboard) return false;
    if((cmd === "COPY" || cmd === "CUT" || cmd === "FLIPH" || cmd === "FLIPV" || cmd === "SHL" || cmd === "SHR" || cmd === "SHU" || cmd === "SHD") && isRangePending){
      return false;
    }
    return true;
  }

  function getTransformRectOrFull(){
    const sel = state.editor.selectState;
    if(sel.phase === 1 && sel.start && !sel.end){
      // Selection start only: operation not allowed until range is finalized.
      return null;
    }
    const rect = getSelectionRect(false);
    if(rect) return rect;
    return { x0: 0, y0: 0, x1: SPRITE_SIZE - 1, y1: SPRITE_SIZE - 1, w: SPRITE_SIZE, h: SPRITE_SIZE };
  }

  function readRectBits(rect){
    const bits = Array.from({ length: rect.h }, () => Array(rect.w).fill(0));
    for(let y=0; y<rect.h; y++){
      for(let x=0; x<rect.w; x++){
        bits[y][x] = state.editor.grid[rect.y0 + y][rect.x0 + x] ? 1 : 0;
      }
    }
    return bits;
  }

  function writeRectBits(rect, bits){
    let changed = false;
    for(let y=0; y<rect.h; y++){
      for(let x=0; x<rect.w; x++){
        const next = bits[y][x] ? 1 : 0;
        const gy = rect.y0 + y;
        const gx = rect.x0 + x;
        const now = state.editor.grid[gy][gx] ? 1 : 0;
        if(now !== next){
          state.editor.grid[gy][gx] = next;
          changed = true;
        }
      }
    }
    return changed;
  }

  function commitGridTransform(applyFn){
    const rect = getTransformRectOrFull();
    if(!rect) return;
    const src = readRectBits(rect);
    const dst = applyFn(src, rect.w, rect.h);
    if(!dst) return;
    pushUndoSnapshot(cloneCurrentGrid());
    const changed = writeRectBits(rect, dst);
    if(changed){
      syncEditorToMonsterAndSave();
    }else{
      state.editor.undoStack.pop();
    }
  }

  function flipHTransform(src, w, h){
    const out = Array.from({ length: h }, () => Array(w).fill(0));
    for(let y=0; y<h; y++){
      for(let x=0; x<w; x++){
        out[y][x] = src[y][w - 1 - x];
      }
    }
    return out;
  }

  function flipVTransform(src, w, h){
    const out = Array.from({ length: h }, () => Array(w).fill(0));
    for(let y=0; y<h; y++){
      for(let x=0; x<w; x++){
        out[y][x] = src[h - 1 - y][x];
      }
    }
    return out;
  }

  function shiftTransform(src, w, h, dx, dy){
    const out = Array.from({ length: h }, () => Array(w).fill(0));
    for(let y=0; y<h; y++){
      for(let x=0; x<w; x++){
        const sx = x - dx;
        const sy = y - dy;
        out[y][x] = (sx >= 0 && sx < w && sy >= 0 && sy < h) ? src[sy][sx] : 0;
      }
    }
    return out;
  }

  function logicalPointFromPointerEvent(e){
    const rect = canvas.getBoundingClientRect();
    if(rect.width <= 0 || rect.height <= 0) return null;
    const px = (e.clientX - rect.left) * (W / rect.width);
    const py = (e.clientY - rect.top) * (H / rect.height);
    return { x: px, y: py };
  }

  function selectCategoryByOffset(delta){
    const now = DIFF_CATEGORIES.indexOf(state.editor.selectedCategory);
    const len = DIFF_CATEGORIES.length;
    const next = (now + delta + len) % len;
    state.editor.selectedCategory = DIFF_CATEGORIES[next];
    ensureDiffPage(state.editor.selectedCategory, getSelectedPage(state.editor.selectedCategory));
    syncPanePreviewFromSelection();
  }

  function movePaneHorizontal(delta){
    const prevCategory = state.editor.selectedCategory;
    const prevPage = getSelectedPage(prevCategory);
    const prevIndex = state.editor.cursorIndex;
    const col = state.editor.cursorIndex % DIFF_GRID_COLS;
    const row = Math.floor(state.editor.cursorIndex / DIFF_GRID_COLS);
    if(delta < 0 && col === 0){
      selectCategoryByOffset(-1);
      state.editor.cursorIndex = row * DIFF_GRID_COLS + (DIFF_GRID_COLS - 1);
      syncPanePreviewFromSelection();
      return true;
    }
    if(delta > 0 && col === (DIFF_GRID_COLS - 1)){
      selectCategoryByOffset(1);
      state.editor.cursorIndex = row * DIFF_GRID_COLS;
      syncPanePreviewFromSelection();
      return true;
    }
    state.editor.cursorIndex = clamp(state.editor.cursorIndex + delta, 0, DIFF_PAGE_SIZE - 1);
    syncPanePreviewFromSelection();
    const nextCategory = state.editor.selectedCategory;
    const nextPage = getSelectedPage(nextCategory);
    return (
      prevCategory !== nextCategory ||
      prevPage !== nextPage ||
      prevIndex !== state.editor.cursorIndex
    );
  }

  function movePaneVertical(delta){
    const prevCategory = state.editor.selectedCategory;
    const prevPage = getSelectedPage(prevCategory);
    const prevIndex = state.editor.cursorIndex;
    const col = state.editor.cursorIndex % DIFF_GRID_COLS;
    const row = Math.floor(state.editor.cursorIndex / DIFF_GRID_COLS);
    const cat = state.editor.selectedCategory;
    const page = getSelectedPage(cat);

    if(delta < 0){
      if(row > 0){
        state.editor.cursorIndex -= DIFF_GRID_COLS;
        syncPanePreviewFromSelection();
        return true;
      }
      if(page > 0){
        setSelectedPage(cat, page - 1);
        state.editor.cursorIndex = (DIFF_GRID_ROWS - 1) * DIFF_GRID_COLS + col;
        syncPanePreviewFromSelection();
        return true;
      }
      return false;
    }

    if(row < (DIFF_GRID_ROWS - 1)){
      state.editor.cursorIndex += DIFF_GRID_COLS;
      syncPanePreviewFromSelection();
      return true;
    }
    setSelectedPage(cat, page + 1);
    state.editor.cursorIndex = col;
    syncPanePreviewFromSelection();
    const nextCategory = state.editor.selectedCategory;
    const nextPage = getSelectedPage(nextCategory);
    return (
      prevCategory !== nextCategory ||
      prevPage !== nextPage ||
      prevIndex !== state.editor.cursorIndex
    );
  }

  function switchEditingSlotInCategory(delta){
    endHistoryBatch();
    const ref = state.editor.editingSlotRef;
    if(!ref) return;
    if(delta < 0 && ref.page === 0 && ref.index === 0) return;

    let page = ref.page;
    let index = ref.index + delta;
    while(index < 0){
      if(page === 0){ index = 0; break; }
      page -= 1;
      index += DIFF_PAGE_SIZE;
    }
    while(index >= DIFF_PAGE_SIZE){
      page += 1;
      index -= DIFF_PAGE_SIZE;
    }

    const slot = ensureDiffPage(ref.category, page)[index];
    state.editor.selectedCategory = ref.category;
    setSelectedPage(ref.category, page);
    state.editor.cursorIndex = index;
    setEditingSlotRef(ref.category, page, index);
    if(slot.isEmpty){
      initSlotFromBase(slot);
    }
    state.editor.grid = cloneSprite(slot.bitmap);
    syncEditorToMonsterAndSave();
    resetEditorHistory();
  }

  function drawDiffPane(layout){
    const { paneX, paneW, by, bh } = layout;
    const titleY = by + 6;
    const slotsY = by + 24;
    const slotsH = bh - 30;
    const cellW = Math.floor((paneW - 8) / DIFF_GRID_COLS);
    const cellH = Math.floor((slotsH - 8) / DIFF_GRID_ROWS);
    const cat = state.editor.selectedCategory;
    const page = getSelectedPage(cat);
    const slots = ensureDiffPage(cat, page);
    const editingRef = state.editor.editingSlotRef;

    drawBox(paneX, by, paneW, bh);
    drawText(paneX + 6, titleY, `${cat}  P${page + 1}`);

    for(let i=0; i<DIFF_PAGE_SIZE; i++){
      const row = Math.floor(i / DIFF_GRID_COLS);
      const col = i % DIFF_GRID_COLS;
      const x = paneX + 4 + col * cellW;
      const y = slotsY + 4 + row * cellH;
      const slot = slots[i];
      const isSelected = (state.editor.cursorIndex === i);
      const isEditing = !!editingRef && editingRef.category === cat && editingRef.page === page && editingRef.index === i;

      ctx.save();
      ctx.strokeStyle = isSelected ? "rgba(14,20,15,0.90)" : "rgba(14,20,15,0.35)";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(x, y, cellW - 4, cellH - 4);
      if(isEditing){
        ctx.fillStyle = "rgba(14,20,15,0.10)";
        ctx.fillRect(x + 1, y + 1, cellW - 6, cellH - 6);
      }
      ctx.restore();

      let label = slot.role;
      if(slot.dirty) label += "*";
      if(slot.isEmpty) label = "--";
      drawText(x + 3, y + cellH - 17, label, { font: "10px monospace" });

      if(!slot.isEmpty){
        drawSprite16x16(x + 3, y + 3, slot.bitmap, 1);
      }
    }
  }

  function drawBaseGhostOnEditorGrid(gx, gy, cell){
    if(!state.editor.ghostBaseOn || state.editor.mode !== EDITOR_MODE.EDIT) return;
    const base = getBaseBitmapForDiffInit();
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.16)";
    for(let r=0; r<SPRITE_SIZE; r++){
      for(let c=0; c<SPRITE_SIZE; c++){
        if(!base[r][c]) continue;
        ctx.fillRect(gx + c*cell + 2, gy + r*cell + 2, cell - 4, cell - 4);
      }
    }
    ctx.restore();
  }

  function drawSelectionOverlay(gx, gy, cell){
    if(state.editor.mode !== EDITOR_MODE.SELECT) return;
    const rect = getSelectionRect(true);
    if(!rect) return;
    const x = gx + rect.x0 * cell;
    const y = gy + rect.y0 * cell;
    const w = rect.w * cell;
    const h = rect.h * cell;
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.82)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.restore();
  }

  function drawPasteGhost(gx, gy, cell){
    if(state.editor.mode !== EDITOR_MODE.PASTE) return;
    const cb = state.editor.clipboard;
    if(!cb) return;
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.25)";
    for(let y=0; y<cb.h; y++){
      for(let x=0; x<cb.w; x++){
        const bit = cb.bits[y * cb.w + x];
        if(!bit) continue;
        const tx = state.editor.cursorX + x;
        const ty = state.editor.cursorY + y;
        if(tx < 0 || ty < 0 || tx >= SPRITE_SIZE || ty >= SPRITE_SIZE) continue;
        ctx.fillRect(gx + tx*cell + 1, gy + ty*cell + 1, cell - 2, cell - 2);
      }
    }
    ctx.restore();
  }

  function drawSelectContextMenu(layout){
    const sel = state.editor.selectState;
    if(state.editor.mode !== EDITOR_MODE.SELECT || !sel.contextOpen) return;
    const x = layout.bx + 6;
    const y = layout.by + 34;
    const w = 98;
    const rowH = 12;
    const h = rowH * sel.commands.length + 8;
    ctx.save();
    ctx.fillStyle = "rgba(200,214,194,0.96)";
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
    ctx.restore();
    drawBox(x, y, w, h);
    for(let i=0; i<sel.commands.length; i++){
      const cmd = sel.commands[i];
      const isPasteDisabled = (cmd === "PASTE" && !state.editor.clipboard);
      const isRangePending = (sel.phase === 1 && sel.start && !sel.end);
      const needsFinalRange = (cmd === "COPY" || cmd === "CUT" || cmd === "FLIPH" || cmd === "FLIPV" || cmd === "SHL" || cmd === "SHR" || cmd === "SHU" || cmd === "SHD");
      const isDisabled = isPasteDisabled || (needsFinalRange && isRangePending);
      if(i === sel.contextIndex){
        ctx.save();
        ctx.fillStyle = "rgba(14,20,15,0.18)";
        ctx.fillRect(x + 2, y + 4 + i*rowH, w - 4, rowH);
        ctx.restore();
      }
      drawText(x + 8, y + 5 + i*rowH, cmd, {
        font: "10px monospace",
        color: isDisabled ? "rgba(14,20,15,0.35)" : "rgba(14,20,15,0.82)",
      });
    }
  }

  function drawEditor(showCursor){
    hudTitle.textContent = "EDIT";
    if(state.editor.mode === EDITOR_MODE.EDIT){
      hudHint.textContent = t("ui.help.editor.edit");
    }else if(state.editor.mode === EDITOR_MODE.SELECT){
      hudHint.textContent = t("ui.help.editor.select");
    }else if(state.editor.mode === EDITOR_MODE.PASTE){
      const cb = state.editor.clipboard;
      const sizeText = cb ? `${cb.w}x${cb.h}` : "--";
      hudHint.textContent = t("ui.help.editor.paste", {
        mode: state.editor.pasteMode,
        size: sizeText,
      });
    }else{
      hudHint.textContent = t("ui.help.editor.browse");
    }

    // editor area
    const layout = getEditorLayout();
    const { bx, by, bw, bh, cell, gx, gy, leftW } = layout;
    drawBox(bx, by, bw, bh);
    drawBox(bx + 2, by + 2, leftW - 4, bh - 4);
    drawText(bx + 8, by + bh - 14, `MODE:${state.editor.mode.toUpperCase()}`, { font: "11px monospace" });

    // mini preview
    const prevScale = 2;
    const prevPx = SPRITE_SIZE * prevScale;
    const prevWinW = prevPx + 4;
    const prevWinH = prevPx + 16;
    const prevWinX = bx + leftW - prevWinW - 8;
    const prevWinY = by + bh - prevWinH - 22;
    drawBox(prevWinX, prevWinY, prevWinW, prevWinH);
    drawText(prevWinX + 3, prevWinY + 2, "PRV", { font: "9px monospace" });
    drawSprite16x16(prevWinX + 2, prevWinY + 12, state.editor.grid, prevScale);

    // grid lines faint
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.12)";
    for(let i=0;i<=SPRITE_SIZE;i++){
      ctx.beginPath();
      ctx.moveTo(gx, gy + i*cell);
      ctx.lineTo(gx + SPRITE_SIZE*cell, gy + i*cell);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(gx + i*cell, gy);
      ctx.lineTo(gx + i*cell, gy + SPRITE_SIZE*cell);
      ctx.stroke();
    }
    ctx.restore();

    drawBaseGhostOnEditorGrid(gx, gy, cell);

    // pixels
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.70)";
    for(let r=0;r<SPRITE_SIZE;r++){
      for(let c=0;c<SPRITE_SIZE;c++){
        if(state.editor.grid[r][c]){
          ctx.fillRect(gx + c*cell + 1, gy + r*cell + 1, cell-2, cell-2);
        }
      }
    }
    ctx.restore();

    drawPasteGhost(gx, gy, cell);
    drawSelectionOverlay(gx, gy, cell);

    // cursor
    if(state.editor.mode !== EDITOR_MODE.BROWSE && showCursor){
      const cx = gx + state.editor.cursorX*cell;
      const cy = gy + state.editor.cursorY*cell;
      ctx.save();
      ctx.strokeStyle = "rgba(14,20,15,0.75)";
      ctx.strokeRect(cx + 0.5, cy + 0.5, cell-1, cell-1);
      ctx.restore();
    }

    drawDiffPane(layout);
    drawSelectContextMenu(layout);
  }

  function drawTrnModeSelect(view, showCursor, nowMs = performance.now()){
    if(uiState.overlayMode != null){
      hideOverlayLog();
    }
    const layout = getTrnLayout();
    const { frame, left, right } = layout;
    const currentMode = setTrnMode(uiState.trnMode);

    hudTitle.textContent = "TRN MODE";
    hudHint.textContent = "←→/↑↓ 選択  A:決定  B:BACK";

    const badShakeUntilMs = toNumber(uiState.trnBadShakeUntilMs, 0);
    const isBadShakeActive = nowMs < badShakeUntilMs;
    const shakeX = isBadShakeActive ? (Math.sign(toNumber(uiState.trnBadShakeDir, 1)) || 1) : 0;
    const badShakeStartedAtMs = badShakeUntilMs - TRN_BAD_SHAKE_MS;
    const ghostActive = isBadShakeActive && ((nowMs - badShakeStartedAtMs) < TRN_BAD_GHOST_MS);

    const drawBody = () => {
      ctx.save();
      ctx.fillStyle = "rgba(12,18,14,0.14)";
      ctx.fillRect(frame.x + 1, frame.y + 1, frame.w - 2, frame.h - 2);
      ctx.restore();
      drawBox(frame.x, frame.y, frame.w, frame.h);
      drawBox(left.x, left.y, left.w, left.h);
      drawBox(right.x, right.y, right.w, right.h);

      const startY = left.y + 6;
      const listX = left.x + 10;
      const textX = listX + TRN_MODE_CURSOR_INSET_PX;
      const lineGap = 16;
      for(let i = 0; i < TRN_MODE_ORDER.length; i++){
        const modeId = TRN_MODE_ORDER[i];
        const selected = modeId === currentMode;
        const label = TRN_MODE_LABELS[modeId];
        const rowY = startY + (i * lineGap);
        if(selected && showCursor){
          drawCursorTriangle(listX, rowY);
        }
        drawText(textX, rowY, label, {
          color: selected ? "rgba(14,20,15,0.90)" : "rgba(14,20,15,0.58)",
        });
      }

      const rightPane = getTrnRightPaneRects(right);
      drawTrnRightPaneFeedbackBox(rightPane.fbRect);
      drawTrnRightPaneSprite(view, rightPane.spriteArea);
      const staminaNow = getCurrentStaminaForTrn();
      const modeLines = staminaNow <= 0
        ? TRN_MODE_FB_NO_STA_LINES
        : getTrnModeFeedbackLines(currentMode);
      drawTrnRightPaneFeedbackLines(rightPane.fbRect, modeLines, {
        preset: "trnFeedbackNumbers",
        emphasizeHeader: false,
        align: "left",
        statMarkColumns: false,
      });
    };

    if(ghostActive){
      ctx.save();
      ctx.translate(-shakeX, 0);
      ctx.globalAlpha = TRN_BAD_GHOST_ALPHA;
      drawBody();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(shakeX, 0);
    ctx.globalAlpha = 1;
    drawBody();
    ctx.restore();
  }

  function drawTrnScreen(view, nowMs){
    if(uiState.overlayMode != null){
      hideOverlayLog();
    }
    const layout = getTrnLayout();
    const { frame, left, right } = layout;
    const session = uiState.trnSession;
    const activeMode = session ? normalizeTrnMode(session.mode) : setTrnMode(uiState.trnMode);

    const ringMetrics = getTrnPlayRingMetrics();
    const headerRect = ringMetrics.headerRect;
    const playRect = ringMetrics.playRect;
    const footerRect = ringMetrics.footerRect;
    const ringCx = playRect.x + Math.floor(playRect.w / 2);
    const ringCy = playRect.y + Math.floor(playRect.h / 2);
    const ringMinR = ringMetrics.minR;
    const ringMaxR = ringMetrics.maxR;

    hudTitle.textContent = "TRN";
    hudHint.textContent = session ? "A:STOP  B:BACK" : "A:RETRY  B:BACK";

    const badShakeUntilMs = toNumber(uiState.trnBadShakeUntilMs, 0);
    const isBadShakeActive = nowMs < badShakeUntilMs;
    const shakeX = isBadShakeActive ? (Math.sign(toNumber(uiState.trnBadShakeDir, 1)) || 1) : 0;
    const badShakeStartedAtMs = badShakeUntilMs - TRN_BAD_SHAKE_MS;
    const ghostActive = isBadShakeActive && ((nowMs - badShakeStartedAtMs) < TRN_BAD_GHOST_MS);

    const drawBody = (ghostPass = false) => {
      ctx.save();
      ctx.fillStyle = "rgba(12,18,14,0.14)";
      ctx.fillRect(frame.x + 1, frame.y + 1, frame.w - 2, frame.h - 2);
      ctx.restore();
      drawBox(frame.x, frame.y, frame.w, frame.h);
      drawBox(left.x, left.y, left.w, left.h);
      drawBox(right.x, right.y, right.w, right.h);

      const footerOpt = { scale: 2, color: "rgba(14,20,15,0.82)" };
      const footerMaxW = Math.max(24, footerRect.w);
      drawText(headerRect.x, headerRect.y, TRN_MODE_LABELS[activeMode] || "TRN");

      if(session){
      const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
      const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
      const stabilityRatio = stabilityMax > 0 ? stabilityNow / stabilityMax : 0;
      const staminaMax = getRuntimeMax("stamina", 100);
      const staminaNow = clamp(getRuntimeStat("stamina", staminaMax), 0, staminaMax);
      const staminaRatio = staminaMax > 0 ? staminaNow / staminaMax : 0;
      const hungerMax = toPositiveInt(state.stats?.hungerMax, 10);
      const hungerNow = clamp(toNumber(state.stats?.hunger, hungerMax), 0, hungerMax);
      const hungerRatio = hungerMax > 0 ? hungerNow / hungerMax : 0;

      const visualDistortion = (1 - stabilityRatio) * 4.5;
      const visualNoise = ((1 - staminaRatio) + (1 - hungerRatio)) * 1.2;
      const seed = nowMs * 0.006;
      const waveR = getTrnCurrentRadius(session, nowMs);
      const waveStyle = getTrnWaveStrokeStyle();
      const bandCenterR = clamp(toNumber(session.centerR, ringMaxR * 0.6), ringMinR, ringMaxR);
      const bandW = toNumber(session.bandW, 18);
      const critW = toNumber(session.critW, 4);
      const distToCenter = Math.abs(waveR - bandCenterR);
      const bandHalf = Math.max(1, bandW / 2);
      const critHalf = Math.max(1, critW / 2);
      const inBand = distToCenter <= bandHalf;
      const inCrit = session.critEnabled && distToCenter <= critHalf;
      const prevInBand = Boolean(session.wasInBand);
      const prevInCrit = Boolean(session.wasInCrit);
      if(inBand && !prevInBand){
        session.bandHitFlashUntilMs = nowMs + TRN_BAND_HIT_FLASH_MS;
      }
      if(inCrit && !prevInCrit){
        session.critHitFlashUntilMs = nowMs + TRN_CRIT_HIT_FLASH_MS;
      }
      const bandFlashRemain = toNumber(session.bandHitFlashUntilMs, 0) - nowMs;
      const critFlashRemain = toNumber(session.critHitFlashUntilMs, 0) - nowMs;
      const bandFlashActive = bandFlashRemain > 0;
      const critFlashActive = critFlashRemain > 0;
      session.wasInBand = inBand;
      session.wasInCrit = inCrit;

      const breathRad = nowMs * ((Math.PI * 2 * TRN_BAND_BREATH_HZ) / 1000);
      const breath01 = (Math.sin(breathRad) + 1) * 0.5;
      const breathBoost = (inBand || inCrit) ? (breath01 * TRN_BAND_BREATH_ALPHA_BOOST) : 0;

      let bandLineW = bandW;
      let bandAlpha = 0.12;
      let bandHaloW = bandW + 4;
      let bandHaloAlpha = 0;
      if(inBand){
        bandLineW = bandW + 1;
        bandAlpha = 0.25 + breathBoost;
        bandHaloAlpha = 0.09 + (breathBoost * 0.60);
      }
      if(bandFlashActive){
        bandLineW = bandW + 1;
        bandAlpha = 0.35;
        bandHaloW = bandW + 5;
        bandHaloAlpha = Math.max(bandHaloAlpha, 0.16);
      }
      if(inCrit || critFlashActive){
        bandLineW = Math.max(bandLineW, bandW + 2);
        bandAlpha = Math.max(bandAlpha, critFlashActive ? 0.48 : 0.34);
        bandHaloW = Math.max(bandHaloW, bandW + 7);
        bandHaloAlpha = Math.max(bandHaloAlpha, critFlashActive ? 0.22 : 0.15);
      }

      let critLineW = critW;
      let critAlpha = 0.24;
      let critHaloW = critW + 2;
      let critHaloAlpha = 0;
      if(inCrit){
        critLineW = critW + 1;
        critAlpha = 0.52 + (breathBoost * 0.55);
        critHaloAlpha = 0.12 + (breathBoost * 0.45);
      }
      if(critFlashActive){
        critLineW = critW + 2;
        critAlpha = 0.74;
        critHaloW = critW + 4;
        critHaloAlpha = 0.24;
      }

      if(bandFlashActive){
        const remain01 = clamp(bandFlashRemain / TRN_BAND_HIT_FLASH_MS, 0, 1);
        const progress01 = 1 - remain01;
        const expand = 1 - Math.pow(1 - progress01, 3);
        const fade = 1 - Math.pow(1 - remain01, 3);
        const pulseR = Math.min(ringMaxR - 2, bandCenterR + (expand * TRN_BAND_PULSE_RADIUS_MAX_PX));
        const pulseAlpha = 0.40 * fade;
        drawIdealRing(ringCx, ringCy, pulseR + 2, 3, `rgba(14,20,15,${(pulseAlpha * 0.50).toFixed(3)})`);
        drawIdealRing(ringCx, ringCy, pulseR, 2, `rgba(14,20,15,${pulseAlpha.toFixed(3)})`);
      }
      if(critFlashActive){
        const remain01 = clamp(critFlashRemain / TRN_CRIT_HIT_FLASH_MS, 0, 1);
        const progress01 = 1 - remain01;
        const expand = 1 - Math.pow(1 - progress01, 3);
        const fade = 1 - Math.pow(1 - remain01, 3);
        const pulseR = Math.min(ringMaxR - 2, bandCenterR + (expand * TRN_CRIT_PULSE_RADIUS_MAX_PX));
        const pulseAlpha = 0.52 * fade;
        drawIdealRing(ringCx, ringCy, pulseR + 2, 4, `rgba(14,20,15,${(pulseAlpha * 0.54).toFixed(3)})`);
        drawIdealRing(ringCx, ringCy, pulseR, 3, `rgba(14,20,15,${pulseAlpha.toFixed(3)})`);
      }

      if(bandHaloAlpha > 0){
        drawIdealRing(ringCx, ringCy, bandCenterR, bandHaloW, `rgba(14,20,15,${bandHaloAlpha.toFixed(3)})`);
      }
      drawIdealRing(ringCx, ringCy, bandCenterR, bandLineW, `rgba(14,20,15,${bandAlpha.toFixed(3)})`);
      if(session.critEnabled){
        if(critHaloAlpha > 0){
          drawIdealRing(ringCx, ringCy, bandCenterR, critHaloW, `rgba(14,20,15,${critHaloAlpha.toFixed(3)})`);
        }
        drawIdealRing(ringCx, ringCy, bandCenterR, critLineW, `rgba(14,20,15,${critAlpha.toFixed(3)})`);
        if(inCrit){
          drawIdealRing(ringCx, ringCy, bandCenterR, 1, "rgba(14,20,15,0.72)");
        }
      }
      drawDistortedRing(
        ringCx,
        ringCy,
        waveR,
        visualDistortion + visualNoise,
        seed,
        waveStyle.lineWidth,
        waveStyle.color
      );

      drawIdealRing(ringCx, ringCy, ringMinR, 1, "rgba(14,20,15,0.20)");
      drawIdealRing(ringCx, ringCy, ringMaxR, 1, "rgba(14,20,15,0.15)");

      const remainMs = Math.max(0, TRN_MAX_MS - (nowMs - toNumber(session.startedAtMs, nowMs)));
      const remainSec = Math.ceil(remainMs / 1000);
      const footerCandidates = [
        `TIME:${remainSec}S  A:STOP  B:BACK`,
        `TIME:${remainSec}S A:STOP B:BACK`,
        `T:${remainSec}S A:STOP B:BACK`,
      ];
      let footerText = footerCandidates[footerCandidates.length - 1];
      for(const candidate of footerCandidates){
        const width = Number(uiTextMeasure(candidate, footerOpt)?.width) || 0;
        if(width <= footerMaxW){
          footerText = candidate;
          break;
        }
      }
      drawText(footerRect.x, footerRect.y + 6, footerText, footerOpt);
      }else{
        drawIdealRing(ringCx, ringCy, ringMinR, 1, "rgba(14,20,15,0.20)");
        drawIdealRing(ringCx, ringCy, ringMaxR, 1, "rgba(14,20,15,0.15)");
        drawTrnStopSuccessFx(nowMs, playRect, ringCx, ringCy, ringMinR, ringMaxR);
        const standbyCandidates = [
          "A:RETRY  B:BACK",
          "A:RETRY B:BACK",
          "A:START B:BACK",
        ];
        let standbyText = standbyCandidates[standbyCandidates.length - 1];
        for(const candidate of standbyCandidates){
          const width = Number(uiTextMeasure(candidate, footerOpt)?.width) || 0;
          if(width <= footerMaxW){
            standbyText = candidate;
            break;
          }
        }
        drawText(footerRect.x, footerRect.y + 6, standbyText, footerOpt);
      }

      const rightPane = getTrnRightPaneRects(right);
      drawTrnRightPaneFeedbackBox(rightPane.fbRect);
      drawTrnRightPaneSprite(view, rightPane.spriteArea);
      if(!session && !ghostPass){
        const feedback = isRecord(uiState.trnLastFeedback) ? uiState.trnLastFeedback : null;
        const line1 = String(feedback?.line1 || "").trim();
        const lineSta = String(feedback?.lineSta || "").trim();
        const lineSig = String(feedback?.lineSig || "").trim();
        const lineStb = String(feedback?.lineStb || "").trim();
        if(line1.length > 0){
          const lines = [
            line1,
            lineSta,
            lineSig,
          ];
          if(lineStb.length > 0){
            lines.push(lineStb);
          }
          drawTrnRightPaneFeedbackLines(rightPane.fbRect, lines, {
            preset: "trnFeedbackNumbers",
            emphasizeHeader: true,
            align: "left",
          });
        }
      }
    };

    if(ghostActive){
      ctx.save();
      ctx.translate(-shakeX, 0);
      ctx.globalAlpha = TRN_BAD_GHOST_ALPHA;
      drawBody(true);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(shakeX, 0);
    ctx.globalAlpha = 1;
    drawBody(false);
    ctx.restore();
  }

  function pickBttlResultFlavor(result){
    const key = String(result || "LOSE").toUpperCase();
    const list = BTTL_RESULT_FLAVORS[key] || BTTL_RESULT_FLAVORS.LOSE;
    if(!Array.isArray(list) || list.length <= 0){
      return "信号が途切れた。再調整が必要だ。";
    }
    const idx = Math.floor(Math.random() * list.length);
    return String(list[idx] || list[0] || "信号が途切れた。再調整が必要だ。");
  }

  function pushBttlLog(ctxBattle, text){
    if(!ctxBattle) return;
    const line = String(text ?? "").trim();
    if(line.length <= 0) return;
    const logs = Array.isArray(ctxBattle.logs) ? ctxBattle.logs : [];
    if(logs.length > 0){
      const lastIdx = logs.length - 1;
      const lastLineRaw = String(logs[lastIdx] ?? "").trim();
      const m = lastLineRaw.match(/^(.*)\sx(\d+)$/);
      const lastBase = m ? String(m[1] || "").trim() : lastLineRaw;
      const lastCount = m ? clamp(Math.floor(toNumber(m[2], 1)), 1, 99) : 1;
      if(lastBase === line){
        const nextCount = clamp(lastCount + 1, 2, 99);
        logs[lastIdx] = `${line} x${nextCount}`;
        ctxBattle.logs = logs;
        return;
      }
    }
    logs.push(line);
    while(logs.length > BTTL_LOG_KEEP_MAX){
      logs.shift();
    }
    ctxBattle.logs = logs;
  }

  function computeBttlHitChance(sig, sync){
    const sigRatio = clamp(toNumber(sig, 0), 0, 100) / 100;
    const syncRatio = clamp(toNumber(sync, 0), 0, 100) / 100;
    return clamp(
      BTTL_HIT_BASE + (sigRatio * BTTL_HIT_SIG_WEIGHT) + (syncRatio * BTTL_HIT_SYNC_WEIGHT),
      BTTL_HIT_MIN,
      BTTL_HIT_MAX
    );
  }

  function getBttlProjectileSpeed(){
    return BTTL_DEBUG_SLOW_PROJECTILES ? BTTL_PROJECTILE_SPEED_DEBUG : BTTL_PROJECTILE_SPEED;
  }

  function getBttlProjectileDrawSize(size = BTTL_PROJECTILE_SIZE){
    const px = Math.max(4, Math.floor(toNumber(size, BTTL_PROJECTILE_SIZE)));
    const dot = Math.max(1, Math.round(px / BTTL_PROJECTILE_PIXEL_GRID));
    return dot * BTTL_PROJECTILE_PIXEL_GRID;
  }

  function normalizeRingT(t, ringLen){
    const len = Math.max(1, toNumber(ringLen, 1));
    let next = toNumber(t, 0) % len;
    if(next < 0) next += len;
    return next;
  }

  function getBttlFieldGeometry(){
    const layout = getTrnLayout();
    const { frame, left, right } = layout;
    const innerRect = {
      x: left.x + 4,
      y: left.y + 4,
      w: Math.max(16, left.w - 8),
      h: Math.max(24, left.h - 8),
    };
    const laneGap = 2;
    const lanePad = 4;
    const laneH = Math.floor((innerRect.h - laneGap) / 2);
    const topLaneRect = {
      x: innerRect.x + lanePad,
      y: innerRect.y + lanePad,
      w: Math.max(18, innerRect.w - (lanePad * 2)),
      h: Math.max(18, laneH - (lanePad * 2)),
    };
    const bottomBaseY = innerRect.y + laneH + laneGap;
    const bottomLaneRect = {
      x: innerRect.x + lanePad,
      y: bottomBaseY + lanePad,
      w: Math.max(18, innerRect.w - (lanePad * 2)),
      h: Math.max(18, (innerRect.h - laneH - laneGap) - (lanePad * 2)),
    };
    const dividerY = innerRect.y + laneH;

    const spritePx = SPRITE_SIZE * DOT_SCALE;
    const enemyBaseX = topLaneRect.x + 6;
    const enemyBaseY = topLaneRect.y + Math.floor((topLaneRect.h - spritePx) / 2);
    const allyBaseX = bottomLaneRect.x + bottomLaneRect.w - spritePx - 6;
    const allyBaseY = bottomLaneRect.y + Math.floor((bottomLaneRect.h - spritePx) / 2);
    const projectileHalf = Math.ceil(getBttlProjectileDrawSize() / 2) + 1;

    const topBattleX0 = Math.round(enemyBaseX + spritePx + 6 + projectileHalf);
    const topBattleX1 = Math.round(Math.max(topBattleX0 + 8, topLaneRect.x + topLaneRect.w - 2 - projectileHalf));
    const bottomBattleX0 = Math.round(bottomLaneRect.x + 2 + projectileHalf);
    const bottomBattleX1 = Math.round(Math.max(bottomBattleX0 + 8, allyBaseX - 6 - projectileHalf));
    const topBattleLen = Math.max(8, topBattleX1 - topBattleX0);
    const bottomBattleLen = Math.max(8, bottomBattleX1 - bottomBattleX0);
    const ringLen = topBattleLen + bottomBattleLen;

    const enemyHitSpan = clamp(
      Math.round(topBattleLen * BTTL_PROJECTILE_HIT_WINDOW_RATIO),
      6,
      Math.max(6, topBattleLen - 2)
    );
    const allyHitSpan = clamp(
      Math.round(bottomBattleLen * BTTL_PROJECTILE_HIT_WINDOW_RATIO),
      6,
      Math.max(6, bottomBattleLen - 2)
    );

    return {
      frame,
      left,
      right,
      innerRect,
      dividerY,
      topLaneRect,
      bottomLaneRect,
      topLaneCenterY: topLaneRect.y + Math.floor(topLaneRect.h / 2),
      bottomLaneCenterY: bottomLaneRect.y + Math.floor(bottomLaneRect.h / 2),
      spritePx,
      enemyBaseX,
      enemyBaseY,
      allyBaseX,
      allyBaseY,
      topBattleX0,
      topBattleX1,
      bottomBattleX0,
      bottomBattleX1,
      topBattleLen,
      bottomBattleLen,
      ringLen,
      enemyHitRange: { start: 0, end: enemyHitSpan },
      allyHitRange: { start: topBattleLen, end: topBattleLen + allyHitSpan },
    };
  }

  function bttlRingToPoint(t, field){
    const ringLen = Math.max(1, toNumber(field?.ringLen, 1));
    const tt = normalizeRingT(t, ringLen);
    if(tt < field.topBattleLen){
      return {
        x: field.topBattleX0 + tt,
        y: field.topLaneCenterY,
      };
    }
    const u = tt - field.topBattleLen;
    return {
      x: field.bottomBattleX1 - u,
      y: field.bottomLaneCenterY,
    };
  }

  function didRingSegmentHitRange(prevT, nextT, rangeStart, rangeEnd, ringLen){
    const len = Math.max(1, toNumber(ringLen, 1));
    const prev = normalizeRingT(prevT, len);
    const next = normalizeRingT(nextT, len);
    const start = clamp(toNumber(rangeStart, 0), 0, len);
    const end = clamp(toNumber(rangeEnd, 0), 0, len);
    if(end < start) return false;
    if(next >= prev){
      return next >= start && prev <= end;
    }
    return (prev <= end && len >= start) || (next >= start);
  }

  function getBttlTargetRangeByOwner(field, owner){
    return owner === "enemy" ? field.allyHitRange : field.enemyHitRange;
  }

  function normalizeBttlSignalCommand(value){
    const id = String(value || "").trim().toLowerCase();
    return BTTL_SIGNAL_MENU_ITEMS.some((item) => item.id === id)
      ? id
      : BTTL_SIGNAL_MENU_ITEMS[0].id;
  }

  function setBttlSignalMenuIndex(ctxBattle, value){
    if(!ctxBattle) return 0;
    const count = BTTL_SIGNAL_MENU_ITEMS.length;
    const num = Math.floor(toNumber(value, 0));
    const next = ((num % count) + count) % count;
    ctxBattle.signalMenuIndex = next;
    return next;
  }

  function cycleBttlSignalMenu(ctxBattle, delta){
    if(!ctxBattle) return 0;
    const current = Math.floor(toNumber(ctxBattle.signalMenuIndex, 0));
    return setBttlSignalMenuIndex(ctxBattle, current + Math.floor(toNumber(delta, 0)));
  }

  function getBttlSignalSelectedCommand(ctxBattle){
    const idx = Math.floor(toNumber(ctxBattle?.signalMenuIndex, 0));
    const item = BTTL_SIGNAL_MENU_ITEMS[((idx % BTTL_SIGNAL_MENU_ITEMS.length) + BTTL_SIGNAL_MENU_ITEMS.length) % BTTL_SIGNAL_MENU_ITEMS.length];
    return normalizeBttlSignalCommand(item?.id);
  }

  function getBttlSignalModeCooldownMs(cmd){
    const id = normalizeBttlSignalCommand(cmd);
    return clamp(toNumber(BTTL_SIGNAL_MODE_COOLDOWN_MS[id], 1200), 0, 30000);
  }

  function getBttlSignalGlobalCooldownRemainMs(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return 0;
    const now = toNumber(nowMs, performance.now());
    return Math.max(0, toNumber(ctxBattle.signalGlobalCooldownUntilMs, 0) - now);
  }

  function getBttlSignalModeCooldownRemainMs(ctxBattle, cmd, nowMs = performance.now()){
    if(!ctxBattle) return 0;
    const now = toNumber(nowMs, performance.now());
    const id = normalizeBttlSignalCommand(cmd);
    const byCmd = isRecord(ctxBattle.signalModeCooldownUntilByCmd)
      ? ctxBattle.signalModeCooldownUntilByCmd
      : null;
    return Math.max(0, toNumber(byCmd?.[id], 0) - now);
  }

  function getBttlSignalCooldownRemainMs(ctxBattle, cmd, nowMs = performance.now()){
    const globalRemain = getBttlSignalGlobalCooldownRemainMs(ctxBattle, nowMs);
    const modeRemain = getBttlSignalModeCooldownRemainMs(ctxBattle, cmd, nowMs);
    return Math.max(globalRemain, modeRemain);
  }

  function createBttlEnemyAiState(nowMs = performance.now()){
    return {
      currentAction: BTTL_ENEMY_ACTION.STABLE,
      actionLockedUntilMs: 0,
      switchCooldownUntilMs: 0,
      lastDecideAtMs: toNumber(nowMs, performance.now()),
      recentEnemyShots: [],
      recentAllyShots: [],
      lastDamageTakenAtMs: 0,
    };
  }

  function getBttlEnemyAiState(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return createBttlEnemyAiState(nowMs);
    if(!isRecord(ctxBattle.enemyAi)){
      ctxBattle.enemyAi = createBttlEnemyAiState(nowMs);
    }
    return ctxBattle.enemyAi;
  }

  function noteBttlRecentHit(history, didHit){
    const list = Array.isArray(history) ? history : [];
    list.push(Boolean(didHit) ? 1 : 0);
    while(list.length > BTTL_ENEMY_AI_RECENT_WINDOW){
      list.shift();
    }
    return list;
  }

  function getBttlRecentHitRate(history){
    const list = Array.isArray(history) ? history : [];
    if(list.length <= 0) return 0.5;
    const sum = list.reduce((acc, n) => acc + (n ? 1 : 0), 0);
    return clamp(sum / list.length, 0, 1);
  }

  function getBttlEnemyActionId(actionId){
    const id = String(actionId || "").trim().toUpperCase();
    if(id === BTTL_ENEMY_ACTION.PRESS || id === BTTL_ENEMY_ACTION.DEFEND){
      return id;
    }
    return BTTL_ENEMY_ACTION.STABLE;
  }

  function getBttlEnemyActionIntervalMult(actionId){
    const id = getBttlEnemyActionId(actionId);
    return clamp(toNumber(BTTL_ENEMY_ACTION_INTERVAL_MULT[id], 1), 0.5, 1.6);
  }

  function buildBttlEnemyPolicyInput(ctxBattle, nowMs = performance.now()){
    const ai = getBttlEnemyAiState(ctxBattle, nowMs);
    const enemyHp = Math.max(0, toNumber(ctxBattle?.enemy?.hp, 0));
    const enemyMax = Math.max(1, toNumber(ctxBattle?.enemy?.maxHp, 1));
    const allyHp = Math.max(0, toNumber(ctxBattle?.ally?.hp, 0));
    const allyMax = Math.max(1, toNumber(ctxBattle?.ally?.maxHp, 1));
    const lastDamageAgoMs = ai.lastDamageTakenAtMs > 0
      ? Math.max(0, toNumber(nowMs, performance.now()) - toNumber(ai.lastDamageTakenAtMs, 0))
      : Infinity;
    const allyBuffState = isRecord(ctxBattle?.pendingEffect)
      ? getBttlSignalPendingTone(ctxBattle.pendingEffect)
      : "NONE";
    return {
      hpRatioEnemy: clamp(enemyHp / enemyMax, 0, 1),
      hpRatioAlly: clamp(allyHp / allyMax, 0, 1),
      recentEnemyHitRate: getBttlRecentHitRate(ai.recentEnemyShots),
      recentAllyHitRate: getBttlRecentHitRate(ai.recentAllyShots),
      lastDamageTakenMs: lastDamageAgoMs,
      allyBuffState,
      cooldowns: {
        holdRemainMs: Math.max(0, toNumber(ai.actionLockedUntilMs, 0) - toNumber(nowMs, performance.now())),
        switchRemainMs: Math.max(0, toNumber(ai.switchCooldownUntilMs, 0) - toNumber(nowMs, performance.now())),
      },
    };
  }

  function utilityPolicyDecideEnemyAction(input){
    const hpEnemy = clamp(toNumber(input?.hpRatioEnemy, 1), 0, 1);
    const hpAlly = clamp(toNumber(input?.hpRatioAlly, 1), 0, 1);
    const enemyHit = clamp(toNumber(input?.recentEnemyHitRate, 0.5), 0, 1);
    const allyHit = clamp(toNumber(input?.recentAllyHitRate, 0.5), 0, 1);
    const lastDamageMs = toNumber(input?.lastDamageTakenMs, Infinity);
    const buff = String(input?.allyBuffState || "NONE").toUpperCase();

    let scorePress =
      ((1 - hpAlly) * 1.25) +
      (hpEnemy * 0.40) +
      (enemyHit * 0.92) -
      (allyHit * 0.72);
    let scoreDefend =
      ((1 - hpEnemy) * 1.28) +
      (allyHit * 0.90) +
      ((lastDamageMs <= 2500) ? 0.46 : 0) -
      ((1 - hpAlly) * 0.42);

    if(buff === "UP"){
      scoreDefend += 0.24;
      scorePress -= 0.30;
    }else if(buff === "DN"){
      scorePress += 0.26;
      scoreDefend -= 0.12;
    }

    const tension = Math.abs(scorePress - scoreDefend);
    const scoreStable = 0.86 - Math.min(0.54, tension * 0.40) + (enemyHit < 0.35 ? 0.15 : 0);

    const options = [
      { actionId: BTTL_ENEMY_ACTION.PRESS, score: scorePress },
      { actionId: BTTL_ENEMY_ACTION.STABLE, score: scoreStable },
      { actionId: BTTL_ENEMY_ACTION.DEFEND, score: scoreDefend },
    ];
    options.sort((a, b) => b.score - a.score);
    return options[0] || { actionId: BTTL_ENEMY_ACTION.STABLE, score: 0 };
  }

  function decideEnemyActionIntent(ctxBattle, nowMs = performance.now()){
    const input = buildBttlEnemyPolicyInput(ctxBattle, nowMs);
    return utilityPolicyDecideEnemyAction(input);
  }

  function validateAndApplyEnemyActionIntent(ctxBattle, actionIntent, nowMs = performance.now()){
    const ai = getBttlEnemyAiState(ctxBattle, nowMs);
    const now = toNumber(nowMs, performance.now());
    const current = getBttlEnemyActionId(ai.currentAction);
    const next = getBttlEnemyActionId(actionIntent?.actionId);
    if(next === current){
      return { accepted: true, appliedAction: current, changed: false, rejectReason: "" };
    }
    if(now < toNumber(ai.actionLockedUntilMs, 0)){
      return { accepted: false, appliedAction: current, changed: false, rejectReason: "hold" };
    }
    if(now < toNumber(ai.switchCooldownUntilMs, 0)){
      return { accepted: false, appliedAction: current, changed: false, rejectReason: "switch_cd" };
    }
    ai.currentAction = next;
    ai.actionLockedUntilMs = now + BTTL_ENEMY_AI_MIN_HOLD_MS;
    ai.switchCooldownUntilMs = now + BTTL_ENEMY_AI_SWITCH_COOLDOWN_MS;
    if(BTTL_ENEMY_AI_AUDIT_LOG){
      pushBttlLog(ctxBattle, `AI ${next}`);
    }
    return { accepted: true, appliedAction: next, changed: true, rejectReason: "" };
  }

  function updateBttlEnemyActionAi(ctxBattle, nowMs = performance.now()){
    const ai = getBttlEnemyAiState(ctxBattle, nowMs);
    const now = toNumber(nowMs, performance.now());
    if((now - toNumber(ai.lastDecideAtMs, 0)) < BTTL_ENEMY_AI_DECIDE_INTERVAL_MS){
      return;
    }
    ai.lastDecideAtMs = now;
    let intent = null;
    try{
      intent = decideEnemyActionIntent(ctxBattle, now);
    }catch(_err){
      intent = null;
    }
    if(!isRecord(intent)){
      // Fallback policy (utility baseline).
      intent = utilityPolicyDecideEnemyAction(buildBttlEnemyPolicyInput(ctxBattle, now));
      if(BTTL_ENEMY_AI_AUDIT_LOG){
        pushBttlLog(ctxBattle, "AI Fallback");
      }
    }
    validateAndApplyEnemyActionIntent(ctxBattle, intent, now);
  }

  function noteBttlShotOutcome(ctxBattle, owner, didHit, nowMs = performance.now()){
    if(!ctxBattle) return;
    const ai = getBttlEnemyAiState(ctxBattle, nowMs);
    const shooter = owner === "enemy" ? "enemy" : "ally";
    const hit = Boolean(didHit);
    if(shooter === "enemy"){
      ai.recentEnemyShots = noteBttlRecentHit(ai.recentEnemyShots, hit);
      return;
    }
    ai.recentAllyShots = noteBttlRecentHit(ai.recentAllyShots, hit);
    if(hit){
      ai.lastDamageTakenAtMs = toNumber(nowMs, performance.now());
    }
  }

  function getBttlSignalGameMetrics(field){
    const rightInner = {
      x: field.right.x + 4,
      y: field.right.y + 4,
      w: Math.max(16, field.right.w - 8),
      h: Math.max(24, field.right.h - 8),
    };
    const headerH = 16;
    const footerH = 16;
    const playRect = {
      x: rightInner.x + 1,
      y: rightInner.y + headerH,
      w: Math.max(12, rightInner.w - 2),
      h: Math.max(12, rightInner.h - headerH - footerH),
    };
    const minR = 8;
    const maxR = Math.max(minR + 6, Math.floor((Math.min(playRect.w, playRect.h) / 2) - 2));
    return {
      rightInner,
      headerRect: {
        x: rightInner.x + 2,
        y: rightInner.y + 1,
        w: Math.max(8, rightInner.w - 4),
        h: headerH,
      },
      footerRect: {
        x: rightInner.x + 2,
        y: rightInner.y + rightInner.h - footerH,
        w: Math.max(8, rightInner.w - 4),
        h: footerH,
      },
      playRect,
      cx: playRect.x + Math.floor(playRect.w / 2),
      cy: playRect.y + Math.floor(playRect.h / 2),
      minR,
      maxR,
    };
  }

  function getBttlSignalCurrentRadius(session, nowMs = performance.now()){
    if(!session) return 0;
    const phase = getTrnLoopPhase(session, nowMs);
    const eased = getTrnEasedProgress(phase);
    return session.minR + ((session.maxR - session.minR) * eased);
  }

  function getBttlSignalTierFromGrade(grade){
    const g = String(grade || "").trim().toUpperCase();
    if(g === "SUCCESS") return 3;
    if(g === "OK") return 2;
    if(g === "NEAR") return 1;
    return 0;
  }

  function getBttlSignalHitBonus(cmd, tier){
    const id = normalizeBttlSignalCommand(cmd);
    const list = BTTL_SIGNAL_HIT_BONUS_BY_TIER[id] || BTTL_SIGNAL_HIT_BONUS_BY_TIER.calibrate;
    const t = clamp(Math.floor(toNumber(tier, 0)), 0, 3);
    return toNumber(list[t], 0);
  }

  function getBttlSignalGradeShort(grade){
    const g = String(grade || "").trim().toUpperCase();
    if(g === "SUCCESS") return "SUC";
    if(g === "NEAR") return "NEAR";
    if(g === "OK") return "OK";
    return "BAD";
  }

  function getBttlActorShort(owner){
    return owner === "enemy" ? "EN" : "AL";
  }

  function getBttlOutcomeLogLine(owner, didHit, damage = 0){
    const actor = getBttlActorShort(owner);
    if(!didHit){
      return `${actor} MISS`;
    }
    const dmg = Math.max(0, Math.floor(toNumber(damage, 0)));
    return `${actor} DMG ${dmg}`;
  }

  function getBttlSignalPendingTone(effect){
    if(!isRecord(effect)) return "EQ";
    const intervalMult = toNumber(effect.intervalMult, 1);
    const hitAdj = toNumber(effect.hitChanceAdj, 0);
    const score = ((1 - intervalMult) * 1.4) + (hitAdj * 1.6);
    if(score > 0.02) return "UP";
    if(score < -0.02) return "DN";
    return "EQ";
  }

  function getBttlSignalPendingBadgeText(effect){
    if(!isRecord(effect)) return "";
    const cmd = normalizeBttlSignalCommand(effect.cmd);
    const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[cmd] || "SIG";
    const tone = getBttlSignalPendingTone(effect);
    return `${cmdLabel} ${tone}`;
  }

  function getBttlSignalProcBadgeText(proc){
    if(!isRecord(proc)) return "";
    const cmd = normalizeBttlSignalCommand(proc.cmd);
    const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[cmd] || "SIG";
    const grade = getBttlSignalGradeShort(proc.grade);
    return `${cmdLabel} ${grade}`;
  }

  function drawBttlSignalStatusBadge(ctxBattle, field, allyX, allyY, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    const proc = isRecord(ctxBattle.lastSignalProc) ? ctxBattle.lastSignalProc : null;
    const procUntilMs = toNumber(proc?.untilMs, 0);
    const procActive = proc && nowMs < procUntilMs;
    if(proc && !procActive){
      ctxBattle.lastSignalProc = null;
    }
    const pending = (!procActive && isRecord(ctxBattle.pendingEffect) && ctxBattle.pendingEffect.appliesTo === "nextAllyAct")
      ? ctxBattle.pendingEffect
      : null;
    const rawText = procActive
      ? getBttlSignalProcBadgeText(proc)
      : getBttlSignalPendingBadgeText(pending);
    if(rawText.length <= 0) return;

    const baseOpt = { scale: 1 };
    const textH = Math.max(6, Math.floor(toNumber(BITMAP_GLYPH_H, 7)));
    const text = fitTrnRightPaneText(rawText, Math.max(18, field.bottomLaneRect.w - 8), baseOpt);
    if(text.length <= 0) return;
    const textW = Number(uiTextMeasure(text, baseOpt)?.width) || 0;
    const xMin = field.bottomLaneRect.x + 2;
    const xMax = (field.bottomLaneRect.x + field.bottomLaneRect.w - 2) - textW;
    const yMin = field.bottomLaneRect.y + 1;
    const yMax = (field.bottomLaneRect.y + field.bottomLaneRect.h - 2) - textH;
    const drawX = Math.round(clamp(allyX - textW - 6, xMin, Math.max(xMin, xMax)));
    const drawY = Math.round(clamp(allyY - 10, yMin, Math.max(yMin, yMax)));

    const blinkOn = Math.floor(nowMs / BTTL_SIGNAL_PENDING_BLINK_MS) % 2 === 0;
    const mainAlpha = procActive ? 0.98 : (blinkOn ? 1.00 : 0.24);
    ctx.save();
    ctx.fillStyle = procActive
      ? "rgba(198,212,192,0.34)"
      : (blinkOn ? "rgba(198,212,192,0.28)" : "rgba(198,212,192,0.10)");
    ctx.fillRect(drawX - 1, drawY - 1, Math.max(2, textW + 2), textH + 2);
    ctx.restore();
    drawText(drawX, drawY, text, {
      scale: 1,
      color: `rgba(14,20,15,${mainAlpha.toFixed(2)})`,
    });
    if(procActive){
      drawText(drawX + 1, drawY, text, {
        scale: 1,
        color: "rgba(14,20,15,0.62)",
      });
    }
  }

  function getBttlSignalIntervalMult(cmd, tier){
    const id = normalizeBttlSignalCommand(cmd);
    const list = BTTL_SIGNAL_INTERVAL_MULT_BY_TIER[id] || BTTL_SIGNAL_INTERVAL_MULT_BY_TIER.calibrate;
    const t = clamp(Math.floor(toNumber(tier, 0)), 0, 3);
    return toNumber(list[t], 1);
  }

  function computeBttlAttackIntervalMs(ctxBattle, actorKey, launchEffect = null){
    if(!ctxBattle) return actorKey === "enemy" ? BTTL_ATTACK_INTERVAL_ENEMY_BASE_MS : BTTL_ATTACK_INTERVAL_ALLY_BASE_MS;
    const isEnemy = actorKey === "enemy";
    const source = isEnemy ? ctxBattle.enemy : ctxBattle.ally;
    const sig = clamp(toNumber(source?.sig, 0), 0, 100);
    const sync = clamp(toNumber(source?.sync, 0), 0, 100);
    const hp = Math.max(0, toNumber(source?.hp, 0));
    const maxHp = Math.max(1, toNumber(source?.maxHp, 1));
    const hpRatio = clamp(hp / maxHp, 0, 1);
    const base = isEnemy ? BTTL_ATTACK_INTERVAL_ENEMY_BASE_MS : BTTL_ATTACK_INTERVAL_ALLY_BASE_MS;
    const sigMult = 1 - ((sig / 100) * BTTL_ATTACK_INTERVAL_SIG_SPEEDUP_MAX);
    const syncMult = 1 - ((sync / 100) * BTTL_ATTACK_INTERVAL_SYNC_SPEEDUP_MAX);
    const hpPenaltyMax = isEnemy
      ? BTTL_ATTACK_INTERVAL_HP_PENALTY_MAX_ENEMY
      : BTTL_ATTACK_INTERVAL_HP_PENALTY_MAX_ALLY;
    const hpMult = 1 + ((1 - hpRatio) * hpPenaltyMax);
    let signalMult = 1;
    if(!isEnemy && isRecord(launchEffect)){
      signalMult = clamp(toNumber(launchEffect.intervalMult, 1), 0.72, 1.35);
    }
    const enemyActionMult = isEnemy
      ? getBttlEnemyActionIntervalMult(getBttlEnemyAiState(ctxBattle).currentAction)
      : 1;
    const interval = base * sigMult * syncMult * hpMult * signalMult * enemyActionMult;
    return clamp(Math.round(interval), BTTL_ATTACK_INTERVAL_MIN_MS, BTTL_ATTACK_INTERVAL_MAX_MS);
  }

  function applyBttlEnemyDefendDamageMitigation(ctxBattle, targetKey, damage){
    const rawDamage = Math.max(1, Math.floor(toNumber(damage, 1)));
    if(targetKey !== "enemy"){
      return { damage: rawDamage, mitigated: false };
    }
    const ai = getBttlEnemyAiState(ctxBattle);
    const action = getBttlEnemyActionId(ai.currentAction);
    if(action !== BTTL_ENEMY_ACTION.DEFEND){
      return { damage: rawDamage, mitigated: false };
    }
    const mult = clamp(toNumber(BTTL_ENEMY_DEFEND_DMG_MULT, 0.88), 0.50, 1.00);
    const reduced = Math.max(1, Math.ceil(rawDamage * mult));
    return { damage: reduced, mitigated: reduced < rawDamage };
  }

  function consumeBttlSignalCost(ctxBattle, cmd){
    if(!ctxBattle) return 0;
    const id = normalizeBttlSignalCommand(cmd);
    const cost = Math.max(0, Math.floor(toNumber(BTTL_SIGNAL_COST_BY_CMD[id], 0)));
    if(cost <= 0) return 0;
    const hpNow = Math.max(0, Math.floor(toNumber(ctxBattle.ally?.hp, 0)));
    const hpNext = Math.max(0, hpNow - cost);
    ctxBattle.ally.hp = hpNext;
    return hpNow - hpNext;
  }

  function resolveBttlProjectileOutcome(ctxBattle, projectile, nowMs = performance.now(), forceMiss = false){
    if(!ctxBattle || !projectile || !projectile.alive) return;
    projectile.alive = false;
    if(!forceMiss && projectile.willHit){
      const targetKey = projectile.target === "ally" ? "ally" : "enemy";
      const target = ctxBattle[targetKey];
      const hpNow = Math.max(0, Math.floor(toNumber(target?.hp, 0)));
      const damage = Math.max(1, Math.floor(toNumber(projectile.damage, 1)));
      const dmgResolved = applyBttlEnemyDefendDamageMitigation(ctxBattle, targetKey, damage);
      const hpLocked = BTTL_DEBUG_ENEMY_HP_LOCK && targetKey === "enemy";
      const appliedDamage = hpLocked ? 0 : dmgResolved.damage;
      target.hp = Math.max(0, hpNow - appliedDamage);
      target.hitFlashUntilMs = nowMs + BTTL_HIT_FLASH_MS;
      target.knockUntilMs = nowMs + BTTL_KNOCK_MS;
      target.knockDir = targetKey === "enemy" ? 1 : -1;
      noteBttlShotOutcome(ctxBattle, projectile.owner, true, nowMs);
      if(dmgResolved.mitigated && !hpLocked && BTTL_ENEMY_AI_AUDIT_LOG){
        pushBttlLog(ctxBattle, "EN DEF DMG↓");
      }
      pushBttlLog(ctxBattle, getBttlOutcomeLogLine(projectile.owner, true, appliedDamage));
      return;
    }
    noteBttlShotOutcome(ctxBattle, projectile.owner, false, nowMs);
    pushBttlLog(ctxBattle, getBttlOutcomeLogLine(projectile.owner, false, 0));
  }

  function beginBttlRealtimeAttack(ctxBattle, attacker, nowMs = performance.now()){
    if(!ctxBattle) return null;
    const actorKey = attacker === "ally" ? "ally" : "enemy";
    const targetKey = actorKey === "enemy" ? "ally" : "enemy";
    let consumedEffect = null;
    if(
      actorKey === "ally" &&
      isRecord(ctxBattle.pendingEffect) &&
      ctxBattle.pendingEffect.appliesTo === "nextAllyAct"
    ){
      consumedEffect = { ...ctxBattle.pendingEffect };
      ctxBattle.pendingEffect = null;
    }
    const hitChanceBase = clamp(
      toNumber(ctxBattle[actorKey]?.hitChance, 0.5),
      BTTL_HIT_MIN,
      BTTL_HIT_MAX
    );
    const hitChanceAdj = toNumber(consumedEffect?.hitChanceAdj, 0);
    const hitChance = clamp(hitChanceBase + hitChanceAdj, BTTL_HIT_MIN, BTTL_HIT_MAX);
    const hit = Math.random() < hitChance;
    const damage = rollBttlDamage(actorKey, ctxBattle);
    const field = getBttlFieldGeometry();
    const projectile = createBttlProjectile(actorKey, field);
    projectile.target = targetKey;
    projectile.willHit = hit;
    projectile.damage = damage;
    projectile.meta = consumedEffect
      ? {
        cmd: consumedEffect.cmd,
        tier: consumedEffect.tier,
        hitChanceAdj,
        intervalMult: toNumber(consumedEffect.intervalMult, 1),
      }
      : null;
    const pool = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    pool.push(projectile);
    ctxBattle.projectiles = pool;
    if(actorKey === "ally" && isRecord(consumedEffect)){
      ctxBattle.lastSignalProc = {
        cmd: normalizeBttlSignalCommand(consumedEffect.cmd),
        grade: String(consumedEffect.grade || "BAD").trim().toUpperCase(),
        untilMs: toNumber(nowMs, performance.now()) + BTTL_SIGNAL_PROC_FLASH_MS,
      };
    }
    return consumedEffect;
  }

  function updateBttlRealtimeProjectiles(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    const list = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    if(list.length <= 0){
      ctxBattle.projectiles = [];
      return;
    }
    const field = getBttlFieldGeometry();
    for(const projectile of list){
      if(!projectile?.alive) continue;
      const dtSec = clamp((nowMs - toNumber(projectile.lastUpdateMs, nowMs)) / 1000, 0, 0.05);
      projectile.lastUpdateMs = nowMs;
      projectile.prevT = projectile.t;
      projectile.t = normalizeRingT(projectile.t + (toNumber(projectile.speed, BTTL_PROJECTILE_SPEED) * dtSec), field.ringLen);
      projectile.distance = Math.max(0, toNumber(projectile.distance, 0)) + (toNumber(projectile.speed, BTTL_PROJECTILE_SPEED) * dtSec);
      const range = getBttlTargetRangeByOwner(field, projectile.owner);
      const touchedRange = didRingSegmentHitRange(
        projectile.prevT,
        projectile.t,
        range.start,
        range.end,
        field.ringLen
      );
      if(touchedRange){
        resolveBttlProjectileOutcome(ctxBattle, projectile, nowMs, !projectile.willHit);
      }else if(projectile.distance >= (field.ringLen + BTTL_PROJECTILE_MISS_EXTRA_PX)){
        resolveBttlProjectileOutcome(ctxBattle, projectile, nowMs, true);
      }
    }
    ctxBattle.projectiles = list.filter((projectile) => Boolean(projectile?.alive));
  }

  function enterBttlPlayerWindow(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    ctxBattle.phase = BTTL_STATE.PLAYER_WINDOW;
    ctxBattle.phaseStartedAtMs = toNumber(nowMs, performance.now());
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
    setBttlSignalMenuIndex(ctxBattle, ctxBattle.signalMenuIndex);
    ctxBattle.signalSession = null;
    ctxBattle.signalResult = null;
  }

  function startBttlSignalGame(ctxBattle, cmd, nowMs = performance.now()){
    if(!ctxBattle) return false;
    const commandId = normalizeBttlSignalCommand(cmd);
    const now = toNumber(nowMs, performance.now());
    if(getBttlSignalCooldownRemainMs(ctxBattle, commandId, now) > 0){
      return false;
    }
    const costApplied = consumeBttlSignalCost(ctxBattle, commandId);
    if(costApplied <= 0){
      pushBttlLog(ctxBattle, "NO STA");
      return false;
    }
    const mode = normalizeTrnMode(BTTL_SIGNAL_CMD_TO_TRN_MODE[commandId] || "calib");
    const cfg = getTrnModeConfig(mode);
    const metrics = getBttlSignalGameMetrics(getBttlFieldGeometry());
    const minBandR = metrics.minR + ((metrics.maxR - metrics.minR) * TRN_MIN_BAND_R_RATIO);
    const maxBandR = metrics.minR + ((metrics.maxR - metrics.minR) * TRN_MAX_BAND_R_RATIO);
    const spanR = Math.max(1, maxBandR - minBandR);
    const innerBiased = Math.random() ** 2;
    const centerR = minBandR + (innerBiased * spanR);
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stabilityNow / stabilityMax : 0;
    const bandMin = Math.max(6, Math.floor(toNumber(cfg.bandWMin, 16) * 0.58));
    const bandMax = Math.max(bandMin + 2, Math.floor(toNumber(cfg.bandWMax, 30) * 0.58));
    const bandW = clamp(
      bandMin + ((bandMax - bandMin) * stabilityRatio),
      bandMin,
      bandMax
    );
    const ad = clamp(toNumber(state.detailed?.adIntegrity, 100), 0, 100);
    const signal = clamp(toNumber(state.detailed?.signalQuality, 100), 0, 100);
    const syncRate = resolveSyncRate(ad, signal);
    const critChance = clamp(
      toNumber(cfg.critChanceBase, 0.05) + ((syncRate / 100) * toNumber(cfg.critChanceBySync, 0.1)),
      0.03,
      toNumber(cfg.critChanceMax, 0.35)
    );
    const critEnabled = Math.random() < critChance;
    const critW = clamp(
      Math.round(Math.min(toNumber(cfg.critW, 4), Math.max(2, bandW - 2))),
      2,
      Math.max(2, bandW)
    );
    ctxBattle.signalSession = {
      cmd: commandId,
      mode,
      startedAtMs: now,
      loopMs: trnLoopMsFromBpm(cfg.bpm, 375),
      minR: metrics.minR,
      maxR: metrics.maxR,
      centerR,
      bandW,
      critEnabled,
      critW,
      nearMargin: Math.max(1, Math.floor(toNumber(cfg.nearMargin, TRN_BASE_NEAR_MARGIN) * 0.8)),
      internalP: getTrnInternalSuccessBase(mode),
      costApplied,
    };
    ctxBattle.signalResult = null;
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_GAME;
    return true;
  }

  function finishBttlSignalGame(ctxBattle, forcedTier = null, nowMs = performance.now(), options = null){
    if(!ctxBattle || !ctxBattle.signalSession) return;
    const session = ctxBattle.signalSession;
    const currentR = getBttlSignalCurrentRadius(session, nowMs);
    const gameTier = forcedTier || getTrnGameTier(session, currentR);
    const internalRoll = Math.random() < clamp(toNumber(session.internalP, 0.5), 0, 1);
    const finalTier = resolveTrnFinalTier(gameTier, internalRoll);
    const timeout = Boolean(options?.timeout);
    const feedbackGrade = resolveTrnFeedbackGrade(finalTier, timeout);
    const cmd = normalizeBttlSignalCommand(session.cmd);
    const tier = getBttlSignalTierFromGrade(feedbackGrade);
    const hitChanceAdj = getBttlSignalHitBonus(cmd, tier);
    const intervalMult = getBttlSignalIntervalMult(cmd, tier);
    ctxBattle.pendingEffect = {
      cmd,
      tier,
      grade: feedbackGrade,
      hitChanceAdj,
      intervalMult,
      appliesTo: "nextAllyAct",
    };
    const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[cmd] || "SIG";
    const gradeLabel = feedbackGrade === "TIMEOUT" ? "BAD" : feedbackGrade;
    const gradeShort = getBttlSignalGradeShort(gradeLabel);
    pushBttlLog(ctxBattle, `${cmdLabel} ${gradeShort}`);
    ctxBattle.signalSession = null;
    const now = toNumber(nowMs, performance.now());
    ctxBattle.signalResult = {
      grade: gradeLabel,
      untilMs: now + BTTL_SIGNAL_GAME_RESULT_HOLD_MS,
    };
    ctxBattle.signalGlobalCooldownUntilMs = now + BTTL_SIGNAL_GCD_MS;
    const byCmd = isRecord(ctxBattle.signalModeCooldownUntilByCmd)
      ? ctxBattle.signalModeCooldownUntilByCmd
      : {};
    byCmd[cmd] = now + getBttlSignalModeCooldownMs(cmd);
    ctxBattle.signalModeCooldownUntilByCmd = byCmd;
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_GAME;
  }

  function createBttlProjectile(owner, field){
    const spawnOffset = 1;
    const startT = owner === "enemy"
      ? spawnOffset
      : field.topBattleLen + spawnOffset;
    const nowMs = performance.now();
    return {
      t: normalizeRingT(startT, field.ringLen),
      prevT: normalizeRingT(startT, field.ringLen),
      speed: getBttlProjectileSpeed(),
      owner,
      alive: true,
      distance: 0,
      lastUpdateMs: nowMs,
      target: owner === "enemy" ? "ally" : "enemy",
      willHit: false,
      damage: 1,
      meta: null,
    };
  }

  function rollBttlDamage(attacker, ctxBattle){
    if(attacker === "ally"){
      const base = 1 + Math.floor(Math.random() * 3); // 1..3
      const sig = clamp(toNumber(ctxBattle?.ally?.sig, 0), 0, 100);
      const bonus = sig >= 75 ? 1 : 0;
      return clamp(base + bonus, 1, 4);
    }
    return 1 + Math.floor(Math.random() * 3); // 1..3
  }

  function createBttlContext(nowMs = performance.now()){
    const staminaMax = getRuntimeMax("stamina", 100);
    const staNow = clamp(Math.floor(getRuntimeStat("stamina", staminaMax)), 0, staminaMax);
    const ad = clamp(toNumber(state.detailed?.adIntegrity, 100), 0, 100);
    const sig = clamp(toNumber(state.detailed?.signalQuality, 100), 0, 100);
    const sync = resolveSyncRate(ad, sig);
    const allyHp = Math.max(0, staNow);
    const enemyHp = clamp(
      Math.round(Math.max(1, allyHp) * BTTL_ENEMY_HP_RATIO),
      BTTL_ENEMY_HP_MIN,
      BTTL_ENEMY_HP_MAX
    );
    const ctxBattle = {
      phase: BTTL_STATE.INIT,
      phaseStartedAtMs: toNumber(nowMs, performance.now()),
      turn: 0,
      actorIndex: 0, // 0: enemy, 1: ally
      rightPaneMode: BTTL_RIGHTPANE_MODE.SIGNAL_MENU,
      signalMenuIndex: 0,
      signalSession: null,
      signalResult: null,
      signalGlobalCooldownUntilMs: 0,
      signalModeCooldownUntilByCmd: {},
      pendingEffect: null,
      lastSignalProc: null,
      enemyAi: createBttlEnemyAiState(nowMs),
      projectiles: [],
      nextEnemyActAtMs: toNumber(nowMs, performance.now()) + BTTL_INIT_MS + 220,
      nextAllyActAtMs: toNumber(nowMs, performance.now()) + BTTL_INIT_MS + 120,
      ally: {
        hp: allyHp,
        maxHp: allyHp,
        sig,
        sync,
        hitChance: computeBttlHitChance(sig, sync),
        hitFlashUntilMs: 0,
        knockUntilMs: 0,
        knockDir: -1,
      },
      enemy: {
        hp: enemyHp,
        maxHp: enemyHp,
        sig: BTTL_ENEMY_SIG,
        sync: BTTL_ENEMY_SYNC,
        hitChance: computeBttlHitChance(BTTL_ENEMY_SIG, BTTL_ENEMY_SYNC),
        hitFlashUntilMs: 0,
        knockUntilMs: 0,
        knockDir: 1,
      },
      logs: [],
      action: null,
      result: null,
      resultFlavor: "",
      settled: false,
    };
    pushBttlLog(ctxBattle, "BTTL START");
    if(allyHp <= 0){
      pushBttlLog(ctxBattle, "NO STA");
      ctxBattle.result = "LOSE";
      ctxBattle.resultFlavor = "エネルギー切れ。休息が必要。";
      ctxBattle.phase = BTTL_STATE.RESULT;
      pushBttlLog(ctxBattle, "LOSE");
      ctxBattle.settled = true;
    }
    return ctxBattle;
  }

  function settleBttlResult(ctxBattle, result, nowMs = performance.now()){
    if(!ctxBattle || ctxBattle.settled) return;
    const normalized = String(result || "LOSE").toUpperCase() === "WIN" ? "WIN" : "LOSE";
    ctxBattle.result = normalized;
    ctxBattle.resultFlavor = pickBttlResultFlavor(normalized);
    ctxBattle.phase = BTTL_STATE.RESULT;
    ctxBattle.phaseStartedAtMs = toNumber(nowMs, performance.now());
    pushBttlLog(ctxBattle, normalized);

    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    state.detailed = detail;
    const count = Math.max(0, Math.floor(toNumber(detail.battleCount, 0))) + 1;
    detail.battleCount = count;
    const prevWins = Math.max(0, Math.floor(toNumber(detail.battleWins, 0)));
    const wins = normalized === "WIN" ? prevWins + 1 : prevWins;
    detail.battleWins = clamp(wins, 0, count);
    detail.lastUpdateAt = Date.now();
    saveDetailedState();

    ctxBattle.settled = true;
  }

  function abortBttlBattle(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle || ctxBattle.phase === BTTL_STATE.RESULT) return;
    ctxBattle.projectiles = [];
    ctxBattle.signalSession = null;
    ctxBattle.signalResult = null;
    ctxBattle.pendingEffect = null;
    ctxBattle.lastSignalProc = null;
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
    ctxBattle.result = "ABORT";
    ctxBattle.resultFlavor = "手動中断。戦闘を終了した。";
    ctxBattle.phase = BTTL_STATE.RESULT;
    ctxBattle.phaseStartedAtMs = toNumber(nowMs, performance.now());
    pushBttlLog(ctxBattle, "ABORT");
    ctxBattle.settled = true;
  }

  function resolveBttlActionOutcome(ctxBattle, action, nowMs = performance.now(), forceMiss = false){
    if(!ctxBattle || !action || action.outcomeApplied) return;
    action.outcomeApplied = true;
    action.resolved = true;
    action.resolvedAtMs = toNumber(nowMs, performance.now());
    if(action.projectile) action.projectile.alive = false;

    if(!forceMiss && action.willHit){
      const targetKey = action.target === "ally" ? "ally" : "enemy";
      const target = ctxBattle[targetKey];
      const hpNow = Math.max(0, Math.floor(toNumber(target?.hp, 0)));
      const damage = Math.max(1, Math.floor(toNumber(action.damage, 1)));
      const dmgResolved = applyBttlEnemyDefendDamageMitigation(ctxBattle, targetKey, damage);
      const hpLocked = BTTL_DEBUG_ENEMY_HP_LOCK && targetKey === "enemy";
      const appliedDamage = hpLocked ? 0 : dmgResolved.damage;
      const hpNext = Math.max(0, hpNow - appliedDamage);
      target.hp = hpNext;
      target.hitFlashUntilMs = nowMs + BTTL_HIT_FLASH_MS;
      target.knockUntilMs = nowMs + BTTL_KNOCK_MS;
      target.knockDir = targetKey === "enemy" ? 1 : -1;
      noteBttlShotOutcome(ctxBattle, action.attacker, true, nowMs);
      if(dmgResolved.mitigated && !hpLocked && BTTL_ENEMY_AI_AUDIT_LOG){
        pushBttlLog(ctxBattle, "EN DEF DMG↓");
      }
      pushBttlLog(ctxBattle, getBttlOutcomeLogLine(action.attacker, true, appliedDamage));
      return;
    }
    noteBttlShotOutcome(ctxBattle, action.attacker, false, nowMs);
    pushBttlLog(ctxBattle, getBttlOutcomeLogLine(action.attacker, false, 0));
  }

  function beginBttlAction(ctxBattle, attacker, nowMs = performance.now()){
    if(!ctxBattle) return;
    const actorKey = attacker === "ally" ? "ally" : "enemy";
    const targetKey = actorKey === "enemy" ? "ally" : "enemy";
    let consumedEffect = null;
    if(
      actorKey === "ally" &&
      isRecord(ctxBattle.pendingEffect) &&
      ctxBattle.pendingEffect.appliesTo === "nextAllyAct"
    ){
      consumedEffect = { ...ctxBattle.pendingEffect };
      ctxBattle.pendingEffect = null;
    }
    const hitChanceBase = clamp(
      toNumber(ctxBattle[actorKey]?.hitChance, 0.5),
      BTTL_HIT_MIN,
      BTTL_HIT_MAX
    );
    const hitChanceAdj = toNumber(consumedEffect?.hitChanceAdj, 0);
    const hitChance = clamp(hitChanceBase + hitChanceAdj, BTTL_HIT_MIN, BTTL_HIT_MAX);
    const hit = Math.random() < hitChance;
    const damage = rollBttlDamage(actorKey, ctxBattle);
    const field = getBttlFieldGeometry();
    const projectile = createBttlProjectile(actorKey, field);
    projectile.meta = consumedEffect
      ? {
        cmd: consumedEffect.cmd,
        tier: consumedEffect.tier,
        hitChanceAdj,
      }
      : null;
    ctxBattle.action = {
      attacker: actorKey,
      target: targetKey,
      startedAtMs: toNumber(nowMs, performance.now()),
      lastUpdateMs: toNumber(nowMs, performance.now()),
      projectile,
      resolved: false,
      resolvedAtMs: 0,
      willHit: hit,
      damage,
      hitChanceBase,
      hitChanceAdj,
      hitChance,
      outcomeApplied: false,
      finished: false,
    };
  }

  function updateBttlAction(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle || !ctxBattle.action) return;
    const action = ctxBattle.action;
    if(!action.resolved && action.projectile?.alive){
      const field = getBttlFieldGeometry();
      const projectile = action.projectile;
      const dtSec = clamp((nowMs - toNumber(action.lastUpdateMs, nowMs)) / 1000, 0, 0.05);
      action.lastUpdateMs = nowMs;
      projectile.prevT = projectile.t;
      projectile.t = normalizeRingT(projectile.t + (projectile.speed * dtSec), field.ringLen);
      projectile.distance += projectile.speed * dtSec;
      const range = getBttlTargetRangeByOwner(field, projectile.owner);
      const touchedRange = didRingSegmentHitRange(
        projectile.prevT,
        projectile.t,
        range.start,
        range.end,
        field.ringLen
      );
      if(touchedRange){
        resolveBttlActionOutcome(ctxBattle, action, nowMs, !action.willHit);
      }else if(projectile.distance >= (field.ringLen + BTTL_PROJECTILE_MISS_EXTRA_PX)){
        resolveBttlActionOutcome(ctxBattle, action, nowMs, true);
      }
    }
    if(action.resolved && (nowMs - toNumber(action.resolvedAtMs, nowMs)) >= BTTL_ACTION_POST_RESOLVE_MS){
      action.finished = true;
    }
  }

  function buildBttlResultLogText(ctxBattle){
    const resultRaw = String(ctxBattle?.result || "LOSE").toUpperCase();
    const result = (resultRaw === "WIN" || resultRaw === "ABORT") ? resultRaw : "LOSE";
    const resultJa = result === "WIN" ? "勝利" : (result === "ABORT" ? "中断" : "敗北");
    const allyHp = Math.max(0, Math.floor(toNumber(ctxBattle?.ally?.hp, 0)));
    const allyMax = Math.max(0, Math.floor(toNumber(ctxBattle?.ally?.maxHp, 0)));
    const enemyHp = Math.max(0, Math.floor(toNumber(ctxBattle?.enemy?.hp, 0)));
    const enemyMax = Math.max(0, Math.floor(toNumber(ctxBattle?.enemy?.maxHp, 0)));
    const flavor = String(
      ctxBattle?.resultFlavor ||
      (result === "ABORT" ? "手動中断。戦闘を終了した。" : pickBttlResultFlavor(result))
    ).trim();
    const lines = [
      "BTTL RESULT",
      `判定 ${resultJa}`,
      `味方HP ${allyHp}/${allyMax}`,
      `敵HP ${enemyHp}/${enemyMax}`,
      "――――――――",
      flavor,
    ];
    return lines.join("\n");
  }

  function openBttlResultLog(ctxBattle){
    state.bttlResultLogText = buildBttlResultLogText(ctxBattle);
    state.screen = BTTL_LOG_SCREEN;
    setOverlayMode("log");
  }

  function closeBttlResultLogToMenu(){
    state.bttl = null;
    state.bttlResultLogText = "";
    state.screen = "menu";
    setOverlayMode(null);
    hideOverlayLog();
  }

  function updateBttl(nowMs = performance.now()){
    if(state.screen !== "bttl") return;
    if(!isRecord(state.bttl)){
      state.bttl = createBttlContext(nowMs);
    }
    const ctxBattle = state.bttl;
    if(!ctxBattle) return;

    if(ctxBattle.phase === BTTL_STATE.INIT){
      if((nowMs - toNumber(ctxBattle.phaseStartedAtMs, nowMs)) >= BTTL_INIT_MS){
        ctxBattle.phase = BTTL_STATE.TURN;
        ctxBattle.phaseStartedAtMs = nowMs;
        ctxBattle.turn = 0;
      }
      return;
    }

    if(ctxBattle.phase === BTTL_STATE.TURN){
      const paneMode = String(ctxBattle.rightPaneMode || BTTL_RIGHTPANE_MODE.SIGNAL_MENU);
      if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
        if(ctxBattle.signalSession){
          const elapsed = nowMs - toNumber(ctxBattle.signalSession.startedAtMs, nowMs);
          if(elapsed >= BTTL_SIGNAL_GAME_MAX_MS){
            finishBttlSignalGame(ctxBattle, "FAIL", nowMs, { timeout: true });
          }
        }else{
          const holdUntil = toNumber(ctxBattle.signalResult?.untilMs, 0);
          if(holdUntil > 0 && nowMs >= holdUntil){
            ctxBattle.signalResult = null;
            ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
          }
        }
      }

      updateBttlRealtimeProjectiles(ctxBattle, nowMs);
      updateBttlEnemyActionAi(ctxBattle, nowMs);

      let allyHp = Math.max(0, Math.floor(toNumber(ctxBattle.ally?.hp, 0)));
      let enemyHp = Math.max(0, Math.floor(toNumber(ctxBattle.enemy?.hp, 0)));
      if(enemyHp <= 0){
        settleBttlResult(ctxBattle, "WIN", nowMs);
        return;
      }
      if(allyHp <= 0){
        settleBttlResult(ctxBattle, "LOSE", nowMs);
        return;
      }

      if(nowMs >= toNumber(ctxBattle.nextEnemyActAtMs, nowMs)){
        beginBttlRealtimeAttack(ctxBattle, "enemy", nowMs);
        const enemyInterval = computeBttlAttackIntervalMs(ctxBattle, "enemy");
        ctxBattle.nextEnemyActAtMs = nowMs + enemyInterval;
        ctxBattle.turn += 1;
      }
      if(nowMs >= toNumber(ctxBattle.nextAllyActAtMs, nowMs)){
        const allyLaunchEffect = beginBttlRealtimeAttack(ctxBattle, "ally", nowMs);
        const allyInterval = computeBttlAttackIntervalMs(ctxBattle, "ally", allyLaunchEffect);
        ctxBattle.nextAllyActAtMs = nowMs + allyInterval;
      }

      allyHp = Math.max(0, Math.floor(toNumber(ctxBattle.ally?.hp, 0)));
      enemyHp = Math.max(0, Math.floor(toNumber(ctxBattle.enemy?.hp, 0)));
      if(enemyHp <= 0){
        settleBttlResult(ctxBattle, "WIN", nowMs);
        return;
      }
      if(allyHp <= 0){
        settleBttlResult(ctxBattle, "LOSE", nowMs);
        return;
      }
      if(ctxBattle.turn >= BTTL_MAX_TURNS){
        const result = enemyHp <= allyHp ? "WIN" : "LOSE";
        settleBttlResult(ctxBattle, result, nowMs);
        return;
      }
      return;
    }

    if(ctxBattle.phase === BTTL_STATE.PLAYER_WINDOW){
      // Fallback for old state data: immediately return to live battle loop.
      ctxBattle.signalSession = null;
      ctxBattle.signalResult = null;
      if(String(ctxBattle.rightPaneMode || "") === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
        ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
      }
      ctxBattle.phase = BTTL_STATE.TURN;
      ctxBattle.phaseStartedAtMs = nowMs;
      return;
    }

    if(ctxBattle.phase === BTTL_STATE.RESULT){
      openBttlResultLog(ctxBattle);
    }
  }

  function drawBttlRightPaneLog(ctxBattle, right, rightInner){
    drawBox(rightInner.x, rightInner.y, rightInner.w, rightInner.h);
    const headerX = right.x + 8;
    const headerY = right.y + 6;
    drawText(headerX, headerY, "OBS LOG");
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.30)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightInner.x + 2, rightInner.y + 17.5);
    ctx.lineTo(rightInner.x + rightInner.w - 3, rightInner.y + 17.5);
    ctx.stroke();
    ctx.restore();
    const logLines = (Array.isArray(ctxBattle.logs) ? ctxBattle.logs : []).slice(-BTTL_LOG_DRAW_LINES);
    const logTopY = rightInner.y + 22;
    if(logLines.length <= 0){
      drawText(right.x + 8, logTopY, "---", { color: "rgba(14,20,15,0.52)" });
      return;
    }
    for(let i = 0; i < logLines.length; i++){
      const source = String(logLines[i] || "").trim();
      const fitted = fitTrnRightPaneText(source, right.w - 16, { scale: 2 });
      drawText(right.x + 8, logTopY + (i * 14), fitted, { color: "rgba(14,20,15,0.90)" });
    }
  }

  function drawBttlRightPaneSignalMenu(ctxBattle, right, rightInner){
    drawBox(rightInner.x, rightInner.y, rightInner.w, rightInner.h);
    drawText(right.x + 8, right.y + 6, "SIGNAL MENU", { scale: 1 });
    const listX = rightInner.x + 4;
    const textX = listX + 8;
    const lineGap = 11;
    const startY = rightInner.y + 15;
    const selectedCmd = getBttlSignalSelectedCommand(ctxBattle);
    const nowMs = performance.now();
    const globalCooldownActive = getBttlSignalGlobalCooldownRemainMs(ctxBattle, nowMs) > 0;
    for(let i = 0; i < BTTL_SIGNAL_MENU_ITEMS.length; i++){
      const item = BTTL_SIGNAL_MENU_ITEMS[i];
      const rowY = startY + (i * lineGap);
      const selected = item.id === selectedCmd;
      const modeCooldownRemainMs = getBttlSignalModeCooldownRemainMs(ctxBattle, item.id, nowMs);
      const modeCooldownActive = modeCooldownRemainMs > 0;
      const modeCooldownMs = getBttlSignalModeCooldownMs(item.id);
      const modeProgress = modeCooldownActive
        ? clamp(1 - (modeCooldownRemainMs / Math.max(1, modeCooldownMs)), 0, 1)
        : 0;
      if(modeCooldownActive){
        const barX = textX - 1;
        const barW = Math.max(4, (rightInner.x + rightInner.w - 3) - barX);
        const barY = rowY + 7;
        const barH = 2;
        ctx.save();
        ctx.fillStyle = "rgba(14,20,15,0.10)";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = "rgba(14,20,15,0.30)";
        ctx.fillRect(barX, barY, Math.max(1, Math.floor(barW * modeProgress)), barH);
        ctx.restore();
      }
      if(selected){
        drawCursorTriangle(listX, rowY + 1);
      }
      const fitted = fitTrnRightPaneText(item.label, right.w - 20, { scale: 1 });
      drawText(textX, rowY, fitted, {
        scale: 1,
        color: globalCooldownActive
          ? "rgba(14,20,15,0.46)"
          : (selected ? "rgba(14,20,15,0.95)" : "rgba(14,20,15,0.68)"),
      });
    }

    // Lower block: OBS LOG window (smaller text for readability in compact area).
    const logBoxY = startY + (BTTL_SIGNAL_MENU_ITEMS.length * lineGap) + 6;
    const logBoxX = rightInner.x + 2;
    const logBoxW = Math.max(10, rightInner.w - 4);
    const logBoxH = Math.max(20, (rightInner.y + rightInner.h) - logBoxY - 2);
    drawBox(logBoxX, logBoxY, logBoxW, logBoxH);
    drawText(logBoxX + 2, logBoxY + 2, "OBS LOG", { scale: 1, color: "rgba(14,20,15,0.80)" });
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(logBoxX + 2, logBoxY + 11.5);
    ctx.lineTo(logBoxX + logBoxW - 3, logBoxY + 11.5);
    ctx.stroke();
    ctx.restore();

    const availableH = Math.max(0, logBoxH - 14);
    const miniLineGap = 8;
    const maxMiniLines = Math.max(1, Math.min(10, Math.floor(availableH / miniLineGap)));
    const allLogs = Array.isArray(ctxBattle.logs) ? ctxBattle.logs : [];
    const miniLogs = allLogs.slice(-maxMiniLines);
    if(miniLogs.length <= 0){
      drawText(logBoxX + 2, logBoxY + 14, "---", { scale: 1, color: "rgba(14,20,15,0.48)" });
      return;
    }
    for(let i = 0; i < miniLogs.length; i++){
      const fitted = fitTrnRightPaneText(String(miniLogs[i] || "").trim(), logBoxW - 6, { scale: 1 });
      drawText(logBoxX + 2, logBoxY + 14 + (i * miniLineGap), fitted, { scale: 1, color: "rgba(14,20,15,0.86)" });
    }

    // Head fade appears only after the log starts pushing older rows upward.
    if(allLogs.length > maxMiniLines){
      const fadeH = Math.max(miniLineGap + 2, 12);
      const fadeY = logBoxY + 12;
      ctx.save();
      const fade = ctx.createLinearGradient(0, fadeY, 0, fadeY + fadeH);
      fade.addColorStop(0, "rgba(198,212,192,0.95)");
      fade.addColorStop(1, "rgba(198,212,192,0.00)");
      ctx.fillStyle = fade;
      ctx.fillRect(logBoxX + 1, fadeY, Math.max(2, logBoxW - 2), fadeH);
      ctx.restore();
    }
  }

  function drawBttlRightPaneSignalGame(ctxBattle, right, nowMs){
    const metrics = getBttlSignalGameMetrics(getBttlFieldGeometry());
    const rightInner = metrics.rightInner;
    drawBox(rightInner.x, rightInner.y, rightInner.w, rightInner.h);
    const session = ctxBattle.signalSession;
    if(session){
      const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[normalizeBttlSignalCommand(session.cmd)] || "SIG";
      drawText(right.x + 8, right.y + 6, `SIG ${cmdLabel}`, { scale: 1 });
      const ringCx = metrics.cx;
      const ringCy = metrics.cy;
      const waveR = getBttlSignalCurrentRadius(session, nowMs);
      const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
      const stabilityNow = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
      const stabilityRatio = stabilityMax > 0 ? stabilityNow / stabilityMax : 0;
      const visualDistortion = (1 - stabilityRatio) * 3.2;
      drawIdealRing(ringCx, ringCy, session.centerR, toNumber(session.bandW, 8), "rgba(14,20,15,0.16)");
      if(session.critEnabled){
        drawIdealRing(ringCx, ringCy, session.centerR, toNumber(session.critW, 4), "rgba(14,20,15,0.28)");
      }
      drawDistortedRing(
        ringCx,
        ringCy,
        waveR,
        visualDistortion,
        nowMs * 0.007,
        2,
        "rgba(14,20,15,0.58)"
      );
      drawIdealRing(ringCx, ringCy, metrics.minR, 1, "rgba(14,20,15,0.20)");
      drawIdealRing(ringCx, ringCy, metrics.maxR, 1, "rgba(14,20,15,0.16)");
      drawText(metrics.footerRect.x, metrics.footerRect.y + 4, "A:STOP B:BACK", { scale: 1 });
      return;
    }
    const grade = String(ctxBattle.signalResult?.grade || "").trim();
    drawText(right.x + 8, right.y + 6, "SIG RESULT", { scale: 1 });
    if(grade.length > 0){
      const fitted = fitTrnRightPaneText(grade, rightInner.w - 8, { scale: 2 });
      drawText(rightInner.x + Math.floor(rightInner.w / 2), rightInner.y + Math.floor(rightInner.h / 2) - 6, fitted, { align: "center" });
    }
  }

  function drawBttlScreen(view, nowMs = performance.now()){
    if(uiState.overlayMode != null){
      hideOverlayLog();
    }
    if(!isRecord(state.bttl)){
      state.bttl = createBttlContext(nowMs);
    }
    const ctxBattle = state.bttl;
    if(!ctxBattle) return;

    const field = getBttlFieldGeometry();
    const { frame, left, right } = field;
    const spritePx = field.spritePx;

    hudTitle.textContent = "BTTL";
    if(ctxBattle.phase === BTTL_STATE.RESULT){
      hudHint.textContent = "RESULT";
    }else{
      const paneMode = String(ctxBattle.rightPaneMode || BTTL_RIGHTPANE_MODE.SIGNAL_MENU);
      if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
        hudHint.textContent = "A:STOP  B:BACK";
      }else if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_MENU){
        const selectedCmd = getBttlSignalSelectedCommand(ctxBattle);
        const cooldownRemainMs = getBttlSignalCooldownRemainMs(ctxBattle, selectedCmd, nowMs);
        const coolSec = Math.ceil(cooldownRemainMs / 1000);
        hudHint.textContent = cooldownRemainMs > 0
          ? `COOL ${coolSec}S  B:BACK`
          : "↑↓ SELECT  A:ENTER  B:BACK";
      }else{
        hudHint.textContent = "↑↓ SELECT  A:ENTER  B:BACK";
      }
    }

    ctx.save();
    ctx.fillStyle = "rgba(12,18,14,0.14)";
    ctx.fillRect(frame.x + 1, frame.y + 1, frame.w - 2, frame.h - 2);
    ctx.restore();
    drawBox(frame.x, frame.y, frame.w, frame.h);
    drawBox(left.x, left.y, left.w, left.h);
    drawBox(right.x, right.y, right.w, right.h);

    drawBox(field.innerRect.x, field.innerRect.y, field.innerRect.w, field.innerRect.h);
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.34)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(field.innerRect.x + 1, field.dividerY + 0.5);
    ctx.lineTo(field.innerRect.x + field.innerRect.w - 2, field.dividerY + 0.5);
    ctx.stroke();
    ctx.restore();

    const allyAnim = getIdleMonsterAnim(state.t, view);
    const enemyAnim = getIdleMonsterAnim(state.t + 120, { baseSprite: CROW, faceSprite: CROW });
    const allyKnock = nowMs < toNumber(ctxBattle.ally?.knockUntilMs, 0) ? toNumber(ctxBattle.ally?.knockDir, -1) * 2 : 0;
    const enemyKnock = nowMs < toNumber(ctxBattle.enemy?.knockUntilMs, 0) ? toNumber(ctxBattle.enemy?.knockDir, 1) * 2 : 0;

    const enemyX = Math.round(field.enemyBaseX + enemyKnock + enemyAnim.ox);
    const enemyY = Math.round(field.enemyBaseY + enemyAnim.oy);
    const allyX = Math.round(field.allyBaseX + allyKnock + allyAnim.ox);
    const allyY = Math.round(field.allyBaseY + allyAnim.oy);

    drawSprite16x16Facing(enemyX, enemyY, enemyAnim.sprite, DOT_SCALE, "left");
    drawSprite16x16Facing(allyX, allyY, allyAnim.sprite, DOT_SCALE, "right");

    if(nowMs < toNumber(ctxBattle.ally?.hitFlashUntilMs, 0)){
      ctx.save();
      ctx.fillStyle = "rgba(14,20,15,0.10)";
      ctx.fillRect(allyX - 1, allyY - 1, spritePx + 2, spritePx + 2);
      ctx.restore();
    }
    if(nowMs < toNumber(ctxBattle.enemy?.hitFlashUntilMs, 0)){
      ctx.save();
      ctx.fillStyle = "rgba(14,20,15,0.10)";
      ctx.fillRect(enemyX - 1, enemyY - 1, spritePx + 2, spritePx + 2);
      ctx.restore();
    }

    drawBttlSignalStatusBadge(ctxBattle, field, allyX, allyY, nowMs);

    drawText(field.topLaneRect.x, field.topLaneRect.y + 1, `ENEMY ${Math.max(0, Math.floor(toNumber(ctxBattle.enemy?.hp, 0)))}/${Math.max(0, Math.floor(toNumber(ctxBattle.enemy?.maxHp, 0)))}`);
    drawText(
      field.bottomLaneRect.x + field.bottomLaneRect.w,
      field.bottomLaneRect.y + field.bottomLaneRect.h - 12,
      `ALLY ${Math.max(0, Math.floor(toNumber(ctxBattle.ally?.hp, 0)))}/${Math.max(0, Math.floor(toNumber(ctxBattle.ally?.maxHp, 0)))}`,
      { align: "right" }
    );

    if(BTTL_DEBUG_SHOW_RING_POINTS){
      ctx.save();
      ctx.fillStyle = "rgba(14,20,15,0.25)";
      const step = Math.max(4, Math.floor(BTTL_DEBUG_RING_STEP_PX));
      for(let t = 0; t < field.ringLen; t += step){
        const p = bttlRingToPoint(t, field);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
      ctx.restore();
    }

    const activeProjectiles = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    for(const projectile of activeProjectiles){
      if(!projectile?.alive) continue;
      const p = bttlRingToPoint(projectile.t, field);
      drawBttlProjectileShape(p.x, p.y, projectile.owner, BTTL_PROJECTILE_SIZE);
    }

    const rightInner = {
      x: right.x + 4,
      y: right.y + 4,
      w: right.w - 8,
      h: right.h - 8,
    };
    const rightPaneMode = String(ctxBattle.rightPaneMode || BTTL_RIGHTPANE_MODE.SIGNAL_MENU);
    if(rightPaneMode === BTTL_RIGHTPANE_MODE.SIGNAL_MENU){
      drawBttlRightPaneSignalMenu(ctxBattle, right, rightInner);
    }else if(rightPaneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
      drawBttlRightPaneSignalGame(ctxBattle, right, nowMs);
    }else{
      drawBttlRightPaneSignalMenu(ctxBattle, right, rightInner);
    }
  }

  // ===== actions =====
  function applyAction(id){
    if(!DEV_ALLOW_ACTIONS_DURING_SLEEP && state.isSleeping && id !== "stat" && id !== "sleep"){
      state.screen = "menu";
      return;
    }
    menuDeactivate();

    if(id === "feed"){
      applyFeed();
      state.screen = "feed";
      setOverlayMode("log");
      saveDetailedState();
      return;
    }
    if(id === "wc"){ state.screen = "toilet"; return; }
    if(id === "trn"){
      hideOverlayLog();
      setOverlayMode(null);
      uiState.trnSession = null;
      clearTrnResultBuffer();
      setTrnMode(uiState.trnMode);
      state.screen = TRN_MODE_SCREEN;
      return;
    }
    if(id === "bttl"){
      hideOverlayLog();
      setOverlayMode(null);
      state.bttl = createBttlContext(performance.now());
      state.bttlResultLogText = "";
      state.screen = "bttl";
      return;
    }
    if(id === "adv"){ state.screen = "adv"; return; }
    if(id === "sleep"){
      if(!state.isSleeping){
        state.screen = "menu";
        return;
      }
      applySleep();
      if(isRecord(state.detailed)){
        state.detailed.isTuckedIn = true;
      }
      state.screen = "sleep";
      setOverlayMode("log");
      saveDetailedState();
      return;
    }
    if(id === "heal"){
      applyHeal();
      state.screen = "heal";
      setOverlayMode("log");
      saveDetailedState();
      return;
    }
    if(id === "stat"){
      hideOverlayLog();
      state.screen = "status";
      setStatPage(0);
      setOverlayMode("stat");
      return;
    }
    if(id === "edit"){
      hideOverlayLog();
      enterEditor(true);
      return;
    }
  }

  // ===== input =====
  function onLeft(){
    if(state.screen === TRN_MODE_SCREEN){
      cycleTrnMode(-1);
      markCursorMoved();
      return;
    }
    if(state.screen === TRN_SCREEN){
      return;
    }
    if(state.screen === "status"){
      setStatPage(uiState.statPage - 1);
      showOverlayStat();
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      if(menuMoveHorizontal(-1)){
        markCursorMoved();
      }
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.BROWSE){
        if(movePaneHorizontal(-1)) markCursorMoved();
      }else{
        const prevX = state.editor.cursorX;
        state.editor.cursorX = (state.editor.cursorX - 1 + SPRITE_SIZE) % SPRITE_SIZE;
        if(state.editor.cursorX !== prevX) markCursorMoved();
      }
      return;
    }
  }
  function onRight(){
    if(state.screen === TRN_MODE_SCREEN){
      cycleTrnMode(1);
      markCursorMoved();
      return;
    }
    if(state.screen === TRN_SCREEN){
      return;
    }
    if(state.screen === "status"){
      setStatPage(uiState.statPage + 1);
      showOverlayStat();
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      if(menuMoveHorizontal(1)){
        markCursorMoved();
      }
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.BROWSE){
        if(movePaneHorizontal(1)) markCursorMoved();
      }else{
        const prevX = state.editor.cursorX;
        state.editor.cursorX = (state.editor.cursorX + 1) % SPRITE_SIZE;
        if(state.editor.cursorX !== prevX) markCursorMoved();
      }
      return;
    }
  }
  function onUp(){
    if(state.screen === "bttl"){
      const ctxBattle = state.bttl;
      if(
        isRecord(ctxBattle) &&
        String(ctxBattle.rightPaneMode || "") === BTTL_RIGHTPANE_MODE.SIGNAL_MENU
      ){
        cycleBttlSignalMenu(ctxBattle, -1);
        markCursorMoved();
      }
      return;
    }
    if(state.screen === TRN_MODE_SCREEN){
      cycleTrnMode(-1);
      markCursorMoved();
      return;
    }
    if(state.screen === TRN_SCREEN){
      return;
    }
    if(state.screen === "status"){
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      if(state.menu.row === 1){
        if(menuShiftRow(0, menuColAt(1))){
          markCursorMoved();
        }
      }else{
        menuDeactivate();
      }
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.BROWSE){
        if(movePaneVertical(-1)) markCursorMoved();
      }
      else if(state.editor.mode === EDITOR_MODE.SELECT && state.editor.selectState.contextOpen){
        const sel = state.editor.selectState;
        sel.contextIndex = (sel.contextIndex - 1 + sel.commands.length) % sel.commands.length;
      }else{
        const prevY = state.editor.cursorY;
        state.editor.cursorY = (state.editor.cursorY - 1 + SPRITE_SIZE) % SPRITE_SIZE;
        if(state.editor.cursorY !== prevY) markCursorMoved();
      }
      return;
    }
  }
  function onDown(){
    if(state.screen === "bttl"){
      const ctxBattle = state.bttl;
      if(
        isRecord(ctxBattle) &&
        String(ctxBattle.rightPaneMode || "") === BTTL_RIGHTPANE_MODE.SIGNAL_MENU
      ){
        cycleBttlSignalMenu(ctxBattle, 1);
        markCursorMoved();
      }
      return;
    }
    if(state.screen === TRN_MODE_SCREEN){
      cycleTrnMode(1);
      markCursorMoved();
      return;
    }
    if(state.screen === TRN_SCREEN){
      return;
    }
    if(state.screen === "status"){
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      if(state.menu.row === 0){
        if(menuShiftRow(1, menuColAt(0))){
          markCursorMoved();
        }
      }else{
        menuDeactivate();
      }
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.BROWSE){
        if(movePaneVertical(1)) markCursorMoved();
      }
      else if(state.editor.mode === EDITOR_MODE.SELECT && state.editor.selectState.contextOpen){
        const sel = state.editor.selectState;
        sel.contextIndex = (sel.contextIndex + 1) % sel.commands.length;
      }else{
        const prevY = state.editor.cursorY;
        state.editor.cursorY = (state.editor.cursorY + 1) % SPRITE_SIZE;
        if(state.editor.cursorY !== prevY) markCursorMoved();
      }
      return;
    }
  }

  function onA(){
    if(state.screen === TRN_MODE_SCREEN){
      enterTrnPlayScreen(performance.now());
      return;
    }
    if(state.screen === TRN_SCREEN){
      if(uiState.trnSession){
        finishTrnSession(null, performance.now());
      }else{
        const started = startTrnSession(performance.now());
        if(!started){
          openTrnSummaryLogOrReturnMode();
        }
      }
      return;
    }
    if(state.screen === TRN_LOG_SCREEN){
      closeTrnSummaryLog();
      return;
    }
    if(state.screen === BTTL_LOG_SCREEN){
      closeBttlResultLogToMenu();
      return;
    }
    if(state.screen === "bttl"){
      const ctxBattle = state.bttl;
      if(isRecord(ctxBattle)){
        const paneMode = String(ctxBattle.rightPaneMode || "");
        if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_MENU){
          const nowMs = performance.now();
          const selected = getBttlSignalSelectedCommand(ctxBattle);
          if(getBttlSignalCooldownRemainMs(ctxBattle, selected, nowMs) > 0){
            return;
          }
          startBttlSignalGame(ctxBattle, selected, nowMs);
          return;
        }
        if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME && ctxBattle.signalSession){
          finishBttlSignalGame(ctxBattle, null, performance.now());
          return;
        }
      }
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      const item = menuCurrentItem();
      if(item) applyAction(item.id);
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.BROWSE){
        startEditingSelectedSlot();
      }else if(state.editor.mode === EDITOR_MODE.EDIT){
        const x = state.editor.cursorX;
        const y = state.editor.cursorY;
        pushUndoSnapshot(cloneCurrentGrid());
        applyEditorCell(x, y, state.editor.grid[y][x] ? 0 : 1);
      }else if(state.editor.mode === EDITOR_MODE.SELECT){
        const sel = state.editor.selectState;
        if(sel.contextOpen){
          const cmd = sel.commands[sel.contextIndex];
          if(canExecuteSelectCommand(cmd)) executeSelectCommand(cmd);
          return;
        }
        if(sel.phase === 0){
          sel.start = { x: state.editor.cursorX, y: state.editor.cursorY };
          sel.end = null;
          sel.phase = 1;
        }else{
          sel.end = { x: state.editor.cursorX, y: state.editor.cursorY };
          sel.phase = 0;
          sel.contextOpen = true;
          sel.contextIndex = 0;
        }
      }else if(state.editor.mode === EDITOR_MODE.PASTE){
        applyPasteToGrid();
        clearSelectionState();
        state.editor.mode = EDITOR_MODE.EDIT;
      }
      return;
    }
    menuDeactivate();
    state.screen = "menu";
    hideOverlayLog();
  }

  function onB(){
    if(state.screen === TRN_MODE_SCREEN){
      uiState.trnSession = null;
      clearTrnResultBuffer();
      state.screen = "menu";
      hideOverlayLog();
      return;
    }
    if(state.screen === TRN_SCREEN){
      if(uiState.trnSession){
        cancelTrnSession();
      }
      openTrnSummaryLogOrReturnMode();
      return;
    }
    if(state.screen === TRN_LOG_SCREEN){
      closeTrnSummaryLog();
      return;
    }
    if(state.screen === BTTL_LOG_SCREEN){
      closeBttlResultLogToMenu();
      return;
    }
    if(state.screen === "bttl"){
      const ctxBattle = state.bttl;
      if(isRecord(ctxBattle)){
        abortBttlBattle(ctxBattle, performance.now());
      }
      return;
    }
    if(state.screen === "menu"){
      if(!state.menu.active){ menuActivate(); return; }
      menuDeactivate();
      return;
    }
    if(state.screen === "edit"){
      if(state.editor.mode === EDITOR_MODE.EDIT){
        endHistoryBatch();
        state.editor.mode = EDITOR_MODE.BROWSE;
        syncPanePreviewFromSelection();
      }else if(state.editor.mode === EDITOR_MODE.SELECT){
        clearSelectionState();
        state.editor.mode = EDITOR_MODE.EDIT;
      }else if(state.editor.mode === EDITOR_MODE.PASTE){
        clearSelectionState();
        state.editor.mode = EDITOR_MODE.EDIT;
      }else{
        menuDeactivate();
        state.screen = "menu";
        hideOverlayLog();
      }
      return;
    }
    menuDeactivate();
    state.screen = "menu";
    hideOverlayLog();
  }

  function onCPress(){
    if(state.screen === "bttl"){
      return;
    }
    if(state.screen === TRN_MODE_SCREEN || state.screen === TRN_SCREEN || state.screen === BTTL_LOG_SCREEN){
      return;
    }
    state.input.cPressed = true;
    state.input.cPressedAt = Date.now();
    state.input.cLongFired = false;

    if(state.screen !== "edit") return;
    if(state.editor.mode === EDITOR_MODE.BROWSE){
      selectCategoryByOffset(1);
      return;
    }
    if(state.editor.mode === EDITOR_MODE.EDIT){
      state.editor.mode = EDITOR_MODE.SELECT;
      state.editor.selectState.phase = 0;
      state.editor.selectState.start = null;
      state.editor.selectState.end = null;
      state.editor.selectState.contextOpen = false;
      return;
    }
    if(state.editor.mode === EDITOR_MODE.SELECT){
      const sel = state.editor.selectState;
      // Keep C as menu open/close only to avoid accidental command cycling.
      sel.contextOpen = !sel.contextOpen;
      if(sel.contextOpen) sel.contextIndex = 0;
      return;
    }
    if(state.editor.mode === EDITOR_MODE.PASTE){
      state.editor.pasteMode = (state.editor.pasteMode === "OVR") ? "OR" : "OVR";
      return;
    }
  }

  function onCRelease(){
    state.input.cPressed = false;
    state.input.cPressedAt = 0;
    state.input.cLongFired = false;
  }

  function onCLongPress(){
    // reserved hook for future help/overlay
  }

  function holdDirPress(dir, handler){
    const now = Date.now();
    const h = state.input.dirHold[dir];
    if(!h) return;
    handler();
    if(state.screen !== "edit"){
      holdDirRelease(dir);
      return;
    }
    h.pressed = true;
    h.startMs = now;
    h.lastMs = now;
  }

  function holdDirRelease(dir){
    const h = state.input.dirHold[dir];
    if(!h) return;
    h.pressed = false;
    h.startMs = 0;
    h.lastMs = 0;
  }

  function releaseAllDirHolds(){
    holdDirRelease("left");
    holdDirRelease("right");
    holdDirRelease("up");
    holdDirRelease("down");
  }

  function processDirRepeats(){
    if(state.screen !== "edit") return;
    if(state.editor.mode === EDITOR_MODE.SELECT && state.editor.selectState.contextOpen) return;
    const now = Date.now();
    const run = (dir, handler) => {
      const h = state.input.dirHold[dir];
      if(!h || !h.pressed) return;
      if((now - h.startMs) < DIR_REPEAT_DELAY_MS) return;
      if((now - h.lastMs) < DIR_REPEAT_INTERVAL_MS) return;
      handler();
      h.lastMs = now;
    };
    run("left", onLeft);
    run("right", onRight);
    run("up", onUp);
    run("down", onDown);
  }

  document.addEventListener("keydown", (e) => {
    if(e.repeat) return;

    if(state.screen === "edit" && state.editor.mode === EDITOR_MODE.EDIT && e.ctrlKey && (e.key === "z" || e.key === "Z")){
      e.preventDefault();
      e.stopPropagation();
      if(e.shiftKey) redoEditor();
      else undoEditor();
      return;
    }
    if(state.screen === "edit" && state.editor.mode === EDITOR_MODE.EDIT && e.ctrlKey && (e.key === "y" || e.key === "Y")){
      e.preventDefault();
      e.stopPropagation();
      redoEditor();
      return;
    }
    if(state.screen === "edit" && state.editor.mode === EDITOR_MODE.EDIT && (e.key === "u" || e.key === "U")){
      e.preventDefault();
      undoEditor();
      return;
    }
    if(state.screen === "edit" && state.editor.mode === EDITOR_MODE.EDIT && (e.key === "i" || e.key === "I")){
      e.preventDefault();
      redoEditor();
      return;
    }

    if(e.key === "ArrowLeft")  { e.preventDefault(); holdDirPress("left", onLeft); }
    if(e.key === "ArrowRight") { e.preventDefault(); holdDirPress("right", onRight); }
    if(e.key === "ArrowUp")    { e.preventDefault(); holdDirPress("up", onUp); }
    if(e.key === "ArrowDown")  { e.preventDefault(); holdDirPress("down", onDown); }

    if(e.key === "z" || e.key === "Z" || e.key === "Enter"){ e.preventDefault(); onA(); }
    if(e.key === "x" || e.key === "X" || e.key === "Escape"){ e.preventDefault(); onB(); }
    if(e.key === " "){ e.preventDefault(); onA(); }
    if((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey){
      e.preventDefault();
      onCPress();
    }

    // editor shortcuts
    if(state.screen === "edit"){
      if(e.key === "p" || e.key === "P"){ e.preventDefault(); printEditorExport(); }
      if((e.key === "g" || e.key === "G") && state.editor.mode === EDITOR_MODE.EDIT){
        e.preventDefault();
        state.editor.ghostBaseOn = !state.editor.ghostBaseOn;
      }
      if(e.altKey && (e.key === "r" || e.key === "R") && state.editor.mode === EDITOR_MODE.EDIT){
        e.preventDefault();
        resyncEditingSlotFromBaseConfirmed();
      }
      if(e.key === "Delete" || e.key === "Backspace"){
        e.preventDefault();
        if(state.editor.mode === EDITOR_MODE.EDIT){
          pushUndoSnapshot(cloneCurrentGrid());
          state.editor.grid = makeEmptySprite();
          syncEditorToMonsterAndSave();
        }else if(state.editor.mode === EDITOR_MODE.BROWSE){
          clearSelectedSlotToEmpty();
        }
      }
      if(state.editor.mode === EDITOR_MODE.EDIT && !e.altKey && (e.key === "l" || e.key === "L" || e.key === "q" || e.key === "Q" || e.key === "[")){
        e.preventDefault();
        switchEditingSlotInCategory(-1);
      }
      if(state.editor.mode === EDITOR_MODE.EDIT && !e.altKey && (e.key === "r" || e.key === "R" || e.key === "e" || e.key === "E" || e.key === "]")){
        e.preventDefault();
        switchEditingSlotInCategory(1);
      }
      if((e.key === "s" || e.key === "S") && state.editor.mode === EDITOR_MODE.EDIT){
        e.preventDefault();
        commitCurrentEditingSlot();
        state.editor.mode = EDITOR_MODE.BROWSE;
      }
    }
  }, { passive: false });

  document.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft") holdDirRelease("left");
    if(e.key === "ArrowRight") holdDirRelease("right");
    if(e.key === "ArrowUp") holdDirRelease("up");
    if(e.key === "ArrowDown") holdDirRelease("down");
    if(e.key === "c" || e.key === "C"){
      onCRelease();
    }
  });
  window.addEventListener("blur", () => {
    onCRelease();
    releaseAllDirHolds();
  });

  canvas.addEventListener("contextmenu", (e) => {
    if(state.screen === "edit" && state.editor.mode === EDITOR_MODE.EDIT) e.preventDefault();
  });

  canvas.addEventListener("pointerdown", (e) => {
    if(state.screen !== "edit" || state.editor.mode !== EDITOR_MODE.EDIT) return;
    const p = logicalPointFromPointerEvent(e);
    if(!p) return;
    const cell = getEditorCellFromLogicalPoint(p.x, p.y);
    if(!cell) return;

    e.preventDefault();
    beginHistoryBatch();
    const current = state.editor.grid[cell.y][cell.x];
    state.editor.drawValue = (e.button === 2) ? 0 : (current ? 0 : 1);
    state.editor.pointerId = e.pointerId;
    applyEditorCell(cell.x, cell.y, state.editor.drawValue);
    try { canvas.setPointerCapture(e.pointerId); } catch(_err) { /* no-op */ }
  }, { passive: false });

  canvas.addEventListener("pointermove", (e) => {
    if(state.screen !== "edit" || state.editor.mode !== EDITOR_MODE.EDIT) return;
    if(state.editor.pointerId !== e.pointerId) return;
    const p = logicalPointFromPointerEvent(e);
    if(!p) return;
    const cell = getEditorCellFromLogicalPoint(p.x, p.y);
    if(!cell) return;
    e.preventDefault();
    applyEditorCell(cell.x, cell.y, state.editor.drawValue);
  }, { passive: false });

  function endEditorPointer(e){
    if(state.editor.pointerId !== e.pointerId) return;
    state.editor.pointerId = null;
    endHistoryBatch();
  }
  canvas.addEventListener("pointerup", endEditorPointer);
  canvas.addEventListener("pointercancel", endEditorPointer);

  function bindControlPress(button, handler){
    if(window.PointerEvent){
      button.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handler();
      }, { passive: false });
      return;
    }
    button.addEventListener("click", handler);
  }

  function bindDirectionalHold(button, dir, handler){
    if(window.PointerEvent){
      button.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        holdDirPress(dir, handler);
      }, { passive: false });
      const up = (e) => {
        e.preventDefault();
        holdDirRelease(dir);
      };
      button.addEventListener("pointerup", up, { passive: false });
      button.addEventListener("pointercancel", up, { passive: false });
      button.addEventListener("pointerleave", up, { passive: false });
      return;
    }
    button.addEventListener("mousedown", () => holdDirPress(dir, handler));
    button.addEventListener("mouseup", () => holdDirRelease(dir));
    button.addEventListener("mouseleave", () => holdDirRelease(dir));
    button.addEventListener("click", handler);
  }

  // mobile buttons
  bindDirectionalHold(btnUp, "up", onUp);
  bindDirectionalHold(btnDown, "down", onDown);
  bindDirectionalHold(btnLeft, "left", onLeft);
  bindDirectionalHold(btnRight, "right", onRight);
  bindControlPress(btnA, onA);
  bindControlPress(btnB, onB);
  if(window.PointerEvent){
    btnC.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      onCPress();
    }, { passive: false });
    const cUp = (e) => {
      e.preventDefault();
      onCRelease();
    };
    btnC.addEventListener("pointerup", cUp, { passive: false });
    btnC.addEventListener("pointercancel", cUp, { passive: false });
  }else{
    btnC.addEventListener("mousedown", onCPress);
    btnC.addEventListener("mouseup", onCRelease);
    btnC.addEventListener("mouseleave", onCRelease);
  }
  btnUp.textContent = "↑";
  btnDown.textContent = "↓";
  btnLeft.textContent = "←";
  btnRight.textContent = "→";
  btnC.textContent = "C";

  // ===== render =====
  function clearLCD(){
    ctx.fillStyle = "#c8d6c2";
    ctx.fillRect(0, 0, W, H);

    if(uiState.overlayMode == null){
      ctx.save();
      ctx.fillStyle = "rgba(14,20,15,0.03)";
      for(let y=0;y<H;y+=3) ctx.fillRect(0, y, W, 1);
      ctx.restore();
    }
  }

  function drawFrame(){
    ctx.imageSmoothingEnabled = false;
    clearLCD();
    syncMonsterModeFromScreen();
    const view = runtimeGetView(state.monster);
    const nowMs = performance.now();
    const showCursor = uiCursorShouldShow(nowMs, state.cursorFlashUntilMs);
    if(hudClock) hudClock.textContent = gameHHMM();

    if(state.screen === TRN_MODE_SCREEN){
      drawTrnModeSelect(view, showCursor, nowMs);
      return;
    }

    if(state.screen === TRN_SCREEN){
      drawTrnScreen(view, nowMs);
      return;
    }

    if(state.screen === TRN_LOG_SCREEN){
      hudTitle.textContent = "TRN RESULT";
      hudHint.textContent = "A/B BACK";
      const panelX = OVERLAY_LOG_RECT.x;
      const panelY = OVERLAY_LOG_RECT.y;
      const panelW = OVERLAY_LOG_RECT.w;
      const panelH = OVERLAY_LOG_RECT.h;
      drawBox(16, 28, W - 32, H - 44);
      drawText(24, 38, "DOTMON");
      ctx.save();
      ctx.fillStyle = "rgba(200,214,194,0.62)";
      ctx.fillRect(panelX + 1, panelY + 1, panelW - 2, panelH - 2);
      ctx.restore();
      drawBox(panelX, panelY, panelW, panelH);
      showOverlayLog(String(state.trnResultLogText || "TRN RESULT x0"));
      return;
    }

    if(state.screen === BTTL_LOG_SCREEN){
      hudTitle.textContent = "BTTL RESULT";
      hudHint.textContent = "A/B BACK";
      const panelX = OVERLAY_BTTL_RESULT_RECT.x;
      const panelY = OVERLAY_BTTL_RESULT_RECT.y;
      const panelW = OVERLAY_BTTL_RESULT_RECT.w;
      const panelH = OVERLAY_BTTL_RESULT_RECT.h;
      drawBox(16, 28, W - 32, H - 44);
      drawText(24, 38, "DOTMON");
      ctx.save();
      ctx.fillStyle = "rgba(200,214,194,0.62)";
      ctx.fillRect(panelX + 1, panelY + 1, panelW - 2, panelH - 2);
      ctx.restore();
      drawBox(panelX, panelY, panelW, panelH);
      showOverlayLog(String(state.bttlResultLogText || "BTTL RESULT"), OVERLAY_BTTL_RESULT_RECT);
      return;
    }

    if(state.screen === "bttl"){
      drawBttlScreen(view, nowMs);
      return;
    }

    drawBox(16, 28, W - 32, H - 44);
    drawText(24, 38, "DOTMON");
    drawText(W - 90, 38, gameHHMM());

    // monster position
    const spritePx = SPRITE_SIZE * DOT_SCALE;
    const menuY = 64, menuH = 30;
    const playTop = menuY + menuH + 10;
    const playBottom = H - 62;
    const playMidY = (playTop + playBottom) / 2;

    state.mon.x = Math.round(W / 2);
    state.mon.y = Math.round(playMidY - 5);

    const showFieldActors = (state.screen === "menu");
    if(showFieldActors){
      // monster draw
      const anim = getIdleMonsterAnim(state.t, view);
      const sx = (state.mon.x - spritePx / 2) + anim.ox;
      const sy = (state.mon.y - spritePx / 2) + anim.oy;
      drawSprite16x16(Math.round(sx), Math.round(sy), anim.sprite, DOT_SCALE);

      // sleep overlay
      if(state.isSleeping){
        drawText(state.mon.x + 40, state.mon.y - 30, "Zzz", { color: "rgba(14,20,15,0.65)" });
        ctx.save();
        ctx.fillStyle = "rgba(14,20,15,0.10)";
        ctx.fillRect(16, 28, W - 32, H - 44);
        ctx.restore();
      }
    }

    // screens
    if(state.screen === "menu"){
      hideOverlayLog();
      hudTitle.textContent = "MENU";
      hudHint.textContent = t("ui.help.menu");
      drawMainMenu(showCursor);
      return;
    }

    if(state.screen === "edit"){
      hideOverlayLog();
      drawEditor(showCursor);
      return;
    }

    // other screens
    if(state.screen === "status"){
      const page = setStatPage(state.ui?.statPage);
      hudTitle.textContent = `STAT ${page + 1}/${STAT_PAGE_COUNT}`;
    }else{
      hudTitle.textContent = state.screen.toUpperCase();
    }
    hudHint.textContent = "A/B BACK";

    const overlayRect = (state.screen === "status") ? OVERLAY_STAT_RECT : OVERLAY_LOG_RECT;
    const panelX = overlayRect.x;
    const panelY = overlayRect.y;
    const panelW = overlayRect.w;
    const panelH = overlayRect.h;

    ctx.save();
    ctx.fillStyle = "rgba(200,214,194,0.62)";
    ctx.fillRect(panelX + 1, panelY + 1, panelW - 2, panelH - 2);
    ctx.restore();
    drawBox(panelX, panelY, panelW, panelH);

    if(state.screen === "status"){
      showOverlayStat();
      return;
    }

    const overlayLogData = buildOverlayLogByScreen(state.screen);
    if(overlayLogData){
      showOverlayLog(overlayLogData);
    }else{
      hideOverlayLog();
    }
  }

  // ===== loop =====
  function tick(){
    const nowFrame = performance.now();
    let dtSec = (nowFrame - state.lastFrameTime) / 1000;
    state.lastFrameTime = nowFrame;
    if(dtSec > 0.1) dtSec = 0.1;
    if(dtSec < 0) dtSec = 0;

    state.t++;
    runtimeUpdate(state.monster, dtSec);
    processDirRepeats();

    if(state.input.cPressed && !state.input.cLongFired){
      if((Date.now() - state.input.cPressedAt) >= C_LONGPRESS_MS){
        state.input.cLongFired = true;
        onCLongPress();
      }
    }

    {
      const target = (state.screen === "menu")
        ? (state.menu.active ? 1 : MENU_IDLE_ALPHA)
        : 0;
      state.menu.alpha += (target - state.menu.alpha) * MENU_FADE_SPEED;
      if(Math.abs(target - state.menu.alpha) < 0.01) state.menu.alpha = target;
    }

    // ===== real-time speed clock =====
    {
      const now = Date.now();
      let dt = now - state.realLastMs;
      state.realLastMs = now;
      dt = Math.min(dt, 10_000);
      state.realCarryMs += dt;

      while(state.realCarryMs >= 60_000){
        state.realCarryMs -= 60_000;
        state.timeMin += 1;

        if(state.timeMin >= 24*60){
          state.timeMin -= 24*60;
          state.day += 1;
          uiDay.textContent = `DAY ${state.day}`;
        }
      }
    }

    updateDetailedMetricsRealtime(Date.now());
    updateTrnTimeout(nowFrame);
    updateBttl(nowFrame);

    // autosave timestamp every ~60s (frame-based)
    if(state.t % 1800 === 0){
      saveTimeSync();
      saveDetailedState();
    }

    uiClock.textContent = gameHHMM();
    drawFrame();
    requestAnimationFrame(tick);
  }

  // init
  uiDay.textContent = `DAY ${state.day}`;
  uiClock.textContent = gameHHMM();
  tick();
})();

