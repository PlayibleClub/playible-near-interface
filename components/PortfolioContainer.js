import PropTypes from 'prop-types';
import underlineIcon from '../public/images/underline.png'
import React, { useEffect, useState } from 'react'
import {BrowserView, MobileView} from 'react-device-detect'

const PortfolioContainer = (props) => {
  const { color, textcolor, size, title, children, align, stats } = props;
  return (
      <>
    <MobileView>
    <div data-test="portfoliocontainer" className={`text-${textcolor} bg-${color} text-${size} font-bold ${align} flex flex-col w-full `}>
      <div className="flex justify-between">
        <div className="pb-3 pt-6 justify-start text-xl">
          {title}
          <img src={underlineIcon} className="object-none" />
        </div>
        {stats ?
          <>
            <div className="px-2 py-1 text-lg rounded-md bg-indigo-green text-center self-center content-center mt-2 mr-7">
              {stats}
            </div>
          </>
          :
          <>
          </>
        }
      </div>
      <div className="flex justify-center flex-col">
        {children}
      </div>

    </div>
    </MobileView>
    <BrowserView>
    <div data-test="portfoliocontainer" className={`text-${textcolor} bg-${color} text-${size} font-bold ${align} flex flex-col w-full `}>
      <div className="flex">
        <div className="pb-3 pt-6 ml-7 justify-start text-xl">
          {title}
          <img src={underlineIcon} className="object-none" />
        </div>
        {stats ?
          <>
            <div className="px-2 py-1 w-16 text-lg rounded-md bg-indigo-green text-center self-center content-center mt-2 ml-12">
              {stats}
            </div>
          </>
          :
          <>
          </>
        }
      </div>
      <div className="flex justify-center flex-col">
        {children}
      </div>
    </div>
    </BrowserView>
    </>
  )
};

PortfolioContainer.propTypes = {
  title: PropTypes.string.isRequired,
  textcolor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  stats: PropTypes.number,
};

PortfolioContainer.defaultProps = {
  textcolor: 'white-light',
  color: 'white',
  size: '1xl',
  align: 'justify-start',
  children: <div />,
};

export default PortfolioContainer;
