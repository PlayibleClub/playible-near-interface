import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const PlayerContainer = (props) =>{
    const {playerID, children} = props;
    const picLink = "/../public/images/tokens/"+playerID+".png"

    return (
        <div className="overflow-hidden ease-in-out">
                <Image
                    src={picLink}
                    width={125}
                    height={160}
                />
        </div>
    )
}

PlayerContainer.propTypes = {
    playerID: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayerContainer;