import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import NavButtonContainer from '../containers/NavButtonContainer';
import { getNavigation } from './NavigationList';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
const DesktopNavbar = (props) => {
  const { children, color, secondcolor, isAdmin, activeName, isLoggedIn } = props;

  return (
    <div
      data-test="DesktopNavbar"
      className={`bg-gradient-to-b from-${color} to-${secondcolor} text-white-light flex flex-col w-1/5 h-screen`}
    >
      <div className="flex justify-left ml-12 pl-1 h-16 mt-10">
        <button>
          <Link href="/">
            <img className="w-8 h-8.5" src="/images/logo.png" alt="Img" />
          </Link>
        </button>
      </div>
      <div className="flex mt-10">
        <div className="flex flex-col h-1/5 w-4/6 font-monument">
          {getNavigation(isAdmin, isLoggedIn).map(({ name, img, path }) => (
            <button key={name} className="">
              <NavButtonContainer
                imagesrc={img}
                Title={name}
                path={path}
                activeName={activeName}
              ></NavButtonContainer>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  secondcolor: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  isAdmin: PropTypes.bool,
  activeName: PropTypes.string,
  isLoggedIn: PropTypes.bool
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  secondcolor: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
  isAdmin: false,
  isLoggedIn: false
};

export default DesktopNavbar;
