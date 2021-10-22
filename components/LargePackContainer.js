import PropTypes from 'prop-types';
import Link from 'next/link'
import React, { Component, useState, useEffect } from 'react';
import Image from 'next/image'
import {BrowserView, MobileView} from 'react-device-detect'

const LargePackContainer = (props) => {
  const { children, color, imagesrc, PackName, releaseValue, CoinValue } = props;
  
    return (
      <>
      <MobileView>
        <div data-test="LargePackContainer" className={`bg-${color} overflow-hidden flex flex-col w-full `}>
          <div className="flex">
            <img src={imagesrc} alt="Img" />

          </div>
          {children}
          <div className="flex w-full justify-center">
            <div className=" flex flex-col w-4/5">
              <div className="flex flex-row justify-between w-full">
                <div className="mb-3 font-bold">{PackName}</div>
                <div className="font-bold">{CoinValue}</div>
              </div>
              <div className="text-md font-light">Release {releaseValue}</div>
              <div className="text-xs font-bold">

                {' '}

              </div>
            </div>
          </div>
        </div>
      </MobileView>
      <BrowserView>
        <div data-test="LargePackContainer" className={`bg-${color} overflow-hidden w-full flex flex-col`}>
          <div className="">
            <Image
                src={imagesrc}
                width={300}
                height={250}
            />

          </div>
          {children}
          <div className="w-full">
            <div className="lg:ml-20 md:ml-12">
              <div className="text-left">
                <div className="mb-1">{PackName}</div>
                <div className="text-md font-light">Release {releaseValue}</div>
                <div className="mt-4">{CoinValue}</div>
              </div>
              <div className="text-xs font-bold">
                {' '}
              </div>
            </div>
          </div>
        </div>
        </BrowserView>
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
