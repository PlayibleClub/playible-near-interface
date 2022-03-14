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
TimeAgo.addDefaultLocale(en);

const Index = (props) => {
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

    if (!details.name) {
      errors.push('Game is missing a title');
    }

    if (new Date(details.start_datetime) < new Date() || !details.start_datetime) {
      errors.push('Invalid Date & Time values');
    }

    if (distribution.length === 1 && percentTotal === 0) {
      errors.push('Invalid Distribution values');
    }

    console.log('errors', details.start_datetime, errors);

    return errors;
  };

  const createGame = async () => {
    if (checkValidity().length > 0) {
      alert(`Following errors: ${checkValidity().map((item) => ` \n❌ ${item}`)}`.replace(',', ''));
    } else {
      const formData = {
        ...details,
        duration: parseInt(details.duration),
      };

      setLoading(true);

      const res = await axiosInstance.post('/fantasy/game/', formData);

      if (res.status === 201) {
        setMsg({
          title: 'Success',
          content: `${res.data.name} created!`,
        });
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
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    const res = await axiosInstance.get('/fantasy/game/new/');
    console.log('res', res);
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
                  <p className='font-monument font-bold text-xl'>UPCOMING GAMES</p>
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
                        DURATION
                      </label>
                      <input
                        className="border outline-none rounded-lg px-3 p-2"
                        id="duration"
                        name="duration"
                        type="number"
                        min={1}
                        placeholder="Express in minutes"
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
                      onClick={createGame}
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
    </Container>
  );
};

export default Index;
