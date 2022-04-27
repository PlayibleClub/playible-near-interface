import {
  useLCDClient,
  useWallet,
  WalletStatus,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
// import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';

import Link from 'next/link';
import PlayComponent from './components/PlayComponent';
import Container from '../../components/containers/Container';
import claimreward from '../../public/images/claimreward.png';
import coin from '../../public/images/coin.png';
import bars from '../../public/images/bars.png';
import { useRouter } from 'next/router';
import 'regenerator-runtime/runtime';
import { axiosInstance } from '../../utils/playible';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { LCDClient } from '@terra-money/terra.js';
import { GAME, ORACLE } from '../../data/constants/contracts';
import Modal from '../../components/modals/Modal';
import { executeContract } from '../../utils/terra';

const Play = () => {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const [activeCategory, setCategory] = useState('new');
  const [rewardsCategory, setRewardsCategory] = useState('winning');
  const [claimModal, showClaimModal] = useState(false);
  const [claimData, setClaimData] = useState(null);
  const [claimTeam, showClaimTeam] = useState(false);
  const [modalView, switchView] = useState(true);
  const [failedTransactionModal, showFailedModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
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
    const tempList = [...list];
    if (tempList.length > 0) {
      const filteredList = tempList.filter((item) => item.id);
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
    }
    setTimeout(() => {
      setloading(false);
    }, 1000);
  };

  const fetchRewardsInfo = async (list) => {
    if (list.length > 0) {
      const rewardsList = list.map(async (item) => {
        let hasRewards = false;
        let hasAthletes = false;
        let hasEnded = false;
        let isClaimed = 'claimed';
        const res = await axiosInstance.get(`/fantasy/game/${item.id}/leaderboard/`);
        const teams = await axiosInstance.get(
          `/fantasy/game/${item.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
        );

        if (res.status === 200 && teams.status === 200) {
          if (res.data.length > 0) {
            const teamsWithPlacement = res.data.filter(
              (item) => item.player_addr === connectedWallet.walletAddress
            );
            if (teamsWithPlacement.length > 0) {
              hasRewards = true;
            }
          }
          if (teams.data.length > 0) {
            hasAthletes = true;
            const claimedRes = await lcd.wasm.contractQuery(GAME, {
              player_info: {
                game_id: item.id.toString(),
                player_addr: connectedWallet.walletAddress.toString(),
              },
            });

            const endedRes = await lcd.wasm.contractQuery(GAME, {
              game_info: { game_id: item.id.toString() },
            });

            hasEnded = endedRes?.has_ended;

            if (claimedRes.team_names) {
              isClaimed = claimedRes.is_claimed ? 'claimed' : 'unclaimed';
            }
          }
        }

        return {
          ...item,
          hasAthletes,
          hasRewards,
          isClaimed,
          hasEnded,
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
      let leaderboards = [];

      const gameInfo = await lcd.wasm.contractQuery(ORACLE, {
        game_info: { game_id: gameId.toString() },
      });

      if (gameInfo.prize && gameInfo.distribution) {
        prize = gameInfo.prize;
        distribution = gameInfo.distribution;
      }

      if (gameInfo.leaderboard.length > 0) {
        leaderboards = {
          status: 200,
          data: gameInfo.leaderboard,
        };
      } else {
        leaderboards = await axiosInstance.get(`/fantasy/game/${gameId}/leaderboard/`);
      }

      const teams = await axiosInstance.get(
        `/fantasy/game/${gameId}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
      );

      if (leaderboards.status === 200 && teams.status === 200 && teams.data.length > 0) {
        if (leaderboards.data.length > 0) {
          let isClaimed = false;
          const claimedRes = await lcd.wasm.contractQuery(GAME, {
            player_info: {
              game_id: gameId.toString(),
              player_addr: connectedWallet.walletAddress.toString(),
            },
          });

          if (claimedRes.team_names) {
            isClaimed = claimedRes.is_claimed;
          }
          winningPlacements = leaderboards.data
            .map((wallet, rank) => {
              if (wallet.player_addr === connectedWallet.walletAddress) {
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
                  if (item.team_name === team.name) {
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
            isClaimed,
            gameId,
          });

          showClaimModal(true);
        }
      } else {
        showClaimModal(false);
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

  const fetchGamesLoading = async () => {
    setloading(true);
    await setSortedList([]);
    fetchGames(activeCategory);
  };

  const renderPlacements = (item, i, winning = false) => {
    return (
      <>
        <div className="p-8 py-10">
          <div className="flex justify-between items-center">
            <p className="bg-indigo-black w-max p-3 text-indigo-white font-monument uppercase py-1">
              {winning ? item.team_name : item.name}
            </p>
            {winning ? (
              <>
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
              </>
            ) : (
              ''
            )}
          </div>
        </div>
        {(rewardsCategory === 'winning' ? claimData.winning_placements : claimData.no_placements)
          .length ===
        i + 1 ? (
          ''
        ) : (
          <hr className="opacity-50" />
        )}
      </>
    );
  };

  const claimRewards = async (gameId) => {
    setClaimLoading(true);
    let totalPrize = 0;

    if (claimData && claimData.winning_placements.length > 0) {
      totalPrize = claimData.winning_placements.reduce((total, num) => {
        let acc = total + Math.round(num.prize);
        return acc;
      }, 0);
    }

    const claimRes = await executeContract(connectedWallet, GAME, [
      {
        contractAddr: GAME,
        msg: {
          claim_rewards: {
            game_id: gameId.toString(),
          },
        },
      },
    ]);

    console.log('claimRes', claimRes);

    if (!claimRes.txError) {
      const fetchTx = await retrieveTxInfo(claimRes.txHash);

      if (fetchTx && fetchTx.logs) {
        setloading(true);
        fetchGamesLoading();
      }
    } else {
      showFailedModal(true);
      fetchGamesLoading();
    }
    showClaimModal(false);
    setClaimLoading(false);
  };

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

  return (
    <>
      {claimModal === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-2/5 m-auto flex-col flex rounded-lg">
              {!claimLoading ? (
                <button
                  className="absolute top-0 right-0 "
                  onClick={() => {
                    showClaimModal(false);
                  }}
                >
                  <div className="p-4 font-black">X</div>
                </button>
              ) : (
                ''
              )}

              <div className="text-sm">
                <div className="flex font-monument select-none mt-5">
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
                  {claimLoading ? (
                    <div className="mt-8">
                      <p className="mb-5 text-center font-montserrat">Please wait</p>
                      <div className="flex gap-5 justify-center mb-5">
                        <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
                        <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
                        <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
                      </div>
                    </div>
                  ) : claimData ? (
                    <>
                      {rewardsCategory === 'winning' &&
                        (claimData.winning_placements.length > 0 ? (
                          claimData.winning_placements.map(
                            (item, i) => item && renderPlacements(item, i, true)
                          )
                        ) : (
                          <>
                            <div className="mt-8 font-monument tracking-wider text-indigo-lightgray text-center mb-5">
                              There are no teams to display
                            </div>
                          </>
                        ))}

                      {rewardsCategory !== 'winning' &&
                        (claimData.no_placements.length > 0 ? (
                          claimData.no_placements.map(
                            (item, i) => item && renderPlacements(item, i)
                          )
                        ) : (
                          <>
                            <div className="mt-8 font-monument tracking-wider text-indigo-lightgray text-center mb-5">
                              There are no teams to display
                            </div>
                          </>
                        ))}

                      {!claimData.isClaimed && (
                        <div className="flex justify-center">
                          <button
                            className="text-indigo-white w-full text-sm font-bold text-center bg-indigo-buttonblue p-3 px-5"
                            onClick={() => claimRewards(claimData.gameId)}
                          >
                            CLAIM {claimData.winning_placements.length > 0 ? 'REWARDS' : 'TEAM'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </div>
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
              <div className="mt-4 bg-indigo-yellow p-2 text-center text-lg rounded font-monument">
                FAILED TRANSACTION
              </div>
              <div className="mt-4 p-2 text-sm">
                We're sorry, unfortunately we've experienced a problem loading your request.
              </div>
              <div className="px-2 text-sm">Please try again.</div>
            </div>
          </div>
        </>
      )}
      {/* <Modal title={'LOADING'} visible={!claimLoading}>
        <div>
          <p className="mb-5 text-center font-montserrat">Please wait</p>
          <div className="flex gap-5 justify-center mb-5">
            <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
            <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
            <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
          </div>
        </div>
      </Modal> */}
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
                      key={type}
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
                    <div className="mt-4 ml-6 grid grid-cols-0 md:grid-cols-3">
                      {sortedList.map(function (data, i) {
                        return (
                          <div key={i} className="flex">
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
                                    fetchGames={fetchGamesLoading}
                                    index={() => changeIndex()}
                                  />
                                </div>
                              </a>
                              {activeCategory === 'completed' && data.hasAthletes && (
                                <div className="">
                                  {data.isClaimed === 'unclaimed' ? (
                                    data.hasEnded ? (
                                      <button
                                        className={`bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center`}
                                        onClick={() =>
                                          data.hasEnded ? fetchTeamPlacements(data.id) : undefined
                                        }
                                      >
                                        <div className="text-indigo-white">
                                          CLAIM {data.hasRewards ? 'REWARD' : 'TEAM'}
                                        </div>
                                      </button>
                                    ) : (
                                      <button
                                        className={`bg-indigo-lightblue cursor-not-allowed  w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center`}
                                      >
                                        <div className="text-indigo-white">
                                          Please wait for the game to end
                                        </div>
                                      </button>
                                    )
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
