import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from 'components/Main';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import Container from 'components/containers/Container';
import BackFunction from 'components/buttons/BackFunction';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { providers } from 'near-api-js';
import 'regenerator-runtime/runtime';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import { compute_scores, query_player_lineup, query_player_teams } from 'utils/near/helper';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from 'redux/athlete/store';
import { query_game_data } from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';
import { setTeamName, setAccountId, setGameId, setSport2 } from 'redux/athlete/teamSlice';
import { setGameStartDate, setGameEndDate } from 'redux/athlete/athleteSlice';
import { formatToUTCDate } from 'utils/date/helper';
import { getRPCProvider } from 'utils/near';
import EntrySummaryModal from 'components/modals/EntrySummaryModal';
import EntrySummaryPopup from 'pages/Games/components/EntrySummaryPopup';
export default function CreateLineup(props) {
  const { query } = props;
  const provider = new providers.JsonRpcProvider({ url: getRPCProvider() });
  const gameId = query.game_id;
  const [playerLineups, setPlayerLineups] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [isExtendedLeaderboard, setIsExtendedLeaderboard] = useState(0);
  const [entryModal, setEntryModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [playerTeamSorted, setPlayerTeamSorted] = useState([]);
  const currentSport = query.sport.toString().toUpperCase();
  const router = useRouter();
  const dispatch = useDispatch();
  const { accountId } = useWalletSelector();
  const [gameData, setGameData] = useState(null);
  const [playerTeams, setPlayerTeams] = useState([]);
  // const [err, setErr] = useState(error);
  const playGameImage = '/images/game.png';

  async function get_player_teams(account, game_id) {
    setPlayerTeams(
      await query_player_teams(account, game_id, getSportType(currentSport).gameContract)
    );
  }

  async function get_game_data(game_id) {
    setGameData(await query_game_data(game_id, getSportType(currentSport).gameContract));
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
  const handleButtonClick = (teamName, accountId, gameId) => {
    dispatch(setTeamName(teamName));
    dispatch(setAccountId(accountId));
    dispatch(setGameId(gameId));
    dispatch(setSport2(currentSport));
    router.push('/EntrySummary');
  };
  const viewPopup = (accountId, teamName) => {
    const currentIndex = playerLineups.findIndex(
      (item) => item.accountId === accountId && item.teamName === teamName
    );
    setViewModal(false);
    setEntryModal(true);
    setCurrentIndex(currentIndex);
  };

  const handleCreateLineupClick = () => {
    dispatch(setGameStartDate(gameData.start_time));
    dispatch(setGameEndDate(gameData.end_time));
    router.push(`/CreateTeam/${currentSport.toLowerCase()}/${gameId}`);
  };

  useEffect(() => {
    setTimeout(() => persistor.purge(), 200);
    get_game_data(gameId);
  }, []);
  useEffect(() => {
    if (playerLineups !== undefined) {
      sortPlayerTeamScores(accountId);
    }
  }, [playerLineups]);
  useEffect(() => {
    if (gameData !== undefined && gameData !== null) {
      // console.log('Joined team counter: ' + gameData.joined_team_counter);
      get_player_teams(accountId, gameId);
      get_all_players_lineup_with_index();
      //get_all_players_lineup_rposition(gameData.joined_team_counter);
    }
  }, [gameData]);
  console.log(playerTeamSorted, 'team');
  return (
    <Provider store={store}>
      <Container activeName="PLAY">
        <div className="flex flex-row md:flex-col">
          <Main color="indigo-white">
            <div className="md:mt-8 md:ml-6 iphone5:mt-28">
              <BackFunction
                prev={
                  query.origin
                    ? `/${query.origin}`
                    : `/PlayDetails/${currentSport.toLowerCase()}/${gameId}`
                }
              ></BackFunction>
            </div>
            <div className="md:ml-6 mt-11 flex w-auto md:flex-row iphone5:flex-col">
              <div className="md:ml-7">
                <Image
                  src={gameData?.game_image ? gameData?.game_image : playGameImage}
                  width={550}
                  height={279}
                  alt="game-image"
                />
              </div>

              <div className="md:ml-18 md:-mt-6 md:ml-14 -mt-6 md:mr-0 iphone5:mr-4 iphone5:ml-6 iphone5:mt-0">
                <ModalPortfolioContainer title="CREATE TEAM" textcolor="text-indigo-black" />

                <div className="md:w-2/5">
                  {gameData?.game_description
                    ? gameData?.game_description
                    : ' Enter your team to compete for cash prizes and entry into the Football Championship with $35,000 USD up for grabs.'}
                </div>

                <button
                  onClick={handleCreateLineupClick}
                  className="bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-10 md:mt-16 iphone5:mt-8 text-center font-bold"
                >
                  CREATE YOUR LINEUP +
                </button>
              </div>
            </div>
            <div className="mt-7 ml-6 w-3/5 md:w-1/3 md:ml-12 md:mt-2">
              <ModalPortfolioContainer title="VIEW TEAMS" textcolor="text-indigo-black mb-5" />

              {
                /* @ts-expect-error */
                playerTeams.team_names === undefined || playerTeams.team_names.length === 0 ? (
                  <p>No teams assigned</p>
                ) : (
                  <div>
                    {playerTeamSorted.map((data, index) => {
                      return (
                        <ViewTeamsContainer
                          teamNames={data.teamName}
                          gameId={gameId}
                          accountId={accountId}
                          fromGames={false}
                          onClickFn={() => {
                            viewPopup(accountId, data.teamName);
                          }}
                        />
                      );
                    })}
                  </div>
                )
              }
            </div>
            <EntrySummaryModal title={'ENTRY SUMMARY'} visible={entryModal}>
              <div className=" transform iphone5:scale-55 md:scale-85 md:-mt-6 iphoneX:fixed iphoneX:-mt-6 iphone5:-ml-12 md:static">
                <ModalPortfolioContainer
                  title={playerLineups[currentIndex]?.teamName}
                  accountId={playerLineups[currentIndex]?.accountId}
                  textcolor="text-indigo-black"
                />
              </div>
              <div className="h-128">
                <div className="flex flex-col md:pb-12 ml-24 iphoneX:ml-24 md:ml-20">
                  <div className="grid grid-cols-4 gap-6 md:gap-y-4 mb-2 md:mb-10 md:grid-cols-4 md:ml-7 mt-8 -ml-9 mr-6 md:mr-0  ">
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
              <div className="fixed top-4 right-4 transform scale-100">
                <button
                  onClick={() => {
                    setEntryModal(false);
                    setViewModal(true);
                    setIsExtendedLeaderboard(0);
                  }}
                >
                  <img src="/images/x.png" />
                </button>
              </div>
            </EntrySummaryModal>
          </Main>
        </div>
      </Container>
    </Provider>
  );
}

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
