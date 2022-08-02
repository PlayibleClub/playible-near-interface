import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const TokenComponent = (props) => {
  const { type, children } = props;
  // const [reveal, revealMe] = useState(false);
  const tokenType = '/../public/images/packimages/' + type + '.png';

  return (
    <div className="overflow-hidden ease-in-out">
      <div className="mt-10">
        <Image src={tokenType} width={170} height={270} />
      </div>

      <div>
        <div className="font-black mt-10">PREMIUM PACK</div>
        <div className="font-thin">Release 3</div>
        <div className="font-thin mt-8">Price</div>
        <div className="font-black">UST 35</div>
      </div>
    </div>
  );
};

TokenComponent.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default TokenComponent;
