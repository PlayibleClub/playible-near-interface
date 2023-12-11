import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Main from 'components/Main';
import { getRPCProvider, get_near_connection } from 'utils/near';
import LeaderboardComponent from '../components/LeaderboardComponent';
import client from 'apollo-client';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import {
  query_game_data,
  query_all_players_lineup_rposition,
  query_player_teams,
  query_player_lineup,
  compute_scores,
} from 'utils/near/helper';
import { getNflWeek, getNflSeason, formatToUTCDate } from 'utils/date/helper';
import { buildLeaderboard, getScores } from 'utils/game/helper';
import LoadingPageDark from 'components/loading/LoadingPageDark';
import { setTeamName, setAccountId, setGameId, setSport2 } from 'redux/athlete/teamSlice';
import { useDispatch } from 'react-redux';
import { persistor } from 'redux/athlete/store';
import { getSportType, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
import moment, { Moment } from 'moment';
import Modal from 'components/modals/Modal';
import { providers, Contract } from 'near-api-js';
import EntrySummaryPopup from '../components/EntrySummaryPopup';
import EntrySummaryModal from 'components/modals/EntrySummaryModal';
import PerformerContainer from 'components/containers/PerformerContainer';
import {
  CHECK_IF_GAME_EXISTS_IN_MULTI_CHAIN_LEADERBOARD,
  GET_GAME_BY_GAME_ID_AND_CHAIN,
  GET_MULTI_CHAIN_LEADERBOARD_TEAMS,
  GET_LEADERBOARD_TEAMS,
} from 'utils/queries';
const Games = (props) => {
  const { query } = props;
  const [currentIndex, setCurrentIndex] = useState(null);
  const gameId = query.game_id;
  const currentSport = query.sport.toString().toUpperCase();
  const router = useRouter();
  const dispatch = useDispatch();
  const [playerLineups, setPlayerLineups] = useState([]);
  const provider = new providers.JsonRpcProvider({ url: getRPCProvider() });
  const { accountId, selector } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [playerTeamSorted, setPlayerTeamSorted] = useState([]);
  const [nearGameId, setNearGameId] = useState(0);
  const [polygonGameId, setPolygonGameId] = useState(0);
  const [gameInfo, setGameInfo] = useState([]);
  const [week, setWeek] = useState(0);
  const [nflSeason, setNflSeason] = useState('');
  const [gameData, setGameData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [entryModal, setEntryModal] = useState(false);
  const [isExtendedLeaderboard, setIsExtendedLeaderboard] = useState(0);
  const [remountComponent, setRemountComponent] = useState(0);
  const playGameImage = '/images/game.png';
  async function get_game_data(game_id) {
    setGameInfo(await query_game_data(game_id, getSportType(currentSport).gameContract));
    setGameData(await query_game_data(game_id, getSportType(currentSport).gameContract));
  }
  // async function get_all_players_lineup_chunks(joined_team_counter) {
  //   const startTimeFormatted = formatToUTCDate(gameData.start_time);
  //   const endTimeFormatted = formatToUTCDate(gameData.end_time);
  //   console.log('    TEST start date: ' + startTimeFormatted);
  //   console.log('    TEST end date: ' + endTimeFormatted);
  //   let loopCount = Math.ceil(joined_team_counter / 1);
  //   console.log('Loop count: ' + loopCount);
  //   let playerLineup = [];
  //   for (let i = 0; i < joined_team_counter; i++) {
  //     console.log(playerLineup);
  //     await query_all_players_lineup_chunk(
  //       gameId,
  //       currentSport,
  //       startTimeFormatted,
  //       endTimeFormatted,
  //       i,
  //       1
  //     ).then(async (result) => {
  //       if (playerLineup.length === 0) {
  //         playerLineup = result;
  //       } else {
  //         playerLineup = playerLineup.concat(result);
  //       }
  //     });
  //   }
  //   let computedLineup = await compute_scores(
  //     playerLineup,
  //     currentSport,
  //     startTimeFormatted,
  //     endTimeFormatted
  //   );
  //   computedLineup.sort(function (a, b) {
  //     return b.sumScore - a.sumScore;
  //   });
  //   setPlayerLineups(computedLineup);
  //   // setPlayerLineups(
  //   //   await query_all_players_lineup(gameId, currentSport, startTimeFormatted, endTimeFormatted)
  //   // );
  // }
  const togglePopup = async (item) => {
    console.log('hello');
    console.log(item);
    console.log(playerLineups[item.index]);
    if (playerLineups[item.index].scoresChecked === false) {
      //lineup is from polygon, show entrysummary
      let newLineups = [...playerLineups];

      newLineups[item.index].lineup = await getScores(
        playerLineups[item.index].chain,
        playerLineups[item.index].chain === 'near' ? nearGameId : polygonGameId,
        playerLineups[item.index].accountId,
        playerLineups[item.index].teamName
      );
      newLineups[item.index].scoresChecked = true;
      console.log(newLineups[item.index]);
      setPlayerLineups(newLineups);
      setRemountComponent(Math.random());
    }
    setViewModal(false);
    setEntryModal(true);
    setCurrentIndex(item.index);
  };

  const viewPopup = async (accountId, teamName) => {
    console.log('hello');
    const currentIndex = playerLineups.findIndex(
      (item) => item.accountId.toLowerCase() === accountId && item.teamName === teamName
    );
    console.log(`account id: ${accountId} teamName: ${teamName}`);
    if (playerLineups[currentIndex].scoresChecked === false) {
      //lineup is from near, show entrysummary
      let newLineups = [...playerLineups];
      newLineups[currentIndex].lineup = await getScores(
        'near',
        gameId,
        playerLineups[currentIndex].accountId,
        playerLineups[currentIndex].teamName
      );
      newLineups[currentIndex].scoresChecked = true;
      setPlayerLineups(newLineups);
      setRemountComponent(Math.random());
      console.log('next is lineups');
      console.log(newLineups[currentIndex]);
    }
    setViewModal(false);
    setEntryModal(true);
    setCurrentIndex(currentIndex);
  };

  // async function get_all_players_lineup_with_index() {
  //   const startTimeFormatted = formatToUTCDate(gameData.start_time);
  //   const endTimeFormatted = formatToUTCDate(gameData.end_time);
  //   // console.log('    TEST start date: ' + startTimeFormatted);
  //   // console.log('    TEST end date: ' + endTimeFormatted);

  //   await get_all_player_keys().then(async (result) => {
  //     let filteredResult = result.filter((data) => data[1] === gameId);
  //     console.log(filteredResult);
  //     let lineups = [];

  //     for (const entry of filteredResult) {
  //       await query_player_lineup(currentSport, entry[0], entry[1], entry[2]).then((lineup) => {
  //         if (lineups.length === 0) {
  //           lineups = [lineup];
  //         } else {
  //           lineups = lineups.concat([lineup]);
  //         }
  //       });
  //     }
  //     let computedLineup = await compute_scores(
  //       lineups,
  //       currentSport,
  //       startTimeFormatted,
  //       endTimeFormatted
  //     );
  //     setPlayerLineups(computedLineup);
  //   });
  // }
  async function getLeaderboardOnlyBackend(id) {
    let isMulti = true;
    const { data, error } = await client.query({
      query: CHECK_IF_GAME_EXISTS_IN_MULTI_CHAIN_LEADERBOARD,
      variables: {
        chain: 'near',
        sport: getSportType(currentSport).key.toLowerCase(),
        gameId: parseFloat(id),
      },
      errorPolicy: 'all',
    });
    console.log(data);
    let leaderboardDetails;
    if (data === null) {
      isMulti = false;
    } else {
      leaderboardDetails = data.checkIfGameExistsInMultiChainLeaderboard;
    }

    //console.log(data.checkIfGameExistsInMultiChainLeaderboard);

    console.log(isMulti);
    let dbArray;
    if (isMulti) {
      const { data } = await client.query({
        query: GET_MULTI_CHAIN_LEADERBOARD_TEAMS,
        variables: {
          chain: 'near',
          sport: getSportType(currentSport).key.toLowerCase(),
          gameId: parseFloat(id),
        },
      });
      setNearGameId(leaderboardDetails.nearGame.gameId);
      setPolygonGameId(leaderboardDetails.polygonGame.gameId);
      dbArray = data.getMultiChainLeaderboardTeams;
    } else {
      const { data } = await client.query({
        query: GET_LEADERBOARD_TEAMS,
        variables: {
          chain: 'near',
          sport: getSportType(currentSport).key.toLowerCase(),
          gameId: parseFloat(gameId),
        },
      });

      dbArray = data.getLeaderboardTeams;
    }

    const playerLineups = await buildLeaderboard(dbArray, currentSport, gameId, id, isMulti);
    console.log(playerLineups);
    setPlayerLineups(playerLineups);
  }
  async function getGameInfoFromServer() {
    console.log({
      sport: getSportType(currentSport).key.toLowerCase(),
    });
    const { data } = await client.query({
      query: GET_GAME_BY_GAME_ID_AND_CHAIN,
      variables: {
        chain: 'near',
        sport: getSportType(currentSport).key.toLowerCase(),
        gameId: parseFloat(gameId.toString()),
      },
      errorPolicy: 'all',
    });
    console.log(data);
    if (data === null) {
      //game not found on db, game is pre multi-chain update, uses contract to retrieve players in contest
      get_all_players_lineup_chunkify();
    } else {
      console.log({
        startTimeBend: data.getGameByGameIdAndChain.startTime,
        endTimeBend: data.getGameByGameIdAndChain.endTime,
      });
      console.log({
        startTimeNear: formatToUTCDate(gameData.start_time),
        endTimeNear: formatToUTCDate(gameData.end_time),
      });
      getLeaderboardOnlyBackend(data.getGameByGameIdAndChain.id);
    }
  }
  async function get_all_players_lineup_chunkify() {
    const startTimeFormatted = formatToUTCDate(gameData.start_time);
    const endTimeFormatted = formatToUTCDate(gameData.end_time);

    const lineupLen = await get_player_lineup_length();
    const halfLen = Math.ceil(lineupLen / 2);
    let result = [];
    for (let i = 0; i < lineupLen; i += halfLen) {
      await get_all_player_keys_chunk(i, halfLen).then(async (halfResult) => {
        if (result.length === 0) {
          result = halfResult;
        } else {
          result = result.concat(halfResult);
        }
      });
    }
    let filteredResult = result.filter((data) => data[1] === gameId);
    let lineups = [];
    for (const entry of filteredResult) {
      await query_player_lineup(currentSport, entry[0], entry[1], entry[2]).then((lineup) => {
        if (lineups.length === 0) {
          lineups = [lineup];
        } else {
          lineups = lineups.concat([lineup]);
        }
      });
    }
    let computedLineup = await compute_scores(
      lineups,
      currentSport,
      startTimeFormatted,
      endTimeFormatted
    );
    setPlayerLineups(computedLineup);
  }

  function getAccountScore(accountId, teamName) {
    const x = playerLineups.findIndex((x) => x.accountId === accountId && x.teamName === teamName);
    return playerLineups[x]?.total.toFixed(2);
  }

  function getAccountPlacement(accountId, teamName) {
    return playerLineups.findIndex((x) => x.accountId === accountId && x.teamName === teamName) + 1;
  }

  async function get_player_lineup_length() {
    const query = JSON.stringify({});
    return await provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup_length',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        return result;
      });
  }
  async function get_all_player_keys_chunk(start, limit) {
    const query = JSON.stringify({
      from_index: start,
      limit: limit,
    });
    return await provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup_keys_chunk',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        return result;
      });
  }
  // async function get_all_player_keys() {
  //   // const query = JSON.stringify({});
  //   // return await provider
  //   //   .query({
  //   //     request_type: 'call_function',
  //   //     finality: 'optimistic',
  //   //     account_id: getSportType(currentSport).gameContract,
  //   //     method_name: 'get_player_lineup_keys',
  //   //     args_base64: Buffer.from(query).toString('base64'),
  //   //     gas: 300000000000000,
  //   //   })
  //   //   .then(async (data) => {
  //   //     //@ts-ignore:next-line
  //   //     const result = JSON.parse(Buffer.from(data.result).toString());
  //   //     //console.log(result);
  //   //     return result;
  //   //   });
  //   const wallet = await selector.wallet();
  //   const accounts = await wallet.getAccounts();
  //   const walletAccount = accounts[0].accountId;
  //   const account = await get_near_connection().then((connection) =>
  //     connection.account(walletAccount)
  //   );
  //   const contract = new Contract(account, getSportType(currentSport).gameContract, {
  //     viewMethods: ['get_player_lineup_keys'],
  //     changeMethods: [],
  //   });
  //   //@ts-ignore:next-line
  //   const response = await contract.get_player_lineup_keys({ gas: '300000000000000' });
  //   console.log(response);
  //   return response;
  // }

  function sortPlayerTeamScores(accountId) {
    const x = playerLineups.filter((x) => x.accountId === accountId);
    // console.log(x);
    if (x !== undefined) {
      setPlayerTeamSorted(
        x.sort(function (a, b) {
          return b.total - a.total;
        })
      );
    }
  }
  async function get_total_joined(game_id) {}
  async function get_player_teams(account, game_id) {
    setPlayerTeams(
      await query_player_teams(account, game_id, getSportType(currentSport).gameContract)
    );
  }
  const handleButtonClick = (item) => {
    setIsExtendedLeaderboard(isExtendedLeaderboard + 1);
    setEntryModal(true);
    setCurrentIndex(item.index);
  };
  useEffect(() => {
    if (gameData !== undefined && gameData !== null) {
      // console.log('Joined team counter: ' + gameData.joined_team_counter);
      get_player_teams(accountId, gameId);
      //get_all_players_lineup_with_index();
      //get_all_players_lineup_chunkify();
      getGameInfoFromServer();
      //get_all_players_lineup_rposition(gameData.joined_team_counter);
    }
  }, [gameData]);

  useEffect(() => {
    setTimeout(() => persistor.purge(), 200);
    get_game_data(gameId);
  }, [week]);

  useEffect(() => {
    if (playerLineups !== undefined) {
      sortPlayerTeamScores(accountId);
    }
  }, [playerLineups]);

  return (
    <Container activeName="GAMES">
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Main color="indigo-white">
          <div className="iphone5:mt-28 md:mt-8 md:ml-6">
            <BackFunction prev="/Play" />
          </div>
          <div className="flex md:flex-row iphone5:flex-col">
            <div className="md:ml-6 mt-11 flex flex-col w-auto">
              <div className="md:ml-7 md:mr-12 iphone5:mr-6 iphone5:ml-6">
                <Image
                  src={gameData?.game_image ? gameData?.game_image : playGameImage}
                  width={550}
                  height={279}
                  alt="game-image"
                />
              </div>
              <div className="mt-7 ml-6 iphone5:w-5/6 md:w-full md:ml-7 md:mt-2 ">
                <ModalPortfolioContainer title="PRIZE DESCRIPTION" textcolor="text-indigo-black" />
                <div>
                  {gameData?.prize_description
                    ? gameData.prize_description
                    : '$100 + 2 Championship Tickets'}
                </div>
                <ModalPortfolioContainer title="VIEW TEAMS" textcolor="text-indigo-black mb-5" />
                {
                  /* @ts-expect-error */
                  playerTeams.team_names == undefined ? (
                    'No Teams Assigned'
                  ) : (
                    <div>
                      {playerTeamSorted.map((data, index) => {
                        return (
                          <ViewTeamsContainer
                            teamNames={data.teamName}
                            gameId={gameId}
                            accountId={accountId}
                            accountScore={getAccountScore(accountId, data.teamName)}
                            accountPlacement={getAccountPlacement(accountId, data.teamName)}
                            fromGames={true}
                            onClickFn={() => {
                              viewPopup(accountId, data.teamName);
                              setIsExtendedLeaderboard(1);
                            }}
                          />
                        );
                      })}
                    </div>
                  )
                }
              </div>
            </div>

            <div className="iphone5:ml-6 md:ml-18 ml-18 mt-4 md:mr-0 md:mb-0 iphone5:mr-6 iphone5:mb-10">
              <ModalPortfolioContainer textcolor="indigo-black" title={'LEADERBOARD'} />
              <div
                className={`flex justify-end md:mr-1.5 iphone5:mr-2 iphoneX:mr-16 ${
                  playerLineups.length > 0 ? '' : 'hidden'
                }`}
              >
                <button
                  onClick={() => {
                    setViewModal(true);
                  }}
                  className="bg-indigo-black text-indigo-white text-sm font-bold py-2 px-2 relative bottom-12 "
                >
                  <Image
                    className="filter invert"
                    alt="Image of bars for leaderboard"
                    src="/images/bars.png"
                    width={10}
                    height={10}
                  />
                </button>
              </div>
              <div className="relative bottom-5 overflow-y-auto">
                {playerLineups.length > 0 ? (
                  playerLineups.slice(0, 10).map((item, index) => {
                    return (
                      <LeaderboardComponent
                        accountId={item.accountId}
                        teamName={item.teamName}
                        teamScore={item.total}
                        index={index}
                        gameId={gameId}
                        isExtendedLeaderboard={false}
                        onClickFn={() => {
                          togglePopup({ accountId: item.accountId, index: index });
                          setIsExtendedLeaderboard(1);
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="-mt-10 -ml-12">
                    <LoadingPageDark />
                  </div>
                )}
              </div>
              <Modal title={'EXTENDED LEADERBOARD'} visible={viewModal}>
                <div className="md:h-128 h-80 overflow-y-auto">
                  <button
                    className="fixed top-4 right-4 "
                    onClick={() => {
                      setEntryModal(false);
                      setViewModal(false);
                      setIsExtendedLeaderboard(0);
                    }}
                  >
                    <img src="/images/x.png" />
                  </button>
                  {playerLineups.length > 0
                    ? playerLineups.map((item, index) => {
                        return (
                          <LeaderboardComponent
                            accountId={item.accountId}
                            teamName={item.teamName}
                            teamScore={item.total}
                            index={index}
                            gameId={gameId}
                            isExtendedLeaderboard={true}
                            onClickFn={() => {
                              togglePopup({ accountId: item.accountId, index: index });
                              setIsExtendedLeaderboard(0);
                            }}
                          />
                        );
                      })
                    : ''}
                </div>
                <button
                  className="bg-indigo-buttonblue text-indigo-white mt-4 md:mt-10 w-full h-14 text-center tracking-widest text-md font-monument"
                  onClick={() => {
                    setViewModal(false);
                  }}
                >
                  CLOSE
                </button>
              </Modal>

              <EntrySummaryModal
                key={remountComponent}
                title={'ENTRY SUMMARY'}
                visible={entryModal}
              >
                <div className=" transform iphone5:scale-55 md:scale-85 md:-mt-6 iphoneX:fixed iphoneX:-mt-6 iphone5:-ml-14 iPhonneX:-ml-20 md:-ml-12 md:static">
                  <ModalPortfolioContainer
                    title={playerLineups[currentIndex]?.teamName}
                    accountId={playerLineups[currentIndex]?.accountId}
                    textcolor="text-indigo-black"
                  />
                </div>
                <div className="h-130 overflow-y-auto overflow-x-hidden">
                  <div className="flex flex-col md:pb-12 ml-24 iphoneX:ml-24 md:ml-20">
                    <div className="grid grid-cols-4 md:gap-6 iphone5:gap-x-20 md:gap-y-4 mb-2 md:mb-10 md:grid-cols-4 md:ml-7 iphone5:mt-12 iphone5:-ml-3 md:mr-0  ">
                      {playerLineups.length === 0
                        ? 'Loading athletes...'
                        : playerLineups[currentIndex]?.lineup.map((item, i) => {
                            return (
                              <EntrySummaryPopup
                                AthleteName={`${item.name}`}
                                AvgScore={
                                  item.stats_breakdown !== undefined
                                    ? item.stats_breakdown?.toFixed(2)
                                    : 0
                                }
                                id={item.primary_id}
                                uri={item.image}
                                hoverable={false}
                                isActive={item.isActive}
                                isInjured={item.isInjured}
                              />
                            );
                          })}
                    </div>
                  </div>
                </div>
                <div className="fixed top-4 right-4 transform scale-100">
                  {isExtendedLeaderboard === 1 ? (
                    <button
                      onClick={() => {
                        setEntryModal(false);
                        setViewModal(false);
                        setIsExtendedLeaderboard(0);
                      }}
                    >
                      <img src="/images/x.png" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEntryModal(false);
                        setViewModal(true);
                        setIsExtendedLeaderboard(0);
                      }}
                    >
                      <img src="/images/x.png" />
                    </button>
                  )}
                </div>
              </EntrySummaryModal>
            </div>
          </div>
        </Main>
      </div>
    </Container>
  );
};
export default Games;

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query.game_id != query.game_id) {
    return {
      desination: query.origin || '/Play',
    };
  }

  return {
    props: { query },
  };
}
