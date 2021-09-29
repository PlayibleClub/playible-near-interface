import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import Main from '../components/Main'
import PortfolioContainer from '../components/PortfolioContainer'
import AthleteGrid from '../components/AthleteGrid'
import AthleteContainer from '../components/AthleteContainer'
import PerformerContainer from '../components/PerformerContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio, clearData } from '../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import TokenGridCol2 from '../components/TokenGridCol2';
import Loading from '../components/Loading';
import * as statusCode from '../data/constants/status'

// const playerList = [ // player list for testing purposes
//     {
//         name: 'STEPHEN CURRY',
//         team: 'Golden State Warriors',
//         id: '320',
//         cost: '420 UST',
//         jersey: '30',
//         positions: ['PG', 'SG'],
//         avgscore: '86.3',
//         grad1: 'indigo-blue',
//         grad2: 'indigo-bluegrad',
//     },
//     {
//         name: 'TAUREAN PRINCE',
//         team: 'Minnesota Timberwolves',
//         id: '14450',
//         cost: '41 UST',
//         jersey: '12',
//         positions: ['PG'],
//         avgscore: '66.5',
//         grad1: 'indigo-purple',
//         grad2: 'indigo-purplegrad',
//     },
//     {
//         name: 'LEBRON JAMES',
//         team: 'Los Angeles Lakers',
//         id: '25',
//         cost: '840 UST',
//         jersey: '23',
//         positions: ['PG', 'SG'],
//         avgscore: '96.0',
//         grad1: 'indigo-purple',
//         grad2: 'indigo-purplegrad',
//     },
//     {
//         name: 'DEVIN BOOKER',
//         team: 'Phoenix Suns',
//         id: '16450',
//         cost: '21 UST',
//         jersey: '01',
//         positions: ['SF', 'C'],
//         avgscore: '76.8',
//         grad1: 'indigo-darkblue',
//         grad2: 'indigo-darkbluegrad',
//     },
//     {
//         name: 'ARMONI BROOKS',
//         team: 'Houston Rockets',
//         id: '21300',
//         cost: '45.5 UST',
//         jersey: '23',
//         positions: ['SG', 'C'],
//         avgscore: '81.0',
//         grad1: 'indigo-blue',
//         grad2: 'indigo-bluegrad',
//     },
//     {
//         name: 'KEVIN DURANT',
//         team: 'Brooklyn Nets',
//         id: '12300',
//         cost: '180 UST',
//         jersey: '07',
//         positions: ['PG'],
//         avgscore: '83.0',
//         grad1: 'indigo-black',
//         grad2: 'indigo-red',
//     },
//     {
//         name: 'KOBE BRYANT',
//         team: 'Los Angeles Lakers',
//         id: '999',
//         cost: '999 UST',
//         jersey: '24',
//         positions: ['SG'],
//         avgscore: '96.0',
//         grad1: 'indigo-purple',
//         grad2: 'indigo-purplegrad',
//     },
//     // {
//     //     name: '',
//     //     team: '',
//     //     id: '',
//     //     cost: '',
//     //     jersey: '',
//     //     positions: [],
//     //     grad1: '',
//     //     grad2: '',
//     // },
// ]

const Portfolio = () => {

    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [posFilter, setPosFilter] = useState("")
    const [isClosed, setClosed] = useState(true)
    const [filterMode, setMode] = useState(false)
    const [showFilter, setFilter] = useState(false)
    const [loading, setLoading] = useState(true);
    
    const { tokenList: playerList, status } = useSelector((state) => state.contract.portfolio);

    const dispatch = useDispatch();
    const connectedWallet = useConnectedWallet();


    useEffect(() => {
        if (typeof connectedWallet !== 'undefined') {
            dispatch(getPortfolio({walletAddr: connectedWallet.walletAddress}))
        }
        return function cleanup() {
            dispatch(clearData());
        };
    }, [dispatch, connectedWallet])

    useEffect(() => {
        if (typeof connectedWallet === 'undefined' ) {
            setLoading(false)
        }
        else if(status === statusCode.PENDING){
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [connectedWallet, status])

    const onSubmit = (data) => {
        if (data.search)
            setResult(data.search)
        else setResult("")

        if (data.teamName)
            setTeamFilter(data.teamName)
        else setTeamFilter("")

        if (data.positions)
            setPosFilter(data.positions)
        else setPosFilter("")
    }

    const key1 = 'team'
    const uniqueTeams = [...new Map(playerList.map(i => [i[key1], i])).values()]

    const [isNarrowScreen, setIsNarrowScreen] = useState(false);

    useEffect(() => {
      // set initial value
      const mediaWatcher = window.matchMedia("(max-width: 500px)")
  
      //watch for updates
      function updateIsNarrowScreen(e) {
        setIsNarrowScreen(e.matches);
      }
      mediaWatcher.addEventListener('change', updateIsNarrowScreen)
  
      // clean up after ourselves
      return function cleanup() {
        mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
      }
    })
  
    if (!isNarrowScreen) {
    return (
        <>
            <div className={`font-montserrat h-screen relative`}>
                <Navbar/>
                <HeaderBase/>

                <div className="flex flex-col w-full h-screen">
                <Main color="indigo-dark">
                    
                    {loading ? (
                        <Loading/>
                    ) : (
                    <div className="flex w-full overflow-y-auto overflow-x-hidden h-screen">
                        <PortfolioContainer title="PORTFOLIO" className="flex">
                            <div className="flex flex-col justify-center self-center">
                                <div className="flex w-full mb-4 mt-4">
                                    {filterMode ?
                                        <>
                                            <div className="rounded-md bg-indigo-light mr-1 w-12 h-11" onClick={() => {
                                                setMode(false)
                                                setResult("")
                                            }}>
                                                <div className="ml-3.5 mt-4">
                                                    <img src={filterIcon} />
                                                </div>
                                            </div>

                                            <div className="rounded-md bg-indigo-light ml-1 h-11 w-10/12 flex md:w-80">
                                                <div className="ml-1 mt-2">
                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <input {...register("search")} className="text-xl ml-3 appearance-none bg-indigo-light focus:outline-none w-10/12" placeholder="Search..." />
                                                        <button className="w-1/12 md:w-9">
                                                            <input type="image" src={searchIcon} className="object-none md:ml-3 md:mt-1" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="flex">
                                                <div className="rounded-md bg-indigo-light mr-1 h-11 w-72 flex font-thin md:w-80" onClick={() => setFilter(true)}>
                                                    <div className="text-lg ml-4 mt-2 mr-36 w-9/12">
                                                        Filter by
                                                    </div>
                                                    <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                                </div>

                                                <div className="rounded-md bg-indigo-light ml-1 w-12 h-11" onClick={() => {
                                                    setMode(true)
                                                    setFilter(false)
                                                    setResult("")
                                                }}>
                                                    <div className="ml-4 mt-3">
                                                        <img src={searchIcon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>

                                <div className="justify-center flex mb-2 md:text-lg">
                                    {showFilter ?
                                        <>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div>
                                                    Team Name: 
                                                    <select {...register("teamName")} className="bg-indigo-light ml-1">
                                                        <option value="">Select...</option>
                                                        {uniqueTeams.map(function (team, i) {
                                                            return (
                                                                <option value={team.team} key={i}>{team.team}</option>
                                                            )
                                                        }
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    Position: 
                                                    <select {...register("positions")} className="bg-indigo-light ml-1">
                                                        <option value="">Select...</option>
                                                        <option value="PG">PG</option>
                                                        <option value="SG">SG</option>
                                                        <option value="PF">PF</option>
                                                        <option value="SF">SF</option>
                                                        <option value="C">C</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input type="submit" className="rounded-md p-1 bg-indigo-light pl-2 pr-2"/>
                                                </div>
                                                {/* {console.log(result)} */}
                                            </form>
                                        </>
                                        :
                                        <>
                                        </>
                                    }
                                </div>
                            </div>

                            <div className="justify-center flex md:w-96 md:self-center">
                                <AthleteGrid>
                                    {filterMode ?
                                        playerList.map(function (player, i) {
                                            const toFindName = player.name.toLowerCase()
                                            const toFindTeam = player.team.toLowerCase()
                                            const searchInfo = result.toLowerCase()
                                            if (toFindName.includes(searchInfo) || toFindTeam.includes(searchInfo) || player.jersey.includes(searchInfo))
                                                return (
                                                    <div className='mb-4' key={i}>
                                                        <AthleteContainer
                                                            AthleteName={player.name}
                                                            TeamName={player.team}
                                                            ID={player.id}
                                                            CoinValue={player.cost}
                                                            Jersey={player.jersey}
                                                            Positions={player.positions}
                                                            colorgrad1={player.grad1}
                                                            colorgrad2={player.grad2}
                                                        />
                                                    </div>
                                            )
                                        })
                                        :
                                        playerList.map(function (player, i) {
                                            const toFindTeam = player.team.toLowerCase()
                                                // console.log(posFilter)
                                                // console.log(teamFilter)
                                            if (posFilter === "" && teamFilter === "") {
                                                // console.log("no filter")
                                                return (
                                                    <div className='mb-4' key={i}>
                                                        <AthleteContainer
                                                            AthleteName={player.name}
                                                            TeamName={player.team}
                                                            ID={player.id}
                                                            CoinValue={player.cost}
                                                            Jersey={player.jersey}
                                                            Positions={player.positions}
                                                            colorgrad1={player.grad1}
                                                            colorgrad2={player.grad2}
                                                        />
                                                    </div>
                                                )
                                            }
                                            else if (posFilter !== "" && teamFilter !== "") {
                                                // console.log("pos and team code")
                                                if (player.positions.includes(posFilter) && toFindTeam.includes(teamFilter.toLowerCase()))
                                                    return (
                                                        <div className='mb-4' key={i}>
                                                            <AthleteContainer
                                                                AthleteName={player.name}
                                                                TeamName={player.team}
                                                                ID={player.id}
                                                                CoinValue={player.cost}
                                                                Jersey={player.jersey}
                                                                Positions={player.positions}
                                                                colorgrad1={player.grad1}
                                                                colorgrad2={player.grad2}
                                                            />
                                                        </div>
                                                    )
                                            }
                                            else if (teamFilter !== "") {
                                                // console.log("team code")
                                                if (toFindTeam.includes(teamFilter.toLowerCase())) {
                                                    return (
                                                        <div className='mb-4' key={i}>
                                                            <AthleteContainer
                                                                AthleteName={player.name}
                                                                TeamName={player.team}
                                                                ID={player.id}
                                                                CoinValue={player.cost}
                                                                Jersey={player.jersey}
                                                                Positions={player.positions}
                                                                colorgrad1={player.grad1}
                                                                colorgrad2={player.grad2}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            }
                                            else if (posFilter !== "") {
                                                // console.log("posFilter code")
                                                if (player.positions.includes(posFilter)) {
                                                    return (
                                                        <div className='mb-4' key={i}>
                                                            <AthleteContainer
                                                                AthleteName={player.name}
                                                                TeamName={player.team}
                                                                ID={player.id}
                                                                CoinValue={player.cost}
                                                                Jersey={player.jersey}
                                                                Positions={player.positions}
                                                                colorgrad1={player.grad1}
                                                                colorgrad2={player.grad2}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            }
                                        })
                                    }
                                </AthleteGrid>
                            </div>
                        </PortfolioContainer>
                    </div>
                    )}
                </Main>
                </div>
            </div>
        </>
    )}
    else {
        return(
            <>
                <div className={`font-montserrat h-screen relative`}>
                <Navbar/>
                <HeaderBase/>
                
                <div className="flex flex-col w-full h-screen">
                <Main color="indigo-dark">
                    <div className="flex w-full overflow-y-auto overflow-x-hidden h-screen">
                        <PortfolioContainer title="PORTFOLIO" className="flex">
                            <div className="flex flex-col justify-center self-center">
                                <div className="flex w-full mb-4 mt-4">
                                    {filterMode ?
                                        <>
                                            <div className="rounded-md bg-indigo-light mr-1 w-12 h-11" onClick={() => {
                                                setMode(false)
                                                setResult("")
                                            }}>
                                                <div className="ml-3.5 mt-4">
                                                    <img src={filterIcon} />
                                                </div>
                                            </div>

                                            <div className="rounded-md bg-indigo-light ml-1 h-11 w-10/12 flex iphone5:w-56 iphoneX:w-64 md:w-80">
                                                <div className="ml-1 mt-2">
                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <input {...register("search")} className="text-xl ml-2 appearance-none bg-indigo-light focus:outline-none w-10/12" placeholder="Search..." />
                                                        <button className="w-1/12 md:w-9">
                                                            <input type="image" src={searchIcon} className="object-none md:ml-3 md:mt-1 iphone5:mt-1" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="flex">
                                                <div className="rounded-md bg-indigo-light mr-1 h-11 w-72 flex font-thin iphone5:w-56 iphoneX:w-64 md:w-80" onClick={() => setFilter(true)}>
                                                    <div className="text-lg ml-4 mt-2 mr-24 w-10/12">
                                                        Filter by
                                                    </div>
                                                    <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                                </div>

                                                <div className="rounded-md bg-indigo-light ml-1 w-12 h-11" onClick={() => {
                                                    setMode(true)
                                                    setFilter(false)
                                                    setResult("")
                                                }}>
                                                    <div className="ml-4 mt-3">
                                                        <img src={searchIcon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>

                                <div className="justify-center flex mb-2 md:text-lg">
                                    {showFilter ?
                                        <>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div>
                                                    Team Name: 
                                                    <select {...register("teamName")} className="bg-indigo-light ml-1">
                                                        <option value="">Select...</option>
                                                        {uniqueTeams.map(function (team, i) {
                                                            return (
                                                                <option value={team.team} key={i}>{team.team}</option>
                                                            )
                                                        }
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    Position: 
                                                    <select {...register("positions")} className="bg-indigo-light ml-1">
                                                        <option value="">Select...</option>
                                                        <option value="PG">PG</option>
                                                        <option value="SG">SG</option>
                                                        <option value="PF">PF</option>
                                                        <option value="SF">SF</option>
                                                        <option value="C">C</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input type="submit" className="rounded-md p-1 bg-indigo-light pl-2 pr-2"/>
                                                </div>
                                                {/* {console.log(result)} */}
                                            </form>
                                        </>
                                        :
                                        <>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="justify-center flex md:w-96 md:self-center mt-2">
                                <TokenGridCol2>
                                    {filterMode ?
                                        playerList.map(function (player, i) {
                                            const toFindName = player.name.toLowerCase()
                                            const toFindTeam = player.team.toLowerCase()
                                            const searchInfo = result.toLowerCase()
                                            if (toFindName.includes(searchInfo) || toFindTeam.includes(searchInfo) || player.jersey.includes(searchInfo))
                                                return (
                                                    <div className='mb-8' key={i}>
                                                        <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                    </div>
                                            )
                                        })
                                        :
                                        playerList.map(function (player, i) {
                                            const toFindTeam = player.team.toLowerCase()
                                                // console.log(posFilter)
                                                // console.log(teamFilter)
                                            if (posFilter === "" && teamFilter === "") {
                                                // console.log("no filter")
                                                return (
                                                    <div className='mb-8' key={i}>
                                                        <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                    </div>
                                                )
                                            }
                                            else if (posFilter !== "" && teamFilter !== "") {
                                                // console.log("pos and team code")
                                                if (player.positions.includes(posFilter) && toFindTeam.includes(teamFilter.toLowerCase()))
                                                    return (
                                                        <div className='mb-8' key={i}>
                                                            <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                        </div>
                                                    )
                                            }
                                            else if (teamFilter !== "") {
                                                // console.log("team code")
                                                if (toFindTeam.includes(teamFilter.toLowerCase())) {
                                                    return (
                                                        <div className='mb-12' key={i}>
                                                            <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                        </div>
                                                    )
                                                }
                                            }
                                            else if (posFilter !== "") {
                                                // console.log("posFilter code")
                                                if (player.positions.includes(posFilter)) {
                                                    return (
                                                        <div className='mb-8' key={i}>
                                                            <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                        </div>
                                                    )
                                                }
                                            }
                                        })
                                    }
                                </TokenGridCol2>
                            </div>
                        </PortfolioContainer>
                        </div>
                    </Main>
                    </div>
                </div>
            </>
        )
    }
}
export default Portfolio;