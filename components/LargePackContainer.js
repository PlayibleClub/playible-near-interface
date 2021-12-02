import PropTypes from 'prop-types';
import Link from 'next/link'
import React, { Component, useState, useEffect } from 'react';
import Image from 'next/image'
import {BrowserView, MobileView} from 'react-device-detect'

const LargePackContainer = (props) => {
  const { children, color, imagesrc, PackName, releaseValue, CoinValue } = props;
  
    return (
      <>
        <div data-test="LargePackContainer" className={`bg-${color}} w-full`}>
            <div className="text-s md:text-lg lg:text-lg transition-all">
                  <Image className="object-contain  hover:-translate-y-1 transform transition-all"
                    src={imagesrc}
                    width={150}
                    height={200}
                  />
               <div className="mb-1 font-bold">{PackName}</div>
               <div className="font-normal md:text-base lg:text-base transition-all">Release {releaseValue}</div>
               <div className="mt-4 font-bold">{CoinValue}</div>
            </div>
        </div>
      </>
    )
};

LargePackContainer.propTypes = {
  color: PropTypes.string,
  PackName: PropTypes.string.isRequired,
  releaseValue: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

LargePackContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/yellow.png',
  children: <div />,
};

export default LargePackContainer;
