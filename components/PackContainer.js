import PropTypes from 'prop-types';

const PackContainer = (props) => {
  const { children, color, imagesrc, AthleteName, releaseValue, CoinValue } = props;

  return (
    <div data-test="PackContainer" className={`bg-${color}   w-full h-full overflow-hidden  flex flex-col  w-full h-full `}>
      <div className="flex flex-col h-2/3">
        <img src={imagesrc} alt="Img" />

      </div>
      {children}
      <div className="relative h-1/2">
        <div className="absolute flex flex-col bottom-0 left-1">
          <div className="  pb-3 text-sm font-medium ">{AthleteName}</div>
          <div className="  text-xs font-thin">Release {releaseValue}</div>
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

PackContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  releaseValue: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PackContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/yellow.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PackContainer;
