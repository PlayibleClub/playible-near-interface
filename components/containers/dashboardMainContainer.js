import PropTypes from 'prop-types';

const Header = (props) => {
  const { children, color } = props;

  return (
    <div data-test="header" className={`bg-${color}-200 flex flex-row justify-between`}>
      {children}
    </div>
  );
};

Header.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Header.defaultProps = {
  color: 'blue',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default Header;
