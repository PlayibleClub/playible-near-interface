import PropTypes from 'prop-types';

const PerformerContainer = (props) => {
  const { children, color, AthleteName, TeamName, CoinValue } = props;

  return (
    <div data-test="PerformerContainer" className={`bg-${color} flex flex-col rounded-md w-5/6 h-full `}>
      <div className="flex flex-col h-1/2">
        {children}
        <div>{AthleteName}</div>
        <div>{TeamName}</div>
      </div>
      <div className="relative h-1/2">
        <div className="absolute bottom-0 right-1">{CoinValue}</div>
      </div>
    </div>
  );
};

PerformerContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PerformerContainer.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PerformerContainer;
