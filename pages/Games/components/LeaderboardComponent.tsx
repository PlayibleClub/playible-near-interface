import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const LeaderboardComponent = (props) => {
const {
teamName,
teamScore,
index,
} = props;

return (
    <div className="flex flex-row" key={index}>
        <div
            className={`w-10 font-monument text-2xl ${
            index + 1 > 3 ? 'text-indigo-white' : ''
            }`}
        >
            {index + 1 <= 9 ? '0' + (index + 1) : index + 1}
        </div>
        <div className="ml-6 bg-indigo-black text-indigo-white
        w-full text-center p-1 text-base font-monument mb-5">
        {teamName}
        </div>
        <div className="ml-16 w-10 text-center font-black">{teamScore.toFixed(2)}</div>
    </div>
)
};

LeaderboardComponent.propTypes = {
teamName: PropTypes.string,
teamScore: PropTypes.number,
index: PropTypes.number,
};
export default LeaderboardComponent;