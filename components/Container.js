import React from 'react';
import {BrowserView, MobileView} from 'react-device-detect';
import DesktopNavbar from '../components/DesktopNavbar';
import DesktopHeaderBase from '../components/DesktopHeaderBase';
import Navbar from './Navbar';
import HeaderBase from './HeaderBase';
import Main from './Main';

const Container = (props) => {
  const { children } = props

  return (
    <div className="font-montserrat h-screen relative bg-indigo-dark">
      <MobileView>
        <Navbar/>
        <HeaderBase/>
        <div className="bg-indigo-dark flex flex-col w-full indigo-dark overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </div>
      </MobileView>
      <BrowserView>
        <div className="flex bg-indigo-dark">
          <DesktopNavbar/>
          <div className="flex flex-col w-full h-full overflow-y-hidden overflow-x-hidden">
            <DesktopHeaderBase/>
            {children}
          </div>
        </div>
      </BrowserView>
    </div>
  );
};

export default Container;
