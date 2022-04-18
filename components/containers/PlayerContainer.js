import React from 'react';

const PlayerContainer = (props) => {
  const { img = null } = props;

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
      {img ? (
        <object
          type="image/svg+xml"
          data={img}
          width={120}
          height={160}
        />
      ) : (
        <Image src={'/images/tokensMLB/SP.png'} width={120} height={160} />
      )}
    </div>
  );
};

export default PlayerContainer;
