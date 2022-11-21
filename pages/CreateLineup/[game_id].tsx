import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from '../../components/Main';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { useRouter } from 'next/router';
import { axiosInstance } from '../../utils/playible';
import Link from 'next/link';
import 'regenerator-runtime/runtime';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { GAME } from 'data/constants/nearContracts';
import { useWalletSelector } from 'contexts/WalletSelectorContext';

export default function CreateLineup(props) {
  const { query } = props;

  const gameId = query.game_id;
  const teamName = "Team 1";
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const { accountId } = useWalletSelector();

  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false);
  const [playerTeams, setPlayerTeams] = useState([]);
  const [startDate, setStartDate] = useState();
  const [buttonMute, setButtonMute] = useState(false);

  const [loading, setLoading] = useState(true);
  // const [err, setErr] = useState(error);

  useEffect(() => {
    const id = setInterval(() => {
      const currentDate = new Date();
      const end = new Date(startDate);
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

  function query_player_teams() {
    const query = JSON.stringify({
      account: accountId,
      game_id: gameId,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(GAME),
        method_name: 'get_player_team',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const playerTeamNames = JSON.parse(Buffer.from(data.result));

        setPlayerTeams(playerTeamNames);

      });
  }

  useEffect(() => {

    console.log("loading");
    query_player_teams();
    console.log(playerTeams);

  }, []);

  return (
    <>
      <Container activeName="PLAY">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12 ">
          <Main color="indigo-white">
          <div className="mt-8 md:ml-6">
          <BackFunction prev={query.origin ? `/${query.origin}` : `/PlayDetails/${gameId}`}></BackFunction>
        </div>
            <div className='grid grid-cols-3 mt-12 gap-10'>
              <div className='ml-12 -mt-3 h-full col-span-2 row-span-2'>
                <Image
                  src="/images/game.png"
                  width={550} 
                  height={279}
                />
              </div>
              <div className="-ml-72">
                <ModalPortfolioContainer
                  title="CREATE TEAM"
                  textcolor="text-indigo-black"
                />
                <div className="mt-0 md:mt-4 w-2/3">
                  Create a team and showcase your collection. Enter a team into the
                  tournament and compete for cash prizes.
                </div>
                <div className="mt-10">
                <Link href={{
                  pathname: '/CreateTeam/[game_id]',
                  query: {
                    game_id: gameId,
                    teamName: teamName
                  }
                }} as={`/CreateTeam/${gameId}`}>
                  <button className='bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-10 mt-16 text-center font-bold w-3/5'>
                    CREATE YOUR LINEUP +
                  </button>
                </Link>
              </div>
              </div>
            </div>
            <div className="mt-7 ml-7 w-2/5">
              <ModalPortfolioContainer
                title="VIEW TEAMS"
                textcolor="text-indigo-black mb-5"
              />

              {
                /* @ts-expect-error */
                playerTeams.team_names == undefined ? (
                  <p>No teams assigned</p>
                ) : (
                  <div>
                    { /* @ts-expect-error */}
                    {playerTeams.team_names.map((data) => {
                      return (
                        <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
                          <p className="font-monument">{data}</p>
                          <Link
                            href={{
                              pathname: '/EntrySummary/[game_id]',
                              query: {
                                team_id: data,
                                game_id: gameId,
                              },
                            }} as={`/EntrySummary/${gameId}/${data}`}
                          >
                            <a>
                              <img src={'/images/arrow-top-right.png'} />
                            </a>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
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
