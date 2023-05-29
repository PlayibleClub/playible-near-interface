import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Link from 'next/link';
import PlayComponent from './components/PlayComponent';
import Container from '../../components/containers/Container';
import 'regenerator-runtime/runtime';
import { getGameInfoById } from 'utils/game/helper';
import { getUTCTimestampFromLocal } from 'utils/date/helper';
import ReactPaginate from 'react-paginate';
import { SPORT_NAME_LOOKUP, SPORT_TYPES, getSportType } from 'data/constants/sportConstants';
import { query_games_list, query_game_supply } from 'utils/near/helper';
import { useWalletSelector } from 'contexts/WalletSelectorContext';

const Play = (props) => {
  const { accountId } = useWalletSelector();
  const [activeCategory, setCategory] = useState('NEW');
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [gamesLimit, setgamesLimit] = useState(10);
  const [totalGames, setTotalGames] = useState(0);
  const [gamesOffset, setgamesOffset] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [categoryList, setcategoryList] = useState([
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

  const sportObj = [
    { name: 'ALL', isActive: true },
    ...SPORT_TYPES.map((x) => ({ name: x.sport, isActive: false })),
  ];
  sportObj[0].isActive = true;
  const [sportList, setSportList] = useState([...sportObj]);
  const [currentSport, setCurrentSport] = useState('CRICKET');
  const [remountComponent, setRemountComponent] = useState(0);

  function getActiveTabGameTotal() {
    const active = categoryList.find((x) => x.isActive);

    switch (active.name) {
      case 'NEW':
        setCurrentTotal(sportList[0].isActive ? allNew.length : newGames.length);
        break;
      case 'ON-GOING':
        setCurrentTotal(sportList[0].isActive ? allGoing.length : ongoingGames.length);
        break;
      case 'COMPLETED':
        setCurrentTotal(completedGames.length);
        break;
    }
  }

  const changecategoryList = (name) => {
    const tabList = [...categoryList];
    setgamesOffset(0);
    setgamesLimit(10);
    setRemountComponent(Math.random());
    let prevSport = [...sportList];
    const all = prevSport.find((sport) => sport.name === 'ALL');
    switch (name) {
      case 'NEW':
        if (!all) {
          prevSport.unshift({ name: 'ALL', isActive: false });
        }
        setSportList(prevSport);
        setCurrentTotal(newGames.length);
        break;
      case 'ON-GOING':
        if (!all) {
          prevSport.unshift({ name: 'ALL', isActive: false });
        }
        setSportList(prevSport);
        setCurrentTotal(ongoingGames.length);
        break;
      case 'COMPLETED':
        prevSport = prevSport.filter((sport) => sport.name !== 'ALL');
        const prevIndex = prevSport.findIndex((sport) => sport.isActive);
        if (prevIndex > 0) {
          prevSport.forEach((sport, index) => {
            sport.isActive = index === prevIndex;
          });
        } else {
          prevSport.forEach((sport, index) => {
            sport.isActive = index === 0;
          });
        }
        setSportList(prevSport);
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

    setcategoryList([...tabList]);
  };

  const changeSportList = (name) => {
    const sports = [...sportList];

    sports.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    if (name === 'ALL') {
      setCurrentSport((prevSport) => prevSport);
    } else {
      setCurrentSport((prevSport) => {
        setOffset(0);
        setgamesOffset(0);
        setgamesLimit(10);
        setRemountComponent(Math.random());
        return name;
      });
    }
    setSportList([...sports]);
  };

  const [footballNew, setFootballNew] = useState([]);
  const [basketballNew, setBasketballNew] = useState([]);
  const [baseballNew, setBaseballNew] = useState([]);
  const [cricketNew, setCricketNew] = useState([]);
  const [footballGoing, setFootballGoing] = useState([]);
  const [basketballGoing, setBasketballGoing] = useState([]);
  const [baseballGoing, setBaseballGoing] = useState([]);
  const [cricketGoing, setCricketGoing] = useState([]);
  const allGoing = [...cricketGoing, ...baseballGoing, ...basketballGoing, ...footballGoing];
  const allNew = [...cricketNew, ...baseballNew, ...basketballNew, ...footballNew];
  const [newGames, setNewGames] = useState([]);
  const [ongoingGames, setOngoingGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [emptyGames, setEmpyGames] = useState([]);

  const changeIndex = (index) => {
    switch (index) {
      case 'next':
        setOffset(offset + 1);
        break;
      case 'previous':
        setOffset(offset - 1);
        break;
      case 'first':
        setOffset(0);
        break;
      case 'last':
        setOffset(pageCount - 1);
        break;

      default:
        break;
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * gamesLimit) % currentTotal;
    console.log(newOffset);
    setgamesOffset(newOffset);
  };

  async function get_game_supply() {
    let totalGames = 0;
    const sports = [
      SPORT_NAME_LOOKUP.football,
      SPORT_NAME_LOOKUP.basketball,
      SPORT_NAME_LOOKUP.baseball,
      SPORT_NAME_LOOKUP.cricket,
    ];

    await Promise.all(
      sports.map(async (sport) => {
        const result = await query_game_supply(getSportType(sport).gameContract);
        totalGames += Number(result);
      })
    );

    setTotalGames(totalGames);
  }

  console.log(totalGames);

  function get_games_list(totalGames) {
    query_games_list(totalGames, getSportType(currentSport).gameContract).then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());

      const upcomingGames = await Promise.all(
        result
          .filter((x) => x[1].start_time > getUTCTimestampFromLocal())
          .map((item) => getGameInfoById(accountId, item, 'new', currentSport))
      );

      const completedGames = await Promise.all(
        result
          .filter((x) => x[1].end_time < getUTCTimestampFromLocal())
          .map((item) => getGameInfoById(accountId, item, 'completed', currentSport))
      );

      const ongoingGames = await Promise.all(
        result
          .filter(
            (x) =>
              x[1].start_time < getUTCTimestampFromLocal() &&
              x[1].end_time > getUTCTimestampFromLocal()
          )
          .map((item) => getGameInfoById(accountId, item, 'on-going', currentSport))
      );
      upcomingGames.sort(function (a, b) {
        return a.start_time - b.start_time;
      });
      setNewGames(upcomingGames);
      setCompletedGames(completedGames);
      setOngoingGames(ongoingGames);
      console.log(ongoingGames);
    });
  }

  function get_all_games_list(totalGames) {
    const sports = [
      SPORT_NAME_LOOKUP.cricket,
      SPORT_NAME_LOOKUP.football,
      SPORT_NAME_LOOKUP.basketball,
      SPORT_NAME_LOOKUP.baseball,
    ];

    sports.forEach((sport) => {
      const gameContract = getSportType(sport).gameContract;
      query_games_list(totalGames, gameContract).then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());

        const upcomingGames = await Promise.all(
          result
            .filter((x) => x[1].start_time > getUTCTimestampFromLocal())
            .map((item) => getGameInfoById(accountId, item, 'new', sport))
        );

        const ongoingGames = await Promise.all(
          result
            .filter(
              (x) =>
                x[1].start_time < getUTCTimestampFromLocal() &&
                x[1].end_time > getUTCTimestampFromLocal()
            )
            .map((item) => getGameInfoById(accountId, item, 'on-going', sport))
        );

        upcomingGames.sort(function (a, b) {
          return a.start_time - b.start_time;
        });

        switch (sport) {
          case SPORT_NAME_LOOKUP.cricket:
            setCricketNew(upcomingGames);
            setCricketGoing(ongoingGames);
            break;
          case SPORT_NAME_LOOKUP.football:
            setFootballNew(upcomingGames);
            setFootballGoing(ongoingGames);
            break;
          case SPORT_NAME_LOOKUP.basketball:
            setBasketballNew(upcomingGames);
            setBasketballGoing(ongoingGames);
            break;
          case SPORT_NAME_LOOKUP.baseball:
            setBaseballNew(upcomingGames);
            setBaseballGoing(ongoingGames);
            break;
          default:
            break;
        }
      });
    });
  }

  useEffect(() => {
    console.log(sportList);
    get_game_supply();
    get_games_list(totalGames);
    get_all_games_list(totalGames);
  }, [totalGames, currentSport, sportList]);

  useEffect(() => {
    getActiveTabGameTotal();
  }, [newGames, ongoingGames, completedGames, allNew, allGoing]);
  useEffect(() => {
    currentTotal !== 0 ? setPageCount(Math.ceil(currentTotal / gamesLimit)) : setPageCount(1);
  }, [currentTotal]);

  return (
    <>
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center">
          <Main color="indigo-white">
            <div className="flex flex-col mb-10">
              <div className="flex">
                <div className="flex-initial md:ml-6 md:mt-8 iphone5:mt-20">
                  <PortfolioContainer title="PLAY" textcolor="text-indigo-black" />
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <div className="flex font-bold md:ml-14 font-monument iphone5:ml-7">
                  {categoryList.map(({ name, isActive }) => (
                    <div
                      className={`cursor-pointer iphone5:mr-8 iphone5:text-xs md:text-base md:mr-6 ${
                        isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                      }`}
                      onClick={() => {
                        changecategoryList(name);
                        setCategory(name);
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
                <hr className="opacity-10" />
                <div className="flex iphone5:ml-7 flex-row first:md:ml-14 overflow-y-auto no-scrollbar">
                  {sportList.map((x, index) => {
                    return (
                      <button
                        className={`rounded-lg border mt-4 iphone5:mr-2 md:mr-0 px-8 p-1 text-xs md:font-medium font-monument ${
                          index === 0 ? `md:ml-14` : 'md:ml-4'
                        } ${
                          x.isActive
                            ? 'bg-indigo-buttonblue text-indigo-white border-indigo-buttonblue'
                            : ''
                        }`}
                        onClick={() => {
                          changeSportList(x.name);
                        }}
                      >
                        {x.name}
                      </button>
                    );
                  })}
                </div>
                {currentTotal > 0 ? (
                  <>
                    <div className="mt-4 md:ml-10 grid grid-cols-0 md:grid-cols-3 iphone5:self-center md:self-start">
                      {(sportList[0].isActive
                        ? categoryList[0].isActive
                          ? allNew
                          : newGames
                        : categoryList[0].isActive
                        ? newGames
                        : emptyGames
                      ).length > 0 &&
                        (sportList[0].isActive
                          ? categoryList[0].isActive
                            ? allNew
                            : emptyGames
                          : categoryList[0].isActive
                          ? newGames
                          : emptyGames
                        )
                          .filter((data, i) => i >= gamesOffset && i < gamesOffset + gamesLimit)
                          .map((data, i) => {
                            const currentSportIndex = sportList[0].isActive
                              ? allNew.findIndex((game) => game.sport === data.sport)
                              : allGoing.findIndex((game) => game.sport === allGoing[0].sport);
                            return (
                              <div key={i} className="flex">
                                <div className="iphone5:mr-0 md:mr-6 cursor-pointer">
                                  <Link
                                    href={`/PlayDetails/${
                                      sportList[0].isActive
                                        ? allNew[currentSportIndex].sport.toLowerCase()
                                        : currentSport
                                    }/${data.game_id}`}
                                    passHref
                                  >
                                    <div className="iphone5:mr-0 md:mr-6">
                                      <PlayComponent
                                        type={activeCategory}
                                        game_id={data.game_id}
                                        icon="test"
                                        startDate={data.start_time}
                                        endDate={data.end_time}
                                        img={data.game_image}
                                        lineupLength={data.lineup_len}
                                        sport={data.sport}
                                        prizePool={data.prize_description}
                                        index={() => changeIndex(1)}
                                      />
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                    <div className="mt-4 md:ml-10 grid grid-cols-0 md:grid-cols-3 iphone5:self-center md:self-start">
                      {sportList[0].isActive
                        ? (categoryList[1].isActive
                            ? allGoing
                            : categoryList[2].isActive
                            ? completedGames
                            : emptyGames
                          ).length > 0 &&
                          (categoryList[1].isActive
                            ? allGoing
                            : categoryList[2].isActive
                            ? completedGames
                            : emptyGames
                          )
                            .filter((data, i) => i >= gamesOffset && i < gamesOffset + gamesLimit)
                            .map((data, i) => {
                              const currentSportIndex = allGoing.findIndex(
                                (game) => game.sport === data.sport
                              );
                              console.log(currentTotal);
                              return (
                                <div key={i} className="flex">
                                  <div className="iphone5:mr-0 md:mr-6 cursor-pointer">
                                    <Link
                                      href={`/Games/${allGoing[
                                        currentSportIndex
                                      ]?.sport.toLowerCase()}/${data.game_id}`}
                                      passHref
                                    >
                                      <div className="iphone5:mr-0 md:mr-6">
                                        <PlayComponent
                                          type={activeCategory}
                                          game_id={data.game_id}
                                          icon="test"
                                          prizePool={data.prize_description}
                                          startDate={data.start_time}
                                          endDate={data.end_time}
                                          img={data.game_image}
                                          sport={data.sport}
                                          hasEntered={data.user_team_count.team_names?.length}
                                          index={() => changeIndex(1)}
                                        />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              );
                            })
                        : (categoryList[1].isActive
                            ? ongoingGames
                            : categoryList[2].isActive
                            ? completedGames
                            : emptyGames
                          ).length > 0 &&
                          (categoryList[1].isActive
                            ? ongoingGames
                            : categoryList[2].isActive
                            ? completedGames
                            : emptyGames
                          )
                            .filter((data, i) => i >= gamesOffset && i < gamesOffset + gamesLimit)
                            .map((data, i) => {
                              console.log(currentTotal);
                              return (
                                <div key={i} className="flex">
                                  <div className="iphone5:mr-0 md:mr-6 cursor-pointer">
                                    <Link href={`/Games/${currentSport}/${data.game_id}`} passHref>
                                      <div className="iphone5:mr-0 md:mr-6">
                                        <PlayComponent
                                          type={activeCategory}
                                          game_id={data.game_id}
                                          icon="test"
                                          prizePool={data.prize_description}
                                          startDate={data.start_time}
                                          endDate={data.end_time}
                                          img={data.game_image}
                                          sport={data.sport}
                                          hasEntered={data.user_team_count.team_names?.length}
                                          index={() => changeIndex(1)}
                                        />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              );
                            })}
                    </div>
                  </>
                ) : (
                  <>
                    {sportList[0].isActive ? (
                      <div className="iphone5:ml-7 md:ml-14 mt-7 text-xl font-bold">
                        There are no games to be displayed
                      </div>
                    ) : (
                      <div className="iphone5:ml-7 md:ml-14 mt-7 text-xl font-bold">
                        There are no{' '}
                        {activeCategory.toLowerCase() + ' ' + currentSport.toLowerCase()} games to
                        be displayed
                      </div>
                    )}
                  </>
                )}
                <div className="absolute md:bottom-4 right-10 iphone5:bottom-16 iphone5:right-2 iphoneX:bottom-16 iphoneX:right-4 iphoneX-fixed">
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
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
};
export default Play;
