import moment, { Moment } from 'moment';

function getUTCTimestampFromLocal(): number {
  return moment.utc(Date.now()).unix() * 1000;
}

function getUTCDateFromLocal(): moment.Moment {
  return moment.utc(Date.now());
}

function getNflWeek(playibleNflGameStart) {
  const NflScheduleStart = 1662566400;
  const gameStart = playibleNflGameStart;
  const timeDifference = (gameStart - NflScheduleStart) / 604800;

  console.log("start of playible nfl game: " + gameStart);
  console.log("time difference in weeks: " + timeDifference);

  let num = timeDifference;
  if ((num % 1) > 0.071) {
    return Math.ceil(num);
  } else {
    return Math.floor(num);
  }
}

export { getUTCTimestampFromLocal, getUTCDateFromLocal, getNflWeek };
