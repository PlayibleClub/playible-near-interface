import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import useViewport  from 'utils/address/helper';
import Link from 'next/link';
const LeaderboardComponent = (props) => {
  const { teamName, teamScore, index, accountId, gameId, onClickFn, isExtendedLeaderboard, isEntrySummary } = props;
  const { cutTeam, cutAddress, entryCut, entryCutTeam } = useViewport();

  return (
    <div className="flex flex-row mt-6" key={index}>
      <div
        className={`w-10 ml-0.5 flex items-center justify-center font-monument text-2xl ${
          index + 1 > 3 ? 'text-indigo-white font-outline-1' : ''
        }`}
      >
        {index + 1 <= 9 ? '0' + (index + 1) : index + 1}
      </div>
      <div
        className="flex items-center justify-center ml-2 md:ml-6 bg-indigo-black text-indigo-white
        w-1/2 text-center p-1 iphone5:text-xs md:text-base font-monument"
      >
        {isExtendedLeaderboard ? entryCutTeam(teamName) : cutTeam(teamName)} <br/>   
        {isExtendedLeaderboard ? entryCut(accountId) : cutAddress(accountId)} 
      </div>
      <div className="flex items-center justify-center ml-6 w-12 text-center content-center font-black">
        {teamScore?.toFixed(2)}
      </div>
      <div className="flex items-center justify-center ml-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            onClickFn(teamName, accountId, gameId);
          }}
        >
          <img className="filter invert" src={'/images/arrow-top-right.png'}></img>
        </button>
      </div>
    </div>
  );
};

LeaderboardComponent.propTypes = {
  teamName: PropTypes.string,
  teamScore: PropTypes.number,
  index: PropTypes.number,
  accountId: PropTypes.string,
  gameId: PropTypes.number,
  onClickFn: PropTypes.func,
  isExtendedLeaderboard: PropTypes.bool, // new prop added
};

export default LeaderboardComponent;