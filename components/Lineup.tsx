import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const Lineup = (props) => {
  const { position, player = '', img = null, id, score, nextposition, onClick = null } = props;
  const lineupPosition = '/images/tokensMLB/' + position + '.png';

  return (
    <>
      <div className="flex justify-center cursor-pointer" onClick={onClick || undefined}>
        {img ? (
          <div className="relative mb-7" style={{ width: '120px', height: '162px' }}>
            <div className="absolute z-50" style={{ width: '120px', height: '160px' }}></div>
            <object
              className="absolute z-10"
              type="image/svg+xml"
              data={img}
              width={143}
              height={190}
            />
          </div>
        ) : (
          <Image src={lineupPosition} width={143} height={190} />
        )}
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
