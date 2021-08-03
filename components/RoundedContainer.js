import PropTypes from 'prop-types';

const RoundedContainer = (props) => {
  const { children, color } = props;

  return (
    <div data-test="RoundedContainer" className={`bg-${color} flex rounded-md w-5/6 h-5/6 `}>
      {children}
    </div>
  );
};

RoundedContainer.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

RoundedContainer.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default RoundedContainer;
