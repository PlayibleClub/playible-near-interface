import PropTypes from 'prop-types';
import Link from 'next/link'
import NavButtonContainer from './NavButtonContainer.js';
const DesktopNavbar = (props) => {
  const { children, color } = props;

  return (
    <div data-test="DesktopNavbar" className={`bg-${color}  text-white-light flex flex-col w-3/12 h-screen`}>
      <div className="flex justify-center h-16">

        <img className="object-none mt-4" src="images/fantasylogo.png" alt="Img" />
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col h-1/5 w-4/6">

          <NavButtonContainer imagesrc="images/navicons/icon_home.png" Title="Dashboard" path="/"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_portfolio.png" Title="Portfolio" path="/"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_packs.png" Title="Packs" path="/Packs"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_marketplace.png" Title="Marketplace" path="/"></NavButtonContainer>

        </div>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopNavbar;
