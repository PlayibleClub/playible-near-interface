import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cutAddress } from 'utils/address/helper';
const LeaderboardComponent = (props) => {
const {
teamName,
teamScore,
index,
accountId,
} = props;

return (
    <div className="flex flex-row" key={index}>
        <div
            className={`w-10 font-monument text-2xl ${
            index + 1 > 3 ? 'text-indigo-white font-outline-1' : ''
            }`}
        >
            {index + 1 <= 9 ? '0' + (index + 1) : index + 1}
        </div>
        <div className="ml-6 bg-indigo-black text-indigo-white
        w-1/2 text-center p-1 text-base font-monument mb-5">
        {teamName}  {cutAddress(accountId)}
        </div>
        <div className="ml-10 w-12 text-center font-black">{teamScore.toFixed(2)}</div>
    </div>
)
};

LeaderboardComponent.propTypes = {
teamName: PropTypes.string,
teamScore: PropTypes.number,
index: PropTypes.number,
accountId: PropTypes.string,
};
export default LeaderboardComponent;