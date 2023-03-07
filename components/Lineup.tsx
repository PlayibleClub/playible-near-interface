import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import router from 'next/router';
import Link from 'next/link';
import { getSportType } from 'data/constants/sportConstants';
import { getPositionDisplay } from 'utils/athlete/helper';
const Lineup = (props) => {
  const {
    position,
    player,
    img = null,
    id,
    game_id,
    score,
    teamName,
    nextposition,
    onClick = null,
    athleteLineup,
    index,
    test,
    isAthlete,
    currentSport,
  } = props;
  //const { position, player = '', img = null, id, score, nextposition, onClick = null } = props;
  const lineupPosition = '/images/tokensMLB/' + position + '.png';
  return (
    <>
      <div className="flex justify-center">
        {img ? (
          <div className="justify-center relative mb-7" style={{ width: '120px', height: '162px' }}>
            <div className="absolute z-40" style={{ width: '120px', height: '160px' }}></div>
            <object
              className="absolute z-10 transform scale-55 md:scale-100"
              type="image/svg+xml"
              data={img}
              width={143}
              height={190}
            />
            <div className="w-24 ml-1 text-center font-montserrat absolute z-50 text-sm top-1/3 left-4 text-indigo-white transform scale-55 md:scale-100">
              {isAthlete ? '' : getPositionDisplay(position, currentSport)}
            </div>
          </div>
        ) : (
          <Image src={lineupPosition} width={143} height={190} alt="play-position" />
        )}
        {/* </Link> */}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col ml-6 -mt-8 md:mt-0">
          <div className="mb-3 text-sm uppercase font-bold transform scale-65 md:scale-100 -mt-2 md:mt-0">{player === '' ? '-' : player}</div>
          <div className="text-xs font-thin transform scale-65 md:scale-100 -mt-4 md:mt-0">FANTASY SCORE</div>
          <div className="text-xs font-bold transform scale-65 md:scale-100 -mt-1 md:mt-0">{player === '' ? '0.00' : score}</div>
        
        </div>
      </div>
    </>
  );
};

export default Lineup;
