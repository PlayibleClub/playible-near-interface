import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import { max } from 'moment';

const playList = [ //for reference
    {
        icon: 'baller',
        prizePool: '2398.90',
        currPlayers: '77',
        maxPlayers: '100',
        timeLeft: '05:38:09'
    },
]

const PlayComponent = (props) =>{
    const {icon, prizePool, currPlayers, maxPlayers, timeLeft, children} = props;
    const playicon = "/../public/images/playthumbnails/"+icon+".png"
    const time = timeLeft.split(':')

    return (
        <div className="rounded-2xl border w-80 h-96">
            <div className="w-full p-3">
                <div className="w-full">
                    <Image src={playicon}
                        width="318px"
                        height={160}
                    />
                </div>
                
                <div className="mt-4 ml-2 flex justify-between">
                    <div className="">
                        <div className="font-thin text-sm">
                            PRIZE POOL
                        </div>
                        <div className="text-xl font-monument">
                            ${prizePool}
                        </div>
                    </div>

                    <div className="border-indigo-green text-indigo-green">
                        {currPlayers <= maxPlayers &&
                            <div className="border rounded-2xl py-1 px-2.5 w-30 text-sm">
                                LIMIT REACHED
                            </div>
                        }
                    </div>
                </div>

                <div className="flex mt-6 ml-2 h-24">
                    <div className="border-r">
                        <div className="font-thin mr-10 text-sm">
                            PLAYERS
                        </div>

                        <div className="text-xl mt-2">
                            {currPlayers}/{maxPlayers}
                        </div>
                    </div>

                    <div className="ml-8">
                        <div className="font-thin text-sm">
                            ENDS IN
                        </div>

                        <div className="flex mt-2">
                            <div className="text-center">
                                <div className="text-xl">
                                    {time[0]}
                                </div>

                                <div className="font-thin mt-2 text-sm">
                                    HR
                                </div>
                            </div>

                            <div className="ml-4 text-center">
                                <div className="text-xl">
                                    {time[1]}
                                </div>

                                <div className="font-thin mt-2 text-sm">
                                    MIN
                                </div>
                            </div>

                            <div className="ml-4 text-center">
                                <div className="text-xl">
                                    {time[2]}
                                </div>

                                <div className="font-thin mt-2 text-sm">
                                    SEC
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PlayComponent.propTypes = {
    icon: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    prizePool: PropTypes.string.isRequired,
    currPlayers: PropTypes.string.isRequired,
    maxPlayers: PropTypes.string.isRequired,
    timeLeft: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayComponent;