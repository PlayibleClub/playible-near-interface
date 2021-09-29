import React, { useState } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link'
import NavButtonContainer from './NavButtonContainer.js';
import Button from './Button.js';
const DesktopNavbar = (props) => {
  const { children, color, colormode, setColor } = props;







  return (
    <div data-test="DesktopNavbar" className={`bg-${colormode}-defaultcolor1  text-white-light flex flex-col   w-3/12 h-screen`}>
      <div className="flex justify-center h-16">

        <img className="object-none mt-4" src="images/fantasylogo.png" alt="Img" />
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col h-1/5 w-4/6">


          <NavButtonContainer imagesrc="images/navicons/icon_home.png" Title="Dashboard"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_portfolio.png" hreflink="Portfolio" Title="Portfolio"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_packs.png" Title="Packs"></NavButtonContainer>
          <NavButtonContainer imagesrc="images/navicons/icon_marketplace.png" Title="Marketplace"></NavButtonContainer>


          <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={() => setColor((currcolor) => colormode == 'light' ? 'dark' : 'light')} size="py-1 px-1">
            {colormode == 'light' ? 'nightmode:off' : 'nightmode:on'}
          </Button>



        </div>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  colormode: PropTypes.string,
  setColor: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopNavbar;
