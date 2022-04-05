import PropTypes from 'prop-types';
import Image from 'next/image'
import React from 'react'

const MarketplaceContainer = (props) => {
  const { children, AthleteName, LowAsk, id } = props;

  return (
    <div data-test="PerformerContainer" className={`justify-center flex flex-col w-full h-full`}>
      <div className="flex justify-center h-2/3">
          <Image
            src={"/../public/images/tokens/"+id+".png"}
            width={120}
            height={160}
          />
      </div>
      {children}
      <div className="h-1/2 flex justify-center mb-2">
        <div className="flex flex-col mt-4">
          <div className="text-xs font-bold">{AthleteName}</div>
          <div className="mt-4 text-xs font-thin">LOWEST ASK</div>
          <div className="text-xs font-bold">{LowAsk}</div>
        </div>
      </div>
    </div>
  );
};

MarketplaceContainer.propTypes = {
  AthleteName: PropTypes.string,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string,
  imagesrc: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

MarketplaceContainer.defaultProps = {
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default MarketplaceContainer;
