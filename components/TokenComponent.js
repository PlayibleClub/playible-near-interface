import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const TokenComponent = (props) =>{
    const {playerID, children, isopen} = props;
    // const [reveal, revealMe] = useState(false);
    const picLink = "/../public/images/tokens/"+playerID+".png"

    console.log('playerID is ' + playerID)
    console.log('isopen is ' + isopen)
    

    if(isopen){

        return (
            <div className="w-32 h-48 overflow-hidden ease-in-out transform scale-125 cursor-pointer">
                    <Image
                        src={picLink}
                        width={150}
                        height={210}
                    />
            </div>
        )
        
    }
    
    else {
        return (
            <div className="w-32 h-48 overflow-hidden ease-in-out transform scale-125 cursor-pointer">
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