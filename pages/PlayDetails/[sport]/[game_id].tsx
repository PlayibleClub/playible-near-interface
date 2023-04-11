import React, { useState, useEffect } from 'react';
import Container from 'components/containers/Container';
import Image from 'next/image';
import Main from 'components/Main';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import BackFunction from 'components/buttons/BackFunction';
import PlayDetailsComponent from '../components/PlayDetailsComponent';
import moment from 'moment';
import { getUTCTimestampFromLocal } from 'utils/date/helper';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import Router from 'next/router';
import BaseModal from 'components/modals/BaseModal';
import { query_game_data } from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';

export default function PlayDetails(props) {
  const { query } = props;

  const gameId = query.game_id;
  const currentSport = query.sport.toString().toUpperCase();
  console.log(currentSport);
  const defaultGameImage = '/images/game.png';
  const defaultPrizeDescription = '$100 + 2 Championship Tickets';
  const [gameData, setGameData] = useState(null);
  const [gameFreeOrPaid, setgameFreeOrPaid] = useState('');
  const [redirectModal, setRedirectModal] = useState(false);
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
    setGameData(await query_game_data(game_id, getSportType(currentSport).gameContract));
  }

  function checkIfPaidGame(gameData) {
    if (gameData.usage_cost > 0) {
      setgameFreeOrPaid('PAID GAME');
    } else {
      setgameFreeOrPaid('FREE GAME');
    }
  }

  useEffect(() => {
    get_game_data(gameId);
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

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          <div className="md:ml-6">
            <div className="iphone5:mt-24 md:mt-8">
              <BackFunction prev="/Play" />
            </div>
            <div className="md:ml-6 md:mr-6 md:ml-7 flex flex-col md:flex-row">
              <div className="md:ml-7 flex flex-row md:flex-row">
                <div className="iphone5:mt-4 md:mt-7 flex justify-center md:self-left md:mr-8 iphone5:flex-col md:flex-row">
                  <div className="iphone5:ml-4 iphone5:mr-7 md:-ml-7 md:mr-7">
                    <Image
                      src={gameData?.game_image ? gameData.game_image : defaultGameImage}
                      width={550}
                      height={279}
                      alt="game-image"
                    />
                  </div>
                  <div className="md:-mt-7 w-96">
                    <div className="iphone5:-ml-1 md:ml-0">
                      <PortfolioContainer textcolor="indigo-black" title={gameFreeOrPaid} />
                    </div>
                    <div className="flex md:space-x-14 md:mt-4 iphone5:flex-col md:flex-row">
                      <div className="iphone5:ml-4 md:ml-7">
                        <div>PRIZE POOL</div>
                        <div className=" font-monument text-lg">
                          {gameData?.prize_description
                            ? gameData.prize_description
                            : defaultPrizeDescription}
                        </div>
                      </div>
                      <div className="iphone5:ml-4 md:ml-0">
                        <div className="iphone5:mt-4 md:mt-0">START DATE</div>
                        <div className=" font-monument text-lg">
                          {(gameData &&
                            moment.utc(gameData.start_time).local().format('MM/DD/YYYY')) ||
                            'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="iphone5:ml-4 md:ml-7">
                      <div className="mt-4">
                        {gameData &&
                          (moment.utc(gameData.start_time).local() <= moment() &&
                          moment.utc(gameData.end_time).local() > moment() ? (
                            <>
                              <p>ENDS IN</p>
                              {gameData ? (
                                <PlayDetailsComponent
                                  prizePool={gameData.prize}
                                  startDate={gameData.end_time}
                                />
                              ) : (
                                ''
                              )}
                            </>
                          ) : moment.utc(gameData.start_time).local() > moment() ? (
                            <>
                              <p>REGISTRATION ENDS IN</p>
                              {gameData ? (
                                <PlayDetailsComponent
                                  prizePool={gameData.prize}
                                  startDate={gameData.start_time}
                                />
                              ) : (
                                ''
                              )}
                            </>
                          ) : (
                            ''
                          ))}
                        <div className="flex iphone5:justify-left md:justify-start iphone5:ml-0 md:ml-0">
                          <Link href={`/CreateLineup/${currentSport.toLowerCase()}/${gameId}`}>
                            <button className="bg-indigo-buttonblue text-indigo-white iphone5:w-80 iphone5:h-12 md:max-w-full md:h-12 text-center font-bold text-md md:mt-8 iphone5:mt-4">
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
            <PortfolioContainer textcolor="indigo-black" title="GAMEPLAY" />
            <div className="ml-7 mt-3 font-normal mr-24">{gameData?.game_description}</div>
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
