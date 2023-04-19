import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment-timezone';
import { getImage } from 'utils/game/helper';
import { getUTCDateFromLocal } from 'utils/date/helper';

const PlayComponent = (props) => {
  const {
    game_id,
    icon,
    prizePool,
    timeLeft,
    startDate,
    endDate,
    endsin,
    type,
    children,
    month,
    date,
    year,
    img,
    fetchGames,
    index,
    lineupLength,
    hasEntered,
  } = props;
  const playicon = getImage(game_id);
  const ranking = '/images/icons/Ranking.svg';

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
      const end = moment.utc(type === 'ON-GOING' || type === 'ACTIVE' ? endDate : startDate);

      setDay(formatTime(Math.floor(end.diff(currentDate, 'second') / 3600 / 24)));
      setHour(formatTime(Math.floor((end.diff(currentDate, 'second') / 3600) % 24)));
      setMinute(formatTime(Math.floor((end.diff(currentDate, 'second') / 60) % 60)));
      setSecond(formatTime(Math.floor(end.diff(currentDate, 'second') % 60)));

      if (Math.floor(end.diff(currentDate, 'second')) === 0) {
        setGetGames(true);
        fetchGames();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [index, getGames]);

  return (
    <>
      {type === 'COMPLETED' ? (
        <div className="w-84 h-84">
          <div className="w-full p-3">
            <div className="w-full">
              <Image src={img ? img : playicon} width={300} height={263} alt="play-icon" />
            </div>

            <div className="mt-4 flex justify-between">
              {/* <div className="">
                <div className="font-thin text-sm">PRIZE POOL</div>
                <div className="text-base font-monument">${prizePool}</div>
              </div> */}
              <div className="">
                <div className="font-normal text-sm">STATUS</div>
                <div className="text-base font-monument">COMPLETE</div>
              </div>
              <div>
                <div className="font-normal text-sm">GAME ID</div>
                <div className="text-base font-monument">{game_id}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="">
                <div className="font-normal text-sm">RANKING</div>
                <div className="text-base font-monument">
                  <img src={ranking} className="w-3 h-3" />
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-84 h-96 mb-12">
          <div className="w-full p-3">
            <div className="w-full">
              <Image src={img ? img : playicon} width={300} height={263} alt="play-icon" />
            </div>

            <div className="mt-4 flex justify-between">
              {/* <div className="">
                <div className="font-thin text-sm">PRIZE POOL</div>
                <div className="text-base font-monument">${prizePool}</div>
              </div> */}
              <div className="">
                <div className="font-thin text-sm">
                  {type === 'ON-GOING' || type === 'ACTIVE' ? 'END' : 'START'} DATE
                </div>
                <div className="text-xs font-monument w-32">
                  {moment
                    .tz(
                      type === 'ON-GOING' || type === 'ACTIVE' ? endDate : startDate,
                      moment.tz.guess()
                    )
                    .format('Do MMMM, hA z')}
                </div>
                <div className="font-thin text-sm">{type === 'NEW' ? 'END DATE' : ''}</div>
                <div className="text-xs font-monument w-32">
                  {type === 'NEW'
                    ? moment.tz(endDate, moment.tz.guess()).format('Do MMMM, hA zz')
                    : ''}
                </div>
              </div>
              <div>
                <div className="font-thin text-sm">GAME ID</div>
                <div className="text-base font-monument">{game_id}</div>
                <div className={`${type === 'NEW' ? ' ' : 'hidden'}`}>
                  <div className="font-thin text-sm">LINEUP COUNT:</div>
                  <div className="text-base font-monument">{lineupLength}</div>
                </div>
              </div>
            </div>

            <div className="flex mt-2">
              <div className="">
                {type === 'COMPLETED' ? (
                  ''
                ) : type === 'ACTIVE' || type === 'ON-GOING' ? (
                  <div className="font-thin text-sm">ENDS IN</div>
                ) : (
                  <div className="font-thin text-sm">REGISTRATION ENDS IN</div>
                )}
                {(type === 'NEW' || type === 'ON-GOING' || type === 'ACTIVE') && (
                  <div className="text-sm font-montserrat font-normal flex mt-2 space-x-3">
                    <div className="bg-indigo-darkgray text-indigo-white w-9 h-10 rounded justify-center flex pt-2">
                      {day}
                    </div>
                    <div className="bg-indigo-darkgray text-indigo-white w-9 h-10 rounded justify-center flex pt-2">
                      {hour}
                    </div>
                    <div className="bg-indigo-darkgray text-indigo-white w-9 h-10 rounded justify-center flex pt-2">
                      {minute}
                    </div>
                    <div className="bg-indigo-darkgray text-indigo-white w-9 h-10 rounded justify-center flex pt-2">
                      {second}
                    </div>
                    <div
                      className={`${
                        type === 'ON-GOING' && hasEntered > 0
                          ? 'flex flex-row space-x-1 text-xs align-text-baseline text-center bg-indigo-lightgreen font-bold px-2 py-2'
                          : 'hidden'
                      }`}
                    >
                      <div className="text-indigo-white tracking-tight mt-1">ENTERED</div>
                      <div className="bg-indigo-white rounded-full px-2.5 py-1">{hasEntered}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PlayComponent.propTypes = {
  game_id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  prizePool: PropTypes.string.isRequired,
  currPlayers: PropTypes.string.isRequired,
  maxPlayers: PropTypes.string.isRequired,
  timeLeft: PropTypes.string.isRequired,
  type: PropTypes.string,
  startDate: PropTypes.string,
  lineupLength: PropTypes.number.isRequired,
  endDate: PropTypes.string,
  month: PropTypes.string,
  date: PropTypes.string,
  year: PropTypes.string,
  fetchGames: PropTypes.func,
  index: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  img: PropTypes.string,
  hasEntered: PropTypes.string,
};

export default PlayComponent;
