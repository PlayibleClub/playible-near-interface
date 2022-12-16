import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import Link from 'next/link';
import { getContract, getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { useEffect, useState } from 'react';
import { GAME, ATHLETE } from 'data/constants/nearContracts';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import Image from 'next/image';
import { useRouter } from 'next/router';
import moment from 'moment';
import Main from 'components/Main';
import LeaderboardComponent from './components/LeaderboardComponent';
import ViewTeamsContainer from 'components/containers/ViewTeamsContainer';
import { query_game_data, query_all_players_lineup, query_player_teams } from 'utils/near/helper';
import { getNflWeek } from 'utils/date/helper';
import LoadingPageDark from 'components/loading/LoadingPageDark';
import { getImage } from 'utils/game/helper';

const Games = (props) => {
  const { query } = props;
  const gameId = query.game_id;

  const [playerLineups, setPlayerLineups] = useState([]);

  const { accountId } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [week, setWeek] = useState(0);

  async function get_game_data(game_id) {
    setGameInfo(await query_game_data(game_id));
  }

  const gameStart = Object.values(gameInfo)[0] / 1000;
  console.log('nfl week: ' + week);

  async function get_game_week() {
    setWeek(await getNflWeek(gameStart));
  }

  async function get_all_players_lineup() {
    setPlayerLineups(await query_all_players_lineup(gameId, week));
  }

  async function get_player_teams(account, game_id) {
    setPlayerTeams(await query_player_teams(account, game_id));
  }

  useEffect(() => {
    console.log('loading');
    get_player_teams(accountId, gameId);
    console.log(playerTeams);
    get_all_players_lineup();
  }, [week]);

  useEffect(() => {
    get_game_data(gameId);
  }, []);

  useEffect(() => {
    get_game_week();
  });

  return (
    <Container activeName="GAMES">
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Main color="indigo-white">
          <div className="mt-8 ml-6">
            <BackFunction prev="/Play" />
          </div>
          <div className="flex flex-row">
            <div className="md:ml-6 mt-11 flex flex-col w-auto">
              <div className="md:ml-7 mr-12">
                <Image src={getImage(gameId)} width={550} height={279} alt="game-image" />
              </div>
              <div className="mt-7 ml-6 w-3/5 md:w-1/2 md:ml-7 md:mt-2">
                <ModalPortfolioContainer title="VIEW TEAMS" textcolor="text-indigo-black mb-5" />
                {
                  /* @ts-expect-error */
                  playerTeams.team_names == undefined ? (
                    'No Teams Assigned'
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
            </div>

            <div className="md:ml-18 ml-18 mt-4">
              <ModalPortfolioContainer textcolor="indigo-black" title={'LEADERBOARD'} />
              <div className="overflow-y-auto">
                {playerLineups.length > 0 ? (
                  playerLineups.slice(0, 10).map((item, index) => {
                    return (
                      <LeaderboardComponent
                        accountId={item.accountId}
                        teamName={item.teamName}
                        teamScore={item.sumScore}
                        index={index}
                      />
                    );
                  })
                ) : (
                  <div className="-mt-10 -ml-12">
                    <LoadingPageDark />
                  </div>
                )}
              </div>
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
