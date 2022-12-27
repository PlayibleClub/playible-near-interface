import { ATHLETE, ATHLETE_PROMO } from 'data/constants/nearContracts';
import { getContract } from 'utils/near';
export const NFL_POSITIONS = {
  QB: 'QUARTER BACK',
  RB: 'RUNNING BACK',
  WR: 'WIDE RECEIVER',
  TE: 'TIGHT END',
}

export const SPORT_TYPES = [
  {
    key: 'NFL',
    sport: 'FOOTBALL',
    regContract: getContract(ATHLETE),
    promoContract: getContract(ATHLETE_PROMO)
  },
  {
    key: 'NBA',
    sport: 'BASKETBALL',
    regContract: getContract(ATHLETE),
    promoContract: getContract(ATHLETE_PROMO),
  }];