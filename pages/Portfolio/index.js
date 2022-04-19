import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import PerformerContainer from '../../components/containers/PerformerContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountAssets, clearData } from '../../redux/reducers/external/playible/assets';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Link from 'next/link';
import SquadPackComponent from '../../components/SquadPackComponent';
import Container from '../../components/containers/Container';
import Sorter from './components/Sorter';
import { ATHLETE, PACK } from '../../data/constants/contracts';
import { axiosInstance } from '../../utils/playible';
import 'regenerator-runtime/runtime';

const Portfolio = () => {
  const [searchText, setSearchText] = useState('');
  const [displayMode, setDisplay] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [packLimit, setPackLimit] = useState(10);
  const [packOffset, setPackOffset] = useState(0);
  const [packPageCount, setPackPageCount] = useState(0);
  const [wallet, setWallet] = useState(null);

  const { list: playerList, status } = useSelector((state) => state.assets);

  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();
  const [sortedList, setSortedList] = useState([]);
  const [packs, setPacks] = useState([]);
  const [sortedPacks, setSortedPacks] = useState([]);
  const limitOptions = [5, 10, 30, 50];
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(!!connectedWallet);

  const fetchPacks = async () => {
    if (connectedWallet) {
      const formData = {
        owner_tokens_info: {
          owner: connectedWallet.walletAddress,
        },
      };
      const res = await lcd.wasm.contractQuery(PACK, formData);

      if (res && res.length > 0) {
        setPacks(res);
      } else {
        setPacks([]);
      }
    }
  };

  const changeIndex = (index) => {
    switch (index) {
      case 'next':
        setOffset(offset + 1);
        break;
      case 'previous':
        setOffset(offset - 1);
        break;
      case 'first':
        setOffset(0);
        break;
      case 'last':
        setOffset(pageCount - 1);
        break;

      default:
        break;
    }
  };

  const changeIndexPack = (index) => {
    switch (index) {
      case 'next':
        setPackOffset(packOffset + 1);
        break;
      case 'previous':
        setPackOffset(packOffset - 1);
        break;
      case 'first':
        setPackOffset(0);
        break;
      case 'last':
        setPackOffset(packPageCount - 1);
        break;

      default:
        break;
    }
  };

  const canNext = () => {
    if (offset + 1 === pageCount) {
      return false;
    } else {
      return true;
    }
  };

  const canNextPack = () => {
    if (packOffset + 1 === packPageCount) {
      return false;
    } else {
      return true;
    }
  };

  const canPrevious = () => {
    if (offset === 0) {
      return false;
    } else {
      return true;
    }
  };

  const canPreviousPack = () => {
    if (packOffset === 0) {
      return false;
    } else {
      return true;
    }
  };

  const applySortFilter = (list, filter, search = '') => {
    let tempList = [...list];

    if (tempList.length > 0) {
      let filteredList = tempList.filter(
        (item) =>
          item.token_info.info.extension.attributes
            .filter((data) => data.trait_type === 'name')[0]
            .value.toLowerCase()
            .indexOf(search.toLowerCase()) > -1
      );
      switch (filter) {
        case 'name':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'name')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'name'
                )[0].value
              )
          );
          return filteredList;
        case 'team':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'team')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'team'
                )[0].value
              )
          );
          return filteredList;
        case 'position':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'position')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'position'
                )[0].value
              )
          );
          return filteredList;
        default:
          return filteredList;
      }
    } else {
      return tempList;
    }
  };

  const resetFilters = (type = 'athlete') => {
    if (type === 'pack') {
      setPackOffset(0);
    } else {
      setOffset(0);
    }
  };

  useEffect(async () => {
    setLoading(true);
    setSortedList([]);
    if (connectedWallet && dispatch) {
      await dispatch(getAccountAssets({ walletAddr: connectedWallet.walletAddress }));
      await fetchPacks();
      setWallet(connectedWallet.walletAddress);
    } else {
      await dispatch(getAccountAssets({ clear: true }));
      setSortedList([]);
      setPacks([]);
      setSortedPacks([]);
      setWallet(null);
    }
    setLoading(false);
  }, [dispatch, connectedWallet?.walletAddress]);

  useEffect(() => {
    setLoading(true);
    if (playerList && connectedWallet) {
      if (playerList.tokens && playerList.tokens.length > 0) {
        const tempList = [...playerList.tokens];
        const filteredList = applySortFilter(tempList, filter, search).splice(
          limit * offset,
          limit
        );
        setSortedList(filteredList);
        if (search) {
          setPageCount(Math.ceil(applySortFilter(tempList, filter, search).length / limit));
        } else {
          setPageCount(Math.ceil(playerList.tokens.length / limit));
        }
      } else {
        setSortedList([]);
      }
    } else {
      setSortedList([]);
    }
    setLoading(false)
  }, [playerList, limit, offset, filter, search, connectedWallet?.walletAddress]);

  useEffect(() => {
    if (packs.length > 0) {
      const tempList = [...packs];
      const filteredList = tempList.splice(packLimit * packOffset, packLimit);
      setSortedPacks(filteredList);
      setPackPageCount(Math.ceil(packs.length / packLimit));
    } else {
      setSortedPacks([]);
    }
  }, [packs, packLimit, packOffset, connectedWallet?.walletAddress]);

  return (
    <Container>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          {loading ? (
            <LoadingPageDark />
          ) : (!wallet ? (
            <p className="ml-12 mt-5">Waiting for wallet connection...</p>
          ) : (
            <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-full self-center text-indigo-black">
              <div className="ml-6 flex flex-col md:flex-row md:justify-between">
                <PortfolioContainer title="SQUAD" textcolor="text-indigo-black" />
                {sortedList.length > 0 && displayMode ? (
                  <Sorter
                    list={sortedList}
                    setList={setSortedList}
                    resetOffset={() => setOffset(0)}
                    setSearchText={setSearch}
                    filterValue={filter}
                    filterHandler={(val) => setFilter(val)}
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="flex flex-col w-full">
                <div className="justify-center self-center w-full md:mt-4">
                  {displayMode ? (
                    <>
                      <div className="flex md:ml-4 font-bold ml-8 font-monument">
                        <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                          ATHLETES
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setDisplay(false);
                            setFilter(null);
                            resetFilters();
                          }}
                        >
                          PACKS
                        </div>
                      </div>
                      <hr className="opacity-50" />
                      {sortedList.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
                            {sortedList.map(function (player, i) {
                              const path = player.token_info.info.extension;
                              return (
                                <Link
                                  href={{
                                    pathname: '/AssetDetails',
                                    query: {
                                      id: path.attributes.filter(
                                        (item) => item.trait_type === 'athlete_id'
                                      )[0].value,
                                      origin: 'Portfolio',
                                      token_id: player.token_id,
                                    },
                                  }}
                                >
                                  <div className="mb-4" key={i}>
                                    <PerformerContainer
                                      AthleteName={
                                        path.attributes.filter(
                                          (item) => item.trait_type === 'name'
                                        )[0].value
                                      }
                                      AvgScore={player.fantasy_score}
                                      id={
                                        path.attributes.filter(
                                          (item) => item.trait_type === 'athlete_id'
                                        )[0].value
                                      }
                                      uri={
                                        player.nft_image || player.token_info
                                          ? player.nft_image
                                          : null
                                      }
                                      rarity={path.rarity}
                                      status={player.is_locked}
                                    />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          <div className="flex justify-between md:mt-5 mb-12 md:mr-6 p-5 mx-10">
                            <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
                              {pageCount > 1 && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndex('first')}
                                >
                                  First
                                </button>
                              )}
                              {pageCount !== 0 && canPrevious() && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndex('previous')}
                                >
                                  Previous
                                </button>
                              )}
                              <p className="mr-2">
                                Page {offset + 1} of {pageCount}
                              </p>
                              {pageCount !== 0 && canNext() && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndex('next')}
                                >
                                  Next
                                </button>
                              )}
                              {pageCount > 1 && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndex('last')}
                                >
                                  Last
                                </button>
                              )}
                            </div>
                            <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
                              <select
                                value={limit}
                                className="bg-indigo-white text-lg w-full outline-none"
                                onChange={(e) => {
                                  setLimit(e.target.value);
                                  setOffset(0);
                                }}
                              >
                                {limitOptions.map((option) => (
                                  <option value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="mt-7 ml-7 text-xl">
                          There are no assets in your portfolio
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <div className="flex md:ml-4 font-bold ml-8 font-monument">
                        <div
                          className="md:ml-8 mr-6 cursor-pointer"
                          onClick={() => {
                            setDisplay(true);
                            resetFilters('pack');
                          }}
                        >
                          ATHLETES
                        </div>

                        <div className="border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                          PACKS
                        </div>
                      </div>
                      <hr className="opacity-50" />

                      {sortedPacks.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
                            {sortedPacks.map((data, i) => {
                              const path = data.token_info.info.extension;
                              return (
                                <div className="mb-4 cursor-pointer" key={i}>
                                  <SquadPackComponent
                                    imagesrc={null}
                                    packName={path.name}
                                    releaseValue={
                                      path.attributes.filter(
                                        (item) => item.trait_type === 'release'
                                      )[0].value[1]
                                    }
                                    link={`?token_id=${data.token_id}&origin=Portfolio`}
                                    type={
                                      path.attributes.filter(
                                        (item) => item.trait_type === 'pack_type'
                                      )[0].value
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between md:mt-5 mb-12 md:mr-6 p-5 mx-10">
                            <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
                              {packPageCount > 1 && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndexPack('first')}
                                >
                                  First
                                </button>
                              )}
                              {packPageCount !== 0 && canPreviousPack() && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndexPack('previous')}
                                >
                                  Previous
                                </button>
                              )}
                              <p className="mr-2">
                                Page {packOffset + 1} of {packPageCount}
                              </p>
                              {packPageCount !== 0 && canNextPack() && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndexPack('next')}
                                >
                                  Next
                                </button>
                              )}
                              {packPageCount > 1 && (
                                <button
                                  className="px-2 border mr-2"
                                  onClick={() => changeIndexPack('last')}
                                >
                                  Last
                                </button>
                              )}
                            </div>
                            <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
                              <select
                                value={packLimit}
                                className="bg-indigo-white text-lg w-full outline-none"
                                onChange={(e) => {
                                  setPackLimit(e.target.value), setPackOffset(0);
                                }}
                              >
                                {limitOptions.map((option) => (
                                  <option value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="mt-7 ml-7 text-xl">
                          There are no packs in your portfolio
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Main>
      </div>
    </Container>
  );
};
export default Portfolio;
