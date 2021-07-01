import PropTypes from 'prop-types';

const Main = (props) => {
  const { children, color } = props;

  return (
    <div data-test="Main" className={`bg-${color}-100 flex flex-col w-5/6`}>
      {children}
    </div>
  );
};

Main.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Main.defaultProps = {
  color: 'blue',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default Main;
