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
  const router = useRouter();
  // const week = router.query.week;
  const gameId = query.game_id;

  const [playerLineups, setPlayerLineups] = useState([]);

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const { accountId } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [week, setWeek] = useState(0);

 async function get_game_data(game_id) {

    setGameInfo(await query_game_data(game_id));

  }

  const gameStart = (Object.values(gameInfo)[0]) / 1000;

  async function get_all_players_lineup() {
    setPlayerLineups(await query_all_players_lineup(gameId, 11));
    // const query = JSON.stringify({
    //   game_id: gameId,
    // });

    // provider
    //   .query({
    //     request_type: 'call_function',
    //     finality: 'optimistic',
    //     account_id: getContract(GAME),
    //     method_name: 'get_all_players_lineup',
    //     args_base64: Buffer.from(query).toString('base64'),
    //   })
    //   .then(async (data) => {
    //     // @ts-ignore:next-line
    //     const result = JSON.parse(Buffer.from(data.result).toString());

    //     const arrayToReturn = await Promise.all(
    //       result.map(async (item) => {
    //         let itemToReturn = {
    //           accountId: item[0][0],
    //           teamName: item[0][2],
    //           lineup: item[1].lineup,
    //           sumScore: 0,
    //         };

    //         itemToReturn.lineup = await Promise.all(
    //           itemToReturn.lineup.map((item) => {
    //             return query_nft_token_by_id(item);
    //           })
    //         );

    //         itemToReturn.lineup = itemToReturn.lineup.map((lineupItem) => {
    //           return {
    //             ...lineupItem,
    //             stats_breakdown:
    //               lineupItem.stats_breakdown
    //                 .filter(
    //                   (statType) =>
    //                     statType.type == 'weekly' && statType.played == 1 && statType.week == week
    //                 )
    //                 .map((item) => {
    //                   return item.fantasyScore;
    //                 })[0] || 0,
    //           };
    //         });

    //         itemToReturn.sumScore = itemToReturn.lineup.reduce((accumulator, object) => {
    //           return accumulator + object.stats_breakdown;
    //         }, 0);

    //         return itemToReturn;
    //       })
    //     );

    //     arrayToReturn.sort(function (a, b) {
    //       return b.sumScore - a.sumScore;
    //     });

    //     setPlayerLineups(arrayToReturn);
    //   });
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
    get_all_players_lineup();
  }, []);

  return (
    <Container activeName="GAMES">
      <div className="flex flex-row md:flex-col">
        <Main color="indigo-white">
          <div className="mt-8 ml-6">
            <BackFunction prev="/Play" />
          </div>
          {getNflWeek(gameStart)}
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
