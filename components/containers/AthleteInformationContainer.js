import PropTypes from 'prop-types';

const AthleteInformationContainer = (props) => {
  const { children, color } = props;

  return (
    <div data-test="AthleteInformationContainer" className={`bg-${color}-500 flex rounded-md w-5/6 h-5/6 `}>
      {children}
    </div>
  );
};

AthleteInformationContainer.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteInformationContainer.defaultProps = {
  color: 'red',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteInformationContainer;
