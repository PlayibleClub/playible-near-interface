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
    <div className="fixed w-full z-40">
      <div data-test="header" className={`bg-${color} relative flex flex-row justify-around h-24`} style={header}>
        <div className="w-full absolute bottom-0 flex flex-row justify-around ">
          {children}
        </div>
      </div>
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
