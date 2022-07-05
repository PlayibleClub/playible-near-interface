import React, { useState, useEffect } from 'react';
import Container from '../../components/containers/Container';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';
import PlayDetailsComponent from './components/PlayDetailsComponent.js';
import { axiosInstance } from '../../utils/playible/';
import moment from 'moment';
import { truncate } from '../../utils/wallet/index.js';
import { ADMIN } from '../../data/constants/address.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import 'regenerator-runtime/runtime';

export default function PlayDetails() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const connectedWallet = useConnectedWallet();
  const [gameOngoing, setgameOngoing] = useState(false);
  const [gameEnd, setgameEnd] = useState(false);
  const [timesUp, setTimesUp] = useState(false);
  const [startDate, setStartDate] = useState();

  async function fetchGameData() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);
    if (res.status === 200) {
      setGameData(res.data);
      setStartDate(res.data.end_datetime);
    } else {
    }
  }

  async function fetchRegisteredTeams() {
    const res = await axiosInstance.get(
      `/fantasy/game/${router.query.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
    );

    if (res.status === 200 && res.data.length > 0) {
      setRegisteredTeams(res.data);
    }
  }

  async function fetchLeaderboard() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/leaderboard/`);
    if (res.status === 200) {
      const removedAdminWallet = res.data.filter(function (data) {
        // return data.player_addr !== ADMIN;
        return data
      });
      setLeaderboard(removedAdminWallet);
    } else {
    }
  }

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
    const totalSeconds = (end - currentDate) / 1000;
    if (totalSeconds > 0) {
      setgameEnd(true);
    }
  }

  useEffect(() => {
    if (router && router.query.id) {
      fetchLeaderboard();
      fetchGameData();
      setgameOngoing(false);
      isNew();
    }
  }, [router, gameOngoing, gameEnd, timesUp]);

  useEffect(() => {
    if (router && router.query.id && connectedWallet) {
      fetchRegisteredTeams();
    }
  }, [router, connectedWallet]);

  useEffect(() => {
    const id = setInterval(() => {
      const currentDate = new Date();
      const end = new Date(startDate);
      const totalSeconds = (end - currentDate) / 1000;
      isNew();
      if (Math.floor(totalSeconds) < 0) {
        clearInterval(id);
        setTimesUp(true);
        isEnd();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  if (!router) {
    return <div></div>;
  }

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          <div className="md:ml-6">
            <div className="mt-8">
              <BackFunction prev="/Play" />
            </div>
            {gameData ? (
              <div className="ml-6 mr-6 md:ml-7 flex flex-col md:flex-row">
                <div className="md:mr-12">
                  <div className="mt-7 justify-center md:self-left md:mr-8">
                    <Image
                      // src={gameData.image}
                      src="/images/game.png"
                      width={550}
                      height={220}
                    />
                  </div>
                  {!timesUp ? (
                    <div className="mt-4">
                      {new Date(gameData.start_datetime) <= new Date() &&
                      new Date(gameData.end_datetime) > new Date() ? (
                        <>
                          <ModalPortfolioContainer textcolor="indigo-black" title="VIEW TEAMS" />
                          {registeredTeams.length > 0
                            ? registeredTeams.map(function (data, i) {
                                return (
                                  <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                                    <p className="font-monument">{data.name}</p>
                                    <Link
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
                                    </Link>
                                  </div>
                                );
                              })
                            : 'No teams created for this game.'}
                        </>
                      ) : (
                        <>
                          {gameEnd ? (
                            <>
                              <div className="flex space-x-14 mt-4">
                                <div>
                                  <div>PRIZE POOL</div>
                                  <div className="text-base font-monument text-lg">
                                    ${gameData.prize}
                                  </div>
                                </div>
                                <div>
                                  <div>START DATE</div>
                                  <div className="text-base font-monument text-lg">
                                    {moment(gameData.start_datetime).format('MM/DD/YYYY')}
                                  </div>
                                </div>
                              </div>
                              <div>REGISTRATION ENDS IN</div>
                              <PlayDetailsComponent
                                startDate={gameData.start_datetime}
                                endDate={gameData.end_d}
                                fetch={() => fetchGameData()}
                                game={() => isOngoing()}
                                gameEnd={() => isEnd()}
                              />
                              <div className="flex justify-center md:justify-start">
                                <a href={`/CreateLineup?id=${gameData.id}`}>
                                  <button className="bg-indigo-buttonblue text-indigo-white w-64 h-12 text-center font-bold text-md mt-8">
                                    ENTER GAME
                                  </button>
                                </a>
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
                                <Link
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
                                </Link>
                              </div>
                            );
                          })
                        : 'No teams created for this game.'}
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  {hasLeaderboard(gameData.start_datetime, gameData.end_datetime) ? (
                    leaderboard.length > 0 ? (
                      <>
                        <PortfolioContainer textcolor="indigo-black mb-5" title="LEADERBOARD" />
                        {leaderboard.map(function (data, key) {
                          return (
                            <>
                              <div className="ml-12 md:ml-10 mt-4 md:mt-5">
                                <div className="flex text-center items-center">
                                  <div
                                    className={`w-10 mr-2 font-monument text-2xl ${
                                      key + 1 > 3 ? 'text-indigo-white' : ''
                                    }`}
                                    style={{
                                      '-webkit-text-stroke': key + 1 > 3  ? '1px #000' : '',
                                    }}
                                  >
                                    {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                                  </div>
                                  <div className="bg-indigo-black text-indigo-white w-40 text-center p-1 text-base font-monument">
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
                        <PortfolioContainer textcolor="indigo-black" title="LEADERBOARD" />
                        {leaderboard.map(function (data, key) {
                          return (
                            <>
                              <div className="ml-12 md:ml-10 mt-4 md:mt-0">
                                <div className="flex text-center items-center">
                                  <div className="w-10  mr-2 font-monument text-xl">
                                    {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                                  </div>
                                  <div className="bg-indigo-black text-indigo-white w-40 text-center p-1 text-base font-monument">
                                    {truncate(data.player_addr, 11)}
                                  </div>
                                  <div className="ml-16 w-10 text-center font-black">
                                    {data.fantasy_score}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )
                  ) : (
                    <>
                      <PortfolioContainer textcolor="indigo-black" title="GAMEPLAY" />

                      {/* if paid game */}
                      <div className="ml-7 mt-5 font-normal font-bold text-indigo-red">*Participation in this game will reduce your player token's usage by 1.</div>

                      {/* if free game */}
                      <div className="ml-7 mt-5 font-normal font-bold text-indigo-green">*Winning in this game will reward your player token's usage by 1.</div>

                      <div className="ml-7 mt-3 font-normal">
                        Enter a team into the Alley-oop tournament to compete for cash prizes.
                      </div>

                      <div className="ml-7 mt-1 font-normal">
                        Create a lineup by selecting five Playible Athlete Tokens now.
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </Main>
      </div>
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  return {
    redirect: {
      destination: '/Portfolio',
      permanent: false,
    },
  };
}