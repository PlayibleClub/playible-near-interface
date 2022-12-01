import React from 'react';
import PropTypes from 'prop-types';

const AthleteContainer = (props) => {
  const {
    children,
    colorgrad1,
    colorgrad2,
    AthleteName,
    TeamName,
    CoinValue,
    Positions,
    Jersey,
    ID,
  } = props;
  const pos = Positions;

  return (
    <div
      data-test="AthleteContainer"
      className={`bg-gradient-to-r from-${colorgrad1} to-${colorgrad2} flex flex-col rounded-md h-full`}
    >
      <div className="flex flex-col h-1/2">
        {children}
        <div className="flow-root">
          <div className="mt-1 ml-4 text-xl float-left">{AthleteName}</div>
          <div className="mt-1 text-3xl mr-4 float-right">{Jersey}</div>
        </div>
        <div className="ml-4 text-xs">{TeamName}</div>
        <div className="flow-root">
          <div className="mt-3 mr-2 float-right">
            <img />
          </div>
        </div>
      </div>
      <div className="relative h-1/2 bg-indigo-gray rounded-br-md rounded-bl-md">
        <div className="flex ml-2 mb-2 mt-2">
          {pos.map(function (position, i) {
            return (
              <div className="ml-2 mr-1 w-8 h-8 rounded-full text-center bg-indigo-navy" key={i}>
                <div className="mt-1">{position}</div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-3 right-4">{CoinValue}</div>
      </div>
    </div>
  );
};

AthleteContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteContainer.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteContainer;
