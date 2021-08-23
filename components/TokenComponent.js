import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const TokenComponent = (props) =>{
    const {playerID, children} = props;
    // const [reveal, revealMe] = useState(false);
    const picLink = "/../public/images/tokens/"+playerID+".png"

    return (
        <div className="w-64 h-64 overflow-hidden ease-in-out">
                <Image
                    src={picLink}
                    width={200}
                    height={250}
                />
        </div>
    )
}

TokenComponent.propTypes = {
    playerID: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default TokenComponent;