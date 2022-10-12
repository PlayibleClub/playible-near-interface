import client from 'apollo-client';
import { GET_ATHLETE_BY_ID } from '../queries';

// pull from graphQL and append the nft animation
// return assembled Athlete
async function getAthleteInfoById(item) {
  let value = item.metadata.map((item) => item.value);
  const { data } = await client.query({
    query: GET_ATHLETE_BY_ID,
    variables: { getAthleteById: parseFloat(value[0]) },
  });

  console.log(data);

  const returningData = {
    primary_id: value[0],
    athlete_id: item.token_id,
    rarity: value[1],
    usage: value[2],
    name: value[3],
    team: value[4],
    position: value[5],
    release: value[6],
    isOpen: false,
    animation: data.getAthleteById.nftAnimation,
    image: data.getAthleteById.nftImage,
    fantasy_score: getAvgFantasyScore(data.getAthleteById.stats),
  };
  return returningData;
}

function getAvgFantasyScore(array) {
  if (Array.isArray(array) && array.length > 0) {
    return (
      array.reduce((prevItem, currItem) => {
        return prevItem.fantasyScore || 0 + currItem.fantasyScore;
      }, 0) / array.length
    );
  } else {
    return 0;
  }
}

function convertNftToAthlete(item) {
  const token_metadata = item.token_metadata || item.metadata;
  return {
    token_id: item.token_id,
    metadata: JSON.parse(token_metadata.extra),
  };
}

export { convertNftToAthlete, getAthleteInfoById };
