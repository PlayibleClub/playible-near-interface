import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from 'components/Main';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import Container from 'components/containers/Container';
import BackFunction from 'components/buttons/BackFunction';
import { useRouter } from 'next/router';
import { axiosInstance } from 'utils/playible';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import LoadingPageDark from 'components/loading/LoadingPageDark';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import { query_player_teams } from 'utils/near/helper';
import { getImage } from 'utils/game/helper';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, persistor } from 'redux/athlete/store';
import { query_game_data } from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';
import { setTeamName, setAccountId, setGameId, setSport2 } from 'redux/athlete/teamSlice';
import { setGameStartDate, setGameEndDate } from 'redux/athlete/athleteSlice';
export default function CreateLineup(props) {
  const { query } = props;
  const gameId = query.game_id;
  const currentSport = query.sport.toString().toUpperCase();
  const teamName = 'Team 1';
  const router = useRouter();
  const dispatch = useDispatch();
  const { accountId } = useWalletSelector();
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [playerTeams, setPlayerTeams] = useState([]);
  const [startDate, setStartDate] = useState();
  const [buttonMute, setButtonMute] = useState(false);

  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(error);
  const playGameImage = '/images/game.png';
  useEffect(() => {
    const id = setInterval(() => {
      const currentDate = new Date();
      const end = new Date(startDate);
    }, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  async function get_player_teams(account, game_id) {
    setPlayerTeams(
      await query_player_teams(account, game_id, getSportType(currentSport).gameContract)
    );
  }

  async function get_game_data(game_id) {
    setGameData(await query_game_data(game_id, getSportType(currentSport).gameContract));
  }

  const handleButtonClick = (teamName, accountId, gameId) => {
    dispatch(setTeamName(teamName));
    dispatch(setAccountId(accountId));
    dispatch(setGameId(gameId));
    dispatch(setSport2(currentSport));
    router.push('/EntrySummary');
  };

  const handleCreateLineupClick = () => {
    dispatch(setGameStartDate(gameData.start_time));
    dispatch(setGameEndDate(gameData.end_time));
    router.push(`/CreateTeam/${currentSport.toLowerCase()}/${gameId}`);
  };
  useEffect(() => {
    setTimeout(() => persistor.purge(), 200);
    console.log('loading');
    get_game_data(gameId);
    get_player_teams(accountId, gameId);
    console.log(playerTeams);
  }, []);

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
                playerTeams.team_names == undefined ? (
                  <p>No teams assigned</p>
                ) : (
                  <div>
                    {/* @ts-expect-error */}
                    {playerTeams.team_names.map((data) => {
                      return (
                        <ViewTeamsContainer
                          teamNames={data}
                          gameId={gameId}
                          accountId={accountId}
                          fromGames={false}
                          onClickFn={(data, accountId, gameId) =>
                            handleButtonClick(data, accountId, gameId)
                          }
                        />
                      );
                    })}
                  </div>
                )
              }
            </div>
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
