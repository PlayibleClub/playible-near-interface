import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import Link from 'next/link';
import { getContract, getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { useEffect, useState } from 'react';
import { GAME } from 'data/constants/nearContracts';
import { truncate } from 'utils/wallet';
import Image from 'next/image';
import PlayDetailsComponent from 'pages/PlayDetails/components/PlayDetailsComponent';
import moment from 'moment';
import Main from 'components/Main';

const Games = (props) => {
  const { query } = props;
  const [gameData, setGameData] = useState(null);

  const gameId = query.game_id;
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const { accountId } = useWalletSelector();
  const [playerTeams, setPlayerTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  function hasLeaderboard(start, end) {
    const start_datetime = new Date(start);
    const end_datetime = new Date(end);
    const now = new Date();

    if (now < start_datetime) {
      return false;
    } else {
      return true;
    }
  }

  function query_player_teams() {
    const query = JSON.stringify({
      account: accountId,
      game_id: gameId,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(GAME),
        method_name: 'get_player_team',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const playerTeamNames = JSON.parse(Buffer.from(data.result));

        setPlayerTeams(playerTeamNames);
      });
  }

  useEffect(() => {
    console.log('loading');
    query_player_teams();
    console.log(playerTeams);
  }, []);

  return (
    <Container activeName="Games">
      <div className="flex flex-row md:flex-col">
      <Main color="indigo-white">
        <div className="mt-8 ml-6">
          <BackFunction prev="/Play" />
        </div>
        <>
          <div className="md:ml-6 mt-11 flex w-auto">
            <div className="md:ml-7 mr-12">
              <Image src="/images/game.png" width={550} height={279} />
            </div>
            <div className="md:ml-18 md:-mt-6 ml-18 -mt-6">
              <ModalPortfolioContainer textcolor="indigo-black" title={'GAMES'} />
              <div className="grid grid-cols-3 gap-4">
                <div className="">
                  <div>PRIZE POOL</div>
                  <div className=" font-monument text-lg">
                    {(gameData && gameData.prize) || 'N/A'}
                  </div>
                </div>
                <div>
                  <div>START DATE</div>
                  <div className=" font-monument text-lg">
                    {(gameData && moment(gameData.start_time).format('MM/DD/YYYY')) || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="">
                <div className="">
                  {gameData &&
                    (moment(gameData.start_time) <= moment() &&
                    moment(gameData.end_time) > moment() ? (
                      <>
                        <p>ENDS IN</p>
                        {gameData ? (
                          <PlayDetailsComponent
                            prizePool={gameData.prize}
                            startDate={gameData.end_time}
                            // fetch={() => fetchGameData()}
                            // game={() => gameEnded()}
                          />
                        ) : (
                          ''
                        )}
                      </>
                    ) : moment(gameData.start_time) > moment() ? (
                      <>
                        <p>REGISTRATION ENDS IN</p>
                        {gameData ? (
                          <PlayDetailsComponent
                            prizePool={gameData.prize}
                            startDate={gameData.start_time}
                            // fetch={() => fetchGameData()}
                            // game={() => gameEnded()}
                          />
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      ''
                    ))}
                  <div className="flex justify-center md:justify-start w-3/5">
                    <Link href={`/CreateLineup/${gameId}`}>
                      <button className="bg-indigo-buttonblue text-indigo-white w-full h-12 text-center font-bold text-md mt-8">
                        ENTER GAME
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col">
              {hasLeaderboard('gameData.start_datetime', 'gameData.end_datetime') ? (
                leaderboard.length > 0 ? (
                  <>
                    <PortfolioContainer textcolor="indigo-black mb-5" title="LEADERBOARD1" />
                    {leaderboard.map(function (data, key) {
                      return (
                        <>
                          <div className="ml-12 md:ml-10 mt-4 md:mt-5">
                            <div className="flex text-center items-center">
                              <div
                                className={`w-10 mr-2 font-monument text-2xl ${
                                  key + 1 > 3 ? 'text-indigo-white' : ''
                                }`}
                              >
                                {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                              </div>
                              <div className="bg-indigo-black text-indigo-white px-3 text-center p-1 text-base font-monument">
                                {truncate(data.player_addr, 11)}
                              </div>
                              <div className="ml-16 w-10 text-center font-black">
                                {data.fantasy_score.toString().indexOf('.') === -1
                                  ? `${data.fantasy_score}.00`
                                  : data.fantasy_score}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )
              ) : (
                <>
                  <PortfolioContainer textcolor="indigo-black" title="GAMEPLAY" />
                  <div className="ml-7 mt-5 font-normal">
                    Enter a team into the Alley-oop tournament to compete for cash prizes.
                  </div>
                  <div className="ml-7 mt-2 font-normal">
                    Create a lineup by selecting five Playible Athlete Tokens now.
                  </div>
                </>
              )}
            </div> */}
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
                    <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                      <p className="font-monument">{data}</p>
                      <Link
                        href={{
                          pathname: '/EntrySummary/[game_id]',
                          query: {
                            team_id: data,
                            game_id: gameId,
                          },
                        }}
                        as={`/EntrySummary/${gameId}/${data}`}
                      >
                        <a>
                          <img src={'/images/arrow-top-right.png'} />
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )
          }
          </div>
        </>
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
