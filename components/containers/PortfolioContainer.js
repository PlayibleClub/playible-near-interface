import PropTypes from 'prop-types';
import underlineIcon from '../../public/images/blackunderline.png'
import React, { useEffect, useState } from 'react'

const PortfolioContainer = (props) => {
  const { color, textcolor, size, title, children, align, stats } = props;
  const avgicon = "/../../public/images/avgscore.png"

  return (
      <>
    {/* <MobileView>
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
    </MobileView> */}
    {/* <BrowserView> */}
    <div data-test="portfoliocontainer" className={`text-${textcolor} bg-${color} text-${size} font-bold ${align} flex flex-col w-full `}>
      <div className="flex">
        {stats ?
          <>
          <div className="pb-3 pt-20 md:pt-14 ml-7 justify-start align-center">
            {title}
            <img src={underlineIcon} className="object-none" />
          </div>
            <div className="w-32 h-32" style={{
              backgroundImage: `url('/images/avgscore.png')`,
              backgroundRepeat: 'no-repeat',
              width: '135px',
              height: '135px'
            }}>
              <div className="text-center text-2xl w-full mt-14">
                {stats}
              </div>
            </div>
          </>
          :
          <div className="pb-3 pt-6 ml-7 justify-start align-center text-2xl font-monument">
            {title}
            <img src={underlineIcon} className="object-none" />
          </div>
        }
      </div>
      <div className="flex justify-center flex-col">
        {children}
      </div>
    </div>
    {/* </BrowserView> */}
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
