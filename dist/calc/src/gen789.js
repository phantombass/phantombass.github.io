"use strict";
exports.__esModule = true;

var util_1 = require("./util");
var items_1 = require("./items");
var result_1 = require("./result");
var util_mech_1 = require("./util_mech");
function calculateSMSSSV(gen, attacker, defender, move, field) {
    (0, util_mech_1.checkAirLock)(attacker, field);
    (0, util_mech_1.checkAirLock)(defender, field);
    (0, util_mech_1.checkForecast)(attacker, field.weather);
    (0, util_mech_1.checkForecast)(defender, field.weather);
    (0, util_mech_1.checkItem)(attacker, field.isMagicRoom);
    (0, util_mech_1.checkItem)(defender, field.isMagicRoom);
    (0, util_mech_1.checkWonderRoom)(attacker, field.isWonderRoom);
    (0, util_mech_1.checkWonderRoom)(defender, field.isWonderRoom);
    (0, util_mech_1.checkSeedBoost)(attacker, field);
    (0, util_mech_1.checkSeedBoost)(defender, field);
    (0, util_mech_1.checkDauntlessShield)(attacker, gen);
    (0, util_mech_1.checkDauntlessShield)(defender, gen);
    (0, util_mech_1.computeFinalStats)(gen, attacker, defender, field, 'def', 'spd', 'spe');
    (0, util_mech_1.checkIntimidate)(gen, attacker, defender);
    (0, util_mech_1.checkIntimidate)(gen, defender, attacker);
    (0, util_mech_1.checkDownload)(attacker, defender, field.isWonderRoom);
    (0, util_mech_1.checkDownload)(defender, attacker, field.isWonderRoom);
    (0, util_mech_1.checkIntrepidSword)(attacker, gen);
    (0, util_mech_1.checkIntrepidSword)(defender, gen);
    (0, util_mech_1.computeFinalStats)(gen, attacker, defender, field, 'atk', 'spa');
    (0, util_mech_1.checkInfiltrator)(attacker, field.defenderSide);
    (0, util_mech_1.checkInfiltrator)(defender, field.attackerSide);
    var desc = {
        attackerName: attacker.name,
        attackerTera: attacker.teraType,
        moveName: move.name,
        defenderName: defender.name,
        defenderTera: defender.teraType,
        isDefenderDynamaxed: defender.isDynamaxed,
        isWonderRoom: field.isWonderRoom
    };
    var result = new result_1.Result(gen, attacker, defender, move, field, 0, desc);
    if (move.category === 'Status' && !move.named('Nature Power')) {
        return result;
    }
    var breaksProtect = move.breaksProtect || move.isZ || attacker.isDynamaxed ||
        (attacker.hasAbility('Unseen Fist') && move.flags.contact);
    if (field.defenderSide.isProtected && !breaksProtect) {
        desc.isProtected = true;
        return result;
    }
    var defenderIgnoresAbility = defender.hasAbility('Full Metal Body', 'Neutralizing Gas', 'Prism Armor', 'Shadow Shield');
    var attackerIgnoresAbility = attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze');
    var moveIgnoresAbility = move.named('G-Max Drum Solo', 'G-Max Fire Ball', 'G-Max Hydrosnipe', 'Light That Burns the Sky', 'Menacing Moonraze Maelstrom', 'Moongeist Beam', 'Photon Geyser', 'Searing Sunraze Smash', 'Sunsteel Strike');
    if (!defenderIgnoresAbility && !defender.hasAbility('Poison Heal')) {
        if (attackerIgnoresAbility) {
            defender.ability = '';
            desc.attackerAbility = attacker.ability;
        }
        if (moveIgnoresAbility) {
            defender.ability = '';
        }
    }
    var isCritical = !defender.hasAbility('Battle Armor', 'Shell Armor') && !defender.hasItem('Mithril Shield') &&
        (move.isCrit || (attacker.hasAbility('Merciless') && defender.hasStatus('psn', 'tox'))) &&
        move.timesUsed === 1;
    var type = move.type;
    if (move.named('Weather Ball')) {
        var holdingUmbrella = attacker.hasItem('Utility Umbrella');
        type =
            field.hasWeather('Sun', 'Harsh Sunshine') && !holdingUmbrella ? 'Fire'
                : field.hasWeather('Rain', 'Heavy Rain') && !holdingUmbrella ? 'Water'
                    : field.hasWeather('Sand') ? 'Rock'
                        : field.hasWeather('Hail', 'Snow') ? 'Ice'
                            : 'Normal';
        desc.weather = field.weather;
        desc.moveType = type;
    }
    else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
        type = (0, items_1.getItemBoostType)(attacker.item);
    }
    else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
        type = (0, items_1.getTechnoBlast)(attacker.item);
    }
    else if (move.named('Multi-Attack') && attacker.item && attacker.item.includes('Memory')) {
        type = (0, items_1.getMultiAttack)(attacker.item);
    }
    else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
        var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
        type = gift.t;
        desc.moveType = type;
        desc.attackerItem = attacker.item;
    }
    else if (move.named('Nature Power') ||
        (move.named('Terrain Pulse') && (0, util_mech_1.isGrounded)(attacker, field))) {
        type =
            field.hasTerrain('Electric') ? 'Electric'
                : field.hasTerrain('Grassy') ? 'Grass'
                    : field.hasTerrain('Misty') ? 'Fairy'
                        : field.hasTerrain('Psychic') ? 'Psychic'
                            : 'Normal';
        desc.terrain = field.terrain;
        desc.moveType = type;
    }
    else if (move.named('Revelation Dance')) {
        type = attacker.types[0];
    }
    else if (move.named('Aura Wheel')) {
        if (attacker.named('Morpeko')) {
            type = 'Electric';
        }
        else if (attacker.named('Morpeko-Hangry')) {
            type = 'Dark';
        }
    }
    else if (move.named('Raging Bull')) {
        if (attacker.named('Tauros-Paldea')) {
            type = 'Fighting';
        }
        else if (attacker.named('Tauros-Paldea-Fire')) {
            type = 'Fire';
        }
        else if (attacker.named('Tauros-Paldea-Water')) {
            type = 'Water';
        }
    }
    var hasAteAbilityTypeChange = false;
    var isAerilate = false;
    var isPixilate = false;
    var isRefrigerate = false;
    var isGalvanize = false;
    var isLiquidVoice = false;
    var isNormalize = false;
    var isEntymate = false;
    var noTypeChange = move.named('Revelation Dance', 'Judgment', 'Nature Power', 'Techno Blast', 'Multi Attack', 'Natural Gift', 'Weather Ball', 'Terrain Pulse') || (move.named('Tera Blast') && attacker.teraType);
    if (!move.isZ && !noTypeChange) {
        var normal = move.hasType('Normal');
        if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
            type = 'Flying';
        }
        else if ((isGalvanize = attacker.hasAbility('Galvanize') && normal)) {
            type = 'Electric';
        }
        else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
            type = 'Water';
        }
        else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
            type = 'Fairy';
        }
        else if ((isEntymate = attacker.hasAbility('Entymate') && normal)) {
            type = 'Bug';
        }
        else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
            type = 'Ice';
        }
        else if ((isNormalize = attacker.hasAbility('Normalize'))) {
            type = 'Normal';
        }
        if (isGalvanize || isPixilate || isRefrigerate || isAerilate || isNormalize || isEntymate) {
            desc.attackerAbility = attacker.ability;
            hasAteAbilityTypeChange = true;
        }
        else if (isLiquidVoice) {
            desc.attackerAbility = attacker.ability;
        }
    }
    if (move.named('Tera Blast') && attacker.teraType) {
        type = attacker.teraType;
    }
    move.type = type;
    if ((attacker.hasAbility('Triage') && move.flags.heal) ||
        (attacker.hasAbility('Gale Wings') &&
            move.hasType('Flying') &&
            attacker.curHP() === attacker.maxHP())) {
        move.priority = 1;
        desc.attackerAbility = attacker.ability;
    }
    var isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
    var isRingTarget = defender.hasItem('Ring Target') && !defender.hasAbility('Klutz');
    var hasType3Ability = defender.hasAbility('Haunted') || defender.hasAbility('Shadow Guard');
    var hasTeraShell = defender.hasAbility('Tera Shell') || defender.hasAbility('Teraform Zero (AI)');
    var type3 = '???';
    if (hasType3Ability) {
        if ((defender.hasAbility('Haunted'))) {
            var type3_1 = 'Ghost';
        }
        else if ((defender.hasAbility('Shadow Guard'))) {
            var type3_2 = 'Dark';
        }
    }
    ;
    var type1Effectiveness = (0, util_mech_1.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget);
    var type2Effectiveness = defender.types[1]
        ? (0, util_mech_1.getMoveEffectiveness)(gen, move, defender.types[1], isGhostRevealed, field.isGravity, isRingTarget)
        : 1;
    var type3Effectiveness = hasType3Ability
        ? (0, util_mech_1.getMoveEffectiveness)(gen, move, type3, isGhostRevealed, field.isGravity, isRingTarget)
        : 1;
    var typeEffectiveness = type1Effectiveness * type2Effectiveness * type3Effectiveness;
    var inverseTypeEffectiveness1 = (type1Effectiveness > 0)
        ? (1 / type1Effectiveness)
        : 2;
    var inverseTypeEffectiveness2 = (type2Effectiveness > 0)
        ? (1 / type2Effectiveness)
        : 2;
    var inverseTypeEffectiveness3 = (type3Effectiveness > 0)
        ? (1 / type3Effectiveness)
        : 2;
    var inverseTypeEffectiveness = inverseTypeEffectiveness1 * inverseTypeEffectiveness2 * inverseTypeEffectiveness3;
    if (defender.teraType) {
        typeEffectiveness = (0, util_mech_1.getMoveEffectiveness)(gen, move, defender.teraType, isGhostRevealed, field.isGravity, isRingTarget);
    }
    if (typeEffectiveness === 0 && move.hasType('Ground') &&
        defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz')) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0 && (move.named('Thousand Arrows', 'Hammer Smash') || (move.hasType('Ground') && move.flags.bone))) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0 && move.named('Overcharge', 'Ancient Cry')) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0 && attacker.hasAbility('Slayer') && move.hasType('Dragon')) {
        typeEffectiveness = 1;
    }
    if (typeEffectiveness === 0 && attacker.hasAbility('Nitric') && move.hasType('Poison')) {
        typeEffectiveness = 1;
    }
    if (field.gameType === 'Inverse') {
        typeEffectiveness = inverseTypeEffectiveness;
    }
    if (typeEffectiveness === 0) {
        return result;
    }
    if ((move.named('Sky Drop') &&
        (defender.hasType('Flying') || defender.weightkg >= 200 || field.isGravity)) ||
        (move.named('Synchronoise') && !defender.hasType(attacker.types[0]) &&
            (!attacker.types[1] || !defender.hasType(attacker.types[1]))) ||
        (move.named('Dream Eater') &&
            (!(defender.hasStatus('slp') || defender.hasAbility('Comatose')))) ||
        (move.named('Steel Roller') && !field.terrain) ||
        (move.named('Poltergeist') && !defender.item)) {
        return result;
    }
    if ((field.hasWeather('Harsh Sunshine') && move.hasType('Water')) ||
        (field.hasWeather('Heavy Rain') && move.hasType('Fire'))) {
        desc.weather = field.weather;
        return result;
    }
    if (field.hasWeather('Strong Winds') && defender.hasType('Flying') &&
        gen.types.get((0, util_1.toID)(move.type)).effectiveness['Flying'] > 1) {
        typeEffectiveness /= 2;
        desc.weather = field.weather;
    }
    if ((defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
        (move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
        (move.hasType('Fire') && defender.hasAbility('Flash Fire', 'Well-Baked Body', 'Steam Engine')) ||
        (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb', 'Steam Engine')) ||
        (move.hasType('Electric') &&
            defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
        (move.hasType('Ground') &&
            !field.isGravity && !move.named('Thousand Arrows') && !move.flags.bone &&
            !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
        (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
        (move.flags.sound && !move.named('Clangorous Soul') && defender.hasAbility('Soundproof')) ||
        (move.priority > 0 && defender.hasAbility('Queenly Majesty', 'Dazzling', 'Armor Tail')) ||
        (move.hasType('Ground') && defender.hasAbility('Earth Eater')) ||
        (move.flags.wind && defender.hasAbility('Wind Rider', 'Wind Power')) ||
        (move.hasType('Dark') && defender.hasAbility('Untainted')) ||
        (move.hasType('Dragon') && defender.hasAbility('Legend Armor')) ||
        (move.hasType('Psychic') && defender.hasAbility('Mental Block')) ||
        (move.hasType('Fairy') && defender.hasAbility('Corruption')) ||
        (move.hasType('Rock') && defender.hasAbility('Scaler')) ||
        (move.hasType('Bug') && defender.hasAbility('Pesticide'))) {
        desc.defenderAbility = defender.ability;
        return result;
    }
    if (move.hasType('Ground') && !move.named('Thousand Arrows') && !move.flags.bone &&
        !field.isGravity && defender.hasItem('Air Balloon')) {
        desc.defenderItem = defender.item;
        return result;
    }
    if (move.priority > 0 && field.hasTerrain('Psychic') && (0, util_mech_1.isGrounded)(defender, field)) {
        desc.terrain = field.terrain;
        return result;
    }
    var weightBasedMove = move.named('Heat Crash', 'Heavy Slam', 'Low Kick', 'Grass Knot');
    if (defender.isDynamaxed && weightBasedMove) {
        return result;
    }
    desc.HPEVs = "".concat(defender.ivs.hp, " HP");
    var fixedDamage = (0, util_mech_1.handleFixedDamageMoves)(attacker, move, defender);
    if (fixedDamage) {
        if (attacker.hasAbility('Parental Bond')) {
            result.damage = [fixedDamage, fixedDamage];
            desc.attackerAbility = attacker.ability;
        }
        else {
            result.damage = fixedDamage;
        }
        return result;
    }
    if (move.named('Final Gambit')) {
        result.damage = attacker.curHP();
        return result;
    }
    if (move.named('Guardian of Alola')) {
        var zLostHP = Math.floor((defender.curHP() * 3) / 4);
        if (field.defenderSide.isProtected && attacker.item && attacker.item.includes(' Z')) {
            zLostHP = Math.ceil(zLostHP / 4 - 0.5);
        }
        result.damage = zLostHP;
        return result;
    }
    if (move.named('Nature\'s Madness')) {
        var lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() / 2);
        result.damage = lostHP;
        return result;
    }
    if (move.named('Spectral Thief')) {
        var stat = void 0;
        for (stat in defender.boosts) {
            if (defender.boosts[stat]) {
                attacker.boosts[stat] +=
                    attacker.hasAbility('Contrary') ? -defender.boosts[stat] : defender.boosts[stat];
                if (attacker.boosts[stat] > 6)
                    attacker.boosts[stat] = 6;
                if (attacker.boosts[stat] < -6)
                    attacker.boosts[stat] = -6;
                attacker.stats[stat] = (0, util_mech_1.getModifiedStat)(attacker.rawStats[stat], attacker.boosts[stat]);
            }
        }
    }
    if (move.hits > 1) {
        desc.hits = move.hits;
    }
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower = calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc);
    if (basePower === 0) {
        return result;
    }
    var attack = calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var attackSource = move.named('Foul Play') ? defender : attacker;
    if (move.named('Photon Geyser', 'Light That Burns The Sky') ||
        (move.named('Tera Blast') && attackSource.teraType)) {
        move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
    }
    var attackStat = move.named('Shell Side Arm') &&
        (0, util_mech_1.getShellSideArmCategory)(attacker, defender) === 'Physical'
        ? 'atk'
        : move.named('Body Press')
            ? 'def'
            : move.category === 'Special'
                ? 'spa'
                : 'atk';
    var defense = calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical);
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
        (move.named('Shell Side Arm') && (0, util_mech_1.getShellSideArmCategory)(attacker, defender) === 'Physical');
    var defenseStat = hitsPhysical ? 'def' : 'spd';
    var baseDamage = (0, util_mech_1.getBaseDamage)(attacker.level, basePower, attack, defense);
    var isSpread = field.gameType === 'Doubles' &&
        ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
    if (isSpread) {
        baseDamage = (0, util_mech_1.pokeRound)((0, util_mech_1.OF32)(baseDamage * 3072) / 4096);
    }
    if (attacker.hasAbility('Parental Bond (Child)', 'Echo Chamber (Child)', 'Ambidextrous (Child)')) {
        baseDamage = (0, util_mech_1.pokeRound)((0, util_mech_1.OF32)(baseDamage * 1024) / 4096);
    }
    var noWeatherBoost = defender.hasItem('Utility Umbrella');
    if (!noWeatherBoost &&
        ((field.hasWeather('Sun', 'Harsh Sunshine') && (move.hasType('Fire') || move.named('Hydro Steam'))) ||
            (field.hasWeather('Rain', 'Heavy Rain') && (move.hasType('Water') || move.named('Hydro Steam'))))) {
        baseDamage = (0, util_mech_1.pokeRound)((0, util_mech_1.OF32)(baseDamage * 6144) / 4096);
        desc.weather = field.weather;
    }
    else if (!noWeatherBoost && !attacker.hasAbility('Steam Powered') &&
        ((field.hasWeather('Sun') && move.hasType('Water')) ||
            (field.hasWeather('Rain') && move.hasType('Fire')))) {
        baseDamage = (0, util_mech_1.pokeRound)((0, util_mech_1.OF32)(baseDamage * 2048) / 4096);
        desc.weather = field.weather;
    }
    if (hasTerrainSeed(defender) &&
        field.hasTerrain(defender.item.substring(0, defender.item.indexOf(' '))) &&
        items_1.SEED_BOOSTED_STAT[defender.item] === defenseStat) {
        desc.defenderItem = defender.item;
    }
    if (isCritical) {
        baseDamage = Math.floor((0, util_mech_1.OF32)(baseDamage * 1.5));
        desc.isCritical = isCritical;
    }
    var stabMod = 4096;
    if (attacker.hasOriginalType(move.type)) {
        stabMod += 2048;
    }
    else if (attacker.hasAbility('Protean', 'Libero') && !attacker.teraType) {
        stabMod += 2048;
        desc.attackerAbility = attacker.ability;
    }
    var teraType = attacker.teraType;
    if (teraType === move.type) {
        stabMod += 2048;
        desc.attackerTera = teraType;
    }
    if (attacker.hasAbility('Adaptability') && attacker.hasType(move.type)) {
        stabMod += teraType && attacker.hasOriginalType(teraType) ? 1024 : 2048;
        desc.attackerAbility = attacker.ability;
    }
    var applyBurn = attacker.hasStatus('brn') &&
        move.category === 'Physical' &&
        !attacker.hasAbility('Guts') &&
        !move.named('Facade');
    desc.isBurned = applyBurn;
    var applyFrostbite = attacker.hasStatus('frz') &&
        move.category === 'Special';
    desc.isFrostbite = applyFrostbite;
    var finalMods = calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness);
    var protect = false;
    if (field.defenderSide.isProtected &&
        (attacker.isDynamaxed || (move.isZ && attacker.item && attacker.item.includes(' Z')))) {
        protect = true;
        desc.isProtected = true;
    }
    var finalMod = (0, util_mech_1.chainMods)(finalMods, 41, 131072);
    var childDamage;
    if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Parental Bond (Child)';
        (0, util_mech_1.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateSMSSSV(gen, child, defender, move, field).damage;
        desc.attackerAbility = child.ability;
    }
    if (attacker.hasAbility('Echo Chamber') && move.flags.sound && move.category != 'Status' && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Echo Chamber (Child)';
        (0, util_mech_1.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateSMSSSV(gen, child, defender, move, field).damage;
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasAbility('Ambidextrous') && move.flags.punch && move.hits === 1 && !isSpread) {
        var child = attacker.clone();
        child.ability = 'Echo Chamber (Child)';
        (0, util_mech_1.checkMultihitBoost)(gen, child, defender, move, field, desc);
        childDamage = calculateSMSSSV(gen, child, defender, move, field).damage;
        desc.attackerAbility = attacker.ability;
    }
    var damage = [];
    for (var i = 0; i < 16; i++) {
        damage[i] =
            (0, util_mech_1.getFinalDamage)(baseDamage, i, typeEffectiveness, applyBurn, applyFrostbite, stabMod, finalMod, protect);
    }
    if (move.dropsStats && move.timesUsed > 1) {
        var simpleMultiplier = attacker.hasAbility('Simple') ? 2 : 1;
        desc.moveTurns = "over ".concat(move.timesUsed, " turns");
        var hasWhiteHerb = attacker.hasItem('White Herb');
        var usedWhiteHerb = false;
        var dropCount = attacker.boosts[attackStat];
        var _loop_1 = function (times) {
            var newAttack = (0, util_mech_1.getModifiedStat)(attack, dropCount);
            var damageMultiplier = 0;
            damage = damage.map(function (affectedAmount) {
                if (times) {
                    var newBaseDamage = (0, util_mech_1.getBaseDamage)(attacker.level, basePower, newAttack, defense);
                    var newFinalDamage = (0, util_mech_1.getFinalDamage)(newBaseDamage, damageMultiplier, typeEffectiveness, applyBurn, applyFrostbite, stabMod, finalMod, protect);
                    damageMultiplier++;
                    return affectedAmount + newFinalDamage;
                }
                return affectedAmount;
            });
            if (attacker.hasAbility('Contrary')) {
                dropCount = Math.min(6, dropCount + move.dropsStats);
                desc.attackerAbility = attacker.ability;
            }
            else {
                dropCount = Math.max(-6, dropCount - move.dropsStats * simpleMultiplier);
                if (attacker.hasAbility('Simple')) {
                    desc.attackerAbility = attacker.ability;
                }
            }
            if (hasWhiteHerb && attacker.boosts[attackStat] < 0 && !usedWhiteHerb) {
                dropCount += move.dropsStats * simpleMultiplier;
                usedWhiteHerb = true;
                desc.attackerItem = attacker.item;
            }
        };
        for (var times = 0; times < move.timesUsed; times++) {
            _loop_1(times);
        }
    }
    desc.attackBoost =
        move.named('Foul Play') ? defender.boosts[attackStat] : attacker.boosts[attackStat];
    result.damage = childDamage ? [damage, childDamage] : damage;
    return result;
}
exports.calculateSMSSSV = calculateSMSSSV;
function calculateBasePowerSMSSSV(gen, attacker, defender, move, field, hasAteAbilityTypeChange, desc) {
    var _a;
    var turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';
    var basePower;
    switch (move.name) {
        case 'Payback':
            basePower = move.bp * (turnOrder === 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Bolt Beak':
        case 'Fishious Rend':
            basePower = move.bp * (turnOrder !== 'last' ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Pursuit':
            var switching = field.defenderSide.isSwitching === 'out';
            basePower = move.bp * (switching ? 2 : 1);
            if (switching)
                desc.isSwitching = 'out';
            desc.moveBP = basePower;
            break;
        case 'Electro Ball':
            var r = Math.floor(attacker.stats.spe / defender.stats.spe);
            basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
            if (defender.stats.spe === 0)
                basePower = 40;
            desc.moveBP = basePower;
            break;
        case 'Gyro Ball':
            basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
            if (attacker.stats.spe === 0)
                basePower = 1;
            desc.moveBP = basePower;
            break;
        case 'Punishment':
            basePower = Math.min(200, 60 + 20 * (0, util_mech_1.countBoosts)(gen, defender.boosts));
            desc.moveBP = basePower;
            break;
        case 'Low Kick':
        case 'Grass Knot':
            var w = defender.weightkg * (0, util_mech_1.getWeightFactor)(defender);
            basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Hex':
        case 'Infernal Parade':
            basePower = move.bp * (defender.status || defender.hasAbility('Comatose') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Barb Barrage':
            basePower = move.bp * (defender.hasStatus('psn', 'tox') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Heavy Slam':
        case 'Heat Crash':
            var wr = (attacker.weightkg * (0, util_mech_1.getWeightFactor)(attacker)) /
                (defender.weightkg * (0, util_mech_1.getWeightFactor)(defender));
            basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
            desc.moveBP = basePower;
            break;
        case 'Stored Power':
        case 'Power Trip':
            basePower = 20 + 20 * (0, util_mech_1.countBoosts)(gen, attacker.boosts);
            desc.moveBP = basePower;
            break;
        case 'Acrobatics':
            basePower = move.bp * (attacker.hasItem('Flying Gem') || !attacker.item ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Assurance':
            basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
            break;
        case 'Wake-Up Slap':
            basePower = move.bp * (defender.hasStatus('slp') || defender.hasAbility('Comatose') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Smelling Salts':
            basePower = move.bp * (defender.hasStatus('par') ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Weather Ball':
            basePower = move.bp * (field.weather && !field.hasWeather('Strong Winds') ? 2 : 1);
            if (field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain') &&
                attacker.hasItem('Utility Umbrella'))
                basePower = move.bp;
            desc.moveBP = basePower;
            break;
        case 'Terrain Pulse':
            basePower = move.bp * ((0, util_mech_1.isGrounded)(attacker, field) && field.terrain ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Rising Voltage':
            basePower = move.bp * (((0, util_mech_1.isGrounded)(defender, field) && field.hasTerrain('Electric')) ? 2 : 1);
            desc.moveBP = basePower;
            break;
        case 'Fling':
            basePower = (0, items_1.getFlingPower)(attacker.item);
            desc.moveBP = basePower;
            desc.attackerItem = attacker.item;
            break;
        case 'Dragon Energy':
        case 'Eruption':
        case 'Water Spout':
            basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
            desc.moveBP = basePower;
            break;
        case 'Flail':
        case 'Reversal':
            var p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
            basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Natural Gift':
            if ((_a = attacker.item) === null || _a === void 0 ? void 0 : _a.includes('Berry')) {
                var gift = (0, items_1.getNaturalGift)(gen, attacker.item);
                basePower = gift.p;
                desc.attackerItem = attacker.item;
                desc.moveBP = move.bp;
            }
            else {
                basePower = move.bp;
            }
            break;
        case 'Nature Power':
            move.category = 'Special';
            move.secondaries = true;
            switch (field.terrain) {
                case 'Electric':
                    basePower = 90;
                    desc.moveName = 'Thunderbolt';
                    break;
                case 'Grassy':
                    basePower = 90;
                    desc.moveName = 'Energy Ball';
                    break;
                case 'Misty':
                    basePower = 95;
                    desc.moveName = 'Moonblast';
                    break;
                case 'Psychic':
                    basePower = 90;
                    desc.moveName = 'Psychic';
                    break;
                default:
                    basePower = 80;
                    desc.moveName = 'Tri Attack';
            }
            break;
        case 'Water Shuriken':
            basePower = attacker.named('Greninja-Ash') && attacker.hasAbility('Battle Bond') ? 20 : 15;
            desc.moveBP = basePower;
            break;
        case 'Triple Axel':
            basePower = move.hits === 2 ? 30 : move.hits === 3 ? 40 : 20;
            desc.moveBP = basePower;
            break;
        case 'Triple Kick':
            basePower = move.hits === 2 ? 15 : move.hits === 3 ? 30 : 10;
            desc.moveBP = basePower;
            break;
        case 'Crush Grip':
        case 'Wring Out':
            basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
            basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
            desc.moveBP = basePower;
            break;
        default:
            basePower = move.bp;
    }
    if (basePower === 0) {
        return 0;
    }
    if (move.named('Breakneck Blitz', 'Bloom Doom', 'Inferno Overdrive', 'Hydro Vortex', 'Gigavolt Havoc', 'Subzero Slammer', 'Supersonic Skystrike', 'Savage Spin-Out', 'Acid Downpour', 'Tectonic Rage', 'Continental Crush', 'All-Out Pummeling', 'Shattered Psyche', 'Never-Ending Nightmare', 'Devastating Drake', 'Black Hole Eclipse', 'Corkscrew Crash', 'Twinkle Tackle')) {
        desc.moveBP = move.bp;
    }
    var bpMods = calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder);
    basePower = (0, util_mech_1.OF16)(Math.max(1, (0, util_mech_1.pokeRound)((basePower * (0, util_mech_1.chainMods)(bpMods, 41, 2097152)) / 4096)));
    if (attacker.teraType && move.type === attacker.teraType &&
        attacker.hasType(attacker.teraType) && move.hits === 1 &&
        move.priority <= 0 && move.bp > 0 && !move.named('Dragon Energy', 'Eruption', 'Water Spout') &&
        basePower < 60 && gen.num >= 9) {
        basePower = 60;
        desc.moveBP = 60;
    }
    return basePower;
}
exports.calculateBasePowerSMSSSV = calculateBasePowerSMSSSV;
function calculateBPModsSMSSSV(gen, attacker, defender, move, field, desc, basePower, hasAteAbilityTypeChange, turnOrder) {
    var bpMods = [];
    var resistedKnockOffDamage = !defender.item ||
        (defender.named('Dialga-Origin') && defender.hasItem('Adamant Crystal')) ||
        (defender.named('Palkia-Origin') && defender.hasItem('Lustrous Globe')) ||
        (defender.name.includes('Giratina-Origin') && defender.item.includes('Griseous')) ||
        (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
        (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
        (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
        (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
        (defender.name.includes('Silvally') && defender.item.includes('Memory')) ||
        defender.item.includes(' Z') ||
        (defender.named('Zacian') && defender.hasItem('Rusted Sword')) ||
        (defender.named('Zamazenta') && defender.hasItem('Rusted Shield') ||
            (defender.named('Venomicon-Epilogue') && defender.hasItem('Vile Vial')));
    if (!resistedKnockOffDamage && defender.item) {
        var item = gen.items.get((0, util_1.toID)(defender.item));
        resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
    }
    if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox', 'frz')) ||
        (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
        (move.named('Venoshock') && defender.hasStatus('psn', 'tox')) ||
        (move.named('Lash Out') && ((0, util_mech_1.countBoosts)(gen, attacker.boosts) < 0))) {
        bpMods.push(8192);
        desc.moveBP = basePower * 2;
    }
    else if (move.named('Expanding Force') && (0, util_mech_1.isGrounded)(attacker, field) && field.hasTerrain('Psychic')) {
        move.target = 'allAdjacentFoes';
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if ((move.named('Knock Off') && !resistedKnockOffDamage) ||
        (move.named('Misty Explosion', 'Rolling Fog') && (0, util_mech_1.isGrounded)(attacker, field) && field.hasTerrain('Misty')) ||
        (move.named('PsyBlade') && field.hasTerrain('Electric')) ||
        (move.named('Grav Apple') && field.isGravity)) {
        bpMods.push(6144);
        desc.moveBP = basePower * 1.5;
    }
    else if (move.named('Solar Beam', 'Solar Blade') &&
        field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail', 'Snow')) {
        bpMods.push(2048);
        desc.moveBP = basePower / 2;
        desc.weather = field.weather;
    }
    else if (move.named('Collision Course', 'Electro Drift')) {
        var isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
        var isRingTarget = defender.hasItem('Ring Target') && !defender.hasAbility('Klutz');
        var type1Effectiveness = (0, util_mech_1.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget);
        var type2Effectiveness = defender.types[1] ? (0, util_mech_1.getMoveEffectiveness)(gen, move, defender.types[0], isGhostRevealed, field.isGravity, isRingTarget) : 1;
        if (type1Effectiveness * type2Effectiveness >= 2) {
            bpMods.push(5461);
            desc.moveBP = basePower * (5461 / 4096);
        }
    }
    if (field.attackerSide.isHelpingHand) {
        bpMods.push(6144);
        desc.isHelpingHand = true;
    }
    var terrainMultiplier = 6144;
    if ((0, util_mech_1.isGrounded)(attacker, field)) {
        if ((field.hasTerrain('Electric') && move.hasType('Electric')) ||
            (field.hasTerrain('Grassy') && move.hasType('Grass')) ||
            (field.hasTerrain('Psychic') && move.hasType('Psychic'))) {
            bpMods.push(terrainMultiplier);
            desc.terrain = field.terrain;
        }
    }
    if ((0, util_mech_1.isGrounded)(defender, field)) {
        if ((field.hasTerrain('Misty') && move.hasType('Dragon')) ||
            (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake'))) {
            bpMods.push(2048);
            desc.terrain = field.terrain;
        }
    }
    if ((attacker.hasAbility('Technician') && basePower <= 60) ||
        (attacker.hasAbility('Flare Boost') &&
            attacker.hasStatus('brn') && move.category === 'Special') ||
        (attacker.hasAbility('Toxic Boost') &&
            attacker.hasStatus('psn', 'tox') && move.category === 'Physical') ||
        (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
        (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
        (attacker.hasAbility('Steely Spirit') && move.hasType('Steel')) ||
        (attacker.hasAbility('Sharpness') && move.flags.slicing) ||
        (attacker.hasAbility('Fever Pitch') && move.hasType('Poison')) ||
        (attacker.hasAbility('Subwoofer') && move.flags.sound && basePower <= 70)) {
        bpMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    var aura = "".concat(move.type, " Aura");
    var isAttackerAura = attacker.hasAbility(aura) || attacker.hasAbility('Gaia Force');
    var isDefenderAura = defender.hasAbility(aura) || defender.hasAbility('Gaia Force');
    var isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
    var isFieldAuraBreak = field.isAuraBreak;
    var isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
    var isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
    var isFieldGaiaForce = field.isGaiaForce && move.type === 'Ground';
    var auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura || isFieldGaiaForce;
    var auraBreak = isFieldAuraBreak || isUserAuraBreak;
    if (auraActive) {
        if (auraBreak) {
            bpMods.push(3072);
            desc.attackerAbility = attacker.ability;
            desc.defenderAbility = defender.ability;
        }
        else {
            bpMods.push(5448);
            if (isAttackerAura)
                desc.attackerAbility = attacker.ability;
            if (isDefenderAura)
                desc.defenderAbility = defender.ability;
        }
    }
    if ((attacker.hasAbility('Sheer Force') &&
        (move.secondaries || move.named('Jet Punch', 'Order Up')) && !move.isMax) ||
        (attacker.hasAbility('Sand Force') &&
            field.hasWeather('Sand') && move.hasType('Rock', 'Ground', 'Steel')) ||
        (attacker.hasAbility('Analytic') &&
            (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
        (attacker.hasAbility('Tough Claws') && move.flags.contact) ||
        (attacker.hasAbility('Punk Rock') && move.flags.sound) ||
        (attacker.hasAbility('Gavel Power') && move.flags.hammer) ||
        (attacker.hasAbility('Tight Focus') && move.flags.beam) ||
        (attacker.hasAbility('Ballistic') && move.flags.bullet)) {
        bpMods.push(5325);
        desc.attackerAbility = attacker.ability;
    }
    if (field.attackerSide.isBattery && move.category === 'Special') {
        bpMods.push(5325);
        desc.isBattery = true;
    }
    if (field.attackerSide.isPowerSpot) {
        bpMods.push(5325);
        desc.isPowerSpot = true;
    }
    if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
        if (attacker.gender === defender.gender) {
            bpMods.push(5120);
            desc.rivalry = 'buffed';
        }
        else {
            bpMods.push(3072);
            desc.rivalry = 'nerfed';
        }
        desc.attackerAbility = attacker.ability;
    }
    if (!move.isMax && hasAteAbilityTypeChange) {
        bpMods.push(4915);
    }
    if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
        (attacker.hasAbility('Iron Fist') && move.flags.punch) ||
        (attacker.hasAbility('Vampiric') && move.flags.bite) ||
        (attacker.hasAbility('Step Master') && move.flags.kicking)) {
        bpMods.push(4915);
        desc.attackerAbility = attacker.ability;
    }
    if (attacker.hasItem('Punching Glove') && move.flags.punch) {
        bpMods.push(4506);
        desc.attackerItem = attacker.item;
    }
    if (attacker.hasItem('Mjolnir') && (!attacker.hasAbility('Gavel Power')) && move.flags.hammer) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    if (attacker.hasItem('Sheath') && (!attacker.hasAbility('Sharpness')) && move.flags.slicing) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
        bpMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
        bpMods.push(5120);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasAbility('Supreme Overlord') && attacker.alliesFainted) {
        var powMod = [4096, 4506, 4915, 5325, 5734, 6144];
        bpMods.push(powMod[Math.min(5, attacker.alliesFainted)]);
        desc.attackerAbility = attacker.ability;
        desc.alliesFainted = attacker.alliesFainted;
    }
    if (attacker.hasItem("".concat(move.type, " Gem"))) {
        bpMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    else if (((attacker.hasItem('Adamant Crystal') && attacker.named('Dialga-Origin')) ||
        (attacker.hasItem('Adamant Orb') && attacker.named('Dialga')) &&
            move.hasType('Steel', 'Dragon')) ||
        ((attacker.hasItem('Lustrous Orb') &&
            attacker.named('Palkia')) ||
            (attacker.hasItem('Lustrous Globe') && attacker.named('Palkia-Origin')) &&
                move.hasType('Water', 'Dragon')) ||
        ((attacker.hasItem('Griseous Orb') || attacker.hasItem('Griseous Core')) &&
            (attacker.named('Giratina-Origin') || attacker.named('Giratina')) &&
            move.hasType('Ghost', 'Dragon')) ||
        (attacker.hasItem('Vile Vial') &&
            attacker.named('Venomicon-Epilogue') &&
            move.hasType('Poison', 'Flying')) ||
        attacker.item && move.hasType((0, items_1.getItemBoostType)(attacker.item))) {
        bpMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if ((attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
        (attacker.hasItem('Wise Glasses') && move.category === 'Special')) {
        bpMods.push(4505);
        desc.attackerItem = attacker.item;
    }
    return bpMods;
}
exports.calculateBPModsSMSSSV = calculateBPModsSMSSSV;
function calculateAttackSMSSSV(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var attack;
    var attackSource = move.named('Foul Play') ? defender : attacker;
    if (move.named('Photon Geyser', 'Light That Burns The Sky') ||
        (move.named('Tera Blast') && attackSource.teraType)) {
        move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
    }
    var attackStat = move.named('Shell Side Arm') &&
        (0, util_mech_1.getShellSideArmCategory)(attacker, defender) === 'Physical'
        ? 'atk'
        : move.named('Body Press')
            ? 'def'
            : move.category === 'Special'
                ? 'spa'
                : 'atk';
    desc.attackEVs =
        move.named('Foul Play')
            ? (0, util_mech_1.getEVDescriptionText)(gen, defender, attackStat, defender.nature)
            : (0, util_mech_1.getEVDescriptionText)(gen, attacker, attackStat, attacker.nature);
    if (attackSource.boosts[attackStat] === 0 ||
        (isCritical && attackSource.boosts[attackStat] < 0)) {
        attack = attackSource.rawStats[attackStat];
    }
    else if (defender.hasAbility('Unaware')) {
        attack = attackSource.rawStats[attackStat];
        desc.defenderAbility = defender.ability;
    }
    else {
        attack = attackSource.stats[attackStat];
        desc.attackBoost = attackSource.boosts[attackStat];
    }
    if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
        attack = (0, util_mech_1.pokeRound)((attack * 3) / 2);
        desc.attackerAbility = attacker.ability;
    }
    var atMods = calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc);
    attack = (0, util_mech_1.OF16)(Math.max(1, (0, util_mech_1.pokeRound)((attack * (0, util_mech_1.chainMods)(atMods, 410, 131072)) / 4096)));
    return attack;
}
exports.calculateAttackSMSSSV = calculateAttackSMSSSV;
function calculateAtModsSMSSSV(gen, attacker, defender, move, field, desc) {
    var atMods = [];
    if ((attacker.hasAbility('Slow Start') && attacker.abilityOn &&
        (move.category === 'Physical' || (move.category === 'Special' && move.isZ))) ||
        (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2)) {
        atMods.push(2048);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Solar Power') &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.category === 'Special') ||
        (attacker.named('Cherrim') &&
            attacker.hasAbility('Flower Gift') &&
            field.hasWeather('Sun', 'Harsh Sunshine') &&
            move.category === 'Physical') ||
        (attacker.hasAbility('Gorilla Tactics') && move.category === 'Physical' &&
            !attacker.isDynamaxed)) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
        desc.weather = field.weather;
    }
    else if (field.attackerSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.category === 'Physical') {
        atMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftAttacker = true;
    }
    else if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
        (attacker.curHP() <= attacker.maxHP() / 3 &&
            ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
                (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
                (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
                (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
        (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
        atMods.push(6144);
        desc.attackerAbility = 'Flash Fire';
    }
    else if ((attacker.hasAbility('Steelworker') && move.hasType('Steel')) ||
        (attacker.hasAbility('Dragon\'s Maw') && move.hasType('Dragon')) ||
        (attacker.hasAbility('Transistor') && move.hasType('Electric')) ||
        (attacker.hasAbility('Rocky Payload') && move.hasType('Rock'))) {
        atMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Stakeout') && attacker.abilityOn) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    else if ((attacker.hasAbility('Water Bubble') && move.hasType('Water')) ||
        (attacker.hasAbility('Fairy Bubble') && move.hasType('Fairy')) ||
        (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical') ||
        (attacker.hasAbility('Composure') && move.category === 'Special')) {
        atMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
        (defender.hasAbility('Water Bubble') && move.hasType('Fire')) ||
        (defender.hasAbility('Fairy Bubble') && move.hasType('Poison')) ||
        (defender.hasAbility('Purifying Salt') && move.hasType('Ghost'))) {
        atMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    var isTabletsOfRuinActive = defender.hasAbility('Tablets of Ruin') || field.isTabletsOfRuin;
    var isVesselOfRuinActive = defender.hasAbility('Vessel of Ruin') || field.isVesselOfRuin;
    if ((isTabletsOfRuinActive && move.category === 'Physical') ||
        (isVesselOfRuinActive && move.category === 'Special')) {
        if (defender.hasAbility('Tablets of Ruin') || defender.hasAbility('Vessel of Ruin')) {
            desc.defenderAbility = defender.ability;
        }
        else {
            desc[move.category === 'Special' ? 'isVesselOfRuin' : 'isTabletsOfRuin'] = true;
        }
        atMods.push(3072);
    }
    if ((attacker.hasAbility('Protosynthesis') &&
        (field.hasWeather('Sun') || attacker.hasItem('Booster Energy'))) ||
        (attacker.hasAbility('Quark Drive') &&
            (field.hasTerrain('Electric') || attacker.hasItem('Booster Energy')))) {
        if ((move.category === 'Physical' &&
            (0, util_mech_1.getMostProficientStat)(attacker) === 'atk') ||
            (move.category === 'Special' && (0, util_mech_1.getMostProficientStat)(attacker) === 'spa')) {
            atMods.push(5325);
            desc.attackerAbility = attacker.ability;
        }
    }
    if ((attacker.hasAbility('Hadron Engine') && move.category === 'Special' &&
        field.hasTerrain('Electric') && (0, util_mech_1.isGrounded)(attacker, field)) ||
        (attacker.hasAbility('Orichalcum Pulse') && move.category === 'Physical' &&
            field.hasWeather('Sun', 'Harsh Sunshine') && !attacker.hasItem('Utility Umbrella'))) {
        atMods.push(5461);
        desc.attackerAbility = attacker.ability;
    }
    if ((attacker.hasItem('Thick Club') &&
        attacker.named('Cubone', 'Marowak', 'Marowak-Alola', 'Marowak-Alola-Totem') &&
        move.category === 'Physical') ||
        (attacker.hasItem('Deep Sea Tooth') &&
            attacker.named('Clamperl') &&
            move.category === 'Special') ||
        (attacker.hasItem('Light Ball') && attacker.name.includes('Pikachu') && !move.isZ)) {
        atMods.push(8192);
        desc.attackerItem = attacker.item;
    }
    else if (!move.isZ && !move.isMax &&
        ((attacker.hasItem('Choice Band') && move.category === 'Physical') ||
            (attacker.hasItem('Choice Specs') && move.category === 'Special') ||
            attacker.hasItem("Soul Dew") && move.category === 'Special' && attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega'))) {
        atMods.push(6144);
        desc.attackerItem = attacker.item;
    }
    return atMods;
}
exports.calculateAtModsSMSSSV = calculateAtModsSMSSSV;
function calculateDefenseSMSSSV(gen, attacker, defender, move, field, desc, isCritical) {
    if (isCritical === void 0) { isCritical = false; }
    var defense;
    var hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
        (move.named('Shell Side Arm') && (0, util_mech_1.getShellSideArmCategory)(attacker, defender) === 'Physical');
    var defenseStat = hitsPhysical ? 'def' : 'spd';
    desc.defenseEVs = (0, util_mech_1.getEVDescriptionText)(gen, defender, defenseStat, defender.nature);
    if (defender.boosts[defenseStat] === 0 ||
        (isCritical && defender.boosts[defenseStat] > 0) ||
        move.ignoreDefensive) {
        defense = defender.rawStats[defenseStat];
    }
    else if (attacker.hasAbility('Unaware')) {
        defense = defender.rawStats[defenseStat];
        desc.attackerAbility = attacker.ability;
    }
    else {
        defense = defender.stats[defenseStat];
        desc.defenseBoost = defender.boosts[defenseStat];
    }
    if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
        defense = (0, util_mech_1.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    if (field.hasWeather('Snow') && defender.hasType('Ice') && hitsPhysical) {
        defense = (0, util_mech_1.pokeRound)((defense * 3) / 2);
        desc.weather = field.weather;
    }
    var dfMods = calculateDfModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical);
    return (0, util_mech_1.OF16)(Math.max(1, (0, util_mech_1.pokeRound)((defense * (0, util_mech_1.chainMods)(dfMods, 410, 131072)) / 4096)));
}
exports.calculateDefenseSMSSSV = calculateDefenseSMSSSV;
function calculateDfModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, hitsPhysical) {
    var _a;
    if (isCritical === void 0) { isCritical = false; }
    if (hitsPhysical === void 0) { hitsPhysical = false; }
    var dfMods = [];
    if (defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.named('Cherrim') &&
        defender.hasAbility('Flower Gift') &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
        desc.weather = field.weather;
    }
    else if (field.defenderSide.isFlowerGift &&
        field.hasWeather('Sun', 'Harsh Sunshine') &&
        !hitsPhysical) {
        dfMods.push(6144);
        desc.weather = field.weather;
        desc.isFlowerGiftDefender = true;
    }
    else if (defender.hasAbility('Grass Pelt') &&
        field.hasTerrain('Grassy') &&
        hitsPhysical) {
        dfMods.push(6144);
        desc.defenderAbility = defender.ability;
    }
    else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
        dfMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    var isSwordOfRuinActive = attacker.hasAbility('Sword of Ruin') || field.isSwordOfRuin;
    var isBeadsOfRuinActive = attacker.hasAbility('Beads of Ruin') || field.isBeadsOfRuin;
    if ((isSwordOfRuinActive && hitsPhysical) ||
        (isBeadsOfRuinActive && !hitsPhysical)) {
        if (attacker.hasAbility('Sword of Ruin') || attacker.hasAbility('Beads of Ruin')) {
            desc.attackerAbility = attacker.ability;
        }
        else {
            desc[hitsPhysical ? 'isSwordOfRuin' : 'isBeadsOfRuin'] = true;
        }
        dfMods.push(3072);
    }
    if (move.named('Explosion', 'Self-Destruct', 'Misty Explosion')) {
        dfMods.push(2048);
    }
    if ((defender.hasAbility('Protosynthesis') &&
        (field.hasWeather('Sun') || attacker.hasItem('Booster Energy'))) ||
        (defender.hasAbility('Quark Drive') &&
            (field.hasTerrain('Electric') || attacker.hasItem('Booster Energy')))) {
        if ((hitsPhysical && (0, util_mech_1.getMostProficientStat)(defender) === 'def') ||
            (!hitsPhysical && (0, util_mech_1.getMostProficientStat)(defender) === 'spd')) {
            desc.defenderAbility = defender.ability;
            dfMods.push(5324);
        }
    }
    if ((defender.hasItem('Eviolite') && ((_a = gen.species.get((0, util_1.toID)(defender.name))) === null || _a === void 0 ? void 0 : _a.nfe)) ||
        (!hitsPhysical && defender.hasItem('Assault Vest')) ||
        (defender.hasItem("Soul Dew") && move.category === 'Special' && defender.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega'))) {
        dfMods.push(6144);
        desc.defenderItem = defender.item;
    }
    else if ((defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
        (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)) {
        dfMods.push(8192);
        desc.defenderItem = defender.item;
    }
    return dfMods;
}
exports.calculateDfModsSMSSSV = calculateDfModsSMSSSV;
function calculateFinalModsSMSSSV(gen, attacker, defender, move, field, desc, isCritical, typeEffectiveness) {
    if (isCritical === void 0) { isCritical = false; }
    var finalMods = [];
    if (field.defenderSide.isReflect && move.category === 'Physical' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isReflect = true;
    }
    else if (field.defenderSide.isLightScreen && move.category === 'Special' &&
        !isCritical && !field.defenderSide.isAuroraVeil) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isLightScreen = true;
    }
    if (field.defenderSide.isAuroraVeil && !isCritical) {
        finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
        desc.isAuroraVeil = true;
    }
    if (attacker.hasAbility('Neuroforce') && typeEffectiveness > 1) {
        finalMods.push(5120);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Sniper') && isCritical) {
        finalMods.push(6144);
        desc.attackerAbility = attacker.ability;
    }
    else if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
        finalMods.push(8192);
        desc.attackerAbility = attacker.ability;
    }
    if (defender.isDynamaxed && move.named('Dynamax Cannon', 'Behemoth Blade', 'Behemoth Bash')) {
        finalMods.push(8192);
    }
    if (defender.hasAbility('Multiscale', 'Shadow Shield') &&
        defender.curHP() === defender.maxHP() &&
        !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
        !attacker.hasAbility('Parental Bond (Child)')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Fluffy') && move.flags.contact && !attacker.hasAbility('Long Reach')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    else if ((defender.hasAbility('Punk Rock') && move.flags.sound) ||
        (defender.hasAbility('Ice Scales') && move.category === 'Special')) {
        finalMods.push(2048);
        desc.defenderAbility = defender.ability;
    }
    if (defender.hasAbility('Solid Rock', 'Filter', 'Prism Armor') && typeEffectiveness > 1) {
        finalMods.push(3072);
        desc.defenderAbility = defender.ability;
    }
    if (field.defenderSide.isFriendGuard) {
        finalMods.push(3072);
        desc.isFriendGuard = true;
    }
    if (defender.hasAbility('Fluffy') && move.hasType('Fire')) {
        finalMods.push(8192);
        desc.defenderAbility = defender.ability;
    }
    if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
        finalMods.push(4915);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Life Orb')) {
        finalMods.push(5324);
        desc.attackerItem = attacker.item;
    }
    else if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome >= 1) {
        var timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome);
        if (timesUsedWithMetronome <= 4) {
            finalMods.push(4096 + timesUsedWithMetronome * 819);
        }
        else {
            finalMods.push(8192);
        }
        desc.attackerItem = attacker.item;
    }
    if (move.hasType((0, items_1.getBerryResistType)(defender.item)) &&
        (typeEffectiveness > 1 || move.hasType('Normal')) &&
        !attacker.hasAbility('Unnerve', 'As One (Glastrier)', 'As One (Spectrier)')) {
        if (defender.hasAbility('Ripen')) {
            finalMods.push(1024);
        }
        else {
            finalMods.push(2048);
        }
        desc.defenderItem = defender.item;
    }
    return finalMods;
}
exports.calculateFinalModsSMSSSV = calculateFinalModsSMSSSV;
function hasTerrainSeed(pokemon) {
    return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}
//# sourceMappingURL=gen789.js.map