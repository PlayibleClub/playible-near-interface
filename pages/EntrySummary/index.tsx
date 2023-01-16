import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { useRouter } from 'next/router';
import PlayDetailsComponent from '../PlayDetails/components/PlayDetailsComponent';
import { axiosInstance } from '../../utils/playible';
import moment from 'moment';
import Link from 'next/link';
import PerformerContainer from '../../components/containers/PerformerContainer';
import 'regenerator-runtime/runtime';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import {
  convertNftToAthlete,
  getAthleteInfoById,
  getAthleteInfoByIdWithDate,
} from 'utils/athlete/helper';
import { getNflSeason, getNflWeek, getUTCDateFromLocal } from 'utils/date/helper';
import { useSelector } from 'react-redux';
import { selectTeamName, selectAccountId, selectGameId, getSport2 } from 'redux/athlete/teamSlice';
import {
  query_game_data,
  query_nft_tokens_by_id,
  query_nft_tokens_for_owner,
  query_nft_token_by_id,
} from 'utils/near/helper';
import { cutAddress } from 'utils/address/helper';
import EntrySummaryBack from 'components/buttons/EntrySummaryBack';
import { getSportType, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
export default function EntrySummary(props) {
  const { query } = props;
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const router = useRouter();
  const accountId = useSelector(selectAccountId);
  const playerTeamName = useSelector(selectTeamName);
  const currentSport = useSelector(getSport2);
  const [name, setName] = useState('');
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [team, setTeam] = useState([]);
  const [gameEnd, setGameEnd] = useState(false);
  const [remountComponent, setRemountComponent] = useState(0);
  const gameId = useSelector(selectGameId);
  const [playerLineup, setPlayerLineup] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [nflSeason, setNflSeason] = useState('');
  const [week, setWeek] = useState(0);

  // const { error } = props;
  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(error);

  // const fetchGameData = async () => {
  //   const res = await axiosInstance.get(`/fantasy/game/${router.query.game_id}/`);

  //   const allTeams = router.query.team_id
  //     ? await axiosInstance.get(`/fantasy/game_team/${router.query.team_id}/`)
  //     : await axiosInstance.get(
  //         `/fantasy/game/${router.query.game_id}/registered_teams_detail/?wallet_addr=`
  //       );

  //   if (allTeams.status === 200) {
  //     if (router.query.team_id) {
  //       setTeam([allTeams.data]);
  //     } else {
  //       setTeam(allTeams.data);
  //     }
  //   }

  //   if (res.status === 200) {
  //     setGameData(res.data);
  //   }
  // };

  // function gameEnded() {
  //   setGameEnd(true);
  // }

  // useEffect(() => {
  //   if (router && router.query.game_id && connectedWallet) {
  //     fetchGameData();
  //     setGameEnd(false);
  //   }
  // }, [router, connectedWallet, gameEnd]);

  // useEffect(async () => {
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
  //     setTeam([]);
  //     setLoading(false);
  //   }
  // }, [connectedWallet]);

  if (!router) {
    return;
  }

  function query_player_team_lineup() {
    const startTimeFormatted = moment(gameData?.start_time).format('YYYY-MM-DD');
    const endTimeFormatted = moment(gameData?.end_time).format('YYYY-MM-DD');
    const query = JSON.stringify({
      account: accountId,
      game_id: gameId,
      team_id: playerTeamName,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const playerTeamLineup = JSON.parse(Buffer.from(data.result).toString());

        let itemToReturn = {
          accountId: accountId,
          teamName: playerTeamName,
          lineup: playerTeamLineup.lineup,
          sumScore: 0,
        };

        itemToReturn.lineup = await Promise.all(
          itemToReturn.lineup.map((item) => {
            return query_nft_token_by_id(item, currentSport, startTimeFormatted, endTimeFormatted);
          })
        );
        console.log(itemToReturn.lineup);
        itemToReturn.lineup = itemToReturn.lineup.map((lineupItem) => {
          return {
            ...lineupItem,
            stats_breakdown:
              lineupItem.stats_breakdown
                .filter((statType) =>
                  currentSport === SPORT_NAME_LOOKUP.football
                    ? statType.type == 'weekly' &&
                      statType.played == 1 &&
                      statType.week == week &&
                      statType.season == nflSeason
                    : currentSport === SPORT_NAME_LOOKUP.basketball
                    ? statType.type == 'daily' && statType.played == 1
                    : ''
                )
                .map((item) => {
                  console.log(
                    'fs ' +
                      item.fantasyScore +
                      ' from ' +
                      lineupItem.name +
                      ' w/ date ' +
                      item.gameDate
                  );
                  console.log('playible start: ' + startTimeFormatted);
                  return item.fantasyScore;
                })[0] || 0,
          };
        });

        itemToReturn.sumScore = itemToReturn.lineup.reduce((accumulator, object) => {
          return accumulator + object.stats_breakdown;
        }, 0);

        setPlayerLineup((playerLineup) => [...playerLineup, itemToReturn]);
      });
  }

  // async function get_nft_tokens_for_owner() {
  //   const startTimeFormatted = moment(gameData?.start_time).format('YYYY-MM-DD');
  //   const endTimeFormatted = moment(gameData?.end_time).format('YYYY-MM-DD');
  //   playerLineup.forEach((token_id) => {
  //     //check if token_id contains sb, then query with soulbound contract
  //     let contract = token_id.includes('SB')
  //       ? getSportType(currentSport).promoContract
  //       : getSportType(currentSport).regContract;
  //     query_nft_tokens_by_id(token_id, contract).then(async (data) => {
  //       // @ts-ignore:next-line
  //       const result = JSON.parse(Buffer.from(data.result).toString());
  //       const result_two =
  //         // currentSport === 'FOOTBALL'
  //         //   ? await getAthleteInfoById(await convertNftToAthlete(result)) :
  //         await getAthleteInfoByIdWithDate(
  //           await convertNftToAthlete(result),
  //           startTimeFormatted,
  //           endTimeFormatted
  //         );
  //       await setAthletes((athletes) => [...athletes, result_two]);
  //     });
  //   });
  // }

  async function get_game_data(gameId) {
    setGameInfo(await query_game_data(gameId, getSportType(currentSport).gameContract));
    setGameData(await query_game_data(gameId, getSportType(currentSport).gameContract));
  }

  const gameStart = Object.values(gameInfo)[0] / 1000;
  console.log('nfl week: ' + week);

  async function get_game_week() {
    setWeek(await getNflWeek(gameStart));
    setNflSeason(await getNflSeason(gameStart));
  }

  useEffect(() => {
    get_game_data(gameId);
  }, []);

  useEffect(() => {
    get_game_week();
  });

  useEffect(() => {
    console.log('loading lineup...');
    // query_player_team_lineup();
    console.log('loading athletes...');
  }, [playerLineup]);

  useEffect(() => {
    // if (playerLineup.length > 0 && athletes.length === 0) {
    if (gameData !== undefined && gameData !== null) {
      // get_nft_tokens_for_owner();
      query_player_team_lineup();
      console.log('wahahaha');
    }
  }, [gameData]);

  return (
    <>
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <>
              <>
                <div className="mt-8 md:ml-6">
                  <EntrySummaryBack />
                </div>
                <div className="md:ml-7 flex flex-row md:flex-row">
                  <div className="md:mr-12">
                    <div className="mt-11 flex flex-col md:flex-row justify-center md:self-left md:mr-8 md:ml-6">
                      <div className="w-auto mr-6 ml-6">
                        <Image
                          src={
                            gameData?.game_image
                              ? gameData?.game_image
                              : 'https://playible-game-image.s3.ap-southeast-1.amazonaws.com/game.png'
                          }
                          width={550}
                          height={279}
                          alt="game-image"
                        />
                      </div>
                      <div className="-mt-7 md:ml-7">
                        <PortfolioContainer textcolor="indigo-black" title="ENTRY SUMMARY" />
                        <div className="flex md:space-x-14 mt-4 ">
                          <div className="ml-6 md:ml-7">
                            <div>PRIZE POOL</div>
                            <div className=" font-monument text-lg">
                              {(gameData && gameData.prize_description) ||
                                '$100 + 2 Championship Tickets'}
                            </div>
                          </div>
                          <div className="mr-4 md:mr-0">
                            <div>START DATE</div>
                            <div className=" font-monument text-lg">
                              {(gameData && moment(gameData.start_time).format('MM/DD/YYYY')) ||
                                'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="ml-7">
                          <div className="mt-4">
                            {gameData &&
                              (moment(gameData.start_time) <= moment() &&
                              moment(gameData.end_time) > moment() ? (
                                <>
                                  <p>ENDS IN</p>
                                  {gameData ? (
                                    <PlayDetailsComponent
                                      prizePool={gameData.prize}
                                      startDate={gameData.end_time}
                                      // fetch={() => fetchGameData()}
                                      // game={() => gameEnded()}
                                    />
                                  ) : (
                                    ''
                                  )}
                                </>
                              ) : moment(gameData.start_time) > moment() ? (
                                <>
                                  <p>REGISTRATION ENDS IN</p>
                                  {gameData ? (
                                    <PlayDetailsComponent
                                      prizePool={gameData.prize}
                                      startDate={gameData.start_time}
                                      // fetch={() => fetchGameData()}
                                      // game={() => gameEnded()}
                                    />
                                  ) : (
                                    ''
                                  )}
                                </>
                              ) : (
                                ''
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-6 md:ml-14">
                  <ModalPortfolioContainer
                    title={playerTeamName}
                    accountId={cutAddress(accountId)}
                    textcolor="text-indigo-black mb-5"
                  />
                </div>
                <div
                  key={remountComponent}
                  className="grid grid-cols-2 gap-x-16 md:gap-x-0 md:gap-y-4 md:mt-4 md:grid-cols-4 ml-8 md:ml-2 md:mt-17 w-3/4"
                >
                  {playerLineup.length === 0
                    ? 'Loading athletes...'
                    : playerLineup[0].lineup.map((item, i) => {
                        return (
                          <PerformerContainer
                            AthleteName={`${item.name}`}
                            AvgScore={item.stats_breakdown?.toFixed(2)}
                            id={item.primary_id}
                            uri={item.image}
                            hoverable={false}
                          />
                        );
                      })}
                </div>
              </>
            </>
          </Main>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query.game_id != query.game_id) {
    return {
      desination: query.origin || '/Play',
    };
  }

  return {
    props: { query },
  };
}
