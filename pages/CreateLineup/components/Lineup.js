import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { CommunityPoolSpendProposal } from '@terra-money/terra.js';

const Lineup = (props) => {
  const { position, player = '', img = null, id, score, nextposition, onClick = null } = props;
  const lineupPosition = '/images/tokensMLB/' + position + '.png';

  return (
    <>
      <div className="flex justify-center cursor-pointer" onClick={onClick || undefined}>
        {img ? (
          <img src={img} width={143} height={190} />
        ) : (
           <Image src={lineupPosition} width={143} height={190} />
        )}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col mt-4">
          <div className="mb-3 text-sm ">{player === '' ? '-' : player}</div>
          <div className="text-xs font-thin">FANTASY SCORE </div>
          <div className="text-xs">{score === '' ? '-' : score}</div>
        </div>
      </div>
    </>
  );
};

export default Lineup;
