import React, { useState, useEffect } from 'react';
import Container from '../../components/containers/Container';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';
import PlayDetailsComponent from './components/PlayDetailsComponent';
import { axiosInstance } from '../../utils/playible';
import moment from 'moment';
import { getUTCDateFromLocal, getUTCTimestampFromLocal } from 'utils/date/helper';
import { truncate } from '../../utils/wallet/index';
import { ADMIN } from '../../data/constants/address';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { GAME } from 'data/constants/nearContracts';
import Router from 'next/router';
import BaseModal from 'components/modals/BaseModal';
import { query_game_data } from 'utils/near/helper';

export default function PlayDetails(props) {
  const { query } = props;

  const gameId = query.game_id;

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const { accountId } = useWalletSelector();
  const defaultGameImage = '/images/game.png';
  const defaultPrizeDescription = '$100 + 2 Championship Tickets';
  const [gameData, setGameData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [gameOngoing, setgameOngoing] = useState(false);
  const [gameEnd, setgameEnd] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [startDate, setStartDate] = useState();
  const [gameFreeOrPaid, setgameFreeOrPaid] = useState('');
  const [detailsFreeOrPaid, setdetailsFreeOrPaid] = useState('');
  const [redirectModal, setRedirectModal] = useState(false);
  const { error } = props;
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(error);
  const [countdown, setCountdown] = useState(3);
  function checkIfCompleted(gameData) {
    if (gameData.end_time <= getUTCTimestampFromLocal) {
      console.log('completed');
      setRedirectModal(true);
      return true;
    } else return false;
  }

  function startCountdown() {
    setTimeout(() => {
      let newCount = countdown - 1;
      setCountdown(newCount);
    }, 1000);
  }

  async function get_game_data(game_id) {
    setGameData(await query_game_data(game_id));
  }

  function query_player_team() {
    const query = JSON.stringify({
      account: accountId,
      game_id: gameId,
      from_index: 0,
      limit: 10,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(GAME),
        method_name: 'get_players_team',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
      });
  }

  function checkIfPaidGame(gameData) {
    if (gameData.usage_cost > 0) {
      setgameFreeOrPaid('PAID GAME');
      setdetailsFreeOrPaid(
        "*Participation in this game will reduce your player token's usage by 1."
      );
    } else {
      setgameFreeOrPaid('FREE GAME');
      setdetailsFreeOrPaid("*Winning in t his game will reward your player's token usage by 1.");
    }
  }

  useEffect(() => {
    get_game_data(gameId);
    query_player_team();
  }, []);

  useEffect(() => {
    if (gameData !== null) {
      console.log(gameData);
      checkIfCompleted(gameData);
      checkIfPaidGame(gameData);
    }
  }, [gameData]);

  useEffect(() => {
    if (redirectModal) {
      startCountdown();
    }
  }, [redirectModal]);

  useEffect(() => {
    if (countdown === 0) {
      Router.push('/Play');
    } else if (gameData !== null && redirectModal) {
      startCountdown();
    }
  }, [countdown]);
  // async function fetchGameData() {
  //   const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);
  //   if (res.status === 200) {
  //     setGameData(res.data);
  //     setStartDate(res.data.end_datetime);
  //   } else {
  //   }
  // }

  // async function fetchRegisteredTeams() {
  //   const res = await axiosInstance.get(
  //     `/fantasy/game/${router.query.id}/registered_teams_detail/?wallet_addr=${"TODO"}`
  //   );

  //   if (res.status === 200 && res.data.length > 0) {
  //     setRegisteredTeams(res.data);
  //   }
  // }

  // async function fetchLeaderboard() {
  //   const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/leaderboard/`);
  //   if (res.status === 200) {
  //     const removedAdminWallet = res.data.filter(function (data) {
  //       return data.player_addr !== ADMIN;
  //     });
  //     setLeaderboard(removedAdminWallet);
  //   } else {
  //   }
  // }

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

  function isOngoing() {
    setgameOngoing(true);
  }

  function isEnd() {
    setgameEnd(false);
  }

  function isNew() {
    const currentDate = new Date();
    const end = new Date(startDate);
    // const totalSeconds = (end - currentDate) / 1000;
    // if (totalSeconds > 0) {
    //   setgameEnd(true);
    // }
  }

  // useEffect(() => {
  //   if (router && router.query.id) {
  //     fetchLeaderboard();
  //     fetchGameData();
  //     setgameOngoing(false);
  //     isNew();
  //   }
  // }, [router, gameOngoing, gameEnd, timesUp]);

  // useEffect(() => {
  //   if (router && router.query.id && connectedWallet) {
  //     fetchRegisteredTeams();
  //   }
  // }, [router, connectedWallet]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     const currentDate = new Date();
  //     const end = new Date(startDate);
  //     // const totalSeconds = (end - currentDate) / 1000;
  //     isNew();
  //     // if (Math.floor(totalSeconds) < 0) {
  //     //   clearInterval(id);
  //     //   setTimesUp(true);
  //     //   isEnd();
  //     // }
  //   }, 1000);
  //   return () => clearInterval(id);
  // }, [startDate]);

  // useEffect(() => {
  //   setErr(null);
  //   if (connectedWallet) {
  //     if (connectedWallet?.network?.name === 'testnet') {
  //       await fetchLeaderboard();
  //       await fetchGameData();
  //       await setgameOngoing(false);
  //       await isNew();
  //       setErr(null);
  //     } else {
  //       setErr('You are connected to mainnet. Please connect to testnet');
  //       setLoading(false);
  //     }
  //   } else {
  //     setErr('Waiting for wallet connection...');
  //     setLoading(false);
  //   }
  // }, [connectedWallet]);

  // if (!router) {
  //   return <div></div>;
  // }

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          <div className="md:ml-6">
            <div className="iphone5:mt-24 md:mt-8">
              <BackFunction prev="/Play" />
            </div>
            {/* {loading ? (
            <LoadingPageDark />
          ) : (
            <div>
              {err ? (
                <p className="py-10 ml-7">{err}</p>
              ) : (
                <> */}
            {/* {gameData ? ( */}
            {5 ? (
              <>
                <div className="ml-6 mr-6 md:ml-7 flex flex-col md:flex-row">
                  <div className="md:mr-12">
                    {/* {!timesUp ? ( */}
                    {!timesUp ? (
                      <div className="mt-4">
                        {/* {new Date(gameData.start_datetime) <= new Date() &&
                              new Date(gameData.end_datetime) > new Date() ? ( */}
                        {new Date('test') <= new Date() && new Date('test') > new Date() ? (
                          <>
                            <ModalPortfolioContainer textcolor="indigo-black" title="VIEW TEAMS" />
                            {registeredTeams.length > 0
                              ? registeredTeams.map(function (data, i) {
                                  return (
                                    <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                                      <p className="font-monument">{data.name}</p>
                                    </div>
                                  );
                                })
                              : 'No teams created for this game.'}
                          </>
                        ) : (
                          <>
                            {1 ? (
                              <>
                                <div className="md:ml-7 flex flex-row md:flex-row">
                                  <div className="md:-mr-20">
                                    <div className="iphone5:mt-4 md:mt-7 flex justify-center md:self-left md:mr-8 iphone5:flex-col md:flex-row">
                                      <div className="-ml-7 mr-7">
                                        <Image
                                          src={
                                            gameData?.game_image
                                              ? gameData.game_image
                                              : defaultGameImage
                                          }
                                          width={550}
                                          height={279}
                                          alt="game-image"
                                        />
                                      </div>
                                      <div className="md:-mt-7 w-96">
                                        <div className="iphone5:-ml-7 md:ml-0">
                                          <PortfolioContainer
                                            textcolor="indigo-black"
                                            title={gameFreeOrPaid}
                                          />
                                        </div>
                                        <div className="flex md:space-x-14 mt-4 iphone5:flex-col md:flex-row">
                                          <div className="iphone5:ml-0 md:ml-7">
                                            <div>PRIZE POOL</div>
                                            <div className=" font-monument text-lg">
                                              {gameData?.prize_description
                                                ? gameData.prize_description
                                                : defaultPrizeDescription}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="iphone5:mt-4 md:mt-0">START DATE</div>
                                            <div className=" font-monument text-lg">
                                              {(gameData &&
                                                moment(gameData.start_time).format('MM/DD/YYYY')) ||
                                                'N/A'}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="md:ml-7">
                                          <div className="mt-4">
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
                                            <div className="flex iphone5:justify-left md:justify-start iphone5:ml-0 md:ml-0">
                                              <Link href={`/CreateLineup/${gameId}`}>
                                                <button className="bg-indigo-buttonblue text-indigo-white iphone5:w-80 iphone5:h-12 md:max-w-full md:h-12 text-center font-bold text-md mt-8">
                                                  ENTER GAME
                                                </button>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <ModalPortfolioContainer textcolor="indigo-black" title="VIEW TEAMS" />
                        {registeredTeams.length > 0
                          ? registeredTeams.map(function (data, i) {
                              return (
                                <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                                  <p className="font-monument">{data.name}</p>
                                  {/* <Link
                                          href={{
                                            pathname: '/EntrySummary',
                                            query: {
                                              team_id: data.id,
                                              game_id: router.query.id,
                                              origin: `/PlayDetails/?id=${router.query.id}`,
                                            },
                                          }}
                                        >
                                          <a>
                                            <img src={'/images/arrow-top-right.png'} />
                                          </a>
                                        </Link> */}
                                </div>
                              );
                            })
                          : 'No teams created for this game.'}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    {/* {hasLeaderboard(gameData.start_datetime, gameData.end_datetime) ? (
                            leaderboard.length > 0 ? ( */}
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
                        <>
                          {/* <PortfolioContainer
                                  textcolor="indigo-black"
                                  title="LEADERBOARD2"
                                /> */}
                          {/* {leaderboard.map(function (data, key) {
                                  return (
                                    <>
                                      <div className="ml-12 md:ml-10 mt-4 md:mt-0">
                                        <div className="flex text-center items-center">
                                          <div className="w-10  mr-2 font-monument text-xl">
                                            {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                                          </div>
                                          <div className="bg-indigo-black text-indigo-white w-40 text-center p-1 text-base font-monument">
                                            {truncate("test", 11)}
                                          </div>
                                          <div className="ml-16 w-10 text-center font-black">
                                            {"data.fantasy_score"}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })} */}
                        </>
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
                  </div>
                </div>
              </>
            ) : (
              <>
                <PortfolioContainer textcolor="indigo-black" title="LEADERBOARD3" />
                {leaderboard.map(function (data, key) {
                  return (
                    <>
                      <div className="ml-12 md:ml-10 mt-4 md:mt-0">
                        <div className="flex text-center items-center">
                          <div className="w-10  mr-2 font-monument text-xl">
                            {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                          </div>
                          <div className="bg-indigo-black text-indigo-white w-40 text-center p-1 text-base font-monument">
                            {/* {truncate(data.player_addr, 11)} */}
                            {truncate('test', 11)}
                          </div>
                          <div className="ml-16 w-10 text-center font-black">
                            {/* {data.fantasy_score} */}
                            {'11.11'}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            )}
            <>
              <PortfolioContainer textcolor="indigo-black" title="GAMEPLAY" />

              {/* if paid game
              <div className="ml-7 mt-5 font-bold text-indigo-red">{detailsFreeOrPaid}</div>
              */}
              <div className="ml-7 mt-3 font-normal mr-24">{gameData?.game_description}</div>
            </>
          </div>
        </Main>
      </div>
      <BaseModal title="ERROR" visible={redirectModal} onClose={() => console.log()}>
        <p className="mt-5">Game is already finished.</p>
        <p className="mt-5">Returning to play page in {countdown}...</p>
      </BaseModal>
    </Container>
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
