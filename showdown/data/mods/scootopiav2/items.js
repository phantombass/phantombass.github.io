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
var items_exports = {};
__export(items_exports, {
  Items: () => Items
});
module.exports = __toCommonJS(items_exports);
const Items = {
  crystalorb: {
    name: "Crystal Orb",
    num: 1001,
    desc: "The holder's secondary type is replaced with Crystal. 20% boost to Crystal attacks.",
    onBeforeSwitchIn(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser !== pokemon.fullname) return false;
      if (pokemon.hasType("Crystal")) return false;
      if (!pokemon.addType("Crystal")) return false;
      pokemon.setType([pokemon.types[0], "Crystal"]);
      this.effectState.usedSuperType = true;
      this.effectState.superTypeUser = "first_switch";
    },
    onStart(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === "first_switch") {
        this.add("-message", pokemon.name + " is a Crystal type!");
        this.effectState.superTypeUser = pokemon.fullname;
      }
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === pokemon.fullname) {
        this.add("-start", pokemon, "typechange", pokemon.getTypes(true).join("/"), "[silent]");
      }
    },
    onUpdate(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === pokemon.fullname && !pokemon.hasType("Crystal")) {
        pokemon.setType([pokemon.types[0], "Crystal"]);
        this.add("-start", pokemon, "typechange", pokemon.getTypes(true).join("/"), "[silent]");
      }
    },
    onTakeItem(item, pokemon, source) {
      if (source?.hasType("Crystal")) {
        return false;
      }
      return true;
    },
    onBasePowerPriority: 15,
    onBasePower(basePower, user, target, move) {
      if (move && move.type === "Crystal") {
        return this.chainModify([4915, 4096]);
      }
    },
    gen: 9
  },
  feralorb: {
    name: "Feral Orb",
    num: 1002,
    desc: "The holder's secondary type is replaced with Feral. 20% boost to Feral attacks.",
    onBeforeSwitchIn(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser !== pokemon.fullname) return false;
      if (pokemon.hasType("Feral")) return false;
      if (!pokemon.addType("Feral")) return false;
      pokemon.setType([pokemon.types[0], "Feral"]);
      this.effectState.usedSuperType = true;
      this.effectState.superTypeUser = "first_switch";
    },
    onStart(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === "first_switch") {
        this.add("-message", pokemon.name + " is a Feral type!");
        this.effectState.superTypeUser = pokemon.fullname;
      }
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === pokemon.fullname) {
        this.add("-start", pokemon, "typechange", pokemon.getTypes(true).join("/"), "[silent]");
      }
    },
    onUpdate(pokemon) {
      if (this.effectState.usedSuperType && this.effectState.superTypeUser === pokemon.fullname && !pokemon.hasType("Feral")) {
        pokemon.setType([pokemon.types[0], "Feral"]);
        this.add("-start", pokemon, "typechange", pokemon.getTypes(true).join("/"), "[silent]");
      }
    },
    onTakeItem(item, pokemon, source) {
      if (source?.hasType("Feral")) {
        return false;
      }
      return true;
    },
    onBasePowerPriority: 15,
    onBasePower(basePower, user, target, move) {
      if (move && move.type === "Feral") {
        return this.chainModify([4915, 4096]);
      }
    },
    gen: 9
  }
};
//# sourceMappingURL=items.js.map
