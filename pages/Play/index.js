import { useLCDClient, useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import PlayComponent from './components/PlayComponent';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import Container from '../../components/containers/Container';
import BaseModal from '../../components/modals/BaseModal';
import claimreward from '../../public/images/claimreward.png';
import coin from '../../public/images/coin.png';
import bars from '../../public/images/bars.png';
import ModalComponent from './components/ModalComponent';
import { useRouter } from 'next/router';
import 'regenerator-runtime/runtime';
import { axiosInstance } from '../../utils/playible';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { LCDClient } from '@terra-money/terra.js';
import { ORACLE } from '../../data/constants/contracts';

const Play = () => {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const [activeCategory, setCategory] = useState('new');
  const [rewardsCategory, setRewardsCategory] = useState('winning');
  const [claimModal, showClaimModal] = useState(false);
  const [claimData, setClaimData] = useState(null);
  const [claimTeam, showClaimTeam] = useState(false);
  const [modalView, switchView] = useState(true);
  const [failedTransactionModal, showFailedModal] = useState(false);
  const router = useRouter();
  const lcd = useLCDClient();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };
  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const [games, setGames] = useState([]);
  const [loading, setloading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [gamesLimit, setgamesLimit] = useState(10);
  const [gamesOffset, setgamesOffset] = useState(0);
  const [gamePageCount, setgamePageCount] = useState(0);
  const [sortedList, setSortedList] = useState([]);
  const [sortedgames, setSortedgames] = useState([]);
  const limitOptions = [5, 10, 30, 50];
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');

  const categoryList = ['new', 'active', 'completed'];

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

  const canNext = () => {
    if (offset + 1 === pageCount) {
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

  const applySortFilter = (list, filter, search = '') => {
    let tempList = [...list];
    if (tempList.length > 0) {
      let filteredList = tempList.filter((item) => item.id);
      switch (filter) {
        case 'id':
          filteredList.sort((a, b) => a.id.localeCompare(b.id));
          return filteredList;
        case 'name':
          filteredList.sort((a, b) => a.name.localeCompare(b.name));
          return filteredList;
        case 'start':
          filteredList.sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
          return filteredList;
        default:
          return filteredList;
      }
    } else {
      return tempList;
    }
  };

  const fetchGames = async (type) => {
    setGames([]);
    const res = await axiosInstance.get(`/fantasy/game/${type}/`);

    if (res.status === 200) {
      if (type === 'completed') {
        return fetchRewardsInfo(res.data);
      }

      setGames(res.data);
      setloading(false);
    }
  };

  const fetchRewardsInfo = async (list) => {
    if (list.length > 0) {
      const rewardsList = list.map(async (item) => {
        let hasRewards = false;
        let hasAthletes = false;
        const res = await axiosInstance.get(`/fantasy/game/${item.id}/leaderboard/`);
        const teams = await axiosInstance.get(
          `/fantasy/game/${item.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
        );

        if (res.status === 200 && teams.status === 200) {
          if (res.data.length > 0) {
            const teamsWithPlacement = res.data.filter(
              (item) => item.account.wallet_addr === connectedWallet.walletAddress
            );
            if (teamsWithPlacement.length > 0) {
              hasRewards = true;
            }
          }
          if (teams.data.length > 0) {
            hasAthletes = true;
          }
        }

        return {
          ...item,
          hasAthletes,
          hasRewards,
        };
      });

      const completedGames = await Promise.all(rewardsList);

      setGames(completedGames);
    }
    setloading(false);
  };

  const fetchTeamPlacements = async (gameId) => {
    if (connectedWallet && lcd) {
      let winningPlacements = [];
      let noPlacements = [];
      let prize = 0;
      let distribution = [];

      const gameInfo = await lcd.wasm.contractQuery(ORACLE, {
        game_info: { game_id: gameId.toString() },
      });

      if (gameInfo.prize && gameInfo.distribution) {
        prize = gameInfo.prize;
        distribution = gameInfo.distribution;
      }

      const teams = await axiosInstance.get(
        `/fantasy/game/${gameId}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
      );

      const leaderboards = await axiosInstance.get(`/fantasy/game/${gameId}/leaderboard/`);

      if (leaderboards.status === 200 && teams.status === 200 && teams.data.length > 0) {
        if (leaderboards.data.length > 0) {
          winningPlacements = leaderboards.data
            .map((wallet, rank) => {
              if (wallet.account.wallet_addr === connectedWallet.walletAddress) {
                return {
                  ...wallet,
                  rank: rank + 1,
                  prize:
                    prize > 0 && distribution.length > 0
                      ? computePrize(rank + 1, distribution, prize)
                      : 0,
                };
              }
            })
            .filter((item) => item);

          noPlacements = teams.data
            .map((team) => {
              let exists = false;
              if (winningPlacements.length > 0) {
                winningPlacements.forEach((item) => {
                  if (item.name === team.name) {
                    exists = true;
                  }
                });
              }

              if (!exists) {
                return team;
              }
            })
            .filter((item) => item);

          setClaimData({
            winning_placements: [...winningPlacements],
            no_placements: [...noPlacements],
          });


          showClaimModal(true);
        }
      }
    }
  };

  const computePrize = (rank, distribution, prize) => {
    const achievedRank = distribution.filter((item) => parseInt(item.rank) === parseInt(rank));

    if (achievedRank.length > 0) {
      return (achievedRank[0].percentage / 1000000) * prize;
    }

    return 0;
  };

  function fetchGamesLoading() {
    setloading(true);
    setSortedList([]);
    fetchGames(activeCategory);
  }

  useEffect(() => {
    if (games && games.length > 0) {
      const tempList = [...games];
      const filteredList = applySortFilter(tempList, filter, search).splice(limit * offset, limit);
      setSortedList(filteredList);
      if (search) {
        setPageCount(Math.ceil(applySortFilter(tempList, filter, search).length / limit));
      } else {
        setPageCount(Math.ceil(games.length / limit));
      }
    }
  }, [games, limit, offset, filter, search]);

  useEffect(() => {
    if (games.length > 0) {
      const tempList = [...games];
      const filteredList = tempList.splice(gamesLimit * gamesOffset, gamesLimit);

      setSortedgames(filteredList);
      setgamePageCount(Math.ceil(games.length / gamesLimit));
    }
  }, [games, gamesLimit, gamesOffset]);

  useEffect(() => {
    if (connectedWallet) dispatch(getPortfolio({ walletAddr: connectedWallet.walletAddress }));
  }, [connectedWallet]);

  useEffect(() => {
    fetchGamesLoading();
    setOffset(0);
  }, [activeCategory]);

  useEffect(() => {
    if (router && router.query.type) {
      setCategory(router.query.type);
    }
  }, [router]);

  useEffect(() => {
    if (!claimModal) {
      setClaimData(null);
    }
  }, [claimModal]);

  if (!connectedWallet) {
    return <div></div>;
  }

  return (
    <>
      {claimModal === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-2/5 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                className="absolute top-0 right-0 "
                onClick={() => {
                  showClaimModal(false);
                }}
              >
                <div className="p-4 font-black">X</div>
              </button>

              <div className="mt-16 text-sm">
                <div className="flex font-monument select-none">
                  <div
                    className={`mr-8 tracking-wider cursor-pointer text-xs ${
                      rewardsCategory === 'winning'
                        ? 'border-b-8 pb-2 border-indigo-buttonblue'
                        : ''
                    }`}
                    onClick={() => setRewardsCategory('winning')}
                  >
                    WINNING TEAMS
                  </div>
                  <div
                    className={`mr-8 tracking-wider cursor-pointer text-xs ${
                      rewardsCategory !== 'winning'
                        ? 'border-b-8 pb-2 border-indigo-buttonblue'
                        : ''
                    }`}
                    onClick={() => setRewardsCategory('lost')}
                  >
                    NO PLACEMENT
                  </div>
                </div>
                <hr className="opacity-50 -mx-8" />

                <div className="w-full">
                  {claimData ? (
                    <>
                      {(rewardsCategory === 'winning'
                        ? claimData.winning_placements
                        : claimData.no_placements
                      ).map(
                        (item, i) =>
                          item && (
                            <>
                              <div className="p-8 py-10">
                                <div className="flex justify-between items-center">
                                  <p className="bg-indigo-black w-max p-3 text-indigo-white font-monument uppercase py-1">
                                    {item.name}
                                  </p>
                                  <div className="flex items-end font-monument">
                                    <div className="flex items-end text-xs">
                                      <img src={coin} className="mr-2" />
                                      <p>{item.prize} UST</p>
                                    </div>
                                    <div className="flex items-end text-xs ml-3">
                                      <img src={bars} className="h-4 w-5 mr-2" />
                                      <p>{item.rank}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {(rewardsCategory === 'winning'
                                ? claimData.winning_placements
                                : claimData.no_placements
                              ).length ===
                              i + 1 ? (
                                ''
                              ) : (
                                <hr className="opacity-50" />
                              )}
                            </>
                          )
                      )}
                      <div className="flex justify-center mt-8">
                        <button className="text-indigo-white w-full text-sm font-bold text-center bg-indigo-buttonblue p-3 px-5">
                          CLAIM {claimData.winning_placements.length > 0 ? 'REWARDS' : 'TEAM'}
                        </button>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
                {/* <div className="text-indigo-white w-36 text-center bg-indigo-buttonblue py-2 px-2">
                    CLAIM REWARD
                  </div> */}
              </div>
            </div>
          </div>
        </>
      )}
      {claimTeam === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  showClaimTeam(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>
              <div className="mt-4 bg-indigo-yellow p-2 text-center font-bold text-xl rounded">
                Your Team has not made it to the leader board
              </div>
              <div className="mt-4 p-2 text-center font-bold text-xl">Try again next time!</div>
            </div>
          </div>
        </>
      )}
      {failedTransactionModal === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  showFailedModal(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>
              <img src={claimreward} className="h-20 w-20" />
              <div className="mt-4 bg-indigo-yellow p-2 text-center font-bold text-xl rounded">
                FAILED TRANSACTION
              </div>
              <div className="mt-4 p-2 font-bold text-xl">
                We're sorry, unfortunately we've experienced a problem loading your request.
              </div>
              <div className="p-2 font-bold text-xl">Please try again.</div>
            </div>
          </div>
        </>
      )}
      <Container>
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <div className="flex flex-col">
              <div className="flex">
                <div className="flex-initial">
                  <PortfolioContainer title="PLAY" textcolor="text-indigo-black" />
                </div>
                <Link href="/MyActivity">
                  <button>
                    <div className="ml-8 mt-4 text-xs underline">MY ACTIVITY</div>
                  </button>
                </Link>
              </div>

              <div className="flex flex-col mt-6">
                <div className="flex font-bold ml-8 md:ml-0 font-monument">
                  {categoryList.map((type) => (
                    <div
                      className={`mr-6 uppercase cursor-pointer md:ml-8 ${
                        activeCategory === type ? 'border-b-8 pb-2 border-indigo-buttonblue' : ''
                      }`}
                      onClick={() => {
                        setCategory(type);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>

                <hr className="opacity-50" />

                {loading ? (
                  <LoadingPageDark />
                ) : sortedList.length > 0 ? (
                  <>
                    <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                      {sortedList.map(function (data, i) {
                        return (
                          <div className="flex">
                            <div className="mr-6">
                              <a href={`/PlayDetails?id=${data.id}`}>
                                <div className="mr-6">
                                  <PlayComponent
                                    type={activeCategory}
                                    icon={data.icon}
                                    prizePool={data.prize}
                                    startDate={data.start_datetime}
                                    endDate={data.end_datetime}
                                    month={data.month}
                                    date={data.date}
                                    year={data.year}
                                    img={data.image}
                                    fetchGames={() => fetchGamesLoading(activeCategory)}
                                    index={() => changeIndex()}
                                  />
                                </div>
                              </a>
                              {activeCategory === 'completed' && (
                                <div className="">
                                  {data.hasRewards ? (
                                    <button
                                      className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center"
                                      onClick={() => fetchTeamPlacements(data.id)}
                                    >
                                      <div className="text-indigo-white">CLAIM REWARD</div>
                                    </button>
                                  ) : data.hasAthletes ? (
                                    <button
                                      className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center"
                                      onClick={() => fetchTeamPlacements(data.id)}
                                    >
                                      <div className="text-indigo-white">CLAIM TEAM</div>
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between md:mt-5 md:mr-6 p-5">
                      <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
                        {pageCount > 1 && (
                          <button className="px-2 border mr-2" onClick={() => changeIndex('first')}>
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
                          <button className="px-2 border mr-2" onClick={() => changeIndex('next')}>
                            Next
                          </button>
                        )}
                        {pageCount > 1 && (
                          <button className="px-2 border mr-2" onClick={() => changeIndex('last')}>
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
                  <>
                    <div className="ml-7 mt-7 text-xl">
                      There are no {activeCategory} games to be displayed
                    </div>
                  </>
                )}
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
};
export default Play;
