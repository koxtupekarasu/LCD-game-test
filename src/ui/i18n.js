(() => {
  "use strict";

  const dictJa = Object.freeze({
    "log.normal.food": "給餌実行。\n反応確認。\n{statLine}\nA/Bで切断",
    "log.normal.food_nochange": "給餌実行。\n反応なし。\nA/Bで切断",
    "log.normal.sleep": "休止処理実行。\n活性低下を確認。\n{statLine}\nA/Bで切断",
    "log.normal.sleep_nochange": "休止処理実行。\n変化なし。\nA/Bで切断",
    "log.normal.heal": "修復処理実行。\n損傷値安定。\n{statLine}\nA/Bで切断",
    "log.normal.heal_nochange": "修復処理実行。\n効果なし。\nA/Bで切断",
    "log.corrupted.food": "",
    "log.corrupted.food_nochange": "",
    "log.corrupted.sleep": "",
    "log.corrupted.sleep_nochange": "",
    "log.corrupted.heal": "",
    "log.corrupted.heal_nochange": "",
    "ui.back.ab": "A/Bで戻る",
    "ui.help.menu": "←→:移動 ↑↓:段 A:決定 B:閉じる",
    "ui.help.editor.browse": "十字:選択 A:編集 B:戻る C:カテゴリ",
    "ui.help.editor.edit": "十字/タップ:描画 A:dot B:一覧 C:SELECT",
    "ui.help.editor.select": "十字:移動 A:始点/終点/実行 B:戻る C:メニュー",
    "ui.help.editor.paste": "十字:位置 A:確定 B:取消 C:方式 {mode} {size}",
  });

  function formatTemplate(template, params){
    const text = String(template ?? "");
    if(!params || typeof params !== "object") return text;
    return text.replace(/\{([a-zA-Z0-9_]+)\}/g, (_m, key) => {
      const value = params[key];
      if(value == null) return "";
      return String(value);
    });
  }

  function t(key, params){
    const id = String(key ?? "");
    const value = dictJa[id];
    if(typeof value !== "string"){
      return `[${id}]`;
    }
    return formatTemplate(value, params);
  }

  const api = Object.freeze({
    locale: "ja",
    t,
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonI18n = api;
})();
