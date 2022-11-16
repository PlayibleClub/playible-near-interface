import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
// import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { GAME, ORACLE } from 'data/constants/nearContracts';
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
import Modal from '../../components/modals/Modal';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { getGameInfoById } from 'utils/game/helper';
const Play = (props) => {
  const { error } = props;
  const [activeCategory, setCategory] = useState('new');
  const [rewardsCategory, setRewardsCategory] = useState('winning');
  const [claimModal, showClaimModal] = useState(false);
  const [claimData, setClaimData] = useState(null);
  const [claimTeam, showClaimTeam] = useState(false);
  const [modalView, switchView] = useState(true);
  const [failedTransactionModal, showFailedModal] = useState(null);
  const [successTransactionModal, showSuccessModal] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const router = useRouter();

  // const interactWallet = () => {
  //   if (status === WalletStatus.WALLET_CONNECTED) {
  //     disconnect();
  //   } else {
  //     connect(availableConnectTypes[1]);
  //   }
  // };
  const dispatch = useDispatch();
  const connectedWallet = {};
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [err, setErr] = useState(error);
  const sportList = ['all','football','basketball'];
  const [activeSport, setSport] = useState('all');
  
  const [categoryList,setcategoryList] = useState([
    {
      name: 'NEW',
      isActive: true,
    },
    {
      name: 'ON-GOING',
      isActive: false,
    },
    {
      name: 'COMPLETED',
      isActive: false,
    },
  ]);

  const changecategoryList = (name) => {
    const tabList = [...categoryList];

    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setcategoryList([...tabList]);
  };

  const Test = [1,2,3,4,5];

  const [newGames, setNewGames] = useState([]);
  const [ongoingGames, setOngoingGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
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
      setLoading(false);
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
          `/fantasy/game/${item.id}/registered_teams_detail/?wallet_addr=${'TODO'}`
        );

        // if (res.status === 200 && teams.status === 200) {
        //   if (res.data.length > 0) {
        //     const teamsWithPlacement = res.data.filter(
        //       (item) => item.player_addr === connectedWallet.walletAddress
        //     );
        //     if (teamsWithPlacement.length > 0) {
        //       hasRewards = true;
        //     }
        //   }
        //   if (teams.data.length > 0) {
        //     hasAthletes = true;
        //     const claimedRes = await lcd.wasm.contractQuery(GAME, {
        //       player_info: {
        //         game_id: item.id.toString(),
        //         player_addr: connectedWallet.walletAddress.toString(),
        //       },
        //     });

        //     const endedRes = await lcd.wasm.contractQuery(GAME, {
        //       game_info: { game_id: item.id.toString() },
        //     });

        //     hasEnded = endedRes?.has_ended;

        //     if (claimedRes.team_names) {
        //       isClaimed = claimedRes.is_claimed ? 'claimed' : 'unclaimed';
        //     }
        //   }
        // }

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
    setLoading(false);
  };

  const fetchTeamPlacements = async (gameId) => {
    // if (connectedWallet && lcd) {
    //   let winningPlacements = [];
    //   let noPlacements = [];
    //   let prize = 0;
    //   let distribution = [];
    //   let leaderboards = [];
    //   const gameInfo = await lcd.wasm.contractQuery(ORACLE, {
    //     game_info: { game_id: gameId.toString() },
    //   });
    //   if (gameInfo.prize && gameInfo.distribution) {
    //     prize = gameInfo.prize;
    //     distribution = gameInfo.distribution;
    //   }
    //   if (gameInfo.leaderboard.length > 0) {
    //     leaderboards = {
    //       status: 200,
    //       data: gameInfo.leaderboard,
    //     };
    //   } else {
    //     leaderboards = await axiosInstance.get(`/fantasy/game/${gameId}/leaderboard/`);
    //   }
    //   const teams = await axiosInstance.get(
    //     `/fantasy/game/${gameId}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
    //   );
    //   if (leaderboards.status === 200 && teams.status === 200 && teams.data.length > 0) {
    //     if (leaderboards.data.length > 0) {
    //       let isClaimed = false;
    //       const claimedRes = await lcd.wasm.contractQuery(GAME, {
    //         player_info: {
    //           game_id: gameId.toString(),
    //           player_addr: connectedWallet.walletAddress.toString(),
    //         },
    //       });
    //       if (claimedRes.team_names) {
    //         isClaimed = claimedRes.is_claimed;
    //       }
    //       winningPlacements = leaderboards.data
    //         .map((wallet, rank) => {
    //           if (wallet.player_addr === connectedWallet.walletAddress) {
    //             return {
    //               ...wallet,
    //               rank: rank + 1,
    //               prize:
    //                 prize > 0 && distribution.length > 0
    //                   ? computePrize(rank + 1, distribution, prize)
    //                   : 0,
    //             };
    //           }
    //         })
    //         .filter((item) => item);
    //       noPlacements = teams.data
    //         .map((team) => {
    //           let exists = false;
    //           if (winningPlacements.length > 0) {
    //             winningPlacements.forEach((item) => {
    //               if (item.team_name === team.name) {
    //                 exists = true;
    //               }
    //             });
    //           }
    //           if (!exists) {
    //             return team;
    //           }
    //         })
    //         .filter((item) => item);
    //       setClaimData({
    //         winning_placements: [...winningPlacements],
    //         no_placements: [...noPlacements],
    //         isClaimed,
    //         gameId,
    //       });
    //       showClaimModal(true);
    //     }
    //   } else {
    //     showClaimModal(false);
    //   }
    // }
  };

  const computePrize = (rank, distribution, prize) => {
    const achievedRank = distribution.filter((item) => parseInt(item.rank) === parseInt(rank));

    if (achievedRank.length > 0) {
      return (achievedRank[0].percentage / 1000000) * prize;
    }

    return 0;
  };

  const fetchGamesLoading = async () => {
    setLoading(true);
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
  function query_games_list(){
    const query = JSON.stringify({
      from_index: 0,
      limit: 100,
    });
    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(GAME),
        method_name: 'get_games',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());

        const upcomingGames = await Promise.all(
          result.filter(x => x[1].start_time > Date.now()).map((item) => getGameInfoById(item))
        );

        const completedGames = await Promise.all(
          result.filter(x => x[1].end_time < Date.now()).map((item) => getGameInfoById(item))
        );

        const ongoingGames = await Promise.all(
          result
            .filter(x => x[1].start_time < Date.now() && x[1].end_time > Date.now())
            .map((item) => getGameInfoById(item))
        );

        setNewGames(upcomingGames);
        setCompletedGames(completedGames);
        setOngoingGames(ongoingGames);
      })
  }
  const claimRewards = async (gameId) => {
    setClaimLoading(true);
    let totalPrize = 0;

    if (claimData && claimData.winning_placements.length > 0) {
      totalPrize = claimData.winning_placements.reduce((total, num) => {
        let acc = parseFloat(total) + parseFloat(num.prize);
        return acc;
      }, 0);
    }

    //   const claimRes = await executeContract(connectedWallet, GAME, [
    //     {
    //       contractAddr: GAME,
    //       msg: {
    //         claim_rewards: {
    //           game_id: gameId.toString(),
    //         },
    //       },
    //     },
    //   ]);

    //   if (!claimRes.txError) {
    //     const fetchTx = await retrieveTxInfo(claimRes.txHash);

    //     if (fetchTx && fetchTx.logs) {
    //       if (claimData && claimData.winning_placements.length > 0) {
    //         showSuccessModal({
    //           prize: totalPrize,
    //         });
    //       }
    //       setLoading(true);
    //       fetchGamesLoading();
    //     }
    //   } else {
    //     showFailedModal({
    //       msg:
    //         claimRes.txError.indexOf('Un') !== -1 && claimRes.txError.indexOf('Un') < 2
    //           ? null
    //           : claimRes.txError,
    //     });
    //     fetchGamesLoading();
    //   }
    //   showClaimModal(false);
    //   setClaimLoading(false);
    // };
  };
  useEffect(() => {
    if (games && games.length > 0) {
      const tempList = [...games];
      const filteredList = applySortFilter(tempList, filter, search).splice(
        limit * offset,
        limit
      );
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
    query_games_list();
  }, []);
  // useEffect(() => {
  //   if (connectedWallet) {
  //     if (connectedWallet?.network?.name === 'testnet') {
  //       dispatch(getPortfolio({ walletAddr: connectedWallet.walletAddress }));
  //     }
  //   }
  // }, [connectedWallet, dispatch]);

  // useEffect(async () => {
  //   setLoading(true);
  //   setErr(null);
  //   if (connectedWallet) {
  //     if (connectedWallet?.network?.name === 'testnet') {
  //       await fetchGamesLoading();
  //       setErr(null);
  //     } else {
  //       setErr('You are connected to mainnet. Please connect to testnet');
  //       setLoading(false);
  //     }
  //   } else {
  //     setErr('Waiting for wallet connection...');
  //     setLoading(false);
  //   }
  //   setOffset(0);
  // }, [connectedWallet, activeCategory]);

  // useEffect(() => {
  //   fetchGamesLoading();
  //   setOffset(0);
  // }, [activeCategory]);

  useEffect(() => {
    if (router && router.query.type) {
      // setCategory(router.query.type);
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
              <div className="relative p-8 bg-indigo-white w-11/12 md:w-2/5 m-auto flex-col flex">
                {!claimLoading ? (
                  <button
                    className="absolute top-0 right-0 mt-6 mr-6 h-4 w-4"
                    onClick={() => {
                      showClaimModal(false);
                    }}
                  >
                    <img className="h-4 w-4 " src={'/images/x.png'} />
                  </button>
                ) : (
                  ''
                )}

                <div className="text-sm">
                  <div className="flex font-monument select-none mt-5">
                    <div
                      className={`mr-8 tracking-wider text-xs ${
                        claimLoading ? 'cursor-not-allowed text-indigo-lightgray' : 'cursor-pointer'
                      } ${
                        rewardsCategory === 'winning'
                          ? 'border-b-8 pb-2 border-indigo-buttonblue'
                          : ''
                      }`}
                      onClick={!claimLoading ? () => setRewardsCategory('winning') : undefined}
                    >
                      WINNING TEAMS
                    </div>
                    <div
                      className={`mr-8 tracking-wider text-xs ${
                        claimLoading ? 'cursor-not-allowed text-indigo-lightgray' : 'cursor-pointer'
                      } ${
                        rewardsCategory !== 'winning'
                          ? 'border-b-8 pb-2 border-indigo-buttonblue'
                          : ''
                      }`}
                      onClick={!claimLoading ? () => setRewardsCategory('lost') : undefined}
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
        {successTransactionModal !== null && (
          <>
            <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
              <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex">
                <button
                  className="absolute top-0 right-0 mt-6 mr-6 h-4 w-4"
                  onClick={() => {
                    showSuccessModal(null);
                  }}
                >
                  <img className="h-4 w-4 " src={'/images/x.png'} />
                </button>
                <img src={claimreward} className="h-20 w-20 mt-5" />
                <div className="mt-4 bg-indigo-yellow w-min p-2 px-3 text-center text-lg font-monument">
                  CONGRATULATIONS
                </div>
                <div className="p-2 text-4xl font-monument">
                  {successTransactionModal.prize.toString()} UST
                </div>
                <div className="p-2 text-lg font-monument -mt-4">EARNED</div>
              </div>
            </div>
          </>
        )}
        {failedTransactionModal !== null && (
          <>
            <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
              <div className="relative p-8 bg-indigo-white w-11/12 md:w-min h-10/12 md:h-auto m-auto flex-col flex">
                <button
                  className="absolute top-0 right-0 mt-6 mr-6 h-4 w-4"
                  onClick={() => {
                    showFailedModal(null);
                  }}
                >
                  <img className="h-4 w-4 " src={'/images/x.png'} />
                </button>
                <img src={claimreward} className="h-20 w-20 mt-5" />
                <div className="mt-4 bg-indigo-yellow w-max p-2 px-3 text-center text-lg font-monument">
                  FAILED TRANSACTION
                </div>
                <div className="mt-4 p-2 text-xs">
                  {failedTransactionModal.msg ||
                    "We're sorry, unfortunately we've experienced a problem loading your request."}
                  <br />
                  Please try again.
                </div>
              </div>
            </div>
          </>
        )}
        <Container activeName="PLAY">
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
            <Main color="indigo-white">
              <div className="flex flex-col mb-10">
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
                  <div className="flex font-bold ml-8 md:ml-7 font-monument">
                    {categoryList.map(({name,isActive}) => (
                      <div
                        className={`cursor-pointer mr-6 ${
                            isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                          }`}
                          onClick={() => changecategoryList(name)}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                  <hr className="opacity-10" />
                  <div className="flex flex-col mt-6">
                  <div className="flex font-bold ml-8 md:ml-0 font-monument">
                  {sportList.map((type) => (
                    <div
                      key={type}
                      className={`text-center px-8 py-3 uppercase border border-indigo-slate rounded-lg 
                      cursor-pointer ml-8 ${
                        activeSport=== type ? 'text-indigo-white font-thin bg-indigo-buttonblue' : ''
                      }`}
                      onClick={() => {
                        setSport(type);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                    </div> 
                  </div>
                  {/* {loading ? (
                    <LoadingPageDark />
                  ) : (
                    <>
                      {err ? (
                        <p className="py-10 ml-7">{err}</p>
                      ) : ( */}
                        <>
                        {/* {sortedList.length > 0 ? ( */}
                          {1 > 0 ? (
                            <>
                              <div className="mt-4 ml-6 grid grid-cols-0 md:grid-cols-3">
                          {(categoryList[0].isActive ? newGames : categoryList[1].isActive ? ongoingGames : completedGames).length > 0 &&
                          (categoryList[0].isActive ? newGames : categoryList[1].isActive ? ongoingGames : completedGames).map((data, i) => {
                                  return (
                                    <div key={i} className="flex">
                                      <div className="mr-6 cursor-pointer">
                                      {/* <a href={`/PlayDetails?id=${data.id}`}>
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
                                              index={() => changeIndex(1)}
                                            />
                                          </div>
                                        </a> */}
                                        <Link href={`/PlayDetails/${data.game_id}`} passHref>
                                          <div className="mr-6">
                                            <PlayComponent
                                              type={activeCategory}
                                              icon="test"
                                              prizePool="2,300" 
                                              startDate={data.start_time}
                                              endDate={data.end_time}
                                              month="04"
                                              date="20"
                                              year="2022"
                                              img="test"
                                              fetchGames={fetchGamesLoading}
                                              index={() => changeIndex(1)}
                                            />
                                          </div>
                                        </Link>
                                        {/* {activeCategory === 'completed' && data.hasAthletes && ( */}
                                        {activeCategory === 'completed' && "test" && (
                                          <div className="">
                                            {/* {data.isClaimed === 'unclaimed' ? ( */}
                                            {"unclaimed" === 'unclaimed' ? (
                                              // data.hasEnded ? (
                                              "data.hasEnded "? (
                                                <button
                                                  className={`bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center`}
                                                  onClick={() =>
                                                    "data.hasEnded"
                                                    // data.hasEnded
                                                      ? fetchTeamPlacements("test")
                                                      // ? fetchTeamPlacements(data.id)
                                                      : undefined
                                                  }
                                                >
                                                  <div className="text-indigo-white">
                                                    CLAIM {"test" ? 'REWARD' : 'TEAM'}
                                                    {/* CLAIM {data.hasRewards ? 'REWARD' : 'TEAM'} */}
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
                                      //setLimit(e.target.value);
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
                        </>
                      {/* )}
                    </>
                  )} */}
                </div>
              </div>
            </Main>
          </div>
        </Container>
      </>
    );
};
export default Play;

// export async function getServerSideProps(ctx) {
//   return {
//     redirect: {
//       destination: '/Play',
//       permanent: false,
//     },
//   };
// }
