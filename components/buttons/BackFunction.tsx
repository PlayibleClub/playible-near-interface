import React from 'react';
import { BrowserView } from 'react-device-detect';
import Link from 'next/link';

const BackFunction = (props) => {
  const { prev } = props;
  return (
    <BrowserView>
      <div className="ml-7 text-indigo-buttonblue flex flex-row">
        <Link href={`${prev}`} className="flex flex-row">
          <img src="/images/navicons/icon_back.png" />
          <div className="mt-0.25">BACK</div>
        </Link>
      </div>
    </BrowserView>
  );
};

BackFunction.defaultProps = {
  imagesrc: '/images/navicons/icon_back.png',
};

export default BackFunction;
