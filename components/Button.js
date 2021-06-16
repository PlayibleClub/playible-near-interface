import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, color, saturation, textColor, textSaturation } = props;

  return (
    <button
      data-test="regular-button"
      className={`bg-${color}-${saturation} text-${textColor}-${textSaturation}`}
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
};

Button.defaultProps = {
  children: '',
  color: 'blue',
  saturation: '500',
  textColor: 'black',
  textSaturation: '100',
};

export default Button;
