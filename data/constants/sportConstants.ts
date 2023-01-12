import {
  ATHLETE_NFL,
  ATHLETE_PROMO_NFL,
  GAME_NFL,
  MINTER_NFL,
  MINTER_BASKETBALL,
  PACK_NFL,
  PACK_PROMO_NFL,
  PACK_BASKETBALL,
  PACK_PROMO_BASKETBALL,
  ATHLETE_BASKETBALL,
  ATHLETE_PROMO_BASKETBALL,
  OPENPACK_NFL,
  OPENPACK_PROMO_NFL,
  OPENPACK_BASKETBALL,
  OPENPACK_PROMO_BASKETBALL,
  GAME_BASKETBALL,
} from 'data/constants/nearContracts';
import { getContract } from 'utils/near';
export const NFL_POSITIONS = [
  {
    name: 'QUARTER BACK',
    key: 'QB',
  },
  {
    name: 'RUNNING BACK',
    key: 'RB',
  },
  {
    name: 'WIDE RECEIVER',
    key: 'WR',
  },
  {
    name: 'TIGHT END',
    key: 'TE',
  },
];
export const EXTRA_NFL = [
  {
    name: 'FLEX',
    key: ['RB', 'WR', 'TE'],
  },
  {
    name: 'SUPERFLEX',
    key: ['QR', 'RB', 'WR', 'TE'],
  },
];
export const NBA_POSITIONS = [
  {
    name: 'POINT GUARD',
    key: 'PG',
  },
  {
    name: 'SHOOTING GUARD',
    key: 'SG',
  },
  {
    name: 'SMALL FORWARD',
    key: 'SF',
  },
  {
    name: 'POWER FORWARD',
    key: 'PF',
  },
  {
    name: 'CENTER',
    key: 'C',
  },
];
export const EXTRA_NBA = [
  {
    name: 'GUARD',
    key: ['PG', 'SG'],
  },
  {
    name: 'FORWARD',
    key: ['SF', 'PF'],
  },
  {
    name: 'ANY',
    key: ['PG', 'SG', 'SF', 'PF', 'C'],
  },
];

export const SPORT_TYPES = [
  {
    key: 'NFL',
    sport: 'FOOTBALL',
    mintContract: getContract(MINTER_NFL),
    packContract: getContract(PACK_NFL),
    packPromoContract: getContract(PACK_PROMO_NFL),
    regContract: getContract(ATHLETE_NFL),
    promoContract: getContract(ATHLETE_PROMO_NFL),
    openContract: getContract(OPENPACK_NFL),
    openPromoContract: getContract(OPENPACK_PROMO_NFL),
    gameContract: getContract(GAME_NFL),
    positionList: NFL_POSITIONS,
    extra: EXTRA_NFL,
  },
  {
    key: 'NBA',
    sport: 'BASKETBALL',
    mintContract: getContract(MINTER_BASKETBALL),
    packContract: getContract(PACK_BASKETBALL),
    packPromoContract: getContract(PACK_PROMO_BASKETBALL),
    regContract: getContract(ATHLETE_BASKETBALL),
    promoContract: getContract(ATHLETE_PROMO_BASKETBALL),
    openContract: getContract(OPENPACK_BASKETBALL),
    openPromoContract: getContract(OPENPACK_PROMO_BASKETBALL),
    gameContract: getContract(GAME_BASKETBALL),
    positionList: NBA_POSITIONS,
    extra: EXTRA_NBA,
  },
];

function getSportType(sport) {
  return SPORT_TYPES.find((x) => x.sport === sport);
}

export { getSportType };
