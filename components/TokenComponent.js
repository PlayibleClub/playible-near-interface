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
                    <div className="flex flex-col font-bold">
                        <div>
                            *number here*
                        </div>
                        <div>
                            {tokenDrawData[playerID-1].name}
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