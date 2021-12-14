import PropTypes from 'prop-types';
import React, { Component, useState, useEffect } from 'react';
import Image from 'next/image'

const LargePackContainer = (props) => {
  const { children, color, imagesrc, PackName, releaseValue, CoinValue } = props;
  
    return (
      <>
        <div data-test="LargePackContainer" className={`bg-${color} w-32`}>
            <div className="transition-all">
                  <Image className="object-contain  hover:-translate-y-1 transform transition-all"
                    src={imagesrc}
                    width={120}
                    height={150}
                  />
               <div className="mt-3 mb-1 font-bold text-sm">{PackName}</div>
               <div className="font-thin md:text-xs transition-all">Release {releaseValue}</div>
               <div className="mt-4 text-sm font-bold">{CoinValue}</div>
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
