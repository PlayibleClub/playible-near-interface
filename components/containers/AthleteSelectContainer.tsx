import PropTypes from 'prop-types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

const AthleteSelectContainer = (props) => {
  const {
    uri,
    athleteName,
    avgScore,
    id,
    status,
    hoverable = true,
    index,
    //
  } = props;

  return (
    <div className="justify-center flex flex-col w-full h-full pb-4">
      <div className="self-center mr-10">
        {status === true && (
          <div className="bg-indigo-lightgreen text-indigo-white text-center text-xs font-bold px-3 mb-2">
          </div>
        )}
      </div>
      <div
        className={`flex justify-center mt-2 h-1/3 ${
          hoverable ? 'cursor-pointer hover:-translate-y-1 transform transition-all' : ''
        }`}
      >
        {uri ? (
          <div className="relative" style={{ width: '120px', height: '160px'}}>
            <div className="focus:outline-none focus:ring focus:ring-blue-300">
              <div className="absolute z-50" style={{ width: '120px', height: '160px'}}></div>
            </div>
            <object
              className="absolute-z10"
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
      <div className="h-full mt-16 flex justify-center ">
        <div className="flex flex-col mt-4">
          <div className="mt-2 text-xs font-bold">{athleteName}</div>
          <div className="mt-4 text-xs font-thin">FANTASY SCORE</div>
          <div className="text-xs font-bold">{avgScore}</div>
        </div>
      </div>
    </div>
  )
}

AthleteSelectContainer.propTypes = {
  uri: PropTypes.string,
  athleteName: PropTypes.string,
  avgScore: PropTypes.number,
  id: PropTypes.string,
  status: PropTypes.string,
  index: PropTypes.number,
};
export default AthleteSelectContainer;