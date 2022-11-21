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
import { GAME, ATHLETE } from 'data/constants/nearContracts';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';

export default function EntrySummary(props) {

  const router = useRouter();
  const [name, setName] = useState('');
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [team, setTeam] = useState([]);
  const [gameEnd, setGameEnd] = useState(false);

  const [remountComponent, setRemountComponent] = useState(0);

  const { query } = props;
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const gameId = query.game_id;
  const [playerLineup, setPlayerLineup] = useState([]);
  const playerTeamName = query.team_id;
  const [athletes, setAthletes] = useState([]);
  const [testAthlete, setTestAthlete] = useState([]);
  const { accountId } = useWalletSelector();

  // const { error } = props;
  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(error);

  const fetchGameData = async () => {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.game_id}/`);

    const allTeams = router.query.team_id
      ? await axiosInstance.get(`/fantasy/game_team/${router.query.team_id}/`)
      : await axiosInstance.get(
          `/fantasy/game/${router.query.game_id}/registered_teams_detail/?wallet_addr=`
        );

    if (allTeams.status === 200) {
      if (router.query.team_id) {
        setTeam([allTeams.data]);
      } else {
        setTeam(allTeams.data);
      }
    }

    if (res.status === 200) {
      setGameData(res.data);
    }
  };

  function gameEnded() {
    setGameEnd(true);
  }

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

  function query_player_team_lineup(){
    const query = JSON.stringify({
      account: accountId,
      game_id: gameId,
      team_id: playerTeamName,
    });

    provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: getContract(GAME),
      method_name: 'get_player_lineup',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      // @ts-ignore:next-line
      const playerTeamLineup = JSON.parse(Buffer.from(data.result));
      
      setPlayerLineup(playerTeamLineup.lineup);

    });
  }

  function query_nft_tokens_for_owner() {
    playerLineup.forEach((token_id) => {
      const query = JSON.stringify({
        token_id: token_id,
      });
  
      provider
        .query({
          request_type: 'call_function',
          finality: 'optimistic',
          account_id: getContract(ATHLETE),
          method_name: 'nft_token_by_id',
          args_base64: Buffer.from(query).toString('base64'),
        })
        .then(async (data) => {
          // @ts-ignore:next-line
          const result = JSON.parse(Buffer.from(data.result).toString());
          const result_two = await getAthleteInfoById(await convertNftToAthlete(result));
          setAthletes(athletes => [...athletes, result_two]);
          
        });
      } 
    );
    //setAthletes(testAthlete);
    
  }

  

  useEffect(() => {
    
    console.log("loading lineup...");
    query_player_team_lineup();
    console.log("loading athletes...");
    
  },[]);

  useEffect(() => {
    if(playerLineup.length > 0 && athletes.length === 0){
      console.log(playerLineup);
      query_nft_tokens_for_owner();
    }   
  }, [ playerLineup ]);
  useEffect(() => {
    console.log(athletes);
  }, [ athletes]);

  useEffect(() => {
    console.log(athletes);
  }, [remountComponent]);

  return (
    <>
      {/* { changeNameModal === true &&
        <>
        <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-4/12 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
                <button onClick={()=>{setchangeNameModal(false)}}>
                    <div className="absolute top-0 right-0 p-4 font-black">
                        X
                    </div>
                </button>
                    <ModalPortfolioContainer  textcolor="indigo-black" title="EDIT TEAM NAME"/>
                <div className='ml-7'>
                    <div>
                       Enter Team Name 
                    </div>
                    <div className='flex border justify-between p-4 text-bold font-monument'>
                    <form>
                            <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        /> 
                    </form>
                    <button className='mr-4' onClick={reset}>
                        X
                    </button>
                    </div>
                    <button className='bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center text-indigo-white' onClick={()=>{setchangeNameModal(false)}}>
                            PROCEED
                        </button>
                </div>
            </div>
        </div>
        </>
        } */}
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            <>
              {/* {loading ? (
                <LoadingPageDark />
              ) : (
                <>
                  {err ? (
                    <p className="py-10 ml-7">{err}</p>
                  ) : ( */}
                    <>
                      <div className="mt-8">
                        <BackFunction
                          prev={router.query.origin || `/CreateLineup/${gameId}`}
                        />
                      </div>
                      <PortfolioContainer textcolor="indigo-black" title="ENTRY SUMMARY" />
                      <div className="md:ml-7 flex flex-row md:flex-row">
                        <div className="md:mr-12">
                          <div className="mt-7 justify-center md:self-left md:mr-8">
                            <Image src="/images/game.png" width={550} height={220} />
                          </div>
                          <div className="flex space-x-14 mt-4">
                            <div>
                              <div>PRIZE POOL</div>
                              <div className=" font-monument text-lg">
                                {(gameData && gameData.prize) || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div>START DATE</div>
                              <div className=" font-monument text-lg">
                                {(gameData &&
                                  moment(gameData.start_datetime).format('MM/DD/YYYY')) ||
                                  'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {gameData &&
                              (new Date(gameData.start_datetime) <= new Date() &&
                              new Date(gameData.end_datetime) > new Date() ? (
                                <>
                                  <p>ENDS IN</p>
                                  {gameData ? (
                                    <PlayDetailsComponent
                                      prizePool={gameData.prize}
                                      startDate={gameData.end_datetime}
                                      fetch={() => fetchGameData()}
                                      game={() => gameEnded()}
                                    />
                                  ) : (
                                    ''
                                  )}
                                </>
                              ) : new Date(gameData.start_datetime) > new Date() ? (
                                <>
                                  <p>REGISTRATION ENDS IN</p>
                                  {gameData ? (
                                    <PlayDetailsComponent
                                      prizePool={gameData.prize}
                                      startDate={gameData.start_datetime}
                                      fetch={() => fetchGameData()}
                                      game={() => gameEnded()}
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
                      <div className="mt-5 flex items-center ml-7">
                         <ModalPortfolioContainer
                            title={playerTeamName}
                            textcolor="text-indigo-black mb-5"
                          />
                      </div>
                      <div key={remountComponent} className="grid grid-cols-4 gap-y-4 mt-4 md:grid-cols-4 md:ml-2 md:mt-17 w-3/4">
                        {athletes.length === 0 ? 'Loading athletes...' : athletes.map((item, i) => {
      
                          return(
                            <PerformerContainer
                            AthleteName={`${item.name}`}
                            AvgScore={item.fantasy_score.toFixed(2)}
                            id={item.primary_id}
                            uri={item.image}
                            hoverable={false}
                          />
                            )
                        })}
                      </div>

                    </>
                  {/* )}
                </>
              )} */}
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

// export async function getServerSideProps(ctx) {
//   return {
//     redirect: {
//       destination: '/Portfolio',
//       permanent: false,
//     },
//   };
// }
