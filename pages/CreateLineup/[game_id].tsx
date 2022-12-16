import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from '../../components/Main';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { useRouter } from 'next/router';
import { axiosInstance } from '../../utils/playible';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { GAME } from 'data/constants/nearContracts';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import { query_player_teams } from 'utils/near/helper';
import { getImage } from 'utils/game/helper';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, persistor } from 'redux/athlete/store';

export default function CreateLineup(props) {
  const { query } = props;
  const gameId = query.game_id;
  const teamName = 'Team 1';

  const { accountId } = useWalletSelector();
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [playerTeams, setPlayerTeams] = useState([]);
  const [startDate, setStartDate] = useState();
  const [buttonMute, setButtonMute] = useState(false);

  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(error);

  useEffect(() => {
    const id = setInterval(() => {
      const currentDate = new Date();
      const end = new Date(startDate);
    }, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  async function get_player_teams(account, game_id) {
    setPlayerTeams(await query_player_teams(account, game_id));
  }

  useEffect(() => {
    setTimeout(() => persistor.purge(), 200);
    console.log('loading');
    get_player_teams(accountId, gameId);
    console.log(playerTeams);
  }, []);

  return (
    <Provider store={store}>
      <Container activeName="PLAY">
        <div className="flex flex-row md:flex-col">
          <Main color="indigo-white">
            <div className="mt-8 ml-6">
              <BackFunction
                prev={query.origin ? `/${query.origin}` : `/PlayDetails/${gameId}`}
              ></BackFunction>
            </div>
            <div className="md:ml-6 mt-11 flex w-auto">
              <div className="md:ml-7">
                <Image src={getImage(gameId)} width={550} height={279} alt="game-image" />
              </div>

              <div className="md:ml-18 md:-mt-6 ml-14 -mt-6">
                <ModalPortfolioContainer title="CREATE TEAM" textcolor="text-indigo-black" />

                <div className="md:w-2/5">
                  Enter your team to compete for cash prizes and entry into the Football
                  Championship with $35,000 USD up for grabs.
                </div>
                <Link
                  href={{
                    pathname: '/CreateTeam/[game_id]',
                    query: {
                      game_id: gameId,
                      teamName: teamName,
                    },
                  }}
                  as={`/CreateTeam/${gameId}`}
                >
                  <button className="bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-10 mt-16 text-center font-bold">
                    CREATE YOUR LINEUP +
                  </button>
                </Link>
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
                      return <ViewTeamsContainer teamNames={data} gameId={gameId} />;
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
