import PropTypes from 'prop-types';

const Roundedinput = (props) => {
  const { color, size, rounded, name, type } = props;

  return (

    <input data-test="Roundedinput" className={`text-${color} text-${size} ${rounded}  items-center m-1 shadow-lg shadow-inner `} type={type} id={name} name="fname" />

  );
};

Roundedinput.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  rounded: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Roundedinput.defaultProps = {
  color: 'black',
  size: '3xl',
  rounded: 'rounded-sm',
  type: 'text',
};

export default Roundedinput;
