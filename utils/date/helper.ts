import moment, { Moment } from 'moment';

function getUTCTimestampFromLocal(): number {
  return moment.utc(Date.now()).unix() * 1000;
}

function getUTCDateFromLocal(): moment.Moment {
  return moment.utc(Date.now());
}

export { getUTCTimestampFromLocal, getUTCDateFromLocal };
