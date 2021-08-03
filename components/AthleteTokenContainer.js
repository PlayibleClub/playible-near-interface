import PropTypes from 'prop-types';

const AthleteTokenContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue } = props;

  return (
    <div data-test="AthleteTokenContainer" className={`bg-${color}  sx-${TeamName} m-1 flex flex-col rounded-md w-5/6 h-full `}>
      <div className="flex flex-col h-2/3">
        <img src={imagesrc} alt="Img" />

      </div>
      {children}
      <div className="relative h-1/2">
        <div className="absolute flex flex-col bottom-0 left-1">
          <div className="  pb-3 text-sm font-medium ">{AthleteName}</div>
          <div className="  text-xs font-thin">LOWEST ASK </div>
          <div className="  text-xs font-bold">
            {CoinValue}
            {' '}
            UST
          </div>
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
  imagesrc: 'https://picsum.photos/100/100',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteTokenContainer;
