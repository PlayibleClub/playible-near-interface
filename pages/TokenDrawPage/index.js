import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import TokenComponent from '../../components/TokenComponent';
import Main from '../../components/Main';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { executeContract, queryContract, retrieveTxInfo } from '../../utils/terra';
import { OPENPACK, PACK, ATHLETE } from '../../data/constants/contracts';
import { axiosInstance } from '../../utils/playible';
import 'regenerator-runtime/runtime';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const sampleList = [0, 1, 2, 3, 4, 5];

const TokenDrawPage = (props) => {
  const { queryObj, newAthletes, error = null } = props;

  const dispatch = useDispatch();
  const lcd = useLCDClient();
  const [err, setErr] = useState(error);

  const [loading, setLoading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const [assets, setassets] = useState([]);
  const [athletes, setAthletes] = useState([]);

  const [packs, setpacks] = useState(true);
  const walletConnection = useSelector((state) => state.external.playible.wallet.data);
  const [wallet, setWallet] = useState(null);

  const activeChecker = () => {
    if (athletes.length > 0) {
      const notRevealed = athletes.filter((item) => !item.isOpen);

      if (notRevealed.length > 0) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  };

  const revealAll = () => {
    const tempAthletes = athletes.map((item) => {
      return {
        ...item,
        isOpen: true,
      };
    });

    setAthletes(tempAthletes);
  };

  const changecard = (position) => {
    if (athletes[position].isOpen === false) {
      const updatedList = [...athletes];
      const updatedAthlete = {
        ...athletes[position],
        isOpen: true,
      };
      updatedList.splice(position, 1, updatedAthlete);
      setAthletes(updatedList);
    }
  };

  const prepareNewAthletes = async () => {
    if (assets.length > 0) {
      const detailedAssets = assets.map(async (id, i) => {
        return await getAthleteInfo(id);
      });

      const tempAthletes = await Promise.all(detailedAssets);
      setAthletes(tempAthletes.filter((item) => item));
    }

    setLoading(false);
  };

  const getAthleteInfo = async (id) => {
    const res = await lcd.wasm.contractQuery(ATHLETE, {
      all_nft_info: {
        token_id: id,
      },
    });

    if (res.info) {
      const details = await axiosInstance.get(
        `/fantasy/athlete/${
          res.info.extension.attributes.filter((item) => item.trait_type === 'athlete_id')[0].value
        }/stats/`
      );
      const imgRes = await axiosInstance.get(
        `/fantasy/athlete/${parseInt(
          res.info.extension.attributes.filter((item) => item.trait_type === 'athlete_id')[0].value
        )}/`
      );

      let stats = null;
      const img = imgRes.status === 200 ? imgRes.data.nft_image : null;
      const animation = imgRes.status === 200 ? imgRes.data.animation : null;

      if (details.status === 200) {
        stats = details.data.athlete_stat;
      }

      const newAthlete = {
        ...res.info.extension,
        ...stats,
        isOpen: false,
        img,
        animation,
      };

      return newAthlete;
    }
  };

  useEffect(async () => {
    if (walletConnection) {
      // walletConnection.nearConfig.networkId -> to determine what network (testnet or mainnet)
      // setErr("You are not in the *intended network*") to notify user that they are not in the intended network
      setWallet(walletConnection.walletConnection.isSignedIn());
    } else {
      setLoading(false);
      setWallet(null);
    }
  }, [walletConnection]);

  const onVideoEnded = () => {
    setVideoPlaying(false);
  };

  useEffect(() => {
    if (isMobile) {
      setVideoPlaying(false);
    }
  }, []);

  return (
    <>
      <Container activeName="SQUAD">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            {videoPlaying ? (
              <div className="player-wrapper">
                <video className="open-pack-video" autoPlay muted onEnded={onVideoEnded}>
                  <source src="/videos/starter-pack-white.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ) : (
              <>
                {loading ? (
                  <LoadingPageDark />
                ) : (
                  <div className="mb-10">
                    <div>
                      {!wallet || err ? (
                        <p className="ml-12 mt-5">{err || 'Waiting for wallet connection...'}</p>
                      ) : (
                        <>
                          {athletes.length > 0 && activeChecker() && (
                            <div className="flex justify-center my-2 w-full">
                              <button
                                className="bg-indigo-buttonblue cursor-pointer text-indigo-white w-5/6 md:w-80 h-14 text-center font-bold text-md uppercase"
                                onClick={revealAll}
                              >
                                Reveal all
                              </button>
                            </div>
                          )}
                          <div
                            className="flex justify-center self-center"
                            style={{ backgroundColor: 'white' }}
                          >
                            <div className="flex flex-row flex-wrap justify-center">
                              {athletes.length > 0
                                ? athletes.map((data, key) => (
                                    <div className="flex px-14 py-10 m-10" key={key}>
                                      <div
                                        onClick={() => {
                                          changecard(key);
                                        }}
                                      >
                                        <TokenComponent
                                          athlete_id={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'athlete_id'
                                            )[0].value
                                          }
                                          position={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'position'
                                            )[0].value
                                          }
                                          rarity={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'rarity'
                                            )[0].value
                                          }
                                          release={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'release'
                                            )[0].value
                                          }
                                          team={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'team'
                                            )[0].value
                                          }
                                          usage={
                                            data.attributes.filter(
                                              (item) => item.trait_type === 'usage'
                                            )[0].value
                                          }
                                          isOpen={data.isOpen}
                                          name={''}
                                          fantasy_score={data.fantasy_score}
                                          img={data.animation}
                                        />
                                      </div>
                                    </div>
                                  ))
                                : ''}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex h-14 mt-16">
                      <div className="bg-indigo-black w-full justify-end flex opacity-5"></div>
                      <Link href="/Portfolio" replace>
                        <button className="bg-indigo-buttonblue cursor-pointer text-indigo-white w-5/6 md:w-80 h-14 text-center font-bold text-md">
                          GO TO MY SQUAD
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </Main>
        </div>
      </Container>
    </>
  );
};

export default TokenDrawPage;

// export async function getServerSideProps(ctx) {
//   const { query } = ctx;
//   let queryObj = null;
//   const newAthletes = [];
//   let error = null;

//   if (query.txHash) {
//     queryObj = query;
//     if (query.txHash) {
//       const response = await retrieveTxInfo(query.txHash);

//       if (response && response.logs) {
//         const tokenList = response.logs[1].eventsByType.wasm.token_id;

//         if (tokenList && tokenList.length > 0) {
//           tokenList.forEach((id, i) => {
//             if (i !== 0) {
//               newAthletes.push(id);
//             }
//           });
//         }
//       } else {
//         error = 'An error occurred. Please refresh the page';
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         destination: '/Portfolio',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { queryObj, newAthletes, error },
//   };
// }
