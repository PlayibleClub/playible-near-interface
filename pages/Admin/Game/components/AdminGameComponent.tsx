import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import { getImage } from 'utils/game/helper';
const AdminGameComponent = (props) => {
  const {
    game_id,
    start_time,
    end_time,
    whitelist,
    usage_cost,
    positions,
    lineup_len,
    joined_player_counter,
    joined_team_counter,
    type,
    isCompleted,
    status,
    img, //checking if upcoming or completed game
  } = props;

  const formatString = 'MM/DD/YYYY HH:mm:ss Z';

  const playicon = getImage(game_id);
  return (
    <>
      {console.log(status + ' ' + game_id)}
      {status === 'new' ? (
        <div className="w-84 h-96 mb-12">
          <div className="w-full p-3">
            <div className="w-full">
              <Image src={img ? img : playicon} width="300" height="263" alt="play-icon" />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="">
                <div>Game ID: {game_id}</div>
                <div className="font-thin text-sm">
                  START DATE
                  <div className="text-base font-monument">
                    {moment.utc(start_time).local().format(formatString)}
                  </div>
                  <div className="font-thin text-sm">END DATE</div>
                  <div className="text-base font-monument">
                    {moment.utc(end_time).local().format(formatString)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : status === 'completed' ? (
        <div className="w-84 h-96 mb-12">
          <div className="w-full p-3">
            <div className="w-full">
              <Image src={img ? img : playicon} width="300" height="263" alt="play-icon" />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="">
                <div>Game ID: {game_id}</div>
                <div className="font-thin text-sm">
                  START DATE
                  <div className="text-base font-monument">
                    {moment(start_time).local().format(formatString)}
                  </div>
                  <div className="font-thin text-sm">END DATE</div>
                  <div className="text-base font-monument">
                    {moment(end_time).local().format(formatString)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : status === 'ongoing' ? (
        <div className="w-84 h-96 mb-12">
          <div className="w-full p-3">
            <div className="w-full">
              <Image src={img ? img : playicon} width="300" height="263" alt="play-icon" />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="">
                <div>Game ID: {game_id}</div>
                <div className="font-thin text-sm">
                  START DATE
                  <div className="text-base font-monument">
                    {moment(start_time).local().format(formatString)}
                  </div>
                  <div className="font-thin text-sm">END DATE</div>
                  <div className="text-base font-monument">
                    {moment(end_time).local().format(formatString)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
AdminGameComponent.propTypes = {
  game_id: PropTypes.string.isRequired,
  start_time: PropTypes.number,
  end_time: PropTypes.number,
  whitelist: PropTypes.arrayOf(PropTypes.string),
  positions: PropTypes.array, //change to be more specific?
  lineup_len: PropTypes.number,
  joined_player_counter: PropTypes.number,
  joined_team_counter: PropTypes.number,
  type: PropTypes.string,
  isCompleted: PropTypes.bool,
  status: PropTypes.string,
  img: PropTypes.string,
};

export default AdminGameComponent;
