import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PlayerStats = (props) =>{
    const {player, children} = props;
    return (
        <>
            <div className="flex mt-2 md:p-12 rounded-lg text-xs">
                <div className="grid grid-cols-2 gap-16 md:gap-20 md:grid-cols-5">
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.singles || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>SINGLES</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.singles}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.doubles || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>DOUBLES</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.doubles.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.triples || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>TRIPLES</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.triples.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.home_runs || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>HOME RUNS</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.homeruns.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.runs_batted_in || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>RUNS BATTED IN</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.runsbatted.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.walks || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>WALKS</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.walks.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.hit_by_pitch || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>HIT BY PITCH</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.hitbypitch.pos}</div>
                        </div> */}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-6xl mb-2">
                            <div>{player.stolen_bases || 0}</div> 
                        </div>
                        <div className="font-thin">
                            <div>STOLEN BASES</div>
                        </div>
                        {/* <div className="font-thin">
                            <div>{player.stolenbases.pos}</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

PlayerStats.propTypes = {
    player: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayerStats;