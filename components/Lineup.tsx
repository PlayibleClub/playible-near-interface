import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import router from 'next/router';
import Link from 'next/link';

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
  } = props;

  function getPositionDisplay(position) {
    switch (position) {
      case 'QB':
        return 'QUARTER BACK';
      case 'RB':
        return 'RUNNING BACK';
      case 'WR':
        return 'WIDE RECEIVER';
      case 'TE':
        return 'TIGHT END';
      case 'FLEX':
      case 'SUPERFLEX':
        return position;
    }
  }
  //const { position, player = '', img = null, id, score, nextposition, onClick = null } = props;
  const lineupPosition = '/images/tokensMLB/' + position + '.png';
  return (
    <>
      <div className="flex justify-center">
        {/* <Link
          href={{
            pathname: '/AthleteSelect',
            query: {
              game_id: game_id,
              position: test[0].position,
              athleteLineup: JSON.stringify(test[1].lineup),
              index: test[2].index,
              teamName: teamName,
            },
          }}
          as="/AthleteSelect"
        > */}
        {img ? (
          <div
            className="justify-center relative mb-7"
            style={{ width: '120px', height: '162px' }}
          >
            <div className="absolute z-40" style={{ width: '120px', height: '160px' }}></div>
            <object
              className="absolute z-10"
              type="image/svg+xml"
              data={img}
              width={143}
              height={190}
            />
            <div className="w-24 ml-1 text-center font-montserrat absolute z-50 text-sm top-1/3 left-4 text-indigo-white">
              {isAthlete ? '' : getPositionDisplay(position)}
            </div>
          </div>
        ) : (
          <Image src={lineupPosition} width={143} height={190} />
        )}
        {/* </Link> */}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col mt-4">
          <div className="mb-3 text-sm uppercase">{player === '' ? '-' : player}</div>
          <div className="text-xs font-thin">FANTASY SCORE </div>
          <div className="text-xs">{score === '' ? '-' : score}</div>
        </div>
      </div>
    </>
  );
};

export default Lineup;
