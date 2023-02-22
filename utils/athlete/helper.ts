import client from 'apollo-client';
import { objectTraps } from 'immer/dist/internal';
import { GET_ATHLETE_BY_ID, GET_ATHLETE_BY_ID_DATE, GET_NBA_PLAYER_SCHEDULE } from '../queries';
import { formatToUTCDate, getUTCTimestampFromLocal } from 'utils/date/helper';
import { getSportType } from 'data/constants/sportConstants';
import { useSelector } from 'react-redux';

// pull from graphQL and append the nft animation
// return assembled Athlete
async function getAthleteInfoById(item) {
  let value = item.extra.map((item) => item.value);
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID,
    variables: { getAthleteById: parseFloat(value[0]) },
  });
  const basketball = item.token_id.includes('2000');
  const diff = item.token_id.includes('SB') || item.token_id.includes('PR') ? 1 : basketball ? 1 : 0;
  const isPromo = item.token_id.includes('SB') || item.token_id.includes('PR');
  const returningData = {
    primary_id: value[0],
    athlete_id: item.token_id,
    rarity: value[1],
    usage: isPromo ? 0 : basketball ? 0 : value[2],
    name: value[3 - diff],
    team: value[4 - diff],
    position: value[5 - diff],
    release: value[6 - diff],
    ...(isPromo && { type: value[7 - diff] }),
    isOpen: false,
    animation: data.getAthleteById.nftAnimation,
    image: item.metadata.media,
    fantasy_score: getAvgFantasyScore(data.getAthleteById.stats),
    stats_breakdown: data.getAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
    isInjured: data.getAthleteById.isInjured,
    isActive: data.getAthleteById.isActive,
  };
  return returningData;
}
async function getAthleteBasketballSchedule(athlete, startDate, endDate){
  

  const { data }  = await client.query({
    query: GET_NBA_PLAYER_SCHEDULE,
    variables: {
      team: athlete.team,
      startDate: formatToUTCDate(startDate),//formatToUTCDate(1676418043000),
      endDate: formatToUTCDate(endDate),//formatToUTCDate(1677282043000),
    }
  });

  return {...athlete, schedule: data.getNbaPlayerSchedule};
}
// async function getAthleteInfoBasketballSelect(item){
//   let value = item.extra.map((item) => item.value);
//   let startDate = useSelector(getGameStartDate);
//   let endDate = useSelector(getGameEndDate);
//   const { data } = await client.query({
//     query: GET_ATHLETE_BY_ID,
//     variables: { getAthleteById: parseFloat(value[0]) },
//   });
//   const basketball = item.token_id.includes('2000');
//   const diff = item.token_id.includes('SB') || item.token_id.includes('PR') ? 1 : basketball ? 1 : 0;
//   const isPromo = item.token_id.includes('SB') || item.token_id.includes('PR');
//   const teamKey = value[4 - diff];
//   const schedule = await client.query({
//     query: GET_NBA_PLAYER_SCHEDULE,
//     variables: { 
//       team: teamKey, 
//       startDate: formatToUTCDate(startDate), 
//       endDate: formatToUTCDate(endDate)
//     }
//   })
//   console.log(schedule.data);
//   const returningData = {
//     primary_id: value[0],
//     athlete_id: item.token_id,
//     rarity: value[1],
//     usage: isPromo ? 0 : basketball ? 0 : value[2],
//     name: value[3 - diff],
//     team: value[4 - diff],
//     position: value[5 - diff],
//     release: value[6 - diff],
//     ...(isPromo && { type: value[7 - diff] }),
//     isOpen: false,
//     animation: data.getAthleteById.nftAnimation,
//     image: item.metadata.media,
//     fantasy_score: getAvgFantasyScore(data.getAthleteById.stats),
//     stats_breakdown: data.getAthleteById.stats,
//     isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
//     isInjured: data.getAthleteById.isInjured,
//     isActive: data.getAthleteById.isActive,
//   };
//   return returningData;
// }
async function getAthleteInfoByIdWithDate(item, from, to) {
  let value = item.extra.map((item) => item.value);
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID_DATE,
    variables: { getAthleteById: parseFloat(value[0]), from: from, to: to },
  });
  const basketball = item.token_id.includes('2000');
  const diff = item.token_id.includes('SB') || item.token_id.includes('PR') ? 1 : basketball ? 1 : 0;
  const isPromo = item.token_id.includes('SB') || item.token_id.includes('PR');
  const returningData = {
    primary_id: value[0],
    athlete_id: item.token_id,
    rarity: value[1],
    usage: isPromo ? 0 : basketball ? 0 : value[2],
    name: value[3 - diff],
    team: value[4 - diff],
    position: value[5 - diff],
    release: value[6 - diff],
    ...(isPromo && { type: value[7 - diff] }),
    isOpen: false,
    animation: data.getAthleteById.nftAnimation,
    image: item.metadata.media,
    fantasy_score: getDailyFantasyScore(data.getAthleteById.stats),
    stats_breakdown: data.getAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
    isInjured: data.getAthleteById.isInjured,
    isActive: data.getAthleteById.isActive,
  };
  return returningData;
}

function getAvgFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return array.filter((item) => {
      return item.season != '2022' && item.type == 'season';
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

function cutAthleteName(name){
  const slice = name.slice(0, 12);
  const newName = slice + '...';

  return newName;
}

export { convertNftToAthlete, getAthleteInfoById, getAthleteBasketballSchedule, getAthleteInfoByIdWithDate, getPositionDisplay, checkInjury, cutAthleteName};
