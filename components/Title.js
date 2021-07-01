import PropTypes from 'prop-types';

const Title = (props) => {
  const { color, size } = props;

  return (
    <div data-test="title" className={`text-${color} text-${size} font-bold items-center m-1 `}>
      FANTASY INVESTAR
    </div>
  );
};

Title.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

Title.defaultProps = {
  color: 'black',
  size: '3xl',
};

export default Title;
