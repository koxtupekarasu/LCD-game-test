DOTMONスプライト規格.md
# DOTMON Sprite Specification

DOTMONで使用するスプライトの統一ルール。

---

## 1. 基本サイズ

標準サイズは以下。

food icon : 16x16  
ui icon   : 16x16  
fx icon   : 16x16  

ad sprite : 16x16（現行）
将来的に32x32拡張可能

---

## 2. 画像形式

形式 : PNG  
背景 : 透過  
カラーモード : 実質1bit前提

---

## 3. ファイル管理

基本方針

**1アイコン = 1PNG**

理由
- 管理しやすい
- 追加が簡単
- CODEXが扱いやすい

---

## 4. フォルダ構造


assets
├ food
│ ├ meat_small.png
│ ├ drink_simple.png
│
├ ad
│ ├ ad_idle.png
│ ├ ad_sleep.png
│
├ ui
│ ├ icon_food.png
│ ├ icon_heal.png
│
└ fx
├ effect_signal.png


---

## 5. 命名規則

形式

category_type_variant.png

例

food_meat_small.png  
food_drink_simple.png  

ad_idle.png  
ad_sleep.png  

ui_food.png  
ui_heal.png  

fx_signal.png  

---

## 6. ドット作画ルール

優先順位

1. シルエットで識別できる
2. 1bitでも読める
3. 情報量は最小限

基本

- 外周1ドットの余白を意識
- 主シルエットは12〜14px程度
- 識別記号は1つまで

例

肉 → 骨  
ドリンク → 矢印  
ゼリー → 丸  

---

## 7. アドスプライト

サイズ

16x16

基準

- 中央寄せ
- 足元高さを揃える
- 顔や目は上寄り

---

## 8. 将来拡張

以下は将来追加予定

32x32 sprite  
color sprite  
sprite sheet animation