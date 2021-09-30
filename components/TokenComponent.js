import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const TokenComponent = (props) =>{
    const {playerID, children} = props;
    // const [reveal, revealMe] = useState(false);
    const picLink = "/../public/images/tokens/"+playerID+".png"

    return (
        <div className="w-32 h-48 overflow-hidden ease-in-out">
                <Image
                    src={picLink}
                    width={150}
                    height={200}
                />
        </div>
    )
}

TokenComponent.propTypes = {
    playerID: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default TokenComponent;