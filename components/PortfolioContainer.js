import PropTypes from 'prop-types';
import underlineIcon from '../public/images/underline.png'

const PortfolioContainer = (props) => {
  const { color, textcolor, size, title, children, align } = props;

  return (
    <div data-test="portfoliocontainer" className={`text-${textcolor} bg-${color} text-${size} font-bold ${align}  flex flex-col w-full `}>
      <div className="pb-3 pt-6 ml-4 justify-start text-2xl">
        {title}
        <img src={underlineIcon} className="object-none" />
      </div>
      <div className="flex justify-center flex-col">
        {children}
      </div>

    </div>
  );
};

PortfolioContainer.propTypes = {
  title: PropTypes.string.isRequired,
  textcolor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PortfolioContainer.defaultProps = {
  textcolor: 'white-light',
  color: 'white',
  size: '1xl',
  align: 'justify-start',
  children: <div />,
};

export default PortfolioContainer;
