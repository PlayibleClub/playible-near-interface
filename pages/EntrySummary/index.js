import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { useRouter } from 'next/router';
import PlayDetailsComponent from '../../pages/PlayDetails/components/PlayDetailsComponent.js';
import { axiosInstance } from '../../utils/playible';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import moment from 'moment';
import Link from 'next/link';
import PerformerContainer from '../../components/containers/PerformerContainer';
import 'regenerator-runtime/runtime';

export default function EntrySummary() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const connectedWallet = useConnectedWallet();
  const [team, setTeam] = useState([]);
  const [gameEnd,  setGameEnd] = useState(false);

  const fetchGameData = async () => {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.game_id}/`);

    const allTeams = router.query.team_id ? await axiosInstance.get(`/fantasy/game_team/${router.query.team_id}/`) : await axiosInstance.get(
      `/fantasy/game/${router.query.game_id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
    );

    if (allTeams.status === 200) {

      if (router.query.team_id) {
        setTeam([allTeams.data]);
      } else {
        setTeam(allTeams.data);
      }
    }

    if (res.status === 200) {
      setGameData(res.data);
    }
  };

  function gameEnded(){
    setGameEnd(true);
  }

  useEffect(() => {
    if (router && router.query.game_id && connectedWallet) {
      fetchGameData();
      setGameEnd(false)
    }
  }, [router, connectedWallet,gameEnd]);

  if (!router) {
    return;
  }

  return (
    <>
      {/* { changeNameModal === true &&
        <>
        <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-4/12 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
                <button onClick={()=>{setchangeNameModal(false)}}>
                    <div className="absolute top-0 right-0 p-4 font-black">
                        X
                    </div>
                </button>
                    <ModalPortfolioContainer  textcolor="indigo-black" title="EDIT TEAM NAME"/>
                <div className='ml-7'>
                    <div>
                       Enter Team Name 
                    </div>
                    <div className='flex border justify-between p-4 text-bold font-monument'>
                    <form>
                            <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        /> 
                    </form>
                    <button className='mr-4' onClick={reset}>
                        X
                    </button>
                    </div>
                    <button className='bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center text-indigo-white' onClick={()=>{setchangeNameModal(false)}}>
                            PROCEED
                        </button>
                </div>
            </div>
        </div>
        </>
        } */}
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <>
              <div className="mt-8">
                <BackFunction
                  prev={router.query.origin || `/CreateLineup?id=${router.query.game_id}`}
                />
              </div>
              <PortfolioContainer textcolor="indigo-black" title="ENTRY SUMMARY" />
              <div className="md:ml-7 flex flex-row md:flex-row">
                <div className="md:mr-12">
                  <div className="mt-7 justify-center md:self-left md:mr-8">
                    <Image src="/images/game.png" width={550} height={220} />
                  </div>
                  <div className="flex space-x-14 mt-4">
                    <div>
                      <div>PRIZE POOL</div>
                      <div className="text-base font-monument text-lg">
                        {(gameData && gameData.prize) || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div>START DATE</div>
                      <div className="text-base font-monument text-lg">
                        {(gameData && moment(gameData.start_datetime).format('MM/DD/YYYY')) ||
                          'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {gameData &&
                      (new Date(gameData.start_datetime) <= new Date() &&
                      new Date(gameData.end_datetime) > new Date() ? (
                        <>
                          <p>ENDS IN</p>
                          {gameData ? (
                            <PlayDetailsComponent
                              prizePool={gameData.prize}
                              startDate={gameData.end_datetime}
                              fetch={() => fetchGameData()}
                              game={() => gameEnded()}
                            />
                          ) : (
                            ''
                          )}
                        </>
                      ) : new Date(gameData.start_datetime) > new Date() ? (
                        <>
                          <p>REGISTRATION ENDS IN</p>
                          {gameData ? (
                            <PlayDetailsComponent
                              prizePool={gameData.prize}
                              startDate={gameData.start_datetime}
                              fetch={() => fetchGameData()}
                              game={() => gameEnded()}
                            />
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        ''
                      ))}
                  </div>
                </div>
              </div>
              {team.length > 0
                ? team.map((item) => (
                    <>
                      <div className="mt-10 flex items-center ml-7">
                        <p className="text-2xl font-bold font-monument">{item.name}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-y-4 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                        {item.athletes.map((player, i) => {
                          return (
                            <div className="mb-4" key={i}>
                              <PerformerContainer
                                AthleteName={`${player.first_name} ${player.last_name}`}
                                AvgScore={player.fantasy_score}
                                id={player.id}
                                uri={player.nft_image || null}
                                hoverable={false}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ))
                : ''}
            </>
          </Main>
        </div>
      </Container>
    </>
  );
}
