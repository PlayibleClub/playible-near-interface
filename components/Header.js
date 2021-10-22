import PropTypes from 'prop-types';
const header = {
  backgroundImage: `url('../images/header.png')`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
}

const Header = (props) => {
  const { children, color } = props;

  return (
    <div data-test="header" className={`bg-${color} w-full h-24 flex flex-row justify-around fixed z-50`} style={header}>
      {children}
    </div>
  );
};

Header.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Header.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default Header;
