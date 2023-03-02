import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Main from 'components/Main';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import Link from 'next/link';
import Container from 'components/containers/Container';
import BackFunction from 'components/buttons/BackFunction';
import 'regenerator-runtime/runtime';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import Lineup from 'components/Lineup';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { Provider, useDispatch, useSelector } from 'react-redux';
import PerformerContainerSelectable from 'components/containers/PerformerContainerSelectable';
import BaseModal from 'components/modals/BaseModal';
import { position } from 'utils/athlete/position';
import Modal from 'components/modals/Modal';
import { axiosInstance } from 'utils/playible';
import LoadingPageDark from 'components/loading/LoadingPageDark';
import { getSportType } from 'data/constants/sportConstants';
import { DEFAULT_MAX_FEES } from 'data/constants/gasFees';
import {
  getAthleteLineup,
  getGameId,
  getIndex,
  getPosition,
  getTeamName,
} from 'redux/athlete/athleteSlice';
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
  const connectedWallet = {};
  const athlete = {
    athlete_id: null,
    token_id: null,
    contract_addr: null,
  };

  const gameTeamFormat = {
    name: '',
    game: 0,
    wallet_addr: '',
    athletes: [],
  };

  const { selector } = useWalletSelector();
  const data = router.query;
  // @ts-ignore:next-line
  const positions = ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'];
  const [team, setTeam] = useState([]);
  const [selectModal, setSelectModal] = useState(false);
  const [filterPos, setFilterPos] = useState(null);
  const [teamName, setTeamName] = useState('Team 1');
  const [gameData, setGameData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const limitOptions = [5, 10, 30, 50];
  const [athleteList, setAthleteList] = useState([]);
  const [chosenAthlete, setChosenAthlete] = useState(null);
  const [slotIndex, setSlotIndex] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editInput, setEditInput] = useState(teamName);
  const [createLoading, setCreateLoading] = useState(false);
  const [timerUp, setTimerUp] = useState(false);
  const [startDate, setStartDate] = useState();
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState({
    title: '',
    content: '',
  });

  function getTeamNamePage() {
    if (newTeamName != '') {
      setTeamName(newTeamName);
    }
  }

  const [loading, setLoading] = useState(true);
  // @ts-ignore:next-line
  const initialState = reduxLineup ? reduxLineup : [];
  // const initialState = isJson(data.testing) ? JSON.parse(data.testing) : 'hello';
  const [lineup, setLineup] = initialState ? useState(initialState) : useState([]);

  const fetchGameData = async () => {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);
    if (res.status === 200) {
      setStartDate(res.data.start_datetime);
    }
  };

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

  const canNext = () => {
    if (offset + 1 === pageCount) {
      return false;
    } else {
      return true;
    }
  };

  const canPrevious = () => {
    if (offset === 0) {
      return false;
    } else {
      return true;
    }
  };

  function setArray(position, lineup, index) {
    const array = [{ position }, { lineup }, { index }];
    return array;
  }

  function populateLineup(array) {
    //const array = Array(8).fill({position: "QB", isAthlete: false});

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

  const updateTeamSlots = () => {
    const tempSlots = [...team];
    setConfirmModal(false);
    setSelectModal(false);
    setSlotIndex(null);
    setChosenAthlete(null);
    setFilterPos(null);
  };

  const proceedChanges = async () => {
    if (chosenAthlete) {
      await updateTeamSlots();
      await setChosenAthlete(null);
      setLimit(5);
      setOffset(0);
    } else {
      alert('Please choose an athlete for this position.');
    }
  };

  const hasEmptySlot = () => {
    let hasEmptySlot = false;

    team.forEach((item) => {
      if (!item.athlete_id) {
        hasEmptySlot = true;
      }
    });

    return hasEmptySlot;
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
  const confirmTeam = async () => {
    setLimit(5);
    setOffset(0);
    if (connectedWallet) {
      setSubmitModal(false);

      if (!hasEmptySlot()) {
        setCreateLoading(true);
        const trimmedAthleteData = team.map(({ token_info, token_id, contract_addr }) => {
          return {
            athlete_id: token_info.info.extension.attributes.filter(
              (item) => item.trait_type === 'athlete_id'
            )[0].value,
            token_id,
            contract_addr,
          };
        });

        const formData = {
          name: teamName,
          game: router.query.id,
          // wallet_addr: connectedWallet.walletAddress,
          athletes: [...trimmedAthleteData],
        };

        const lock_team = {
          lock_team: {
            game_id: router.query.id,
            team_name: teamName,
            token_ids: [trimmedAthleteData.map((item) => item.token_id)],
          },
        };
      }

      useEffect(() => {
        if (dispatch && connectedWallet) {
          // dispatch(getAccountAssets({ walletAddr: connectedWallet.walletAddress }));
        }
      }, [dispatch, connectedWallet]);

      useEffect(() => {
        const id = setInterval(() => {
          const currentDate = new Date();
          const end = new Date(startDate);
          // const totalSeconds = (end - currentDate) / 1000;
          // if (Math.floor(totalSeconds) < 0) {
          //   setTimerUp(true);
          //   clearInterval(id);
          // }
        }, 1000);
        return () => clearInterval(id);
      }, [timerUp, startDate]);

      // useEffect(async () => {
      //   setErr(null);
      //   if (connectedWallet) {
      //     if (connectedWallet?.network?.name === 'testnet') {
      //       setLoading(true);
      //       await fetchGameData();
      //       await prepareSlots();
      //       await setTeamName('Team 1');
      //       setLoading(false);
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

      if (!(router && router.query.id)) {
        return '';
      }
    }
  };
  return (
    <>
      <>
        <Container activeName="PLAY">
          <div className="flex flex-col w-full hide-scroll max-h-screen justify-center self-center">
            <Main color="indigo-white">
              <div className="md:ml-6 md:mt-8">
                <BackFunction prev={`/CreateLineup/${currentSport.toLowerCase()}/${gameId}`} />
              </div>
              <div className="flex flex-col w-full hide-scroll overflow-x-hidden h-full md:h-min self-center text-indigo-black relative">
                <div className={`${selectModal ? 'hidden h-0' : ''}`}>
                  <div className="md:ml-6 md:-mt-0 mt-14">
                    <PortfolioContainer title="CREATE LINEUP" textcolor="text-indigo-black" />
                  </div>
                  <div className="flex flex-col md:-mt-8 md:-mb-5">
                    <div className="flex items-end pt-10 pb-3 ml-7 -mt-12 md:mt-0">
                      <div className="font-monument text-xl ml-6 truncate w-40 md:w-min md:max-w-xs">
                        {teamName}
                      </div>
                      <p
                        className="ml-5 underline text-sm pb-1 cursor-pointer"
                        onClick={() => setEditModal(true)}
                      >
                        EDIT TEAM NAME
                      </p>
                    </div>
                    <div className="grid grid-cols-4  md:gap-y-4 md:mt-14 mb-2 md:mb-10 md:grid-cols-4 md:ml-7 -mt-10 -ml-6 mr-6 md:mr-0">
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
                  <div className="flex bg-indigo-black bg-opacity-5 w-full justify-end fixed bottom-0 md:relative">
                    <button
                      className="bg-indigo-buttonblue text-indigo-white w-full md:w-80 h-12 md:h-14 text-center font-bold text-md"
                      onClick={() => setSubmitModal(true)}
                    >
                      CONFIRM TEAM
                    </button>
                  </div>
                </div>
              </div>
            </Main>
          </div>
        </Container>
        <BaseModal
          title={'Confirm selection'}
          visible={confirmModal}
          onClose={() => {
            setChosenAthlete(null);
            setConfirmModal(false);
          }}
        >
          {chosenAthlete ? (
            <div>
              <p>
                Are you sure to select{' '}
                {
                  chosenAthlete.token_info.info.extension.attributes.filter(
                    (item) => item.trait_type === 'name'
                  )[0].value
                }{' '}
                ?
              </p>
              <button
                className="bg-indigo-green font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
                onClick={updateTeamSlots}
              >
                CONFIRM
              </button>
              <button
                className="bg-red-pastel font-monument tracking-widest text-indigo-white w-full h-16 text-center text-sm mt-4"
                onClick={() => {
                  setChosenAthlete(null);
                  setConfirmModal(false);
                }}
              >
                CANCEL
              </button>
            </div>
          ) : (
            ''
          )}
        </BaseModal>
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
        <Modal title={'LOADING'} visible={createLoading}>
          <div>
            <p className="mb-5 text-center">Creating your team</p>
            <div className="flex gap-5 justify-center mb-5">
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
              <div className="bg-indigo-buttonblue animate-bounce w-5 h-5 rounded-full"></div>
            </div>
          </div>
        </Modal>
        <Modal title={'SUCCESS'} visible={successModal}>
          <div className="mt-2">
            <p className="text-center font-montserrat mb-5">Team created successfully!</p>
          </div>
        </Modal>
        <Modal title={'FAILED'} visible={failedModal} onClose={() => setFailedModal(false)}>
          <div className="mt-2">
            <p className="text-center font-montserrat mb-5">
              An error occured. Please try again later.
            </p>
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
      <BaseModal title={msg.title} visible={modal} onClose={() => setModal(false)}>
        <p className="mt-5">{msg.content}</p>
      </BaseModal>
    </>
    //       )}
    //     </>
    //   )}
    // </>
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
// export async function getServerSideProps(ctx) {
//   const { query } = ctx;
//   let queryObj = null;
//   if (query) {
//     if (query.id) {
//       queryObj = query;
//       const res = await axiosInstance.get(`/fantasy/game/${query.id}/`);
//       if (res.status === 200) {
//         if (new Date(res.data.start_datetime) < new Date()) {
//           return {
//             redirect: {
//               destination: `/PlayDetails/?id=${query.id}`,
//               permanent: false,
//             },
//           };
//         }
//       }
//     } else {
//       return {
//         redirect: {
//           destination: query.origin || '/Portfolio',
//           permanent: false,
//         },
//       };
//     }
//   }

//   let playerStats = null;
//   const res = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id) + 1}/stats/`);

//   if (res.status === 200) {
//     playerStats = res.data;
//   }
//   return {
//     props: { queryObj, playerStats },
//   };
// }
