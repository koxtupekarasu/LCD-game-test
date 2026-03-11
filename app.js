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
  const BITMAP_ADVANCE_X = Number(BitmapFontSpecModule?.ADVANCE_X);
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
  const TRN_START_INTRO_MS = 980;
  const TRN_START_INTRO_FLASH_MAX_ALPHA = 0.16;
  const TRN_START_INTRO_FINAL_HOLD_RATIO = 0.50;
  const TRN_START_INTRO_BLINK_MS = 72;
  const TRN_START_INTRO_TEXT_SCALE = 5;
  const TRN_START_INTRO_HATCH_ALPHA = 0.08;
  const TRN_START_INTRO_HATCH_STEP = 14;
  const TRN_END_REVEAL_MS = 320;
  const TRN_END_REVEAL_INITIAL_ALPHA = 0.76;
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
    OUTRO: "OUTRO",
    RESULT: "RESULT",
  });
  const BTTL_RIGHTPANE_MODE = Object.freeze({
    LOG: "log",
    SIGNAL_MENU: "signal_menu",
    SIGNAL_GAME: "signal_game",
  });
  const BTTL_INIT_MS = 420;
  const BTTL_START_INTRO_TYPE = Object.freeze({
    ENCOUNT: "encount",
    WARNING: "warning",
  });
  const BTTL_START_INTRO_ENCOUNT_MS = 980;
  const BTTL_START_INTRO_WARNING_MS = 1680;
  const BTTL_START_INTRO_WARNING_HP_THRESHOLD = 45;
  const BTTL_START_INTRO_WARNING_CHANCE = 0.35;
  // Debug: set to "warning" to force WARNING!! intro every battle. Set "" to disable.
  const BTTL_START_INTRO_DEBUG_FORCE_TYPE = "";
  const BTTL_START_INTRO_ENCOUNT_FLASH_MAX_ALPHA = 0.16;
  const BTTL_START_INTRO_ENCOUNT_FINAL_HOLD_RATIO = 0.50;
  const BTTL_START_INTRO_ENCOUNT_BLINK_MS = 72;
  const BTTL_START_INTRO_ENCOUNT_TEXT_SCALE = 5;
  const BTTL_START_INTRO_ENCOUNT_HATCH_ALPHA = 0.08;
  const BTTL_START_INTRO_ENCOUNT_HATCH_STEP = 14;
  const BTTL_START_INTRO_WARNING_FLASH_MAX_ALPHA = 0.24;
  const BTTL_START_INTRO_WARNING_NOISE_ALPHA = 0.14;
  const BTTL_START_INTRO_WARNING_FINAL_HOLD_RATIO = 0.30;
  const BTTL_START_INTRO_WARNING_HATCH_ALPHA = 0.12;
  const BTTL_START_INTRO_WARNING_HATCH_STEP = 12;
  const BTTL_END_OUTRO_TYPE = Object.freeze({
    WIN: "win",
    LOST: "lost",
  });
  const BTTL_END_OUTRO_WIN_FLASH_MS = 80;
  const BTTL_END_OUTRO_WIN_FLASH_GAP_MS = 40;
  const BTTL_END_OUTRO_WIN_HOLD_MS = 750;
  const BTTL_END_OUTRO_WIN_TO_WHITE_MS = 320;
  const BTTL_END_OUTRO_WIN_FROM_WHITE_MS = 360;
  const BTTL_END_OUTRO_LOST_FADE_MS = 260;
  const BTTL_END_OUTRO_LOST_HOLD_MS = 750;
  const BTTL_END_OUTRO_LOST_TO_BLACK_MS = 320;
  const BTTL_END_OUTRO_LOST_FROM_BLACK_MS = 360;
  const BTTL_END_OUTRO_LOST_NOISE_ALPHA = 0.10;
  const BTTL_END_OUTRO_HANDOFF_IN_FADE_RATIO = 0.90;
  const BTTL_ACTION_POST_RESOLVE_MS = 90;
  const BTTL_MAIN_PANE_RATIO = 0.73;
  const BTTL_BOTTOM_PANE_RATIO = 0.27;
  const BTTL_PANE_GAP = 6;
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
  const BTTL_BREAK_MAX = 100;
  const BTTL_BREAK_HIGH_RATIO = 0.74;
  const BTTL_BREAK_RECOVERY_PER_SEC = 2.4;
  const BTTL_BREAK_RECOVER_DELAY_MS = 1300;
  const BTTL_BREAK_STATE_MS = 1250;
  const BTTL_BREAK_INTERVAL_MULT = 1.34;
  const BTTL_BREAK_LOG_PLUS_MIN_INTERVAL_MS = 520;
  const BTTL_BREAK_GAIN_HIT_BASE = 4;
  const BTTL_BREAK_GAIN_HIT_SHORT_BONUS = 6;
  const BTTL_BREAK_GAIN_HIT_HEAVY_BONUS = 28;
  const BTTL_BREAK_GAIN_HIT_DAMAGE_SCALE = 1.4;
  const BTTL_BREAK_GAIN_SHORT_PRESSURE_MISS = 3;
  const BTTL_BREAK_GAIN_PARRY = 18;
  const BTTL_BREAK_GAIN_REFLECT = 26;
  const BTTL_BREAK_RECOVERY_MULT_BY_RANGE = Object.freeze({
    short: 0.70,
    mid: 1.00,
    long: 2.25,
  });
  const BTTL_BREAK_GAIN_MULT_BY_RANGE = Object.freeze({
    short: 1.15,
    mid: 1.00,
    long: 0.72,
  });
  const BTTL_LOG_KEEP_MAX = 24;
  const BTTL_LOG_DRAW_LINES = 10;
  const BTTL_BOTTOM_JP_MAX_LINES = 4;
  const BTTL_BOTTOM_NARRATIVE_DRAW_LINES = 4;
  const BTTL_BOTTOM_NARRATIVE_MIN_INTERVAL_MS = 1600;
  const BTTL_BOTTOM_NARRATIVE_IMPORTANT_INTERVAL_MS = 950;
  const BTTL_BOTTOM_NARRATIVE_SUMMARY_INTERVAL_MS = 4800;
  const BTTL_BOTTOM_NARRATIVE_DUPLICATE_BLOCK_MS = 4200;
  const BTTL_BOTTOM_NARRATIVE_CATEGORY_MIN_INTERVAL_MS = Object.freeze({
    alert: 700,
    signal: 1200,
    hint: 1600,
    cause: 2200,
    flow: 3200,
    atmosphere: 2600,
  });
  const BTTL_BOTTOM_NARRATIVE_KIND_COOLDOWN_MS = Object.freeze({
    alert: 1200,
    signal: 2600,
    hint: 2800,
    cause: 3400,
    flow: 5200,
    atmosphere: 5000,
  });
  const BTTL_BOTTOM_NARRATIVE_LINES_BY_KIND = Object.freeze({
    flow_advantage: Object.freeze([
      "流れはこちらにある。",
      "押し込みは維持できている。",
      "主導は渡していない。",
    ]),
    flow_pressure: Object.freeze([
      "押されつつある。",
      "相手が主導を握りつつある。",
      "立て直しが要る。",
    ]),
    flow_even: Object.freeze([
      "拮抗している。",
      "均衡はまだ崩れない。",
      "読み合いは続いている。",
    ]),
    cause_you_miss: Object.freeze([
      "信号が散った。",
      "狙いがまだ甘い。",
      "補正が噛んでいない。",
    ]),
    cause_ene_miss: Object.freeze([
      "相手の照準がぶれた。",
      "被弾は回避できた。",
      "位相差でいなした。",
    ]),
    cause_you_dmg: Object.freeze([
      "攻勢が通った。",
      "出力が素直に乗った。",
      "押し込みは有効だ。",
    ]),
    cause_ene_dmg: Object.freeze([
      "被弾を確認。",
      "守りが薄い。",
      "圧を受けている。",
    ]),
    hint_enemy_defend: Object.freeze([
      "相手は守りに寄せた。",
      "崩すには手数が要る。",
      "押し急ぐと空転する。",
    ]),
    signal_bst_ok: Object.freeze([
      "増幅が噛み合った。",
      "出力が前に出る。",
      "次弾は通しやすい。",
    ]),
    signal_stb_ok: Object.freeze([
      "同期が整った。",
      "乱れは抑えられている。",
      "足場は悪くない。",
    ]),
    signal_cal_ok: Object.freeze([
      "基準位相を捉えた。",
      "補正が深く入った。",
      "流れを戻せる。",
    ]),
    signal_ovc_ok: Object.freeze([
      "過駆動に入った。",
      "無理に間合いを詰める。",
      "安定を犠牲に前へ出る。",
    ]),
    signal_bad: Object.freeze([
      "補正は浅い。",
      "同期がまだ荒い。",
      "整える余地がある。",
    ]),
    signal_ovc_bad: Object.freeze([
      "過駆動は噛まない。",
      "駆動だけが空回りしている。",
      "突入の起点を作れない。",
    ]),
    alert_heavy: Object.freeze([
      "強い反応。来る。",
      "危険信号を検出。",
      "大振りの兆候あり。",
    ]),
    alert_dodge: Object.freeze([
      "紙一重でかわした。",
      "位相ずらし成功。",
      "被弾は避けた。",
    ]),
    alert_parry: Object.freeze([
      "同期反転、通した。",
      "読み勝った。",
      "打ち返しに成功。",
    ]),
    alert_reflect: Object.freeze([
      "打ち返した。",
      "信号を返した。",
      "反応が逆流した。",
    ]),
    alert_bad: Object.freeze([
      "間に合わない。",
      "避けきれなかった。",
      "反応が遅れた。",
    ]),
    atmosphere_start: Object.freeze([
      "擬似生命反応、なお不安定。",
      "記録開始。挙動を観測する。",
      "戦闘位相へ遷移。",
    ]),
    atmosphere_idle: Object.freeze([
      "癖が出始めている。",
      "反応は鈍い。だが死んではいない。",
      "記録値以上に荒さがある。",
    ]),
    range_approach: Object.freeze([
      "間合いが詰まった。",
      "相手が踏み込んでくる。",
      "距離が縮む。重い一撃に注意。",
    ]),
    range_retreat: Object.freeze([
      "相手は距離を取りたがっている。",
      "間合いが離れた。",
      "引き気味だ。追うかは判断次第。",
    ]),
    range_hold: Object.freeze([
      "距離は維持されている。",
      "間合いは膠着気味だ。",
      "まだ均衡は崩れない。",
    ]),
    range_short: Object.freeze([
      "近い。重い一撃に注意。",
      "接近戦。反応速度が問われる。",
      "間合いは短い。危険域だ。",
    ]),
    range_mid: Object.freeze([
      "中距離。読み合いが続く。",
      "標準距離での交戦が続く。",
      "間合いは中間に戻った。",
    ]),
    range_long: Object.freeze([
      "距離を取られた。",
      "遠距離。圧は弱まる。",
      "間合いは長い。仕掛けは遅れる。",
    ]),
    break_rise_enemy: Object.freeze([
      "相手の応答が乱れ始めた。",
      "敵側の同調が揺れている。",
      "崩れの兆候を検知。",
    ]),
    break_rise_ally: Object.freeze([
      "こちらの同期が揺れている。",
      "応答が荒い。立て直しが必要だ。",
      "崩れかけている。無理は禁物。",
    ]),
    break_high_enemy: Object.freeze([
      "敵の乱れが深い。押し時だ。",
      "もう一押しで崩せる。",
      "敵の同調が限界に近い。",
    ]),
    break_high_ally: Object.freeze([
      "危うい。持ち直しを優先したい。",
      "こちらの乱れが深い。",
      "崩壊寸前。受けを固めたい。",
    ]),
    break_enemy: Object.freeze([
      "敵の応答が崩れた。今が好機だ。",
      "敵同調が破綻。攻勢を通せる。",
      "敵BREAK。流れを奪える。",
    ]),
    break_ally: Object.freeze([
      "こちらの応答が崩れた。",
      "BREAK発生。立て直しが必要だ。",
      "同調破綻。耐える時間だ。",
    ]),
    break_recover_enemy: Object.freeze([
      "敵が持ち直しつつある。",
      "敵の応答が戻り始めた。",
      "崩れは収束しつつある。",
    ]),
    break_recover_ally: Object.freeze([
      "こちらの応答が戻り始めた。",
      "同調が回復しつつある。",
      "立て直しの余地が戻った。",
    ]),
  });
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
  const BTTL_ENEMY_SIG = 60;
  const BTTL_ENEMY_SYNC = 54;
  const BTTL_ENEMY_HP_RATIO = 0.58;
  const BTTL_ENEMY_HP_MIN = 8;
  const BTTL_ENEMY_HP_MAX = 65;
  const BTTL_SIGNAL_GAME_RESULT_HOLD_MS = 2200;
  const BTTL_SIGNAL_GAME_MAX_MS = 4200;
  const BTTL_SIGNAL_MENU_ITEMS = Object.freeze([
    Object.freeze({ id: "boost", label: "BOOST" }),
    Object.freeze({ id: "stabilize", label: "STABILIZE" }),
    Object.freeze({ id: "calibrate", label: "CALIBRATE" }),
    Object.freeze({ id: "overclock", label: "OVER CLOCK" }),
  ]);
  const BTTL_SIGNAL_CMD_TO_TRN_MODE = Object.freeze({
    boost: "boost",
    stabilize: "noise",
    calibrate: "calib",
    overclock: "boost",
  });
  const BTTL_SIGNAL_CMD_LOG_LABEL = Object.freeze({
    boost: "BST",
    stabilize: "STB",
    calibrate: "CAL",
    overclock: "OVC",
  });
  const BTTL_SIGNAL_USE_DETAIL_KEY_BY_CMD = Object.freeze({
    boost: "signalUseBoost",
    stabilize: "signalUseStabilize",
    calibrate: "signalUseCalibrate",
    overclock: "signalUseOverclock",
  });
  const BTTL_SIGNAL_HIT_BONUS_BY_TIER = Object.freeze({
    boost: Object.freeze([0.00, 0.04, 0.08, 0.12]),
    stabilize: Object.freeze([0.00, 0.06, 0.12, 0.18]),
    calibrate: Object.freeze([0.00, 0.04, 0.09, 0.14]),
    overclock: Object.freeze([0.00, 0.00, 0.00, 0.00]),
  });
  const BTTL_SIGNAL_INTERVAL_MULT_BY_TIER = Object.freeze({
    boost: Object.freeze([0.99, 0.94, 0.88, 0.82]),
    stabilize: Object.freeze([1.00, 0.97, 0.93, 0.89]),
    calibrate: Object.freeze([1.00, 0.96, 0.91, 0.87]),
    overclock: Object.freeze([1.00, 1.00, 1.00, 1.00]),
  });
  const BTTL_SIGNAL_GCD_MS = 700;
  const BTTL_SIGNAL_MODE_COOLDOWN_MS = Object.freeze({
    boost: 4200,
    stabilize: 3400,
    calibrate: 3200,
    overclock: 4600,
  });
  const BTTL_SIGNAL_PENDING_BLINK_MS = 520;
  const BTTL_SIGNAL_PROC_FLASH_MS = 1400;
  const BTTL_SIGNAL_COST_BY_CMD = Object.freeze({
    boost: 2,
    stabilize: 1,
    calibrate: 1,
    overclock: 2,
  });
  const BTTL_STA_RECOVERY_PER_SEC = 0.55;
  const BTTL_SIGNAL_DURATION_MS_BY_TIER = Object.freeze([600, 2000, 3200, 4500]);
  const BTTL_SIGNAL_APPROACH_MULT_BY_TIER = Object.freeze({
    boost: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    stabilize: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    calibrate: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    overclock: Object.freeze([1.00, 1.45, 1.90, 2.35]),
  });
  const BTTL_SIGNAL_KNOCKBACK_RESIST_BY_TIER = Object.freeze({
    boost: Object.freeze([0.00, 0.00, 0.00, 0.00]),
    stabilize: Object.freeze([0.00, 0.00, 0.00, 0.00]),
    calibrate: Object.freeze([0.00, 0.00, 0.00, 0.00]),
    overclock: Object.freeze([0.00, 0.20, 0.35, 0.50]),
  });
  const BTTL_SIGNAL_DAMAGE_TAKEN_MULT_BY_TIER = Object.freeze({
    boost: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    stabilize: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    calibrate: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    overclock: Object.freeze([1.10, 1.12, 1.15, 1.20]),
  });
  const BTTL_SIGNAL_BREAK_TAKEN_MULT_BY_TIER = Object.freeze({
    boost: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    stabilize: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    calibrate: Object.freeze([1.00, 1.00, 1.00, 1.00]),
    overclock: Object.freeze([1.15, 1.20, 1.28, 1.38]),
  });
  const BTTL_ATTACK_INTERVAL_ALLY_BASE_MS = 2400;
  const BTTL_ATTACK_INTERVAL_ENEMY_BASE_MS = 2300;
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
  const BTTL_ALLY_ACTION = Object.freeze({
    PRESS: "PRESS",
    STABLE: "STABLE",
    DEFEND: "DEFEND",
    EVADE: "EVADE",
  });
  const BTTL_ENEMY_ACTION_INTERVAL_MULT = Object.freeze({
    PRESS: 0.88,
    STABLE: 1.00,
    DEFEND: 1.18,
  });
  const BTTL_ALLY_ACTION_INTERVAL_MULT = Object.freeze({
    PRESS: 0.92,
    STABLE: 1.00,
    DEFEND: 1.16,
    EVADE: 1.10,
  });
  const BTTL_ALLY_DEFEND_DMG_MULT = 0.90;
  const BTTL_ALLY_DODGE_BASE = 0.08;
  const BTTL_ALLY_DODGE_SYNC_WEIGHT = 0.24;
  const BTTL_ALLY_DODGE_STABILITY_WEIGHT = 0.16;
  const BTTL_ALLY_DODGE_EVADE_BONUS = 0.20;
  const BTTL_ALLY_DODGE_DEFEND_PENALTY = 0.06;
  const BTTL_ALLY_PARRY_BASE = 0.03;
  const BTTL_ALLY_PARRY_SYNC_WEIGHT = 0.18;
  const BTTL_ALLY_PARRY_STABILITY_WEIGHT = 0.10;
  const BTTL_ALLY_PARRY_EVADE_BONUS = 0.08;
  const BTTL_ALLY_REFLECT_BASE = 0.08;
  const BTTL_ALLY_REFLECT_SYNC_WEIGHT = 0.18;
  const BTTL_ALLY_REFLECT_STABILITY_WEIGHT = 0.12;
  const BTTL_HEAVY_CHANCE_BASE = 0.16;
  const BTTL_HEAVY_COOLDOWN_MS = 5400;
  const BTTL_HEAVY_INITIAL_READY_RATIO = 0.45;
  const BTTL_HEAVY_TEST_MODE = false;
  const BTTL_HEAVY_TEST_CHANCE_BASE = 0.42;
  const BTTL_HEAVY_TEST_COOLDOWN_MS = 2400;
  const BTTL_HEAVY_TEST_INITIAL_READY_RATIO = 0.20;
  const BTTL_HEAVY_DAMAGE_BONUS = 2;
  const BTTL_HEAVY_SPEED_MULT = 0.88;
  const BTTL_HEAVY_DODGE_PENALTY = 0.12;
  const BTTL_HEAVY_PARRY_BONUS = 0.06;
  const BTTL_HEAVY_REFLECT_BONUS = 0.05;
  const BTTL_HEAVY_REFLECT_DAMAGE_MULT = 1.00;
  const BTTL_HEAVY_REACT_RING_LEAD_MS = 1200;
  const BTTL_HEAVY_REACT_RING_GRACE_MS = 120;
  const BTTL_HEAVY_REACT_LOOP_MS = 740;
  const BTTL_HEAVY_REACT_BAND_W = 8;
  const BTTL_HEAVY_REACT_CRIT_W = 4;
  const BTTL_HEAVY_REACT_NEAR_MARGIN = 4;
  const BTTL_HEAVY_REACT_RESULT_HOLD_MS = 760;
  const BTTL_HEAVY_REACT_SLOW_SCALE = 0.52;
  const BTTL_HEAVY_REACT_DIM_ALPHA = 0.18;
  const BTTL_HEAVY_REACT_FOCUS_DIM_ALPHA = 0.32;
  const BTTL_HEAVY_REACT_FOCUS_ZOOM_SCALE = 1.10;
  const BTTL_PARRY_ENEMY_DELAY_MS = 720;
  const BTTL_REFLECT_DAMAGE_MULT = 1.00;
  const BTTL_HEAVY_TELEGRAPH_MIN_MS = 420;
  const BTTL_HEAVY_TELEGRAPH_MAX_MS = 1800;
  const BTTL_ENEMY_AI_DECIDE_INTERVAL_MS = 320;
  const BTTL_ENEMY_AI_MIN_HOLD_MS = 2500;
  const BTTL_ENEMY_AI_SWITCH_COOLDOWN_MS = 1400;
  const BTTL_ALLY_AI_DECIDE_INTERVAL_MS = 320;
  const BTTL_ALLY_AI_MIN_HOLD_MS = 2100;
  const BTTL_ALLY_AI_SWITCH_COOLDOWN_MS = 900;
  const BTTL_ENEMY_DEFEND_DMG_MULT = 0.88;
  const BTTL_ENEMY_AI_RECENT_WINDOW = 8;
  const BTTL_ENEMY_AI_AUDIT_LOG = false;
  const BTTL_RANGE_INTENT = Object.freeze({
    APPROACH: "APPROACH",
    HOLD: "HOLD",
    RETREAT: "RETREAT",
  });
  const BTTL_RANGE_POS_MIN = 0.05;
  const BTTL_RANGE_POS_MAX = 0.95;
  const BTTL_RANGE_INIT_ENEMY_POS = 0.24;
  const BTTL_RANGE_INIT_ALLY_POS = 0.78;
  const BTTL_RANGE_MIN_GAP = 0.10;
  const BTTL_RANGE_SHORT_THRESHOLD = 0.18;
  const BTTL_RANGE_MID_THRESHOLD = 0.48;
  const BTTL_RANGE_SHORT_ENTER_MARGIN = 0.022;
  const BTTL_RANGE_SHORT_EXIT_MARGIN = 0.008;
  const BTTL_RANGE_LONG_ENTER_MARGIN = 0.020;
  const BTTL_RANGE_LONG_EXIT_MARGIN = 0.012;
  const BTTL_RANGE_MOVE_SPEED_BASE = 0.10;
  const BTTL_RANGE_MOVE_SPEED_APPROACH_BONUS = 0.035;
  const BTTL_RANGE_MOVE_SPEED_RETREAT_BONUS = 0.085;
  const BTTL_RANGE_HOLD_WOBBLE = 0.012;
  const BTTL_RANGE_LERP_SPEED = 8.5;
  const BTTL_RANGE_CENTER_PULL = 0.16;
  const BTTL_RANGE_SAME_INTENT_DAMP = 0.70;
  const BTTL_RANGE_SHORT_APPROACH_RESIST = 0.60;
  const BTTL_RANGE_SHORT_ESCAPE_SPEED = 0.18;
  const BTTL_OVERCLOCK_RUSH_SPEED = 0.38;
  const BTTL_OVERCLOCK_SAME_INTENT_BYPASS = 0.78;
  const BTTL_OVERCLOCK_SHORT_RESIST_BYPASS = 0.70;
  const BTTL_OVERCLOCK_RANGE_LERP_MULT = 1.80;
  const BTTL_RANGE_INTENT_LOG_MIN_INTERVAL_MS = 1800;
  const BTTL_RANGE_STATE_LOG_MIN_INTERVAL_MS = 1400;
  const BTTL_RANGE_HEAVY_CHANCE_BONUS = Object.freeze({
    short: 0.24,
    mid: 0.03,
    long: -0.12,
  });
  const BTTL_RANGE_INTERVAL_MULT = Object.freeze({
    short: 1.00,
    mid: 1.00,
    long: 1.08,
  });
  const BTTL_RANGE_SHORT_HIT_FX_MS = 170;
  const BTTL_SHORT_DIRECT_IMPACT_DELAY_MS = 110;
  const BTTL_SHORT_HEAVY_TELEGRAPH_MIN_MS = 540;
  const BTTL_SHORT_HEAVY_TELEGRAPH_MAX_MS = 980;
  const BTTL_SHORT_LUNGE_MS = 180;
  const BTTL_SHORT_LUNGE_PX = 7;
  const BTTL_SHORT_RECOIL_POS_DELTA = 0.110;
  const BTTL_SHORT_RECOIL_KNOCK_MS = 120;
  const BTTL_SHORT_RECOIL_LONG_MARGIN = 0.10;
  const BTTL_RANGED_HIT_KNOCK_POS_DELTA = 0.028;
  const BTTL_RANGED_HIT_KNOCK_TARGET_RATIO = 0.72;
  const BTTL_SHORT_GATE_SLASH_MS = 560;
  const BTTL_SHORT_GATE_SLASH_HEAVY_MS = 820;
  const BTTL_HIT_GATE_BAR_HALF_H = 9;
  const BTTL_HIT_GATE_BAR_SPACING = 3;
  const BTTL_RANGE_BAR_PAD_X = 10;
  const BTTL_RANGE_BAR_MARKER_HALF = 4;
  const BTTL_RANGE_MARKER_SHAKE_MS = 520;
  const BTTL_RANGE_MARKER_SHAKE_PX = 4;
  const BTTL_RANGE_MARKER_SHAKE_HZ = 20;
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
      adIntegrityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 1,
        SUCCESS: 2,
        CRIT: 3,
      }),
      personalityDeltaByTier: Object.freeze({
        FAIL: Object.freeze({ aggression: 0, curiosity: 0, calmness: 0 }),
        NEAR: Object.freeze({ aggression: 0, curiosity: 1, calmness: 1 }),
        SUCCESS: Object.freeze({ aggression: 0, curiosity: 2, calmness: 1 }),
        CRIT: Object.freeze({ aggression: 0, curiosity: 3, calmness: 2 }),
      }),
      trainingTypeCountsDelta: Object.freeze({
        integrity: 1,
        curiosity: 1,
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
      adIntegrityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 0,
        SUCCESS: 1,
        CRIT: 1,
      }),
      personalityDeltaByTier: Object.freeze({
        FAIL: Object.freeze({ aggression: 0, curiosity: 0, calmness: 0 }),
        NEAR: Object.freeze({ aggression: 1, curiosity: 0, calmness: 0 }),
        SUCCESS: Object.freeze({ aggression: 2, curiosity: 0, calmness: 0 }),
        CRIT: Object.freeze({ aggression: 3, curiosity: 1, calmness: 0 }),
      }),
      trainingTypeCountsDelta: Object.freeze({
        signal: 1,
        aggression: 1,
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
      adIntegrityDeltaByTier: Object.freeze({
        FAIL: 0,
        NEAR: 1,
        SUCCESS: 1,
        CRIT: 2,
      }),
      personalityDeltaByTier: Object.freeze({
        FAIL: Object.freeze({ aggression: 0, curiosity: 0, calmness: 0 }),
        NEAR: Object.freeze({ aggression: 0, curiosity: 0, calmness: 1 }),
        SUCCESS: Object.freeze({ aggression: 0, curiosity: 1, calmness: 2 }),
        CRIT: Object.freeze({ aggression: 0, curiosity: 1, calmness: 3 }),
      }),
      trainingTypeCountsDelta: Object.freeze({
        stability: 1,
        calmness: 1,
      }),
    }),
  });
  const TRAINING_TYPE_COUNT_KEYS = Object.freeze([
    "signal",
    "stability",
    "integrity",
    "aggression",
    "curiosity",
    "calmness",
  ]);
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
  const STAT_PAGE_COUNT = 3;
  const LAST_DELTA_NONE_TEXT = "なし";
  const STAT_DESCRIPTION_TEXT = Object.freeze({
    hp: "現在の耐久値。0になると戦闘不能になる。",
    stamina: "戦術行動の余力。SIGNAL操作などで消費される。",
    hunger: "充足値。高いほど空腹が抑えられている。",
    damage: "損傷の蓄積。高いほど各挙動が不安定になりやすい。",
    stability: "安定度。高いほど状態の乱れが出にくい。",
    aggression: "攻勢傾向。高いほど前に出る選択を取りやすい。",
    curiosity: "探索傾向。未知の挙動へ寄る性質の目安。",
    calmness: "平静傾向。高いほど安定維持を優先しやすい。",
    signalTrend: "信号品質の傾向。矢印は直近の上昇・横ばい・低下。",
    adIntegrity: "媒体健全度。器の保全状態を示す。",
    condition: "現在の総合コンディション評価。",
    chronotype: "活動帯。個体の自然睡眠リズムを示す。",
    growthTrend: "戦績と安定度から見た成長の傾向。",
    mutation: "進化予兆。変質進行の兆しを示す。",
    syncRate: "同調率。信号・安定・媒体の噛み合い度合い。",
    battleHistory: "戦闘履歴。蓄積した勝敗の概要。",
    lastDelta: "直近の変化。最後に記録された差分。",
    note: "観測メモ。現在の読みを短く示す。",
  });
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
  const OVERLAY_FONT_BASE_PX = 16;
  const OVERLAY_FONT_BASE_CANVAS_SCALE = 1.6;
  const OVERLAY_FONT_MIN_PX = 16;
  const OVERLAY_FONT_MAX_PX = 28;
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
  const overlayBottomPane = document.getElementById("overlayBottomPane");
  const uiState = {
    isLogOpen: false,
    overlayMode: null,
    statPage: 0,
    statCursorByPage: Array.from({ length: STAT_PAGE_COUNT }, () => 0),
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
    bttlResultReveal: null,
  };

  function ensureBttlRevealOverlayElement(){
    if(!canvas) return null;
    const host = canvas.parentElement;
    if(!host) return null;
    let el = document.getElementById("bttlRevealOverlay");
    if(!el){
      el = document.createElement("div");
      el.id = "bttlRevealOverlay";
      el.className = "bttl-reveal-overlay";
      host.appendChild(el);
    }
    return el;
  }

  function setBttlRevealOverlayVisual(alpha = 0, mode = "black"){
    const el = ensureBttlRevealOverlayElement();
    if(!el) return;
    const a = clamp(toNumber(alpha, 0), 0, 1);
    if(a <= 0.001){
      el.style.display = "none";
      el.style.background = "transparent";
      return;
    }
    el.style.display = "block";
    if(String(mode || "black").toLowerCase() === "white"){
      el.style.background = `rgba(200,214,194,${a.toFixed(3)})`;
    }else{
      el.style.background = `rgba(14,20,15,${a.toFixed(3)})`;
    }
  }

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
    const canvasScale = Math.max(0.01, Math.min(sx, sy));
    const fontScale = canvasScale / OVERLAY_FONT_BASE_CANVAS_SCALE;
    const nextFontPx = clamp(
      Math.round(OVERLAY_FONT_BASE_PX * fontScale),
      OVERLAY_FONT_MIN_PX,
      OVERLAY_FONT_MAX_PX
    );
    overlayLog.style.left = `${Math.floor(rect.x * sx)}px`;
    overlayLog.style.top = `${Math.floor(rect.y * sy)}px`;
    overlayLog.style.width = `${Math.floor(rect.w * sx)}px`;
    overlayLog.style.height = `${Math.floor(rect.h * sy)}px`;
    overlayLog.style.fontSize = `${nextFontPx}px`;
    overlayLog.style.lineHeight = "1.5";
  }

  function setOverlayMode(mode){
    const nextMode = (mode === "log" || mode === "stat") ? mode : null;
    uiState.overlayMode = nextMode;
    uiState.isLogOpen = nextMode === "log";
  }

  function setOverlayBottomPaneRect(rect){
    if(!overlayBottomPane || !canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const sx = bounds.width / W;
    const sy = bounds.height / H;
    const pxW = Math.max(1, Math.floor(rect.w * sx));
    const pxH = Math.max(1, Math.floor(rect.h * sy));
    const canvasScale = Math.max(0.01, Math.min(sx, sy));
    const fitFontByHeight = Math.max(9, Math.floor((pxH - 6) / Math.max(1, BTTL_BOTTOM_JP_MAX_LINES)));
    const fontScale = canvasScale / OVERLAY_FONT_BASE_CANVAS_SCALE;
    const scaledFont = Math.round(OVERLAY_FONT_BASE_PX * fontScale);
    const nextFontPx = clamp(Math.min(scaledFont, fitFontByHeight) - 1, 9, 15);
    const linePx = Math.max(nextFontPx + 1, Math.floor((pxH - 4) / Math.max(1, BTTL_BOTTOM_JP_MAX_LINES)));
    overlayBottomPane.style.left = `${Math.floor(rect.x * sx)}px`;
    overlayBottomPane.style.top = `${Math.floor(rect.y * sy)}px`;
    overlayBottomPane.style.width = `${pxW}px`;
    overlayBottomPane.style.height = `${pxH}px`;
    overlayBottomPane.style.fontSize = `${nextFontPx}px`;
    overlayBottomPane.style.lineHeight = `${linePx}px`;
  }

  function showBttlBottomPaneOverlay(lines, rect){
    if(!overlayBottomPane) return;
    const safeLines = Array.isArray(lines) ? lines.slice(-BTTL_BOTTOM_JP_MAX_LINES) : [];
    setOverlayBottomPaneRect(rect);
    overlayBottomPane.textContent = "";
    const total = safeLines.length;
    for(let i = 0; i < total; i++){
      const line = String(safeLines[i] ?? "");
      const row = document.createElement("span");
      row.className = "overlay-bottom-line";
      row.textContent = line;
      // Keep the newest line darkest, older lines slightly faded.
      const depth = total <= 1 ? 1 : (i / Math.max(1, total - 1));
      const alpha = 0.52 + (depth * 0.42);
      row.style.opacity = alpha.toFixed(2);
      overlayBottomPane.appendChild(row);
    }
    overlayBottomPane.classList.remove("hidden");
  }

  function hideBttlBottomPaneOverlay(){
    if(!overlayBottomPane) return;
    overlayBottomPane.classList.add("hidden");
    overlayBottomPane.textContent = "";
  }

  function normalizeStatPage(value){
    const num = Math.floor(Number(value));
    if(!Number.isFinite(num)) return 0;
    const mod = num % STAT_PAGE_COUNT;
    return mod < 0 ? mod + STAT_PAGE_COUNT : mod;
  }

  function ensureStatCursorByPage(){
    if(!Array.isArray(uiState.statCursorByPage)){
      uiState.statCursorByPage = Array.from({ length: STAT_PAGE_COUNT }, () => 0);
      return uiState.statCursorByPage;
    }
    if(uiState.statCursorByPage.length !== STAT_PAGE_COUNT){
      const next = Array.from({ length: STAT_PAGE_COUNT }, (_v, i) => {
        const raw = Number(uiState.statCursorByPage[i]);
        return Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
      });
      uiState.statCursorByPage = next;
    }
    return uiState.statCursorByPage;
  }

  function getStatCursor(page){
    const nextPage = normalizeStatPage(page);
    const list = ensureStatCursorByPage();
    const raw = Number(list[nextPage]);
    return Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
  }

  function setStatCursor(page, cursor){
    const nextPage = normalizeStatPage(page);
    const list = ensureStatCursorByPage();
    const items = getStatItemsForPage(nextPage);
    if(items.length <= 0){
      list[nextPage] = 0;
      return 0;
    }
    const nextCursorRaw = Math.floor(Number(cursor));
    const safeCursor = Number.isFinite(nextCursorRaw)
      ? ((nextCursorRaw % items.length) + items.length) % items.length
      : 0;
    list[nextPage] = safeCursor;
    return safeCursor;
  }

  function moveStatCursor(delta){
    const page = setStatPage(uiState.statPage);
    const current = getStatCursor(page);
    return setStatCursor(page, current + Math.floor(toNumber(delta, 0)));
  }

  function resetStatCursors(){
    uiState.statCursorByPage = Array.from({ length: STAT_PAGE_COUNT }, () => 0);
  }

  function setStatPage(page){
    const next = normalizeStatPage(page);
    uiState.statPage = next;
    setStatCursor(next, getStatCursor(next));
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
    const playStartedAtMs = getTrnPlayStartedAtMs(session, nowMs);
    const elapsed = Math.max(0, nowMs - playStartedAtMs);
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

  function isTrnStartIntroActive(session, nowMs = performance.now()){
    if(!isRecord(session)) return false;
    const now = toNumber(nowMs, performance.now());
    const startedAtMs = toNumber(session.introStartedAtMs, now);
    const rawUntilMs = toNumber(session.introUntilMs, startedAtMs);
    const maxIntroMs = Math.max(
      240,
      Math.floor(toNumber(TRN_START_INTRO_MS, 980) * 3)
    );
    const untilMs = clamp(rawUntilMs, startedAtMs, startedAtMs + maxIntroMs);
    return untilMs > 0 && now < untilMs;
  }

  function getTrnPlayStartedAtMs(session, nowMs = performance.now()){
    if(!isRecord(session)) return toNumber(nowMs, performance.now());
    const now = toNumber(nowMs, performance.now());
    const startedAtMs = toNumber(session.startedAtMs, now);
    const introUntilRawMs = toNumber(session.introUntilMs, startedAtMs);
    const maxIntroMs = Math.max(
      240,
      Math.floor(toNumber(TRN_START_INTRO_MS, 980) * 3)
    );
    const introUntilMs = clamp(introUntilRawMs, startedAtMs, startedAtMs + maxIntroMs);
    return Math.max(startedAtMs, introUntilMs);
  }

  function drawTrnStartIntroOverlay(frameRect, leftPaneRect, session, nowMs = performance.now()){
    if(!frameRect || !leftPaneRect || !isTrnStartIntroActive(session, nowMs)) return;
    const now = toNumber(nowMs, performance.now());
    const startedAtMs = toNumber(session.introStartedAtMs, now);
    const untilMs = Math.max(startedAtMs + 1, toNumber(session.introUntilMs, startedAtMs + TRN_START_INTRO_MS));
    const durationMs = Math.max(1, untilMs - startedAtMs);
    const elapsedMs = Math.max(0, now - startedAtMs);
    const progress = clamp(elapsedMs / durationMs, 0, 1);
    const flashWindow = 0.22;
    const flashMax = clamp(toNumber(TRN_START_INTRO_FLASH_MAX_ALPHA, 0.16), 0, 0.6);
    let flashAlpha = 0;
    if(progress <= flashWindow){
      flashAlpha = flashMax * (1 - (progress / flashWindow));
    }
    const blinkMs = Math.max(40, Math.floor(toNumber(TRN_START_INTRO_BLINK_MS, 72)));
    const finalHoldRatio = clamp(toNumber(TRN_START_INTRO_FINAL_HOLD_RATIO, 0.50), 0.10, 0.90);
    const showText = progress >= finalHoldRatio || (Math.floor(elapsedMs / blinkMs) % 2 === 0);

    ctx.save();
    if(flashAlpha > 0.001){
      ctx.fillStyle = `rgba(200,214,194,${flashAlpha.toFixed(3)})`;
      ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
    }
    if(showText){
      drawBttlEncountCenterPlate(frameRect, leftPaneRect, "START", now, {
        scale: toNumber(TRN_START_INTRO_TEXT_SCALE, 5),
        textScale: toNumber(TRN_START_INTRO_TEXT_SCALE, 5),
        drawHatch: false,
      });
    }
    ctx.restore();
  }

  function triggerTrnEndReveal(feedbackGrade, nowMs = performance.now()){
    const grade = String(feedbackGrade || "").toUpperCase();
    const mode = grade === "BAD" ? "black" : "white";
    uiState.bttlResultReveal = {
      mode,
      startedAtMs: toNumber(nowMs, performance.now()),
      durationMs: Math.max(120, Math.floor(toNumber(TRN_END_REVEAL_MS, 320))),
      initialAlpha: clamp(toNumber(TRN_END_REVEAL_INITIAL_ALPHA, 0.76), 0.20, 1),
    };
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
    const introStartedAtMs = toNumber(nowMs, performance.now());
    const introMs = Math.max(120, Math.floor(toNumber(TRN_START_INTRO_MS, 980)));
    const introUntilMs = introStartedAtMs + introMs;

    uiState.trnLastFeedback = null;
    clearTrnSuccessFx();
    uiState.trnBadShakeUntilMs = 0;
    uiState.trnBadShakeDir = 0;
    uiState.bttlResultReveal = null;
    setBttlRevealOverlayVisual(0, "black");
    uiState.trnSession = {
      mode,
      startedAtMs: introStartedAtMs,
      introStartedAtMs,
      introUntilMs,
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

  function ensureTrnGrowthTargets(detail){
    const targetDetail = isRecord(detail)
      ? detail
      : createDefaultDetailedState(state.monster?.id || "mon001");
    if(!isRecord(targetDetail.trainingTypeCounts)){
      targetDetail.trainingTypeCounts = createDefaultTrainingTypeCounts();
    }else{
      targetDetail.trainingTypeCounts = normalizeTrainingTypeCounts(
        targetDetail.trainingTypeCounts,
        createDefaultTrainingTypeCounts()
      );
    }

    state.monster = ensureMonsterSchema(state.monster, state.monster?.id || "mon001");
    if(!isRecord(state.monster.personality)){
      state.monster.personality = {
        aggression: 0,
        curiosity: 0,
        calmness: 0,
      };
    }
    return {
      detail: targetDetail,
      personality: state.monster.personality,
    };
  }

  function addTrainingTypeCounts(detail, deltas){
    if(!isRecord(detail)) return;
    if(!isRecord(detail.trainingTypeCounts)){
      detail.trainingTypeCounts = createDefaultTrainingTypeCounts();
    }
    for(let i = 0; i < TRAINING_TYPE_COUNT_KEYS.length; i++){
      const key = TRAINING_TYPE_COUNT_KEYS[i];
      const inc = Math.max(0, Math.floor(toNumber(deltas?.[key], 0)));
      if(inc <= 0) continue;
      detail.trainingTypeCounts[key] = Math.max(
        0,
        Math.floor(toNumber(detail.trainingTypeCounts[key], 0))
      ) + inc;
    }
  }

  function applyTrnResult(mode, tier){
    const cfg = getTrnModeConfig(mode);
    const normalizedTier = String(tier || "FAIL").toUpperCase();
    const { detail, personality } = ensureTrnGrowthTargets(state.detailed);
    state.detailed = detail;

    const deltaStamina = consumeStamina(cfg.staminaCost);
    const adBefore = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const adDeltaRaw = toNumber(cfg.adIntegrityDeltaByTier?.[normalizedTier], 0);
    const adAfter = clamp(adBefore + adDeltaRaw, 0, 100);
    detail.adIntegrity = adAfter;
    const adApplied = adAfter - adBefore;

    const signalBefore = clamp(toNumber(detail.signalQuality, 100), 0, 100);
    const signalDeltaRaw = toNumber(cfg.signalDeltaByTier?.[normalizedTier], 0);
    const signalAfter = clamp(signalBefore + signalDeltaRaw, 0, adAfter);
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

    const personalityDelta = cfg.personalityDeltaByTier?.[normalizedTier] || {};
    const nextAggression = clamp(
      toNumber(personality.aggression, 0) + toNumber(personalityDelta.aggression, 0),
      0,
      100
    );
    const nextCuriosity = clamp(
      toNumber(personality.curiosity, 0) + toNumber(personalityDelta.curiosity, 0),
      0,
      100
    );
    const nextCalmness = clamp(
      toNumber(personality.calmness, 0) + toNumber(personalityDelta.calmness, 0),
      0,
      100
    );
    const personalityApplied = {
      aggression: nextAggression - toNumber(personality.aggression, 0),
      curiosity: nextCuriosity - toNumber(personality.curiosity, 0),
      calmness: nextCalmness - toNumber(personality.calmness, 0),
    };
    personality.aggression = nextAggression;
    personality.curiosity = nextCuriosity;
    personality.calmness = nextCalmness;

    detail.trainingCount = Math.max(0, Math.floor(toNumber(detail.trainingCount, 0))) + 1;
    addTrainingTypeCounts(detail, cfg.trainingTypeCountsDelta);

    const deltaForLast = sanitizeDelta({
      stamina: deltaStamina,
      stability: stabilityApplied,
    });
    recordLastDeltaLine(deltaForLast);
    saveDetailedState();
    saveWithVersion(state.monster);
    return {
      tier: normalizedTier,
      deltaStamina,
      deltaSignal: signalApplied,
      deltaStability: stabilityApplied,
      deltaAdIntegrity: adApplied,
      deltaPersonality: personalityApplied,
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
    saveWithVersion(state.monster);
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

  function clearBttlSignalSuccessFx(ctxBattle){
    if(!ctxBattle) return;
    ctxBattle.signalFxOkCenterUntilMs = 0;
    ctxBattle.signalFxSuccessCenterUntilMs = 0;
    ctxBattle.signalFxSuccessOuterRippleUntilMs = 0;
  }

  function triggerBttlSignalStopFx(ctxBattle, feedbackGrade, nowMs = performance.now()){
    if(!ctxBattle) return;
    clearBttlSignalSuccessFx(ctxBattle);
    ctxBattle.signalFxBadShakeUntilMs = 0;
    ctxBattle.signalFxBadShakeDir = 0;
    const grade = String(feedbackGrade || "").toUpperCase();
    if(grade === "SUCCESS"){
      ctxBattle.signalFxSuccessCenterUntilMs = nowMs + TRN_SUCCESS_CENTER_FLASH_MS;
      ctxBattle.signalFxSuccessOuterRippleUntilMs = nowMs + TRN_SUCCESS_OUTER_RIPPLE_MS;
      return;
    }
    if(grade === "OK"){
      ctxBattle.signalFxOkCenterUntilMs = nowMs + TRN_OK_CENTER_FLASH_MS;
      return;
    }
    if(grade === "BAD" || grade === "TIMEOUT"){
      ctxBattle.signalFxBadShakeUntilMs = nowMs + TRN_BAD_SHAKE_MS;
      ctxBattle.signalFxBadShakeDir = Math.random() < 0.5 ? -1 : 1;
    }
  }

  function drawBttlSignalStopFx(ctxBattle, nowMs, playRect, ringCx, ringCy, ringMinR, ringMaxR){
    const okCenterRemain = toNumber(ctxBattle?.signalFxOkCenterUntilMs, 0) - nowMs;
    const successCenterRemain = toNumber(ctxBattle?.signalFxSuccessCenterUntilMs, 0) - nowMs;
    const successOuterRippleRemain = toNumber(ctxBattle?.signalFxSuccessOuterRippleUntilMs, 0) - nowMs;
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

    ctx.save();
    ctx.beginPath();
    ctx.rect(playRect.x, playRect.y, playRect.w, playRect.h);
    ctx.clip();
    if(okCenterActive){
      drawRipple(ringMinR, okCenterRemain, TRN_OK_CENTER_FLASH_MS, 8, 0.28, 2);
    }
    if(successCenterActive){
      drawRipple(ringMinR, successCenterRemain, TRN_SUCCESS_CENTER_FLASH_MS, 10, 0.34, 2);
    }
    if(successOuterRippleActive){
      drawRipple(ringMaxR, successOuterRippleRemain, TRN_SUCCESS_OUTER_RIPPLE_MS, TRN_SUCCESS_OUTER_RIPPLE_DELTA_PX, 0.22, 1);
    }
    ctx.restore();
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

  function openTrnSummaryLogOrReturnMode(reason = null, nowMs = performance.now()){
    const list = Array.isArray(uiState.trnResultBuffer) ? uiState.trnResultBuffer : [];
    if(list.length <= 0){
      state.screen = TRN_MODE_SCREEN;
      hideOverlayLog();
      return;
    }
    // Result transition only: keep TRN end reveal out of per-session finish flow.
    triggerTrnEndReveal("SUCCESS", nowMs);
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
    // Ensure per-session stop does not trigger reveal while staying on TRN screen.
    uiState.bttlResultReveal = null;
    setBttlRevealOverlayVisual(0, "black");
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
    const playStartedAtMs = getTrnPlayStartedAtMs(session, nowMs);
    if((nowMs - playStartedAtMs) >= TRN_MAX_MS){
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

  function resolveStatDescription(item){
    if(!isRecord(item)) return "項目を選択すると説明が表示される。";
    if(typeof item.description === "string" && item.description.trim().length > 0){
      return item.description;
    }
    const key = String(item.id || "");
    return STAT_DESCRIPTION_TEXT[key] || "この項目の説明は準備中。";
  }

  function appendStatDescriptionPane(root, item){
    const description = document.createElement("div");
    description.className = "overlay-stat-description";

    const label = document.createElement("div");
    label.className = "overlay-stat-description-label";
    label.textContent = isRecord(item) ? item.label : "説明";

    const text = document.createElement("div");
    text.className = "overlay-stat-description-text";
    text.textContent = resolveStatDescription(item);

    description.appendChild(label);
    description.appendChild(text);
    root.appendChild(description);
  }

  function appendStatPage1(root, items, selectedIndex){
    const grid = document.createElement("div");
    grid.className = "overlay-stat-grid";
    for(let i = 0; i < items.length; i++){
      const row = items[i];
      const selected = i === selectedIndex;
      const rowEl = document.createElement("div");
      rowEl.className = `overlay-stat-row${selected ? " is-selected" : ""}`;

      const cursorEl = document.createElement("div");
      cursorEl.className = `overlay-stat-cursor${selected ? " is-selected" : ""}`;
      cursorEl.textContent = selected ? ">" : " ";

      const labelEl = document.createElement("div");
      labelEl.className = `overlay-stat-label${selected ? " is-selected" : ""}`;
      labelEl.textContent = row.label;

      const barEl = document.createElement("div");
      barEl.className = `overlay-stat-bar${selected ? " is-selected" : ""}`;
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
      valueEl.className = `overlay-stat-value${selected ? " is-selected" : ""}`;
      valueEl.textContent = row.value;

      rowEl.appendChild(cursorEl);
      rowEl.appendChild(labelEl);
      rowEl.appendChild(barEl);
      rowEl.appendChild(valueEl);
      grid.appendChild(rowEl);
    }
    root.appendChild(grid);
  }

  function appendStatListPage(root, items, selectedIndex){
    const list = document.createElement("div");
    list.className = "overlay-stat-list";
    for(let i = 0; i < items.length; i++){
      const row = items[i];
      const selected = i === selectedIndex;
      const rowEl = document.createElement("div");
      rowEl.className = `overlay-stat-list-row${selected ? " is-selected" : ""}`;

      const cursorEl = document.createElement("div");
      cursorEl.className = `overlay-stat-cursor${selected ? " is-selected" : ""}`;
      cursorEl.textContent = selected ? ">" : " ";

      const labelEl = document.createElement("div");
      labelEl.className = "overlay-stat-list-label";
      labelEl.textContent = row.label;

      const valueEl = document.createElement("div");
      valueEl.className = "overlay-stat-list-value";
      valueEl.textContent = String(row.value ?? "--");

      rowEl.appendChild(cursorEl);
      rowEl.appendChild(labelEl);
      rowEl.appendChild(valueEl);
      list.appendChild(rowEl);
    }
    root.appendChild(list);
  }

  function appendStatPage2(root, items, selectedIndex){
    const barItems = [];
    const listItems = [];
    for(let i = 0; i < items.length; i++){
      const row = isRecord(items[i]) ? items[i] : {};
      const entry = { ...row, __index: i };
      if(row.view === "bar"){
        barItems.push(entry);
      }else{
        listItems.push(entry);
      }
    }

    if(barItems.length > 0){
      const grid = document.createElement("div");
      grid.className = "overlay-stat-grid overlay-stat-grid-page2";
      for(let i = 0; i < barItems.length; i++){
        const row = barItems[i];
        const selected = row.__index === selectedIndex;
        const rowEl = document.createElement("div");
        rowEl.className = `overlay-stat-row${selected ? " is-selected" : ""}`;

        const cursorEl = document.createElement("div");
        cursorEl.className = `overlay-stat-cursor${selected ? " is-selected" : ""}`;
        cursorEl.textContent = selected ? ">" : " ";

        const labelEl = document.createElement("div");
        labelEl.className = `overlay-stat-label${selected ? " is-selected" : ""}`;
        labelEl.textContent = row.label;

        const barEl = document.createElement("div");
        barEl.className = `overlay-stat-bar${selected ? " is-selected" : ""}`;
        const fillEl = document.createElement("div");
        fillEl.className = "overlay-stat-barFill";
        if(row.ratio == null){
          barEl.classList.add("is-unavailable");
          fillEl.style.width = "0%";
        }else{
          fillEl.style.width = `${Math.round(clamp(toNumber(row.ratio, 0), 0, 1) * 1000) / 10}%`;
        }
        barEl.appendChild(fillEl);

        const valueEl = document.createElement("div");
        valueEl.className = `overlay-stat-value${selected ? " is-selected" : ""}`;
        valueEl.textContent = String(row.value ?? "--");

        rowEl.appendChild(cursorEl);
        rowEl.appendChild(labelEl);
        rowEl.appendChild(barEl);
        rowEl.appendChild(valueEl);
        grid.appendChild(rowEl);
      }
      root.appendChild(grid);
    }

    if(listItems.length > 0){
      const list = document.createElement("div");
      list.className = "overlay-stat-list overlay-stat-list-page2";
      for(let i = 0; i < listItems.length; i++){
        const row = listItems[i];
        const selected = row.__index === selectedIndex;
        const rowEl = document.createElement("div");
        rowEl.className = `overlay-stat-list-row${selected ? " is-selected" : ""}`;

        const cursorEl = document.createElement("div");
        cursorEl.className = `overlay-stat-cursor${selected ? " is-selected" : ""}`;
        cursorEl.textContent = selected ? ">" : " ";

        const labelEl = document.createElement("div");
        labelEl.className = "overlay-stat-list-label";
        labelEl.textContent = row.label;

        const valueEl = document.createElement("div");
        valueEl.className = "overlay-stat-list-value";
        valueEl.textContent = String(row.value ?? "--");

        rowEl.appendChild(cursorEl);
        rowEl.appendChild(labelEl);
        rowEl.appendChild(valueEl);
        list.appendChild(rowEl);
      }
      root.appendChild(list);
    }
  }

  function showOverlayStat(){
    if(!showOverlayShell("stat")) return;
    overlayLogTitle.textContent = "";
    overlayLogHint.textContent = "";
    overlayLogBody.textContent = "";

    const page = setStatPage(uiState.statPage);
    const items = getStatItemsForPage(page);
    const selectedIndex = setStatCursor(page, getStatCursor(page));
    const selectedItem = items[selectedIndex] || null;

    const pageRoot = document.createElement("div");
    pageRoot.className = "overlay-stat-page";
    const pageMain = document.createElement("div");
    pageMain.className = "overlay-stat-main";

    if(page === 0){
      appendStatPage1(pageMain, items, selectedIndex);
    }else if(page === 1){
      appendStatPage2(pageMain, items, selectedIndex);
    }else{
      appendStatListPage(pageMain, items, selectedIndex);
    }
    pageRoot.appendChild(pageMain);
    appendStatDescriptionPane(pageRoot, selectedItem);
    overlayLogBody.appendChild(pageRoot);
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

  function createDefaultTrainingTypeCounts(){
    const counts = {};
    for(let i = 0; i < TRAINING_TYPE_COUNT_KEYS.length; i++){
      counts[TRAINING_TYPE_COUNT_KEYS[i]] = 0;
    }
    return counts;
  }

  function normalizeTrainingTypeCounts(input, fallback){
    const base = isRecord(fallback) ? fallback : createDefaultTrainingTypeCounts();
    const src = isRecord(input) ? input : {};
    const normalized = createDefaultTrainingTypeCounts();
    for(let i = 0; i < TRAINING_TYPE_COUNT_KEYS.length; i++){
      const key = TRAINING_TYPE_COUNT_KEYS[i];
      normalized[key] = Math.max(0, Math.floor(toNumber(src[key], base[key])));
    }
    return normalized;
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
      battleLosses: 0,
      battleRetreats: 0,
      signalUseBoost: 0,
      signalUseStabilize: 0,
      signalUseCalibrate: 0,
      signalUseOverclock: 0,
      breakInflictedCount: 0,
      breakSufferedCount: 0,
      rangeStayShort: 0,
      rangeStayMid: 0,
      rangeStayLong: 0,
      trainingCount: 0,
      trainingTypeCounts: createDefaultTrainingTypeCounts(),
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
    const battleLosses = clamp(Math.floor(toNumber(src.battleLosses, base.battleLosses)), 0, battleCount);
    const battleRetreats = clamp(Math.floor(toNumber(src.battleRetreats, base.battleRetreats)), 0, battleCount);
    const signalUseBoost = Math.max(0, Math.floor(toNumber(src.signalUseBoost, base.signalUseBoost)));
    const signalUseStabilize = Math.max(0, Math.floor(toNumber(src.signalUseStabilize, base.signalUseStabilize)));
    const signalUseCalibrate = Math.max(0, Math.floor(toNumber(src.signalUseCalibrate, base.signalUseCalibrate)));
    const signalUseOverclock = Math.max(0, Math.floor(toNumber(src.signalUseOverclock, base.signalUseOverclock)));
    const breakInflictedCount = Math.max(0, Math.floor(toNumber(src.breakInflictedCount, base.breakInflictedCount)));
    const breakSufferedCount = Math.max(0, Math.floor(toNumber(src.breakSufferedCount, base.breakSufferedCount)));
    const rangeStayShort = Math.max(0, Math.floor(toNumber(src.rangeStayShort, base.rangeStayShort)));
    const rangeStayMid = Math.max(0, Math.floor(toNumber(src.rangeStayMid, base.rangeStayMid)));
    const rangeStayLong = Math.max(0, Math.floor(toNumber(src.rangeStayLong, base.rangeStayLong)));
    const trainingCount = Math.max(0, Math.floor(toNumber(src.trainingCount, base.trainingCount)));
    const trainingTypeCounts = normalizeTrainingTypeCounts(src.trainingTypeCounts, base.trainingTypeCounts);
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
      battleLosses,
      battleRetreats,
      signalUseBoost,
      signalUseStabilize,
      signalUseCalibrate,
      signalUseOverclock,
      breakInflictedCount,
      breakSufferedCount,
      rangeStayShort,
      rangeStayMid,
      rangeStayLong,
      trainingCount,
      trainingTypeCounts,
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
    if(uiClock) uiClock.textContent = "--:--";
    if(uiDay) uiDay.textContent = "DAY --";

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
  hideBttlBottomPaneOverlay();

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

  function drawTextJa(x, y, text, opts = {}){
    const sizePx = clamp(Math.floor(toNumber(opts.size, 11)), 8, 24);
    const align = String(opts.align || "left").toLowerCase();
    const color = String(opts.color || "rgba(14,20,15,0.90)");
    ctx.save();
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.textAlign = (align === "center" || align === "right") ? align : "left";
    ctx.font = `${sizePx}px "PixelMplus12", ui-monospace, monospace`;
    ctx.fillText(String(text ?? ""), Math.round(x), Math.round(y));
    ctx.restore();
  }

  function measureTextJa(text, size = 11){
    const sizePx = clamp(Math.floor(toNumber(size, 11)), 8, 24);
    ctx.save();
    ctx.font = `${sizePx}px "PixelMplus12", ui-monospace, monospace`;
    const width = Number(ctx.measureText(String(text ?? "")).width) || 0;
    ctx.restore();
    return width;
  }

  function fitJaText(text, maxWidth, size = 11){
    const source = String(text ?? "");
    const limit = Math.max(0, Math.floor(toNumber(maxWidth, 0)));
    if(source.length <= 0 || limit <= 0) return "";
    if(measureTextJa(source, size) <= limit) return source;
    const ellipsis = "...";
    const ellipsisW = measureTextJa(ellipsis, size);
    if(ellipsisW >= limit){
      return ".";
    }
    let out = source;
    while(out.length > 0){
      out = out.slice(0, -1);
      if(measureTextJa(out, size) + ellipsisW <= limit){
        return `${out}${ellipsis}`;
      }
    }
    return ellipsis;
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
        id: "hp",
        label: "HP",
        value: formatMetricPair(state.monster?.runtimeState?.hp, state.monster?.stats?.maxHp),
        ratio: calcMetricRatio(state.monster?.runtimeState?.hp, state.monster?.stats?.maxHp),
      },
      {
        id: "stamina",
        label: "スタミナ",
        value: formatMetricPair(state.monster?.runtimeState?.stamina, state.monster?.stats?.staminaMax),
        ratio: calcMetricRatio(state.monster?.runtimeState?.stamina, state.monster?.stats?.staminaMax),
      },
      {
        id: "hunger",
        label: "充足値",
        value: formatMetricPair(state.stats?.hunger, state.stats?.hungerMax),
        ratio: calcMetricRatio(state.stats?.hunger, state.stats?.hungerMax),
      },
      {
        id: "damage",
        label: "損傷",
        value: formatMetricPair(state.stats?.damage, state.stats?.damageMax),
        ratio: calcMetricRatio(state.stats?.damage, state.stats?.damageMax),
      },
      {
        id: "stability",
        label: "安定度",
        value: formatMetricPair(state.stats?.stability, state.stats?.stabilityMax),
        ratio: calcMetricRatio(state.stats?.stability, state.stats?.stabilityMax),
      },
    ];
  }

  function resolveChronotypeText(chronotype){
    const key = normalizeChronotype(chronotype, "morning");
    if(key === "day") return "昼型";
    if(key === "night") return "夜型";
    return "朝型";
  }

  function normalizeTraitPercent(rawValue){
    const value = toNumber(rawValue, NaN);
    if(!Number.isFinite(value)) return 0;
    const normalized = (value >= 0 && value <= 1) ? (value * 100) : value;
    return clamp(Math.round(normalized), 0, 100);
  }

  function resolveGrowthTrendSummary(winRate, battleCount, stabilityRatio){
    if(battleCount <= 0) return "観測不足";
    if(winRate >= 70 && stabilityRatio >= 0.6) return "攻勢成長";
    if(winRate >= 70) return "突破寄り";
    if(stabilityRatio >= 0.7) return "安定成長";
    if(winRate <= 35) return "再調整段階";
    return "均衡成長";
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

  function getStatusPage2Items(){
    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    const personality = isRecord(state.monster?.personality) ? state.monster.personality : {};
    const adIntegrity = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const signalQuality = Math.min(clamp(toNumber(detail.signalQuality, 100), 0, 100), adIntegrity);
    const trendArrow = (detail.signalTrend === "↑" || detail.signalTrend === "↓" || detail.signalTrend === "→")
      ? detail.signalTrend
      : "→";
    const aggression = normalizeTraitPercent(personality.aggression);
    const curiosity = normalizeTraitPercent(personality.curiosity);
    const calmness = normalizeTraitPercent(personality.calmness);
    const syncRate = resolveSyncRate(adIntegrity, signalQuality);
    return [
      {
        id: "aggression",
        label: "攻勢傾向",
        value: `${aggression}%`,
        ratio: aggression / 100,
        view: "bar",
      },
      {
        id: "curiosity",
        label: "探索傾向",
        value: `${curiosity}%`,
        ratio: curiosity / 100,
        view: "bar",
      },
      {
        id: "calmness",
        label: "平静傾向",
        value: `${calmness}%`,
        ratio: calmness / 100,
        view: "bar",
      },
      {
        id: "adIntegrity",
        label: "媒体健全度",
        value: `${Math.round(adIntegrity)}%`,
        ratio: adIntegrity / 100,
        view: "bar",
      },
      {
        id: "syncRate",
        label: "同調率",
        value: `${syncRate}%`,
        ratio: syncRate / 100,
        view: "bar",
      },
      {
        id: "signalTrend",
        label: "信号傾向",
        value: `${resolveSignalTierText(signalQuality)} ${trendArrow}`,
        view: "list",
      },
      {
        id: "condition",
        label: "状態評価",
        value: resolveConditionSummary(adIntegrity, signalQuality),
        view: "list",
      },
      {
        id: "chronotype",
        label: "活動帯",
        value: resolveChronotypeText(detail.chronotype),
        view: "list",
      },
    ];
  }

  function getStatusPage3Items(){
    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    const adIntegrity = clamp(toNumber(detail.adIntegrity, 100), 0, 100);
    const signalQuality = Math.min(clamp(toNumber(detail.signalQuality, 100), 0, 100), adIntegrity);
    const battleCount = Math.max(0, Math.floor(toNumber(detail.battleCount, 0)));
    const winRate = resolveWinRatePercent();
    const stabilityMax = toPositiveInt(state.stats?.stabilityMax, 10);
    const stability = clamp(toNumber(state.stats?.stability, stabilityMax), 0, stabilityMax);
    const stabilityRatio = stabilityMax > 0 ? stability / stabilityMax : 0;
    const growthTrend = resolveGrowthTrendSummary(winRate, battleCount, stabilityRatio);
    const mutationSummary = resolveMutationSummary();
    const lastDelta = (typeof state.lastDeltaLine === "string" && state.lastDeltaLine.trim().length > 0)
      ? state.lastDeltaLine
      : LAST_DELTA_NONE_TEXT;
    const observationNote = `${resolveConditionSummary(adIntegrity, signalQuality)} / ${resolveTemperamentText()}`;

    return [
      {
        id: "growthTrend",
        label: "成長傾向",
        value: growthTrend,
      },
      {
        id: "mutation",
        label: "進化予兆",
        value: mutationSummary,
      },
      {
        id: "syncRate",
        label: "同調率",
        value: `${resolveSyncRate(adIntegrity, signalQuality)}%`,
      },
      {
        id: "battleHistory",
        label: "戦績",
        value: `${battleCount}戦 ${winRate}%`,
      },
      {
        id: "lastDelta",
        label: "直近変化",
        value: lastDelta,
      },
      {
        id: "note",
        label: "観測メモ",
        value: observationNote,
      },
    ];
  }

  function getStatItemsForPage(page){
    const nextPage = normalizeStatPage(page);
    if(nextPage === 0) return getStatusRows();
    if(nextPage === 1) return getStatusPage2Items();
    return getStatusPage3Items();
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

  function normalizeBttlRangeStateId(rangeState){
    const id = String(rangeState || "").trim().toLowerCase();
    if(id === "short" || id === "mid" || id === "long"){
      return id;
    }
    return "mid";
  }

  function drawBttlProjectileCells(cx, cy, unit, cells, facing = "right"){
    const safeUnit = Math.max(1, Math.floor(toNumber(unit, 1)));
    const mirror = facing === "left" ? -1 : 1;
    for(let i = 0; i < cells.length; i++){
      const cell = Array.isArray(cells[i]) ? cells[i] : [];
      const ox = toNumber(cell[0], 0) * mirror;
      const oy = toNumber(cell[1], 0);
      const px = Math.round(cx + (ox * safeUnit) - (safeUnit / 2));
      const py = Math.round(cy + (oy * safeUnit) - (safeUnit / 2));
      ctx.fillRect(px, py, safeUnit, safeUnit);
    }
  }

  function drawBttlProjectileShape(x, y, owner, size, isHeavy = false, rangeState = "mid"){
    const mask = getBttlProjectileMask();
    const drawSize = getBttlProjectileDrawSize(size);
    const dot = Math.max(1, Math.round(drawSize / mask.grid));
    const left = Math.round(x - (drawSize / 2));
    const top = Math.round(y - (drawSize / 2));
    const isEnemy = owner === "enemy";
    const rangeId = normalizeBttlRangeStateId(rangeState);
    const facing = isEnemy ? "left" : "right";
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if(rangeId === "short"){
      const unit = Math.max(2, Math.floor(drawSize / 8));
      ctx.fillStyle = isHeavy ? "rgba(14,20,15,0.98)" : "rgba(14,20,15,0.88)";
      drawBttlProjectileCells(
        x,
        y,
        unit,
        [
          [3, -5], [4, -5], [5, -5],
          [2, -4], [3, -4], [4, -4],
          [1, -3], [2, -3], [3, -3],
          [0, -2], [1, -2], [2, -2],
          [-1, -1], [0, -1], [1, -1],
          [-2, 0], [-1, 0], [0, 0],
          [-1, 1], [0, 1], [1, 1],
          [0, 2], [1, 2], [2, 2],
          [1, 3], [2, 3], [3, 3],
          [2, 4], [3, 4], [4, 4],
          [3, 5], [4, 5], [5, 5],
        ],
        facing
      );
      ctx.fillStyle = "rgba(14,20,15,0.32)";
      drawBttlProjectileCells(
        x,
        y,
        Math.max(1, unit),
        [
          [4, -2], [5, -2],
          [4, -1], [5, -1],
          [4, 0], [5, 0],
          [4, 1], [5, 1],
          [4, 2], [5, 2],
        ],
        facing
      );
    }else if(rangeId === "mid"){
      const unit = Math.max(2, Math.floor(drawSize / 8));
      ctx.fillStyle = isHeavy ? "rgba(14,20,15,0.98)" : "rgba(14,20,15,0.84)";
      drawBttlProjectileCells(
        x,
        y,
        unit,
        [
          [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0],
          [0, -1], [1, -1], [2, -1], [3, -1],
          [0, 1], [1, 1], [2, 1], [3, 1],
          [2, -2], [3, -2],
          [2, 2], [3, 2],
        ],
        facing
      );
    }else{
      ctx.fillStyle = isHeavy ? "rgba(14,20,15,0.98)" : BTTL_PROJECTILE_COLOR;
      for(let gy = 0; gy < mask.grid; gy++){
        for(let gx = 0; gx < mask.grid; gx++){
          const srcX = isEnemy ? (mask.grid - 1 - gx) : gx;
          if(!mask.fill[gy][srcX]){
            continue;
          }
          if(isEnemy && !mask.edge[gy][srcX] && !isHeavy){
            // Enemy projectile is transparent inside, only outline pixels remain.
            continue;
          }
          ctx.fillRect(left + (gx * dot), top + (gy * dot), dot, dot);
        }
      }
    }
    if(isHeavy){
      ctx.strokeStyle = "rgba(14,20,15,0.60)";
      ctx.lineWidth = 1;
      ctx.strokeRect(left + 0.5, top + 0.5, Math.max(2, drawSize - 1), Math.max(2, drawSize - 1));
    }
    ctx.restore();
  }

  function drawBttlShortRangeImpactFx(x, y, spritePx, nowMs = performance.now(), untilMs = 0){
    const remain = Math.max(0, toNumber(untilMs, 0) - toNumber(nowMs, performance.now()));
    if(remain <= 0) return;
    const ratio = clamp(remain / BTTL_RANGE_SHORT_HIT_FX_MS, 0, 1);
    const cx = Math.round(x + (spritePx * 0.5));
    const cy = Math.round(y + (spritePx * 0.5));
    const arm = Math.max(4, Math.floor(spritePx * 0.30));
    ctx.save();
    ctx.strokeStyle = `rgba(14,20,15,${(0.34 + (0.36 * ratio)).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - arm, cy - arm);
    ctx.lineTo(cx + arm, cy + arm);
    ctx.moveTo(cx - arm, cy + arm);
    ctx.lineTo(cx + arm, cy - arm);
    ctx.stroke();
    ctx.restore();
  }

  function queueBttlShortGateSlashFx(ctxBattle, targetKey, owner, isHeavy, field, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    const gate = getBttlHitGatePoint(field, targetKey);
    const startedAtMs = toNumber(nowMs, performance.now());
    const durationMs = isHeavy ? BTTL_SHORT_GATE_SLASH_HEAVY_MS : BTTL_SHORT_GATE_SLASH_MS;
    const list = Array.isArray(ctxBattle.shortGateSlashFx) ? ctxBattle.shortGateSlashFx.slice() : [];
    list.push({
      x: gate.x,
      y: gate.y,
      owner: owner === "enemy" ? "enemy" : "ally",
      target: targetKey === "ally" ? "ally" : "enemy",
      isHeavy: Boolean(isHeavy),
      startedAtMs,
      untilMs: startedAtMs + Math.max(50, Math.floor(toNumber(durationMs, 120))),
    });
    while(list.length > 10){
      list.shift();
    }
    ctxBattle.shortGateSlashFx = list;
  }

  function drawBttlShortGateSlashFx(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    const buildArcCells = (anchorX, radius, startA, endA, thickness = 1, skew = 0) => {
      const cells = [];
      const seen = new Set();
      const step = Math.max(0.03, Math.min(0.08, 1 / Math.max(8, radius * 2.4)));
      const thick = Math.max(1, Math.floor(toNumber(thickness, 1)));
      for(let a = startA; a <= endA + 0.0001; a += step){
        const bx = Math.round(anchorX + (Math.cos(a) * radius));
        const by = Math.round(Math.sin(a) * radius);
        const skewOffset = Math.round(by * toNumber(skew, 0));
        for(let t = 0; t < thick; t++){
          const cx = bx + skewOffset - t; // keep "(" body thick to the left side
          const key = `${cx}:${by}`;
          if(seen.has(key)) continue;
          seen.add(key);
          cells.push([cx, by]);
        }
      }
      return cells;
    };
    const now = toNumber(nowMs, performance.now());
    const list = Array.isArray(ctxBattle.shortGateSlashFx) ? ctxBattle.shortGateSlashFx : [];
    if(list.length <= 0) return;
    const active = [];
    for(const fx of list){
      const untilMs = toNumber(fx?.untilMs, 0);
      const startedAtMs = toNumber(fx?.startedAtMs, 0);
      if(untilMs <= now || untilMs <= startedAtMs){
        continue;
      }
      const ratio = clamp((untilMs - now) / Math.max(1, untilMs - startedAtMs), 0, 1);
      const alphaBase = Boolean(fx?.isHeavy) ? 0.88 : 0.74;
      const alpha = alphaBase * (0.38 + (0.62 * ratio));
      const mainR = Math.round((Boolean(fx?.isHeavy) ? 8.2 : 7.0) + (1.2 * ratio));
      const subR = Math.max(4, Math.round(mainR * 0.78));
      const echoR = Math.max(3, Math.round(mainR * 0.62));
      const dir = (fx?.target === "enemy") ? -1 : 1;
      const cx = Math.round(toNumber(fx?.x, 0));
      const cy = Math.round(toNumber(fx?.y, 0));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.imageSmoothingEnabled = false;
      if(dir < 0){
        ctx.scale(-1, 1);
      }
      // 16x16-like pixel slash: layered "(" arcs drawn with dot cells.
      const unit = Math.max(1, Math.floor(((Boolean(fx?.isHeavy) ? 34 : 30) + (4 * ratio)) / 16));
      const anchorX = Math.round((Boolean(fx?.isHeavy) ? 9 : 8) + (1.5 * ratio));
      const startA = Math.PI * 0.62;
      const endA = Math.PI * 1.38;
      const baseSkew = Boolean(fx?.isHeavy) ? 0.52 : 0.44;
      const drawLayer = (offsetX, radius, alphaMul, thickness, skewMul = 1) => {
        const a = clamp(alpha * alphaMul, 0.06, 1);
        const cells = buildArcCells(
          anchorX + offsetX,
          Math.max(3, radius),
          startA,
          endA,
          thickness,
          baseSkew * skewMul
        );
        ctx.fillStyle = `rgba(14,20,15,${a.toFixed(3)})`;
        drawBttlProjectileCells(0, 0, unit, cells, "right");
      };
      // back -> core -> front
      drawLayer(-4, Math.round(mainR * 1.10), 0.36, 1, 0.90);
      drawLayer(-2, Math.round(subR * 1.02), 0.58, 1, 1.00);
      drawLayer(0, mainR, 1.00, Boolean(fx?.isHeavy) ? 3 : 2, 1.08);
      drawLayer(2, Math.round(echoR * 1.04), 0.74, 1, 1.18);
      ctx.restore();
      active.push(fx);
    }
    ctxBattle.shortGateSlashFx = active;
  }

  function startBttlShortLunge(ctxBattle, attacker, nowMs = performance.now()){
    if(!ctxBattle) return;
    const actorKey = attacker === "ally" ? "ally" : "enemy";
    const actor = ctxBattle[actorKey];
    if(!actor) return;
    const now = toNumber(nowMs, performance.now());
    const duration = Math.max(60, Math.floor(toNumber(BTTL_SHORT_LUNGE_MS, 180)));
    actor.lungeStartedAtMs = now;
    actor.lungeUntilMs = now + duration;
    actor.lungeDir = actorKey === "enemy" ? 1 : -1;
  }

  function getBttlActorLungeOffset(actor, nowMs = performance.now()){
    const lungeUntilMs = toNumber(actor?.lungeUntilMs, 0);
    const lungeStartedAtMs = toNumber(actor?.lungeStartedAtMs, 0);
    if(lungeUntilMs <= 0 || lungeUntilMs <= lungeStartedAtMs) return 0;
    const now = toNumber(nowMs, performance.now());
    if(now >= lungeUntilMs || now < lungeStartedAtMs) return 0;
    const progress = clamp((now - lungeStartedAtMs) / Math.max(1, lungeUntilMs - lungeStartedAtMs), 0, 1);
    const wave = Math.sin(progress * Math.PI); // quick in/out pulse
    const dir = toNumber(actor?.lungeDir, 0);
    const px = Math.max(0, toNumber(BTTL_SHORT_LUNGE_PX, 7));
    return dir * px * wave;
  }

  function drawBttlShortLungeDust(x, y, spritePx, actor, nowMs = performance.now()){
    const lungeUntilMs = toNumber(actor?.lungeUntilMs, 0);
    const lungeStartedAtMs = toNumber(actor?.lungeStartedAtMs, 0);
    if(lungeUntilMs <= lungeStartedAtMs) return;
    const now = toNumber(nowMs, performance.now());
    if(now < lungeStartedAtMs || now >= lungeUntilMs) return;
    const progress = clamp((now - lungeStartedAtMs) / Math.max(1, lungeUntilMs - lungeStartedAtMs), 0, 1);
    const alpha = 0.24 * (1 - progress);
    if(alpha <= 0.01) return;
    const dir = toNumber(actor?.lungeDir, 0);
    const cx = Math.round(toNumber(x, 0) + (toNumber(spritePx, 0) * 0.5));
    const baseY = Math.round(toNumber(y, 0) + toNumber(spritePx, 0) - 2);
    const behindX = Math.round(cx - (dir * Math.max(2, Math.floor(toNumber(spritePx, 0) * 0.20))));
    ctx.save();
    ctx.fillStyle = `rgba(14,20,15,${alpha.toFixed(3)})`;
    ctx.fillRect(behindX, baseY, 1, 1);
    ctx.fillRect(behindX - (dir * 2), baseY - 1, 1, 1);
    ctx.fillRect(behindX - (dir * 4), baseY, 1, 1);
    ctx.restore();
  }

  function applyBttlShortRangeRecoil(ctxBattle, nowMs = performance.now(), attackOwner = ""){
    if(!ctxBattle) return;
    const delta = clamp(toNumber(BTTL_SHORT_RECOIL_POS_DELTA, 0.08), 0.02, 0.40);
    const prevEnemy = toNumber(ctxBattle.enemyRangePos, BTTL_RANGE_INIT_ENEMY_POS);
    const prevAlly = toNumber(ctxBattle.allyRangePos, BTTL_RANGE_INIT_ALLY_POS);
    const prevMid = (prevEnemy + prevAlly) * 0.5;
    const prevGap = Math.abs(prevAlly - prevEnemy);
    let targetGap = clamp(
      Math.max(
        prevGap + (delta * 2.4),
        toNumber(BTTL_RANGE_MID_THRESHOLD, 0.50) + clamp(toNumber(BTTL_SHORT_RECOIL_LONG_MARGIN, 0.08), 0.04, 0.20)
      ),
      toNumber(BTTL_RANGE_MIN_GAP, 0.10),
      toNumber(BTTL_RANGE_POS_MAX, 0.94) - toNumber(BTTL_RANGE_POS_MIN, 0.06)
    );
    const overclock = getBttlActiveOverclock(ctxBattle, nowMs);
    const owner = String(attackOwner || "").trim().toLowerCase();
    if(owner === "enemy" && overclock){
      const resist = clamp(toNumber(overclock.knockbackResist, 0), 0, 0.9);
      targetGap = clamp(
        targetGap * (1 - (resist * 0.65)),
        toNumber(BTTL_RANGE_MIN_GAP, 0.10),
        toNumber(BTTL_RANGE_POS_MAX, 0.94) - toNumber(BTTL_RANGE_POS_MIN, 0.06)
      );
    }
    const moved = normalizeBttlRangePositions(
      prevMid - (targetGap * 0.5),
      prevMid + (targetGap * 0.5)
    );
    ctxBattle.enemyRangePos = moved.enemyPos;
    ctxBattle.allyRangePos = moved.allyPos;
    // Snap visual positions close to the resolved recoil destination for an instant blowback feel.
    const visualEnemy = toNumber(ctxBattle.enemyRangeVisualPos, moved.enemyPos);
    const visualAlly = toNumber(ctxBattle.allyRangeVisualPos, moved.allyPos);
    ctxBattle.enemyRangeVisualPos = visualEnemy + ((moved.enemyPos - visualEnemy) * 0.90);
    ctxBattle.allyRangeVisualPos = visualAlly + ((moved.allyPos - visualAlly) * 0.90);
    ctxBattle.rangeDistance = Math.abs(moved.allyPos - moved.enemyPos);
    ctxBattle.rangeMidpoint = (moved.enemyPos + moved.allyPos) * 0.5;
    ctxBattle.rangeState = getBttlRangeStateWithHysteresis(ctxBattle.rangeDistance, ctxBattle.rangeState);

    const now = toNumber(nowMs, performance.now());
    const recoilUntil = now + Math.max(60, Math.floor(toNumber(BTTL_SHORT_RECOIL_KNOCK_MS, 120)));
    if(isRecord(ctxBattle.enemy)){
      ctxBattle.enemy.knockUntilMs = recoilUntil;
      ctxBattle.enemy.knockDir = -1;
    }
    if(isRecord(ctxBattle.ally)){
      ctxBattle.ally.knockUntilMs = recoilUntil;
      ctxBattle.ally.knockDir = 1;
    }
    ctxBattle.rangeMarkerShakeStartedAtMs = now;
    ctxBattle.rangeMarkerShakeUntilMs = now + Math.max(90, Math.floor(toNumber(BTTL_RANGE_MARKER_SHAKE_MS, 420)));
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
    const startIntroActive = isTrnStartIntroActive(session, nowMs);
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
    if(startIntroActive){
      hudHint.textContent = "START";
    }else{
      hudHint.textContent = session ? "A:STOP  B:BACK" : "A:RETRY  B:BACK";
    }

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

      const playStartedAtMs = getTrnPlayStartedAtMs(session, nowMs);
      const elapsedMs = Math.max(0, nowMs - playStartedAtMs);
      const remainMs = Math.max(0, TRN_MAX_MS - elapsedMs);
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
    if(startIntroActive){
      drawTrnStartIntroOverlay(frame, left, session, nowMs);
    }
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

  function normalizeBttlStartIntroType(value){
    const id = String(value || "").trim().toLowerCase();
    if(id === BTTL_START_INTRO_TYPE.WARNING){
      return BTTL_START_INTRO_TYPE.WARNING;
    }
    return BTTL_START_INTRO_TYPE.ENCOUNT;
  }

  function getBttlStartIntroDurationMs(type){
    const introType = normalizeBttlStartIntroType(type);
    return introType === BTTL_START_INTRO_TYPE.WARNING
      ? BTTL_START_INTRO_WARNING_MS
      : BTTL_START_INTRO_ENCOUNT_MS;
  }

  function resolveBttlStartIntroType(options, enemyHp){
    const debugForced = normalizeBttlStartIntroType(BTTL_START_INTRO_DEBUG_FORCE_TYPE);
    if(String(BTTL_START_INTRO_DEBUG_FORCE_TYPE || "").trim().length > 0){
      return debugForced;
    }
    const requested = normalizeBttlStartIntroType(options?.introType || "");
    if(options && options.introType){
      return requested;
    }
    const hp = Math.max(0, Math.floor(toNumber(enemyHp, 0)));
    if(
      hp >= Math.max(1, Math.floor(toNumber(BTTL_START_INTRO_WARNING_HP_THRESHOLD, 45))) &&
      Math.random() < clamp(toNumber(BTTL_START_INTRO_WARNING_CHANCE, 0.35), 0, 1)
    ){
      return BTTL_START_INTRO_TYPE.WARNING;
    }
    return BTTL_START_INTRO_TYPE.ENCOUNT;
  }

  function isBttlStartIntroActive(ctxBattle, nowMs = performance.now()){
    if(!isRecord(ctxBattle)) return false;
    if(String(ctxBattle.phase || "") !== BTTL_STATE.INIT) return false;
    if(!Boolean(ctxBattle.startIntroActive)) return false;
    const now = toNumber(nowMs, performance.now());
    return now < toNumber(ctxBattle.startIntroUntilMs, 0);
  }

  function normalizeBttlEndOutroType(value){
    const id = String(value || "").trim().toLowerCase();
    if(id === BTTL_END_OUTRO_TYPE.WIN){
      return BTTL_END_OUTRO_TYPE.WIN;
    }
    return BTTL_END_OUTRO_TYPE.LOST;
  }

  function getBttlEndOutroDurationMs(type){
    const normalized = normalizeBttlEndOutroType(type);
    if(normalized === BTTL_END_OUTRO_TYPE.WIN){
      const flashMs = Math.max(20, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FLASH_MS, 80)));
      const gapMs = Math.max(10, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FLASH_GAP_MS, 40)));
      const holdMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_HOLD_MS, 750)));
      const toWhiteMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_TO_WHITE_MS, 320)));
      const fromWhiteMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FROM_WHITE_MS, 360)));
      return (flashMs * 2) + gapMs + holdMs + toWhiteMs + fromWhiteMs;
    }
    const fadeMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_FADE_MS, 260)));
    const holdMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_HOLD_MS, 750)));
    const toBlackMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_TO_BLACK_MS, 320)));
    const fromBlackMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_FROM_BLACK_MS, 360)));
    return fadeMs + holdMs + toBlackMs + fromBlackMs;
  }

  function getBttlEndOutroTiming(type){
    const normalized = normalizeBttlEndOutroType(type);
    if(normalized === BTTL_END_OUTRO_TYPE.WIN){
      const flashMs = Math.max(20, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FLASH_MS, 80)));
      const gapMs = Math.max(10, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FLASH_GAP_MS, 40)));
      const holdMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_HOLD_MS, 750)));
      const fadeInMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_TO_WHITE_MS, 320)));
      const fadeOutMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_WIN_FROM_WHITE_MS, 360)));
      const flash1End = flashMs;
      const flash2Start = flash1End + gapMs;
      const flash2End = flash2Start + flashMs;
      const holdStart = flash2End;
      const holdEnd = holdStart + holdMs;
      const fadeInStart = holdEnd;
      const fadeInEnd = fadeInStart + fadeInMs;
      const handoffAt = fadeInStart + Math.floor(fadeInMs * clamp(toNumber(BTTL_END_OUTRO_HANDOFF_IN_FADE_RATIO, 0.70), 0.30, 0.95));
      return {
        type: normalized,
        flashMs,
        gapMs,
        holdMs,
        fadeInMs,
        fadeOutMs,
        flash1End,
        flash2Start,
        flash2End,
        holdStart,
        holdEnd,
        fadeInStart,
        fadeInEnd,
        handoffAt,
      };
    }
    const preFadeMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_FADE_MS, 260)));
    const holdMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_HOLD_MS, 750)));
    const fadeInMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_TO_BLACK_MS, 320)));
    const fadeOutMs = Math.max(120, Math.floor(toNumber(BTTL_END_OUTRO_LOST_FROM_BLACK_MS, 360)));
    const holdStart = preFadeMs;
    const holdEnd = holdStart + holdMs;
    const fadeInStart = holdEnd;
    const fadeInEnd = fadeInStart + fadeInMs;
    const handoffAt = fadeInStart + Math.floor(fadeInMs * clamp(toNumber(BTTL_END_OUTRO_HANDOFF_IN_FADE_RATIO, 0.70), 0.30, 0.95));
    return {
      type: normalized,
      preFadeMs,
      holdMs,
      fadeInMs,
      fadeOutMs,
      holdStart,
      holdEnd,
      fadeInStart,
      fadeInEnd,
      handoffAt,
    };
  }

  function computeBttlEndOutroHandoffAlpha(type, elapsed, timing){
    const normalized = normalizeBttlEndOutroType(type);
    if(normalized === BTTL_END_OUTRO_TYPE.WIN){
      if(elapsed <= timing.fadeInStart) return 0;
      const p = clamp((elapsed - timing.fadeInStart) / Math.max(1, timing.fadeInMs), 0, 1);
      return p;
    }
    if(elapsed <= timing.preFadeMs){
      const p = clamp(elapsed / Math.max(1, timing.preFadeMs), 0, 1);
      return 0.72 * p;
    }
    if(elapsed <= timing.holdEnd){
      return 0.72;
    }
    const p = clamp((elapsed - timing.fadeInStart) / Math.max(1, timing.fadeInMs), 0, 1);
    return 0.72 + ((0.96 - 0.72) * p);
  }

  function startBttlEndOutro(ctxBattle, type, nowMs = performance.now()){
    if(!isRecord(ctxBattle)) return;
    const now = toNumber(nowMs, performance.now());
    const outroType = normalizeBttlEndOutroType(type);
    const durationMs = getBttlEndOutroDurationMs(outroType);
    ctxBattle.projectiles = [];
    ctxBattle.shortGateSlashFx = [];
    ctxBattle.signalSession = null;
    ctxBattle.signalResult = null;
    ctxBattle.lastSignalProc = null;
    clearBttlSignalBuffState(ctxBattle);
    clearBttlSignalSuccessFx(ctxBattle);
    ctxBattle.signalFxBadShakeUntilMs = 0;
    ctxBattle.signalFxBadShakeDir = 0;
    ctxBattle.heavyInboundStartedAtMs = 0;
    ctxBattle.heavyInboundUntilMs = 0;
    ctxBattle.heavyImpactAtMs = 0;
    ctxBattle.heavyIncomingActionHint = "";
    ctxBattle.heavyReactSession = null;
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
    ctxBattle.endOutroType = outroType;
    ctxBattle.endOutroActive = true;
    ctxBattle.endOutroStartedAtMs = now;
    ctxBattle.endOutroDurationMs = durationMs;
    ctxBattle.endOutroUntilMs = now + durationMs;
    ctxBattle.endOutroHandoffDone = false;
    uiState.bttlResultReveal = null;
    ctxBattle.phase = BTTL_STATE.OUTRO;
    ctxBattle.phaseStartedAtMs = now;
  }

  function isBttlEndOutroActive(ctxBattle, nowMs = performance.now()){
    if(!isRecord(ctxBattle)) return false;
    if(String(ctxBattle.phase || "") !== BTTL_STATE.OUTRO) return false;
    if(!Boolean(ctxBattle.endOutroActive)) return false;
    const now = toNumber(nowMs, performance.now());
    return now < toNumber(ctxBattle.endOutroUntilMs, 0);
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

  function getBttlPaneLayout(){
    const layout = getTrnLayout();
    const frame = layout.frame;
    const contentPadX = 8;
    const contentPadY = 8;
    const contentX = frame.x + contentPadX;
    const contentY = frame.y + contentPadY;
    const contentW = Math.max(24, frame.w - (contentPadX * 2));
    const contentH = Math.max(24, frame.h - (contentPadY * 2));
    const splitGap = BTTL_PANE_GAP;
    const bottomH = clamp(
      Math.floor(contentH * BTTL_BOTTOM_PANE_RATIO),
      56,
      Math.max(56, contentH - 80)
    );
    const topH = Math.max(72, contentH - bottomH - splitGap);
    const topY = contentY;
    const bottomY = topY + topH + splitGap;
    const leftW = Math.max(
      140,
      Math.floor((contentW - splitGap) * clamp(BTTL_MAIN_PANE_RATIO, 0.55, 0.82))
    );
    const rightW = Math.max(64, contentW - splitGap - leftW);
    const left = {
      x: contentX,
      y: topY,
      w: leftW,
      h: topH,
    };
    const right = {
      x: left.x + left.w + splitGap,
      y: topY,
      w: rightW,
      h: topH,
    };
    const bottom = {
      x: contentX,
      y: bottomY,
      w: contentW,
      h: Math.max(48, (contentY + contentH) - bottomY),
    };
    return { frame, left, right, bottom };
  }

  function getBttlFieldGeometry(){
    const layout = getBttlPaneLayout();
    const { frame, left, right, bottom } = layout;
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
      bottom,
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

  function getBttlRangeBarGeometry(field){
    const x0 = Math.round((field?.innerRect?.x || 0) + BTTL_RANGE_BAR_PAD_X);
    const x1 = Math.round(((field?.innerRect?.x || 0) + (field?.innerRect?.w || 0)) - BTTL_RANGE_BAR_PAD_X);
    const safeX1 = Math.max(x0 + 8, x1);
    const y = Math.round(toNumber(field?.dividerY, 0)) + 0.5;
    return {
      x0,
      x1: safeX1,
      w: Math.max(8, safeX1 - x0),
      y,
      centerX: Math.round((x0 + safeX1) * 0.5) + 0.5,
    };
  }

  function getBttlRangeBarXByPos(rangeGeom, pos){
    if(!rangeGeom) return 0;
    const ratio = clamp(toNumber(pos, 0.5), 0, 1);
    return Math.round(rangeGeom.x0 + (rangeGeom.w * ratio));
  }

  function drawBttlRangeBar(ctxBattle, field, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    ensureBttlRangeState(ctxBattle, nowMs);
    const rangeGeom = getBttlRangeBarGeometry(field);
    const y = rangeGeom.y;
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.34)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rangeGeom.x0 + 0.5, y);
    ctx.lineTo(rangeGeom.x1 - 0.5, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rangeGeom.centerX, y - 4);
    ctx.lineTo(rangeGeom.centerX, y + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rangeGeom.x0 + 0.5, y - 3);
    ctx.lineTo(rangeGeom.x0 + 0.5, y + 3);
    ctx.moveTo(rangeGeom.x1 - 0.5, y - 3);
    ctx.lineTo(rangeGeom.x1 - 0.5, y + 3);
    ctx.stroke();
    ctx.restore();

    let enemyX = getBttlRangeBarXByPos(rangeGeom, ctxBattle.enemyRangeVisualPos);
    let allyX = getBttlRangeBarXByPos(rangeGeom, ctxBattle.allyRangeVisualPos);
    const markerHalf = Math.max(2, Math.floor(toNumber(BTTL_RANGE_BAR_MARKER_HALF, 4)));
    const markerY = Math.round(y);
    let enemyShakeX = 0;
    let enemyShakeY = 0;
    let allyShakeX = 0;
    let allyShakeY = 0;
    const shakeStartedAtMs = toNumber(ctxBattle.rangeMarkerShakeStartedAtMs, 0);
    const shakeUntilMs = toNumber(ctxBattle.rangeMarkerShakeUntilMs, 0);
    const now = toNumber(nowMs, performance.now());
    if(shakeUntilMs > shakeStartedAtMs && now < shakeUntilMs){
      const total = Math.max(1, shakeUntilMs - shakeStartedAtMs);
      const p = clamp((now - shakeStartedAtMs) / total, 0, 1);
      const decay = 1 - p;
      const amp = Math.max(0, toNumber(BTTL_RANGE_MARKER_SHAKE_PX, 3)) * decay;
      const hz = Math.max(1, toNumber(BTTL_RANGE_MARKER_SHAKE_HZ, 18));
      const t = (now - shakeStartedAtMs) / 1000;
      const sx = Math.sin(t * Math.PI * 2 * hz);
      const sy = Math.cos(t * Math.PI * 2 * (hz * 0.5));
      enemyShakeX = Math.round(sx * amp);
      enemyShakeY = Math.round(sy * amp * 0.35);
      allyShakeX = -enemyShakeX;
      allyShakeY = -enemyShakeY;
    }
    enemyX += enemyShakeX;
    allyX += allyShakeX;
    const enemyY = markerY + enemyShakeY;
    const allyY = markerY + allyShakeY;

    // Enemy marker: diamond (outline + light fill)
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.22)";
    ctx.strokeStyle = "rgba(14,20,15,0.78)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(enemyX, enemyY - markerHalf);
    ctx.lineTo(enemyX + markerHalf, enemyY);
    ctx.lineTo(enemyX, enemyY + markerHalf);
    ctx.lineTo(enemyX - markerHalf, enemyY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Ally marker: square (filled)
    const square = markerHalf * 2 - 1;
    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.82)";
    ctx.fillRect(
      Math.round(allyX - (square / 2)),
      Math.round(allyY - (square / 2)),
      square,
      square
    );
    ctx.strokeStyle = "rgba(14,20,15,0.42)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.round(allyX - (square / 2)) + 0.5,
      Math.round(allyY - (square / 2)) + 0.5,
      Math.max(1, square - 1),
      Math.max(1, square - 1)
    );
    ctx.restore();
  }

  function drawBttlHitGateAt(x, y){
    const cx = Math.round(toNumber(x, 0));
    const cy = Math.round(toNumber(y, 0));
    const spacing = Math.max(2, Math.floor(toNumber(BTTL_HIT_GATE_BAR_SPACING, 3)));
    const halfH = Math.max(4, Math.floor(toNumber(BTTL_HIT_GATE_BAR_HALF_H, 9)));
    const bars = [-1, 0, 1];
    ctx.save();
    for(const idx of bars){
      const bx = cx + (idx * spacing);
      const localHalf = idx === 0 ? halfH : Math.max(3, halfH - 2);
      ctx.fillStyle = idx === 0
        ? "rgba(14,20,15,0.30)"
        : "rgba(14,20,15,0.22)";
      ctx.fillRect(bx, cy - localHalf, 1, localHalf * 2);
    }
    ctx.restore();
  }

  function getBttlHitGatePoint(field, targetKey){
    if(!field){
      return { x: 0, y: 0 };
    }
    const target = targetKey === "ally" ? "ally" : "enemy";
    if(target === "enemy"){
      return {
        x: Math.round(toNumber(field.topBattleX1, 0) - 1),
        y: Math.round(toNumber(field.topLaneCenterY, 0)),
      };
    }
    return {
      x: Math.round(toNumber(field.bottomBattleX0, 0) + 1),
      y: Math.round(toNumber(field.bottomLaneCenterY, 0)),
    };
  }

  function drawBttlHitGates(field){
    if(!field) return;
    const enemyGate = getBttlHitGatePoint(field, "enemy");
    const allyGate = getBttlHitGatePoint(field, "ally");
    drawBttlHitGateAt(enemyGate.x, enemyGate.y);
    drawBttlHitGateAt(allyGate.x, allyGate.y);
  }

  function drawBttlHpPanel(x, y, w, hpNowRaw, hpMaxRaw, opts = {}){
    const hpMax = Math.max(1, Math.floor(toNumber(hpMaxRaw, 1)));
    const hpNow = clamp(Math.floor(toNumber(hpNowRaw, 0)), 0, hpMax);
    const ratio = hpMax > 0 ? clamp(hpNow / hpMax, 0, 1) : 0;
    const valueText = `${hpNow}/${hpMax}`;
    const panelW = Math.max(36, Math.floor(toNumber(w, 0)));
    const showValue = opts.showValue !== false;
    const textScale = clamp(Math.floor(toNumber(opts.textScale, 1)), 1, 2);
    const valueSizePx = Math.floor(toNumber(opts.valueSizePx, 0));
    const useJaValueText = showValue && valueSizePx > 0;
    const textH = showValue
      ? (useJaValueText
      ? clamp(valueSizePx, 8, 24)
      : (BITMAP_GLYPH_H * textScale))
      : 0;
    const textPos = String(opts.textPos || "above").toLowerCase();
    const barX = Math.round(x);
    const isTextBelow = textPos === "below";
    const barY = showValue
      ? (isTextBelow ? Math.round(y) : Math.round(y + textH + 1))
      : Math.round(y);
    const barW = panelW;
    const barH = 4;
    const valueY = isTextBelow ? Math.round(barY + barH + 1) : Math.round(y);
    const fillW = Math.floor((barW - 2) * ratio);

    if(showValue){
      if(useJaValueText){
        drawTextJa(Math.round(x + Math.floor(panelW / 2)), valueY, valueText, {
          size: clamp(valueSizePx, 8, 24),
          align: "center",
          color: "rgba(14,20,15,0.92)",
        });
      }else{
        drawText(Math.round(x + Math.floor(panelW / 2)), valueY, valueText, {
          scale: textScale,
          align: "center",
          color: "rgba(14,20,15,0.92)",
        });
      }
    }

    ctx.save();
    ctx.fillStyle = "rgba(14,20,15,0.18)";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = "rgba(14,20,15,0.62)";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);
    if(fillW > 0){
      ctx.fillStyle = "rgba(14,20,15,0.94)";
      ctx.fillRect(barX + 1, barY + 1, fillW, Math.max(1, barH - 2));
    }
    ctx.restore();
    return {
      barX,
      barY,
      barW,
      barH,
      valueY,
      textScale,
      textH,
    };
  }

  function drawBttlStaGauge(x, y, w, staNowRaw, staMaxRaw, opts = {}){
    const staMax = Math.max(1, Math.floor(toNumber(staMaxRaw, 1)));
    const staNow = clamp(Math.floor(toNumber(staNowRaw, 0)), 0, staMax);
    const ratio = staMax > 0 ? clamp(staNow / staMax, 0, 1) : 0;
    const barX = Math.round(toNumber(x, 0));
    const barY = Math.round(toNumber(y, 0));
    const barW = Math.max(36, Math.floor(toNumber(w, 0)));
    const barH = 3;
    const fillW = Math.floor((barW - 2) * ratio);
    const isLow = ratio <= 0.22;
    const now = toNumber(opts.nowMs, performance.now());
    const blinkOn = isLow && (Math.floor(now / 160) % 2 === 0);

    ctx.save();
    // STA is a tactical resource: slimmer than HP and visually patterned.
    ctx.fillStyle = "rgba(14,20,15,0.10)";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = "rgba(14,20,15,0.56)";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);
    if(fillW > 0){
      ctx.fillStyle = blinkOn ? "rgba(14,20,15,0.80)" : "rgba(14,20,15,0.68)";
      ctx.fillRect(barX + 1, barY + 1, fillW, Math.max(1, barH - 2));
      // Keep a subtle notch pattern so it never reads as HP.
      ctx.fillStyle = "rgba(200,214,194,0.18)";
      for(let sx = barX + 4; sx < (barX + 1 + fillW); sx += 5){
        ctx.fillRect(sx, barY + 1, 1, Math.max(1, barH - 2));
      }
    }
    ctx.restore();
    return {
      barX,
      barY,
      barW,
      barH,
    };
  }

  function ensureBttlBreakActorState(actor){
    if(!isRecord(actor)) return;
    const maxValue = Math.max(1, Math.floor(toNumber(actor.breakMax, BTTL_BREAK_MAX)));
    actor.breakMax = maxValue;
    actor.breakValue = clamp(toNumber(actor.breakValue, 0), 0, maxValue);
    actor.isBreak = Boolean(actor.isBreak);
    actor.breakUntilMs = Math.max(0, toNumber(actor.breakUntilMs, 0));
    actor.breakRecoverResumeAtMs = Math.max(0, toNumber(actor.breakRecoverResumeAtMs, 0));
    actor.breakHighLogged = Boolean(actor.breakHighLogged);
    actor.breakLastPlusLogAtMs = Math.max(0, toNumber(actor.breakLastPlusLogAtMs, 0));
  }

  function ensureBttlActorResourceState(actor){
    if(!isRecord(actor)) return;
    const maxHp = Math.max(1, Math.floor(toNumber(actor.maxHp, 1)));
    actor.maxHp = maxHp;
    actor.hp = clamp(Math.floor(toNumber(actor.hp, maxHp)), 0, maxHp);
    const maxSta = Math.max(1, Math.floor(toNumber(actor.maxSta, maxHp)));
    actor.maxSta = maxSta;
    actor.sta = clamp(toNumber(actor.sta, maxSta), 0, maxSta);
  }

  function getBttlBreakActor(ctxBattle, actorKey){
    if(!ctxBattle) return null;
    const key = actorKey === "enemy" ? "enemy" : "ally";
    const actor = isRecord(ctxBattle[key]) ? ctxBattle[key] : null;
    if(actor){
      ensureBttlBreakActorState(actor);
    }
    return actor;
  }

  function getBttlBreakLogPrefix(actorKey){
    return actorKey === "enemy" ? "EN" : "AL";
  }

  function getBttlBreakRecoveryRangeMult(rangeState){
    const id = normalizeBttlRangeStateId(rangeState);
    return clamp(toNumber(BTTL_BREAK_RECOVERY_MULT_BY_RANGE[id], 1), 0.25, 4);
  }

  function getBttlBreakGainRangeMult(rangeState){
    const id = normalizeBttlRangeStateId(rangeState);
    return clamp(toNumber(BTTL_BREAK_GAIN_MULT_BY_RANGE[id], 1), 0.3, 2.5);
  }

  function getBttlBreakGainByHit(projectile, appliedDamage){
    const damage = Math.max(0, Math.floor(toNumber(appliedDamage, 0)));
    if(damage <= 0){
      return 0;
    }
    const rangeId = normalizeBttlRangeStateId(projectile?.rangeStateAtLaunch);
    let gain = toNumber(BTTL_BREAK_GAIN_HIT_BASE, 4) + (damage * toNumber(BTTL_BREAK_GAIN_HIT_DAMAGE_SCALE, 1.4));
    if(rangeId === "short"){
      gain += toNumber(BTTL_BREAK_GAIN_HIT_SHORT_BONUS, 5);
    }
    if(Boolean(projectile?.isHeavy)){
      gain += toNumber(BTTL_BREAK_GAIN_HIT_HEAVY_BONUS, 10);
    }
    gain *= getBttlBreakGainRangeMult(rangeId);
    return Math.max(0, Math.round(gain));
  }

  function applyBttlBreakDelta(ctxBattle, targetKey, deltaRaw, nowMs = performance.now(), options = {}){
    if(!ctxBattle) return;
    const actor = getBttlBreakActor(ctxBattle, targetKey);
    if(!actor) return;
    const delta = Math.floor(toNumber(deltaRaw, 0));
    if(delta <= 0) return;
    const now = toNumber(nowMs, performance.now());
    const prev = clamp(toNumber(actor.breakValue, 0), 0, actor.breakMax);
    const next = clamp(prev + delta, 0, actor.breakMax);
    actor.breakValue = next;
    actor.breakRecoverResumeAtMs = Math.max(toNumber(actor.breakRecoverResumeAtMs, 0), now + Math.max(200, Math.floor(toNumber(BTTL_BREAK_RECOVER_DELAY_MS, 720) * 0.45)));

    const prefix = getBttlBreakLogPrefix(targetKey);
    const plusInterval = Math.max(120, Math.floor(toNumber(BTTL_BREAK_LOG_PLUS_MIN_INTERVAL_MS, 520)));
    const forcePlusLog = Boolean(options.forcePlusLog);
    if(forcePlusLog || (now - toNumber(actor.breakLastPlusLogAtMs, 0) >= plusInterval)){
      pushBttlLog(ctxBattle, `${prefix} BRK+`);
      actor.breakLastPlusLogAtMs = now;
    }

    const highTh = actor.breakMax * clamp(toNumber(BTTL_BREAK_HIGH_RATIO, 0.74), 0.2, 0.98);
    if(prev < highTh && next >= highTh && !actor.breakHighLogged){
      actor.breakHighLogged = true;
      pushBttlLog(ctxBattle, `${prefix} BRK HIGH`);
    }

    if(!actor.isBreak && next >= actor.breakMax){
      actor.isBreak = true;
      actor.breakUntilMs = now + Math.max(200, Math.floor(toNumber(BTTL_BREAK_STATE_MS, 1250)));
      actor.breakRecoverResumeAtMs = actor.breakUntilMs + Math.max(180, Math.floor(toNumber(BTTL_BREAK_RECOVER_DELAY_MS, 720)));
      actor.breakValue = actor.breakMax;
      actor.breakHighLogged = true;
      pushBttlLog(ctxBattle, `${prefix} BREAK`);
      const resultMetrics = ensureBttlResultMetrics(ctxBattle, now);
      if(targetKey === "enemy"){
        resultMetrics.breakInflictedCount = Math.max(0, Math.floor(toNumber(resultMetrics.breakInflictedCount, 0))) + 1;
      }else{
        resultMetrics.breakSufferedCount = Math.max(0, Math.floor(toNumber(resultMetrics.breakSufferedCount, 0))) + 1;
      }
      if(targetKey === "enemy"){
        ctxBattle.nextEnemyActAtMs = Math.max(
          toNumber(ctxBattle.nextEnemyActAtMs, now),
          now + Math.floor(Math.max(240, toNumber(BTTL_BREAK_STATE_MS, 1250) * 0.75))
        );
      }else{
        ctxBattle.nextAllyActAtMs = Math.max(
          toNumber(ctxBattle.nextAllyActAtMs, now),
          now + Math.floor(Math.max(200, toNumber(BTTL_BREAK_STATE_MS, 1250) * 0.65))
        );
      }
    }
  }

  function updateBttlBreakState(ctxBattle, nowMs = performance.now(), dtMs = 16){
    if(!ctxBattle) return;
    const now = toNumber(nowMs, performance.now());
    const dtSec = Math.max(0, toNumber(dtMs, 0)) / 1000;
    const recPerSec = Math.max(0, toNumber(BTTL_BREAK_RECOVERY_PER_SEC, 8.5));
    const recoverAmount = recPerSec * dtSec * getBttlBreakRecoveryRangeMult(ctxBattle.rangeState);
    for(const key of ["enemy", "ally"]){
      const actor = getBttlBreakActor(ctxBattle, key);
      if(!actor) continue;
      const prefix = getBttlBreakLogPrefix(key);
      if(actor.isBreak && now >= toNumber(actor.breakUntilMs, 0)){
        actor.isBreak = false;
        actor.breakUntilMs = 0;
        actor.breakRecoverResumeAtMs = Math.max(
          toNumber(actor.breakRecoverResumeAtMs, 0),
          now + Math.max(180, Math.floor(toNumber(BTTL_BREAK_RECOVER_DELAY_MS, 720)))
        );
        actor.breakValue = Math.min(actor.breakValue, actor.breakMax * 0.58);
        pushBttlLog(ctxBattle, `${prefix} RECOVER`);
      }
      if(!actor.isBreak && now >= toNumber(actor.breakRecoverResumeAtMs, 0) && recoverAmount > 0 && actor.breakValue > 0){
        actor.breakValue = Math.max(0, actor.breakValue - recoverAmount);
      }
      const highTh = actor.breakMax * clamp(toNumber(BTTL_BREAK_HIGH_RATIO, 0.74), 0.2, 0.98);
      if(actor.breakValue < (highTh * 0.90)){
        actor.breakHighLogged = false;
      }
    }
  }

  function drawBttlBreakGauge(x, y, w, breakNowRaw, breakMaxRaw, opts = {}){
    const breakMax = Math.max(1, Math.floor(toNumber(breakMaxRaw, BTTL_BREAK_MAX)));
    const breakNow = clamp(toNumber(breakNowRaw, 0), 0, breakMax);
    const ratio = breakMax > 0 ? clamp(breakNow / breakMax, 0, 1) : 0;
    const barX = Math.round(toNumber(x, 0));
    const barY = Math.round(toNumber(y, 0));
    const barW = Math.max(28, Math.floor(toNumber(w, 0)));
    const barH = 4;
    const now = toNumber(opts.nowMs, performance.now());
    const isBreak = Boolean(opts.isBreak);
    const highTh = clamp(toNumber(BTTL_BREAK_HIGH_RATIO, 0.74), 0.2, 0.98);
    const highActive = ratio >= highTh;
    const blinkOn = isBreak
      ? (Math.floor(now / 90) % 2 === 0)
      : (highActive && (Math.floor(now / 150) % 2 === 0));
    const innerW = Math.max(1, barW - 2);
    const innerH = Math.max(1, barH - 2);
    const fillW = Math.floor(Math.max(0, innerW * ratio));

    ctx.save();
    // BREAK is "accumulation" gauge: keep background transparent and compact.
    ctx.strokeStyle = "rgba(14,20,15,0.44)";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);
    if(fillW > 0){
      ctx.fillStyle = isBreak
        ? (blinkOn ? "rgba(14,20,15,0.88)" : "rgba(14,20,15,0.70)")
        : (highActive ? "rgba(14,20,15,0.64)" : "rgba(14,20,15,0.48)");
      ctx.fillRect(barX + 1, barY + 1, fillW, innerH);
      // Subtle pulse ticks, but less dense than STA.
      if(isBreak || highActive){
        ctx.fillStyle = "rgba(200,214,194,0.22)";
        for(let sx = barX + 5; sx < (barX + 1 + fillW); sx += 6){
          ctx.fillRect(sx, barY + 1, 1, innerH);
        }
      }
    }
    // 3-step guide markers (1/3 and 2/3) for quick danger reading.
    ctx.fillStyle = "rgba(14,20,15,0.30)";
    const marker1 = Math.round(barX + 1 + (innerW / 3));
    const marker2 = Math.round(barX + 1 + ((innerW * 2) / 3));
    ctx.fillRect(marker1, barY + 1, 1, innerH);
    ctx.fillRect(marker2, barY + 1, 1, innerH);
    ctx.restore();
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

  function getBttlSignalCost(cmd){
    const id = normalizeBttlSignalCommand(cmd);
    return Math.max(0, Math.floor(toNumber(BTTL_SIGNAL_COST_BY_CMD[id], 0)));
  }

  function canConsumeBttlSignalCost(ctxBattle, cmd){
    if(!ctxBattle) return false;
    ensureBttlActorResourceState(ctxBattle.ally);
    const cost = getBttlSignalCost(cmd);
    if(cost <= 0) return true;
    const staNow = Math.max(0, Math.floor(toNumber(ctxBattle.ally?.sta, 0)));
    return staNow >= cost;
  }

  function createBttlResultMetrics(nowMs = performance.now()){
    const now = toNumber(nowMs, performance.now());
    return {
      signalUseBoost: 0,
      signalUseStabilize: 0,
      signalUseCalibrate: 0,
      signalUseOverclock: 0,
      breakInflictedCount: 0,
      breakSufferedCount: 0,
      rangeStayShort: 0,
      rangeStayMid: 0,
      rangeStayLong: 0,
      sampledAtMs: now,
    };
  }

  function ensureBttlResultMetrics(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return createBttlResultMetrics(nowMs);
    if(isRecord(ctxBattle.resultMetrics)){
      const metrics = ctxBattle.resultMetrics;
      metrics.signalUseBoost = Math.max(0, Math.floor(toNumber(metrics.signalUseBoost, 0)));
      metrics.signalUseStabilize = Math.max(0, Math.floor(toNumber(metrics.signalUseStabilize, 0)));
      metrics.signalUseCalibrate = Math.max(0, Math.floor(toNumber(metrics.signalUseCalibrate, 0)));
      metrics.signalUseOverclock = Math.max(0, Math.floor(toNumber(metrics.signalUseOverclock, 0)));
      metrics.breakInflictedCount = Math.max(0, Math.floor(toNumber(metrics.breakInflictedCount, 0)));
      metrics.breakSufferedCount = Math.max(0, Math.floor(toNumber(metrics.breakSufferedCount, 0)));
      metrics.rangeStayShort = Math.max(0, toNumber(metrics.rangeStayShort, 0));
      metrics.rangeStayMid = Math.max(0, toNumber(metrics.rangeStayMid, 0));
      metrics.rangeStayLong = Math.max(0, toNumber(metrics.rangeStayLong, 0));
      metrics.sampledAtMs = Math.max(0, toNumber(metrics.sampledAtMs, nowMs));
      return metrics;
    }
    const created = createBttlResultMetrics(nowMs);
    ctxBattle.resultMetrics = created;
    return created;
  }

  function addBttlSignalUseMetric(ctxBattle, cmd, delta = 1){
    if(!ctxBattle) return;
    const id = normalizeBttlSignalCommand(cmd);
    const key = BTTL_SIGNAL_USE_DETAIL_KEY_BY_CMD[id];
    if(typeof key !== "string" || key.length <= 0) return;
    const metrics = ensureBttlResultMetrics(ctxBattle);
    const amount = Math.max(0, Math.floor(toNumber(delta, 0)));
    if(amount <= 0) return;
    metrics[key] = Math.max(0, Math.floor(toNumber(metrics[key], 0))) + amount;
  }

  function addBttlRangeStayMetric(ctxBattle, rangeState, deltaMs){
    if(!ctxBattle) return;
    const delta = Math.max(0, toNumber(deltaMs, 0));
    if(delta <= 0) return;
    const metrics = ensureBttlResultMetrics(ctxBattle);
    const id = normalizeBttlRangeStateId(rangeState);
    const key = id === "short"
      ? "rangeStayShort"
      : (id === "long" ? "rangeStayLong" : "rangeStayMid");
    metrics[key] = Math.max(0, toNumber(metrics[key], 0)) + delta;
    metrics.sampledAtMs = Math.max(0, toNumber(ctxBattle.rangeLastUpdateAtMs, performance.now()));
  }

  function flushBttlRangeStayMetric(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    const now = toNumber(nowMs, performance.now());
    const last = Math.max(0, toNumber(ctxBattle.rangeLastUpdateAtMs, now));
    const untracked = Math.max(0, now - last);
    if(untracked > 0){
      addBttlRangeStayMetric(ctxBattle, ctxBattle.rangeState, untracked);
      ctxBattle.rangeLastUpdateAtMs = now;
    }
  }

  function addDetailCounter(detail, key, delta){
    if(!isRecord(detail)) return;
    const amount = Math.max(0, Math.floor(toNumber(delta, 0)));
    if(amount <= 0) return;
    detail[key] = Math.max(0, Math.floor(toNumber(detail[key], 0))) + amount;
  }

  function commitBttlResultMetrics(ctxBattle, result, nowMs = performance.now()){
    if(!ctxBattle || Boolean(ctxBattle.resultMetricsCommitted)) return false;
    const resultRaw = String(result || "LOSE").trim().toUpperCase();
    const normalizedResult = resultRaw === "WIN"
      ? "WIN"
      : (resultRaw === "ABORT" ? "ABORT" : "LOSE");
    const detail = isRecord(state.detailed)
      ? state.detailed
      : createDefaultDetailedState(state.monster?.id || "mon001");
    state.detailed = detail;

    flushBttlRangeStayMetric(ctxBattle, nowMs);
    const metrics = ensureBttlResultMetrics(ctxBattle, nowMs);

    const count = Math.max(0, Math.floor(toNumber(detail.battleCount, 0))) + 1;
    detail.battleCount = count;

    if(normalizedResult === "WIN"){
      addDetailCounter(detail, "battleWins", 1);
    }else if(normalizedResult === "ABORT"){
      addDetailCounter(detail, "battleRetreats", 1);
    }else{
      addDetailCounter(detail, "battleLosses", 1);
    }
    detail.battleWins = clamp(Math.floor(toNumber(detail.battleWins, 0)), 0, detail.battleCount);
    detail.battleLosses = clamp(Math.floor(toNumber(detail.battleLosses, 0)), 0, detail.battleCount);
    detail.battleRetreats = clamp(Math.floor(toNumber(detail.battleRetreats, 0)), 0, detail.battleCount);

    addDetailCounter(detail, "signalUseBoost", metrics.signalUseBoost);
    addDetailCounter(detail, "signalUseStabilize", metrics.signalUseStabilize);
    addDetailCounter(detail, "signalUseCalibrate", metrics.signalUseCalibrate);
    addDetailCounter(detail, "signalUseOverclock", metrics.signalUseOverclock);
    addDetailCounter(detail, "breakInflictedCount", metrics.breakInflictedCount);
    addDetailCounter(detail, "breakSufferedCount", metrics.breakSufferedCount);
    addDetailCounter(detail, "rangeStayShort", metrics.rangeStayShort);
    addDetailCounter(detail, "rangeStayMid", metrics.rangeStayMid);
    addDetailCounter(detail, "rangeStayLong", metrics.rangeStayLong);

    detail.lastUpdateAt = Date.now();
    saveDetailedState();
    ctxBattle.resultMetricsCommitted = true;
    return true;
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

  function createBttlAllyAiState(nowMs = performance.now()){
    const now = toNumber(nowMs, performance.now());
    return {
      currentAction: BTTL_ALLY_ACTION.STABLE,
      actionLockedUntilMs: 0,
      switchCooldownUntilMs: 0,
      lastDecideAtMs: now,
      recentEnemyShots: [],
      recentAllyShots: [],
      lastDamageTakenAtMs: 0,
      lastActionChangedAtMs: now,
      lastDodgeAtMs: 0,
      lastParryAtMs: 0,
      lastReflectAtMs: 0,
    };
  }

  function getBttlEnemyAiState(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return createBttlEnemyAiState(nowMs);
    if(!isRecord(ctxBattle.enemyAi)){
      ctxBattle.enemyAi = createBttlEnemyAiState(nowMs);
    }
    return ctxBattle.enemyAi;
  }

  function getBttlAllyAiState(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return createBttlAllyAiState(nowMs);
    if(!isRecord(ctxBattle.allyAi)){
      ctxBattle.allyAi = createBttlAllyAiState(nowMs);
    }
    return ctxBattle.allyAi;
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

  function getBttlAllyActionId(actionId){
    const id = String(actionId || "").trim().toUpperCase();
    if(
      id === BTTL_ALLY_ACTION.PRESS ||
      id === BTTL_ALLY_ACTION.DEFEND ||
      id === BTTL_ALLY_ACTION.EVADE
    ){
      return id;
    }
    return BTTL_ALLY_ACTION.STABLE;
  }

  function getBttlAllyActionIntervalMult(actionId){
    const id = getBttlAllyActionId(actionId);
    return clamp(toNumber(BTTL_ALLY_ACTION_INTERVAL_MULT[id], 1), 0.5, 1.8);
  }

  function normalizeBttlRangeIntent(intentId){
    const id = String(intentId || "").trim().toUpperCase();
    if(id === BTTL_RANGE_INTENT.APPROACH || id === BTTL_RANGE_INTENT.RETREAT){
      return id;
    }
    return BTTL_RANGE_INTENT.HOLD;
  }

  function getBttlRangeStateByDistance(distance){
    const d = clamp(toNumber(distance, 1), 0, 1);
    if(d <= BTTL_RANGE_SHORT_THRESHOLD){
      return "short";
    }
    if(d <= BTTL_RANGE_MID_THRESHOLD){
      return "mid";
    }
    return "long";
  }

  function getBttlRangeStateWithHysteresis(distance, previousState){
    const d = clamp(toNumber(distance, 1), 0, 1);
    const prev = String(previousState || "").trim().toLowerCase();
    const shortTh = clamp(BTTL_RANGE_SHORT_THRESHOLD, 0.02, 0.9);
    const midTh = clamp(BTTL_RANGE_MID_THRESHOLD, shortTh + 0.02, 0.98);
    const shortEnter = clamp(
      shortTh - Math.max(0.004, toNumber(BTTL_RANGE_SHORT_ENTER_MARGIN, 0.022)),
      0.02,
      shortTh
    );
    const shortExit = clamp(
      shortTh + Math.max(0.002, toNumber(BTTL_RANGE_SHORT_EXIT_MARGIN, 0.008)),
      shortTh,
      midTh - 0.01
    );
    const longEnter = clamp(
      midTh + Math.max(0.004, toNumber(BTTL_RANGE_LONG_ENTER_MARGIN, 0.020)),
      shortExit + 0.01,
      0.98
    );
    const longExit = clamp(
      midTh - Math.max(0.002, toNumber(BTTL_RANGE_LONG_EXIT_MARGIN, 0.012)),
      shortExit + 0.01,
      midTh
    );
    if(prev === "short"){
      if(d <= shortExit){
        return "short";
      }
    }else if(prev === "mid"){
      if(d <= shortEnter){
        return "short";
      }
      if(d >= longEnter){
        return "long";
      }
      return "mid";
    }else if(prev === "long"){
      if(d >= longExit){
        return "long";
      }
    }
    return getBttlRangeStateByDistance(d);
  }

  function getBttlEnemyRangeIntentByAction(actionId){
    const id = getBttlEnemyActionId(actionId);
    if(id === BTTL_ENEMY_ACTION.PRESS){
      return BTTL_RANGE_INTENT.APPROACH;
    }
    if(id === BTTL_ENEMY_ACTION.DEFEND){
      return BTTL_RANGE_INTENT.RETREAT;
    }
    return BTTL_RANGE_INTENT.HOLD;
  }

  function getBttlAllyRangeIntentByAction(actionId){
    const id = getBttlAllyActionId(actionId);
    if(id === BTTL_ALLY_ACTION.PRESS){
      return BTTL_RANGE_INTENT.APPROACH;
    }
    if(id === BTTL_ALLY_ACTION.DEFEND || id === BTTL_ALLY_ACTION.EVADE){
      return BTTL_RANGE_INTENT.RETREAT;
    }
    return BTTL_RANGE_INTENT.HOLD;
  }

  function getBttlRangeHeavyBonus(rangeState){
    const id = String(rangeState || "").trim().toLowerCase();
    return toNumber(BTTL_RANGE_HEAVY_CHANCE_BONUS[id], 0);
  }

  function getBttlRangeIntervalMult(rangeState){
    const id = String(rangeState || "").trim().toLowerCase();
    return clamp(toNumber(BTTL_RANGE_INTERVAL_MULT[id], 1), 0.8, 1.3);
  }

  function getBttlRangeStateLabel(rangeState){
    const id = String(rangeState || "").trim().toLowerCase();
    if(id === "short") return "SHORT";
    if(id === "mid") return "MID";
    return "LONG";
  }

  function normalizeBttlRangePositions(enemyPosRaw, allyPosRaw){
    const minPos = clamp(BTTL_RANGE_POS_MIN, 0, 1);
    const maxPos = clamp(BTTL_RANGE_POS_MAX, minPos + 0.02, 1);
    const minGap = clamp(BTTL_RANGE_MIN_GAP, 0.02, Math.max(0.02, maxPos - minPos));
    let enemyPos = clamp(toNumber(enemyPosRaw, BTTL_RANGE_INIT_ENEMY_POS), minPos, maxPos);
    let allyPos = clamp(toNumber(allyPosRaw, BTTL_RANGE_INIT_ALLY_POS), minPos, maxPos);
    if(enemyPos > allyPos){
      const tmp = enemyPos;
      enemyPos = allyPos;
      allyPos = tmp;
    }
    const capacity = Math.max(minGap, maxPos - minPos);
    const desiredGap = clamp(Math.max(minGap, allyPos - enemyPos), minGap, capacity);
    const midpoint = clamp(
      (enemyPos + allyPos) * 0.5,
      minPos + (desiredGap * 0.5),
      maxPos - (desiredGap * 0.5)
    );
    enemyPos = midpoint - (desiredGap * 0.5);
    allyPos = midpoint + (desiredGap * 0.5);
    return { enemyPos, allyPos };
  }

  function applyBttlRangedHitKnockback(ctxBattle, owner, nowMs = performance.now()){
    if(!ctxBattle) return;
    const overclock = getBttlActiveOverclock(ctxBattle, nowMs);
    const overclockResist = owner === "enemy"
      ? clamp(toNumber(overclock?.knockbackResist, 0), 0, 0.9)
      : 0;
    const baseDelta = clamp(toNumber(BTTL_RANGED_HIT_KNOCK_POS_DELTA, 0.028), 0.006, 0.10);
    const delta = baseDelta * (1 - overclockResist);
    const targetRatio = clamp(toNumber(BTTL_RANGED_HIT_KNOCK_TARGET_RATIO, 0.72), 0.50, 0.92);
    const actorRatio = 1 - targetRatio;
    let enemyPos = toNumber(ctxBattle.enemyRangePos, BTTL_RANGE_INIT_ENEMY_POS);
    let allyPos = toNumber(ctxBattle.allyRangePos, BTTL_RANGE_INIT_ALLY_POS);
    if(owner === "enemy"){
      enemyPos -= delta * actorRatio;
      allyPos += delta * targetRatio;
    }else{
      enemyPos -= delta * targetRatio;
      allyPos += delta * actorRatio;
    }
    const moved = normalizeBttlRangePositions(enemyPos, allyPos);
    ctxBattle.enemyRangePos = moved.enemyPos;
    ctxBattle.allyRangePos = moved.allyPos;
    const visualEnemy = toNumber(ctxBattle.enemyRangeVisualPos, moved.enemyPos);
    const visualAlly = toNumber(ctxBattle.allyRangeVisualPos, moved.allyPos);
    ctxBattle.enemyRangeVisualPos = visualEnemy + ((moved.enemyPos - visualEnemy) * 0.70);
    ctxBattle.allyRangeVisualPos = visualAlly + ((moved.allyPos - visualAlly) * 0.70);
    ctxBattle.rangeDistance = Math.abs(moved.allyPos - moved.enemyPos);
    ctxBattle.rangeMidpoint = (moved.enemyPos + moved.allyPos) * 0.5;
    ctxBattle.rangeState = getBttlRangeStateWithHysteresis(ctxBattle.rangeDistance, ctxBattle.rangeState);
    const now = toNumber(nowMs, performance.now());
    ctxBattle.rangeMarkerShakeStartedAtMs = now;
    ctxBattle.rangeMarkerShakeUntilMs = now + Math.max(90, Math.floor(toNumber(BTTL_RANGE_MARKER_SHAKE_MS, 420) * 0.65));
  }

  function ensureBttlRangeState(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    const now = toNumber(nowMs, performance.now());
    const normalized = normalizeBttlRangePositions(
      ctxBattle.enemyRangePos,
      ctxBattle.allyRangePos
    );
    ctxBattle.enemyRangePos = normalized.enemyPos;
    ctxBattle.allyRangePos = normalized.allyPos;
    if(!Number.isFinite(toNumber(ctxBattle.enemyRangeVisualPos, NaN))){
      ctxBattle.enemyRangeVisualPos = normalized.enemyPos;
    }
    if(!Number.isFinite(toNumber(ctxBattle.allyRangeVisualPos, NaN))){
      ctxBattle.allyRangeVisualPos = normalized.allyPos;
    }
    if(!Number.isFinite(toNumber(ctxBattle.rangeLastUpdateAtMs, NaN))){
      ctxBattle.rangeLastUpdateAtMs = now;
    }
    if(!Number.isFinite(toNumber(ctxBattle.rangeLastStateLogAtMs, NaN))){
      ctxBattle.rangeLastStateLogAtMs = 0;
    }
    if(!Number.isFinite(toNumber(ctxBattle.rangeLastIntentLogAtMs, NaN))){
      ctxBattle.rangeLastIntentLogAtMs = 0;
    }
    if(!Number.isFinite(toNumber(ctxBattle.rangeDistance, NaN))){
      ctxBattle.rangeDistance = Math.abs(normalized.allyPos - normalized.enemyPos);
    }
    if(!Number.isFinite(toNumber(ctxBattle.rangeMidpoint, NaN))){
      ctxBattle.rangeMidpoint = (normalized.enemyPos + normalized.allyPos) * 0.5;
    }
    if(typeof ctxBattle.rangeState !== "string" || ctxBattle.rangeState.length <= 0){
      ctxBattle.rangeState = getBttlRangeStateByDistance(ctxBattle.rangeDistance);
    }
    if(typeof ctxBattle.enemyRangeIntent !== "string" || ctxBattle.enemyRangeIntent.length <= 0){
      ctxBattle.enemyRangeIntent = getBttlEnemyRangeIntentByAction(getBttlEnemyAiState(ctxBattle, now).currentAction);
    }
    if(typeof ctxBattle.allyRangeIntent !== "string" || ctxBattle.allyRangeIntent.length <= 0){
      ctxBattle.allyRangeIntent = getBttlAllyRangeIntentByAction(getBttlAllyAiState(ctxBattle, now).currentAction);
    }
  }

  function updateBttlRangeRealtime(ctxBattle, nowMs = performance.now(), speedScale = 1){
    if(!ctxBattle) return;
    const now = toNumber(nowMs, performance.now());
    ensureBttlRangeState(ctxBattle, now);
    const aiEnemy = getBttlEnemyAiState(ctxBattle, now);
    const aiAlly = getBttlAllyAiState(ctxBattle, now);
    const enemyIntent = normalizeBttlRangeIntent(getBttlEnemyRangeIntentByAction(aiEnemy.currentAction));
    const allyIntent = normalizeBttlRangeIntent(getBttlAllyRangeIntentByAction(aiAlly.currentAction));
    const phaseStartedAtMs = toNumber(ctxBattle.phaseStartedAtMs, now);
    const canLogIntent = (now - phaseStartedAtMs) >= 480;
    if(enemyIntent !== String(ctxBattle.enemyRangeIntent || "")){
      const elapsed = now - toNumber(ctxBattle.rangeLastIntentLogAtMs, 0);
      if(canLogIntent && elapsed >= BTTL_RANGE_INTENT_LOG_MIN_INTERVAL_MS){
        pushBttlLog(ctxBattle, enemyIntent);
        ctxBattle.rangeLastIntentLogAtMs = now;
      }
      ctxBattle.enemyRangeIntent = enemyIntent;
    }
    if(allyIntent !== String(ctxBattle.allyRangeIntent || "")){
      ctxBattle.allyRangeIntent = allyIntent;
    }

    const dtBaseSec = clamp((now - toNumber(ctxBattle.rangeLastUpdateAtMs, now)) / 1000, 0, 0.08);
    if(dtBaseSec > 0){
      addBttlRangeStayMetric(ctxBattle, ctxBattle.rangeState, dtBaseSec * 1000);
    }
    ctxBattle.rangeLastUpdateAtMs = now;
    const scaledDtSec = dtBaseSec * clamp(toNumber(speedScale, 1), 0.35, 1.15);
    if(scaledDtSec <= 0){
      return;
    }
    const base = Math.max(0.01, toNumber(BTTL_RANGE_MOVE_SPEED_BASE, 0.15));
    const approachSpeed = base + Math.max(0, toNumber(BTTL_RANGE_MOVE_SPEED_APPROACH_BONUS, 0.1));
    const retreatSpeed = base + Math.max(0, toNumber(BTTL_RANGE_MOVE_SPEED_RETREAT_BONUS, 0.08));
    const wobble = Math.max(0, toNumber(BTTL_RANGE_HOLD_WOBBLE, 0.012)) * scaledDtSec;

    const enemyDir = +1; // towards ally (right)
    const allyDir = -1;  // towards enemy (left)
    const enemyMove = enemyIntent === BTTL_RANGE_INTENT.APPROACH
      ? enemyDir * approachSpeed * scaledDtSec
      : (enemyIntent === BTTL_RANGE_INTENT.RETREAT
        ? -enemyDir * retreatSpeed * scaledDtSec
        : Math.sin((now * 0.004) + 0.31) * wobble);
    const allyMove = allyIntent === BTTL_RANGE_INTENT.APPROACH
      ? allyDir * approachSpeed * scaledDtSec
      : (allyIntent === BTTL_RANGE_INTENT.RETREAT
        ? -allyDir * retreatSpeed * scaledDtSec
        : Math.sin((now * 0.004) + 2.07) * wobble);

    let enemyMoveAdj = enemyMove;
    let allyMoveAdj = allyMove;
    const overclock = getBttlActiveOverclock(ctxBattle, now);
    const overclockApproachActive = Boolean(overclock) && allyIntent === BTTL_RANGE_INTENT.APPROACH;
    const overclockApproachMult = overclockApproachActive
      ? clamp(toNumber(overclock.approachMult, 1), 1, 3)
      : 1;
    if(overclock && allyIntent === BTTL_RANGE_INTENT.APPROACH){
      allyMoveAdj *= overclockApproachMult;
    }
    if(enemyIntent === allyIntent && enemyIntent !== BTTL_RANGE_INTENT.HOLD){
      const damp = clamp(toNumber(BTTL_RANGE_SAME_INTENT_DAMP, 0.80), 0.5, 1);
      enemyMoveAdj *= damp;
      let allyDamp = damp;
      if(overclockApproachActive){
        const bypass = clamp(toNumber(BTTL_OVERCLOCK_SAME_INTENT_BYPASS, 0.70), 0, 1);
        allyDamp = clamp(damp + ((1 - damp) * bypass), damp, 1);
      }
      allyMoveAdj *= allyDamp;
    }
    const enemyPosNow = toNumber(ctxBattle.enemyRangePos, BTTL_RANGE_INIT_ENEMY_POS);
    const allyPosNow = toNumber(ctxBattle.allyRangePos, BTTL_RANGE_INIT_ALLY_POS);
    const distanceNow = Math.abs(allyPosNow - enemyPosNow);
    const shortTh = clamp(BTTL_RANGE_SHORT_THRESHOLD, 0.02, 0.9);
    const midTh = clamp(BTTL_RANGE_MID_THRESHOLD, shortTh + 0.02, 0.98);
    const shortApproachBand = Math.max(0.02, midTh - shortTh);
    const shortApproachRatio = clamp((midTh - distanceNow) / shortApproachBand, 0, 1);
    const shortApproachResist = 1 - (clamp(toNumber(BTTL_RANGE_SHORT_APPROACH_RESIST, 0.60), 0, 0.9) * shortApproachRatio);
    if(enemyIntent === BTTL_RANGE_INTENT.APPROACH){
      enemyMoveAdj *= shortApproachResist;
    }
    if(allyIntent === BTTL_RANGE_INTENT.APPROACH){
      let allyShortResist = shortApproachResist;
      if(overclockApproachActive){
        const resistBypass = clamp(toNumber(BTTL_OVERCLOCK_SHORT_RESIST_BYPASS, 0.60), 0, 1);
        allyShortResist = clamp(
          shortApproachResist + ((1 - shortApproachResist) * resistBypass),
          shortApproachResist,
          1
        );
      }
      allyMoveAdj *= allyShortResist;
      if(overclockApproachActive){
        // Extra closing burst so OVRCLK clearly feels like "rush in".
        const rushBase = Math.max(0, toNumber(BTTL_OVERCLOCK_RUSH_SPEED, 0.30));
        const rushScale = clamp(overclockApproachMult - 1, 0, 2.2);
        const rush = rushBase * rushScale * scaledDtSec;
        allyMoveAdj += allyDir * rush;
        // Slightly drag enemy side even while they hold/retreat, avoiding "stuck in mid-long".
        if(enemyIntent !== BTTL_RANGE_INTENT.APPROACH){
          enemyMoveAdj += enemyDir * rush * 0.35;
        }
      }
    }
    if(distanceNow <= shortTh){
      const shortEscapeWindow = Math.max(0.02, shortTh - clamp(BTTL_RANGE_MIN_GAP, 0.02, shortTh));
      const shortEscapeRatio = clamp((shortTh - distanceNow) / shortEscapeWindow, 0, 1);
      const shortEscapePush = Math.max(0, toNumber(BTTL_RANGE_SHORT_ESCAPE_SPEED, 0.18)) * scaledDtSec * shortEscapeRatio;
      enemyMoveAdj -= shortEscapePush;
      allyMoveAdj += shortEscapePush;
    }
    const midpointNow = (enemyPosNow + allyPosNow) * 0.5;
    const centerOffset = clamp(midpointNow - 0.5, -0.4, 0.4);
    const centerPull = clamp(toNumber(BTTL_RANGE_CENTER_PULL, 0.26), 0, 0.5);
    const centerCorrection = centerOffset * centerPull * scaledDtSec;
    // Positive midpoint offset means both are too far right; pull both left (and vice versa).
    enemyMoveAdj -= centerCorrection;
    allyMoveAdj -= centerCorrection;

    const moved = normalizeBttlRangePositions(
      enemyPosNow + enemyMoveAdj,
      allyPosNow + allyMoveAdj
    );
    ctxBattle.enemyRangePos = moved.enemyPos;
    ctxBattle.allyRangePos = moved.allyPos;

    const lerpSpeed = overclockApproachActive
      ? (toNumber(BTTL_RANGE_LERP_SPEED, 10) * clamp(toNumber(BTTL_OVERCLOCK_RANGE_LERP_MULT, 1.55), 1, 3))
      : toNumber(BTTL_RANGE_LERP_SPEED, 10);
    const lerpT = clamp(lerpSpeed * scaledDtSec, 0, 1);
    const enemyVisualPrev = toNumber(ctxBattle.enemyRangeVisualPos, moved.enemyPos);
    const allyVisualPrev = toNumber(ctxBattle.allyRangeVisualPos, moved.allyPos);
    ctxBattle.enemyRangeVisualPos = enemyVisualPrev + ((moved.enemyPos - enemyVisualPrev) * lerpT);
    ctxBattle.allyRangeVisualPos = allyVisualPrev + ((moved.allyPos - allyVisualPrev) * lerpT);

    const distance = Math.abs(moved.allyPos - moved.enemyPos);
    const midpoint = (moved.enemyPos + moved.allyPos) * 0.5;
    ctxBattle.rangeDistance = distance;
    ctxBattle.rangeMidpoint = midpoint;
    const nextRangeState = getBttlRangeStateWithHysteresis(distance, ctxBattle.rangeState);
    const prevRangeState = String(ctxBattle.rangeState || "").trim().toLowerCase();
    if(nextRangeState !== prevRangeState){
      ctxBattle.rangeState = nextRangeState;
      const elapsedState = now - toNumber(ctxBattle.rangeLastStateLogAtMs, 0);
      if((now - phaseStartedAtMs) >= 580 && elapsedState >= BTTL_RANGE_STATE_LOG_MIN_INTERVAL_MS){
        pushBttlLog(ctxBattle, `RANGE ${getBttlRangeStateLabel(nextRangeState)}`);
        ctxBattle.rangeLastStateLogAtMs = now;
      }
    }else{
      ctxBattle.rangeState = nextRangeState;
    }
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
    const activeSignal = getBttlActiveSignalBuff(ctxBattle, nowMs);
    const allyBuffState = activeSignal
      ? getBttlSignalBuffTone(activeSignal)
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

  function buildBttlAllyPolicyInput(ctxBattle, nowMs = performance.now()){
    const ai = getBttlAllyAiState(ctxBattle, nowMs);
    const allyHp = Math.max(0, toNumber(ctxBattle?.ally?.hp, 0));
    const allyMax = Math.max(1, toNumber(ctxBattle?.ally?.maxHp, 1));
    const enemyHp = Math.max(0, toNumber(ctxBattle?.enemy?.hp, 0));
    const enemyMax = Math.max(1, toNumber(ctxBattle?.enemy?.maxHp, 1));
    const lastDamageAgoMs = ai.lastDamageTakenAtMs > 0
      ? Math.max(0, toNumber(nowMs, performance.now()) - toNumber(ai.lastDamageTakenAtMs, 0))
      : Infinity;
    const activeSignal = getBttlActiveSignalBuff(ctxBattle, nowMs);
    const pendingTone = activeSignal
      ? getBttlSignalBuffTone(activeSignal)
      : "NONE";
    const now = toNumber(nowMs, performance.now());
    const heavyInboundRemainMs = Math.max(0, toNumber(ctxBattle?.heavyInboundUntilMs, 0) - now);
    const heavyImpactRemainMs = Math.max(0, toNumber(ctxBattle?.heavyImpactAtMs, 0) - now);
    return {
      hpRatioSelf: clamp(allyHp / allyMax, 0, 1),
      hpRatioTarget: clamp(enemyHp / enemyMax, 0, 1),
      recentSelfHitRate: getBttlRecentHitRate(ai.recentAllyShots),
      recentTargetHitRate: getBttlRecentHitRate(ai.recentEnemyShots),
      lastDamageTakenMs: lastDamageAgoMs,
      pendingTone,
      heavyInboundRemainMs,
      heavyImpactRemainMs,
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

  function utilityPolicyDecideAllyAction(input){
    const hpSelf = clamp(toNumber(input?.hpRatioSelf, 1), 0, 1);
    const hpTarget = clamp(toNumber(input?.hpRatioTarget, 1), 0, 1);
    const selfHit = clamp(toNumber(input?.recentSelfHitRate, 0.5), 0, 1);
    const targetHit = clamp(toNumber(input?.recentTargetHitRate, 0.5), 0, 1);
    const lastDamageMs = toNumber(input?.lastDamageTakenMs, Infinity);
    const pendingTone = String(input?.pendingTone || "NONE").toUpperCase();
    const heavyInboundRemainMs = Math.max(0, toNumber(input?.heavyInboundRemainMs, 0));
    const heavyImpactRemainMs = Math.max(0, toNumber(input?.heavyImpactRemainMs, 0));

    let scorePress =
      ((1 - hpTarget) * 1.28) +
      (hpSelf * 0.34) +
      (selfHit * 0.95) -
      (targetHit * 0.58);
    let scoreDefend =
      ((1 - hpSelf) * 1.18) +
      (targetHit * 0.92) +
      ((lastDamageMs <= 2200) ? 0.44 : 0) -
      ((1 - hpTarget) * 0.34);
    let scoreEvade =
      ((1 - hpSelf) * 1.05) +
      (targetHit * 0.82) +
      ((lastDamageMs <= 2100) ? 0.46 : 0) +
      ((targetHit - selfHit) * 0.30);

    if(pendingTone === "UP"){
      scorePress += 0.18;
      scoreDefend -= 0.07;
      scoreEvade -= 0.08;
    }else if(pendingTone === "DN"){
      scoreDefend += 0.18;
      scoreEvade += 0.14;
      scorePress -= 0.10;
    }

    if(heavyInboundRemainMs > 0){
      scoreEvade += 0.52;
      scoreDefend += 0.26;
      scorePress -= 0.24;
      if(heavyImpactRemainMs > 0 && heavyImpactRemainMs <= 900){
        scoreEvade += 0.26;
        scoreDefend += 0.12;
      }
      if(heavyImpactRemainMs > 0 && heavyImpactRemainMs <= 520){
        scoreEvade += 0.20;
      }
    }

    const spike = Math.max(scorePress, scoreDefend, scoreEvade) - Math.min(scorePress, scoreDefend, scoreEvade);
    const scoreStable = 0.86 - Math.min(0.48, spike * 0.22) + (selfHit < 0.34 ? 0.14 : 0);

    const options = [
      { actionId: BTTL_ALLY_ACTION.PRESS, score: scorePress },
      { actionId: BTTL_ALLY_ACTION.STABLE, score: scoreStable },
      { actionId: BTTL_ALLY_ACTION.DEFEND, score: scoreDefend },
      { actionId: BTTL_ALLY_ACTION.EVADE, score: scoreEvade },
    ];
    options.sort((a, b) => b.score - a.score);
    return options[0] || { actionId: BTTL_ALLY_ACTION.STABLE, score: 0 };
  }

  function decideEnemyActionIntent(ctxBattle, nowMs = performance.now()){
    const input = buildBttlEnemyPolicyInput(ctxBattle, nowMs);
    return utilityPolicyDecideEnemyAction(input);
  }

  function decideAllyActionIntent(ctxBattle, nowMs = performance.now()){
    const input = buildBttlAllyPolicyInput(ctxBattle, nowMs);
    return utilityPolicyDecideAllyAction(input);
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

  function validateAndApplyAllyActionIntent(ctxBattle, actionIntent, nowMs = performance.now()){
    const ai = getBttlAllyAiState(ctxBattle, nowMs);
    const now = toNumber(nowMs, performance.now());
    const current = getBttlAllyActionId(ai.currentAction);
    const next = getBttlAllyActionId(actionIntent?.actionId);
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
    ai.actionLockedUntilMs = now + BTTL_ALLY_AI_MIN_HOLD_MS;
    ai.switchCooldownUntilMs = now + BTTL_ALLY_AI_SWITCH_COOLDOWN_MS;
    ai.lastActionChangedAtMs = now;
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

  function updateBttlAllyActionAi(ctxBattle, nowMs = performance.now()){
    const ai = getBttlAllyAiState(ctxBattle, nowMs);
    const now = toNumber(nowMs, performance.now());
    if((now - toNumber(ai.lastDecideAtMs, 0)) < BTTL_ALLY_AI_DECIDE_INTERVAL_MS){
      return;
    }
    ai.lastDecideAtMs = now;
    let intent = null;
    try{
      intent = decideAllyActionIntent(ctxBattle, now);
    }catch(_err){
      intent = null;
    }
    if(!isRecord(intent)){
      intent = utilityPolicyDecideAllyAction(buildBttlAllyPolicyInput(ctxBattle, now));
    }
    validateAndApplyAllyActionIntent(ctxBattle, intent, now);
  }

  function noteBttlShotOutcome(ctxBattle, owner, didHit, nowMs = performance.now()){
    if(!ctxBattle) return;
    const enemyAi = getBttlEnemyAiState(ctxBattle, nowMs);
    const allyAi = getBttlAllyAiState(ctxBattle, nowMs);
    const shooter = owner === "enemy" ? "enemy" : "ally";
    const hit = Boolean(didHit);
    if(shooter === "enemy"){
      enemyAi.recentEnemyShots = noteBttlRecentHit(enemyAi.recentEnemyShots, hit);
      allyAi.recentEnemyShots = noteBttlRecentHit(allyAi.recentEnemyShots, hit);
      if(hit){
        allyAi.lastDamageTakenAtMs = toNumber(nowMs, performance.now());
      }
      return;
    }
    enemyAi.recentAllyShots = noteBttlRecentHit(enemyAi.recentAllyShots, hit);
    allyAi.recentAllyShots = noteBttlRecentHit(allyAi.recentAllyShots, hit);
    if(hit){
      enemyAi.lastDamageTakenAtMs = toNumber(nowMs, performance.now());
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

  function mapTrnTierToHeavyGrade(tier){
    const id = String(tier || "").trim().toUpperCase();
    if(id === "CRIT") return "SUCCESS";
    if(id === "SUCCESS") return "OK";
    if(id === "NEAR") return "NEAR";
    return "BAD";
  }

  function getBttlHeavyReactPoint(field){
    const fx = Math.round(clamp(
      field.innerRect.x + Math.floor(field.innerRect.w * 0.50),
      field.innerRect.x + 12,
      field.innerRect.x + field.innerRect.w - 12
    ));
    const fy = Math.round(clamp(
      field.innerRect.y + Math.floor(field.innerRect.h * 0.50),
      field.innerRect.y + 12,
      field.innerRect.y + field.innerRect.h - 12
    ));
    return { x: fx, y: fy };
  }

  function createBttlHeavyReactSession(ctxBattle, projectile, field, nowMs = performance.now()){
    const now = toNumber(nowMs, performance.now());
    const impactAtMs = toNumber(projectile?.impactAtMs, now + 500);
    const ringVisibleAtMs = Math.max(now, impactAtMs - BTTL_HEAVY_REACT_RING_LEAD_MS);
    const p = getBttlHeavyReactPoint(field);
    const minR = 8;
    const maxR = 28;
    const bandW = BTTL_HEAVY_REACT_BAND_W;
    const critW = BTTL_HEAVY_REACT_CRIT_W;
    const centerR = minR + ((maxR - minR) * (0.32 + (Math.random() * 0.48)));
    return {
      projectileId: toNumber(projectile?.id, 0),
      startedAtMs: now,
      ringVisibleAtMs,
      impactAtMs,
      minR,
      maxR,
      centerR,
      bandW,
      critEnabled: true,
      critW,
      nearMargin: BTTL_HEAVY_REACT_NEAR_MARGIN,
      loopMs: BTTL_HEAVY_REACT_LOOP_MS,
      focusX: p.x,
      focusY: p.y,
      windowLatchedAtMs: 0,
      resolved: false,
      grade: "",
      resolvedAtMs: 0,
      resultUntilMs: 0,
    };
  }

  function startBttlHeavyReactSession(ctxBattle, projectile, field, nowMs = performance.now()){
    if(!ctxBattle || !projectile?.isHeavy) return null;
    const session = createBttlHeavyReactSession(ctxBattle, projectile, field, nowMs);
    ctxBattle.heavyReactSession = session;
    ctxBattle.heavyInboundStartedAtMs = toNumber(nowMs, performance.now());
    ctxBattle.heavyInboundUntilMs = session.impactAtMs;
    ctxBattle.heavyImpactAtMs = session.impactAtMs;
    ctxBattle.heavyIncomingActionHint = getBttlAllyActionId(getBttlAllyAiState(ctxBattle, nowMs).currentAction);
    return session;
  }

  function getBttlHeavyRingVisibleAtMs(session){
    if(!session) return 0;
    const impactAtMs = toNumber(session.impactAtMs, 0);
    const startedAtMs = toNumber(session.startedAtMs, 0);
    return Math.max(startedAtMs, impactAtMs - BTTL_HEAVY_REACT_RING_LEAD_MS);
  }

  function isBttlHeavyReactionWindowActive(ctxBattle, nowMs = performance.now()){
    const session = isRecord(ctxBattle?.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    if(!session) return false;
    if(Boolean(session.resolved)) return false;
    const now = toNumber(nowMs, performance.now());
    const ringVisibleAtMs = getBttlHeavyRingVisibleAtMs(session);
    const impactEndMs = toNumber(session.impactAtMs, 0) + BTTL_HEAVY_REACT_RING_GRACE_MS;
    if(now > impactEndMs){
      return false;
    }
    if(toNumber(session.windowLatchedAtMs, 0) > 0){
      return true;
    }
    if(now >= ringVisibleAtMs){
      session.windowLatchedAtMs = now;
      return true;
    }
    return false;
  }

  function getBttlHeavyReactCurrentRadius(session, nowMs = performance.now()){
    if(!session) return 0;
    const phase = getTrnLoopPhase({
      startedAtMs: toNumber(session.startedAtMs, nowMs),
      loopMs: toNumber(session.loopMs, BTTL_HEAVY_REACT_LOOP_MS),
    }, nowMs);
    const eased = getTrnEasedProgress(phase);
    return session.minR + ((session.maxR - session.minR) * eased);
  }

  function judgeBttlHeavyReactionByInput(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return null;
    const session = isRecord(ctxBattle.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    if(!session || session.resolved) return null;
    if(!isBttlHeavyReactionWindowActive(ctxBattle, nowMs)) return null;
    const r = getBttlHeavyReactCurrentRadius(session, nowMs);
    const tier = getTrnGameTier(session, r);
    const grade = mapTrnTierToHeavyGrade(tier);
    session.resolved = true;
    session.grade = grade;
    session.resolvedAtMs = toNumber(nowMs, performance.now());
    session.resultUntilMs = session.resolvedAtMs + BTTL_HEAVY_REACT_RESULT_HOLD_MS;
    return grade;
  }

  function getBttlHeavyReactionOutcomeAtImpact(ctxBattle, projectile, damage, nowMs = performance.now()){
    const rawDamage = Math.max(1, Math.floor(toNumber(damage, 1)));
    const session = isRecord(ctxBattle?.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    let grade = "BAD";
    if(session && toNumber(session.projectileId, -1) === toNumber(projectile?.id, -2)){
      if(Boolean(session.resolved)){
        grade = String(session.grade || "BAD").trim().toUpperCase();
      }else{
        session.resolved = true;
        session.grade = "BAD";
        session.resolvedAtMs = toNumber(nowMs, performance.now());
        session.resultUntilMs = session.resolvedAtMs + BTTL_HEAVY_REACT_RESULT_HOLD_MS;
      }
    }
    if(grade === "NEAR"){
      return { outcome: "dodge", damage: 0, grade };
    }
    if(grade === "OK"){
      return { outcome: "parry", damage: 0, grade };
    }
    if(grade === "SUCCESS"){
      const reflectDamage = Math.max(1, Math.ceil(rawDamage * BTTL_REFLECT_DAMAGE_MULT));
      return { outcome: "reflect", damage: 0, reflectDamage, grade };
    }
    return { outcome: "hit", damage: rawDamage, grade: "BAD" };
  }

  function updateBttlHeavyReactionSession(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return;
    const session = isRecord(ctxBattle.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    if(!session) return;
    const now = toNumber(nowMs, performance.now());
    if(Boolean(session.resolved) && now >= toNumber(session.resultUntilMs, 0)){
      ctxBattle.heavyReactSession = null;
    }
  }

  function getBttlSignalTierFromGrade(grade){
    const g = String(grade || "").trim().toUpperCase();
    if(g === "SUCCESS") return 3;
    if(g === "OK") return 2;
    if(g === "NEAR") return 1;
    return 0;
  }

  function getBttlSignalTierValue(tableByCmd, cmd, tier, fallback = 0){
    const id = normalizeBttlSignalCommand(cmd);
    const list = isRecord(tableByCmd) ? tableByCmd[id] : null;
    const fallbackList = isRecord(tableByCmd) ? tableByCmd.calibrate : null;
    const src = Array.isArray(list) ? list : (Array.isArray(fallbackList) ? fallbackList : null);
    if(!Array.isArray(src)) return fallback;
    const t = clamp(Math.floor(toNumber(tier, 0)), 0, 3);
    return toNumber(src[t], fallback);
  }

  function ensureBttlSignalBuffState(ctxBattle){
    if(!ctxBattle) return null;
    if(!isRecord(ctxBattle.signalBuff)){
      ctxBattle.signalBuff = {
        cmd: "",
        activeUntilMs: 0,
        startedAtMs: 0,
        tier: 0,
        hitChanceAdj: 0,
        intervalMult: 1,
        approachMult: 1,
        knockbackResist: 0,
        damageTakenMult: 1,
        breakTakenMult: 1,
      };
    }
    return ctxBattle.signalBuff;
  }

  function clearBttlSignalBuffState(ctxBattle){
    const buff = ensureBttlSignalBuffState(ctxBattle);
    if(!buff) return;
    buff.cmd = "";
    buff.activeUntilMs = 0;
    buff.startedAtMs = 0;
    buff.tier = 0;
    buff.hitChanceAdj = 0;
    buff.intervalMult = 1;
    buff.approachMult = 1;
    buff.knockbackResist = 0;
    buff.damageTakenMult = 1;
    buff.breakTakenMult = 1;
  }

  function activateBttlSignalBuff(ctxBattle, cmdRaw, tierRaw, nowMs = performance.now()){
    if(!ctxBattle) return null;
    const cmd = normalizeBttlSignalCommand(cmdRaw);
    const tier = clamp(Math.floor(toNumber(tierRaw, 0)), 0, 3);
    const now = toNumber(nowMs, performance.now());
    const durationMs = Math.max(0, Math.floor(toNumber(BTTL_SIGNAL_DURATION_MS_BY_TIER[tier], 0)));
    if(durationMs <= 0){
      clearBttlSignalBuffState(ctxBattle);
      return null;
    }
    const buff = ensureBttlSignalBuffState(ctxBattle);
    buff.cmd = cmd;
    buff.startedAtMs = now;
    buff.activeUntilMs = now + durationMs;
    buff.tier = tier;
    buff.hitChanceAdj = getBttlSignalHitBonus(cmd, tier);
    buff.intervalMult = getBttlSignalIntervalMult(cmd, tier);
    buff.approachMult = clamp(getBttlSignalTierValue(BTTL_SIGNAL_APPROACH_MULT_BY_TIER, cmd, tier, 1), 1, 3);
    buff.knockbackResist = clamp(getBttlSignalTierValue(BTTL_SIGNAL_KNOCKBACK_RESIST_BY_TIER, cmd, tier, 0), 0, 0.9);
    buff.damageTakenMult = Math.max(1, getBttlSignalTierValue(BTTL_SIGNAL_DAMAGE_TAKEN_MULT_BY_TIER, cmd, tier, 1));
    buff.breakTakenMult = Math.max(1, getBttlSignalTierValue(BTTL_SIGNAL_BREAK_TAKEN_MULT_BY_TIER, cmd, tier, 1));
    return {
      cmd,
      tier,
      durationMs,
      activeUntilMs: buff.activeUntilMs,
      hitChanceAdj: buff.hitChanceAdj,
      intervalMult: buff.intervalMult,
      approachMult: buff.approachMult,
      knockbackResist: buff.knockbackResist,
      damageTakenMult: buff.damageTakenMult,
      breakTakenMult: buff.breakTakenMult,
    };
  }

  function getBttlActiveSignalBuff(ctxBattle, nowMs = performance.now()){
    const buff = ensureBttlSignalBuffState(ctxBattle);
    if(!buff) return null;
    const now = toNumber(nowMs, performance.now());
    if(now < toNumber(buff.activeUntilMs, 0) && String(buff.cmd || "").trim().length > 0){
      return buff;
    }
    if(toNumber(buff.activeUntilMs, 0) > 0){
      clearBttlSignalBuffState(ctxBattle);
    }
    return null;
  }

  function getBttlActiveOverclock(ctxBattle, nowMs = performance.now()){
    const buff = getBttlActiveSignalBuff(ctxBattle, nowMs);
    if(!buff) return null;
    return normalizeBttlSignalCommand(buff.cmd) === "overclock" ? buff : null;
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
    return owner === "enemy" ? "ENE" : "YOU";
  }

  function getBttlOutcomeLogLine(owner, didHit, damage = 0){
    const actor = getBttlActorShort(owner);
    if(!didHit){
      return `${actor} MISS`;
    }
    const dmg = Math.max(0, Math.floor(toNumber(damage, 0)));
    return `${actor} DMG ${dmg}`;
  }

  function getBttlSignalBuffTone(effect){
    if(!isRecord(effect)) return "EQ";
    const intervalMult = toNumber(effect.intervalMult, 1);
    const hitAdj = toNumber(effect.hitChanceAdj, 0);
    const approach = toNumber(effect.approachMult, 1);
    const score = ((1 - intervalMult) * 1.4) + (hitAdj * 1.6) + ((approach - 1) * 1.2);
    if(score > 0.02) return "UP";
    if(score < -0.02) return "DN";
    return "EQ";
  }

  function getBttlSignalProcBadgeText(proc){
    if(!isRecord(proc)) return "";
    const cmd = normalizeBttlSignalCommand(proc.cmd);
    const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[cmd] || "SIG";
    const grade = getBttlSignalGradeShort(proc.grade);
    return `${cmdLabel} ${grade}`;
  }

  function getBttlSignalActiveBadgeText(buff){
    if(!isRecord(buff)) return "";
    const cmd = normalizeBttlSignalCommand(buff.cmd);
    if(cmd === "overclock") return "OVRCLK";
    const item = BTTL_SIGNAL_MENU_ITEMS.find((entry) => normalizeBttlSignalCommand(entry?.id) === cmd);
    return item ? String(item.label || "").trim().toUpperCase() : "";
  }

  function drawBttlSignalStatusBadge(ctxBattle, field, allyX, allyY, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    const proc = isRecord(ctxBattle.lastSignalProc) ? ctxBattle.lastSignalProc : null;
    const procUntilMs = toNumber(proc?.untilMs, 0);
    const procActive = proc && nowMs < procUntilMs;
    if(proc && !procActive){
      ctxBattle.lastSignalProc = null;
    }
    const activeBuff = !procActive ? getBttlActiveSignalBuff(ctxBattle, nowMs) : null;
    const rawText = procActive
      ? getBttlSignalProcBadgeText(proc)
      : getBttlSignalActiveBadgeText(activeBuff);
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
    const mainAlpha = procActive
      ? 0.98
      : (blinkOn ? 0.95 : 0.62);
    ctx.save();
    ctx.fillStyle = procActive
      ? "rgba(198,212,192,0.34)"
      : (blinkOn ? "rgba(198,212,192,0.28)" : "rgba(198,212,192,0.14)");
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

  function drawBttlReactiveAssistBadge(ctxBattle, field, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    const allyAction = getBttlAllyActionId(getBttlAllyAiState(ctxBattle, nowMs).currentAction);
    const enemyAction = getBttlEnemyActionId(getBttlEnemyAiState(ctxBattle, nowMs).currentAction);
    const baseX = field.bottomLaneRect.x + 4;
    const baseY = field.bottomLaneRect.y + 4;
    drawText(baseX, baseY, `A:${allyAction} E:${enemyAction}`, {
      scale: 1,
      color: "rgba(14,20,15,0.52)",
    });

    const heavyUntilMs = toNumber(ctxBattle.heavyInboundUntilMs, 0);
    const heavyImpactAtMs = toNumber(ctxBattle.heavyImpactAtMs, 0);
    if(heavyUntilMs <= 0 || nowMs >= heavyUntilMs){
      const tuning = getBttlHeavyTuning();
      const cdRemainMs = Math.max(0, toNumber(ctxBattle.enemyHeavyReadyAtMs, 0) - toNumber(nowMs, performance.now()));
      const cdSec = (cdRemainMs / 1000).toFixed(1);
      const rollPct = Math.round(clamp(toNumber(tuning.chanceBase, BTTL_HEAVY_CHANCE_BASE), 0, 1) * 100);
      drawText(baseX, baseY + 9, `HVY ${cdSec}s R${rollPct}%`, {
        scale: 1,
        color: "rgba(14,20,15,0.42)",
      });
      return;
    }
    drawText(baseX, baseY + 9, "HEAVY IN", {
      scale: 1,
      color: "rgba(14,20,15,0.92)",
    });
    const actionHint = String(ctxBattle.heavyIncomingActionHint || allyAction).trim();
    if(actionHint.length > 0){
      drawText(baseX + 46, baseY + 9, `R:${actionHint}`, {
        scale: 1,
        color: "rgba(14,20,15,0.66)",
      });
    }
    if(heavyImpactAtMs > nowMs){
      const remainMs = Math.max(0, heavyImpactAtMs - nowMs);
      const remainSec = (remainMs / 1000).toFixed(1);
      drawText(baseX + 46, baseY + 16, `${remainSec}s`, {
        scale: 1,
        color: "rgba(14,20,15,0.58)",
      });
    }
  }

  function drawBttlHeavyReactionCue(ctxBattle, field, enemyX, enemyY, nowMs = performance.now()){
    if(!ctxBattle || !field) return;
    const session = isRecord(ctxBattle.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    if(!session) return;
    const now = toNumber(nowMs, performance.now());
    const ringVisibleAtMs = getBttlHeavyRingVisibleAtMs(session);
    const windowStartAtMs = toNumber(session.windowLatchedAtMs, 0) > 0
      ? toNumber(session.windowLatchedAtMs, ringVisibleAtMs)
      : ringVisibleAtMs;
    const impactAtMs = toNumber(session.impactAtMs, 0);
    const showWindow = isBttlHeavyReactionWindowActive(ctxBattle, now);
    const showTelegraph = now <= (impactAtMs + BTTL_HEAVY_REACT_RING_GRACE_MS);
    if(!showTelegraph && !showWindow && !(session.resolved && now < toNumber(session.resultUntilMs, 0))){
      return;
    }

    const fx = Math.round(clamp(
      toNumber(session.focusX, field.innerRect.x + Math.floor(field.innerRect.w * 0.50)),
      field.innerRect.x + 12,
      field.innerRect.x + field.innerRect.w - 12
    ));
    const fy = Math.round(clamp(
      toNumber(session.focusY, field.innerRect.y + Math.floor(field.innerRect.h * 0.50)),
      field.innerRect.y + 12,
      field.innerRect.y + field.innerRect.h - 12
    ));
    const minR = Math.max(4, toNumber(session.minR, 8));
    const maxR = Math.max(minR + 6, toNumber(session.maxR, 28));
    const panelR = Math.max(30, Math.floor(maxR + 14));
    const enemyBlink = (Math.floor(now / 110) % 2) === 0;
    if(showTelegraph && enemyBlink){
      ctx.save();
      ctx.fillStyle = "rgba(14,20,15,0.10)";
      ctx.fillRect(enemyX - 2, enemyY - 2, field.spritePx + 4, field.spritePx + 4);
      ctx.restore();
    }

    const showResultHold = Boolean(session.resolved) && now < toNumber(session.resultUntilMs, 0);
    const showParryWindow = showWindow && !session.resolved;
    if(showParryWindow){
      // Opaque parry window plate so the cue is isolated from the battle background.
      ctx.save();
      ctx.fillStyle = "rgba(191,202,186,0.98)";
      ctx.beginPath();
      ctx.arc(fx, fy, panelR, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.strokeStyle = "rgba(14,20,15,0.30)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Target focus marker near ally-front impact point.
      drawIdealRing(fx, fy, Math.max(4, minR - 2), 1, "rgba(14,20,15,0.24)");
    }
    // Heavy impact limit gauge: circular progress around the parry window.
    if(showWindow && !session.resolved){
      const startedAtMs = windowStartAtMs;
      const untilMs = Math.max(startedAtMs + 80, impactAtMs);
      const span = Math.max(80, untilMs - startedAtMs);
      const progress = clamp((now - startedAtMs) / span, 0, 1);
      const visibleProgress = Math.max(0.02, progress);
      const gaugeR = Math.max(16, Math.floor(maxR + 10));
      drawIdealRing(fx, fy, gaugeR, 1, "rgba(14,20,15,0.18)");
      ctx.save();
      ctx.strokeStyle = "rgba(14,20,15,0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, fy, gaugeR, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * visibleProgress), false);
      ctx.stroke();
      ctx.restore();
    }

    if(showWindow && now >= windowStartAtMs && !session.resolved){
      const waveR = getBttlHeavyReactCurrentRadius(session, now);
      const bandCenterR = clamp(toNumber(session.centerR, 14), minR, maxR);
      const bandW = Math.max(2, toNumber(session.bandW, BTTL_HEAVY_REACT_BAND_W));
      const critW = Math.max(2, toNumber(session.critW, BTTL_HEAVY_REACT_CRIT_W));
      const dist = Math.abs(waveR - bandCenterR);
      const inBand = dist <= (bandW / 2);
      const inCrit = dist <= (critW / 2);
      const bandAlpha = inBand ? 0.24 : 0.15;
      const critAlpha = inCrit ? 0.34 : 0.20;
      drawIdealRing(fx, fy, bandCenterR, Math.max(1, bandW * 0.86), `rgba(14,20,15,${bandAlpha.toFixed(3)})`);
      drawIdealRing(fx, fy, bandCenterR, Math.max(1, critW * 0.84), `rgba(14,20,15,${critAlpha.toFixed(3)})`);
      drawDistortedRing(
        fx,
        fy,
        waveR,
        0.9,
        now * 0.009,
        2,
        "rgba(14,20,15,0.60)"
      );
      const reactLabel = "C:REACT";
      const reactScale = 1;
      const reactMetrics = uiTextMeasure(reactLabel, { scale: reactScale });
      const reactW = Math.max(24, Math.floor(toNumber(reactMetrics?.width, 0)));
      const reactH = Math.max(8, Math.floor(toNumber(reactMetrics?.height, 0)));
      const reactY = Math.round(clamp(
        fy + panelR + 7,
        fy + Math.floor(maxR) + 10,
        (field.innerRect.y + field.innerRect.h) - 10
      ));
      const reactRectX = Math.round(fx - Math.floor((reactW + 6) / 2));
      const reactRectY = Math.round(reactY - 2);
      ctx.save();
      ctx.fillStyle = "rgba(191,202,186,0.96)";
      ctx.fillRect(reactRectX, reactRectY, reactW + 6, reactH + 4);
      ctx.strokeStyle = "rgba(14,20,15,0.30)";
      ctx.lineWidth = 1;
      ctx.strokeRect(reactRectX + 0.5, reactRectY + 0.5, reactW + 5, reactH + 3);
      ctx.restore();
      drawText(fx, reactY, reactLabel, {
        align: "center",
        scale: reactScale,
        color: "rgba(14,20,15,0.92)",
      });
    }

    if(showResultHold){
      const grade = String(session.grade || "").trim().toUpperCase();
      if(grade.length > 0){
        const resolvedAtMs = toNumber(session.resolvedAtMs, now);
        const resultDuration = Math.max(1, toNumber(session.resultUntilMs, now) - resolvedAtMs);
        const progress = clamp((now - resolvedAtMs) / resultDuration, 0, 1);
        const blinkMs = Math.max(40, Math.floor(toNumber(BTTL_START_INTRO_ENCOUNT_BLINK_MS, 72)));
        const finalHoldRatio = clamp(toNumber(BTTL_START_INTRO_ENCOUNT_FINAL_HOLD_RATIO, 0.50), 0.10, 0.85);
        const holdStart = Math.max(0, 1 - finalHoldRatio);
        const showGrade = (
          (progress >= holdStart) ||
          (progress >= 0.04 && (Math.floor((now - resolvedAtMs) / blinkMs) % 2 === 0))
        );
        if(showGrade){
          drawBttlEncountCenterPlate(field.innerRect, field.innerRect, grade, now, {
            textYOffset: -18,
            plateH: 36,
            plateW: Math.max(180, Math.round(field.innerRect.w - 10)),
            textScale: Math.max(3, Math.floor(toNumber(BTTL_START_INTRO_ENCOUNT_TEXT_SCALE, 5)) - 1),
            hatchAlpha: toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_ALPHA, 0.08),
            hatchStep: toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_STEP, 14),
            drawHatch: false,
            plateFillColor: "rgba(200,214,194,0.96)",
            plateStrokeColor: "rgba(14,20,15,0.42)",
            textShadowColor: "rgba(14,20,15,0.42)",
            textColor: "rgba(14,20,15,0.98)",
          });
        }
      }
    }
  }

  function getBttlSignalIntervalMult(cmd, tier){
    const id = normalizeBttlSignalCommand(cmd);
    const list = BTTL_SIGNAL_INTERVAL_MULT_BY_TIER[id] || BTTL_SIGNAL_INTERVAL_MULT_BY_TIER.calibrate;
    const t = clamp(Math.floor(toNumber(tier, 0)), 0, 3);
    return toNumber(list[t], 1);
  }

  function computeBttlAttackIntervalMs(ctxBattle, actorKey, nowMs = performance.now()){
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
    if(!isEnemy){
      const activeSignal = getBttlActiveSignalBuff(ctxBattle, nowMs);
      if(activeSignal){
        signalMult = clamp(toNumber(activeSignal.intervalMult, 1), 0.72, 1.35);
      }
    }
    const tacticalMult = isEnemy
      ? getBttlEnemyActionIntervalMult(getBttlEnemyAiState(ctxBattle).currentAction)
      : getBttlAllyActionIntervalMult(getBttlAllyAiState(ctxBattle).currentAction);
    const rangeMult = getBttlRangeIntervalMult(ctxBattle?.rangeState);
    const breakMult = Boolean(source?.isBreak)
      ? clamp(toNumber(BTTL_BREAK_INTERVAL_MULT, 1.34), 1, 2.5)
      : 1;
    const interval = base * sigMult * syncMult * hpMult * signalMult * tacticalMult * rangeMult * breakMult;
    return clamp(Math.round(interval), BTTL_ATTACK_INTERVAL_MIN_MS, BTTL_ATTACK_INTERVAL_MAX_MS);
  }

  function applyBttlActorDefendDamageMitigation(ctxBattle, targetKey, damage){
    const rawDamage = Math.max(1, Math.floor(toNumber(damage, 1)));
    if(targetKey === "enemy"){
      const ai = getBttlEnemyAiState(ctxBattle);
      const action = getBttlEnemyActionId(ai.currentAction);
      if(action !== BTTL_ENEMY_ACTION.DEFEND){
        return { damage: rawDamage, mitigated: false };
      }
      const mult = clamp(toNumber(BTTL_ENEMY_DEFEND_DMG_MULT, 0.88), 0.50, 1.00);
      const reduced = Math.max(1, Math.ceil(rawDamage * mult));
      return { damage: reduced, mitigated: reduced < rawDamage };
    }
    if(targetKey === "ally"){
      const ai = getBttlAllyAiState(ctxBattle);
      const action = getBttlAllyActionId(ai.currentAction);
      if(action !== BTTL_ALLY_ACTION.DEFEND){
        return { damage: rawDamage, mitigated: false };
      }
      const mult = clamp(toNumber(BTTL_ALLY_DEFEND_DMG_MULT, 0.90), 0.50, 1.00);
      const reduced = Math.max(1, Math.ceil(rawDamage * mult));
      return { damage: reduced, mitigated: reduced < rawDamage };
    }
    return { damage: rawDamage, mitigated: false };
  }

  function getBttlHeavyTuning(){
    if(BTTL_HEAVY_TEST_MODE){
      return {
        chanceBase: BTTL_HEAVY_TEST_CHANCE_BASE,
        cooldownMs: BTTL_HEAVY_TEST_COOLDOWN_MS,
        initialReadyRatio: BTTL_HEAVY_TEST_INITIAL_READY_RATIO,
      };
    }
    return {
      chanceBase: BTTL_HEAVY_CHANCE_BASE,
      cooldownMs: BTTL_HEAVY_COOLDOWN_MS,
      initialReadyRatio: BTTL_HEAVY_INITIAL_READY_RATIO,
    };
  }

  function shouldLaunchEnemyHeavy(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle) return false;
    const now = toNumber(nowMs, performance.now());
    const tuning = getBttlHeavyTuning();
    const readyAtMs = toNumber(ctxBattle.enemyHeavyReadyAtMs, 0);
    if(now < readyAtMs){
      return false;
    }
    let chance = toNumber(tuning.chanceBase, BTTL_HEAVY_CHANCE_BASE);
    chance += getBttlRangeHeavyBonus(ctxBattle?.rangeState);
    chance = clamp(chance, 0.04, 0.90);
    if(Math.random() >= chance){
      return false;
    }
    ctxBattle.enemyHeavyReadyAtMs = now + Math.max(300, Math.floor(toNumber(tuning.cooldownMs, BTTL_HEAVY_COOLDOWN_MS)));
    return true;
  }

  function computeBttlForwardRingDistance(fromT, toT, ringLen){
    const len = Math.max(1, toNumber(ringLen, 1));
    const from = normalizeRingT(toNumber(fromT, 0), len);
    const to = normalizeRingT(toNumber(toT, 0), len);
    if(to >= from){
      return to - from;
    }
    return (len - from) + to;
  }

  function estimateProjectileImpactAtMs(projectile, field, nowMs = performance.now(), speedScale = 1){
    if(!projectile || !field){
      return toNumber(nowMs, performance.now());
    }
    const scale = clamp(toNumber(speedScale, 1), 0.4, 1.2);
    const speed = Math.max(1, toNumber(projectile.speed, BTTL_PROJECTILE_SPEED) * scale);
    const range = getBttlTargetRangeByOwner(field, projectile.owner);
    const targetT = normalizeRingT(((toNumber(range.start, 0) + toNumber(range.end, 0)) * 0.5), field.ringLen);
    const dist = computeBttlForwardRingDistance(projectile.t, targetT, field.ringLen);
    const etaMs = (dist / speed) * 1000;
    return toNumber(nowMs, performance.now()) + Math.max(0, etaMs);
  }

  function resolveBttlAllyReactiveDefense(ctxBattle, projectile, damage, nowMs = performance.now()){
    const rawDamage = Math.max(1, Math.floor(toNumber(damage, 1)));
    if(!ctxBattle || !projectile || projectile.owner !== "enemy" || projectile.target !== "ally"){
      return { outcome: "hit", damage: rawDamage };
    }
    const isHeavy = Boolean(projectile.isHeavy);
    if(!isHeavy){
      // Heavy-only defense system: normal shots do not open dodge/parry windows.
      return { outcome: "hit", damage: rawDamage };
    }
    return getBttlHeavyReactionOutcomeAtImpact(ctxBattle, projectile, rawDamage, nowMs);
  }

  function consumeBttlSignalCost(ctxBattle, cmd){
    if(!ctxBattle) return 0;
    ensureBttlActorResourceState(ctxBattle.ally);
    const cost = getBttlSignalCost(cmd);
    if(cost <= 0) return 0;
    const staNow = Math.max(0, Math.floor(toNumber(ctxBattle.ally?.sta, 0)));
    if(staNow < cost) return 0;
    const staNext = Math.max(0, staNow - cost);
    ctxBattle.ally.sta = staNext;
    return staNow - staNext;
  }

  function updateBttlStaminaState(ctxBattle, dtMs = 16){
    if(!ctxBattle) return;
    const dtSec = Math.max(0, toNumber(dtMs, 0)) / 1000;
    if(dtSec <= 0) return;
    const recoverPerSec = Math.max(0, toNumber(BTTL_STA_RECOVERY_PER_SEC, 0));
    if(recoverPerSec <= 0) return;
    const recoverAmount = recoverPerSec * dtSec;
    for(const key of ["ally", "enemy"]){
      const actor = isRecord(ctxBattle[key]) ? ctxBattle[key] : null;
      if(!actor) continue;
      ensureBttlActorResourceState(actor);
      if(actor.sta >= actor.maxSta) continue;
      actor.sta = clamp(toNumber(actor.sta, 0) + recoverAmount, 0, actor.maxSta);
    }
  }

  function resolveBttlProjectileOutcome(ctxBattle, projectile, nowMs = performance.now(), forceMiss = false){
    if(!ctxBattle || !projectile || !projectile.alive) return;
    projectile.alive = false;
    const isShortAttack = Boolean(projectile.shortDirect) && normalizeBttlRangeStateId(projectile.rangeStateAtLaunch) === "short";
    if(isShortAttack){
      queueBttlShortGateSlashFx(
        ctxBattle,
        projectile.target === "ally" ? "ally" : "enemy",
        projectile.owner,
        Boolean(projectile.isHeavy),
        getBttlFieldGeometry(),
        nowMs
      );
    }
    if(!forceMiss && projectile.willHit){
      const targetKey = projectile.target === "ally" ? "ally" : "enemy";
      const target = ctxBattle[targetKey];
      const hpNow = Math.max(0, Math.floor(toNumber(target?.hp, 0)));
      let damage = Math.max(1, Math.floor(toNumber(projectile.damage, 1)));

      // Phase 1/2/3: ally-side reactive defense (dodge/parry/reflect). Heavy always goes through this gate.
      if(targetKey === "ally" && projectile.owner === "enemy"){
        const reaction = resolveBttlAllyReactiveDefense(ctxBattle, projectile, damage, nowMs);
        const allyAi = getBttlAllyAiState(ctxBattle, nowMs);
        if(reaction.outcome === "dodge"){
          allyAi.lastDodgeAtMs = toNumber(nowMs, performance.now());
          noteBttlShotOutcome(ctxBattle, projectile.owner, false, nowMs);
          pushBttlLog(ctxBattle, "DODGE");
          if(isShortAttack){
            applyBttlShortRangeRecoil(ctxBattle, nowMs, projectile.owner);
          }
          return;
        }
        if(reaction.outcome === "parry"){
          allyAi.lastParryAtMs = toNumber(nowMs, performance.now());
          ctxBattle.nextEnemyActAtMs = Math.max(
            toNumber(ctxBattle.nextEnemyActAtMs, nowMs),
            toNumber(nowMs, performance.now()) + BTTL_PARRY_ENEMY_DELAY_MS
          );
          noteBttlShotOutcome(ctxBattle, projectile.owner, false, nowMs);
          pushBttlLog(ctxBattle, "PARRY");
          applyBttlBreakDelta(ctxBattle, "enemy", BTTL_BREAK_GAIN_PARRY, nowMs, { forcePlusLog: true });
          if(isShortAttack){
            applyBttlShortRangeRecoil(ctxBattle, nowMs, projectile.owner);
          }
          return;
        }
        if(reaction.outcome === "reflect"){
          const now = toNumber(nowMs, performance.now());
          allyAi.lastParryAtMs = now;
          allyAi.lastReflectAtMs = now;
          noteBttlShotOutcome(ctxBattle, projectile.owner, false, nowMs);
          pushBttlLog(ctxBattle, "REFLECT");
          const enemy = ctxBattle.enemy;
          const enemyHpNow = Math.max(0, Math.floor(toNumber(enemy?.hp, 0)));
          const reflectedRaw = Math.max(1, Math.floor(toNumber(reaction.reflectDamage, damage)));
          const reflectedResolved = applyBttlActorDefendDamageMitigation(ctxBattle, "enemy", reflectedRaw);
          const hpLocked = BTTL_DEBUG_ENEMY_HP_LOCK;
          const reflectedApplied = hpLocked ? 0 : reflectedResolved.damage;
          enemy.hp = Math.max(0, enemyHpNow - reflectedApplied);
          enemy.hitFlashUntilMs = nowMs + BTTL_HIT_FLASH_MS;
          enemy.knockUntilMs = nowMs + BTTL_KNOCK_MS;
          enemy.knockDir = 1;
          noteBttlShotOutcome(ctxBattle, "ally", reflectedApplied > 0, nowMs);
          pushBttlLog(ctxBattle, getBttlOutcomeLogLine("ally", true, reflectedApplied));
          applyBttlBreakDelta(ctxBattle, "enemy", BTTL_BREAK_GAIN_REFLECT, nowMs, { forcePlusLog: true });
          if(isShortAttack){
            applyBttlShortRangeRecoil(ctxBattle, nowMs, projectile.owner);
          }
          return;
        }
        if(Boolean(projectile.isHeavy) && String(reaction.outcome || "") === "hit"){
          pushBttlLog(ctxBattle, "REACT BAD");
        }
        damage = Math.max(1, Math.floor(toNumber(reaction.damage, damage)));
      }
      const allyOverclockPenalty = (targetKey === "ally")
        ? getBttlActiveOverclock(ctxBattle, nowMs)
        : null;
      if(allyOverclockPenalty){
        damage = Math.max(1, Math.ceil(damage * clamp(toNumber(allyOverclockPenalty.damageTakenMult, 1), 1, 3)));
      }

      const dmgResolved = applyBttlActorDefendDamageMitigation(ctxBattle, targetKey, damage);
      const hpLocked = BTTL_DEBUG_ENEMY_HP_LOCK && targetKey === "enemy";
      const appliedDamage = hpLocked ? 0 : dmgResolved.damage;
      target.hp = Math.max(0, hpNow - appliedDamage);
      target.hitFlashUntilMs = nowMs + BTTL_HIT_FLASH_MS;
      if(normalizeBttlRangeStateId(projectile.rangeStateAtLaunch) === "short"){
        target.meleeHitFlashUntilMs = nowMs + BTTL_RANGE_SHORT_HIT_FX_MS;
      }
      target.knockUntilMs = nowMs + BTTL_KNOCK_MS;
      target.knockDir = targetKey === "enemy" ? 1 : -1;
      noteBttlShotOutcome(ctxBattle, projectile.owner, true, nowMs);
      if(dmgResolved.mitigated && targetKey === "enemy" && !hpLocked && BTTL_ENEMY_AI_AUDIT_LOG){
        pushBttlLog(ctxBattle, "EN DEF DMG↓");
      }
      pushBttlLog(ctxBattle, getBttlOutcomeLogLine(projectile.owner, true, appliedDamage));
      const breakBaseDamage = hpLocked ? toNumber(dmgResolved.damage, appliedDamage) : appliedDamage;
      let breakGain = getBttlBreakGainByHit(projectile, breakBaseDamage);
      if(targetKey === "ally" && allyOverclockPenalty){
        breakGain = Math.max(0, Math.round(
          breakGain * clamp(toNumber(allyOverclockPenalty.breakTakenMult, 1), 1, 3)
        ));
      }
      applyBttlBreakDelta(ctxBattle, targetKey, breakGain, nowMs);
      if(isShortAttack){
        applyBttlShortRangeRecoil(ctxBattle, nowMs, projectile.owner);
      }else{
        applyBttlRangedHitKnockback(ctxBattle, projectile.owner, nowMs);
      }
      return;
    }
    noteBttlShotOutcome(ctxBattle, projectile.owner, false, nowMs);
    pushBttlLog(ctxBattle, getBttlOutcomeLogLine(projectile.owner, false, 0));
    if(isShortAttack){
      applyBttlBreakDelta(ctxBattle, projectile.target === "enemy" ? "enemy" : "ally", BTTL_BREAK_GAIN_SHORT_PRESSURE_MISS, nowMs);
    }
    if(isShortAttack){
      applyBttlShortRangeRecoil(ctxBattle, nowMs, projectile.owner);
    }
  }

  function beginBttlRealtimeAttack(ctxBattle, attacker, nowMs = performance.now()){
    if(!ctxBattle) return null;
    const actorKey = attacker === "ally" ? "ally" : "enemy";
    const targetKey = actorKey === "enemy" ? "ally" : "enemy";
    const isEnemy = actorKey === "enemy";
    const activeSignal = (!isEnemy) ? getBttlActiveSignalBuff(ctxBattle, nowMs) : null;
    const hitChanceBase = clamp(
      toNumber(ctxBattle[actorKey]?.hitChance, 0.5),
      BTTL_HIT_MIN,
      BTTL_HIT_MAX
    );
    const hitChanceAdj = toNumber(activeSignal?.hitChanceAdj, 0);
    const hitChance = clamp(hitChanceBase + hitChanceAdj, BTTL_HIT_MIN, BTTL_HIT_MAX);
    const hit = Math.random() < hitChance;
    const launchHeavy = isEnemy && shouldLaunchEnemyHeavy(ctxBattle, nowMs);
    let damage = rollBttlDamage(actorKey, ctxBattle);
    if(launchHeavy){
      damage = Math.max(1, damage + BTTL_HEAVY_DAMAGE_BONUS);
    }
    const field = getBttlFieldGeometry();
    const projectile = createBttlProjectile(actorKey, field, ctxBattle);
    projectile.target = targetKey;
    projectile.willHit = hit;
    projectile.damage = damage;
    const launchRangeState = normalizeBttlRangeStateId(ctxBattle?.rangeState);
    projectile.rangeStateAtLaunch = launchRangeState;
    projectile.shortDirect = launchRangeState === "short";
    if(launchHeavy){
      projectile.isHeavy = true;
      projectile.speed = Math.max(24, Math.floor(toNumber(projectile.speed, BTTL_PROJECTILE_SPEED) * BTTL_HEAVY_SPEED_MULT));
    }
    if(projectile.shortDirect){
      startBttlShortLunge(ctxBattle, actorKey, nowMs);
      if(projectile.isHeavy){
        const teleMin = Math.max(120, Math.floor(toNumber(BTTL_SHORT_HEAVY_TELEGRAPH_MIN_MS, BTTL_HEAVY_TELEGRAPH_MIN_MS)));
        const teleMaxRaw = Math.floor(toNumber(BTTL_SHORT_HEAVY_TELEGRAPH_MAX_MS, BTTL_HEAVY_TELEGRAPH_MAX_MS));
        const teleMax = Math.max(teleMin + 40, teleMaxRaw);
        const teleRand = teleMin + Math.floor(Math.random() * Math.max(1, (teleMax - teleMin + 1)));
        projectile.impactAtMs = toNumber(nowMs, performance.now()) + teleRand;
      }else{
        projectile.impactAtMs = toNumber(nowMs, performance.now()) + Math.max(40, Math.floor(toNumber(BTTL_SHORT_DIRECT_IMPACT_DELAY_MS, 110)));
      }
    }else{
      projectile.impactAtMs = estimateProjectileImpactAtMs(projectile, field, nowMs);
    }
    if(launchHeavy){
      startBttlHeavyReactSession(ctxBattle, projectile, field, nowMs);
      pushBttlLog(ctxBattle, "HEAVY IN");
    }
    projectile.meta = activeSignal
      ? {
        cmd: normalizeBttlSignalCommand(activeSignal.cmd),
        tier: clamp(Math.floor(toNumber(activeSignal.tier, 0)), 0, 3),
        hitChanceAdj,
        intervalMult: toNumber(activeSignal.intervalMult, 1),
      }
      : null;
    const pool = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    pool.push(projectile);
    ctxBattle.projectiles = pool;
    return activeSignal;
  }

  function updateBttlRealtimeProjectiles(ctxBattle, nowMs = performance.now(), speedScale = 1){
    if(!ctxBattle) return;
    const list = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    if(list.length <= 0){
      ctxBattle.projectiles = [];
      return;
    }
    const field = getBttlFieldGeometry();
    for(const projectile of list){
      if(!projectile?.alive) continue;
      if(Boolean(projectile.shortDirect)){
        const impactAtMs = toNumber(projectile.impactAtMs, 0);
        if(impactAtMs > 0 && nowMs >= impactAtMs){
          resolveBttlProjectileOutcome(ctxBattle, projectile, nowMs, !projectile.willHit);
        }
        continue;
      }
      const dtSec = clamp((nowMs - toNumber(projectile.lastUpdateMs, nowMs)) / 1000, 0, 0.05);
      projectile.lastUpdateMs = nowMs;
      projectile.prevT = projectile.t;
      const scaledSpeed = Math.max(1, toNumber(projectile.speed, BTTL_PROJECTILE_SPEED) * clamp(toNumber(speedScale, 1), 0.4, 1.2));
      projectile.t = normalizeRingT(projectile.t + (scaledSpeed * dtSec), field.ringLen);
      projectile.distance = Math.max(0, toNumber(projectile.distance, 0)) + (scaledSpeed * dtSec);
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

  function updateBttlHeavyTelegraphState(ctxBattle, nowMs = performance.now(), speedScale = 1){
    if(!ctxBattle) return;
    const list = Array.isArray(ctxBattle.projectiles) ? ctxBattle.projectiles : [];
    const now = toNumber(nowMs, performance.now());
    const field = getBttlFieldGeometry();
    let nextImpactAtMs = 0;
    let nextProjectile = null;
    for(const projectile of list){
      if(!projectile?.alive) continue;
      if(projectile.owner !== "enemy" || projectile.target !== "ally" || !projectile.isHeavy) continue;
      const impactAtMs = Boolean(projectile.shortDirect)
        ? toNumber(projectile.impactAtMs, now)
        : estimateProjectileImpactAtMs(projectile, field, now, speedScale);
      projectile.impactAtMs = impactAtMs;
      if(nextImpactAtMs <= 0 || (impactAtMs > 0 && impactAtMs < nextImpactAtMs)){
        nextImpactAtMs = impactAtMs;
        nextProjectile = projectile;
      }
    }
    if(nextImpactAtMs > 0){
      ctxBattle.heavyImpactAtMs = nextImpactAtMs;
      ctxBattle.heavyInboundUntilMs = nextImpactAtMs;
      const session = isRecord(ctxBattle.heavyReactSession) ? ctxBattle.heavyReactSession : null;
      if(
        session &&
        !session.resolved &&
        nextProjectile &&
        toNumber(session.projectileId, -1) === toNumber(nextProjectile.id, -2)
      ){
        session.impactAtMs = nextImpactAtMs;
        session.ringVisibleAtMs = getBttlHeavyRingVisibleAtMs(session);
      }
      return;
    }
    if(now >= toNumber(ctxBattle.heavyInboundUntilMs, 0)){
      ctxBattle.heavyInboundStartedAtMs = 0;
      ctxBattle.heavyInboundUntilMs = 0;
      ctxBattle.heavyImpactAtMs = 0;
      ctxBattle.heavyIncomingActionHint = "";
    }
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
    if(!canConsumeBttlSignalCost(ctxBattle, commandId)){
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
    clearBttlSignalSuccessFx(ctxBattle);
    ctxBattle.signalFxBadShakeUntilMs = 0;
    ctxBattle.signalFxBadShakeDir = 0;
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
      wasInBand: false,
      wasInCrit: false,
      bandHitFlashUntilMs: 0,
      critHitFlashUntilMs: 0,
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
    triggerBttlSignalStopFx(ctxBattle, feedbackGrade, toNumber(nowMs, performance.now()));
    const cmd = normalizeBttlSignalCommand(session.cmd);
    const costApplied = consumeBttlSignalCost(ctxBattle, cmd);
    if(costApplied <= 0 && getBttlSignalCost(cmd) > 0){
      pushBttlLog(ctxBattle, "NO STA");
      ctxBattle.signalSession = null;
      ctxBattle.signalResult = {
        cmd,
        tier: 0,
        grade: "BAD",
        untilMs: toNumber(nowMs, performance.now()) + BTTL_SIGNAL_GAME_RESULT_HOLD_MS,
        buffDurationMs: 0,
        buffActive: false,
      };
      ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_GAME;
      return;
    }
    if(costApplied > 0){
      addBttlSignalUseMetric(ctxBattle, cmd, 1);
    }
    const tier = getBttlSignalTierFromGrade(feedbackGrade);
    const now = toNumber(nowMs, performance.now());
    const buffApplied = activateBttlSignalBuff(ctxBattle, cmd, tier, now);
    const cmdLabel = BTTL_SIGNAL_CMD_LOG_LABEL[cmd] || "SIG";
    const gradeLabel = feedbackGrade === "TIMEOUT" ? "BAD" : feedbackGrade;
    const gradeShort = getBttlSignalGradeShort(gradeLabel);
    pushBttlLog(ctxBattle, `${cmdLabel} ${gradeShort}`);
    if(buffApplied){
      const onLabel = cmd === "overclock"
        ? "OVRCLK ON"
        : `${cmdLabel} ON`;
      pushBttlLog(ctxBattle, onLabel);
      ctxBattle.lastSignalProc = {
        cmd,
        grade: String(gradeLabel || "BAD").trim().toUpperCase(),
        untilMs: now + BTTL_SIGNAL_PROC_FLASH_MS,
      };
    }
    ctxBattle.signalSession = null;
    ctxBattle.signalResult = {
      cmd,
      tier,
      grade: gradeLabel,
      untilMs: now + BTTL_SIGNAL_GAME_RESULT_HOLD_MS,
      buffDurationMs: Math.max(0, Math.floor(toNumber(buffApplied?.durationMs, 0))),
      buffActive: Boolean(buffApplied),
    };
    ctxBattle.signalGlobalCooldownUntilMs = now + BTTL_SIGNAL_GCD_MS;
    const byCmd = isRecord(ctxBattle.signalModeCooldownUntilByCmd)
      ? ctxBattle.signalModeCooldownUntilByCmd
      : {};
    byCmd[cmd] = now + getBttlSignalModeCooldownMs(cmd);
    ctxBattle.signalModeCooldownUntilByCmd = byCmd;
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_GAME;
  }

  function createBttlProjectile(owner, field, ctxBattle = null){
    const spawnOffset = 1;
    const startT = owner === "enemy"
      ? spawnOffset
      : field.topBattleLen + spawnOffset;
    const nowMs = performance.now();
    let projId = 0;
    if(isRecord(ctxBattle)){
      const seq = Math.max(1, Math.floor(toNumber(ctxBattle.projectileSeq, 1)));
      projId = seq;
      ctxBattle.projectileSeq = seq + 1;
    }
    return {
      id: projId,
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
      rangeStateAtLaunch: "mid",
      shortDirect: false,
      impactAtMs: 0,
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

  function createBttlContext(nowMs = performance.now(), options = {}){
    const hpMax = getRuntimeMax("hp", 100);
    const hpNow = clamp(Math.floor(getRuntimeStat("hp", hpMax)), 0, hpMax);
    const staminaMax = getRuntimeMax("stamina", 100);
    const staNow = clamp(Math.floor(getRuntimeStat("stamina", staminaMax)), 0, staminaMax);
    const ad = clamp(toNumber(state.detailed?.adIntegrity, 100), 0, 100);
    const sig = clamp(toNumber(state.detailed?.signalQuality, 100), 0, 100);
    const sync = resolveSyncRate(ad, sig);
    const allyHp = Math.max(0, hpNow);
    const enemyHp = clamp(
      Math.round(Math.max(1, allyHp) * BTTL_ENEMY_HP_RATIO),
      BTTL_ENEMY_HP_MIN,
      BTTL_ENEMY_HP_MAX
    );
    const enemySta = clamp(
      Math.round(Math.max(1, enemyHp) * 0.90),
      1,
      Math.max(1, enemyHp)
    );
    const introType = resolveBttlStartIntroType(options, enemyHp);
    const introDurationMs = getBttlStartIntroDurationMs(introType);
    const introStartedAtMs = toNumber(nowMs, performance.now());
    const introUntilMs = introStartedAtMs + introDurationMs;
    const ctxBattle = {
      phase: BTTL_STATE.INIT,
      phaseStartedAtMs: toNumber(nowMs, performance.now()),
      startIntroType: introType,
      startIntroActive: true,
      startIntroStartedAtMs: introStartedAtMs,
      startIntroDurationMs: introDurationMs,
      startIntroUntilMs: introUntilMs,
      endOutroType: "",
      endOutroActive: false,
      endOutroStartedAtMs: 0,
      endOutroDurationMs: 0,
      endOutroUntilMs: 0,
      endOutroHandoffDone: false,
      turn: 0,
      lastTickAtMs: toNumber(nowMs, performance.now()),
      actorIndex: 0, // 0: enemy, 1: ally
      rightPaneMode: BTTL_RIGHTPANE_MODE.SIGNAL_MENU,
      signalMenuIndex: 0,
      signalSession: null,
      signalResult: null,
      signalGlobalCooldownUntilMs: 0,
      signalModeCooldownUntilByCmd: {},
      signalBuff: {
        cmd: "",
        activeUntilMs: 0,
        startedAtMs: 0,
        tier: 0,
        hitChanceAdj: 0,
        intervalMult: 1,
        approachMult: 1,
        knockbackResist: 0,
        damageTakenMult: 1,
        breakTakenMult: 1,
      },
      lastSignalProc: null,
      signalFxOkCenterUntilMs: 0,
      signalFxSuccessCenterUntilMs: 0,
      signalFxSuccessOuterRippleUntilMs: 0,
      signalFxBadShakeUntilMs: 0,
      signalFxBadShakeDir: 0,
      heavyInboundStartedAtMs: 0,
      heavyInboundUntilMs: 0,
      heavyImpactAtMs: 0,
      heavyIncomingActionHint: "",
      heavyReactSession: null,
      enemyAi: createBttlEnemyAiState(nowMs),
      allyAi: createBttlAllyAiState(nowMs),
      enemyHeavyReadyAtMs: toNumber(nowMs, performance.now()) + Math.round(getBttlHeavyTuning().cooldownMs * getBttlHeavyTuning().initialReadyRatio),
      projectileSeq: 1,
      projectiles: [],
      shortGateSlashFx: [],
      enemyRangePos: BTTL_RANGE_INIT_ENEMY_POS,
      allyRangePos: BTTL_RANGE_INIT_ALLY_POS,
      enemyRangeVisualPos: BTTL_RANGE_INIT_ENEMY_POS,
      allyRangeVisualPos: BTTL_RANGE_INIT_ALLY_POS,
      rangeDistance: Math.abs(BTTL_RANGE_INIT_ALLY_POS - BTTL_RANGE_INIT_ENEMY_POS),
      rangeMidpoint: (BTTL_RANGE_INIT_ALLY_POS + BTTL_RANGE_INIT_ENEMY_POS) * 0.5,
      rangeState: getBttlRangeStateByDistance(Math.abs(BTTL_RANGE_INIT_ALLY_POS - BTTL_RANGE_INIT_ENEMY_POS)),
      enemyRangeIntent: BTTL_RANGE_INTENT.HOLD,
      allyRangeIntent: BTTL_RANGE_INTENT.HOLD,
      rangeLastUpdateAtMs: toNumber(nowMs, performance.now()),
      rangeLastIntentLogAtMs: 0,
      rangeLastStateLogAtMs: 0,
      rangeMarkerShakeStartedAtMs: 0,
      rangeMarkerShakeUntilMs: 0,
      nextEnemyActAtMs: introUntilMs + 220,
      nextAllyActAtMs: introUntilMs + 120,
      ally: {
        hp: allyHp,
        maxHp: Math.max(1, hpMax),
        sta: staNow,
        maxSta: Math.max(1, staminaMax),
        sig,
        sync,
        breakValue: 0,
        breakMax: BTTL_BREAK_MAX,
        isBreak: false,
        breakUntilMs: 0,
        breakRecoverResumeAtMs: 0,
        breakHighLogged: false,
        breakLastPlusLogAtMs: 0,
        hitChance: computeBttlHitChance(sig, sync),
        hitFlashUntilMs: 0,
        meleeHitFlashUntilMs: 0,
        knockUntilMs: 0,
        knockDir: -1,
        lungeStartedAtMs: 0,
        lungeUntilMs: 0,
        lungeDir: 0,
      },
      enemy: {
        hp: enemyHp,
        maxHp: enemyHp,
        sta: enemySta,
        maxSta: enemySta,
        sig: BTTL_ENEMY_SIG,
        sync: BTTL_ENEMY_SYNC,
        breakValue: 0,
        breakMax: BTTL_BREAK_MAX,
        isBreak: false,
        breakUntilMs: 0,
        breakRecoverResumeAtMs: 0,
        breakHighLogged: false,
        breakLastPlusLogAtMs: 0,
        hitChance: computeBttlHitChance(BTTL_ENEMY_SIG, BTTL_ENEMY_SYNC),
        hitFlashUntilMs: 0,
        meleeHitFlashUntilMs: 0,
        knockUntilMs: 0,
        knockDir: 1,
        lungeStartedAtMs: 0,
        lungeUntilMs: 0,
        lungeDir: 0,
      },
      logs: [],
      action: null,
      result: null,
      resultFlavor: "",
      resultMetrics: createBttlResultMetrics(nowMs),
      resultMetricsCommitted: false,
      settled: false,
    };
    pushBttlLog(ctxBattle, "BTTL START");
    pushBttlLog(ctxBattle, introType === BTTL_START_INTRO_TYPE.WARNING ? "WARNING!!" : "ENCOUNT");
    if(allyHp <= 0){
      pushBttlLog(ctxBattle, "LOSE");
      ctxBattle.result = "LOSE";
      ctxBattle.resultFlavor = "戦闘不能。出力を維持できない。";
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
    pushBttlLog(ctxBattle, normalized);
    commitBttlResultMetrics(ctxBattle, normalized, nowMs);

    ctxBattle.settled = true;
    startBttlEndOutro(
      ctxBattle,
      normalized === "WIN" ? BTTL_END_OUTRO_TYPE.WIN : BTTL_END_OUTRO_TYPE.LOST,
      nowMs
    );
  }

  function abortBttlBattle(ctxBattle, nowMs = performance.now()){
    if(!ctxBattle || ctxBattle.phase === BTTL_STATE.RESULT || ctxBattle.phase === BTTL_STATE.OUTRO) return;
    ctxBattle.projectiles = [];
    ctxBattle.signalSession = null;
    ctxBattle.signalResult = null;
    ctxBattle.lastSignalProc = null;
    clearBttlSignalBuffState(ctxBattle);
    ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
    ctxBattle.result = "ABORT";
    ctxBattle.resultFlavor = "手動中断。戦闘を終了した。";
    pushBttlLog(ctxBattle, "ABORT");
    commitBttlResultMetrics(ctxBattle, "ABORT", nowMs);
    ctxBattle.settled = true;
    startBttlEndOutro(ctxBattle, BTTL_END_OUTRO_TYPE.LOST, nowMs);
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
    uiState.bttlResultReveal = null;
    setBttlRevealOverlayVisual(0, "black");
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
    ensureBttlActorResourceState(ctxBattle.ally);
    ensureBttlActorResourceState(ctxBattle.enemy);

    if(ctxBattle.phase === BTTL_STATE.INIT){
      if(isBttlStartIntroActive(ctxBattle, nowMs)){
        return;
      }
      const introUntilMs = toNumber(ctxBattle.startIntroUntilMs, 0);
      const initFallbackUntilMs = toNumber(ctxBattle.phaseStartedAtMs, nowMs) + BTTL_INIT_MS;
      const readyAtMs = Math.max(introUntilMs, initFallbackUntilMs);
      if(nowMs >= readyAtMs){
        ctxBattle.startIntroActive = false;
        ctxBattle.phase = BTTL_STATE.TURN;
        ctxBattle.phaseStartedAtMs = nowMs;
        ctxBattle.turn = 0;
      }
      return;
    }

    if(ctxBattle.phase === BTTL_STATE.OUTRO){
      const elapsed = Math.max(0, toNumber(nowMs, performance.now()) - toNumber(ctxBattle.endOutroStartedAtMs, nowMs));
      const outroType = normalizeBttlEndOutroType(ctxBattle.endOutroType);
      const timing = getBttlEndOutroTiming(outroType);
      if(!Boolean(ctxBattle.endOutroHandoffDone) && elapsed >= toNumber(timing.handoffAt, Number.MAX_SAFE_INTEGER)){
        ctxBattle.endOutroHandoffDone = true;
        const initialAlpha = clamp(computeBttlEndOutroHandoffAlpha(outroType, elapsed, timing), 0.55, 1);
        uiState.bttlResultReveal = {
          mode: outroType === BTTL_END_OUTRO_TYPE.WIN ? "white" : "black",
          startedAtMs: toNumber(nowMs, performance.now()),
          durationMs: Math.max(120, Math.floor(toNumber(timing.fadeOutMs, 360))),
          initialAlpha,
        };
        ctxBattle.endOutroActive = false;
        ctxBattle.phase = BTTL_STATE.RESULT;
        ctxBattle.phaseStartedAtMs = nowMs;
        openBttlResultLog(ctxBattle);
        return;
      }
      if(isBttlEndOutroActive(ctxBattle, nowMs)){
        return;
      }
      // Safety fallback: if handoff somehow didn't happen, force RESULT transition.
      ctxBattle.endOutroActive = false;
      ctxBattle.phase = BTTL_STATE.RESULT;
      ctxBattle.phaseStartedAtMs = nowMs;
      openBttlResultLog(ctxBattle);
      return;
    }

    if(ctxBattle.phase === BTTL_STATE.TURN){
      const turnDeltaMs = clamp(
        toNumber(nowMs, performance.now()) - toNumber(ctxBattle.lastTickAtMs, nowMs),
        0,
        80
      );
      ctxBattle.lastTickAtMs = toNumber(nowMs, performance.now());
      const heavyWindowActive = isBttlHeavyReactionWindowActive(ctxBattle, nowMs);
      const timeScale = heavyWindowActive ? BTTL_HEAVY_REACT_SLOW_SCALE : 1;

      const paneMode = String(ctxBattle.rightPaneMode || BTTL_RIGHTPANE_MODE.SIGNAL_MENU);
      if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
        if(ctxBattle.signalSession){
          if(heavyWindowActive){
            const delayMs = turnDeltaMs * (1 - timeScale);
            ctxBattle.signalSession.startedAtMs = toNumber(ctxBattle.signalSession.startedAtMs, nowMs) + delayMs;
          }
          const elapsed = nowMs - toNumber(ctxBattle.signalSession.startedAtMs, nowMs);
          if(elapsed >= BTTL_SIGNAL_GAME_MAX_MS){
            finishBttlSignalGame(ctxBattle, "FAIL", nowMs, { timeout: true });
          }
        }else{
          const holdUntil = toNumber(ctxBattle.signalResult?.untilMs, 0);
          if(heavyWindowActive && holdUntil > 0){
            const delayMs = turnDeltaMs * (1 - timeScale);
            ctxBattle.signalResult.untilMs = holdUntil + delayMs;
          }
          if(holdUntil > 0 && nowMs >= holdUntil){
            ctxBattle.signalResult = null;
            clearBttlSignalSuccessFx(ctxBattle);
            ctxBattle.signalFxBadShakeUntilMs = 0;
            ctxBattle.signalFxBadShakeDir = 0;
            ctxBattle.rightPaneMode = BTTL_RIGHTPANE_MODE.SIGNAL_MENU;
          }
        }
      }
      if(heavyWindowActive){
        const delayMs = turnDeltaMs * (1 - timeScale);
        ctxBattle.nextEnemyActAtMs = toNumber(ctxBattle.nextEnemyActAtMs, nowMs) + delayMs;
        ctxBattle.nextAllyActAtMs = toNumber(ctxBattle.nextAllyActAtMs, nowMs) + delayMs;
      }
      updateBttlRealtimeProjectiles(ctxBattle, nowMs, timeScale);
      updateBttlHeavyTelegraphState(ctxBattle, nowMs, timeScale);
      updateBttlHeavyReactionSession(ctxBattle, nowMs);
      updateBttlEnemyActionAi(ctxBattle, nowMs);
      updateBttlAllyActionAi(ctxBattle, nowMs);
      updateBttlRangeRealtime(ctxBattle, nowMs, timeScale);
      updateBttlStaminaState(ctxBattle, turnDeltaMs * timeScale);
      updateBttlBreakState(ctxBattle, nowMs, turnDeltaMs * timeScale);

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
        const enemyInterval = computeBttlAttackIntervalMs(ctxBattle, "enemy", nowMs);
        ctxBattle.nextEnemyActAtMs = nowMs + enemyInterval;
        ctxBattle.turn += 1;
      }
      if(nowMs >= toNumber(ctxBattle.nextAllyActAtMs, nowMs)){
        beginBttlRealtimeAttack(ctxBattle, "ally", nowMs);
        const allyInterval = computeBttlAttackIntervalMs(ctxBattle, "ally", nowMs);
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
    drawText(headerX, headerY, "OBS LOG", { scale: 1, color: "rgba(14,20,15,0.82)" });
    ctx.save();
    ctx.strokeStyle = "rgba(14,20,15,0.30)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightInner.x + 2, rightInner.y + 13.5);
    ctx.lineTo(rightInner.x + rightInner.w - 3, rightInner.y + 13.5);
    ctx.stroke();
    ctx.restore();
    const allLogs = Array.isArray(ctxBattle.logs) ? ctxBattle.logs : [];
    const lineGap = 7;
    const logTopY = rightInner.y + 16;
    const maxLines = Math.max(1, Math.min(BTTL_LOG_DRAW_LINES, Math.floor((rightInner.h - 18) / lineGap)));
    const logLines = allLogs.slice(-maxLines);
    const isLogOverflow = allLogs.length > maxLines;
    if(logLines.length <= 0){
      drawText(right.x + 8, logTopY, "---", { scale: 1, color: "rgba(14,20,15,0.52)" });
      return;
    }
    for(let i = 0; i < logLines.length; i++){
      const source = String(logLines[i] || "").trim();
      const fitted = fitTrnRightPaneText(source, right.w - 16, { scale: 1 });
      const color = (isLogOverflow && i === 0) ? "rgba(14,20,15,0.46)" : "rgba(14,20,15,0.90)";
      drawText(right.x + 8, logTopY + (i * lineGap), fitted, { scale: 1, color });
    }
  }

  function getBttlSignalCommandLabelJa(cmd){
    const id = normalizeBttlSignalCommand(cmd);
    if(id === "boost") return "強化同期";
    if(id === "stabilize") return "安定化";
    if(id === "overclock") return "過駆動";
    return "再較正";
  }

  function getBttlSignalGradeJa(grade){
    const g = String(grade || "").trim().toUpperCase();
    if(g === "SUCCESS") return "大成功";
    if(g === "OK") return "成功";
    if(g === "NEAR") return "惜しい";
    if(g === "TIMEOUT") return "時間切れ";
    return "失敗";
  }

  function toBttlJpLogLine(rawText){
    const source = String(rawText ?? "").trim();
    if(source.length <= 0) return "";
    const repeatMatch = source.match(/\sx(\d+)$/i);
    const repeatCount = repeatMatch ? clamp(Math.floor(toNumber(repeatMatch[1], 1)), 1, 99) : 1;
    const base = repeatMatch ? source.slice(0, repeatMatch.index).trim() : source;
    let out = "";
    if(base === "BTTL START"){
      out = "戦闘開始";
    }else if(base === "APPROACH"){
      out = "間合いを詰める";
    }else if(base === "RETREAT"){
      out = "距離を取る";
    }else if(base === "HOLD"){
      out = "間合いを維持";
    }else if(base === "RANGE SHORT"){
      out = "レンジ SHORT";
    }else if(base === "RANGE MID"){
      out = "レンジ MID";
    }else if(base === "RANGE LONG"){
      out = "レンジ LONG";
    }else if(base === "ENE SHOT" || base === "EN SHOT"){
      out = "敵が射出";
    }else if(base === "YOU SHOT" || base === "AL SHOT"){
      out = "味方が射出";
    }else if(base === "ENE MISS" || base === "EN MISS"){
      out = "敵の攻撃は外れた";
    }else if(base === "YOU MISS" || base === "AL MISS"){
      out = "味方の攻撃は外れた";
    }else if(base === "NO STA"){
      out = "スタミナ不足";
    }else if(base === "ABORT"){
      out = "手動中断";
    }else if(base === "WIN"){
      out = "敵を撃破";
    }else if(base === "LOSE"){
      out = "味方が停止";
    }else if(base === "EN BRK+"){
      out = "敵BREAK上昇";
    }else if(base === "AL BRK+"){
      out = "味方BREAK上昇";
    }else if(base === "EN BRK HIGH"){
      out = "敵BREAK高";
    }else if(base === "AL BRK HIGH"){
      out = "味方BREAK高";
    }else if(base === "EN BREAK"){
      out = "敵BREAK発生";
    }else if(base === "AL BREAK"){
      out = "味方BREAK発生";
    }else if(base === "EN RECOVER"){
      out = "敵BREAK回復";
    }else if(base === "AL RECOVER"){
      out = "味方BREAK回復";
    }else{
      let m = base.match(/^(?:ENE|EN) DMG (\d+)$/);
      if(m){
        out = `味方に ${Math.max(0, Math.floor(toNumber(m[1], 0)))} ダメージ`;
      }else{
        m = base.match(/^(?:YOU|AL) DMG (\d+)$/);
        if(m){
          out = `敵に ${Math.max(0, Math.floor(toNumber(m[1], 0)))} ダメージ`;
        }else{
          m = base.match(/^(BST|STB|CAL|OVC)\s+(BAD|NEAR|OK|SUC)$/);
          if(m){
            let cmd = "calibrate";
            if(m[1] === "BST"){
              cmd = "boost";
            }else if(m[1] === "STB"){
              cmd = "stabilize";
            }else if(m[1] === "OVC"){
              cmd = "overclock";
            }
            const grade = m[2] === "SUC" ? "SUCCESS" : m[2];
            out = `${getBttlSignalCommandLabelJa(cmd)} ${getBttlSignalGradeJa(grade)}`;
          }else{
            if(base === "BST ON"){
              out = "強化同期 起動";
            }else if(base === "STB ON"){
              out = "安定化 起動";
            }else if(base === "CAL ON"){
              out = "再較正 起動";
            }else if(base === "OVRCLK ON"){
              out = "過駆動 起動";
            }else{
              out = base;
            }
          }
        }
      }
    }
    if(repeatCount > 1){
      out += ` x${repeatCount}`;
    }
    return out;
  }

  function stripBttlLogRepeatSuffix(rawText){
    const source = String(rawText ?? "").trim();
    if(source.length <= 0) return "";
    const m = source.match(/^(.*)\sx\d+$/i);
    return m ? String(m[1] || "").trim() : source;
  }

  function getBttlBottomNarrativeState(ctxBattle){
    if(!ctxBattle) return null;
    if(!isRecord(ctxBattle.bottomNarrative)){
      ctxBattle.bottomNarrative = {
        lines: [],
        lastText: "",
        lastCategory: "",
        lastKind: "",
        lastPushAtMs: 0,
        lastSummaryAtMs: 0,
        lastSeenLogBase: "",
        lastEnemyAction: "",
        lastKindAtByKind: {},
      };
    }
    return ctxBattle.bottomNarrative;
  }

  function pickBttlBottomNarrativeText(kind, exclude = ""){
    const list = BTTL_BOTTOM_NARRATIVE_LINES_BY_KIND[String(kind || "")] || null;
    if(!Array.isArray(list) || list.length <= 0){
      return "";
    }
    const cleanExclude = String(exclude || "").trim();
    const choices = cleanExclude.length > 0
      ? list.filter((line) => String(line || "").trim() !== cleanExclude)
      : list.slice();
    const pool = choices.length > 0 ? choices : list;
    const idx = Math.floor(Math.random() * pool.length);
    return String(pool[idx] || pool[0] || "").trim();
  }

  function pushBttlBottomNarrativeLine(ctxBattle, kind, category, nowMs = performance.now(), options = {}){
    const memory = getBttlBottomNarrativeState(ctxBattle);
    if(!memory) return false;
    const now = toNumber(nowMs, performance.now());
    const priority = Math.floor(toNumber(options.priority, 0));
    const force = Boolean(options.force);
    const safeKind = String(kind || "").trim();
    const safeCategory = String(category || "").trim();
    let text = String(options.text || pickBttlBottomNarrativeText(safeKind, memory.lastText)).trim();
    if(text.length <= 0){
      return false;
    }
    const elapsed = now - toNumber(memory.lastPushAtMs, 0);
    const baseMinInterval = priority >= 95
      ? Math.max(420, Math.floor(BTTL_BOTTOM_NARRATIVE_IMPORTANT_INTERVAL_MS * 0.66))
      : (priority >= 80 ? BTTL_BOTTOM_NARRATIVE_IMPORTANT_INTERVAL_MS : BTTL_BOTTOM_NARRATIVE_MIN_INTERVAL_MS);
    const categoryMinInterval = Math.max(
      0,
      toNumber(BTTL_BOTTOM_NARRATIVE_CATEGORY_MIN_INTERVAL_MS[safeCategory], 0)
    );
    const minInterval = Math.max(baseMinInterval, categoryMinInterval);
    if(!force && elapsed < minInterval){
      return false;
    }
    const kindCooldown = Math.max(
      minInterval,
      toNumber(BTTL_BOTTOM_NARRATIVE_KIND_COOLDOWN_MS[safeCategory], minInterval + 900)
    );
    const lastKindAt = Math.max(
      0,
      toNumber(isRecord(memory.lastKindAtByKind) ? memory.lastKindAtByKind[safeKind] : 0, 0)
    );
    if(!force && safeKind.length > 0 && lastKindAt > 0 && (now - lastKindAt) < kindCooldown){
      return false;
    }
    if(
      !force &&
      text === String(memory.lastText || "").trim() &&
      elapsed < BTTL_BOTTOM_NARRATIVE_DUPLICATE_BLOCK_MS
    ){
      return false;
    }
    const lines = Array.isArray(memory.lines) ? memory.lines.slice() : [];
    lines.push({
      text,
      category: safeCategory,
      kind: safeKind,
      atMs: now,
    });
    while(lines.length > BTTL_BOTTOM_JP_MAX_LINES){
      lines.shift();
    }
    memory.lines = lines;
    memory.lastText = text;
    memory.lastCategory = safeCategory;
    memory.lastKind = safeKind;
    memory.lastPushAtMs = now;
    if(!isRecord(memory.lastKindAtByKind)){
      memory.lastKindAtByKind = {};
    }
    if(safeKind.length > 0){
      memory.lastKindAtByKind[safeKind] = now;
    }
    return true;
  }

  function parseBttlBottomNarrativeEvent(rawText){
    const base = stripBttlLogRepeatSuffix(rawText);
    if(base.length <= 0) return null;
    if(base === "BTTL START"){
      return { kind: "atmosphere_start", category: "atmosphere", priority: 95 };
    }
    if(base === "HEAVY IN"){
      return { kind: "alert_heavy", category: "alert", priority: 100 };
    }
    if(base === "APPROACH"){
      return { kind: "range_approach", category: "hint", priority: 78 };
    }
    if(base === "RETREAT"){
      return { kind: "range_retreat", category: "hint", priority: 78 };
    }
    if(base === "HOLD"){
      return { kind: "range_hold", category: "hint", priority: 74 };
    }
    if(base === "RANGE SHORT"){
      return { kind: "range_short", category: "flow", priority: 84 };
    }
    if(base === "RANGE MID"){
      return { kind: "range_mid", category: "flow", priority: 78 };
    }
    if(base === "RANGE LONG"){
      return { kind: "range_long", category: "flow", priority: 80 };
    }
    if(base === "DODGE"){
      return { kind: "alert_dodge", category: "alert", priority: 100 };
    }
    if(base === "PARRY"){
      return { kind: "alert_parry", category: "alert", priority: 100 };
    }
    if(base === "REFLECT"){
      return { kind: "alert_reflect", category: "alert", priority: 100 };
    }
    if(base === "REACT BAD"){
      return { kind: "alert_bad", category: "alert", priority: 96 };
    }
    if(base === "EN BRK+"){
      return { kind: "break_rise_enemy", category: "flow", priority: 78 };
    }
    if(base === "AL BRK+"){
      return { kind: "break_rise_ally", category: "flow", priority: 82 };
    }
    if(base === "EN BRK HIGH"){
      return { kind: "break_high_enemy", category: "alert", priority: 92 };
    }
    if(base === "AL BRK HIGH"){
      return { kind: "break_high_ally", category: "alert", priority: 94 };
    }
    if(base === "EN BREAK"){
      return { kind: "break_enemy", category: "alert", priority: 100 };
    }
    if(base === "AL BREAK"){
      return { kind: "break_ally", category: "alert", priority: 100 };
    }
    if(base === "EN RECOVER"){
      return { kind: "break_recover_enemy", category: "flow", priority: 86 };
    }
    if(base === "AL RECOVER"){
      return { kind: "break_recover_ally", category: "flow", priority: 88 };
    }
    if(base === "EN DEF" || base === "ENE DEF" || base === "EN DEF DMG↓"){
      return { kind: "hint_enemy_defend", category: "hint", priority: 88 };
    }
    if(base === "ENE MISS" || base === "EN MISS"){
      return { kind: "cause_ene_miss", category: "cause", priority: 66 };
    }
    if(base === "YOU MISS" || base === "AL MISS"){
      return { kind: "cause_you_miss", category: "cause", priority: 72 };
    }
    let m = base.match(/^(?:YOU|AL) DMG (\d+)$/);
    if(m){
      return { kind: "cause_you_dmg", category: "cause", priority: 70 };
    }
    m = base.match(/^(?:ENE|EN) DMG (\d+)$/);
    if(m){
      return { kind: "cause_ene_dmg", category: "cause", priority: 74 };
    }
    m = base.match(/^(BST|STB|CAL|OVC)\s+(BAD|NEAR|OK|SUC)$/);
    if(m){
      const cmd = m[1];
      const grade = m[2];
      if(cmd === "OVC"){
        if(grade === "BAD" || grade === "NEAR"){
          return { kind: "signal_ovc_bad", category: "signal", priority: 84 };
        }
        return { kind: "signal_ovc_ok", category: "signal", priority: 90 };
      }
      if(grade === "BAD" || grade === "NEAR"){
        return { kind: "signal_bad", category: "signal", priority: 84 };
      }
      if(cmd === "BST"){
        return { kind: "signal_bst_ok", category: "signal", priority: 86 };
      }
      if(cmd === "STB"){
        return { kind: "signal_stb_ok", category: "signal", priority: 86 };
      }
      return { kind: "signal_cal_ok", category: "signal", priority: 86 };
    }
    if(base === "OVRCLK ON"){
      return { kind: "signal_ovc_ok", category: "signal", priority: 92 };
    }
    if(base === "BST ON"){
      return { kind: "signal_bst_ok", category: "signal", priority: 90 };
    }
    if(base === "STB ON"){
      return { kind: "signal_stb_ok", category: "signal", priority: 90 };
    }
    if(base === "CAL ON"){
      return { kind: "signal_cal_ok", category: "signal", priority: 90 };
    }
    if(base === "NO STA"){
      return {
        kind: "atmosphere_idle",
        category: "atmosphere",
        priority: 96,
        text: "エネルギー切れ。休息が必要。",
      };
    }
    if(base === "ABORT"){
      return {
        kind: "atmosphere_idle",
        category: "atmosphere",
        priority: 90,
        text: "観測中断。記録を保存した。",
      };
    }
    return null;
  }

  function maybePushBttlBottomSummary(ctxBattle, nowMs = performance.now()){
    const memory = getBttlBottomNarrativeState(ctxBattle);
    if(!memory) return;
    const now = toNumber(nowMs, performance.now());
    const elapsedSummary = now - toNumber(memory.lastSummaryAtMs, 0);
    if(elapsedSummary < BTTL_BOTTOM_NARRATIVE_SUMMARY_INTERVAL_MS){
      return;
    }
    const elapsedPush = now - toNumber(memory.lastPushAtMs, 0);
    if(elapsedPush < BTTL_BOTTOM_NARRATIVE_MIN_INTERVAL_MS){
      return;
    }
    const allyHp = Math.max(0, toNumber(ctxBattle?.ally?.hp, 0));
    const allyMax = Math.max(1, toNumber(ctxBattle?.ally?.maxHp, 1));
    const enemyHp = Math.max(0, toNumber(ctxBattle?.enemy?.hp, 0));
    const enemyMax = Math.max(1, toNumber(ctxBattle?.enemy?.maxHp, 1));
    const allyRatio = clamp(allyHp / allyMax, 0, 1);
    const enemyRatio = clamp(enemyHp / enemyMax, 0, 1);
    const ai = getBttlEnemyAiState(ctxBattle, now);
    const allyHitRate = getBttlRecentHitRate(ai.recentAllyShots);
    const enemyHitRate = getBttlRecentHitRate(ai.recentEnemyShots);
    let kind = "flow_even";
    if((allyRatio - enemyRatio) > 0.16 && allyHitRate >= (enemyHitRate - 0.05)){
      kind = "flow_advantage";
    }else if((enemyRatio - allyRatio) > 0.16 || enemyHitRate >= (allyHitRate + 0.24)){
      kind = "flow_pressure";
    }
    if(pushBttlBottomNarrativeLine(ctxBattle, kind, "flow", now, { priority: 42 })){
      memory.lastSummaryAtMs = now;
    }
  }

  function updateBttlBottomNarrative(ctxBattle, nowMs = performance.now()){
    const memory = getBttlBottomNarrativeState(ctxBattle);
    if(!memory) return;
    const now = toNumber(nowMs, performance.now());
    const actionId = getBttlEnemyActionId(ctxBattle?.enemyAi?.currentAction);
    if(actionId !== String(memory.lastEnemyAction || "")){
      memory.lastEnemyAction = actionId;
      if(actionId === BTTL_ENEMY_ACTION.DEFEND){
        pushBttlBottomNarrativeLine(ctxBattle, "hint_enemy_defend", "hint", now, { priority: 88 });
      }
    }
    const allLogs = Array.isArray(ctxBattle?.logs) ? ctxBattle.logs : [];
    const latestBase = stripBttlLogRepeatSuffix(allLogs[allLogs.length - 1] || "");
    if(latestBase.length > 0 && latestBase !== String(memory.lastSeenLogBase || "")){
      memory.lastSeenLogBase = latestBase;
      const evt = parseBttlBottomNarrativeEvent(latestBase);
      if(evt){
        pushBttlBottomNarrativeLine(ctxBattle, evt.kind, evt.category, now, {
          priority: evt.priority,
          text: evt.text,
        });
      }
    }
    maybePushBttlBottomSummary(ctxBattle, now);
    if(!Array.isArray(memory.lines) || memory.lines.length <= 0){
      pushBttlBottomNarrativeLine(ctxBattle, "atmosphere_start", "atmosphere", now, {
        priority: 95,
        force: true,
      });
    }
  }

  function getBttlBottomNarrativeLines(ctxBattle, paneMode, nowMs = performance.now()){
    const mode = String(paneMode || "");
    if(mode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
      if(isBttlHeavyReactionWindowActive(ctxBattle, nowMs)){
        return [
          "重攻撃接近  Cで反応",
          "他操作は一時停止",
        ];
      }
      if(ctxBattle?.signalSession){
        const cmdJa = getBttlSignalCommandLabelJa(ctxBattle.signalSession.cmd);
        return [
          `${cmdJa} 調整中`,
          "Aで停止  Bで中断",
        ];
      }
      if(ctxBattle?.signalResult){
        const resultJa = getBttlSignalGradeJa(ctxBattle.signalResult.grade);
        const resultCmd = normalizeBttlSignalCommand(ctxBattle.signalResult.cmd);
        const active = Boolean(ctxBattle.signalResult.buffActive);
        const durationMs = Math.max(0, Math.floor(toNumber(ctxBattle.signalResult.buffDurationMs, 0)));
        const secText = (durationMs > 0) ? `${(durationMs / 1000).toFixed(1)}s` : "0.0s";
        if(!active){
          if(resultCmd === "overclock"){
            return [
              `介入結果 ${resultJa}`,
              "過駆動は不発",
            ];
          }
          return [
            `介入結果 ${resultJa}`,
            "補正は不成立",
          ];
        }
        if(resultCmd === "boost"){
          return [
            `介入結果 ${resultJa}`,
            "強化同期 起動",
            `攻勢補正 ${secText}`,
          ];
        }
        if(resultCmd === "stabilize"){
          return [
            `介入結果 ${resultJa}`,
            "安定化 起動",
            `収束補正 ${secText}`,
          ];
        }
        if(resultCmd === "overclock"){
          return [
            `介入結果 ${resultJa}`,
            "過駆動 起動",
            `接近補助 ${secText}`,
          ];
        }
        return [
          `介入結果 ${resultJa}`,
          "再較正 起動",
          `汎用補正 ${secText}`,
        ];
      }
    }
    updateBttlBottomNarrative(ctxBattle, nowMs);
    const memory = getBttlBottomNarrativeState(ctxBattle);
    const rows = Array.isArray(memory?.lines) ? memory.lines : [];
    const out = rows
      .map((row) => String(row?.text || "").trim())
      .filter((line) => line.length > 0);
    if(out.length <= 0){
      return ["観測中...", "戦況を解析している。"];
    }
    return out.slice(-BTTL_BOTTOM_NARRATIVE_DRAW_LINES);
  }

  function drawBttlBottomPane(ctxBattle, bottom, paneMode, nowMs = performance.now()){
    const inner = {
      x: bottom.x + 4,
      y: bottom.y + 4,
      w: Math.max(16, bottom.w - 8),
      h: Math.max(20, bottom.h - 8),
    };
    drawBox(inner.x, inner.y, inner.w, inner.h);
    const lines = getBttlBottomNarrativeLines(ctxBattle, paneMode, nowMs).slice(-BTTL_BOTTOM_JP_MAX_LINES);
    const jpLines = lines.map((line) => fitJaText(line, inner.w - 6, 10));
    showBttlBottomPaneOverlay(jpLines, {
      x: inner.x + 2,
      y: inner.y + 2,
      w: Math.max(8, inner.w - 4),
      h: Math.max(8, inner.h - 4),
    });
    if(overlayBottomPane){
      overlayBottomPane.style.opacity = isBttlHeavyReactionWindowActive(ctxBattle, nowMs) ? "0.62" : "1";
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
    const isMiniOverflow = allLogs.length > maxMiniLines;
    if(miniLogs.length <= 0){
      drawText(logBoxX + 2, logBoxY + 14, "---", { scale: 1, color: "rgba(14,20,15,0.48)" });
      return;
    }
    for(let i = 0; i < miniLogs.length; i++){
      const fitted = fitTrnRightPaneText(String(miniLogs[i] || "").trim(), logBoxW - 6, { scale: 1 });
      const color = (isMiniOverflow && i === 0) ? "rgba(14,20,15,0.42)" : "rgba(14,20,15,0.86)";
      drawText(logBoxX + 2, logBoxY + 14 + (i * miniLineGap), fitted, { scale: 1, color });
    }

  }

  function drawBttlRightPaneSignalGame(ctxBattle, right, nowMs){
    const metrics = getBttlSignalGameMetrics(getBttlFieldGeometry());
    const rightInner = metrics.rightInner;
    const heavyWindowActive = isBttlHeavyReactionWindowActive(ctxBattle, nowMs);
    const badShakeUntilMs = toNumber(ctxBattle.signalFxBadShakeUntilMs, 0);
    const isBadShakeActive = nowMs < badShakeUntilMs;
    const shakeX = isBadShakeActive ? (Math.sign(toNumber(ctxBattle.signalFxBadShakeDir, 1)) || 1) : 0;
    const badShakeStartedAtMs = badShakeUntilMs - TRN_BAD_SHAKE_MS;
    const ghostActive = isBadShakeActive && ((nowMs - badShakeStartedAtMs) < TRN_BAD_GHOST_MS);
    const session = ctxBattle.signalSession;

    const drawBody = (ghostPass = false) => {
      drawBox(rightInner.x, rightInner.y, rightInner.w, rightInner.h);
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
        const bandCenterR = clamp(toNumber(session.centerR, metrics.maxR * 0.6), metrics.minR, metrics.maxR);
        const bandW = toNumber(session.bandW, 8);
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

        let bandLineW = Math.max(1, bandW * 0.82);
        let bandAlpha = 0.08;
        if(inBand){
          bandLineW = Math.max(1, bandW * 0.88);
          bandAlpha = 0.15;
        }
        if(bandFlashActive){
          bandLineW = Math.max(1, bandW * 0.94);
          bandAlpha = 0.20;
        }
        if(inCrit || critFlashActive){
          bandLineW = Math.max(bandLineW, bandW * 1.00);
          bandAlpha = Math.max(bandAlpha, critFlashActive ? 0.24 : 0.18);
        }
        let critLineW = Math.max(1, critW * 0.82);
        let critAlpha = 0.16;
        if(inCrit){
          critLineW = Math.max(1, critW * 0.90);
          critAlpha = 0.28;
        }
        if(critFlashActive){
          critLineW = Math.max(1, critW * 0.98);
          critAlpha = 0.34;
        }

        if(bandFlashActive){
          const remain01 = clamp(bandFlashRemain / TRN_BAND_HIT_FLASH_MS, 0, 1);
          const progress01 = 1 - remain01;
          const expand = 1 - Math.pow(1 - progress01, 3);
          const fade = 1 - Math.pow(1 - remain01, 3);
          const pulseR = Math.min(metrics.maxR - 2, bandCenterR + (expand * (TRN_BAND_PULSE_RADIUS_MAX_PX * 0.54)));
          const pulseAlpha = 0.13 * fade;
          drawIdealRing(ringCx, ringCy, pulseR + 1, 2, `rgba(14,20,15,${(pulseAlpha * 0.45).toFixed(3)})`);
          drawIdealRing(ringCx, ringCy, pulseR, 1, `rgba(14,20,15,${pulseAlpha.toFixed(3)})`);
        }
        if(critFlashActive){
          const remain01 = clamp(critFlashRemain / TRN_CRIT_HIT_FLASH_MS, 0, 1);
          const progress01 = 1 - remain01;
          const expand = 1 - Math.pow(1 - progress01, 3);
          const fade = 1 - Math.pow(1 - remain01, 3);
          const pulseR = Math.min(metrics.maxR - 2, bandCenterR + (expand * (TRN_CRIT_PULSE_RADIUS_MAX_PX * 0.60)));
          const pulseAlpha = 0.18 * fade;
          drawIdealRing(ringCx, ringCy, pulseR + 1, 2, `rgba(14,20,15,${(pulseAlpha * 0.50).toFixed(3)})`);
          drawIdealRing(ringCx, ringCy, pulseR, 1, `rgba(14,20,15,${pulseAlpha.toFixed(3)})`);
        }

        drawIdealRing(ringCx, ringCy, bandCenterR, bandLineW, `rgba(14,20,15,${bandAlpha.toFixed(3)})`);
        if(session.critEnabled){
          drawIdealRing(ringCx, ringCy, bandCenterR, critLineW, `rgba(14,20,15,${critAlpha.toFixed(3)})`);
          if(inCrit){
            drawIdealRing(ringCx, ringCy, bandCenterR, 1, "rgba(14,20,15,0.60)");
          }
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
        drawText(metrics.footerRect.x, metrics.footerRect.y + 4, heavyWindowActive ? "C:REACT" : "A:STOP B:BACK", { scale: 1 });
        return;
      }
      const grade = String(ctxBattle.signalResult?.grade || "").trim();
      drawText(right.x + 8, right.y + 6, "SIG RESULT", { scale: 1 });
      drawIdealRing(metrics.cx, metrics.cy, metrics.minR, 1, "rgba(14,20,15,0.20)");
      drawIdealRing(metrics.cx, metrics.cy, metrics.maxR, 1, "rgba(14,20,15,0.16)");
      drawBttlSignalStopFx(ctxBattle, nowMs, metrics.playRect, metrics.cx, metrics.cy, metrics.minR, metrics.maxR);
      if(grade.length > 0){
        const fitted = fitTrnRightPaneText(grade, rightInner.w - 6, { scale: 1 });
        drawText(
          rightInner.x + Math.floor(rightInner.w / 2),
          rightInner.y + Math.floor(rightInner.h / 2) - 4,
          fitted,
          { align: "center", scale: 1 }
        );
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

  function drawBttlWarningTapeBand(frameRect, bandY, direction, elapsedMs){
    if(!frameRect) return;
    const bandX = Math.round(frameRect.x + 2);
    const bandW = Math.max(24, Math.round(frameRect.w - 4));
    const bandH = 26;
    const y = Math.round(bandY);
    const text = "WARNING!!";
    const scale = 1;
    const adv = Math.max(1, Math.floor(toNumber(BITMAP_ADVANCE_X, 6)) * scale);
    const unitW = Math.max(12, text.length * adv);
    const speedPxPerMs = 0.070;
    const scrollRaw = (elapsedMs * speedPxPerMs) % unitW;
    const scroll = direction >= 0 ? scrollRaw : (unitW - scrollRaw);
    const startX = Math.round(bandX - unitW + scroll);

    ctx.save();
    // Inverted warning tape: solid dark band + bright text.
    ctx.fillStyle = "rgba(14,20,15,1.00)";
    ctx.fillRect(bandX, y, bandW, bandH);
    ctx.strokeStyle = "rgba(200,214,194,0.86)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bandX + 0.5, y + 0.5);
    ctx.lineTo(bandX + bandW - 0.5, y + 0.5);
    ctx.moveTo(bandX + 0.5, y + bandH - 0.5);
    ctx.lineTo(bandX + bandW - 0.5, y + bandH - 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(bandX + 1, y + 1, Math.max(2, bandW - 2), Math.max(2, bandH - 2));
    ctx.clip();
    for(let x = startX; x < (bandX + bandW + unitW); x += unitW){
      drawText(Math.round(x), y + 9, text, {
        scale,
        color: "rgba(200,214,194,1.00)",
      });
    }
    ctx.restore();
  }

  function drawBttlWarningHatchOverlay(frameRect, excludeRects = [], nowMs = performance.now(), opts = {}){
    if(!frameRect) return;
    const x = Math.round(frameRect.x + 1);
    const y = Math.round(frameRect.y + 1);
    const w = Math.max(2, Math.round(frameRect.w - 2));
    const h = Math.max(2, Math.round(frameRect.h - 2));
    const step = Math.max(
      6,
      Math.floor(toNumber(opts.step, toNumber(BTTL_START_INTRO_WARNING_HATCH_STEP, 12)))
    );
    const hatchAlpha = clamp(
      toNumber(opts.alpha, toNumber(BTTL_START_INTRO_WARNING_HATCH_ALPHA, 0.12)),
      0,
      0.6
    );
    const phase = (toNumber(nowMs, performance.now()) * 0.05) % step;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    for(let i = 0; i < excludeRects.length; i++){
      const r = excludeRects[i];
      if(!r) continue;
      ctx.rect(
        Math.round(toNumber(r.x, 0)),
        Math.round(toNumber(r.y, 0)),
        Math.max(2, Math.round(toNumber(r.w, 0))),
        Math.max(2, Math.round(toNumber(r.h, 0)))
      );
    }
    ctx.clip("evenodd");
    ctx.strokeStyle = `rgba(14,20,15,${hatchAlpha.toFixed(3)})`;
    ctx.lineWidth = 1;
    for(let sx = x - h + phase; sx < (x + w + h); sx += step){
      ctx.beginPath();
      ctx.moveTo(sx, y + h);
      ctx.lineTo(sx + h, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBttlEncountCenterPlate(frameRect, centerRect, text, nowMs = performance.now(), opts = {}){
    if(!frameRect || !centerRect) return;
    const rawText = String(text ?? "").trim();
    if(rawText.length <= 0) return;
    const cx = Math.round(centerRect.x + (centerRect.w * 0.5));
    const cy = Math.round(centerRect.y + (centerRect.h * 0.5));
    const textYOffset = Math.round(toNumber(opts.textYOffset, -18));
    const plateH = Math.max(28, Math.round(toNumber(opts.plateH, 40)));
    const plateW = Math.max(140, Math.round(toNumber(opts.plateW, Math.max(180, centerRect.w - 10))));
    const textY = cy + textYOffset;
    const plateX = Math.round(cx - Math.floor(plateW / 2));
    const plateY = Math.round(textY - 4);
    const fitW = Math.max(84, plateW - 10);
    let textScale = Math.max(3, Math.floor(toNumber(opts.textScale, toNumber(BTTL_START_INTRO_ENCOUNT_TEXT_SCALE, 5))));
    while(textScale > 3){
      const mw = Number(uiTextMeasure(rawText, { scale: textScale })?.width) || 0;
      if(mw <= fitW){
        break;
      }
      textScale -= 1;
    }
    const measuredWidth = Number(uiTextMeasure(rawText, { scale: textScale })?.width) || 0;
    const fitted = measuredWidth <= fitW
      ? rawText
      : fitTrnRightPaneText(rawText, fitW, { scale: textScale });

    const hatchAlpha = toNumber(opts.hatchAlpha, toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_ALPHA, 0.08));
    const hatchStep = toNumber(opts.hatchStep, toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_STEP, 14));
    const plateFillColor = String(opts.plateFillColor || "rgba(14,20,15,0.86)");
    const plateStrokeColor = String(opts.plateStrokeColor || "rgba(200,214,194,0.82)");
    const textShadowColor = String(opts.textShadowColor || "rgba(200,214,194,0.62)");
    const textColor = String(opts.textColor || "rgba(200,214,194,0.98)");
    const textShadowOffsetX = Math.round(toNumber(opts.textShadowOffsetX, 1));
    const textShadowOffsetY = Math.round(toNumber(opts.textShadowOffsetY, 0));
    if(opts.drawHatch !== false){
      drawBttlWarningHatchOverlay(
        frameRect,
        [{ x: plateX, y: plateY, w: plateW, h: plateH }],
        nowMs,
        { alpha: hatchAlpha, step: hatchStep }
      );
    }

    ctx.save();
    ctx.fillStyle = plateFillColor;
    ctx.fillRect(plateX, plateY, plateW, plateH);
    ctx.strokeStyle = plateStrokeColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(plateX + 0.5, plateY + 0.5, plateW - 1, plateH - 1);
    drawText(cx + textShadowOffsetX, textY + textShadowOffsetY, fitted, {
      scale: textScale,
      align: "center",
      color: textShadowColor,
    });
    drawText(cx, textY, fitted, {
      scale: textScale,
      align: "center",
      color: textColor,
    });
    ctx.restore();
  }

  function drawBttlStartIntroOverlay(ctxBattle, frameRect, leftPane, nowMs = performance.now()){
    if(!isBttlStartIntroActive(ctxBattle, nowMs) || !leftPane || !frameRect) return;
    const now = toNumber(nowMs, performance.now());
    const introType = normalizeBttlStartIntroType(ctxBattle.startIntroType);
    const startedAtMs = toNumber(ctxBattle.startIntroStartedAtMs, now);
    const durationMs = Math.max(1, toNumber(ctxBattle.startIntroDurationMs, BTTL_START_INTRO_ENCOUNT_MS));
    const elapsedMs = Math.max(0, now - startedAtMs);
    const progress = clamp(elapsedMs / durationMs, 0, 1);

    const text = introType === BTTL_START_INTRO_TYPE.WARNING ? "WARNING!!" : "ENCOUNT";
    const flashMax = introType === BTTL_START_INTRO_TYPE.WARNING
      ? toNumber(BTTL_START_INTRO_WARNING_FLASH_MAX_ALPHA, 0.24)
      : toNumber(BTTL_START_INTRO_ENCOUNT_FLASH_MAX_ALPHA, 0.16);
    const flashWindow = introType === BTTL_START_INTRO_TYPE.WARNING ? 0.30 : 0.22;
    let flashAlpha = 0;
    if(progress < flashWindow){
      flashAlpha = flashMax * (1 - (progress / flashWindow));
    }
    if(introType === BTTL_START_INTRO_TYPE.WARNING){
      const pulse = ((Math.sin((elapsedMs / 76) * Math.PI * 2) + 1) * 0.5) * 0.08;
      flashAlpha = Math.max(flashAlpha, pulse);
    }

    const centerPane = introType === BTTL_START_INTRO_TYPE.WARNING ? frameRect : leftPane;
    const cx = Math.round(centerPane.x + (centerPane.w * 0.5));
    const cy = Math.round(centerPane.y + (centerPane.h * 0.5));
    const textScale = introType === BTTL_START_INTRO_TYPE.WARNING
      ? 5
      : Math.max(4, Math.floor(toNumber(BTTL_START_INTRO_ENCOUNT_TEXT_SCALE, 5)));
    const blinkMs = introType === BTTL_START_INTRO_TYPE.WARNING
      ? 80
      : Math.max(40, Math.floor(toNumber(BTTL_START_INTRO_ENCOUNT_BLINK_MS, 72)));
    const finalHoldRatio = introType === BTTL_START_INTRO_TYPE.WARNING
      ? clamp(toNumber(BTTL_START_INTRO_WARNING_FINAL_HOLD_RATIO, 0.30), 0.05, 0.60)
      : clamp(toNumber(BTTL_START_INTRO_ENCOUNT_FINAL_HOLD_RATIO, 0.30), 0.10, 0.85);
    const holdStart = Math.max(0, 1 - finalHoldRatio);
    const showText = introType === BTTL_START_INTRO_TYPE.WARNING
      ? (progress >= holdStart || (Math.floor(elapsedMs / blinkMs) % 2 === 0))
      : (
        (progress >= holdStart) ||
        (progress >= 0.04 && (Math.floor(elapsedMs / blinkMs) % 2 === 0))
      );

    ctx.save();
    if(introType === BTTL_START_INTRO_TYPE.WARNING){
      const strongDim = clamp(0.44 + (flashAlpha * 0.28), 0, 0.82);
      ctx.fillStyle = `rgba(14,20,15,${strongDim.toFixed(3)})`;
      ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
    }else if(flashAlpha > 0.001){
      // ENCOUNT flash is intentionally weak and bright, unlike WARNING's strong dark dim.
      const weakFlashAlpha = clamp(flashAlpha * 0.62, 0, 0.16);
      ctx.fillStyle = `rgba(200,214,194,${weakFlashAlpha.toFixed(3)})`;
      ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
    }

    if(introType === BTTL_START_INTRO_TYPE.WARNING){
      const topTapeRect = {
        x: frameRect.x + 2,
        y: frameRect.y + 10,
        w: Math.max(24, frameRect.w - 4),
        h: 26,
      };
      const bottomTapeRect = {
        x: frameRect.x + 2,
        y: frameRect.y + frameRect.h - 46,
        w: Math.max(24, frameRect.w - 4),
        h: 26,
      };
      const centerPlateW = clamp(Math.floor(frameRect.w * 0.78), 200, Math.max(200, frameRect.w - 24));
      const centerPlateH = 58;
      const warningY = cy - 22;
      const centerPlateRect = {
        x: Math.round(cx - Math.floor(centerPlateW / 2)),
        y: Math.round(warningY - 5),
        w: centerPlateW,
        h: centerPlateH,
      };

      // Add subtle //// overlay over whole frame, excluding warning tapes and center warning plate.
      drawBttlWarningHatchOverlay(frameRect, [topTapeRect, bottomTapeRect, centerPlateRect], nowMs);

      // Full-width warning tapes across all 3 panes.
      drawBttlWarningTapeBand(frameRect, topTapeRect.y, 1, elapsedMs);
      drawBttlWarningTapeBand(frameRect, bottomTapeRect.y, -1, elapsedMs);

      ctx.save();
      ctx.beginPath();
      ctx.rect(frameRect.x + 2, frameRect.y + 2, Math.max(2, frameRect.w - 4), Math.max(2, frameRect.h - 4));
      ctx.clip();
      ctx.fillStyle = `rgba(14,20,15,${clamp(toNumber(BTTL_START_INTRO_WARNING_NOISE_ALPHA, 0.14), 0, 0.8).toFixed(3)})`;
      for(let i = 0; i < 18; i++){
        const seed = elapsedMs * 0.013 + i * 1.91;
        const nx = (Math.sin(seed * 1.47) + 1) * 0.5;
        const ny = (Math.cos(seed * 2.03) + 1) * 0.5;
        const x = Math.round(frameRect.x + 4 + nx * Math.max(2, frameRect.w - 12));
        const y = Math.round(frameRect.y + 4 + ny * Math.max(2, frameRect.h - 12));
        const w = 2 + (i % 4);
        ctx.fillRect(x, y, w, 1);
      }
      ctx.restore();
      if(showText){
        const fitW = Math.max(64, frameRect.w - 24);
        const fitted = fitTrnRightPaneText(text, fitW, { scale: textScale });
        ctx.fillStyle = "rgba(200,214,194,0.92)";
        ctx.fillRect(centerPlateRect.x, centerPlateRect.y, centerPlateRect.w, centerPlateRect.h);
        ctx.strokeStyle = "rgba(14,20,15,1.00)";
        ctx.lineWidth = 1;
        ctx.strokeRect(centerPlateRect.x + 0.5, centerPlateRect.y + 0.5, centerPlateRect.w - 1, centerPlateRect.h - 1);
        drawText(cx - 1, warningY, fitted, { scale: textScale, align: "center", color: "rgba(14,20,15,1.00)" });
        drawText(cx + 1, warningY, fitted, { scale: textScale, align: "center", color: "rgba(14,20,15,1.00)" });
        drawText(cx, warningY, fitted, { scale: textScale, align: "center", color: "rgba(14,20,15,1.00)" });
        drawText(cx, centerPlateRect.y + 46, "HOSTILE REACTION", {
          scale: 1,
          align: "center",
          color: "rgba(14,20,15,0.94)",
        });
      }
    }else if(showText){
      drawBttlEncountCenterPlate(frameRect, leftPane, text, nowMs, {
        textYOffset: -18,
        plateH: 40,
        plateW: Math.max(180, Math.round(leftPane.w - 10)),
        textScale: toNumber(BTTL_START_INTRO_ENCOUNT_TEXT_SCALE, 5),
        hatchAlpha: toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_ALPHA, 0.08),
        hatchStep: toNumber(BTTL_START_INTRO_ENCOUNT_HATCH_STEP, 14),
      });
    }

    if(introType === BTTL_START_INTRO_TYPE.WARNING){
      const borderAlpha = 0.22 * (1 - progress);
      ctx.strokeStyle = `rgba(14,20,15,${clamp(borderAlpha, 0, 0.4).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(frameRect.x + 1.5, frameRect.y + 1.5, Math.max(2, frameRect.w - 3), Math.max(2, frameRect.h - 3));
    }
    ctx.restore();
  }

  function drawBttlEndOutroOverlay(ctxBattle, frameRect, nowMs = performance.now()){
    if(!isBttlEndOutroActive(ctxBattle, nowMs) || !frameRect) return;
    const now = toNumber(nowMs, performance.now());
    const startedAt = toNumber(ctxBattle.endOutroStartedAtMs, now);
    const elapsed = Math.max(0, now - startedAt);
    const type = normalizeBttlEndOutroType(ctxBattle.endOutroType);
    const timing = getBttlEndOutroTiming(type);

    ctx.save();
    if(type === BTTL_END_OUTRO_TYPE.WIN){
      let flashAlpha = 0;
      if(elapsed <= timing.flash1End){
        const p = clamp(elapsed / Math.max(1, timing.flashMs), 0, 1);
        flashAlpha = 0.34 * (1 - p * 0.35);
      }else if(elapsed >= timing.flash2Start && elapsed <= timing.flash2End){
        const p = clamp((elapsed - timing.flash2Start) / Math.max(1, timing.flashMs), 0, 1);
        flashAlpha = 0.30 * (1 - p * 0.45);
      }
      if(flashAlpha > 0.001){
        ctx.fillStyle = `rgba(200,214,194,${clamp(flashAlpha, 0, 0.46).toFixed(3)})`;
        ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
      }

      if(elapsed >= timing.holdStart && elapsed <= timing.holdEnd){
        const cx = Math.round(frameRect.x + (frameRect.w * 0.5));
        const cy = Math.round(frameRect.y + (frameRect.h * 0.5));
        const text = "WIN";
        const scale = 5;
        const plateW = clamp(Math.floor(frameRect.w * 0.44), 140, Math.max(140, frameRect.w - 30));
        const plateH = 52;
        const plateX = Math.round(cx - Math.floor(plateW / 2));
        const plateY = Math.round(cy - 28);
        ctx.fillStyle = "rgba(200,214,194,0.94)";
        ctx.fillRect(plateX, plateY, plateW, plateH);
        ctx.strokeStyle = "rgba(14,20,15,1.00)";
        ctx.lineWidth = 1;
        ctx.strokeRect(plateX + 0.5, plateY + 0.5, plateW - 1, plateH - 1);
        drawText(cx - 1, plateY + 8, text, {
          scale,
          align: "center",
          color: "rgba(14,20,15,0.86)",
        });
        drawText(cx + 1, plateY + 8, text, {
          scale,
          align: "center",
          color: "rgba(14,20,15,0.86)",
        });
        drawText(cx, plateY + 8, text, {
          scale,
          align: "center",
          color: "rgba(14,20,15,1.00)",
        });
      }

      if(elapsed > timing.fadeInStart && elapsed <= timing.fadeInEnd){
        const p = clamp((elapsed - timing.fadeInStart) / Math.max(1, timing.fadeInMs), 0, 1);
        ctx.fillStyle = `rgba(200,214,194,${p.toFixed(3)})`;
        ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
      }
      ctx.restore();
      return;
    }

    let darkAlpha = 0;
    if(elapsed <= timing.preFadeMs){
      const p = clamp(elapsed / Math.max(1, timing.preFadeMs), 0, 1);
      darkAlpha = 0.72 * p;
    }else if(elapsed <= timing.holdEnd){
      darkAlpha = 0.72;
    }else if(elapsed <= timing.fadeInEnd){
      const p = clamp((elapsed - timing.fadeInStart) / Math.max(1, timing.fadeInMs), 0, 1);
      darkAlpha = 0.72 + ((0.96 - 0.72) * p);
    }
    ctx.fillStyle = `rgba(14,20,15,${clamp(darkAlpha, 0, 0.98).toFixed(3)})`;
    ctx.fillRect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));

    // Subtle scanlines + noise for LOSS/ABORT.
    ctx.save();
    ctx.beginPath();
    ctx.rect(frameRect.x + 1, frameRect.y + 1, Math.max(2, frameRect.w - 2), Math.max(2, frameRect.h - 2));
    ctx.clip();
    ctx.fillStyle = "rgba(200,214,194,0.06)";
    for(let y = Math.round(frameRect.y + 2); y < (frameRect.y + frameRect.h - 2); y += 3){
      ctx.fillRect(Math.round(frameRect.x + 2), y, Math.max(2, frameRect.w - 4), 1);
    }
    ctx.fillStyle = `rgba(200,214,194,${clamp(toNumber(BTTL_END_OUTRO_LOST_NOISE_ALPHA, 0.10), 0, 0.24).toFixed(3)})`;
    for(let i = 0; i < 16; i++){
      const seed = elapsed * 0.014 + i * 1.73;
      const nx = (Math.sin(seed * 1.31) + 1) * 0.5;
      const ny = (Math.cos(seed * 1.97) + 1) * 0.5;
      const x = Math.round(frameRect.x + 4 + nx * Math.max(2, frameRect.w - 12));
      const y = Math.round(frameRect.y + 4 + ny * Math.max(2, frameRect.h - 12));
      ctx.fillRect(x, y, 2 + (i % 2), 1);
    }
    ctx.restore();

    if(elapsed >= timing.holdStart && elapsed <= timing.holdEnd){
      const cx = Math.round(frameRect.x + (frameRect.w * 0.5));
      const cy = Math.round(frameRect.y + (frameRect.h * 0.5));
      const text = "SIGNAL LOST";
      const scale = 3;
      const fitW = Math.max(100, frameRect.w - 30);
      const fitted = fitTrnRightPaneText(text, fitW, { scale });
      const plateW = clamp(Math.floor(frameRect.w * 0.62), 180, Math.max(180, frameRect.w - 24));
      const plateH = 44;
      const plateX = Math.round(cx - Math.floor(plateW / 2));
      const plateY = Math.round(cy - 22);
      ctx.fillStyle = "rgba(14,20,15,0.88)";
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.strokeStyle = "rgba(200,214,194,0.84)";
      ctx.lineWidth = 1;
      ctx.strokeRect(plateX + 0.5, plateY + 0.5, plateW - 1, plateH - 1);
      drawText(cx, plateY + 10, fitted, {
        scale,
        align: "center",
        color: "rgba(200,214,194,0.98)",
      });
    }
    ctx.restore();
  }

  function drawBttlResultRevealOverlay(nowMs = performance.now()){
    const reveal = isRecord(uiState.bttlResultReveal) ? uiState.bttlResultReveal : null;
    if(!reveal){
      setBttlRevealOverlayVisual(0, "black");
      return;
    }
    const started = toNumber(reveal.startedAtMs, 0);
    const duration = Math.max(1, toNumber(reveal.durationMs, 1));
    const now = toNumber(nowMs, performance.now());
    const elapsed = Math.max(0, now - started);
    const progress = clamp(elapsed / duration, 0, 1);
    const initialAlpha = clamp(toNumber(reveal.initialAlpha, 1), 0, 1);
    const alpha = initialAlpha * (1 - progress);
    const mode = String(reveal.mode || "white").toLowerCase();
    setBttlRevealOverlayVisual(alpha, mode);
    if(progress >= 1){
      uiState.bttlResultReveal = null;
      setBttlRevealOverlayVisual(0, mode);
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
    const { frame, left, right, bottom } = field;
    const spritePx = field.spritePx;
    const heavyWindowActive = isBttlHeavyReactionWindowActive(ctxBattle, nowMs);
    const startIntroActive = isBttlStartIntroActive(ctxBattle, nowMs);
    const endOutroActive = isBttlEndOutroActive(ctxBattle, nowMs);
    const heavySession = isRecord(ctxBattle.heavyReactSession) ? ctxBattle.heavyReactSession : null;
    const heavyFocusPoint = getBttlHeavyReactPoint(field);
    const focusX = Math.round(clamp(
      toNumber(heavySession?.focusX, heavyFocusPoint.x),
      field.innerRect.x + 12,
      field.innerRect.x + field.innerRect.w - 12
    ));
    const focusY = Math.round(clamp(
      toNumber(heavySession?.focusY, heavyFocusPoint.y),
      field.innerRect.y + 12,
      field.innerRect.y + field.innerRect.h - 12
    ));

    hudTitle.textContent = "BTTL";
    if(endOutroActive){
      const outroType = normalizeBttlEndOutroType(ctxBattle.endOutroType);
      hudHint.textContent = outroType === BTTL_END_OUTRO_TYPE.WIN ? "WIN" : "SIGNAL LOST";
    }else if(ctxBattle.phase === BTTL_STATE.RESULT){
      hudHint.textContent = "RESULT";
    }else if(startIntroActive){
      const introType = normalizeBttlStartIntroType(ctxBattle.startIntroType);
      hudHint.textContent = introType === BTTL_START_INTRO_TYPE.WARNING ? "WARNING!!" : "ENCOUNT";
    }else if(heavyWindowActive){
      hudHint.textContent = "HEAVY IN  C:REACT  B:BACK";
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
    if(heavyWindowActive && heavySession){
      const zoom = clamp(toNumber(BTTL_HEAVY_REACT_FOCUS_ZOOM_SCALE, 1.10), 1, 1.20);
      if(zoom > 1.001){
        ctx.translate(focusX, focusY);
        ctx.scale(zoom, zoom);
        ctx.translate(-focusX, -focusY);
      }
    }

    ctx.save();
    ctx.fillStyle = "rgba(12,18,14,0.14)";
    ctx.fillRect(frame.x + 1, frame.y + 1, frame.w - 2, frame.h - 2);
    ctx.restore();
    drawBox(frame.x, frame.y, frame.w, frame.h);
    drawBox(left.x, left.y, left.w, left.h);
    drawBox(right.x, right.y, right.w, right.h);
    drawBox(bottom.x, bottom.y, bottom.w, bottom.h);

    drawBox(field.innerRect.x, field.innerRect.y, field.innerRect.w, field.innerRect.h);
    drawBttlRangeBar(ctxBattle, field, nowMs);
    drawBttlHitGates(field);

    const allyAnim = getIdleMonsterAnim(state.t, view);
    const enemyAnim = getIdleMonsterAnim(state.t + 120, { baseSprite: CROW, faceSprite: CROW });
    const allyKnock = nowMs < toNumber(ctxBattle.ally?.knockUntilMs, 0) ? toNumber(ctxBattle.ally?.knockDir, -1) * 2 : 0;
    const enemyKnock = nowMs < toNumber(ctxBattle.enemy?.knockUntilMs, 0) ? toNumber(ctxBattle.enemy?.knockDir, 1) * 2 : 0;
    const allyLunge = getBttlActorLungeOffset(ctxBattle.ally, nowMs);
    const enemyLunge = getBttlActorLungeOffset(ctxBattle.enemy, nowMs);

    const enemyX = Math.round(field.enemyBaseX + enemyKnock + enemyLunge + enemyAnim.ox);
    const enemyY = Math.round(field.enemyBaseY + enemyAnim.oy);
    const allyX = Math.round(field.allyBaseX + allyKnock + allyLunge + allyAnim.ox);
    const allyY = Math.round(field.allyBaseY + allyAnim.oy);

    drawSprite16x16Facing(enemyX, enemyY, enemyAnim.sprite, DOT_SCALE, "left");
    drawSprite16x16Facing(allyX, allyY, allyAnim.sprite, DOT_SCALE, "right");
    drawBttlShortLungeDust(enemyX, enemyY, spritePx, ctxBattle.enemy, nowMs);
    drawBttlShortLungeDust(allyX, allyY, spritePx, ctxBattle.ally, nowMs);

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
    drawBttlShortRangeImpactFx(
      enemyX,
      enemyY,
      spritePx,
      nowMs,
      toNumber(ctxBattle.enemy?.meleeHitFlashUntilMs, 0)
    );
    drawBttlShortRangeImpactFx(
      allyX,
      allyY,
      spritePx,
      nowMs,
      toNumber(ctxBattle.ally?.meleeHitFlashUntilMs, 0)
    );

    drawBttlSignalStatusBadge(ctxBattle, field, allyX, allyY, nowMs);

    const topPanelW = clamp(Math.floor(field.topLaneRect.w * 0.30), 92, 150);
    const topPanelX = clamp(
      field.topLaneRect.x + Math.floor(field.topLaneRect.w * 0.56),
      field.topLaneRect.x + 20,
      (field.topLaneRect.x + field.topLaneRect.w) - topPanelW - 4
    );
    const topPanelY = field.topLaneRect.y + 2;
    const topHpGeom = drawBttlHpPanel(
      topPanelX,
      topPanelY,
      topPanelW,
      ctxBattle.enemy?.hp,
      ctxBattle.enemy?.maxHp,
      { textPos: "above", textScale: 1, showValue: false }
    );
    const topStaY = Math.round(topHpGeom.barY + topHpGeom.barH + 1);
    drawBttlStaGauge(
      topHpGeom.barX,
      topStaY,
      topHpGeom.barW,
      ctxBattle.enemy?.sta,
      ctxBattle.enemy?.maxSta,
      { nowMs }
    );
    const enemyBreakW = clamp(Math.floor(field.topLaneRect.w * 0.18), 44, 84);
    const enemyBreakX = clamp(
      Math.round(enemyX + Math.floor((spritePx - enemyBreakW) / 2)),
      field.topLaneRect.x + 2,
      field.topLaneRect.x + field.topLaneRect.w - enemyBreakW - 2
    );
    const enemyBreakMinY = field.topLaneRect.y + 2;
    const enemyBreakMaxY = Math.max(
      enemyBreakMinY,
      Math.min(
        field.topLaneRect.y + field.topLaneRect.h - 3,
        Math.floor(toNumber(field.dividerY, field.topLaneRect.y + field.topLaneRect.h) - 11)
      )
    );
    const enemyBreakPreferredY = Math.round(enemyY + spritePx + 2);
    const enemyBreakY = clamp(
      enemyBreakPreferredY,
      enemyBreakMinY,
      enemyBreakMaxY
    );
    drawBttlBreakGauge(
      enemyBreakX,
      enemyBreakY,
      enemyBreakW,
      ctxBattle.enemy?.breakValue,
      ctxBattle.enemy?.breakMax,
      { nowMs, isBreak: ctxBattle.enemy?.isBreak }
    );

    const bottomPanelW = clamp(Math.floor(field.bottomLaneRect.w * 0.30), 92, 150);
    const bottomPanelX = clamp(
      field.bottomLaneRect.x + 8,
      field.bottomLaneRect.x + 2,
      field.bottomBattleX1 - bottomPanelW - 6
    );
    const bottomPanelY = Math.max(
      field.bottomLaneRect.y + 1,
      field.bottomLaneRect.y + field.bottomLaneRect.h - 12
    );
    const bottomHpGeom = drawBttlHpPanel(
      bottomPanelX,
      bottomPanelY,
      bottomPanelW,
      ctxBattle.ally?.hp,
      ctxBattle.ally?.maxHp,
      { textPos: "above", textScale: 1, showValue: false }
    );
    const bottomStaY = Math.round(bottomHpGeom.barY + bottomHpGeom.barH + 1);
    drawBttlStaGauge(
      bottomHpGeom.barX,
      bottomStaY,
      bottomHpGeom.barW,
      ctxBattle.ally?.sta,
      ctxBattle.ally?.maxSta,
      { nowMs }
    );
    const allyBreakW = clamp(Math.floor(field.bottomLaneRect.w * 0.18), 44, 84);
    const allyBreakX = clamp(
      Math.round(allyX + Math.floor((spritePx - allyBreakW) / 2)),
      field.bottomLaneRect.x + 2,
      field.bottomLaneRect.x + field.bottomLaneRect.w - allyBreakW - 2
    );
    const allyBreakMinY = Math.max(
      field.bottomLaneRect.y + 2,
      Math.ceil(toNumber(field.dividerY, field.bottomLaneRect.y) + 5)
    );
    const allyBreakMaxY = Math.max(
      allyBreakMinY,
      field.bottomLaneRect.y + field.bottomLaneRect.h - 3
    );
    const allyBreakY = clamp(
      Math.round(allyY + spritePx + 2),
      allyBreakMinY,
      allyBreakMaxY
    );
    drawBttlBreakGauge(
      allyBreakX,
      allyBreakY,
      allyBreakW,
      ctxBattle.ally?.breakValue,
      ctxBattle.ally?.breakMax,
      { nowMs, isBreak: ctxBattle.ally?.isBreak }
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
      if(Boolean(projectile.shortDirect)) continue;
      const p = bttlRingToPoint(projectile.t, field);
      drawBttlProjectileShape(
        p.x,
        p.y,
        projectile.owner,
        BTTL_PROJECTILE_SIZE,
        Boolean(projectile.isHeavy),
        projectile.rangeStateAtLaunch
      );
    }
    drawBttlShortGateSlashFx(ctxBattle, nowMs);

    const rightInner = {
      x: right.x + 4,
      y: right.y + 4,
      w: right.w - 8,
      h: right.h - 8,
    };
    const rightPaneMode = String(ctxBattle.rightPaneMode || BTTL_RIGHTPANE_MODE.SIGNAL_MENU);
    if(rightPaneMode === BTTL_RIGHTPANE_MODE.SIGNAL_GAME){
      drawBttlRightPaneSignalGame(ctxBattle, right, nowMs);
    }else{
      drawBttlRightPaneSignalMenu(ctxBattle, right, rightInner);
    }
    drawBttlBottomPane(ctxBattle, bottom, rightPaneMode, nowMs);

    if(heavyWindowActive){
      ctx.save();
      const sideDimAlpha = clamp(toNumber(BTTL_HEAVY_REACT_DIM_ALPHA, 0.12), 0, 0.9);
      const focusDimAlpha = clamp(toNumber(BTTL_HEAVY_REACT_FOCUS_DIM_ALPHA, 0.24), 0, 0.9);
      const spotR = Math.max(20, toNumber(heavySession?.maxR, 24) + 14);
      ctx.fillStyle = `rgba(14,20,15,${focusDimAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.rect(left.x + 1, left.y + 1, Math.max(2, left.w - 2), Math.max(2, left.h - 2));
      ctx.moveTo(focusX + spotR, focusY);
      ctx.arc(focusX, focusY, spotR, 0, Math.PI * 2, true);
      ctx.fill("evenodd");
      ctx.fillStyle = `rgba(14,20,15,${sideDimAlpha.toFixed(3)})`;
      ctx.fillRect(right.x + 1, right.y + 1, Math.max(2, right.w - 2), Math.max(2, right.h - 2));
      ctx.fillRect(bottom.x + 1, bottom.y + 1, Math.max(2, bottom.w - 2), Math.max(2, bottom.h - 2));
      ctx.restore();
    }
    if(startIntroActive){
      drawBttlStartIntroOverlay(ctxBattle, frame, left, nowMs);
    }
    if(endOutroActive){
      drawBttlEndOutroOverlay(ctxBattle, frame, nowMs);
    }
    // Draw heavy reaction cue after dimming so the parry window itself remains crisp/focused.
    if(!endOutroActive){
      drawBttlHeavyReactionCue(ctxBattle, field, enemyX, enemyY, nowMs);
    }
    ctx.restore();
  }

  function startBttlBattle(options = {}){
    hideOverlayLog();
    setOverlayMode(null);
    uiState.bttlResultReveal = null;
    setBttlRevealOverlayVisual(0, "black");
    state.bttl = createBttlContext(performance.now(), options);
    state.bttlResultLogText = "";
    state.screen = "bttl";
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
      startBttlBattle();
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
      resetStatCursors();
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
      markCursorMoved();
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
      markCursorMoved();
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
      if(isRecord(ctxBattle) && isBttlStartIntroActive(ctxBattle, performance.now())){
        return;
      }
      if(isRecord(ctxBattle) && isBttlEndOutroActive(ctxBattle, performance.now())){
        return;
      }
      if(isRecord(ctxBattle) && isBttlHeavyReactionWindowActive(ctxBattle, performance.now())){
        return;
      }
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
      moveStatCursor(-1);
      showOverlayStat();
      markCursorMoved();
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
      if(isRecord(ctxBattle) && isBttlStartIntroActive(ctxBattle, performance.now())){
        return;
      }
      if(isRecord(ctxBattle) && isBttlEndOutroActive(ctxBattle, performance.now())){
        return;
      }
      if(isRecord(ctxBattle) && isBttlHeavyReactionWindowActive(ctxBattle, performance.now())){
        return;
      }
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
      moveStatCursor(1);
      showOverlayStat();
      markCursorMoved();
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
        const nowMs = performance.now();
        if(isTrnStartIntroActive(uiState.trnSession, nowMs)){
          return;
        }
        finishTrnSession(null, nowMs);
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
        const nowMs = performance.now();
        if(isBttlStartIntroActive(ctxBattle, nowMs)){
          return;
        }
        if(isBttlEndOutroActive(ctxBattle, nowMs)){
          return;
        }
        if(isBttlHeavyReactionWindowActive(ctxBattle, nowMs)){
          return;
        }
        const paneMode = String(ctxBattle.rightPaneMode || "");
        if(paneMode === BTTL_RIGHTPANE_MODE.SIGNAL_MENU){
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
        const nowMs = performance.now();
        if(isBttlStartIntroActive(ctxBattle, nowMs)){
          return;
        }
        if(isBttlEndOutroActive(ctxBattle, nowMs)){
          return;
        }
        abortBttlBattle(ctxBattle, nowMs);
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
      const ctxBattle = state.bttl;
      if(isRecord(ctxBattle)){
        const nowMs = performance.now();
        if(isBttlStartIntroActive(ctxBattle, nowMs)){
          return;
        }
        if(isBttlEndOutroActive(ctxBattle, nowMs)){
          return;
        }
        if(isBttlHeavyReactionWindowActive(ctxBattle, nowMs)){
          judgeBttlHeavyReactionByInput(ctxBattle, nowMs);
        }
      }
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
    const finalizeFrame = () => {
      drawBttlResultRevealOverlay(nowMs);
    };
    if(hudClock) hudClock.textContent = gameHHMM();
    if(state.screen !== "bttl"){
      hideBttlBottomPaneOverlay();
    }

    if(state.screen === TRN_MODE_SCREEN){
      drawTrnModeSelect(view, showCursor, nowMs);
      finalizeFrame();
      return;
    }

    if(state.screen === TRN_SCREEN){
      drawTrnScreen(view, nowMs);
      finalizeFrame();
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
      finalizeFrame();
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
      finalizeFrame();
      return;
    }

    if(state.screen === "bttl"){
      drawBttlScreen(view, nowMs);
      finalizeFrame();
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
      finalizeFrame();
      return;
    }

    if(state.screen === "edit"){
      hideOverlayLog();
      drawEditor(showCursor);
      finalizeFrame();
      return;
    }

    // other screens
    if(state.screen === "status"){
      const page = setStatPage(uiState.statPage);
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
      finalizeFrame();
      return;
    }

    const overlayLogData = buildOverlayLogByScreen(state.screen);
    if(overlayLogData){
      showOverlayLog(overlayLogData);
    }else{
      hideOverlayLog();
    }
    finalizeFrame();
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
          if(uiDay) uiDay.textContent = `DAY ${state.day}`;
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

    if(uiClock) uiClock.textContent = gameHHMM();
    drawFrame();
    requestAnimationFrame(tick);
  }

  // init
  if(uiDay) uiDay.textContent = `DAY ${state.day}`;
  if(uiClock) uiClock.textContent = gameHHMM();
  tick();
})();

