(() => {
  "use strict";

  const CURRENT_SAVE_VERSION = 1;

  function migrateSave(saveData){
    if(!saveData || typeof saveData !== "object"){
      return saveData;
    }

    switch(saveData.version){
      case 1:
      case undefined:
        return saveData;

      default:
        console.warn("Unknown save version:", saveData.version);
        return saveData;
    }
  }

  const api = {
    CURRENT_SAVE_VERSION,
    migrateSave,
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DotmonSaveMigrator = Object.freeze(api);
})();
