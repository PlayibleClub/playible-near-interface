import client from 'apollo-client';
import { objectTraps } from 'immer/dist/internal';
import {
  GET_ATHLETE_BY_ID,
  GET_CRICKET_ATHLETE_BY_ID,
  GET_CRICKET_SCHEDULE,
  GET_PLAYER_SCHEDULE,
} from '../queries';
import { formatToUTCDate, getUTCTimestampFromLocal } from 'utils/date/helper';
import { getSportType } from 'data/constants/sportConstants';

interface trait_type {
  athlete_id: string;
  rarity: string;
  name: string;
  team: string;
  position: string;
  release: string;
  usage?: string;
  type?: number;
}

// pull from graphQL and append the nft animation
// return assembled Athlete
async function getAthleteInfoById(item, from, to) {
  //console.log(item.extra);
  let value = {} as trait_type;
  for (const key of item.extra) {
    value[key.trait_type] = key.value;
  }
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID,
    variables: { getAthleteById: parseFloat(value['athlete_id']), from: from, to: to },
  });

  // console.log(data);
  // console.log(value['athlete_id']);
  // console.log(value['name']);
  // let queryData;
  // if (from === undefined && to === undefined){
  //   const { data } = await client.query({
  //     query: GET_ATHLETE_BY_ID,
  //     variables: { getAthleteById: parseFloat(value['athlete_id']) },
  //   });
  //   queryData = data;
  // } else{
  //   const { data } = await client.query({
  //     query: GET_ATHLETE_BY_ID_DATE,
  //     variables: { getAthleteById: parseFloat(value['athlete_id']), from: from, to: to },
  //   });
  //   queryData = data;
  // }
  const isPromo = item.token_id.includes('SB') || item.token_id.includes('PR');
  const returningData = {
    primary_id: value['athlete_id'],
    athlete_id: item.token_id,
    rarity: value['rarity'],
    usage: value['usage'],
    name: value['name'],
    team: value['team'],
    position: value['position'],
    release: value['release'],
    ...(isPromo && { type: value['type'] }),
    isOpen: false,
    animation: data.getAthleteById.nftAnimation,
    image: item.metadata.media,
    fantasy_score:
      from === null && to === null
        ? getAvgSeasonFantasyScore(data.getAthleteById.stats)
        : from !== null && to !== null
        ? getDailySeasonFantasyScore(data.getAthleteById.stats)
        : getDailyFantasyScore(data.getAthleteByIds.stats),
    stats_breakdown: data.getAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
    isInjured: data.getAthleteById.isInjured,
    isActive: data.getAthleteById.isActive,
    playerHeadshot: data.getAthleteById.playerHeadshot,
  };
  return returningData;
}

//used by portfolio and assetdetails
async function getPortfolioAssetDetailsById(item, from, to, whitelist) {
  //console.log(item.extra);
  let value = {} as trait_type;
  for (const key of item.extra) {
    value[key.trait_type] = key.value;
  }
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID,
    variables: { getAthleteById: parseFloat(value['athlete_id']), from: from, to: to },
  });
  const isPromo = item.token_id.includes('PR');
  const isSoul = item.token_id.includes('SB');
  let isAllowed = false;
  if (whitelist.includes('regular') && !isPromo && !isSoul) {
    isAllowed = true;
  } else if (whitelist.includes('promo') && isPromo) {
    isAllowed = true;
  } else if (whitelist.includes('soulbound') && isSoul) {
    isAllowed = true;
  }

  const returningData = {
    primary_id: value['athlete_id'],
    athlete_id: item.token_id,
    rarity: value['rarity'],
    usage: value['usage'],
    name: value['name'],
    team: value['team'],
    position: value['position'],
    release: value['release'],
    ...((isPromo || isSoul) && { type: value['type'] }),
    isOpen: false,
    isPromo: isPromo,
    isSoul: isSoul,
    animation: data.getAthleteById.nftAnimation,
    image: item.metadata.media,
    fantasy_score: getAvgSeasonFantasyScore(data.getAthleteById.stats),
    stats_breakdown: data.getAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
    isInjured: data.getAthleteById.isInjured,
    isActive: data.getAthleteById.isActive,
    isAllowed: isAllowed,
    backendTeam: data.getAthleteById.team.key,
    backendPosition: data.getAthleteById.position,
    playerHeadshot: data.getAthleteById.playerHeadshot,
  };
  return returningData;
}

async function getCricketAthleteInfoById(item, from, to) {
  //console.log(item.extra);
  let value = {} as trait_type;
  for (const key of item.extra) {
    value[key.trait_type] = key.value;
  }
  const { data } = await client.query({
    query: GET_CRICKET_ATHLETE_BY_ID,
    variables: {
      getCricketAthleteById: parseFloat(value['athlete_id']),
      team: value['team'],
      from: from,
      to: to,
    },
  });
  const isPromo = item.token_id.includes('SB') || item.token_id.includes('PR');
  const returningData = {
    primary_id: value['athlete_id'],
    athlete_id: item.token_id,
    player_key: data.getCricketAthleteById.playerKey,
    rarity: value['rarity'],
    usage: value['usage'],
    name: value['name'],
    team: value['team'],
    position: value['position'],
    release: value['release'],
    ...(isPromo && { type: value['type'] }),
    isPromo: isPromo,
    isOpen: false,
    animation: data.getCricketAthleteById.nftAnimation,
    image: item.metadata.media,
    fantasy_score: getDailyFantasyScore(data.getCricketAthleteById.stats),
    stats_breakdown: data.getCricketAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
  };
  return returningData;
}

async function getAthleteSchedule(athlete, startDate, endDate, currentSport) {
  const { data } = await client.query({
    query: GET_PLAYER_SCHEDULE,
    variables: {
      team: athlete.team,
      startDate: formatToUTCDate(startDate), //formatToUTCDate(1676418043000),
      endDate: formatToUTCDate(endDate), //formatToUTCDate(1677282043000),
      sport: currentSport,
    },
  });

  return { ...athlete, schedule: data.getPlayerSchedule };
}

async function getCricketSchedule(x, startDate, endDate) {
  const { data } = await client.query({
    query: GET_CRICKET_SCHEDULE,
    variables: {
      team: x.team,
      startDate: formatToUTCDate(startDate),
      endDate: formatToUTCDate(endDate),
    },
  });
  return { ...x, schedule: data.getCricketTeamSchedule };
}

function getAvgSeasonFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return array.filter((item) => {
      return item.season != '2022' && item.season != '2023PRE' && item.type == 'season';
    })[0].fantasyScore;
  } else {
    return 0;
  }
}

function getDailyFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return array.filter((item) => {
      return item.type == 'daily' || item.type == 'weekly';
    })[0].fantasyScore;
  } else {
    return 0;
  }
}

function getDailySeasonFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return array.filter((item) => {
      return item.type == 'daily' || item.type == 'weekly' || item.type == 'season';
    })[0].fantasyScore;
  } else {
    return 0;
  }
}

function convertNftToAthlete(item) {
  const token_metadata = item.token_metadata || item.metadata;

  let metadata = token_metadata.extra.includes('attributes')
    ? JSON.parse(token_metadata.extra).attributes
    : JSON.parse(token_metadata.extra);

  return {
    token_id: item.token_id,
    metadata: token_metadata,
    extra: metadata,
  };
}

function getPositionDisplay(position, currentSport) {
  let flex = false;
  let found;
  getSportType(currentSport).extra.forEach((x) => {
    if (x.key.toString() === position.toString()) {
      found = x.name;
      flex = true;
    }
  });

  // }
  // if(position.length === 3) return 'FLEX';
  // if(position.length === 4) return 'SUPERFLEX';
  if (flex) {
    flex = false;
    return found;
  } else {
    found = getSportType(currentSport).positionList.find((x) => x.key === position[0]);
    return found.name;
  }
}

function checkInjury(injury) {
  switch (injury) {
    case 'Probable':
    case 'Questionable':
    case 'Doubtful':
      return 1;
    case 'Out':
      return 2;
    case null:
      return 3;
  }
}

function cutAthleteName(name) {
  const slice = name.slice(0, 12);
  const newName = slice + '...';

  return newName;
}

export {
  convertNftToAthlete,
  getAthleteInfoById,
  getPositionDisplay,
  checkInjury,
  cutAthleteName,
  getAthleteSchedule,
  getCricketAthleteInfoById,
  getCricketSchedule,
  getPortfolioAssetDetailsById,
};
