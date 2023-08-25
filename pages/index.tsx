import Container from '../components/containers/Container';
import Main from '../components/Main';
import React, { useCallback, useEffect, useState } from 'react';
import PerformerContainer from '../components/containers/PerformerContainer';
import 'regenerator-runtime/runtime';
import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from 'react-icons/ai';
import {
  GET_ATHLETES_TOP,
  GET_SPORT_CURRENT_SEASON,
  GET_NFL_SEASON,
  GET_CRICKET_ATHLETES_TOP,
} from '../utils/queries';
import { useLazyQuery } from '@apollo/client';
import { store } from 'redux/athlete/store';
import { Provider } from 'react-redux';
import { SPORT_NAME_LOOKUP, SPORT_TYPES } from 'data/constants/sportConstants';
import { formatToUTCDate, getUTCTimestampFromLocal } from 'utils/date/helper';
let count = 0;

export default function Home(props) {
  const [sportList, setSportList] = useState(
    SPORT_TYPES.map((x) => ({ name: x.sport, key: x.key }))
  );
  const [currentSport, setCurrentSport] = useState('mlb'.toLocaleLowerCase());
  const [getAthletes, { loading, error, data }] = useLazyQuery(GET_ATHLETES_TOP);
  const [getCricketAthletes] = useLazyQuery(GET_CRICKET_ATHLETES_TOP);
  const [athletes, setAthletes] = useState([]);
  const [getSportCurrentSeason] = useLazyQuery(GET_SPORT_CURRENT_SEASON);
  const [getNflCurrentSeason] = useLazyQuery(GET_NFL_SEASON);
  const [nbaSeason, setNbaSeason] = useState('');
  const [nflSeason, setNflSeason] = useState('');
  const [mlbSeason, setMlbSeason] = useState('');
  const fetchTopAthletes = useCallback(
    async (nbaSeason, nflSeason, mlbSeason, currentSport) => {
      console.log(nflSeason);
      let query = await getAthletes({
        variables: {
          args: {
            filter: {
              sport: currentSport,
              statType: 'season',
            },
            pagination: {
              limit: 4,
              offset: 0,
            },
            sort: 'score',
          },
        },
      });
      if (currentSport === SPORT_NAME_LOOKUP.basketballKey) {
        console.log(nbaSeason);
        setAthletes(
          await Promise.all(
            query.data.getAthletes.map((element) => {
              return { ...element, stats: element.stats.filter((x) => x.season === nbaSeason) };
            })
          )
        );
      } else if (currentSport === SPORT_NAME_LOOKUP.footballKey) {
        setAthletes(
          await Promise.all(
            query.data.getAthletes.map((element) => {
              return { ...element, stats: element.stats.filter((x) => x.season === nflSeason) };
            })
          )
        );
      } else if (currentSport === SPORT_NAME_LOOKUP.baseballKey) {
        console.log('MLB Season:', mlbSeason);
        setAthletes(
          await Promise.all(
            query.data.getAthletes.map((element) => {
              return { ...element, stats: element.stats.filter((x) => x.season === mlbSeason) };
            })
          )
        );
        console.log('MLB Athletes:', athletes);
      }
      //
    },
    [loading]
  );

  const fetchCricketTopAthletes = useCallback(async () => {
    let query = await getCricketAthletes({
      variables: {
        args: {
          filter: {
            sport: 'cricket',
            statType: 'daily',
          },
          pagination: {
            limit: 4,
            offset: 0,
          },
          sort: 'score',
        },
      },
    });
    setAthletes(
      await Promise.all(
        query.data.getCricketAthletes.map((element) => {
          return { ...element, stats: element.stats };
        })
      )
    );
  }, [loading]);

  const fetchCurrentSeason = useCallback(async () => {
    let queryNba = await getSportCurrentSeason({
      variables: { sport: 'nba' },
    });
    let queryMlb = await getSportCurrentSeason({
      variables: { sport: 'mlb' },
    });
    setNbaSeason(await queryNba.data.getSportCurrentSeason.apiSeason);
    setMlbSeason(await queryMlb.data.getSportCurrentSeason.apiSeason);
    // setMlbSeason((await getSportCurrentSeason({
    //   variables: {sport: "nba"},
    // })).data.getSportCurrentSeason.apiSeason);
    //  setNbaSeason((await getSportCurrentSeason()).data.getSportCurrentSeason.apiSeason);
    await getNflCurrentSeason({
      variables: {
        startDate: formatToUTCDate(getUTCTimestampFromLocal()),
        endDate: formatToUTCDate(getUTCTimestampFromLocal() + 60 * 60 * 24 * 1000), // add 24 hours
      },
    }).then((query) => {
      console.log(query);
      setNflSeason(query.data.getNflSeason[0].apiSeason);
    });
  }, []);

  useEffect(() => {
    fetchCurrentSeason();
  }, []);

  useEffect(() => {
    if (nbaSeason.length > 0) {
      fetchTopAthletes(nbaSeason, nflSeason, mlbSeason, currentSport);
    }
  }, [nbaSeason, nflSeason, mlbSeason, currentSport]);

  useEffect(() => {
    if (currentSport === SPORT_NAME_LOOKUP.cricketKey) {
      fetchCricketTopAthletes();
    }
  }, [currentSport]);

  function getAvgFantasyScore(array) {
    let totalFantasy = 0;
    if (Array.isArray(array) && array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        if (obj.type === 'weekly') {
          totalFantasy += obj.fantasyScore;
        }
      }
      return totalFantasy / (array.length - 1);
    } else {
      return 0;
    }
  }

  const handleOnNextClick = () => {
    count = (count + 1) % featuredImagesMobile.length;
    setCurrentIndex(count);
  };
  const handleOnPrevClick = () => {
    const productsLength = featuredImagesMobile.length;
    count = (currentIndex + productsLength - 1) % productsLength;
    setCurrentIndex(count);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredImagesDesktop = [
    '/images/football_prize_money.jpg',
    '/images/BSBALL_CHAMPIONSHIP.png',
    '/images/baseball_starterpack_publicmint_desktop_updated.jpg',
    '/images/baseball_banner_live.jpg',
  ];

  const featuredImagesMobile = [
    '/images/football_prize_money.jpg',
    '/images/BSBALL_CHAMPIONSHIP.png',
    '/images/baseball_starterpack_publicmint_desktop_updated.jpg',
    '/images/baseball_banner_live.jpg',
  ];

  const startSlider = () => {
    setInterval(() => {
      handleOnNextClick();
    }, 4000);
  };

  useEffect(() => {
    startSlider();
  }, []);

  return (
    <Provider store={store}>
      <Container activeName="HOME">
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center text-indigo-black">
          <Main color="indigo-white">
            <div className="flex flex-col md:flex-row md:ml-12">
              <div className="md:w-2/3">
                <div className="md:mr-8">
                  <div className="w-12/13 relative select-none mx-2 mt-24 md:mt-0">
                    <img
                      className="object-fill h-48 w-full visible md:hidden rounded-lg"
                      src={featuredImagesMobile[currentIndex]}
                    />
                    <img
                      className="object-fit h-96 w-full hidden md:flex overflow-hidden rounded-lg"
                      src={featuredImagesDesktop[currentIndex]}
                    />

                    <div className="absolute w-full top-1/2 transform -translate-y-1/2 flex justify-between items-start px-3">
                      <button
                        className="bg-black text-indigo-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition"
                        onClick={handleOnPrevClick}
                      >
                        <AiOutlineVerticalRight size={35} />
                      </button>
                      <button
                        className="bg-black text-indigo-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition"
                        onClick={handleOnNextClick}
                      >
                        <AiOutlineVerticalLeft size={35} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg md:w-1/3 md:border md:border-indigo-slate md:p-6 md:mr-8 md:mt-0 mt-8 md:mb-4">
                <div className="ml-8 md:ml-0">
                  <div className="text-xl font-bold font-monument">TOP PERFORMERS test</div>
                  <div className="underlineBig" />
                </div>
                <div>
                  <form>
                    <select
                      onChange={(e) => {
                        setCurrentSport(e.target.value);
                      }}
                      className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white ring-2 ring-offset-8 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                        focus:outline-none cursor-pointer text-xs iphone5:ml-8 w-10/12 md:text-base mt-6 md:ml-10 md:mt-6 md:p-2 md:block lg:block"
                    >
                      {sportList.map((x) => {
                        return <option value={x.key.toLocaleLowerCase()}>{x.name}</option>;
                      })}
                    </select>
                  </form>
                </div>
                <div></div>
                {loading ? (
                  <div className="flex justify-center w-full mt-10">
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce mr-5"></div>
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce mr-5"></div>
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce"></div>
                  </div>
                ) : athletes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 mt-4 md:mt-8">
                    {athletes.map(function (
                      { firstName, lastName, name, id, nftImage, stats, isInjured, isActive },
                      i
                    ) {
                      return (
                        <div className="" key={i}>
                          <PerformerContainer
                            AthleteName={
                              currentSport !== SPORT_NAME_LOOKUP.cricketKey
                                ? `${firstName} ${lastName}`
                                : `${name}`
                            }
                            AvgScore={
                              currentSport !== SPORT_NAME_LOOKUP.cricketKey
                                ? stats.length == 1
                                  ? stats[0].fantasyScore.toFixed(2)
                                  : getAvgFantasyScore(stats).toFixed(2)
                                : parseFloat(stats[0]?.tournament_points).toFixed(2)
                            }
                            id={id}
                            uri={nftImage || null}
                            hoverable={false}
                            isActive={isActive}
                            isInjured={isInjured}
                            fromHome={true}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-indigo-lightgray font-monument mt-10 text-center">No Data</p>
                )}
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </Provider>
  );
}
