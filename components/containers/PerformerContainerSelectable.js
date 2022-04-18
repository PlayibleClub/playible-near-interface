import PropTypes from 'prop-types';
import Image from 'next/image';
import React, { useState } from 'react';

const PerformerContainerSelectable = (props) => {
  const {
    children,
    color,
    imagesrc,
    uri,
    AthleteName,
    TeamName,
    CoinValue,
    AvgScore,
    id,
    rarity,
    status,
    index,
    selected,
    selectorFunction,
    token_id,
  } = props;
  // const [selected, setSelected] = useState(false);

  return (
    <div
      data-test="PerformerContainerSelectable"
      className={`justify-center flex flex-col w-full h-full relative select-none`}
    >
      <div
        className={`absolute top-0 right-0 mr-10 text-sm border border-indigo-buttonblue rounded-full flex justify-center items-center ${
          selected && selected.token_id === token_id ? 'bg-indigo-buttonblue text-indigo-white' : ''
        }`}
        style={{ width: '25px', height: '25px' }}
      >
        {selected && selected.token_id === token_id ? '✓' : ''}
      </div>
      {/* <div className="self-center mr-10">
        { status === 'forsale' &&
          <div className="bg-indigo-buttonblue text-indigo-white text-center text-xs font-bold py-1 px-3 mb-2">
            FOR SALE
          </div> 
        }
        { status === 'ingame' &&
          <div className="bg-indigo-lightgreen text-indigo-white text-center text-xs font-bold py-1 px-3 mb-2">
            IN GAME
          </div> 
        }
      </div> */}
      <div
        className="flex justify-center h-2/3 cursor-pointer hover:-translate-y-1 transform transition-all"
        onClick={selectorFunction}
      >
        {uri ? (
          // <img src={uri} width={120} height={160} />
          <div className="relative" style={{ width: '120px', height: '160px' }}>
            <div className="absolute z-50" style={{ width: '120px', height: '160px' }}></div>
            <object
              className="absolute z-10"
              type="image/svg+xml"
              data={uri}
              width={120}
              height={160}
            />
          </div>
        ) : (
          <Image src={'/images/tokensMLB/SP.png'} width={120} height={160} />
        )}
      </div>
      {children}
      <div className="h-1/2 flex justify-center mb-6">
        <div className="flex flex-col mt-4">
          <div className="text-sm uppercase font-bold cursor-pointer mt-1">{AthleteName}</div>
          <div className="mt-4 text-xs font-thin">FANTASY SCORE</div>
          <div className="text-xs font-bold">{AvgScore}</div>
        </div>
      </div>
    </div>
  );
};

export default PerformerContainerSelectable;
