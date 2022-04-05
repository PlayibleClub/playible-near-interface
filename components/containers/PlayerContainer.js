import React from 'react';


const PlayerContainer = (props) =>{
    const {img = null} = props;

    return (
        <div className="overflow-hidden ease-in-out">
            {/* {rarity === 'gold' && 
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
            } */}
            <img src={img || '/images/tokensMLB/SP.png'} width={125} height={160} />
        </div>
    )
}

export default PlayerContainer;