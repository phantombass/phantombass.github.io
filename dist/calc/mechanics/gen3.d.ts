import { Generation } from '../src/interface';
import { Pokemon } from '../src/pokemon';
import { Move } from '../src/move';
import { Field } from '../src/field';
import { Result } from '../src/result';
export declare function calculateADV(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field): Result;
