import PropTypes from 'prop-types';
import Link from 'next/link'
import NavButtonContainer from './NavButtonContainer.js';
const DesktopNavbar = (props) => {
  const { children, color, secondcolor } = props;

  return (
    <div data-test="DesktopNavbar" className={`bg-gradient-to-b from-${color} to-${secondcolor} text-white-light flex flex-col w-72 h-screen`}>
      <div className="flex justify-center h-16 mt-10">
        <img className="object-none" src="images/playibleheader.png" alt="Img" />
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col h-1/5 w-4/6">

          <a href="*">
            <NavButtonContainer imagesrc="images/navicons/icon_home.png" Title="Dashboard" path="/"></NavButtonContainer>
          </a>
          <a href="*">
            <NavButtonContainer imagesrc="images/navicons/icon_portfolio.png" Title="Portfolio" path="/"></NavButtonContainer>
          </a>
          <a href="*">
            <NavButtonContainer imagesrc="images/navicons/icon_packs.png" Title="Packs" path="/Packs"></NavButtonContainer>
          </a>
          <a href="*">
            <NavButtonContainer imagesrc="images/navicons/icon_marketplace.png" Title="Marketplace" path="/"></NavButtonContainer>
          </a>
          <a href="*">
            <NavButtonContainer imagesrc="images/navicons/icon_marketplace.png" Title="Play" path="/"></NavButtonContainer>
          </a>

        </div>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  secondcolor: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  secondcolor: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopNavbar;
