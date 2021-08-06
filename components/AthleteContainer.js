import PropTypes from 'prop-types';

const AthleteContainer = (props) => {
  const { children, color, AthleteName, TeamName, CoinValue, Positions } = props;
  const pos = Positions;

  return (
    <div data-test="AthleteContainer" className={`bg-${color} flex flex-col rounded-md w-11/12 h-full `}>
      <div className="flex flex-col h-1/2">
        {children}
        <div className="mt-3 ml-3 text-xs">#320/25000</div>
        <div className="flow-root">
          <div className="mt-2 ml-3 text-2xl float-left">{AthleteName}</div>
          <div className="mt-2 text-4xl mr-4 float-right">30</div>
        </div>
        <div className="ml-3 text-xs">{TeamName}</div>
        <div className="mt-2 mr-2 text-right text-5xl">WARRIORS</div>
      </div>
      <div className="relative h-1/2 mt-4 mb-4">
        <div className="flex ml-2">
          {pos.map(function(position, i){
            return <div className="ml-2 mr-2 w-6 h-6 rounded-full text-center" key={i}>{position}</div>
          })}
        </div>
        <div className="absolute bottom-0 right-4">{CoinValue}</div>
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
