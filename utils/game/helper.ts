import client from 'apollo-client';
import { getUTCTimestampFromLocal } from 'utils/date/helper';

async function getGameInfoById(item) {
  // let game_id = item[0];
  // let end_time = item[1].end_time;s
  // let whitelist = item[1].whitelist;
  // console.log(game_id);
  // console.log(end_time);
  // console.table(whitelist);
  const returningData = {
    game_id: item[0],
    start_time: item[1].start_time,
    end_time: item[1].end_time,
    whitelist: item[1].whitelist,
    usage_cost: item[1].usage_cost,
    positions: item[1].positions,
    lineup_len: item[1].lineup_len,
    joined_player_counter: item[1].joined_player_counter,
    jointed_team_counter: item[1].joined_team_counter,
    isCompleted: getUTCTimestampFromLocal() >= item[1].end_time ? true : false,
    status:
      getUTCTimestampFromLocal() >= item[1].end_time
        ? 'completed'
        : getUTCTimestampFromLocal() < item[1].start_time
        ? 'new'
        : getUTCTimestampFromLocal() > item[1].start_time &&
          getUTCTimestampFromLocal() < item[1].end_time
        ? 'ongoing'
        : 'invalid',
  };

  return returningData;
}

function getImage(gameId: string): string {
  switch (gameId) {
    case '21':
      return '/images/wild_card.jpg';
    case '22':
      return '/images/footballChampsionship.jpg';
    default:
      return '/images/game.png';
  }
}

function getDescription(gameId: string): string {
  switch (gameId) {
    case '21':
      return 'This is your last chance to earn a spot in next week’s $35K USDC Football Championship. \nOnly those who have not yet won entry into the Championship are eligible.';
    case '22':
      return 'The first annual Playible Football Championship. Only those who won tickets can enter and compete for $35K.';
    default:
      return 'Enter a team into the The Blitz tournament to compete for cash prizes. \nCreate a lineup by selecting 8 Playible Football Athlete Tokens now.';
  }
}

function getPrizePool(gameId: string): string {
  switch (gameId) {
    case '22':
      return '$35K ($10K to 1st)';
    default:
      return '$100 + 2 Championship Tickets';
  }
}

export { getGameInfoById, getImage, getDescription, getPrizePool };
