import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, color, saturation, textColor, textSaturation } = props;

  return (
    <button
      data-test="regular-button"
      className={`${color ? `bg-${color}` : ''}${saturation ? `-${saturation}` : ''} ${
        textColor ? `text-${textColor}` : ''
      }${textSaturation ? `-${textSaturation}` : ''}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  color: PropTypes.string.isRequired,
  saturation: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  textSaturation: PropTypes.string.isRequired,
};

export default Button;
