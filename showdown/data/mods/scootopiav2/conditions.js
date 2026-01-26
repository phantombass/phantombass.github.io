"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var conditions_exports = {};
__export(conditions_exports, {
  Conditions: () => Conditions
});
module.exports = __toCommonJS(conditions_exports);
const Conditions = {
  frz: {
    name: "frz",
    /*
    start: "  [Pokemon] was chilled!",
    alreadyStarted: "  [POKEMON] is already chilled!",
    end: "  [POKEMON] warmed up!",
    endFromItem: "  [POKEMON]'s [ITEM] warmed it up!",
    endFromMove: "  [POKEMON]'s [MOVE] warmed it up!",
    cant: "[POKEMON] is chilled!",
    */
    effectType: "Status",
    onStart(target, source, sourceEffect) {
      if (sourceEffect && sourceEffect.effectType === "Ability") {
        this.add("-status", target, "frz", "[from] ability: " + sourceEffect.name, `[of] ${source}`);
      } else {
        this.add("-status", target, "frz");
      }
    },
    onResidualOrder: 9,
    onResidual(pokemon) {
      this.damage(pokemon.baseMaxhp / 16);
    },
    onModifySpA(spa, pokemon) {
      return this.chainModify(0.5);
    }
  },
  slp: {
    name: "slp",
    effectType: "Status",
    onStart(target, source, sourceEffect) {
      if (sourceEffect && sourceEffect.effectType === "Ability") {
        this.add("-status", target, "slp", "[from] ability: " + sourceEffect.name, `[of] ${source}`);
      } else if (sourceEffect && sourceEffect.effectType === "Move") {
        this.add("-status", target, "slp", "[from] move: " + sourceEffect.name);
      } else {
        this.add("-status", target, "slp");
      }
      this.effectState.startTime = 3;
      const sleepMoves = ["sleeppowder", "spore", "grasswhistle", "darkvoid", "hypnosis"];
      if (sourceEffect && sourceEffect.effectType === "Move") {
        if (sleepMoves.includes(sourceEffect.id)) this.effectState.startTime = 2;
      }
      this.effectState.time = this.effectState.startTime;
    },
    onBeforeMovePriority: 10,
    onBeforeMove(pokemon, target, move) {
      if (pokemon.hasAbility("earlybird")) {
        pokemon.statusState.time--;
      }
      pokemon.statusState.time--;
      if (pokemon.statusState.time <= 0) {
        pokemon.cureStatus();
        return;
      }
      this.add("cant", pokemon, "slp");
      if (move.sleepUsable) {
        return;
      }
      return false;
    },
    onModifySpe(spe, pokemon) {
      return this.chainModify(0.5);
    }
  }
};
//# sourceMappingURL=conditions.js.map
