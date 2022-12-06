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
import { GAME, ORACLE } from '../../../data/constants/nearContracts';
import 'regenerator-runtime/runtime';
import { format } from 'prettier';
import { ADMIN } from '../../../data/constants/address';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { CREATE_GAME } from '../../../utils/mutations';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getContract, getRPCProvider } from 'utils/near';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getGameInfoById } from 'utils/game/helper';
import AdminGameComponent from './components/AdminGameComponent';
import moment from 'moment';
import { getUTCTimestampFromLocal } from 'utils/date/helper';
import ReactPaginate from 'react-paginate';
import { query_games_list, query_game_supply } from 'utils/near/helper';

TimeAgo.addDefaultLocale(en);

export default function Index(props) {
  const [createNewGame, { data, error }] = useMutation(CREATE_GAME);
  const { selector, accountId } = useWalletSelector();
  const connectedWallet = {};
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [gameType, setGameType] = useState('new');
  const [content, setContent] = useState(false);
  const [gameDuration, setGameDuration] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [gameIdToAdd, setGameIdToAdd] = useState(0);
  //gameinfo
  const [gameInfo, setGameInfo] = useState({});

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
      name: 'NEW',
      isActive: true,
    },
    {
      name: 'ON-GOING',
      isActive: false,
    },
    {
      name: 'COMPLETED',
      isActive: false,
    },
  ]);

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
  const [newGames, setNewGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [ongoingGames, setOngoingGames] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [gamesLimit, setGamesLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [gamesOffset, setGamesOffset] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [err, setErr] = useState(null);
  const [endLoading, setEndLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [msg, setMsg] = useState({
    title: '',
    content: '',
  });
  const [positionsInfo, setPositionsInfo] = useState([]);
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const [endMsg, setEndMsg] = useState({
    title: '',
    content: '',
  });

  const [percentTotal, setPercentTotal] = useState(0);
  const [remountComponent, setRemountComponent] = useState(0);
  const [remountPositionArea, setRemountPositionArea] = useState(0);
  const changeTab = (name) => {
    setGamesOffset(0);
    setGamesLimit(10);
    setRemountComponent(Math.random());
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
    setGamesOffset(0);
    setGamesLimit(10);
    setRemountComponent(Math.random());
    switch (name) {
      case 'NEW':
        setCurrentTotal(newGames.length);
        break;
      case 'ON-GOING':
        setCurrentTotal(ongoingGames.length);
        break;
      case 'COMPLETED':
        setCurrentTotal(completedGames.length);
        break;
    }
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
    if (e.target.name === 'positionAmount') {
      console.log(e.target.name, e.target.value);
      if (parseInt(e.target.value) > -1) {
        setDetails({
          ...details,
          [e.target.name]: parseInt(e.target.value),
        });
      }
    } else {
      setDetails({
        ...details,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handlePageClick = (event) => {
    const newOffset = (event.selected * gamesLimit) % currentTotal;
    setGamesOffset(newOffset);
  };
  const checkValidity = () => {
    let errors = [];
    let sortPercentage = [...distribution].sort((a, b) => b.percentage - a.percentage);
    // if (!Number.isInteger(details.duration)) {
    //   errors.push('Duration must be a positive integer that is expressed in days');
    // }

    // if (!details.name) {
    //   errors.push('Game is missing a title');
    // }

    // if (new Date(details.startTime) < new Date() || !details.startTime) {
    //   errors.push('Invalid Date & Time values');
    // }

    // if (new Date(details.endTime) > new Date(details.startTime) ) {
    //   errors.push('Invalid Date & Time values');
    // }

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

  const handleButtonClick = (e) => {
    e.preventDefault();
    //get current position and amount from details
    let position = [details['position']];
    let amount = details['positionAmount'];
    switch (position[0]) {
      case 'FLEX':
        position = ['RB', 'WR', 'TE'];
        break;
      case 'SUPERFLEX':
        position = ['QB', 'RB', 'WR', 'TE'];
        break;
    }
    let found = positionsInfo.findIndex((e) => e.positions.join() === position);
    console.log(found);

    if (positionsInfo.length === 0) {
      let object = { positions: position, amount: amount };
      setPositionsInfo([object]);
    }
    //could not find
    else if (found === -1) {
      let object = { positions: position, amount: amount };
      setPositionsInfo((current) => [...current, object]);
    } else {
      //found has index of same position
      let current = positionsInfo;
      //@ts-ignore:next-line
      current[found].amount += amount;
      setPositionsInfo(current);
    }
  };
  const NFL_POSITIONS = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPERFLEX'];
  const [details, setDetails] = useState({
    // name: '',
    startTime: '',
    endTime: '',
    prize: 1,
    usage: 1,
    description: '',
    position: NFL_POSITIONS[0],
    positionAmount: 1,
  });

  const nflPositions = [
    { positions: ['QB'], amount: 1 },
    { positions: ['RB'], amount: 2 },
    { positions: ['WR'], amount: 2 },
    { positions: ['TE'], amount: 1 },
    { positions: ['RB', 'WR', 'TE'], amount: 1 },
    { positions: ['QB', 'RB', 'WR', 'TE'], amount: 1 },
  ];
  const dateStartFormatted = moment(details.startTime).format('YYYY-MM-DD HH:mm:ss');
  const dateStart = moment(dateStartFormatted).utc().unix() * 1000;
  const dateEndFormatted = moment(details.endTime).format('YYYY-MM-DD HH:mm:ss');
  const dateEnd = moment(dateEndFormatted).utc().unix() * 1000;

  const startFormattedTimestamp = moment(dateStartFormatted).toLocaleString();
  const endFormattedTimestamp = moment(dateEndFormatted).toLocaleString();

  async function get_game_supply() {
    setTotalGames(await query_game_supply());
  }

  function get_games_list(totalGames) {
    query_games_list(totalGames).then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());

      const upcomingGames = await Promise.all(
        result
          .filter((x) => x[1].start_time > getUTCTimestampFromLocal())
          .map((item) => getGameInfoById(item))
      );

      const completedGames = await Promise.all(
        result
          .filter((x) => x[1].end_time < getUTCTimestampFromLocal())
          .map((item) => getGameInfoById(item))
      );

      const ongoingGames = await Promise.all(
        result
          .filter(
            (x) =>
              x[1].start_time < getUTCTimestampFromLocal() &&
              x[1].end_time > getUTCTimestampFromLocal()
          )
          .map((item) => getGameInfoById(item))
      );
      console.table(completedGames);
      setCurrentTotal(upcomingGames.length);
      setNewGames(upcomingGames);
      setCompletedGames(completedGames);
      setOngoingGames(ongoingGames);
    });
  }

  async function execute_add_game() {
    const addGameArgs = Buffer.from(
      JSON.stringify({
        game_id: (totalGames + 1).toString(),
        game_time_start: dateStart,
        game_time_end: dateEnd,
        usage_cost: Number(details.usage),
        whitelist: null,
        positions: nflPositions,
        lineup_len: 8,
      })
    );

    const action_add_game = {
      type: 'FunctionCall',
      params: {
        methodName: 'add_game',
        args: addGameArgs,
        gas: DEFAULT_MAX_FEES,
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: getContract(GAME),
          // @ts-ignore:next-line
          actions: [action_add_game],
        },
      ],
    });
  }

  useEffect(() => {
    getTotalPercent();
  }, [distribution]);
  useEffect(() => {
    console.log(positionsInfo);
  }, [positionsInfo]);
  useEffect(() => {
    get_games_list(totalGames);
    get_game_supply();
  }, [totalGames]);
  useEffect(() => {
    currentTotal !== 0 ? setPageCount(Math.ceil(currentTotal / gamesLimit)) : setPageCount(1);
  }, [currentTotal]);

  return (
    <Container isAdmin>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-indigo-black">
            <div className="flex md:ml-4 font-bold font-monument mt-5">
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
                <div className="flex flex-col">
                  <div className="flex font-bold -ml-16 font-monument">
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
                  <div className="mt-4 ml-6 grid grid-cols-0 md:grid-cols-3">
                    {(gameTabs[0].isActive
                      ? newGames
                      : gameTabs[1].isActive
                      ? ongoingGames
                      : completedGames
                    ).length > 0 &&
                      (gameTabs[0].isActive
                        ? newGames
                        : gameTabs[1].isActive
                        ? ongoingGames
                        : completedGames
                      )
                        .filter((data, i) => i >= gamesOffset && i < gamesOffset + gamesLimit)
                        .map((data, i) => {
                          return (
                            <div key={i}>
                              <AdminGameComponent
                                game_id={data.game_id}
                                start_time={data.start_time}
                                end_time={data.end_time}
                                whitelist={data.whitelist}
                                positions={data.positions}
                                lineup_len={data.lineup_len}
                                joined_player_counter={data.joined_player_counter}
                                joined_team-counter={data.joined_team_counter}
                                type="upcoming"
                                isCompleted={data.isCompleted}
                                status={data.status}
                              />
                            </div>
                          );
                        })}
                    {/* {(gameTabs[0].isActive ? upcomingGames: completedGames).length > 0 &&
                          (gameTabs[0].isActive ? upcomingGames : completedGames).map(function (data, i) {
                            return(
                              
                            )
                            // return (
                            //   <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                            //     {data.whitelist}
                            //   </div>
                            //   // <div className="border-b p-5 py-8">
                            //   //   <div className="flex justify-between">
                            //   //     <div>
                            //   //       <p className="font-bold text-lg">{data.name}</p>
                            //   //       {gameTabs[0].isActive ? (
                            //   //         <ReactTimeAgo
                            //   //           future
                            //   //           timeStyle="round-minute"
                            //   //           date={data.startTime}
                            //   //           locale="en-US"
                            //   //         />
                            //   //       ) : (
                            //   //         ''
                            //   //       )}
                            //   //       <p>Prize: $ {data.prize}</p>
                            //   //     </div>
                            //   //     {gameTabs[0].isActive ? (
                            //   //       ''
                            //   //     ) : (
                            //   //       <div>
                            //   //         <button
                            //   //           className="bg-indigo-green font-monument tracking-widest  text-indigo-white w-5/6 md:w-64 h-16 text-center text-sm"
                            //   //           onClick={() => {
                            //   //             setGameId(data.id);
                            //   //             setEndModal(true);
                            //   //           }}
                            //   //         >
                            //   //           END GAME
                            //   //         </button>
                            //   //       </div>
                            //   //     )}
                            //   //   </div>
                            //   // </div>
                            // );
                          })} */}
                  </div>
                  <div className="absolute bottom-10 right-10 iphone5:bottom-4 iphone5:right-2 iphoneX:bottom-4 iphoneX:right-4 iphoneX-fixed">
                    <div key={remountComponent}>
                      <ReactPaginate
                        className="p-2 text-center bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
                        pageClassName="hover:font-bold"
                        activeClassName="rounded-lg text-center bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
                        pageLinkClassName="rounded-lg text-center hover:font-bold hover:bg-indigo-white hover:text-indigo-black"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex">
                    {/* GAME TITLE */}
                    {/* <div className="flex flex-col lg:w-1/2 lg:mr-10">
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
                        </div> */}

                    {/* DATE & TIME */}
                    <div className="flex flex-col lg:w-1/2">
                      <label className="font-monument" htmlFor="datetime">
                        START TIME
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
                      <label className="font-monument" htmlFor="datetime">
                        END TIME
                      </label>
                      <input
                        className="border outline-none rounded-lg px-3 p-2"
                        id="datetime"
                        type="datetime-local"
                        name="endTime"
                        onChange={(e) => onChange(e)}
                        value={details.endTime}
                      />
                    </div>

                    {/* USAGE COST */}
                    <div className="flex flex-col lg:w-1/2">
                      <label className="font-monument" htmlFor="usage">
                        USAGE COST
                      </label>
                      <input
                        className="border outline-none rounded-lg px-3 p-2"
                        type="number"
                        id="usage"
                        name="usage"
                        pattern="[0-9]*"
                        placeholder="Enter usage cost"
                        onChange={(e) => onChange(e)}
                        value={details.usage}
                      />
                    </div>

                    {/* PRIZE */}
                    {/* <div className="flex flex-col lg:w-1/2">
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
                    </div> */}
                  </div>

                  <div className="flex mt-8">
                    {/* DESCRIPTION */}
                    <div className="flex flex-col w-1/2">
                      <label className="font-monument" htmlFor="duration">
                        WHITELIST
                      </label>
                      <textarea
                        className="border outline-none rounded-lg px-3 p-2"
                        id="description"
                        name="description"
                        // type="text"
                        placeholder="Enter accounts to whitelist. One account per line. Leave empty for no whitelist."
                        onChange={(e) => onChange(e)}
                        value={details.description}
                        style={{
                          minHeight: '120px',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex mt-8">
                    {/* POSITIONS */}
                    <div className="flex flex-col w-1/2">
                      <label className="font-monument" htmlFor="positions">
                        POSITIONS
                      </label>
                      <form>
                        <select
                          className="bg-filter-icon bg-no-repeat bg-origin-content bg-right bg-indigo-white iphone5:w-28 w-36 md:w-42 lg:w-60
                          ring-indigo-black focus:outline-none cursor-pointer rounded-lg text-xs md:text-base mr-4 border outline-none px-3 p-2"
                          name="position"
                          onChange={(e) => onChange(e)}
                        >
                          {NFL_POSITIONS.map((x) => {
                            return <option value={x}>{x}</option>;
                          })}
                        </select>
                        <input
                          className="border outline-none rounded-lg px-3 p-2 w-24 mr-4"
                          type="number"
                          id="positionAmount"
                          name="positionAmount"
                          pattern="[0-9]*"
                          placeholder="Enter position amount"
                          onChange={(e) => onChange(e)}
                          value={details.positionAmount}
                        />
                        <button
                          className="border outline-none rounded-lg px-3 p-2"
                          onClick={(e) => handleButtonClick(e)}
                        >
                          +
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="flex mt-8">
                    <div className="flex flex-col w-1/2">
                      <div
                        key={remountPositionArea}
                        className="border outline-none rounded-lg px-3 p-2"
                      ></div>
                    </div>
                  </div>

                  {/* DISTRIBUTION FORM */}
                  {/* <div className="mt-8">
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
                              // onClick={}
                            >
                              Add New Rank
                            </button>
                          </div>
                        ) : (
                          ''
                        )}
                      </div> */}

                  <div className="flex mt-4 mb-10">
                    <button
                      className="bg-indigo-green font-monument tracking-widest text-indigo-white w-5/6 md:w-80 h-16 text-center text-sm mt-4"
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
        <p className="mt-2">Are you sure?</p>
        <p className="font-bold">GAME DETAILS:</p>
        <p className="font-bold">Start Date:</p> {startFormattedTimestamp}
        <p className="font-bold">End Date:</p> {endFormattedTimestamp}
        <p className="font-bold">Usage Cost:</p> {details.usage}
        <button
          className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
          onClick={() => {
            execute_add_game();
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
}

// export async function getServerSideProps(ctx) {
//   return {
//     redirect: {
//       destination: '/Portfolio',
//       permanent: false,
//     },
//   };
// }
