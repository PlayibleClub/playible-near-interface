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
import 'regenerator-runtime/runtime';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
TimeAgo.addDefaultLocale(en);

import win from '../../public/images/myactivitywin.png';
import BackButton from '../../components/buttons/BackFunction';

import { axiosInstance } from '../../utils/playible';
import { useRouter } from 'next/router';

const MyActivity = () => {
  const router = useRouter();
  const [activeCategory, setCategory] = useState('activeplays');
  const [allGames, setAllGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const connectedWallet = useConnectedWallet();
  const dispatch = useDispatch();

  const categoryList = ['activeplays', 'playhistory'];

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
    if (allGames.length > 0) {
      const connectedWalletGames = allGames.map(async (data) => {
        const teams = await axiosInstance.get(
          `/fantasy/game/${data.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
        );
        if (teams.status === 200 && teams.data.length > 0) {
          return { ...data, team_id: teams.data };
        }
      });
      const promiseObject = await Promise.all(connectedWalletGames);
      const filteredPromiseObject = promiseObject.filter((check) => check);
      console.log(filteredPromiseObject);
      setCompletedGames([]);
      setCompletedGames(filteredPromiseObject);
    }
  }

  async function fetchRegisteredTeams(allGames) {
    if (allGames.length > 0) {
      const connectedWalletGames = allGames.map(async (data) => {
        const teams = await axiosInstance.get(
          `/fantasy/game/${data.id}/registered_teams_detail/?wallet_addr=${connectedWallet.walletAddress}`
        );
        if (teams.status === 200 && teams.data.length > 0) {
          return { ...data, team_id: teams.data };
        }
      });

      const promiseObject = await Promise.all(connectedWalletGames);
      const filteredPromiseObject = promiseObject.filter((check) => check);
      setAllGames([]);
      setAllGames(filteredPromiseObject);
    }
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
            <PortfolioContainer title="MY ACTIVITY" textcolor="text-indigo-black" />
            <div className="flex flex-col">
              <div className="flex font-bold ml-8 mt-8 md:ml-0 font-monument">
                {categoryList.map((type) => (
                  <div
                    className={`mr-6 uppercase cursor-pointer md:ml-8 ${
                      activeCategory === type ? 'border-b-8 pb-2 border-indigo-buttonblue' : ''
                    }`}
                    onClick={() => {
                      setCategory(type);
                    }}
                  >
                    {type === 'activeplays' ? 'ACTIVE PLAYS' : 'PLAY HISTORY'}
                  </div>
                ))}
              </div>
              <hr className="opacity-50" />
              <div className="mt-8 ml-12 mr-8 md:w-2/3">
                <div>
                  {(activeCategory === 'activeplays' ? allGames : completedGames).map((data, i) =>
                    data ? (
                      <div className="flex flex-col " key={i}>
                        <div className="flex justify-between item-center p-8 text-sm">
                          <div className="relative w-full">
                            <p className="font-bold uppercase">{data.name}</p>
                            <p>
                              <ReactTimeAgo
                                future={activeCategory === 'activeplays'}
                                timeStyle="round-minute"
                                date={data.end_datetime}
                                locale="en-US"
                              />
                            </p>
                            <Link
                              href={{
                                pathname: '/EntrySummary',
                                query: {
                                  game_id: data.id,
                                  team_id: data.team_id[0].id,
                                  origin: 'MyActivity',
                                },
                              }}
                            >
                              <img
                                className="absolute top-0 right-0 cursor-pointer"
                                src={myactivityicon}
                              />
                            </Link>
                          </div>
                        </div>

                        <hr className="w-full self-center opacity-25" />
                      </div>
                    ) : (
                      ''
                    )
                  )}
                </div>
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
};
export default MyActivity;
