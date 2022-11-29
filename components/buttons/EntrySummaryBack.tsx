import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import Image from 'next/image';
import router from 'next/router';

const EntrySummaryBack = () => {
  return (
    <BrowserView>
      <div className="ml-7 text-indigo-buttonblue flex flex-row">
        <button type="button" className="flex flex-row" onClick={() => router.back()}>
          <img src="/images/navicons/icon_back.png" />
          <div className="mt-0.25">BACK</div>
        </button>
      </div>
    </BrowserView>
  );
};

EntrySummaryBack.defaultProps = {
  imagesrc: '/images/navicons/icon_back.png',
};

export default EntrySummaryBack;
