(() => {
  "use strict";

  const SpriteSpec = window.DotmonSpriteSpec;
  if(!SpriteSpec){
    throw new Error("DotmonSpriteSpec is required before DotmonSpriteCodec.");
  }

  const SPRITE_W = Number(SpriteSpec.SPRITE_W);
  const SPRITE_H = Number(SpriteSpec.SPRITE_H);

  function makeEmptySprite(){
    return Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill(0));
  }

  function isEncodedSprite(encoded){
    if(!Array.isArray(encoded) || encoded.length !== SPRITE_H) return false;
    return encoded.every((row) => typeof row === "string" && row.length === SPRITE_W && /^[01]+$/.test(row));
  }

  function encodeSprite(spriteData){
    if(!Array.isArray(spriteData) || spriteData.length !== SPRITE_H) return null;
    const rows = [];
    for(let y = 0; y < SPRITE_H; y++){
      const row = spriteData[y];
      if(!Array.isArray(row) || row.length !== SPRITE_W) return null;
      let encoded = "";
      for(let x = 0; x < SPRITE_W; x++){
        encoded += Number(row[x]) > 0 ? "1" : "0";
      }
      rows.push(encoded);
    }
    return rows;
  }

  function decodeSprite(encodedString){
    if(!isEncodedSprite(encodedString)) return null;
    const sprite = makeEmptySprite();
    for(let y = 0; y < SPRITE_H; y++){
      const row = encodedString[y];
      for(let x = 0; x < SPRITE_W; x++){
        sprite[y][x] = row[x] === "1" ? 1 : 0;
      }
    }
    return sprite;
  }

  const api = {
    encodeSprite,
    decodeSprite,
    isEncodedSprite,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonSpriteCodec = Object.freeze(api);
})();
