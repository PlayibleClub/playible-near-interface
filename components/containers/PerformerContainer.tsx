import PropTypes from 'prop-types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

const PerformerContainer = (props) => {
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
    hoverable = true,
    athletePosition,
    isInGame,
    isSelected,
    fromPortfolio,
  } = props;
  return (
    <div
      data-test="PerformerContainer"
      className={`justify-center flex flex-col w-full h-full pb-12` }
    >
      <div className="self-center mr-10">
        {isInGame && (
          <div className="bg-indigo-lightgreen text-indigo-white text-center text-xs font-bold py-1 px-3 mb-2">
            IN GAME
          </div>
        )}
      </div>
      <div
        className={`flex justify-center h-2/3 ${
          hoverable ? 'cursor-pointer hover:-translate-y-1 transform transition-all' : ''
        } ${isInGame || isSelected ? 'opacity-50' : ''}`}
      >
        {uri ? (
          <div className="relative" style={{ width: '120px', height: '160px' }}>
            {fromPortfolio === true && 
              <Link href={`/AssetDetails/${id}`} passHref>
              
              </Link>
            }
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
          <div className="mt-2 text-xs font-bold">{AthleteName}</div>
          <div className="mt-4 text-xs font-thin">FANTASY SCORE</div>
          <div className="text-xs font-bold">{AvgScore}</div>
        </div>
      </div>
    </div>
  );
};

PerformerContainer.propTypes = {
  AthleteName: PropTypes.string,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string,
  id: PropTypes.string,
  AvgScore: PropTypes.number,
  uri: PropTypes.string,
  hoverable: PropTypes.bool,
  rarity: PropTypes.string,
  status: PropTypes.string,
  index: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  athletePosition: PropTypes.string,
  isInGame: PropTypes.bool,
  isSelected: PropTypes.bool,
  fromPortfolio: PropTypes.bool,
};

export default PerformerContainer;
