# LCDゲーム仮 実装仕様メモ（現行）

最終更新: 2026-03-11  
対象: `f:/携帯ゲーム機試作/app.js` / `index.html` / `style.css`

---

## 1. 共有目的
- 複数チャット（この環境 + ChatGPTプロジェクト）で、**現在動いている仕様**を同期するためのスナップショット。
- ここは「実装済みのみ」を書く。未実装・保留は別ファイル参照。

---

## 2. 全体UI（現行）
- 画面は3ペイン構成（BTTL時）
  - 左: メイン戦闘
  - 右: `SIGNAL MENU` + `OBS LOG`（英語短ログ）
  - 下: 日本語ログ（意味づけ層）
- 旧グローバル上部/下部ガイドは削減済みで、表示領域を拡張済み。
- 下ペイン日本語ログはDOM表示（PixelMplus12）を使用。

---

## 3. BTTLコア（現行）

### 3.1 進行方式
- ターン制ではなく**リアルタイムオートバトル**。
- 敵/味方は独立周期で攻撃。
- Bで戦闘中断→`ABORT`としてリザルトへ遷移可能。

### 3.2 レンジシステム
- 相対位置ベースで `SHORT / MID / LONG` を判定。
- 中央レンジバー上に敵/味方マーカー表示。
- レンジ滞在ログ（`RANGE SHORT/MID/LONG`）をOBS LOGに出力。
- SHORT攻撃後は反動で距離が戻る挙動あり。

### 3.3 攻撃表現
- MID/LONG: 飛翔体。
- SHORT: 近接寄りの斬撃エフェクト（ゲート直発生）。
- 着弾判定ゲート表示あり（見た目位置と判定位置を整合）。

### 3.4 HEAVY + リアクション（回避/パリィ）
- HEAVY予兆/反応窓（収束リング）あり。
- 入力は `C:REACT`。
- 判定:
  - BAD = 被弾
  - NEAR = DODGE
  - OK = PARRY
  - SUCCESS = REFLECT
- 反応窓中は減光/疑似ズーム/スロー演出あり（他UIより優先）。
- 判定後は結果プレート表示（ENCOUNT演出流用系）あり。

### 3.5 BREAKシステム
- 敵味方にBREAK値あり（蓄積型）。
- BREAKゲージは個体近傍に表示、HP/STAと区別した見た目。
- 高蓄積時の強調表示あり。
- HEAVY/PARRY/REFLECT/SHORT圧などで増加。
- 自然回復あり（遅めに調整済み）。

### 3.6 HP / STA / BREAKの役割分離
- HP: 生存値（被ダメで減少）。
- STA: SIGNALコスト用リソース。
- BREAK: 崩れ蓄積（第2HPではない）。
- STAは自然回復あり。

---

## 4. SIGNAL MENU（現行）

### 4.1 コマンド
- `BOOST`
- `STABILIZE`
- `CALIBRATE`
- `OVER CLOCK`

### 4.2 発動フロー
- 右ペインで選択（↑↓）。
- Aでミニゲーム開始→停止判定。
- `BAD / NEAR / OK / SUCCESS` を tier化。
- **持続バフ型**として適用（次弾1発限定ではない）。
- 同時有効は1つ（新規発動で上書き）。

### 4.3 コストとCD（現行定数）
- 全体GCD: `700ms`
- 個別CD:
  - BOOST `4200ms`
  - STABILIZE `3400ms`
  - CALIBRATE `3200ms`
  - OVER CLOCK `4600ms`
- STAコスト:
  - BOOST `-2`
  - STABILIZE `-1`
  - CALIBRATE `-1`
  - OVER CLOCK `-2`
- STA不足時は `NO STA` ログで不発（発動不可）。

### 4.4 OVER CLOCK（現行）
- 接近/突破専用の持続バフ。
- 効果:
  - 接近補正（tier依存）
  - 被ノックバック軽減
- デメリット:
  - 被ダメ増
  - BREAK被蓄積増
- 直近調整で「詰め速度」は強化→少し弱化した値に調整済み。

---

## 5. BTTL開始/終了演出（現行）

### 5.1 開始演出
- 通常: `ENCOUNT`
- 危険戦: `WARNING!!`
- WARNINGは上下テープスクロール + 中央強調表示 + 背景減光/演出あり。
- ENCOUNTは短フラッシュ後に固定表示を経て戦闘開始。

### 5.2 終了演出
- WIN:
  - フラッシュ×2
  - `WIN`固定表示
  - 白転フェードIN中にRESULTへハンドオフ
  - フェードOUTでRESULT表示
- LOSE/ABORT:
  - 暗転系演出
  - `SIGNAL LOST`固定表示
  - 暗転フェードIN中にRESULTへハンドオフ
  - フェードOUTでRESULT表示

---

## 6. リザルト保存（現行）
- `state.detailed` に戦闘メトリクスを保存:
  - `battleCount`, `battleWins`, `battleLosses`, `battleRetreats`
  - `signalUseBoost/Stabilize/Calibrate/Overclock`
  - `breakInflictedCount`, `breakSufferedCount`
  - `rangeStayShort/Mid/Long`
- 結果は `WIN / LOSE / ABORT` で確定。

---

## 7. TRN（現行）
- START演出あり（文言は `START`）。
- トレーニング中の白転は**リザルト遷移時のみ**発火。
- タイム表示 `T:` は開始演出後にカウント開始。

---

## 8. 参照推奨（コード）
- `app.js` 定数群（BTTL/TRNはファイル冒頭〜中盤）
- `updateBttl(...)` 周辺
- `startBttlSignalGame(...)`, `finishBttlSignalGame(...)`
- `activateBttlSignalBuff(...)`
- `updateBttlRangeRealtime(...)`

