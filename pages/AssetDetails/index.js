import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'regenerator-runtime/runtime';

import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Main from '../../components/Main';
import PlayerContainer from '../../components/containers/PlayerContainer';
import PlayerStats from '../../components/PlayerStats';
import Container from '../../components/containers/Container';

import filterIcon from '../../public/images/filterBlack.png';
import underlineIcon from '../../public/images/blackunderline.png';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { connect, useDispatch, useSelector } from 'react-redux';

import ListingModal from './forms/ListingModal';
import CongratsModal from './components/CongratsModal';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import BackFunction from '../../components/buttons/BackFunction';

import { position } from '../../utils/athlete/position';
import { axiosInstance } from '../../utils/playible';
import { ATHLETE } from '../../data/constants/contracts';

import {
  GET_ATHLETEDATA_QB,
  GET_ATHLETEDATA_RB,
  GET_ATHLETEDATA_WR,
  GET_ATHLETEDATA_TE,
} from '../../utils/queries/index.ts';
import { useLazyQuery } from '@apollo/client';

const AssetDetails = (props) => {
  const { queryObj, playerStats, playerImg } = props;

  const [loading, setLoading] = useState(false);
  const [tokenCongrats, setTokenCongrats] = useState(false);
  const [displayModal, setModal] = useState(false);
  const [congratsModal, displayCongrats] = useState(false);
  const [listingModal, setListingModal] = useState(false);
  const [assetData, setAssetData] = useState(null);
  const [Data, setData] = useState(null);
  const [stats, setStats] = useState(null);

  const [matchedId, setMatchedId] = useState([]);

  const [statfilter, setFilter] = useState('sevendays');
  const filterList = [
    'singles',
    'doubles',
    'triples',
    'home_runs',
    'runs_batted_in',
    'walks',
    'hit_by_pitch',
    'stolen_bases',
  ];
  const { query } = useRouter();

  const { list: playerList } = useSelector((state) => state.assets);

  const [athleteData, setAthleteData] = useState([]);

  const tempPos = 'QB';
  const tempId = 2163;

  const [getAthleteQB, { loadingQB, errorQB, dataQB }] = useLazyQuery(GET_ATHLETEDATA_QB);
  const [getAthleteRB, { loadingRB, errorRB, dataRB }] = useLazyQuery(GET_ATHLETEDATA_RB);
  const [getAthleteWR, { loadingWR, errorWR, dataWR }] = useLazyQuery(GET_ATHLETEDATA_WR);
  const [getAthleteTE, { loadingTE, errorTE, dataTE }] = useLazyQuery(GET_ATHLETEDATA_TE);

  async function getData(x) {
    switch (x) {
      case 'QB':
        const QBdata = await getAthleteQB({ variables: { getAthleteByIdId: tempId } });
        setAthleteData(QBdata.data.getAthleteById);
        console.log(athleteData);
        console.log(QBdata.data.getAthleteById);
        break;
      case 'RB':
        const RBdata = await getAthleteRB({ variables: { getAthleteByIdId: tempId } });
        console.log(RBdata.data.getAthleteById);
        break;
      case 'WR':
        const WRdata = await getAthleteWR({ variables: { getAthleteByIdId: tempId } });
        console.log(WRdata.data.getAthleteById);
        break;
      case 'TE':
        const TEdata = await getAthleteTE({ variables: { getAthleteByIdId: tempId } });
        console.log(TEdata.data.getAthleteById);
        break;
    }
  }

  useEffect(() => {
    getData(tempPos);
  }, [athleteData]);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  //   const imgRes = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id)}/`);
  //   let img = imgRes.status === 200 ? imgRes.data.nft_image : null;
  //   if (res.info !== undefined) {
  //     setAssetData({
  //       ...res.info.extension,
  //       token_uri: img,
  //     });
  //     setData(imgRes);
  //   }
  //   if (playerStats) {
  //     setStats(playerStats.athlete_stat);
  //   }
  //   setLoading(false);
  // };

  // const handleFilter = (event) => {
  //   setFilter(event.target.value);
  // };

  return (
    <div className={`font-montserrat`}>
      {tokenCongrats && (
        <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
          <div className="relative p-8 bg-indigo-white w-80 h-10/12 m-auto flex-col flex rounded-lg">
            <button
              onClick={() => {
                setTokenCongrats(false);
              }}
            >
              <div className="absolute top-0 right-0 p-4 font-black">X</div>
            </button>

            <div className="font-bold flex flex-col">
              CONGRATULATIONS!
              <img src={underlineIcon} className="sm:object-none md:w-6" />
            </div>

            <div className="flex flex-col mt-4 items-center">
              <div className="">
                <PlayerContainer
                  // playerID={
                  //   assetData.attributes.filter((item) => item.trait_type === 'athlete_id')[0].value
                  // }
                  rarity="base"
                />
              </div>
              <div>
                <div>
                  <div className="font-thin text-xs mt-4"></div>

                  <div className="text-sm font-bold">
                    {/* {assetData.token_info.info.extension.name} */}
                  </div>

                  <div className="font-thin mt-4 text-xs">FANTASY SCORE</div>
                  {/* <div className="text-sm font-bold">{assetData.fantasy_score}</div> */}
                </div>
              </div>
            </div>

            <Link href="/Portfolio">
              <button className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-6 self-center">
                <div className="text-indigo-white">GO TO SQUAD</div>
              </button>
            </Link>
          </div>
        </div>
      )}
      {congratsModal && (
        <CongratsModal
          onClose={() => {
            displayCongrats(false);
          }}
        />
      )}
      {listingModal && (
        <ListingModal
          // asset={assetData}
          onClose={() => {
            setListingModal(false);
          }}
          onSubmit={() => {
            setListingModal(false);
            displayCongrats(true);
          }}
        />
      )}
      {displayModal && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  setModal(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="font-bold flex flex-col text-2xl">
                  PURCHASE NOW
                  <img src={underlineIcon} className="sm:object-none w-6" />
                </div>
              </div>

              <div className="flex flex-col mt-4 items-center">
                <div className="">
                  <PlayerContainer
                    // playerID={
                    //   assetData.attributes.filter((item) => item.trait_type === 'athlete_id')[0]
                    //     .value
                    // }
                    rarity="base"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  <div className="font-thin">SERIAL NUMBER</div>
                </div>

                <div className="text-right">
                  {/* <div className="font-bold">{assetData.silvercost}</div> */}

                  <div className="font-thin">PRICE</div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div>
                  <div className="font-bold">@masterworm</div>

                  <div className="font-thin">OWNER</div>
                </div>

                <div className="text-right">
                  <div className="font-bold">0x2d95...a02c</div>

                  <div className="font-thin">CONTACT ADDRESS</div>
                </div>
              </div>

              <button
                className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center"
                onClick={() => {
                  setModal(false);
                  setTokenCongrats(true);
                }}
              >
                {/* <div className="text-indigo-white">PURCHASE NOW - {assetData.silvercost}</div> */}
              </button>
            </div>
          </div>
        </>
      )}
      <Container activeName="SQUAD">
        {loading ? (
          <LoadingPageDark />
        ) : (
          <div className="flex flex-col w-screen md:w-full overflow-y-auto h-auto justify-center self-center">
            <div className="flex">
              <div className="flex flex-col w-full h-screen">
                <Main color="indigo-white">
                  {athleteData ? (
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                      <div className="md:ml-8">
                        {/* <div className="mt-8">
                          <BackFunction prev={query.origin || '/Portfolio/'} />
                        </div> */}

                        <PortfolioContainer textcolor="indigo-black" title="PLAYER DETAILS">
                          <div className="flex flex-col mt-2 mb-8">
                            <div className="flex md:flex-row flex-col md:mt-8">
                              <div>
                                <div className="ml-8 md:ml-6 mr-16">
                                  <PlayerContainer
                                    img={athleteData.nftImage || null}
                                    // playerID={
                                    //   assetData.attributes.filter(
                                    //     (item) => item.trait_type === 'athlete_id'
                                    //   )[0].value
                                    // }
                                    // rarity="base"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <div className="ml-8 md:ml-0 mb-4 md:mb-0 mt-8 md:mt-0">
                                  {/* <div className="text-sm">
                                  {
                                    assetData.attributes.filter(
                                      (item) => item.trait_type === 'name'
                                    )[0].value
                                  }
                                </div> */}

                                  <div className="font-thin mt-4 text-sm">FANTASY SCORE</div>

                                  {/* <div className="text-sm mb-4">{stats.fantasy_score || 0}</div> */}
                                </div>
                                <div className="">
                                  {matchedId.length > 0 && matchedId[0].is_locked ? (
                                    <button className="bg-indigo-lightgreen text-indigo-white w-5/6 md:w-72 h-10 text-center font-bold text-md mt-4 self-center justify-center">
                                      IN GAME
                                    </button>
                                  ) : (
                                    <button className="bg-indigo-lightblue text-indigo-buttonblue w-5/6 md:w-80 h-10 text-center font-bold text-md mt-4 self-center justify-center cursor-not-allowed">
                                      PLACE FOR SALE - COMING SOON
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </PortfolioContainer>

                        <div className="mt-10 flex flex-col md:flex-row justify-between">
                          <PortfolioContainer
                            textcolor="indigo-black font-monument"
                            title="PLAYER STATS"
                            // stats={String(stats.fantasy_score || 0)}
                          />
                          
                        </div>
                        <div className="text-indigo-white bg-indigo-black w-max font-monument p-4 text-3xl font-thin uppercase text-center ml-6 mt-8 md:mt-5">
                          {/* {position(
                            'baseball',
                            assetData.attributes.filter((item) => item.trait_type === 'position')[0]
                              .value
                          )} */}
                        </div>
                        <div className="flex flex-col justify-center self-center md:mr-24 mb-8 md:ml-6">
                          <div className="mt-8 mb-16 self-center">
                            {/* <PlayerStats
                              // player={stats}
                              // position={position(
                              //   'baseball',
                              //   assetData.attributes.filter(
                              //     (item) => item.trait_type === 'position'
                              //   )[0].value
                              // )}
                            /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Cannot load player details</p>
                  )}
                </Main>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AssetDetails;

// export async function getServerSideProps(ctx) {
//   const { query } = ctx;
//   let queryObj = null;
//   if (query) {
//     if (query.id && query.token_id) {
//       queryObj = query;
//     } else {
//       return {
//         redirect: {
//           destination: query.origin || '/Portfolio',
//           permanent: false,
//         },
//       };
//     }
//   }

//   let playerStats = null;
//   const res = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id)}/stats/`);

//   if (res.status === 200) {
//     playerStats = res.data;
//   }
//   return {
//     props: { queryObj, playerStats },
//   };
// }
