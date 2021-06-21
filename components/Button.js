import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, color, saturation, textColor, textSaturation, onClick } = props;

  return (
    <button
      onClick={onClick}
      data-test="regular-button"
      className={`bg-${color}-${saturation} text-${textColor}-${textSaturation} p-1 m-1 rounded-md`}
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
};

Button.defaultProps = {
  children: '',
  color: 'blue',
  saturation: '500',
  textColor: 'gray',
  textSaturation: '100',
  onClick: () => {},
};

export default Button;
