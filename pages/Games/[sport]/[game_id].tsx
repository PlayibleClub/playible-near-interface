import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { useEffect, useState } from 'react';
import { cutAddress } from 'utils/address/helper';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Main from 'components/Main';
import { getRPCProvider } from 'utils/near';
import LeaderboardComponent from '../components/LeaderboardComponent';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import {
  query_game_data,
  query_all_players_lineup_rposition,
  query_player_teams,
  query_player_lineup,
  compute_scores,
} from 'utils/near/helper';
import { getNflWeek, getNflSeason, formatToUTCDate } from 'utils/date/helper';
import LoadingPageDark from 'components/loading/LoadingPageDark';
import { setTeamName, setAccountId, setGameId, setSport2 } from 'redux/athlete/teamSlice';
import { useDispatch } from 'react-redux';
import { persistor } from 'redux/athlete/store';
import { getSportType, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
import moment, { Moment } from 'moment';
import Modal from 'components/modals/Modal';
import { providers } from 'near-api-js';
import EntrySummaryPopup from '../components/EntrySummaryPopup';
import EntrySummaryModal from 'components/modals/EntrySummaryModal';
import PerformerContainer from 'components/containers/PerformerContainer';
const Games = (props) => {
  const { query } = props;
  const [currentIndex, setCurrentIndex] = useState(null);
  const gameId = query.game_id;
  const currentSport = query.sport.toString().toUpperCase();
  const router = useRouter();
  const dispatch = useDispatch();
  const [playerLineups, setPlayerLineups] = useState([]);
  const provider = new providers.JsonRpcProvider({ url: getRPCProvider() });
  const { accountId } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [playerTeamSorted, setPlayerTeamSorted] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [week, setWeek] = useState(0);
  const [nflSeason, setNflSeason] = useState('');
  const [gameData, setGameData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [entryModal, setEntryModal] = useState(false);
  const [test, setTest] = useState(0);
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
  const togglePopup = (item) => {
    console.log(item);
    setViewModal(false);
    setEntryModal(true);
    setCurrentIndex(item.index);
  };

  async function get_all_players_lineup_with_index() {
    const startTimeFormatted = formatToUTCDate(gameData.start_time);
    const endTimeFormatted = formatToUTCDate(gameData.end_time);
    // console.log('    TEST start date: ' + startTimeFormatted);
    // console.log('    TEST end date: ' + endTimeFormatted);

    await get_all_player_keys().then(async (result) => {
      let filteredResult = result.filter((data) => data[1] === gameId);
      //console.log(filteredResult);
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
    });
  }

  function getAccountScore(accountId, teamName) {
    const x = playerLineups.findIndex((x) => x.accountId === accountId && x.teamName === teamName);
    return playerLineups[x]?.sumScore.toFixed(2);
  }

  function getAccountPlacement(accountId, teamName) {
    return playerLineups.findIndex((x) => x.accountId === accountId && x.teamName === teamName) + 1;
  }
  async function get_all_player_keys() {
    const query = JSON.stringify({});
    return await provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup_keys',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        //console.log(result);
        return result;
      });
  }
  function sortPlayerTeamScores(accountId) {
    const x = playerLineups.filter((x) => x.accountId === accountId);
    // console.log(x);
    if (x !== undefined) {
      setPlayerTeamSorted(
        x.sort(function (a, b) {
          return b.sumScore - a.sumScore;
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
    setTest(test + 1);
    setEntryModal(true);
    setCurrentIndex(item.index);
  };
  useEffect(() => {
    if (gameData !== undefined && gameData !== null) {
      // console.log('Joined team counter: ' + gameData.joined_team_counter);
      get_player_teams(accountId, gameId);
      get_all_players_lineup_with_index();
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
      console.log(playerTeams);
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
                              togglePopup({ accountId: cutAddress(data.accountId), index: index });
                              setTest(1);
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
                className={`flex justify-end md:mr-13 ${playerLineups.length > 0 ? '' : 'hidden'}`}
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
                        teamScore={item.sumScore}
                        index={index}
                        gameId={gameId}
                        onClickFn={() => {
                          togglePopup({ accountId: item.accountId, index: index });
                          setTest(1);
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
                  {playerLineups.length > 0
                    ? playerLineups.map((item, index) => {
                        return (
                          <LeaderboardComponent
                            accountId={item.accountId}
                            teamName={item.teamName}
                            teamScore={item.sumScore}
                            index={index}
                            gameId={gameId}
                            onClickFn={() => {
                              togglePopup({ accountId: item.accountId, index: index });
                              setTest(0);
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
              <EntrySummaryModal title={'ENTRY SUMMARY'} visible={entryModal}>  
                <div>
                  <div className="flex flex-col w-full md:pb-12 ml-24  iphoneX:ml-24 md:ml-20">
                    <div className="flex items-center -ml-36 -mt-4 md:ml-0 transform scale-70 md:scale-100">
                      <ModalPortfolioContainer
                        title={playerLineups[currentIndex]?.teamName}
                        accountId={cutAddress(playerLineups[currentIndex]?.accountId)}
                        textcolor="text-indigo-black"
                      />
                      <div className="w-2/3 text-2xl pb-3 pt-20 md:pt-14 justify-between align-center"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 md:gap-y-4 md:mt-14 mb-2 md:mb-10 md:grid-cols-4 md:ml-7 -mt-9 -ml-9 mr-6 md:mr-0">
                      {playerLineups.length === 0
                        ? 'Loading athletes...'
                        : playerLineups[currentIndex]?.lineup.map((item, i) => {
                            return (
                              <EntrySummaryPopup
                                AthleteName={`${item.name}`}
                                AvgScore={item.stats_breakdown?.toFixed(2)}
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
                <div className="flex justify-center items-end fixed bottom-8 left-1/2">
                  {test === 1 ? (
                    <button
                      className="bg-indigo-buttonblue text-indigo-white md:mt-10 md:w-2/6 w-4/6 fixed center -mt-6 bottom-4 md:bottom-20 lg:bottom-6 md:h-14 h-8 text-center text-md font-monument"
                      onClick={() => {
                        setEntryModal(false);
                        setViewModal(false);
                        setTest(0);
                      }}
                    >
                      CLOSE
                    </button>
                  ) : (
                    <button
                    className="bg-indigo-buttonblue text-indigo-white md:mt-10 md:w-2/6 w-4/6 fixed center -mt-6 bottom-4 md:bottom-20 lg:bottom-6 md:h-14 h-8 text-center text-md font-monument"
                    onClick={() => {
                        setEntryModal(false);
                        setViewModal(true);
                        setTest(0);
                      }}
                    >
                      CLOSE
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
