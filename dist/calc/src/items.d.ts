import { Generation, TypeName, StatID } from './interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatID;
};
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 40 | 20 | 50 | 80 | 60 | 100 | 10 | 130 | 85 | 110 | 95 | 90 | 70 | 30;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Fire" | "Water" | "Ice" | undefined;
export declare function getMultiAttack(item: string): TypeName | undefined;
