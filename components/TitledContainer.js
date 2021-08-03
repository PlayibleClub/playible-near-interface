import PropTypes from 'prop-types';

const TitledContainer = (props) => {
  const { color, textcolor, size, title, children, align } = props;

  return (
    <div data-test="titledcontainer" className={`text-${textcolor} bg-${color} text-${size} font-bold ${align} m-1 ml-5  flex flex-col w-full `}>
      <div className="pb-3 pt-6 flex justify-start">
        {title}
      </div>
      {children}
    </div>
  );
};

TitledContainer.propTypes = {
  title: PropTypes.string.isRequired,
  textcolor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TitledContainer.defaultProps = {
  textcolor: 'white-light',
  color: 'white',
  size: '1xl',
  align: 'justify-start',
  children: <div />,
};

export default TitledContainer;
