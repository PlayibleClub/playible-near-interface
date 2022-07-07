import React, { useEffect, useState } from 'react';
import Container from '../../../components/containers/Container';
import LoadingPageDark from '../../../components/loading/LoadingPageDark';
import Main from '../../../components/Main';
import Distribution from './components/distribution';
import { axiosInstance } from '../../../utils/playible';
import BaseModal from '../../../components/modals/BaseModal';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { estimateFee, estimateMultipleFees, executeContract } from '../../../utils/terra';
import { GAME, ORACLE } from '../../../data/constants/contracts';
import 'regenerator-runtime/runtime';
import { format } from 'prettier';
import { NEWADMIN } from '../../../data/constants/address';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from '../../../utils/mutations';
TimeAgo.addDefaultLocale(en);

const Index = (props) => {
  const connectedWallet = useConnectedWallet();
  const [createNewGame, { data, error }] = useMutation(CREATE_GAME);
  const { wallet } = useSelector((state) => state.external.playible);
  const lcd = useLCDClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [gameType, setGameType] = useState('new');
  const [content, setContent] = useState(false);
  const [tabs, setTabs] = useState([
    {
      name: 'GAMES',
      isActive: true,
    },
    {
      name: 'CREATE',
      isActive: false,
    },
  ]);
  const [gameTabs, setGameTabs] = useState([
    {
      name: 'UPCOMING',
      isActive: true,
    },
    {
      name: 'COMPLETED',
      isActive: false,
    },
  ]);

  const [details, setDetails] = useState({
    name: '',
    startTime: '',
    duration: 1,
    prize: 1,
    description: '',
  });

  const [distribution, setDistribution] = useState([
    {
      rank: 1,
      percentage: 50,
    },
    {
      rank: 2,
      percentage: 30,
    },
    {
      rank: 3,
      percentage: 16,
    },
    {
      rank: 4,
      percentage: 2,
    },
    {
      rank: 5,
      percentage: 2,
    },
    {
      rank: 6,
      percentage: 2,
    },
    {
      rank: 7,
      percentage: 2,
    },
    {
      rank: 8,
      percentage: 2,
    },
    {
      rank: 9,
      percentage: 2,
    },
    {
      rank: 10,
      percentage: 2,
    },
  ]);

  const [games, setGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [err, setErr] = useState(null);
  const [modal, setModal] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [msg, setMsg] = useState({
    title: '',
    content: '',
  });

  const [endMsg, setEndMsg] = useState({
    title: '',
    content: '',
  });

  const [percentTotal, setPercentTotal] = useState(0);

  const changeTab = (name) => {
    const tabList = [...tabs];

    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setTabs([...tabList]);
  };

  const changeGameTab = (name) => {
    const tabList = [...gameTabs];

    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setGameTabs([...tabList]);
  };

  const modifyRankList = (type, rankNum, percentVal) => {
    let tempList = [...distribution];

    if (type === 'add') {
      const newDist = {
        rank: distribution.length + 1,
        percentage: 0,
      };
      setDistribution([...distribution, newDist]);
    }

    if (type === 'update') {
      tempList.forEach((item) => {
        if (item.rank === rankNum) {
          item.percentage = percentVal;
        }
      });

      setDistribution(tempList);
    }

    if (type === 'delete') {
      let newList = tempList.filter((item) => item.rank !== rankNum);

      setDistribution(newList);
    }
  };

  const getTotalPercent = () => {
    let total = 0;
    distribution.forEach((item) => (total += item.percentage));

    setPercentTotal(total);
  };

  const onChange = (e) => {
    if (e.target.name === 'duration' || e.target.name === 'prize') {
      console.log(e.target.name, e.target.value);
      if (parseInt(e.target.value) > 0) {
        setDetails({
          ...details,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setDetails({
        ...details,
        [e.target.name]: e.target.value,
      });
    }
  };

  const checkValidity = () => {
    let errors = [];
    let sortPercentage = [...distribution].sort((a, b) => b.percentage - a.percentage);
    console.log('details.duration', typeof details.duration);
    if (!Number.isInteger(parseInt(details.duration))) {
      errors.push('Duration must be a positive integer that is expressed in days');
    }

    if (!details.name) {
      errors.push('Game is missing a title');
    }

    if (new Date(details.startTime) < new Date() || !details.startTime) {
      errors.push('Invalid Date & Time values');
    }

    if (distribution.length === 1 && percentTotal === 0) {
      errors.push('Invalid Distribution values');
    }

    if (percentTotal < 100) {
      errors.push('Total percent distribution must be equal to 100');
    }

    if (distribution.length < 10) {
      errors.push(
        'Exactly 10 rank distribution must be provided. (Only ' +
          distribution.length +
          ' was provided)'
      );
    }

    if (distribution.filter((item) => item.percentage === 0 || item.percentage < 0).length > 0) {
      errors.push('A distribution percentage of 0% is not allowed');
    }

    for (let i = 0; i < distribution.length; i++) {
      if (distribution[i].rank !== sortPercentage[i].rank) {
        errors.push('Higher rank must have a higher percentage than the rest below');
        break;
      }
    }

    return errors;
  };

  const validateGame = () => {
    if (checkValidity().length > 0) {
      alert(
        `ERRORS: \n${checkValidity()
          .map((item) => '❌ ' + item)
          .join(` \n`)}`.replace(',', '')
      );
    } else {
      setConfirmModal(true);
    }
  };

  const endGame = async (id) => {
    if (connectedWallet) {
      setEndLoading(true);

      setEndMsg({
        title: 'Ending Game',
        content: 'Officially ending game',
      });

      setEndModal(true);

      const leaderboard = await axiosInstance.get(`/fantasy/game/${id}/leaderboard/`);

      if (leaderboard.status === 200) {
        const endGameRes = await executeContract(connectedWallet, ORACLE, [
          {
            contractAddr: ORACLE,
            msg: {
              add_leaderboard: {
                game_id: id.toString(),
                leaderboard: leaderboard.data,
              },
            },
          },
          {
            contractAddr: GAME,
            msg: {
              end_game: {
                game_id: id.toString(),
              },
            },
          },
        ]);

        if (
          !endGameRes.txResult ||
          (endGameRes.txResult && !endGameRes.txResult.success) ||
          endGameRes.txError
        ) {
          setMsg({
            title: 'Failed',
            content:
              endGameRes.txResult && !endGameRes.txResult.success
                ? 'Blockchain error! Please try again later.'
                : endGameRes.txError,
          });
        } else {
          setMsg({
            title: 'SUCCESS',
            content: 'Successfully ended game',
          });
        }
        // fetchGames();
        setModal(true);
        setEndModal(false);
        router.reload();
      } else {
        setMsg({
          title: 'Error',
          content: 'An error occurred when ending the game',
        });
        setModal(true);
        setEndModal(false);
      }

      setEndLoading(false);
    }
  };

  const createGame = async () => {
    if (connectedWallet) {
      const formData = {
        ...details,
        // DURATION IS EXPRESSED IN DAYS BUT WILL BE CONVERTED TO MINUTES
        // duration: parseInt(details.duration) * 60 * 24,
        duration: 1,
      };

      setLoading(true);

      const res = await axiosInstance.post('/fantasy/game/', formData);

      if (res.status === 201) {
        setMsg({
          title: 'Success',
          content: `${res.data.name} created!`,
        });
        const distributionList = distribution.map((item) => {
          return {
            ...item,
            percentage: (parseInt(item.percentage) / 100) * 1000000,
          };
        });

        const resContract = await executeContract(connectedWallet, ORACLE, [
          {
            contractAddr: ORACLE,
            msg: {
              add_game: {
                game_id: res.data.id.toString(),
                prize: parseInt(res.data.prize),
                distribution: distributionList,
              },
            },
          },
          {
            contractAddr: GAME,
            msg: {
              add_game: {
                game_id: res.data.id.toString(),
                game_time_start: Math.ceil(convertToMinutes(formData.startTime)),
                duration: Math.ceil(formData.duration),
              },
            },
          },
        ]);

        if (
          !resContract.txResult ||
          (resContract.txResult && !resContract.txResult.success) ||
          resContract.txError
        ) {
          let deleteSuccess = false;
          while (!deleteSuccess) {
            const deleteRes = await axiosInstance.delete(`/fantasy/game/${res.data.id}/`);

            if (deleteRes.status === 204) {
              deleteSuccess = true;
            }
          }

          setMsg({
            title: 'Failed',
            content:
              resContract.txResult && !resContract.txResult.success
                ? 'Blockchain error! Please try again later.'
                : resContract.txError,
          });
        }
        resetForm();
        // fetchGames();
      } else {
        setMsg({
          title: 'Failed',
          content: 'An error occurred! Please try again later.',
        });
      }

      setModal(true);
      setLoading(false);
    } else {
      alert('Connect to your wallet first');
    }
  };

  const newGame = async () => {
    const formData = {
      ...details,
      duration: 1,
    };

    createNewGame({
      variables: {
        args: formData,
      },
    });

    console.log('error', error);
    console.log('data', data);
  };

  const convertToMinutes = (time) => {
    const now = new Date();
    const gameStart = new Date(time);
    const timeDiff = gameStart / 1000 - now / 1000;

    return timeDiff / 60;
  };

  const fetchGames = async () => {
    setContentLoading(true);
    const res = await axiosInstance.get('/fantasy/game/new/');
    const completedRes = await axiosInstance.get('/fantasy/game/completed/');

    if (res.status === 200 && res.data.length > 0) {
      const sortedData = [...res.data].sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
      setGames(sortedData);
    }
    if (completedRes.status === 200 && completedRes.data.length > 0) {
      const data = completedRes.data;
      const completedList = data.map(async (item) => {
        const hasEnded = await lcd.wasm.contractQuery(GAME, {
          game_info: { game_id: item.id.toString() },
        });

        return {
          ...item,
          hasEnded: !!hasEnded?.has_ended,
        };
      });

      const completedGamesList = await Promise.all(completedList);

      setCompletedGames(completedGamesList.filter((item) => !item.hasEnded));
    }
    setContentLoading(false);
  };

  const resetForm = () => {
    setDetails({
      name: '',
      startTime: '',
      duration: 1,
      prize: 1,
    });
    setDistribution([
      {
        rank: 1,
        percentage: 0,
      },
    ]);
  };

  useEffect(() => {
    getTotalPercent();
  }, [distribution]);

  // useEffect(() => {
  //   if (connectedWallet) {
  //     if (connectedWallet.walletAddress === NEWADMIN) {
  //       if (connectedWallet?.network?.name === 'testnet') {
  //         // fetchGames();
  //         setErr(null);
  //         setContent(true);
  //       } else {
  //         setErr('You are connected to mainnet. Please connect to testnet');
  //       }
  //     } else {
  //       return router.replace('/');
  //     }
  //   } else {
  //     setGames([]);
  //     setCompletedGames([]);
  //     setErr('Waiting for wallet connection...');
  //   }
  // }, [connectedWallet]);

  useEffect(() => {
    if (wallet?.data) {
      const isSignedIn = wallet.data.walletConnection.isSignedIn();
      if (isSignedIn) {
        setErr(null);
        setContent(true);
        setContentLoading(false);
      }
      console.log('walletInfo', wallet.data.walletConnection.isSignedIn());
    }
  }, [wallet]);

  return (
    <Container isAdmin>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          {content &&
            (contentLoading ? (
              <LoadingPageDark />
            ) : err ? (
              <p className="ml-12 mt-5">{err}</p>
            ) : (
              <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-indigo-black">
                <div className="flex md:ml-4 font-bold ml-8 font-monument mt-5">
                  {tabs.map(({ name, isActive }) => (
                    <div
                      className={`cursor-pointer mr-6 ${
                        isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                      }`}
                      onClick={() => changeTab(name)}
                    >
                      {name}
                    </div>
                  ))}
                </div>
                <hr className="opacity-50" />
                <div className="p-8 px-32">
                  {loading ? (
                    <LoadingPageDark />
                  ) : tabs[0].isActive ? (
                    <div>
                      <div className="flex md:ml-4 font-bold ml-8 font-monument mt-5">
                        {gameTabs.map(({ name, isActive }) => (
                          <div
                            className={`cursor-pointer mr-6 ${
                              isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                            }`}
                            onClick={() => changeGameTab(name)}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                      {(gameTabs[0].isActive ? games : completedGames).length > 0 &&
                        (gameTabs[0].isActive ? games : completedGames).map(function (data, i) {
                          return (
                            <div className="border-b p-5 py-8">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-bold text-lg">{data.name}</p>
                                  {gameTabs[0].isActive ? (
                                    <ReactTimeAgo
                                      future
                                      timeStyle="round-minute"
                                      date={data.startTime}
                                      locale="en-US"
                                    />
                                  ) : (
                                    ''
                                  )}
                                  <p>Prize: $ {data.prize}</p>
                                </div>
                                {gameTabs[0].isActive ? (
                                  ''
                                ) : (
                                  <div>
                                    <button
                                      className="bg-indigo-green font-monument tracking-widest  text-indigo-white w-5/6 md:w-64 h-16 text-center text-sm"
                                      onClick={() => {
                                        setGameId(data.id);
                                        setEndModal(true);
                                      }}
                                    >
                                      END GAME
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <>
                      <div className="flex">
                        {/* GAME TITLE */}
                        <div className="flex flex-col lg:w-1/2 lg:mr-10">
                          <label className="font-monument" htmlFor="title">
                            TITLE
                          </label>
                          <input
                            className="border outline-none rounded-lg px-3 p-2"
                            id="title"
                            name="name"
                            placeholder="Enter title"
                            onChange={(e) => onChange(e)}
                            value={details.name}
                          />
                        </div>

                        {/* DATE & TIME */}
                        <div className="flex flex-col lg:w-1/2">
                          <label className="font-monument" htmlFor="datetime">
                            DATE & TIME
                          </label>
                          <input
                            className="border outline-none rounded-lg px-3 p-2"
                            id="datetime"
                            type="datetime-local"
                            name="startTime"
                            onChange={(e) => onChange(e)}
                            value={details.startTime}
                          />
                        </div>
                      </div>

                      <div className="flex mt-8">
                        {/* DURATION */}
                        <div className="flex flex-col lg:w-1/2 lg:mr-10">
                          <label className="font-monument" htmlFor="duration">
                            DURATION <span className="text-indigo-lightgray">(DAYS)</span>
                          </label>
                          <input
                            className="border outline-none rounded-lg px-3 p-2"
                            id="duration"
                            name="duration"
                            type="number"
                            min={1}
                            placeholder="Express in days"
                            onChange={(e) => onChange(e)}
                            value={details.duration}
                          />
                        </div>

                        {/* PRIZE */}
                        <div className="flex flex-col lg:w-1/2">
                          <label className="font-monument" htmlFor="prize">
                            PRIZE
                          </label>
                          <input
                            className="border outline-none rounded-lg px-3 p-2"
                            id="prize"
                            type="number"
                            name="prize"
                            min={1}
                            placeholder="Enter amount"
                            onChange={(e) => onChange(e)}
                            value={details.prize}
                          />
                        </div>
                      </div>

                      <div className="flex mt-8">
                        {/* DESCRIPTION */}
                        <div className="flex flex-col w-full">
                          <label className="font-monument" htmlFor="duration">
                            DESCRIPTION
                          </label>
                          <textarea
                            className="border outline-none rounded-lg px-3 p-2"
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Description of game"
                            onChange={(e) => onChange(e)}
                            value={details.description}
                            style={{
                              minHeight: '220px',
                            }}
                          />
                        </div>
                      </div>

                      {/* DISTRIBUTION FORM */}
                      <div className="mt-8">
                        <p className="font-monument">DISTRIBUTION</p>
                        {distribution.map(({ rank, percentage }) => (
                          <Distribution
                            rank={rank}
                            value={percentage}
                            handleChange={modifyRankList}
                            showDelete={rank === distribution.length && distribution.length > 1}
                            percentTotal={percentTotal}
                          />
                        ))}

                        {distribution.length < 10 ? (
                          <div className="flex justify-start">
                            <button
                              className="bg-indigo-darkgray text-indigo-white w-5/6 md:w-48 h-10 text-center font-bold text-sm mt-4"
                              onClick={() => modifyRankList('add')}
                            >
                              Add New Rank
                            </button>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>

                      <div className="flex justify-center mt-8 mb-10">
                        <button
                          className="bg-indigo-green font-monument tracking-widest ml-7 text-indigo-white w-5/6 md:w-80 h-16 text-center text-sm mt-4"
                          onClick={validateGame}
                        >
                          CREATE GAME
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
        </Main>
      </div>
      <BaseModal title={msg.title} visible={modal} onClose={() => setModal(false)}>
        <p className="mt-5">{msg.content}</p>
      </BaseModal>
      <BaseModal title={endMsg.title} visible={endLoading} onClose={() => console.log()}>
        {endMsg.content ? (
          <div>
            <p className="mt-5">{endMsg.content}</p>
            <div className="flex gap-5 justify-center mb-5">
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
            </div>
          </div>
        ) : (
          ''
        )}
      </BaseModal>
      <BaseModal title={'Confirm'} visible={confirmModal} onClose={() => setConfirmModal(false)}>
        <p className="mt-5">Are you sure?</p>
        <button
          className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => {
            // createGame();
            newGame();
            setConfirmModal(false);
          }}
        >
          CREATE GAME
        </button>
        <button
          className="bg-red-pastel font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => setConfirmModal(false)}
        >
          CANCEL
        </button>
      </BaseModal>
      <BaseModal title={'End game'} visible={endModal} onClose={() => setEndModal(false)}>
        <p className="mt-5">Are you sure?</p>
        <button
          className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => {
            setEndModal(false);
          }}
        >
          END GAME
        </button>
        <button
          className="bg-red-pastel font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => setEndModal(false)}
        >
          CANCEL
        </button>
      </BaseModal>
    </Container>
  );
};

export default Index;

// export async function getServerSideProps(ctx) {
//   return {
//     redirect: {
//       destination: '/Portfolio',
//       permanent: false,
//     },
//   };
// }
