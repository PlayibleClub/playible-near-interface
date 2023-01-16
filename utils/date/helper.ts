import moment, { Moment } from 'moment';
import { NFL_SCHEDULE } from 'data/constants/sportConstants';
function getUTCTimestampFromLocal(): number {
  return moment.utc(Date.now()).unix() * 1000;
}

function getUTCDateFromLocal(): moment.Moment {
  return moment.utc(Date.now());
}

function getNflWeek(playibleNflGameStart) {
  let startDate;
  if(playibleNflGameStart > NFL_SCHEDULE.nfl2022regstart && playibleNflGameStart > NFL_SCHEDULE.nfl2022poststart){
    startDate = NFL_SCHEDULE.nfl2022poststart;
  } else {
    startDate = NFL_SCHEDULE.nfl2022regstart;
  }
  const gameStart = playibleNflGameStart;
  const timeDifference = (gameStart - startDate) / 604800;

  console.log("start of playible nfl game: " + gameStart);
  console.log("time difference in weeks: " + timeDifference);

  let num = timeDifference;
  if ((num % 1) > 0.071) {
    return Math.ceil(num);
  } else {
    return Math.floor(num);
  }
}

function getNflSeason(playibleNflGameStart){
  if(playibleNflGameStart > NFL_SCHEDULE.nfl2022regstart && playibleNflGameStart > NFL_SCHEDULE.nfl2022poststart){
    return '2022POST';
  } else {
    return '2022REG';
  }
}

export { getUTCTimestampFromLocal, getUTCDateFromLocal, getNflWeek, getNflSeason };
