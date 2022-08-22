import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';

const PlayDetailsComponent = (props) => {
  const { startDate, endDate, fetch, game, gameEnd } = props;

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
    setDay(null);
    setHour(null);
    setMinute(null);
    setSecond(null);
    const id = setInterval(() => {
      const currentDate = new Date();
      const endDate = new Date(startDate);
      // const totalSeconds = (endDate - currentDate) / 1000;

      // const days = Math.floor(totalSeconds / 2600 / 24);
      // const hours = Math.floor(totalSeconds / 3600) % 24;
      // const minutes = Math.floor(totalSeconds / 60) % 60;
      // const seconds = Math.floor(totalSeconds) % 60;

      // setDay(formatTime(days));
      // setHour(formatTime(hours));
      // setMinute(formatTime(minutes));
      // setSecond(formatTime(seconds));

      // if (Math.floor(totalSeconds) > 0) {
      //   game();
      // }
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
