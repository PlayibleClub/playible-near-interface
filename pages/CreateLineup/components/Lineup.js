import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import { CommunityPoolSpendProposal } from '@terra-money/terra.js';


const Lineup = (props) =>{
    const {position, player,id,score,nextposition} = props;
    const lineupPosition = "/../public/images/tokensMLB/"+position+".png"

    return (
        <>
            <div className='flex justify-center'>
                <Image src={lineupPosition}
                    width="143x"
                    height="190px"
                />
            </div>
            <div className="flex justify-center" >
                <div className="flex flex-col mt-4">
                <div className="text-xs font-thin">
                    #{id === '' ? '0' : id}
                </div>
                <div className="mb-3 text-sm ">{player === '' ? '-' : player}</div>
                <div className="text-xs font-thin">FANTASY SCORE </div>
                <div className="text-xs">{score === '' ? '-' : score}</div>
                </div>
            </div>
        </>
    )
}

export default Lineup;