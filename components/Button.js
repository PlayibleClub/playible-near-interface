import PropTypes from 'prop-types';

const Button = (props) => {
  const { children,
    color,
    saturation,
    textColor,
    textSaturation,
    onClick,
    rounded,
    size,
    ...other } = props;

  return (
    <button
      onClick={onClick}
      data-test="regular-button"
      className={`bg-${color}-${saturation} text-${textColor}-${textSaturation} ${rounded} ${size} focus:outline-none focus:ring-4 focus:ring-blue-200 ring-offset-9 font-medium px-4 p-1 m-1 rounded-full`}
      {...other}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  color: PropTypes.string,
  saturation: PropTypes.string,
  textColor: PropTypes.string,
  textSaturation: PropTypes.string,
  onClick: PropTypes.func,
  rounded: PropTypes.string,
  size: PropTypes.string,
};

Button.defaultProps = {
  children: '',
  color: 'blue',
  saturation: '500',
  textColor: 'gray',
  textSaturation: '100',
  onClick: () => { },
  rounded: 'rounded-sm',
  size: 'py-1 px-6  m-1',
};

export default Button;
