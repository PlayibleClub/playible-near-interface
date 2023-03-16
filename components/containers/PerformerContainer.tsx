import PropTypes from 'prop-types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { checkInjury, cutAthleteName } from 'utils/athlete/helper';
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
    isActive,
    status,
    index,
    hoverable = true,
    athletePosition,
    isInjured,
    isInGame,
    isSelected,
    fromPortfolio = true,
    fromHome = false,
    currentSport,
    gameCount,
  } = props;

  return (
    <div
      data-test="PerformerContainer"
      className={`justify-center flex flex-col w-full h-full md:pb-12`}
    >
      <div className="self-center mr-10">
        <div
          className={`h-10 md:h-6 py-1 px-3 mb-2 ${
            isInGame ? 'bg-indigo-lightgreen text-indigo-white text-center text-xs font-bold' : ''
          } `}
        >
          {isInGame ? 'IN GAME' : ''}
        </div>
        {/* {isInGame && (
          <div className="bg-indigo-lightgreen text-indigo-white text-center text-xs font-bold py-1 px-3 mb-2">
            IN GAME
          </div>
        )} */}
      </div>
      <div
        className={`flex justify-center h-2/3 ${
          hoverable ? 'cursor-pointer hover:-translate-y-1 transform transition-all' : ''
        } ${isInGame || isSelected ? 'opacity-50' : ''}`}
      >
        {uri ? (
          <div className="relative" style={{ width: '120px', height: '160px' }}>
            {fromHome === false && fromPortfolio === true ? (
              <Link href={`/AssetDetails/${currentSport?.toLowerCase()}/${id}`} passHref>
                <div className="absolute z-50" style={{ width: '120px', height: '160px' }}></div>
              </Link>
            ) : (
              <div className="absolute z-50" style={{ width: '120px', height: '160px' }}></div>
            )}

            <object
              className="absolute z-10"
              type="image/svg+xml"
              data={uri}
              width={120}
              height={160}
            />
          </div>
        ) : (
          <Image src={'/images/tokensMLB/SP.png'} width={120} height={160} alt="token-bare" />
        )}
      </div>
      {children}
      <div className="h-1/2 flex justify-center mb-6">
        <div className="flex flex-col w-28 mt-4">
          <div className="mt-2 text-xs font-bold uppercase">
            {AthleteName.length >= 14 ? cutAthleteName(AthleteName) : AthleteName}
          </div>
          <div>
            <div className="group relative ml-28">
              {/* {isInjured && checkInjury(isInjured) === 1 ? (
                <div className="rounded-full mt-4 bg-indigo-yellow w-3 h-3 absolute "></div>
              ) : isInjured && checkInjury(isInjured) === 2 ? (
                <div className="mt-4 -ml-2 rounded-full bg-indigo-red w-3 h-3  absolute"></div>
              ) : isActive ? (
                <div className="mt-4 -ml-2 rounded-full bg-indigo-green w-3 h-3  absolute"></div>
              ) : (
                <></>
              )} */}
              <div
                className={`rounded-full mt-4 -ml-2 w-3 h-3 absolute ${
                  isInjured && checkInjury(isInjured) === 1
                    ? 'bg-indigo-yellow'
                    : isInjured && checkInjury(isInjured) === 2
                    ? 'bg-indigo-red'
                    : 'bg-indigo-green'
                }`}
              ></div>
              <span
                className={`whitespace-pre-line pointer-events-none absolute ${
                  (isInjured === null || checkInjury(isInjured) === 1) && fromPortfolio !== true
                    ? '-top-9'
                    : '-top-5'
                } -left-8 w-max rounded px-2 py-1 bg-indigo-gray text-indigo-white text-sm font-medium text-gray-50 shadow opacity-0 transition-opacity group-hover:opacity-100`}
              >
                {/* {isInjured !== null && fromPortfolio !== true
                  ? isInjured
                  : fromPortfolio !== true
                  ? `ACTIVE
                 Games: ${gameCount}`
                  : `ACTIVE`} */}
                {isInjured !== null && checkInjury(isInjured) === 1 && fromPortfolio !== true // questionable/probable and is in AthleteSelect
                  ? `${isInjured}
                  Games: ${gameCount}`
                  : isInjured !== null &&
                    (checkInjury(isInjured) === 1 || checkInjury(isInjured) === 2) //questionable/probably or out, and is in Portfolio or rest of the pages
                  ? isInjured
                  : fromPortfolio !== true //Active, display game count for AthleteSelect
                  ? `ACTIVE
                  Games: ${gameCount}`
                  : 'ACTIVE'}
              </span>
            </div>
          </div>
          <div className="mt-4 text-xs font-thin">FANTASY SCORE </div>

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
  currentSport: PropTypes.string,
  fromPortfolio: PropTypes.bool,
  fromHome: PropTypes.bool,
  isInjured: PropTypes.string,
  isActive: PropTypes.bool,
  gameCount: PropTypes.number,
};

export default PerformerContainer;
