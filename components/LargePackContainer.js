import PropTypes from 'prop-types';
import Link from 'next/link'
import React, { Component, useState, useEffect } from 'react';
import Image from 'next/image'
import {BrowserView, MobileView} from 'react-device-detect'

const LargePackContainer = (props) => {
  const { children, color, imagesrc, PackName, releaseValue, CoinValue } = props;
  
    return (
      <>
        <div data-test="LargePackContainer" className={`bg-${color} overflow-hidden w-full flex flex-col`}>
          <div>
            <Image
                src={imagesrc}
                width={110}
                height={140}
            />
          </div>

          <div className="w-full">
            <div className="">
              <div className="text-sm">
                <div className="mb-1 font-bold">{PackName}</div>
                <div className="font-light">RELEASE {releaseValue}</div>
                <div className="mt-4 font-bold">{CoinValue}</div>
              </div>
            </div>
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
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default LargePackContainer;
