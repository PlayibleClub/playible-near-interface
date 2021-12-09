import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const PlayerContainer = (props) =>{
    const {playerID, children, rarity} = props;

    return (
        <div className="overflow-hidden ease-in-out">
            {rarity === 'gold' && 
                <Image
                    src={"/../public/images/tokens/"+playerID+"g.png"}
                    width={125}
                    height={160}
                />
            }

            {rarity === 'silver' && 
                <Image
                    src={"/../public/images/tokens/"+playerID+"s.png"}
                    width={125}
                    height={160}
                />
            }

            {rarity === 'base' && 
                <Image
                    src={"/../public/images/tokens/"+playerID+".png"}
                    width={125}
                    height={160}
                />
            }
        </div>
    )
}

PlayerContainer.propTypes = {
    playerID: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayerContainer;