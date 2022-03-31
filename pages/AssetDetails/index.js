import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Main from '../../components/Main';
import PlayerContainer from '../../components/containers/PlayerContainer';
import PlayerStats from '../../components/PlayerStats';
import Container from '../../components/containers/Container';

import filterIcon from '../../public/images/filterblack.png';
import underlineIcon from '../../public/images/blackunderline.png';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { connect, useDispatch, useSelector } from 'react-redux';

import ListingModal from './forms/ListingModal';
import CongratsModal from './components/congratsModal';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import BackFunction from '../../components/buttons/BackFunction';

import { playerdata } from './data';
import { position } from '../../utils/athlete/position';
import { axiosInstance } from '../../utils/playible';
import { ATHLETE } from '../../data/constants/contracts';

const AssetDetails = (props) => {
  const { queryObj, playerStats, playerImg } = props;
  const { register, handleSubmit } = useForm();
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
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

  function getAthleteStatus() {
    if (playerList.tokens && playerList.tokens.length > 0) {
      setMatchedId(playerList.tokens.filter((athlete) => athlete.token_id === query.token_id));
    }
  }

  useEffect(() => {
    if (typeof connectedWallet !== 'undefined') {
      getAthleteInfo();
    }
  }, [dispatch, connectedWallet]);

  useEffect(() => {
    if (query && query.token_id) {
      if (!playerList) {
        if (connectedWallet) {
          dispatch(getAccountAssets({ walletAddr: connectedWallet.walletAddress }));
        }
      } else {
        getAthleteStatus();
      }
    }
  }, [playerList, dispatch, connectedWallet, query]);

  const getAthleteInfo = async () => {
    setLoading(true);
    const res = await lcd.wasm.contractQuery(ATHLETE, {
      all_nft_info: {
        token_id: queryObj.token_id,
      },
    });
    const imgRes = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id)}/`);
    let img = imgRes.status === 200 ? imgRes.data.nft_image : null;
    if (res.info !== undefined) {
      setAssetData({
        ...res.info.extension,
        token_uri: img,
      });
      setData(imgRes);
    }
    if (playerStats) {
      setStats(playerStats.athlete_stat);
    }
    setLoading(false);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

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
                  playerID={assetData.token_info.info.extension.athlete_id}
                  rarity="base"
                />
              </div>
              <div>
                <div>
                  <div className="font-thin text-xs mt-4">
                    #{assetData.token_info.info.extension.athlete_id}/25000
                  </div>

                  <div className="text-sm font-bold">
                    {assetData.token_info.info.extension.name}
                  </div>

                  <div className="font-thin mt-4 text-xs">FANTASY SCORE</div>

                  <div className="text-sm font-bold">{assetData.fantasy_score}</div>
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
          asset={assetData}
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
                    playerID={assetData.token_info.info.extension.athlete_id}
                    rarity="base"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  <div className="font-bold">
                    #{assetData.token_info.info.extension.athlete_id}/25000
                  </div>

                  <div className="font-thin">SERIAL NUMBER</div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{assetData.silvercost}</div>

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
                <div className="text-indigo-white">PURCHASE NOW - {assetData.silvercost}</div>
              </button>
            </div>
          </div>
        </>
      )}
      <Container>
        {loading ? (
          <LoadingPageDark />
        ) : (
          <div className="flex flex-col w-screen md:w-full overflow-y-auto h-auto justify-center self-center">
            <div className="flex">
              <div className="flex flex-col w-full h-screen">
                <Main color="indigo-white">
                  {stats && assetData ? (
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                      <div className="md:ml-8">
                        <div className="mt-8">
                          <BackFunction
                            prev={
                              query.origin.toLowerCase() === 'portfolio'
                                ? '/Portfolio/'
                                : '/Marketplace/'
                            }
                          />
                        </div>

                        <PortfolioContainer textcolor="indigo-black" title="PLAYER DETAILS">
                          <div className="flex flex-col mt-2 mb-8">
                            <div className="flex md:flex-row flex-col md:mt-8">
                              <div>
                                <div className="ml-8 md:ml-6 mr-16">
                                  <PlayerContainer
                                    img={matchedId.length > 0 && matchedId[0].token_info.info.token_uri || assetData.token_uri}
                                    playerID={assetData.athlete_id}
                                    rarity="base"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <div className="ml-8 md:ml-0 mb-4 md:mb-0 mt-8 md:mt-0">
                                  {query.origin.toLowerCase() === 'portfolio' && (
                                    <div className="font-thin text-sm">
                                      #{assetData.athlete_id}/25000
                                    </div>
                                  )}

                                  <div className="text-sm">{assetData.name}</div>

                                  <div className="font-thin mt-4 text-sm">FANTASY SCORE</div>

                                  <div className="text-sm mb-4">{stats.fantasy_score || 0}</div>
                                </div>

                                {/* <div className="flex flex-col md:flex-row md:justify-between mb-2 text-sm ml-8 md:ml-0">                         
                                          <div>
                                            <div className="font-thin">
                                              OWNER
                                            </div>
                                            {connectedWallet.walletAddress === assetData["owner"] ? "YOU" : assetData["owner"]}
                                          </div>
                                        </div> */}

                                {/* { query.origin === 'portfolio' &&
                                            <div className="" onClick={()=>{ setListingModal(true) }}>
                                              POST FOR SALE
                                            </div>
                                          }

                                          { query.origin === 'marketplace' &&
                                            <div className="" onClick={()=>{ setModal(true) }}>
                                              PURCHASE TOKEN
                                            </div>
                                          } */}
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
                                <img src={filterIcon} className="object-none w-4 mr-4" />
                              </div>
                            </div>
                          </div>
                        </PortfolioContainer>

                        <div className="mt-10 flex flex-col md:flex-row justify-between">
                          <PortfolioContainer
                            textcolor="indigo-black"
                            title="PLAYER STATS"
                            stats={String(stats.fantasy_score || 0)}
                          />
                          <div className="self-center md:mr-24">
                            <div className="bg-indigo-white h-11 flex justify-between self-center font-thin w-80 mt-6 border-2 border-indigo-lightgray border-opacity-50">
                              <div className="text-lg ml-4 mt-2 text-indigo-black">
                                <form onSubmit={handleSubmit(handleFilter)}>
                                  <select
                                    value={statfilter}
                                    className="filter-select bg-indigo-white"
                                    onChange={handleFilter}
                                  >
                                    <option name="sevendays" value="sevendays">
                                      Last 7 days
                                    </option>
                                    <option name="month" value="month">
                                      Last month
                                    </option>
                                    <option name="year" value="year">
                                      Last year
                                    </option>
                                  </select>
                                </form>
                              </div>
                              <img src={filterIcon} className="object-none w-4 mr-4" />
                            </div>
                          </div>
                        </div>
                        <div className="text-indigo-white bg-indigo-black w-48 py-4 text-3xl font-bold text-center ml-6 mt-8 md:mt-0">
                          {position('baseball', assetData.position)}
                        </div>
                        <div className="flex flex-col justify-center self-center md:mr-24 mb-8 md:ml-6">
                          <div className="mt-8 mb-16 self-center">
                            <PlayerStats player={stats} />
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

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  let queryObj = null;
  if (query) {
    if (query.id && query.token_id) {
      queryObj = query;
    } else {
      return {
        redirect: {
          destination: query.origin || '/Portfolio',
          permanent: false,
        },
      };
    }
  }

  let playerStats = null;
  const res = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id) + 1}/stats/`);

  if (res.status === 200) {
    playerStats = res.data;
  }
  return {
    props: { queryObj, playerStats },
  };
}
