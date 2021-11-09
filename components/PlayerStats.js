import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import {BrowserView, MobileView} from 'react-device-detect'

const PlayerStats = (props) =>{
    const {player, children, isNarrowScreen} = props;
    return (
        <>
            <MobileView>
                <div className="flex flex-col">
                    <div className="flex justify-between mb-4">
                        <div className="w-36 font-thin">
                            <div>POINTS</div>
                        </div>
                        <div className=" w-24">
                            <div>{player.points.score}</div> 
                        </div>
                        <div className="font-thin">
                            <div>{player.points.pos}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="w-36 font-thin">
                            <div>REBOUNDS</div>
                        </div>
                        <div className="w-24">
                            <div>{player.rebounds.score}</div> 
                        </div>
                        <div className="font-thin">
                            <div>{player.rebounds.pos}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="w-36 font-thin">
                            <div>ASSISTS</div>
                        </div>
                        <div className="w-24">
                            <div>{player.assists.score}</div> 
                        </div>
                        <div className="font-thin">
                            <div>{player.assists.pos}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="w-36 font-thin">
                            <div>BLOCKS</div>
                        </div>
                        <div className="w-24">
                            <div>{player.blocks.score}</div> 
                        </div>
                        <div className="font-thin">
                            <div>{player.blocks.pos}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4">
                        <div className="w-36 font-thin">
                            <div>STEALS</div>
                        </div>
                        <div className="w-24 mr-1">
                            <div>{player.steals.score}</div> 
                        </div>
                        <div className="font-thin">
                            <div>{player.steals.pos}</div>
                        </div>
                    </div>
                </div>
            </MobileView>

            <BrowserView>
                <div className="flex md:border mt-2 md:p-12 rounded-lg text-xs">
                    <div className="grid grid-cols-2 gap-16 md:gap-24 md:grid-cols-5">
                        <div className="flex flex-col">
                            <div className="font-bold text-6xl mb-2">
                                <div>{player.points.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>POINTS</div>
                            </div>
                            <div className="font-thin">
                                <div>{player.points.pos}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-bold text-6xl mb-2">
                                <div>{player.rebounds.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>REBOUNDS</div>
                            </div>
                            <div className="font-thin">
                                <div>{player.rebounds.pos}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-bold text-6xl mb-2">
                                <div>{player.assists.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>ASSISTS</div>
                            </div>
                            <div className="font-thin">
                                <div>{player.assists.pos}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-bold text-6xl mb-2">
                                <div>{player.blocks.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>BLOCKS</div>
                            </div>
                            <div className="font-thin">
                                <div>{player.blocks.pos}</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-bold text-6xl mb-2">
                                <div>{player.steals.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>STEALS</div>
                            </div>
                            <div className="font-thin">
                                <div>{player.steals.pos}</div>
                            </div>
                        </div>
                        {/* <div className="flex justify-between mb-4 items-center">
                            <div className="w-36 font-thin">
                                <div>REBOUNDS</div>
                            </div>
                            <div className="font-bold w-24 text-lg">
                                <div>{player.rebounds.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>{player.rebounds.pos}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-36 font-thin">
                                <div>ASSISTS</div>
                            </div>
                            <div className="w-24 font-bold text-lg">
                                <div>{player.assists.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>{player.assists.pos}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-36 font-thin">
                                <div>BLOCKS</div>
                            </div>
                            <div className="w-24 font-bold text-lg">
                                <div>{player.blocks.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>{player.blocks.pos}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-36 font-thin">
                                <div>STEALS</div>
                            </div>
                            <div className="w-24 font-bold text-lg">
                                <div>{player.steals.score}</div> 
                            </div>
                            <div className="font-thin">
                                <div>{player.steals.pos}</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </BrowserView>
        </>
    )
}

PlayerStats.propTypes = {
    player: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayerStats;