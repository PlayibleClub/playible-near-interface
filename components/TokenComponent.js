import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import { tokenDrawData } from '../data/index.js';


const TokenComponent = (props) =>{
    const {athlete_id, usage, name, rarity, release, team, isOpen, fantasy_score, img} = props;
    const picLink = img || "/images/tokensMLB/SP.png"    

    if(isOpen){

        return (
            <div className="w-32 h-48 transform cursor-pointer">
                    <img
                        src={picLink}
                        width={150}
                        height={210}
                    />
                    <div className="flex whitespace-nowrap text-sm flex-col font-thin">
                        <div className="font-black mt-2">
                            {name.toUpperCase()}
                        </div>
                        <div className="mt-4">
                            FANTASY SCORE
                        </div>
                        <div className="font-black mt-2">
                            {fantasy_score || 0}
                        </div>
                    </div>
            </div>
        )
        
    }
    
    else {
        return (
            <div className="w-32 h-48 overflow-hidden transform cursor-pointer">
            {/* remove animation bounce when proceeding */}
                    <Image
                        src= {"/../public/images/tokens/0.png"}
                        width={150}
                        height={210}
                    />
            </div>
        )
    }

    
}

TokenComponent.propTypes = {
    athlete_id: PropTypes.string.isRequired,
    usage: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    release: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default TokenComponent;