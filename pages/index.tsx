import Container from '../components/containers/Container';
import Main from '../components/Main';
import React, { useCallback, useEffect, useState } from 'react';
import underlineIcon from '../public/images/blackunderline.png';
import viewall from '../public/images/viewall.png';
import PrizePoolComponent from '../components/PrizePoolComponent';
import Link from 'next/link';
import MarketplaceContainer from '../components/containers/MarketplaceContainer';
import LargePackContainer from '../components/containers/LargePackContainer';
import filterIcon from '../public/images/filterBlack.png';
import PerformerContainer from '../components/containers/PerformerContainer';
import progressBar from '../public/images/progressbar.png';
import banner from '../public/images/promotionheader.png';
import bannerDesktop from '../public/images/promotionheaderDesktop.png';
import { axiosInstance } from '../utils/playible';
import 'regenerator-runtime/runtime';
import Head from 'next/head';
import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from 'react-icons/ai';
import { GET_ATHLETES_TOP } from '../utils/queries';
import { useLazyQuery, useQuery } from '@apollo/client';

let count = 0;

export default function Home(props) {
  const [activeGames, setActiveGames] = useState([]);
  const [topAthletes, setTopAthletes] = useState([]);
  const [athletesLoading, setAthletesLoading] = useState(true);
  // const { loading, error, data } = useQuery(GET_ATHLETES_TOP, {

  // });
  const [getAthletes, { loading, error, data }] = useLazyQuery(GET_ATHLETES_TOP);

  const fetchTopAthletes = useCallback(() => {
    getAthletes({
      variables: {
        args: {
          filter: {
            sport: 'nfl',
          },
          pagination: {
            limit: 4,
            offset: 0,
          },
          sort: 'score',
        },
      },
    });
  }, [loading]);

  useEffect(() => {
    fetchTopAthletes();
  }, []);

  async function fetchActiveGames() {
    const res = await axiosInstance.get(`/fantasy/game/active/?limit=2`);
    // if (res.status === 200) {
    //   setActiveGames(res.data.results);
    // }
    // const gqldata = await getAthlete({ variables: { getAthleteByIdId: 2163 } });
    // console.log(gqldata.data.getAthleteById);
  }

  const getImage = async (player) => {
    const imgRes = await axiosInstance.get(`/fantasy/athlete/${player.athlete.id}/`);

    return {
      ...player,
      nft_image: imgRes.status === 200 ? imgRes.data.nft_image : null,
    };
  };

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
    '/images/promotionheaderDesktop.png',
    'images/promotionheaderDesktop2.png',
  ];

  const featuredImagesMobile = ['/images/promotionheader.png', '/images/promotionheader2.png'];

  const startSlider = () => {
    setInterval(() => {
      handleOnNextClick();
    }, 5000);
  };

  useEffect(() => {
    // startSlider();
  }, []);

  return (
    <>
      <Head>
        <title>Playible - Next Generation of Sports Collectibles</title>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png" />
        {/* <meta name="description" content="Playible - Next Generation of Sports Collectibles" />
      <meta name="keywords" content="fantasy, sports, draft, crypto, cryptocurrency, play"/>

      <meta property="og:title" content="Playible - Next Generation of Sports Collectibles"/>
      <meta property="og:description" content="Playible - Next Generation of Sports Collectibles"/>
      <meta property="og:url" content="https://playible.io/"/>
      <meta property="og:type" content="website"/> */}
      </Head>
      <Container activeName="HOME">
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center md:pb-12 text-indigo-black">
          <Main color="indigo-white">
            <div className="flex flex-col md:flex-row md:ml-12">
              <div className="md:w-2/3">
                {/* <div className="flex flex-col md:border rounded-lg md:p-6 md:mr-8">
                <div className="flex">
                  <div className="ml-8 md:ml-0">
                    <div className="text-l font-bold font-monument">PLAYIBLE TOTAL VALUE</div>
                    <div className="text-3xl font-bold font-monument mt-2 whitespace-nowrap">
                      $ 1,750,990.00
                    </div>
                  </div>
                </div>
              </div> */}

                <div className="md:mr-8">
                  <div className="w-full relative select-none mx-2">
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

                {activeGames ? (
                  <>
                    <div className="flex flex-col md:border md:border-indigo-slate rounded-lg md:p-6 md:mr-8 mt-8">
                      <div className="flex items-center">
                        <div className="ml-8 md:ml-0">
                          <div className="text-xl font-bold font-monument">ACTIVE GAMES</div>
                          <img src={underlineIcon} className="mt-1" />
                        </div>
                        {activeGames.length > 0 ? (
                          <>
                            <Link href="/Play?type=active">
                              <a className="ml-12 md:ml-16 text-indigo-black underline text-xs font-bold md:mb-2">
                                VIEW ALL
                              </a>
                            </Link>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="flex flex-row md:grid-cols-2 gap-x-6 gap-y-6 mt-8 ml-8 md:ml-0 pr-8 overflow-x-auto">
                        {activeGames.length > 0 ? (
                          <>
                            {activeGames.map((data: any, i) => {
                              return (
                                <>
                                  <PrizePoolComponent
                                    icon={i.toString()}
                                    prizePool={data.prize}
                                    gameName={data.name}
                                    gameId={data.id}
                                  />
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <div>Contests opening soon...</div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>

              <div className="flex flex-col rounded-lg md:w-1/3 md:border md:border-indigo-slate md:p-6 md:mr-8 md:mt-0 mt-8 md:mb-4">
                <div className="ml-8 md:ml-0">
                  <div className="text-xl font-bold font-monument">TOP PERFORMERS</div>
                  <img src={underlineIcon} className="mt-1" />
                </div>

                {/* <div className="bg-indigo-white h-11 flex justify-between self-center font-thin w-72 mt-6 border-2 border-indigo-lightgray border-opacity-50">
                <div className="text-lg ml-4 mt-1.5 md:mb-1.5 text-indigo-black">
                  <form>
                    <select className="filter-select bg-white">
                      <option name="sevendays" value="sevendays">
                        Last 7 days
                      </option>
                      <option name="month" value="month">
                        Last month
                      </option>
                      <option name="year" value="year">
                        Last year
                      </option>
                    </select>
                  </form>
                </div>
                <img src={filterIcon} className="object-none w-4 mr-4" />
              </div> */}

                {loading ? (
                  <div className="flex justify-center w-full mt-10">
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce mr-5"></div>
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce mr-5"></div>
                    <div className="w-5 h-5 rounded-full bg-indigo-buttonblue animate-bounce"></div>
                  </div>
                ) : data?.getAthletes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 mt-8">
                    {data.getAthletes.map(function ({ firstName, lastName, id, nftImage }, i) {
                      return (
                        <div className="" key={i}>
                          <PerformerContainer
                            AthleteName={`${firstName} ${lastName}`}
                            AvgScore={500}
                            id={id}
                            uri={nftImage || null}
                            hoverable={false}
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
    </>
  );
}

// export const getServerSideProps = async () => {
//   let topPerformers = [];
//   const res = await axiosInstance.get('/fantasy/athlete/top_performers/?limit=4');
//
//   if (res.status === 200) {
//     topPerformers = res.data.results;
//   }
//
//   return {
//     props: {
//       topPerformers,
//     },
//   };
// };
