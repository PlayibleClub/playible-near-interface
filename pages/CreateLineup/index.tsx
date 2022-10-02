import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from '../../components/Main';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { useRouter } from 'next/router';
import { axiosInstance } from '../../utils/playible/';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import LoadingPageDark from '../../components/loading/LoadingPageDark';

export default function CreateLineup(props) {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [startDate, setStartDate] = useState();
  const [buttonMute, setButtonMute] = useState(false);

  const { error } = props;
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(error);

  const fetchGameData = async () => {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);

    const teams = await axiosInstance.get(
      `/fantasy/game/${router.query.id}/registered_teams_detail/?wallet_addr=${"TODO"}`
    );

    if (teams.status === 200) {
      setTeams(teams.data);
    }

    if (res.status === 200) {
      setGameData(res.data);
      setStartDate(res.data.start_datetime);
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   if (router && router.query.id && connectedWallet) {
  //     setTeams([]);
  //     fetchGameData();
  //   }
  // }, [router, connectedWallet]);

  if (!router) {
    return;
  }

  if (gameData && router && router.query.id) {
    if (new Date(gameData.start_datetime) < new Date()) {
      router.replace(`/PlayDetails/?id=${router.query.id}`);
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      const currentDate = new Date();
      const end = new Date(startDate);
      // const totalSeconds = (end - currentDate) / 1000;
      // if (Math.floor(totalSeconds) === 0) {
      //   setButtonMute(true);
      //   clearInterval(id);
      // }
    }, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  // useEffect(() => {
  //   setErr(null);
  //   if (connectedWallet) {
  //     if (connectedWallet?.network?.name === 'testnet') {
  //       await fetchGameData();
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

  return (
    <>
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            {loading ? (
              <LoadingPageDark />
            ) : (
              <>
                {err ? (
                  <p className="py-10 ml-7">{err}</p>
                ) : (
                  <>
                    {gameData ? (
                      <>
                        <div className="mt-8">
                          <BackFunction prev={`/PlayDetails?id=${gameData.id}`} />
                        </div>
                        <div className="md:ml-7 flex flex-col md:flex-row">
                          <div className="md:mr-12">
                            <div className="mt-7 justify-center md:self-left md:mr-8">
                              <Image
                                // src={gameData.image}
                                src="/images/game.png"
                                width={550}
                                height={220}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row ml-7 mb-10">
                          <ModalPortfolioContainer
                            title="CREATE TEAM"
                            textcolor="text-indigo-black"
                          />
                          {buttonMute ? (
                            <button className="bg-indigo-lightblue text-indigo-buttonblue whitespace-nowrap h-14 px-10 mt-4 ml-0 md:ml-12 text-center font-bold cursor-not-allowed">
                              CREATE YOUR LINEUP +
                            </button>
                          ) : (
                            <a href={`/CreateTeam?id=${router.query.id}`}>
                              <button className="bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-10 mt-4 ml-0 md:ml-12 text-center font-bold">
                                CREATE YOUR LINEUP +
                              </button>
                            </a>
                          )}
                        </div>
                        {/* <div className="ml-7 mr-7 border-b-2 border-indigo-lightgray border-opacity-30 w-2/5" /> */}
                        <div className="ml-7 mt-0 md:mt-4 w-10/12 md:w-2/5">
                          Create a team and showcase your collection. Enter a team into the
                          tournament and compete for cash prizes.
                        </div>
                        <div className="mt-7 ml-7 w-2/5">
                          <ModalPortfolioContainer
                            title="VIEW TEAMS"
                            textcolor="text-indigo-black mb-5"
                          />
                          {teams.length > 0 ? (
                            <div>
                              {teams.map(function (data, i) {
                                return (
                                  <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                                    <p className="font-monument">{data.name}</p>
                                    <Link
                                      href={{
                                        pathname: '/EntrySummary',
                                        query: {
                                          team_id: data.id,
                                          game_id: router.query.id,
                                        },
                                      }}
                                    >
                                      <a>
                                        <img src={'/images/arrow-top-right.png'} />
                                      </a>
                                    </Link>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p>No teams assigned</p>
                          )}
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </>
            )}
          </Main>
        </div>
      </Container>
    </>
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

// export async function getServerSideProps(ctx) {
//   const { query } = ctx;
//   let queryObj = null;
//   if (query) {
//     if (query.id) {
//       queryObj = query;
//       const res = await axiosInstance.get(`/fantasy/game/${query.id}/`);
//       if (res.status === 200) {
//         if (new Date(res.data.start_datetime) < new Date()) {
//           return {
//             redirect: {
//               destination: `/PlayDetails/?id=${query.id}`,
//               permanent: false,
//             },
//           };
//         }
//       }
//     } else {
//       return {
//         redirect: {
//           destination: query.origin || '/Portfolio',
//           permanent: false,
//         },
//       };
//     }
//   }

//   let playerStats = null;
//   const res = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id) + 1}/stats/`);

//   if (res.status === 200) {
//     playerStats = res.data;
//   }
//   return {
//     props: { queryObj, playerStats },
//   };
// }
