import moment, { Moment } from 'moment';

function getLocalUnixTimestamp(): number {
  return moment.utc(Date.now()).unix() * 1000;
}

function getLocalDate(): moment.Moment {
  return moment.utc(Date.now());
}

export { getLocalUnixTimestamp, getLocalDate };
