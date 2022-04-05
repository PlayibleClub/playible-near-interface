import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import Container from '../../components/containers/Container';
import myactivityicon from '../../public/images/myactivity.png';
import win from '../../public/images/myactivitywin.png';
import BackButton from '../../components/buttons/BackFunction';

import { allGames, PlayHistory } from './data';
import { axiosInstance } from '../../utils/playible';
import { useRouter } from 'next/router';

const MyActivity = () => {
  const router = useRouter();
  const [activeCategory, setCategory] = useState('activeplays');
  const [allGames, setAllGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const connectedWallet = useConnectedWallet();
  const dispatch = useDispatch();

  async function fetchActiveGames() {
    let tempList1 = [];
    const newNG = await axiosInstance.get(`/fantasy/game/new/`);
    if (newNG.status === 200) {
      tempList1 = [...newNG.data];
    }

    const newAG = await axiosInstance.get(`/fantasy/game/active/`);
    if (newAG.status === 200) {
      tempList1 = [...tempList1, ...newAG.data];
    }
    fetchRegisteredTeams(tempList1);
  }

  async function fetchCompletedGames() {
    let tempList1 = [];
    const newC = await axiosInstance.get(`/fantasy/game/completed/`);
    if (newC.status === 200) {
      tempList1 = [...newC.data];
    }
    fetchCompletedRegisteredTeams(tempList1);
  }

  async function fetchCompletedRegisteredTeams(allGames) {
    const connectedWalletGames = allGames.map(async (data) => {
      const teams = await axiosInstance.get(
        `/fantasy/game/${data.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
      );
      if (teams.status === 200 && teams.data.length > 0) {
        return data;
      }
    });

    const promiseObject = await Promise.all(connectedWalletGames);
    const filteredPromiseObject = promiseObject.filter((check) => check);
    setCompletedGames([]);
    setCompletedGames(filteredPromiseObject);
  }

  async function fetchRegisteredTeams(allGames) {
    const connectedWalletGames = allGames.map(async (data) => {
      const teams = await axiosInstance.get(
        `/fantasy/game/${data.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
      );
      if (teams.status === 200 && teams.data.length > 0) {
        return data;
      } else {
        return []
      }
    });

    const promiseObject = await Promise.all(connectedWalletGames);
    const filteredPromiseObject = promiseObject.filter((check) => check);
    setAllGames([]);
    setAllGames(filteredPromiseObject);
  }

  useEffect(() => {
    if (connectedWallet && dispatch) {
      dispatch(getPortfolio({ walletAddr: connectedWallet.walletAddress }));
      fetchActiveGames();
      fetchCompletedGames();
    }
  }, [connectedWallet, dispatch, activeCategory]);

  return (
    <>
      <Container>
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <div className="flex flex-col">
              <div className="flex">
                {/* <BackButton prev="/Play"/> */}
                {allGames ? (
                  <>
                    <PortfolioContainer title="MY ACTIVITY" textcolor="text-indigo-black">
                      <div className="flex flex-col mt-6 mb-12">
                        {activeCategory === 'activeplays' && (
                          <>
                            <div className="flex font-bold ml-6 md:ml-0 font-monument">
                              <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue">
                                ACTIVE PLAYS
                              </div>

                              <div
                                className=""
                                onClick={() => {
                                  setCategory('playhistory');
                                }}
                              >
                                PLAY HISTORY
                              </div>
                            </div>

                            <hr className="opacity-50" />

                            <div className="mt-8 ml-12 mr-8 md:mr-32">
                              {allGames.map(function (data, i) {
                                if (allGames.length > 0) {
                                  return (
                                    <Link href={`/PlayDetails?id=${data.id}`}>
                                      <div className="flex mt-2 flex-col cursor-pointer" key={i}>
                                        <div className="flex justify-between text-sm">
                                          <div className="font-bold">{data.name}</div>
                                          <img src={myactivityicon} />
                                        </div>

                                        <hr className="w-full self-center opacity-25 mt-8" />
                                      </div>
                                    </Link>
                                  );
                                }
                              })}
                            </div>
                          </>
                        )}
                        {activeCategory === 'playhistory' && (
                          <>
                            <div className="flex font-bold ml-6 md:ml-0 font-monument">
                              <div
                                className="mr-6 md:ml-8"
                                onClick={() => {
                                  setCategory('activeplays');
                                }}
                              >
                                ACTIVE PLAYS
                              </div>

                              <div className="border-b-8 pb-2 border-indigo-buttonblue">
                                PLAY HISTORY
                              </div>
                            </div>

                            <hr className="opacity-50" />

                            <div className="mt-8 ml-12 mr-8 md:mr-32">
                              {completedGames.map(function (data, i) {
                                if (completedGames.length > 0) {
                                  return (
                                    <Link href={`/PlayDetails?id=${data.id}`}>
                                      <div className="flex mt-2 flex-col cursor-pointer" key={i}>
                                        <div className="flex justify-between text-sm">
                                          <div className="font-bold">{data.name}</div>
                                          <img src={myactivityicon} />
                                        </div>

                                        <hr className="w-full self-center opacity-25 mt-8" />
                                      </div>
                                    </Link>
                                  );
                                }
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </PortfolioContainer>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
};
export default MyActivity;
