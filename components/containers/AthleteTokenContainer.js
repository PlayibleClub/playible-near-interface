import PropTypes from 'prop-types';
import React from 'react';

const AthleteTokenContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue } = props;

  return (
    <div
      data-test="AthleteTokenContainer"
      className={`bg-${color} sx-${TeamName} w-full h-full overflow-hidden flex flex-col`}
    >
      <div className="flex h-2/3 ml-4">
        <img src={imagesrc} alt="Img" className="flex" />
      </div>
      {children}
      <div className="h-1/3 ml-4">
        <div className="flex flex-col ">
          <div className="mt-4 mb-3 text-sm font-medium ">{AthleteName}</div>
          <div className="text-xs font-thin">LOWEST ASK </div>
          <div className="text-xs font-bold">{CoinValue} UST</div>
        </div>
      </div>
    </div>
  );
};

AthleteTokenContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteTokenContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteTokenContainer;
