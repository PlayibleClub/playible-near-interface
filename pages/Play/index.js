import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import PlayComponent from './components/PlayComponent';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import Container from '../../components/containers/Container';
import BaseModal from '../../components/modals/BaseModal';
import claimreward from '../../public/images/claimreward.png';
import ModalComponent from './components/ModalComponent';
import { useRouter } from 'next/router';

import { newPlaylist, ongoingPlaylist, completedPlaylist, winningTeams, losingTeams } from './data';
import { axiosInstance } from '../../utils/playible';

const Play = () => {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const [activeCategory, setCategory] = useState('new');
  const [claimModal, showClaimModal] = useState(false);
  const [claimTeam, showClaimTeam] = useState(false);
  const [modalView, switchView] = useState(true);
  const [failedTransactionModal, showFailedModal] = useState(false);

  const router = useRouter();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };
  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const [games, setGames] = useState([]);

  const fetchGames = async (type) => {
    setGames([]);
    const res = await axiosInstance.get(`/fantasy/game/${type}/`);
    if (res.status === 200) {
      setGames(res.data);
    }
  };

  useEffect(() => {
    if (typeof connectedWallet !== 'undefined')
      dispatch(getPortfolio({ walletAddr: connectedWallet.walletAddress }));
  }, [connectedWallet]);

  useEffect(() => {
    fetchGames(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (router && router.query.type) {
      setCategory(router.query.type);
    }
  }, [router]);

  return (
    <>
      {claimModal === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  showClaimModal(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>

              <div className="mt-6 text-sm">
                {modalView === true && (
                  <>
                    <div className="flex font-bold font-monument">
                      <div className="mr-4 border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                        WINNING TEAMS
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          switchView(false);
                        }}
                      >
                        NO PLACEMENT
                      </div>
                    </div>
                    <hr className="opacity-50" />

                    {winningTeams.map(function (data, i) {
                      if (data.win === 'y') {
                        return (
                          <>
                            <ModalComponent
                              teamName={data.teamname}
                              win={data.win}
                              reward={data.reward}
                              score={data.score}
                            />
                          </>
                        );
                      }
                    })}

                    <div className="w-full flex justify-center">
                      <div className="text-indigo-white w-36 text-center bg-indigo-buttonblue py-2 px-2">
                        CLAIM REWARD
                      </div>
                    </div>
                  </>
                )}
                {modalView === false && (
                  <>
                    <div className="flex font-bold font-monument">
                      <div
                        className="mr-4 cursor-pointer"
                        onClick={() => {
                          switchView(true);
                        }}
                      >
                        WINNING TEAMS
                      </div>

                      <div className="border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                        NO PLACEMENT
                      </div>
                    </div>
                    <hr className="opacity-50" />

                    {losingTeams.map(function (data, i) {
                      if (data.win === 'n') {
                        return (
                          <>
                            <ModalComponent teamName={data.teamname} win={data.win} />
                          </>
                        );
                      }
                    })}

                    <div className="w-full flex justify-center">
                      <div className="text-indigo-white w-36 text-center bg-indigo-buttonblue py-2 px-2">
                        CLAIM REWARD
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {claimTeam === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  showClaimTeam(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>
              <div className="mt-4 bg-indigo-yellow p-2 text-center font-bold text-xl rounded">
                Your Team has not made it to the leader board
              </div>
              <div className="mt-4 p-2 text-center font-bold text-xl">Try again next time!</div>
            </div>
          </div>
        </>
      )}
      {failedTransactionModal === true && (
        <>
          <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
              <button
                onClick={() => {
                  showFailedModal(false);
                }}
              >
                <div className="absolute top-0 right-0 p-4 font-black">X</div>
              </button>

              <img src={claimreward} className="h-20 w-20" />
              <div className="mt-4 bg-indigo-yellow p-2 text-center font-bold text-xl rounded">
                FAILED TRANSACTION
              </div>
              <div className="mt-4 p-2 font-bold text-xl">
                We're sorry, unfortunately we've experienced a problem loading your request.
              </div>
              <div className="p-2 font-bold text-xl">Please try again.</div>
            </div>
          </div>
        </>
      )}
      <Container>
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <div className="flex flex-col">
              <div className="flex">
                <div className="flex-initial">
                  <PortfolioContainer title="PLAY" textcolor="text-indigo-black" />
                </div>
                <Link href="/MyActivity">
                  <button>
                    <div className="ml-8 mt-4 text-xs underline">MY ACTIVITY</div>
                  </button>
                </Link>
              </div>

              <div className="flex flex-col mt-6">
                {activeCategory === 'new' && (
                  <>
                    <div className="flex font-bold ml-8 md:ml-0 font-monument">
                      <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                        NEW
                      </div>

                      <div
                        className="mr-6 cursor-pointer"
                        onClick={() => {
                          setCategory('active');
                        }}
                      >
                        ON-GOING
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setCategory('completed');
                        }}
                      >
                        COMPLETED
                      </div>
                    </div>

                    <hr className="opacity-50" />

                    <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                      {games.length > 0 &&
                        games.map(function (data, i) {
                          return (
                            <a href={`/PlayDetails?id=${data.key}`}>
                              <div className="mr-6">
                                <PlayComponent
                                  type="new"
                                  icon={data.icon}
                                  prizePool={data.prize}
                                  startDate={data.start_datetime}
                                  month={data.month}
                                  date={data.date}
                                  year={data.year}
                                  img={data.image}
                                />
                              </div>
                            </a>
                          );
                        })}
                    </div>
                  </>
                )}
                {activeCategory === 'active' && (
                  <>
                    <div className="flex font-bold ml-8 md:ml-0 font-monument">
                      <div
                        className="mr-6 md:ml-8 cursor-pointer"
                        onClick={() => {
                          setCategory('new');
                        }}
                      >
                        NEW
                      </div>

                      <div className="mr-6 border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                        ON-GOING
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setCategory('completed');
                        }}
                      >
                        COMPLETED
                      </div>
                    </div>

                    <hr className="opacity-50" />

                    <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                      {games.length > 0 &&
                        games.map(function (data, i) {
                          return (
                            <a href={`/PlayDetails?id=${data.key}`}>
                              <div className="mr-6">
                                <PlayComponent
                                  type="ongoing"
                                  icon={data.icon}
                                  prizePool={data.prize}
                                  startDate={data.start_datetime}
                                  month={data.month}
                                  date={data.date}
                                  year={data.year}
                                  img={data.image}
                                />
                              </div>
                            </a>
                          );
                        })}
                    </div>
                  </>
                )}
                {activeCategory === 'completed' && (
                  <>
                    <div className="flex font-bold ml-8 md:ml-0 font-monument">
                      <div
                        className="mr-6 md:ml-8 cursor-pointer"
                        onClick={() => {
                          setCategory('new');
                        }}
                      >
                        NEW
                      </div>

                      <div
                        className="mr-6 cursor-pointer"
                        onClick={() => {
                          setCategory('active');
                        }}
                      >
                        ON-GOING
                      </div>

                      <div className="border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
                        COMPLETED
                      </div>
                    </div>

                    <hr className="opacity-50" />

                    <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                      {games.length > 0 &&
                        games.map(function (data, i) {
                          return (
                            <div className="flex">
                              <div className="mr-6">
                                <PlayComponent
                                  type="completed"
                                  icon={data.icon}
                                  prizePool={data.prize}
                                  startDate={data.start_datetime}
                                  month={data.month}
                                  date={data.date}
                                  year={data.year}
                                  img={data.image}
                                />

                                <div className="">
                                  <button
                                    className={
                                      data.id % 2 === 0
                                        ? 'bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center hidden'
                                        : 'bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center'
                                    }
                                    onClick={() => showClaimModal(true)}
                                  >
                                    <div className="text-indigo-white">CLAIM REWARD</div>
                                  </button>
                                  <button
                                    className={
                                      data.id % 2 === 0
                                        ? 'bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center'
                                        : 'bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center hidden'
                                    }
                                    onClick={() => showClaimTeam(true)}
                                  >
                                    <div className="text-indigo-white">CLAIM TEAM</div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
};
export default Play;
