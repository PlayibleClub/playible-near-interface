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

const Games = (props) => {
  const { query } = props;
  const gameId = query.game_id;

  const [playerLineups, setPlayerLineups] = useState([]);

  const { accountId } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [week, setWeek] = useState(0);

  function get_game_data(game_id) {

    query_game_data(game_id).then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      setGameInfo(result);
    })
  }

  const gameStart = (Object.values(gameInfo)[0]) / 1000;
  console.log("nfl week: " + week);

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
  }, []);

  useEffect(() => {
    get_game_data(gameId);
  }, []);

  useEffect(() => {
    get_game_week();
  })

  useEffect(() => {
    get_all_players_lineup();
  }, [week]);

  return (
    <Container activeName="GAMES">
      <div className="flex flex-row md:flex-col">
        <Main color="indigo-white">
          <div className="mt-8 ml-6">
            <BackFunction prev="/Play" />
          </div>
          <div className="md:ml-6 mt-11 flex w-auto">
            <div className="md:ml-7 mr-12">
              <Image src="/images/game.png" width={550} height={279} alt="game-image" />
            </div>
            <div className="md:ml-18 md:-mt-6 ml-18 -mt-6">
              <ModalPortfolioContainer textcolor="indigo-black" title={'LEADERBOARD'} />
              <div>
                {playerLineups.length > 0
                  ? playerLineups.map((item, index) => {
                    return (
                      <LeaderboardComponent
                        teamName={item.teamName}
                        teamScore={item.sumScore}
                        index={index}
                      />
                    );
                  })
                  : 'Leaderboard ranks are currently not available at this time.'}
              </div>
            </div>
          </div>


          <div className='mt-7 ml-6 w-3/5 md:w-1/3 md:ml-12 md:mt-2'>
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