import React, { useEffect, useState } from 'react';
import Main from 'components/Main';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import Container from 'components/containers/Container';
import BackFunction from 'components/buttons/BackFunction';
import 'regenerator-runtime/runtime';
import { useRouter } from 'next/router';
import Lineup from 'components/Lineup';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/modals/Modal';
import { getSportType } from 'data/constants/sportConstants';
import { DEFAULT_MAX_FEES } from 'data/constants/gasFees';
import { getAthleteLineup, getTeamName } from 'redux/athlete/athleteSlice';
import {
  setAthleteLineup,
  setGameId,
  setIndex,
  setPosition,
  setTeamNameRedux,
  setSport,
} from 'redux/athlete/athleteSlice';
import { query_game_data } from 'utils/near/helper';

export default function CreateLineup(props) {
  const { query } = props;
  const gameId = query.game_id;
  const currentSport = query.sport.toString().toUpperCase();
  const newTeamName = useSelector(getTeamName);
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxLineup = useSelector(getAthleteLineup);
  const { selector } = useWalletSelector();
  // @ts-ignore:next-line
  const [teamName, setTeamName] = useState('Team 1');
  const [gameData, setGameData] = useState([]);
  const [submitModal, setSubmitModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editInput, setEditInput] = useState(teamName);
  function getTeamNamePage() {
    if (newTeamName != '') {
      setTeamName(newTeamName);
    }
  }

  // @ts-ignore:next-line
  const initialState = reduxLineup ? reduxLineup : [];
  const [lineup, setLineup] = initialState ? useState(initialState) : useState([]);

  function setArray(position, lineup, index) {
    const array = [{ position }, { lineup }, { index }];
    return array;
  }

  function populateLineup(array) {
    const array2 = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].amount; j++) {
        array2.push({ position: array[i].positions, isAthlete: false, isPromo: false });
      }
    }
    setLineup(array2);
  }
  async function get_game_data(game_id) {
    setGameData(await query_game_data(game_id, getSportType(currentSport).gameContract));
  }

  async function execute_submit_lineup(game_id, team_name, token_ids, promo_ids) {
    const submitLineupArgs = Buffer.from(
      JSON.stringify({
        game_id: game_id,
        team_name: team_name,
        token_ids: token_ids.length === 0 ? null : token_ids,
        token_promo_ids: promo_ids.length === 0 ? null : promo_ids,
      })
    );

    const action_submit_lineup = {
      type: 'FunctionCall',
      params: {
        methodName: 'submit_lineup',
        args: submitLineupArgs,
        gas: DEFAULT_MAX_FEES,
      },
    };

    const wallet = await selector.wallet();

    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: getSportType(currentSport).gameContract,
          //@ts-ignore:next-line
          actions: [action_submit_lineup],
        },
      ],
    });
  }
  function verifyLineup(game_id, team_name, lineup) {
    const token_ids = lineup
      .filter((data) => {
        return data.isPromo === false && data.isAthlete === true;
      })
      .map((data) => {
        return data.athlete.athlete_id;
      });

    const promo_ids = lineup
      .filter((data) => {
        return data.isPromo === true && data.isAthlete === true;
      })
      .map((data) => {
        return data.athlete.athlete_id;
      });

    console.log(token_ids);
    console.log(promo_ids);
    execute_submit_lineup(game_id, team_name, token_ids, promo_ids);
  }

  const checkLineups = () => {
    let errors = [];
  
      const trueNumber = lineup.filter((player) => player.isAthlete === true).length;
      const diff = lineup.length - trueNumber;

      if (lineup.length !== trueNumber) {
        errors.push(`Add more Athletes. (Need ${diff} more)`);
      }
    
    return errors;
  };
  
  const validateLineup = () => {
    const errors = checkLineups();
    if (errors.length > 0) {
      alert(
        `ERROR: \n${errors
          .map((item) => '❌ ' + item)
          .join(` \n`)}`.replace(',', '')
      );
    } else {
      setSubmitModal(true);
    }
  };
  
  const handleLineupClick = (game_id, position, athleteLineup, index, teamName) => {
    dispatch(setGameId(game_id));
    dispatch(setPosition(position));
    dispatch(setAthleteLineup(athleteLineup));
    dispatch(setIndex(index));
    dispatch(setTeamNameRedux(teamName));
    dispatch(setSport(currentSport));
    router.push('/AthleteSelect');
  };

  useEffect(() => {
    getTeamNamePage();
    if (lineup.length === 0) {
      get_game_data(gameId);
    }
  }, []);

  useEffect(() => {
    //@ts-ignore:next-line
    console.log(gameData);
    if (gameData.length !== 0) {
      //@ts-ignore:next-line
      populateLineup(gameData.positions);
    }
  }, [gameData]);
  useEffect(() => {
    console.log(lineup);
  }, [lineup]);

  return (
    <>
      <>
        <Container activeName="PLAY">
          <div className="flex flex-col w-full hide-scroll max-h-screen overflow-y-auto justify-center self-center">
            <Main color="indigo-white">
              <div className="md:ml-6 md:mt-8">
                <BackFunction prev={`/CreateLineup/${currentSport.toLowerCase()}/${gameId}`} />
              </div>
              <div className="flex flex-col w-full hide-scroll overflow-x-hidden h-full md:h-min self-center text-indigo-black relative">
                <div className="md:ml-6 md:-mt-0 mt-14">
                  <PortfolioContainer title="CREATE LINEUP" textcolor="text-indigo-black" />
                </div>
                <div className="flex flex-col md:-mt-12 md:-mb-5">
                  <div className="flex items-end pt-10 pb-3 ml-7 -mt-12 md:mt-0">
                    <div className="font-monument text-xl iphone5:ml-0 md:ml-6 truncate w-40 md:w-min md:max-w-xs">
                      {teamName}
                    </div>
                    <p
                      className="ml-5 underline text-sm pb-1 cursor-pointer"
                      onClick={() => setEditModal(true)}
                    >
                      EDIT TEAM NAME
                    </p>
                  </div>
                  <div className="grid grid-cols-4 md:gap-y-4 md:mt-14 iphone5:mt-6 mb-2 md:mb-10 md:grid-cols-4 md:mr-0">
                    {lineup.map((data, i) => {
                      console.log(lineup);
                      return (
                        <>
                          {data.isAthlete === false ? (
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                handleLineupClick(gameId, data.position, lineup, i, teamName)
                              }
                            >
                              <Lineup
                                position={data.position}
                                athleteLineup={lineup}
                                index={i}
                                test={setArray(data.position, lineup, i)}
                                img="/images/tokensMLB/CF.png"
                                player=""
                                game_id={gameId}
                                teamName={teamName}
                                isAthlete={data.isAthlete}
                                currentSport={currentSport}
                              />
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                handleLineupClick(gameId, data.position, lineup, i, teamName)
                              }
                            >
                              <Lineup
                                position={data.position}
                                athleteLineup={lineup}
                                index={i}
                                test={setArray(data.position, lineup, i)}
                                img={data.athlete.image}
                                player={data.athlete.name}
                                score={data.athlete.fantasy_score.toFixed(2)}
                                game_id={gameId}
                                isAthlete={data.isAthlete}
                                currentSport={currentSport}
                              />
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
                <div className="flex w-full bottom-3 md:sticky z-50">
                  <button
                    className="bg-indigo-buttonblue text-indigo-white w-full md:w-80 h-12 md:h-14 text-center font-bold text-md md:ml-auto md:mr-5"
                    onClick={() => validateLineup()}
                  >
                    CONFIRM TEAM
                  </button>
                </div>
              </div>
            </Main>
          </div>
        </Container>
        <Modal title={'Submit Team'} visible={submitModal} onClose={() => setSubmitModal(false)}>
          <div className="mt-2">
            <p className="">Confirm team lineup</p>
            <button
              className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
              onClick={() => verifyLineup(gameId, teamName, lineup)}
            >
              CONFIRM
            </button>
            <button
              className="bg-red-pastel font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
              onClick={() => setSubmitModal(false)}
            >
              CANCEL
            </button>
          </div>
        </Modal>
        <Modal
          title={'EDIT TEAM NAME'}
          visible={editModal}
          onClose={() => {
            setEditModal(false);
            setEditInput(teamName);
          }}
        >
          <button
            className="fixed top-4 right-4 "
            onClick={() => {
              setEditModal(false);
            }}
          >
            <img src="/images/x.png" />
          </button>
          <div className="mt-2 px-5">
            <p className="text-xs uppercase font-thin mb-2" style={{ fontFamily: 'Montserrat' }}>
              EDIT TEAM NAME
            </p>
            <input
              className="border p-2 w-full"
              placeholder={teamName}
              style={{ fontFamily: 'Montserrat' }}
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setTeamName(editInput);
                  setEditModal(false);
                }
              }}
            />
            <div className="flex mt-16 mb-5 bg-opacity-5 w-full">
              <button
                className="bg-indigo-buttonblue text-indigo-white w-full h-14 text-center tracking-widest text-md font-monument"
                onClick={() => {
                  setTeamName(editInput);
                  setEditModal(false);
                }}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query) {
    if (query.transactionHashes) {
      return {
        redirect: {
          destination:
            query.origin ||
            `/CreateLineup/${query.sport.toString().toLowerCase()}/${query.game_id}`,
          permanent: false,
        },
      };
    }
  }
  return {
    props: { query },
  };
}
