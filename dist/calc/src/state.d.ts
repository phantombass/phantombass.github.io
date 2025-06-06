import * as I from './data/interface';
export declare namespace State {
    interface Pokemon {
        name: I.SpeciesName;
        level?: number;
        ability?: I.AbilityName;
        abilityOn?: boolean;
        isDynamaxed?: boolean;
        isSaltCure?: boolean;
        alliesFainted?: number;
        item?: I.ItemName;
        gender?: I.GenderName;
        nature?: I.NatureName;
        ivs?: Partial<I.StatsTable>;
        evs?: Partial<I.StatsTable>;
        boosts?: Partial<I.StatsTable>;
        originalCurHP?: number;
        status?: I.StatusName | '';
        teraType?: I.TypeName;
        toxicCounter?: number;
        moves?: I.MoveName[];
        overrides?: Partial<I.Specie>;
    }
    interface Move {
        name: I.MoveName;
        useZ?: boolean;
        useMax?: boolean;
        isCrit?: boolean;
        hits?: number;
        timesUsed?: number;
        timesUsedWithMetronome?: number;
        overrides?: Partial<I.Move>;
    }
    interface Field {
        gameType: I.GameType;
        weather?: I.Weather;
        terrain?: I.Terrain;
        isMagicRoom?: boolean;
        isWonderRoom?: boolean;
        isGravity?: boolean;
        isAuraBreak?: boolean;
        isFairyAura?: boolean;
        isDarkAura?: boolean;
        isGaiaForce?: boolean;
        isFeverPitch?: boolean;
        isBeadsOfRuin?: boolean;
        isSwordOfRuin?: boolean;
        isTabletsOfRuin?: boolean;
        isVesselOfRuin?: boolean;
        attackerSide: Side;
        defenderSide: Side;
    }
    interface Side {
        spikes?: number;
        steelsurge?: boolean;
        vinelash?: boolean;
        wildfire?: boolean;
        cannonade?: boolean;
        volcalith?: boolean;
        isSR?: boolean;
        isReflect?: boolean;
        isLightScreen?: boolean;
        isProtected?: boolean;
        isSeeded?: boolean;
        isForesight?: boolean;
        isTailwind?: boolean;
        isHelpingHand?: boolean;
        isFlowerGift?: boolean;
        isFriendGuard?: boolean;
        isAuroraVeil?: boolean;
        isBattery?: boolean;
        isPowerSpot?: boolean;
        isSwitching?: 'out' | 'in';
    }
}
