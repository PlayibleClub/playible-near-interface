import client from 'apollo-client';
import { objectTraps } from 'immer/dist/internal';
import { GET_ATHLETE_BY_ID } from '../queries';
import { getUTCTimestampFromLocal } from 'utils/date/helper';
// pull from graphQL and append the nft animation
// return assembled Athlete
async function getAthleteInfoById(item) {
  console.log(item);
  let value = item.extra.map((item) => item.value);
  console.log(item);
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID,
    variables: { getAthleteById: parseFloat(value[0]) },
  });
  console.log(value);
  const diff = item.token_id.includes('SB') ? 1 : 0;
  const isPromo = item.token_id.includes('SB');
  //console.log("starts at: " + item.metadata['starts_at'] + " vs " + "utc :" + getUTCTimestampFromLocal());
  const returningData = {
    primary_id: value[0],
    athlete_id: item.token_id,
    rarity: value[1],
    usage: isPromo ? 0 : value[2],
    name: value[3 - diff],
    team: value[4 - diff],
    position: value[5 - diff],
    release : value[6 - diff],
    ...isPromo && {type : value[7 - diff]},
    isOpen: false,
    animation: data.getAthleteById.nftAnimation,
    image: data.getAthleteById.nftImage,
    fantasy_score: getAvgFantasyScore(data.getAthleteById.stats),
    stats_breakdown: data.getAthleteById.stats,
    isInGame: item.metadata['starts_at'] > getUTCTimestampFromLocal() ? true : false,
  };
  return returningData;
}

function getAvgFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return array.filter((item) => {
      return item.type == 'season';
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

export { convertNftToAthlete, getAthleteInfoById };
