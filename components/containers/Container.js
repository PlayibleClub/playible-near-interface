import React from 'react';
import DesktopNavbar from '../navbars/DesktopNavbar';
import DesktopHeaderBase from '../headers/DesktopHeaderBase';
import Navbar from '../navbars/Navbar';
import HeaderBase from '../headers/HeaderBase';

const Container = (props) => {
  const { children } = props

  return (
    <div className="font-montserrat h-screen relative bg-indigo-dark flex overflow-x-hidden overflow-y-hidden">
      <div className="invisible w-0 md:visible md:w-full">
        <div className="flex bg-indigo-white">
          <DesktopNavbar color="indigo-navbargrad2" secondcolor="indigo-navbargrad1"/>
          <div className="flex flex-col w-screen h-full overflow-y-hidden">
          <DesktopHeaderBase/>
            {children}
          </div>
        </div>
      </div>

      <div className="visible md:invisible h-screen overflow-x-auto">
          <Navbar/>
          <HeaderBase/>

          {children}
      </div>

      

        {/* <div className="flex bg-indigo-dark">
          <DesktopNavbar color="indigo-navbargrad2" secondcolor="indigo-navbargrad1"/>
          <div className="flex flex-col w-full h-full overflow-y-hidden overflow-x-hidden">
            <DesktopHeaderBase/>
            
          </div>


        </div> */}
    </div>
  );
};

export default Container;
