import {Field} from './field';
import {Generation} from './interface';
import {Move} from './move';
import {Pokemon} from './pokemon';
import {Result} from './result';

import {calculateRBYGSC} from './gen12';
import {calculateADV} from './gen3';
import {calculateDPP} from './gen4';
import {calculateBWXY} from './gen56';
import {calculateSMSSSV} from './gen789';

const MECHANICS = [
  () => {},
  calculateRBYGSC,
  calculateRBYGSC,
  calculateADV,
  calculateDPP,
  calculateBWXY,
  calculateBWXY,
  calculateSMSSSV,
  calculateSMSSSV,
  calculateSMSSSV,
];

export function calculate(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field?: Field,
) {
  return MECHANICS[gen.num](
    gen,
    attacker.clone(),
    defender.clone(),
    move.clone(),
    field ? field.clone() : new Field()
  ) as Result;
}
