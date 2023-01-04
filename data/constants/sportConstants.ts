import { ATHLETE_NFL, ATHLETE_PROMO_NFL, GAME_NFL } from 'data/constants/nearContracts';
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
]
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
  }

]

export const SPORT_TYPES = [
  {
    key: 'NFL',
    sport: 'FOOTBALL',
    regContract: getContract(ATHLETE_NFL),
    promoContract: getContract(ATHLETE_PROMO_NFL),
    gameContract: getContract(GAME_NFL),
    positionList: NFL_POSITIONS,
  },
  {
    key: 'NBA',
    sport: 'BASKETBALL',
    regContract: getContract(ATHLETE_NFL),
    promoContract: getContract(ATHLETE_PROMO_NFL),
    positionList: NBA_POSITIONS,
  }];

  function getSportType(sport){
    return SPORT_TYPES.find((x) => x.sport === sport);
  }

  export { getSportType };