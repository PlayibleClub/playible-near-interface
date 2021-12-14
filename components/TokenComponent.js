import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'
import { tokenDrawData } from '../data/index.js';


const TokenComponent = (props) =>{
    const {playerID, children, isopen} = props;
    // const [reveal, revealMe] = useState(false);
    const picLink = "/../public/images/tokens/"+playerID+".png"

    console.log('playerID is ' + playerID)
    console.log('isopen is ' + isopen)
    

    if(isopen){

        return (
            <div className="w-32 h-48 transform cursor-pointer">
                    <Image
                        src={picLink}
                        width={150}
                        height={210}
                    />
                    <div className="flex text-sm flex-col font-thin">
                        <div className="mt-2">
                            #{tokenDrawData[playerID-1].id}/25000
                        </div>
                        <div className="font-bold mt-2">
                            {tokenDrawData[playerID-1].name.toUpperCase()}
                        </div>
                    </div>
            </div>
        )
        
    }
    
    else {
        return (
            <div className="w-32 h-48 overflow-hidden transform cursor-pointer animate-bounce">
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
    playerID: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default TokenComponent;