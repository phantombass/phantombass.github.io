import { Generation } from '../src/interface';
import { Field } from '../src/field';
import { Move } from '../src/move';
import { Pokemon } from '../src/pokemon';
import { Result } from '../src/result';
export declare function calculateDPP(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field): Result;
