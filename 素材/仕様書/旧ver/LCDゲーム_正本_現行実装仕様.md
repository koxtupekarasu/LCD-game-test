# LCDゲーム仮 正本ドキュメント：現行実装仕様

最終整理: 2026-03-11

この文書は、現時点で**実装済み・現行として扱う仕様のみ**をまとめた正本である。旧案・保留・要調整は別冊の「未実装・保留メモ」を参照。

---

## 1. 全体方針
- 作品の基本形は**携帯育成液晶ゲーム風**。
- 描画は **Canvas方式** を基本とし、一部情報表示は **DOM overlay** を使う。
- 画面内の用語や設計は、単なるRPGではなく**観測・管理・干渉**を伴う育成機として整理する。
- 内部論理解像度は **384 × 288**。
- モンスター表現の基本単位は **16×16 / 1bitドット**。
- HiDPI対応あり。CSS表示サイズは維持しつつ、canvas実解像度は devicePixelRatio で高解像度化する。

---

## 2. 基礎アプリ構成
- 基本ファイル:
  - `index.html`
  - `app.js`
  - `style.css`
  - `manifest.webmanifest`
  - `service-worker.js`
- 静的配信で動作確認済み。
- 実時間差分ベースの更新を採用しており、固定 `1/60` 更新は廃止済み。
- `performance.now()` ベースの `dtSec` を使い、`0〜0.1` にクランプする。

---

## 3. 世界内の基本存在（実装前提の用語）
- 媒体の正式名称: **AD（Artifact Disk / アーティファクト・ディスク）**
- 個体群の正式英名: **Artifact Domain**
- 学術和名: **AD由来疑似生命体領域群**
- ゲーム内通称: **アド**
- ゲーム内では、個体群も単体個体も基本的に「アド」または個体名で呼ぶ。
- `AD` は媒体そのもの、`アド` はそこから発生・観測される個体群/個体を指す。

---

## 4. モンスター / 個体データ構造（現行）
- Monsterデータの正本は `monster`。
- `state.monSprite` などの旧二重管理は廃止済み。
- 代表構造:
  - `id`
  - `age`
  - `weight`
  - `stage`
  - `spriteSet`
    - `base`
    - `faces`
    - `actions`
    - `icons`
  - `stats`
    - `maxHp`
    - `staminaMax`
    - （旧 `attack / defence / speed` は現行主軸から外れており、今後削除対象）
  - `personality`
    - `aggression`
    - `curiosity`
    - `calmness`
  - `runtimeState`
    - `hp`
    - `stamina`
    - `mode`
    - `faceId`
    - `actionId`
    - `actionFrame`
    - `actionTimer`
- 初期化 / 正規化 / 検証:
  - `createDefaultMonster`
  - `normalizeMonster`
  - `validateMonster`
- Save format は version 付き:
  - `{ version, monster }`
- 旧形式セーブからの自動移行あり。
- JSON破損時のフォールバック初期化あり。

---

## 5. ドットエディタ（現行）
- 16×16 / 1bit 前提のドットエディタ基盤あり。
- Base差分を編集可能。
- 差分管理UI:
  - 右ペイン管理
  - 横3列 × 縦4列
  - 1ページ12枠
  - カテゴリ: `FACE / ACTION / ICON`
- 差分は**固定配置方式**。
- 差分データはすべて**フル16×16保持**。
- 透明色なし。
- 新規差分作成時は Base を自動コピーして開始。
- サムネは本体16×16をそのまま等倍表示。
- 実装済み機能:
  - Undo / Redo
  - Cボタン導入
  - 矩形選択
  - Copy / Cut / Paste
  - 水平 / 垂直反転
  - 1ドットシフト

---

## 6. 基本育成・日常要素（現行）
### 6.1 時刻・睡眠
- ゲーム内時計は**現実時間と同速**で進行。
- 起動時は現実時刻に同期。
- 夜は自動睡眠状態に入る。
- 睡眠中は `Zzz` 表示と暗幕演出あり。
- `chronotype`（朝型 / 昼型 / 夜型）あり。
- `SLEEP` は**睡眠中のみ実行可能**。
- `SLEEP` 実行で `isTuckedIn = true`。
- 自然睡眠のみの場合は効果半減、寝かしつけ済みなら効果フル。

### 6.2 うんち / hygiene
- うんちは一定時間で自然発生。
- 最大3個。
- 放置で `hygiene` 低下。
- `WC` で全消去。
- 出現時にポン演出あり。
- 出現位置はモンスター左寄りへ調整済み。

### 6.3 FEED / SLEEP / HEAL の内部処理
- `applyFeed()` / `applySleep()` / `applyHeal()` 実装済み。
- 内部主要値:
  - `hp`
  - `stamina`
  - `hunger`
  - `stability`
  - `damage`
- 用語整理:
  - `mood` は現行採用しない
  - 安定度 = `stability`
  - `hunger` は内部変数名、表示上は **充足値**
- `hunger` は満腹度方式:
  - FEEDで増加
  - SLEEPで減少
- ログ差分は実更新値ベースで計算。
- 差分ゼロは `+0 / -0` を表示しない。
- 差分なし時は `_nochange` テンプレへ分岐する。

---

## 7. UI文字描画・メニュー（現行）
- UI文字描画は `uiText.js` に集約済み。
- ビットマップフォント導入済み。
- 主要構成:
  - `bitmapFontSpec.js`
  - `bitmapFontData.js`
  - `bitmapTextRenderer.js`
  - `uiText.js`
- カーソル表現:
  - `▶` を使うA案を採用
  - 点滅あり
  - 移動時フラッシュあり
  - `performance.now()` ベース
- カーソル位置は**文字基準**。
- 上段メニューには左安全マージン方式を導入済み。
- メニュー枠線は上下とも削除済み。
- 線構成:
  - 上段メニュー: 下線
  - 下段メニュー: 上線
- ベースラインはフォント実寸ベースで算出。
- 下段メニュー位置は +12px 調整済み。
- ラベル群（現行採用）:
  - `STAT / FEED / TRN / BTTL / ADV / WC / SLEEP / HEAL / EDIT`

---

## 8. ログ・文言システム（現行）
- 日本語ログは **DOM overlay** で表示。
- フォントは `PixelMplus12` を使用。
- overlay表示中は scanline 停止。
- `i18n.js` 導入済み。
- `DotmonI18n.t(key, params)` による辞書管理あり。
- ログは `state.logStyle = "normal" | "corrupted"` に対応する構造あり。
- `corrupted` 未定義時は `normal` にフォールバック。
- ログ文体方針:
  - 主語なし
  - 短文
  - 記録・観測寄り
- FEED / SLEEP / HEAL などのログテンプレは style + action ベースで解決。

---

## 9. STAT画面（現行）
### 9.1 構成
- 現在は **3ページ構成の土台実装済み**。
- Page1 / Page2 / Page3 を切り替え可能。
- 各ページに選択カーソルあり。
- 下部説明ペインあり。
- 選択中項目の意味を下ペインへ表示。

### 9.2 Page1
- 数値・現在値確認ページ。
- バー + 数値中心。
- 主要状態値を表示。

### 9.3 Page2
- 傾向確認ページ。
- レーダーチャートではなく**バー / 一覧型表示**を現行採用寄りとする。
- personality・傾向値・評価系の表示に使用。

### 9.4 Page3
- 成長傾向 / 進化予兆 / 観測メモ寄りの読ませるページ。
- 現在は土台と仮文言を含む構成。

### 9.5 旧Page1/2仕様との関係
- 以前の `STAT 1/2 / 2/2` ベースは、現在の3ページ土台へ発展的に統合された扱いとする。
- 以前のPage2で使っていた「直近変化」保持・説明文構造は、現行3ページ構成の土台へ継承されている。

---

## 10. TRAIN（現行）
### 10.1 位置づけ
- TRNは**信号品質を整える / 上げる主成長手段**。
- 戦闘の「攻勢」軸を日常行動で整える意味を持つ。

### 10.2 基本構造
- 左: 円周波形ミニゲーム
- 右: 個体表示 + 右下ミニ枠
- Aで停止判定
- Bで戻る / 退出
- Cは無効

### 10.3 モード
- `CALIBRATION`
- `BOOST SYNC`
- `NOISE CUT`

### 10.4 判定
- `BAD / NEAR / OK / SUCCESS`
- 内部成功率（安定度・充足値・スタミナ依存）とプレイヤー入力の二層構造。

### 10.5 波形・成功帯
- 高速ループ型の円周波形。
- 進行は easeInOutSine 型。
- 成功帯はセッション開始時ランダム固定。
- 成功帯は内側寄せ済み。
- 成功帯 / クリ帯突入フィードバックあり。

### 10.6 演出
- BAD時は画面全体横ブレ + 残像。
- 右ペイン瞬間フィードバックあり。
- 判定行は擬似太字化。
- トレーニング終了後は即ログ遷移せず、Aで次セッション / BでRESULTへ。

### 10.7 RESULT
- 実行回数
- 信号品質 / スタミナ / 安定度の総和
- 総括フレーバー1行

### 10.8 スタミナ制御
- スタミナ0でトレーニング不可。
- 開始不可時は画面全体ブレ。
- スタミナ0到達時は強制RESULT。

### 10.9 成長保存
- トレーニング由来の成長処理・履歴保存は導入済み。
- 主成長対象:
  - `signalQuality`
  - `stability`
  - `adIntegrity`
  - `personality.*`
- 補助対象:
  - `maxHp`
  - `staminaMax`
  - `weight`
- 履歴系:
  - `trainingCount`
  - `trainingTypeCounts` または同等構造

---

## 11. BTTL（現行）
### 11.1 全体
- **リアルタイムオートバトル**。
- 旧ターン制は撤廃済み。
- Bで戦闘中断し `ABORT` としてRESULTへ遷移可能。

### 11.2 画面構成
- 3ペイン構成:
  - 左: メイン戦闘
  - 右: `SIGNAL MENU` + `OBS LOG`
  - 下: 日本語ログ（意味づけ層）
- 右は事実 / 端末ログ、下は意味 / 観測記録の二層。

### 11.3 レンジ
- 相対位置ベースで `SHORT / MID / LONG` を判定。
- 中央レンジバー上に敵味方マーカーを表示。
- `RANGE SHORT/MID/LONG` を OBS LOG に出す。
- SHORT攻撃後は反動で距離が戻る。

### 11.4 攻撃表現
- MID/LONG: 飛翔体
- SHORT: 近接寄り斬撃エフェクト（ゲート直発生）
- 着弾判定ゲート表示あり

### 11.5 HEAVY / リアクション
- `C:REACT`
- 判定:
  - BAD = 被弾
  - NEAR = DODGE
  - OK = PARRY
  - SUCCESS = REFLECT
- 反応窓中は減光 / 疑似ズーム / スロー演出あり。

### 11.6 BREAK
- 敵味方とも BREAK 値あり。
- BREAKは第2HPではなく崩れ蓄積。
- BREAKゲージ表示あり。
- 高蓄積強調あり。
- HEAVY / PARRY / REFLECT / SHORT圧などで増加。
- 自然回復あり。

### 11.7 HP / STA / BREAK
- HP: 生存値
- STA: SIGNALコスト用
- BREAK: 崩れ蓄積
- STA自然回復あり

### 11.8 SIGNAL MENU
- コマンド:
  - `BOOST`
  - `STABILIZE`
  - `CALIBRATE`
  - `OVER CLOCK`
- 持続バフ型
- 同時有効は1つ、新規発動で上書き
- 全体GCD + 個別CD + STAコストあり
- STA不足時は `NO STA`

### 11.9 SIGNAL定数（現行）
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

### 11.10 OVER CLOCK
- 接近 / 突破専用の持続バフ。
- 接近補正 + 被ノックバック軽減。
- デメリットは被ダメ増 + BREAK被蓄積増。

### 11.11 開始 / 終了演出
- 開始:
  - 通常 `ENCOUNT`
  - 危険戦 `WARNING!!`
- 終了:
  - WIN系
  - LOSE / ABORT系
- RESULTへのハンドオフ演出あり。

### 11.12 戦闘リザルト保存
- `battleCount`
- `battleWins`
- `battleLosses`
- `battleRetreats`
- `signalUseBoost / Stabilize / Calibrate / Overclock`
- `breakInflictedCount / breakSufferedCount`
- `rangeStayShort / Mid / Long`

---

## 12. 進化に接続する現行保存基盤
- 戦闘由来保存あり。
- トレーニング由来保存あり。
- STAT画面で読める土台あり。
- 進化条件の正式採用要素整理も完了済み（別冊参照）。

---

## 13. 現行で採用しない / 旧仕様から外れたもの
- 旧縦リストメニュー
- `SAVE` UI前提
- `PLAY` の中核メニュー化
- `mood` を主要内部軸に置く方針
- SIGNALの「次弾1発だけ」方式
- BTTLのターン制ループ
- attack / defence / speed を現行主軸として扱うこと

---

## 14. 備考
- 日本語ログ表示は動作実装済みだが、フォント見た目の最終調整余地は残る。
- 細かな数値バランスは別冊の未実装・保留メモに寄せる。
