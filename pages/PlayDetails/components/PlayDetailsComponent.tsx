import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import { getUTCDateFromLocal } from 'utils/date/helper';

const PlayDetailsComponent = (props) => {
  const { startDate, endDate, type, fetch, game, gameEnd } = props;
  
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [getGames, setGetGames] = useState(false);

  function formatTime(time) {
    return time < 10 ? '0' + time : time;
  }

  useEffect(() => {
    setGetGames(false);
    setDay(0);
    setHour(0);
    setMinute(0);
    setSecond(0);
    const id = setInterval(() => {
      const currentDate = getUTCDateFromLocal();
      const end = moment.utc(moment(startDate) <= moment() && moment(endDate) > moment() ? endDate : startDate);
      setDay(formatTime(Math.floor(end.diff(currentDate, 'second') / 3600 / 24)));
      setHour(formatTime(Math.floor((end.diff(currentDate, 'second') / 3600) % 24)));
      setMinute(formatTime(Math.floor((end.diff(currentDate, 'second') / 60) % 60)));
      setSecond(formatTime(Math.floor(end.diff(currentDate, 'second') % 60)));

      if (Math.floor(end.diff(currentDate, 'second')) === 0) {
        setGetGames(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [getGames]);

  return (
    <div>
      <div className="flex space-x-2 mt-2">
        <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
          {day || ''}
        </div>
        <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
          {hour || ''}
        </div>
        <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
          {minute || ''}
        </div>
        <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
          {second  || ''}
        </div>
      </div>
    </div>
  );
};

export default PlayDetailsComponent;
