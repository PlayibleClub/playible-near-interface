import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import { max } from 'moment';

const playList = [ //for reference
    {
        icon: '1',
        prizePool: '7,484.10',
        level: '1',
      },
]

const PrizePoolComponent = (props) =>{
    const {icon, prizePool, level, children} = props;
    const nexticon = "/../public/images/prizepoolthumbnails/nextbutton.png"

    return (
        <div className="">
            {/* <div className="w-full">
                <Image src={playicon}
                    width="350px"
                    height={200}
                />
            </div> */}

            <div className="w-32 h-32 text-indigo-white" style={{
              backgroundImage: `url('/images/prizepoolthumbnails/${icon}.png')`,
              backgroundRepeat: 'no-repeat',
              width: '275px',
              height: '160px'
            }}>
                <div className="pl-6 pt-6">
                    <div className="text-2xl font-bold">
                        ${prizePool}
                    </div>
                    <div className="text-xs">
                        LEVEL {level}
                    </div>
                </div>

                <div className="mt-12 ml-32">
                    <button>
                        <div className="flex">
                            <div className="font-bold">
                                PLAY NOW
                            </div>
                            <div className="ml-2">
                                <Image
                                    src={nexticon}
                                    width="20px"
                                    height="20px"
                                />
                            </div>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    )
}

PrizePoolComponent.propTypes = {
    icon: PropTypes.string.isRequired,
    prizePool: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PrizePoolComponent;