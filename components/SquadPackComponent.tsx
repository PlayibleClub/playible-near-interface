import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const PackContainer = (props) => {
  const { imagesrc = null, packName, releaseValue, link, type } = props;

  return (
    <Link href={`/PackDetails/${link}`}>
      <div data-test="PackContainer" className={`justify-center flex flex-col w-full h-full`}>
        <div
          className={`flex justify-center h-2/3 cursor-pointer hover:-translate-y-1 transform transition-all`}
        >
          <Image
            src={
              type.toLowerCase() === 'booster'
                ? '/images/packimages/BoosterPack1.png'
                : '/images/packimages/StarterPack1.png'
            }
            width={120}
            height={150}
          />
        </div>
        <div className="h-1/2 flex justify-center mb-6">
          <div className="flex flex-col mt-4">
            <div className="text-sm font-bold">{packName}</div>
            <div className="mt-1 text-xs font-thin">RELEASE {releaseValue}</div>
          </div>
        </div>
        {/* <div className="mt-6 mb-24 md:mb-6">
                        <button className="bg-indigo-buttonblue text-indigo-white w-64 md:w-2/3 h-12 text-center text-sm font-bold mt-2">
                            <div className="">
                                OPEN PACK
                            </div>
                        </button>
                </div> */}
      </div>
    </Link>
  );
};

PackContainer.propTypes = {
  PackName: PropTypes.string.isRequired,
  releaseValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  key: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PackContainer.defaultProps = {
  imagesrc: 'images/packimages/packs1.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default PackContainer;
