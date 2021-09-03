import PropTypes from 'prop-types';

const PerformerContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue } = props;

  return (
    <div data-test="PerformerContainer" className={`bg-${color}  sx-${TeamName} justify-items-center flex flex-col w-full h-full `}>
      <div className="flex justify-center   h-2/3">
        <img src={imagesrc} alt="Img" className="" />

      </div>
      {children}
      <div className="relative h-1/2 flex justify-center mb-4">
        <div className="absolute flex  flex-col  mt-4">
          <div className="pb-3 text-sm font-medium ">{AthleteName}</div>
          <div className="text-xs font-thin">AVERAGE SCORE </div>
          <div className="text-xs font-bold">
            {CoinValue}


          </div>
        </div>
      </div>
    </div>
  );
};

PerformerContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PerformerContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PerformerContainer;
