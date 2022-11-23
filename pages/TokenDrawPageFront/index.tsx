import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as statusCode from '../../data/constants/status';

import { useDispatch, useSelector } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
// import { getLastRound, getRoundData, clearData } from '../../redux/reducers/contract/pack';

import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import TokenComponent from '../../components/TokenComponent';
import Main from '../../components/Main';
import 'regenerator-runtime/runtime';

const sampleList = [0, 1, 2, 3, 4, 5];

const TokenDrawPageFront = () => {
  const dispatch = useDispatch();

  const [isClosed, setClosed] = useState(true);
  const [loading, setLoading] = useState(false);

  // @ts-ignore:next-line
  const { drawList: tokenList, status } = useSelector((state) => state.contract.pack);

  const [assets, setassets] = useState([false, false, false, false, false]);

  const [packs, setpacks] = useState(true);

  function changecard(position) {
    if (assets[position] == false) {
      var newassets = [];
      newassets = assets;

      newassets[position] = true;
      setassets(newassets.concat());
    } else {
      var newassets = [];
      newassets = assets;

      newassets[position] = false;
      setassets(newassets.concat());
    }
    return;
  }

  return (
    <>
      <Container>
        {loading ? (
          <LoadingPageDark />
        ) : (
          <div
            className="pb-96"
            style={{
              backgroundImage: `url('../images/BackgroundMarket.PNG')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% auto',
              //backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <div className="flex flex-col pb-24">
              <div
                className="flex justify-center self-center w-10/12 h-10/12 py-64 mt-24"
                style={{ backgroundColor: 'white' }}
              >
                <div className="py-3">
                  <Link href="/TokenDrawPage">
                    <img
                      className="transform scale-200"
                      src="../images/packimages/BaseRelease1.png"
                      alt="..."
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default TokenDrawPageFront;
