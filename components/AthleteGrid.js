import PropTypes from 'prop-types';

const AthleteGrid = (props) => {
  const { children, color } = props;

  return (
    <div data-test="AthleteGrid" className={`bg-${color}-500 w-11/12 grid gap-x-1 gap-y-2 grid-cols-2  h-full `}>
      {children}
    </div>
  );
};

AthleteGrid.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteGrid.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteGrid;
