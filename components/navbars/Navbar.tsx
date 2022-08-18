import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import { getNavigation } from './NavigationList';
import React from 'react';

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '20px',
    height: '15px',
    left: '42px',
    top: '50px',
  },
  bmBurgerBars: {
    background: '#ffffff',
  },
  bmBurgerBarsHover: {
    background: '#a90000',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
  },
  bmMenu: {
    background: 'white',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmMorphShape: {
    fill: '#000000',
  },
  bmItemList: {
    color: 'black',
    padding: '0.8em',
  },
  bmItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

const Navbar = (props) => {
  const { isAdmin } = props;
  return (
    <div className="font-monument">
      <Menu styles={styles} customBurgerIcon={<img src="images/icons/Hamburger.svg" />}>
        {getNavigation(isAdmin).map(({ name, img, path }) => (
            <a className="menu-item" id={name.toLowerCase()} href={path} key={name}>{name}</a>
        ))}
      </Menu>
    </div>
  );
};

export default Navbar;
