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

export default function PlayDetails() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);

  async function fetchGameData() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);
    if (res.status === 200) {
      setGameData(res.data);
    } else {
    }
  }

  async function fetchRegisteredTeams() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/registered_teams/`);
    if (res.status === 200) {
      setRegisteredTeams(res.data);
    } else {
    }
  }

  async function fetchLeaderboard() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/leaderboard/`);
    if (res.status === 200) {
      const removedAdminWallet = res.data.filter(function (data) {
        return data.account.wallet_addr !== ADMIN;
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

  useEffect(() => {
    if (router && router.query.id) {
      fetchRegisteredTeams();
      fetchLeaderboard();
      fetchGameData();
    }
  }, [router]);

  return (
    <Container>
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
                  <div className="mt-4">
                    {new Date(gameData.start_datetime) <= new Date() &&
                    new Date(gameData.end_datetime) > new Date() ? (
                      <>
                        <ModalPortfolioContainer textcolor="indigo-black" title="VIEW TEAMS" />
                        {registeredTeams.length > 0
                          ? registeredTeams.map((data) => data.name)
                          : 'No teams created for this game.'}
                      </>
                    ) : (
                      <>
                        <div className="flex space-x-14 mt-4">
                          <div>
                            <div>PRIZE POOL</div>
                            <div className="text-base font-monument text-lg">${gameData.prize}</div>
                          </div>
                          <div>
                            <div>START DATE</div>
                            <div className="text-base font-monument text-lg">
                              {moment(gameData.start_datetime).format('MM/DD/YYYY')}
                            </div>
                          </div>
                        </div>
                        <div>REGISTRATION ENDS IN</div>
                        <PlayDetailsComponent startDate={gameData.start_datetime} />
                      </>
                    )}

                    <div className="flex justify-center md:justify-start">
                      <a href={`/CreateLineup?id=${gameData.id}`}>
                        <button
                          className={
                            new Date(gameData.start_datetime) <= new Date() &&
                            new Date(gameData.end_datetime) > new Date()
                              ? 'bg-indigo-lightblue text-indigo-buttonblue cursor-not-allowed w-64 h-12 text-center font-bold text-md mt-8 mr-4 hidden'
                              : 'bg-indigo-buttonblue text-indigo-white w-64 h-12 text-center font-bold text-md mt-8'
                          }
                        >
                          ENTER GAME
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  {hasLeaderboard(gameData.start_datetime, gameData.end_datetime) ? (
                    leaderboard.length > 0 ? (
                      <>
                        <PortfolioContainer textcolor="indigo-black" title="LEADERBOARD" />
                        {leaderboard.map(function (data, key) {
                          return (
                            <>
                              <PortfolioContainer textcolor="indigo-black" title="LEADERBOARD" />
                              <div className="ml-12 md:ml-10 mt-4 md:mt-0">
                                <div className="flex text-center">
                                  <div className="w-10 mt-4 mr-2 font-monument text-xl">
                                    {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                                  </div>
                                  <div className="bg-indigo-black text-indigo-white w-40 mt-3 text-center p-1 text-base font-monument">
                                    {truncate(data.account.wallet_addr, 11)}
                                  </div>
                                  <div className="ml-16 w-10 text-center mt-3 font-black">
                                    {data.fantasy_score}
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
                                <div className="flex text-center">
                                  <div className="w-10 mt-4 mr-2 font-monument text-xl">
                                    {key + 1 <= 9 ? '0' + (key + 1) : key + 1}
                                  </div>
                                  <div className="bg-indigo-black text-indigo-white w-40 mt-3 text-center p-1 text-base font-monument">
                                    {truncate(data.account.wallet_addr, 11)}
                                  </div>
                                  <div className="ml-16 w-10 text-center mt-3 font-black">
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
            ) : (
              <>
                <PortfolioContainer textcolor="indigo-black" title="INVALID GAME DATA" />
                <p className='ml-7'>Please proceed to Play and select a game</p>
              </>
            )}
          </div>
        </Main>
      </div>
    </Container>
  );
}
