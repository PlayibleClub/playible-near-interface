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

const Portfolio = () => {
  const [searchText, setSearchText] = useState('');
  const [displayMode, setDisplay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [packLimit, setPackLimit] = useState(10)
  const [packOffset, setPackOffset] = useState(0)
  const [packPageCount, setPackPageCount] = useState(0)

  const { list: playerList, status } = useSelector((state) => state.assets);

  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient();
  const [sortedList, setSortedList] = useState([]);
  const [packs, setPacks] = useState([])
  const [sortedPacks, setSortedPacks] = useState([])
  const limitOptions = [5,10,30,50]
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')

  const fetchPacks = async () => {
    if (connectedWallet) {
      const formData = { 
        owner_tokens_info: {
          owner: connectedWallet.walletAddress
        }
      }
      const res = await lcd.wasm.contractQuery(PACK, formData)
      if (res && res.length > 0) {
        setPacks(res)
      } else {
        setPacks([])
      }
    }
  }

  const changeIndex = (index) => {
    switch (index) {
      case 'next':
          setOffset(offset + 1)
          break
      case 'previous':
          setOffset(offset - 1)
          break
      case 'first':
          setOffset(0)
          break
      case 'last':
          setOffset(pageCount - 1)
          break

      default:
          break
      }
  }

  const changeIndexPack = (index) => {
    switch (index) {
      case 'next':
          setPackOffset(packOffset + 1)
          break
      case 'previous':
          setPackOffset(packOffset - 1)
          break
      case 'first':
          setPackOffset(0)
          break
      case 'last':
          setPackOffset(packPageCount - 1)
          break

      default:
          break
      }
  }

  const canNext = () => {
    if (offset + 1 === pageCount) {
        return false
    } else {
        return true
    }
  }

  const canNextPack = () => {
    if (packOffset + 1 === packPageCount) {
        return false
    } else {
        return true
    }
  }

  const canPrevious = () => {
    if (offset === 0) {
      return false
    } else {
      return true
    }
  }

  const canPreviousPack = () => {
    if (packOffset === 0) {
      return false
    } else {
      return true
    }
  }

  const applySortFilter = (list, filter, search = '') => {
    let tempList = [...list]
    if (tempList.length > 0) {
        let filteredList = tempList.filter(item => item.token_info.info.extension.name.toLowerCase().indexOf(search.toLowerCase()) > -1)
        switch(filter) {
          case 'name':
            filteredList.sort((a,b) => a.token_info.info.extension.name.localeCompare(b.token_info.info.extension.name))
            return filteredList
          case 'team':
            filteredList.sort((a,b) => a.token_info.info.extension.team.localeCompare(b.token_info.info.extension.team))
            return filteredList
          case 'position':
            filteredList.sort((a,b) => a.token_info.info.extension.position.localeCompare(b.token_info.info.extension.position))
            return filteredList
          default:
            return filteredList
      }
    } else {
      return tempList
    }
  }

  const resetFilters = (type = 'athlete') => {
    if (type === 'pack') {
      setPackOffset(0)
    } else {
      setOffset(0)
    }
  }

  useEffect(() => {
    if (typeof connectedWallet !== 'undefined') {
      setLoading(true)
      dispatch(getAccountAssets({ walletAddr: connectedWallet.walletAddress }));
      setTimeout(() => {
        setLoading(false)
      },500)
    }
  }, [dispatch, connectedWallet]);

  useEffect(() => {
    if (typeof connectedWallet !== 'undefined') {
      fetchPacks()
    }
  }, [dispatch, connectedWallet])

  useEffect(() => {
    if (typeof playerList !== null) {
      if (playerList.tokens && playerList.tokens.length > 0) {
        const tempList = [...playerList.tokens]
        const filteredList = applySortFilter(tempList, filter, search).splice(limit*offset, limit)
        setSortedList(filteredList)
        if (search) {
          setPageCount(Math.ceil(applySortFilter(tempList, filter, search).length / limit))
        } else {
          setPageCount(Math.ceil(playerList.tokens.length / limit))
        }
      } 
    }
  }, [playerList, limit, offset, filter, search]);

  useEffect(() => {
    if (packs.length > 0) {
      const tempList = [...packs]
      const filteredList = tempList.splice(packLimit*packOffset, packLimit)
      setSortedPacks(filteredList)
      setPackPageCount(Math.ceil(packs.length / packLimit))
    }
  }, [packs, packLimit, packOffset]);

  return (
    <Container>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          {loading ? (
            <LoadingPageDark />
          ) : (
            <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-indigo-black">
              <div className="ml-6 flex flex-col md:flex-row md:justify-between">
                <PortfolioContainer title="SQUAD" textcolor="text-indigo-black" />
                { displayMode ? <Sorter list={sortedList} setList={setSortedList} resetOffset={() => setOffset(0)} setSearchText={setSearch} filterValue={filter} filterHandler={(val) => setFilter(val)} /> : ''}
              </div>
              <div className="flex flex-col w-full">
                <div className="justify-center self-center w-full md:mt-4">
                  {displayMode ? (
                    <>
                      <div className="flex md:ml-4 font-bold ml-8 md:ml-0 font-monument">
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
                                const path = player.token_info.info.extension
                                  return (
                                    <Link
                                      href={{
                                        pathname: '/AssetDetails',
                                        query: { id: path.athlete_id, origin: 'Portfolio', token_id: player.token_id },
                                      }}
                                    >
                                      <div className="mb-4" key={i}>
                                        <PerformerContainer
                                          AthleteName={path.name}
                                          AvgScore={player.fantasy_score}
                                          id={path.athlete_id}
                                          uri={player.nft_image}
                                          rarity={path.rarity}
                                          status={player.is_locked}
                                        />
                                      </div>
                                    </Link>
                                  );
                              })}
                            </div>
                            <div className="flex justify-between md:mt-5 md:mr-6 p-5">
                              <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
                                {pageCount > 1 && <button className='px-2 border mr-2' onClick={() => changeIndex('first')}>First</button>}
                                {pageCount !== 0 && canPrevious() && <button className='px-2 border mr-2' onClick={() => changeIndex('previous')}>Previous</button>}
                                <p className='mr-2'>Page {offset + 1} of {pageCount}</p>
                                {pageCount !== 0 && canNext() && <button className='px-2 border mr-2' onClick={() => changeIndex('next')}>Next</button>}
                                {pageCount  > 1 && <button className='px-2 border mr-2' onClick={() => changeIndex('last')}>Last</button>}
                              </div>
                              <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
                                  <select value={limit} className="bg-indigo-white text-lg w-full outline-none" onChange={(e) => {setLimit(e.target.value); setOffset(0)}}>
                                    {limitOptions.map((option) => <option value={option}>{option}</option>)}
                                  </select>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>No assets in your portfolio</div>
                        )}
                    </>
                  ) : (
                    <>
                      <div className="flex md:ml-4 font-bold ml-8 md:ml-0 font-monument">
                        <div
                          className="md:ml-8 mr-6 cursor-pointer"
                          onClick={() => {
                            setDisplay(true);
                            resetFilters('pack');
                          }}
                        >
                          ATHLETES
                        </div>

                        <div className="border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">PACKS</div>
                      </div>
                      <hr className="opacity-50" />
                      
                        {sortedPacks.length > 0 ? 
                          <>
                            <div className="md:ml-16 grid grid-cols-0 md:grid-cols-4 mt-12 justify-center">
                              {sortedPacks.map((data, i) => {
                                  const path = data.token_info.info.extension
                                  return (
                                      <div className="mb-4 cursor-pointer" key={i}>
                                        <SquadPackComponent
                                          imagesrc={null}
                                          packName={data.token_id}
                                          releaseValue={path.release[1]}
                                          link={`?token_id=${data.token_id}&origin=Portfolio`}
                                        />
                                      </div>
                                  );
                                })
                              }
                            </div>
                            <div className="flex justify-between md:mt-5 md:mr-6 p-5">
                              <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
                                {packPageCount > 1 && <button className='px-2 border mr-2' onClick={() => changeIndexPack('first')}>First</button>}
                                {packPageCount !== 0 && canPreviousPack() && <button className='px-2 border mr-2' onClick={() => changeIndexPack('previous')}>Previous</button>}
                                <p className='mr-2'>Page {packOffset + 1} of {packPageCount}</p>
                                {packPageCount !== 0 && canNextPack() && <button className='px-2 border mr-2' onClick={() => changeIndexPack('next')}>Next</button>}
                                {packPageCount  > 1 && <button className='px-2 border mr-2' onClick={() => changeIndexPack('last')}>Last</button>}
                              </div>
                              <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
                                  <select value={packLimit} className="bg-indigo-white text-lg w-full outline-none" onChange={(e) => {setPackLimit(e.target.value), setPackOffset(0)}}>
                                    {limitOptions.map((option) => <option value={option}>{option}</option>)}
                                  </select>
                              </div>
                            </div>
                          </>
                        : <div>No packs available in your portfolio</div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Main>
      </div>
    </Container>
  );
};
export default Portfolio;
