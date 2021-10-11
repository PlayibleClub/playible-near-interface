import PropTypes from 'prop-types';
import underlineIcon from '../public/images/underline.png'

const DashboardRoundedContainer = (props) => {
  const { color, textcolor, size, title, children, align, margin, colormode } = props;

  return (
    <div className={`flex justify-center mt-10 w-11/12 rounded-md ${margin}  bg-${colormode}-defaultcolor4`}>
      <div data-test="DashboardRoundedContainer" className={`text-${colormode == 'dark' ? 'text-white-light' : 'text-black-dark'} bg-${color} text-${size} font-bold ${align} flex flex-col w-full h-full `}>
        <div className="pb-3 pt-6 ml-7 justify-start sm:text-2xl md:text-base">
          {title}
          <img src={`images/underline${colormode}.png`} className="sm:object-none md:w-6" />
        </div>
        <div className="flex justify-center">

          {children}



        </div>

      </div>
    </div>
  );
};

DashboardRoundedContainer.propTypes = {
  title: PropTypes.string.isRequired,
  textcolor: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string,
  size: PropTypes.string,
  colormode: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DashboardRoundedContainer.defaultProps = {
  textcolor: 'white-light',
  margin: '',
  color: 'white',
  size: '1xl',
  colormode: 'light',
  children: <div />,
};

export default DashboardRoundedContainer;
