import { useEffect, useState } from 'react';
import Container from '../../../components/containers/Container';
import LoadingPageDark from '../../../components/loading/LoadingPageDark';
import Main from '../../../components/Main';
import Distribution from './components/distribution';
import { axiosInstance } from '../../../utils/playible';
import BaseModal from '../../../components/modals/BaseModal';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { estimateFee, estimateMultipleFees, executeContract } from '../../../utils/terra';
import { GAME, ORACLE } from '../../../data/constants/contracts';
TimeAgo.addDefaultLocale(en);

const Index = (props) => {
  const connectedWallet = useConnectedWallet();
  const [loading, setLoading] = useState(false);
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

  const [details, setDetails] = useState({
    name: '',
    start_datetime: '',
    duration: 1,
    prize: 1,
  });

  const [distribution, setDistribution] = useState([
    {
      rank: 1,
      percentage: 0,
    },
  ]);

  const [games, setGames] = useState([]);

  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [msg, setMsg] = useState({
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
    if ((e.target.name === 'duration' || e.target.name === 'prize') && e.target.value < 1) {
      setDetails({
        ...details,
        [e.target.name]: 1,
      });
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

    if (!details.name) {
      errors.push('Game is missing a title');
    }

    if (new Date(details.start_datetime) < new Date() || !details.start_datetime) {
      errors.push('Invalid Date & Time values');
    }

    if (distribution.length === 1 && percentTotal === 0) {
      errors.push('Invalid Distribution values');
    }

    if (percentTotal < 100) {
      errors.push('Total percent distribution must be equal to 100');
    }

    for (let i = 0; i < distribution.length; i++) {
      if (distribution[i].rank !== sortPercentage[i].rank) {
        errors.push('Higher rank must have a higher percentage than next one');
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

  const createGame = async () => {
    if (connectedWallet) {
      const formData = {
        ...details,
        // DURATION IS EXPRESSED IN DAYS BUT WILL BE CONVERTED TO MINUTES
        duration: parseInt(details.duration) * 60 * 24,
      };

      setLoading(true);

      const res = await axiosInstance.post('/fantasy/game/', formData);

      if (res.status === 201) {
        setMsg({
          title: 'Success',
          content: `${res.data.name} created!`,
        });
        const filteredDistribution = distribution
          .filter((item) => item.percentage !== 0)
          .map((item) => {
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
                distribution: filteredDistribution,
              },
            },
          },
          {
            contractAddr: GAME,
            msg: {
              add_game: {
                game_id: res.data.id.toString(),
                game_time_start: 2,
                duration: 2,
                whitelist: ['terra1h0mq6ktwrd0fgez5xrhwlcyf0p3w3nm94fc40j'],
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
        fetchGames();
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

  const fetchGames = async () => {
    setLoading(true);
    const res = await axiosInstance.get('/fantasy/game/new/');

    if (res.status === 200 && res.data.length > 0) {
      const data = [...res.data].sort(
        (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime)
      );
      setGames(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setDetails({
      name: '',
      start_datetime: '',
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

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <Container isAdmin>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
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
                  <p className="font-monument font-bold text-xl">UPCOMING GAMES</p>
                  {games.length > 0 &&
                    games.map(function (data, i) {
                      return (
                        <div className="border-b p-5 py-8">
                          <p className="font-bold text-lg">{data.name}</p>
                          <div className="flex justify-between">
                            <ReactTimeAgo
                              future
                              timeStyle="round-minute"
                              date={data.start_datetime}
                              locale="en-US"
                            />
                            <p>Prize: $ {data.prize}</p>
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
                        name="start_datetime"
                        onChange={(e) => onChange(e)}
                        value={details.start_datetime}
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

                    <div className="flex justify-start">
                      <button
                        className="bg-indigo-darkgray text-indigo-white w-5/6 md:w-48 h-10 text-center font-bold text-sm mt-4"
                        onClick={() => modifyRankList('add')}
                      >
                        Add New Rank
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
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
        </Main>
      </div>
      <BaseModal title={msg.title} visible={modal} onClose={() => setModal(false)}>
        <p className="mt-5">{msg.content}</p>
      </BaseModal>
      <BaseModal title={'Confirm'} visible={confirmModal} onClose={() => setConfirmModal(false)}>
        <p className="mt-5">Are you sure?</p>
        <button
          className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => {
            createGame();
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
    </Container>
  );
};

export default Index;
