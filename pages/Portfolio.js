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
import LoadingPageDark from '../components/loading/LoadingPageDark';
import * as statusCode from '../data/constants/status'
import Link from 'next/link'
import DesktopNavbar from '../components/DesktopNavbar';
import SquadPackComponent from '../components/SquadPackComponent'
import {BrowserView, MobileView} from 'react-device-detect'

const playerList = [ // player list for testing purposes
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
        cost: '420 UST',
        jersey: '30',
        positions: ['PG', 'SG'],
        avgscore: '86.3',
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        listing: 'July 22, 2018 07:22:13'
    },
    {
        name: 'TAUREAN PRINCE',
        team: 'Minnesota Timberwolves',
        id: '14450',
        cost: '41 UST',
        jersey: '12',
        positions: ['PG'],
        avgscore: '66.5',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: 'July 21, 2021 07:22:14',
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers',
        id: '25',
        cost: '840 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        avgscore: '96.0',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: 'August 22, 2021 07:22:13'
    },
    {
        name: 'DEVIN BOOKER',
        team: 'Phoenix Suns',
        id: '16450',
        cost: '21 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        avgscore: '76.8',
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
        listing: 'July 22, 2022 08:22:13'
    },
    {
        name: 'ARMONI BROOKS',
        team: 'Houston Rockets',
        id: '21300',
        cost: '45.5 UST',
        jersey: '23',
        positions: ['SG', 'C'],
        avgscore: '81.0',
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        listing: 'January 3, 2019 07:24:13'
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets',
        id: '12300',
        cost: '180 UST',
        jersey: '07',
        positions: ['PG'],
        avgscore: '83.0',
        grad1: 'indigo-black',
        grad2: 'indigo-red',
        listing: 'July 22, 2018 07:22:14'
    },
    {
        name: 'KOBE BRYANT',
        team: 'Los Angeles Lakers',
        id: '999',
        cost: '999 UST',
        jersey: '24',
        positions: ['SG'],
        avgscore: '96.0',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: 'December 22, 2022 11:20:23'
    },
    // {
    //     name: '',
    //     team: '',
    //     id: '',
    //     cost: '',
    //     jersey: '',
    //     positions: [],
    //     grad1: '',
    //     grad2: '',
    // },
]

const packList = [
    {
        name: 'PREMIUM PACK',
        key: 'prem2',
        release: '2',
        price: '20 UST',
        image: '/images/packimages/packs1.png',

    },
    {
        name: 'PREMIUM PACK',
        key: 'prem3',
        release: '3',
        price: '35 UST',
        image: '/images/packimages/packs1.png',

    },
    {
        name: 'BASE PACK',
        key: 'base2',
        release: '2',
        price: '20 UST',
        image: '/images/packimages/packs1.png',
    },
]

const Portfolio = () => {

    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [posFilter, setPosFilter] = useState("")
    const [filterMode, setMode] = useState(false)
    const [sortMode, setSort] = useState("")
    const [showFilter, setFilter] = useState(false)
    const [displayMode, setDisplay] = useState(true)
    const [loading, setLoading] = useState(true)
    
    // const { tokenList: playerList, status } = useSelector((state) => state.contract.portfolio);

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

    /*useEffect(() => {
        if (typeof connectedWallet === 'undefined' ) {
            setLoading(false)
        }
        else if(status === statusCode.PENDING){
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [connectedWallet, status])*/

    const onSubmit = (data) => {
        if (data.search)
            setResult(data.search)
        else setResult("")

        // if (data.teamName)
        //     setTeamFilter(data.teamName)
        // else setTeamFilter("")

        // if (data.positions)
        //     setPosFilter(data.positions)
        // else setPosFilter("")
    }

    const handleSort = (event) => {
        setSort(event.target.value)
    }

    const key1 = 'team'
    const uniqueTeams = [...new Map(playerList.map(i => [i[key1], i])).values()]

    const uniquePlayers = [...new Set(playerList.map(i => i.name))];
    console.log("unique list: " + uniquePlayers);

    return (
        <>
            <div className={`font-montserrat h-screen relative flex`}>
                <div className="invisible w-0 md:visible md:w-1/4">
                    <DesktopNavbar/>
                </div>

                <div className="visible md:invisible">
                    <Navbar/>
                    <HeaderBase/>
                </div>

                <div className="flex flex-col w-full h-screen">
                <Main color="indigo-dark">
                    
                    {loading ? (
                        <LoadingPageDark/>
                    ) : (
                    <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-white-light">
                        <div className="flex flex-col md:flex-row md:justify-between">
                            <PortfolioContainer title="SQUAD"/>
                            <div>
                                <div className="flex md:mt-5 md:mr-6 invisible md:visible">
                                    <div className="bg-indigo-light mr-1 h-11 w-64 flex font-thin">
                                            <form onSubmit={handleSubmit(handleSort)}>
                                                <div>
                                                    <select value={sortMode} className="bg-indigo-light ml-3 mt-2 text-lg" onChange={handleSort}>
                                                        <option value="">Sort by</option>
                                                        <option value="lowserial">Lowest Serial Number</option>
                                                        <option value="highserial">Highest Serial Number</option>
                                                        <option value="newlisting">Newest Listing</option>
                                                        <option value="oldlisting">Oldest Listing</option>
                                                        <option value="team">Team</option>
                                                    </select>
                                                </div>
                                            </form>
                                        {/* </div> */}
                                        <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                    </div>
                                    <div className="bg-indigo-light ml-1 h-11 w-60" onClick={() => setFilter(false)}>
                                        <div className="ml-1 mt-2">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <input {...register("search")} className="text-xl ml-3 appearance-none bg-indigo-light focus:outline-none w-40" placeholder="Search..." />
                                                <button className="">
                                                    <input type="image" src={searchIcon} className="object-none ml-8 mt-1" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full mb-4 self-center justify-center md:invisible">
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
                                                <div className="rounded-md bg-indigo-light mr-1 h-11 w-72 flex font-thin iphone5:w-56 iphoneX:w-64 md:w-80" 
                                                // onClick={() => {if(showFilter) setFilter(false) 
                                                //     else setFilter(true)}}
                                                >
                                                    {/* <div className="text-lg ml-4 mt-2 mr-24 w-10/12"> */}
                                                        <form onSubmit={handleSubmit(handleSort)}>
                                                            <div>
                                                                <select value={sortMode} className="bg-indigo-light ml-3 mt-2 text-lg" onChange={handleSort}>
                                                                    <option value="">Sort by</option>
                                                                    <option value="lowserial">Lowest Serial Number</option>
                                                                    <option value="highserial">Highest Serial Number</option>
                                                                    <option value="newlisting">Newest Listing</option>
                                                                    <option value="oldlisting">Oldest Listing</option>
                                                                    <option value="team">Team</option>
                                                                </select>
                                                            </div>
                                                        </form>
                                                    {/* </div> */}
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
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="justify-center self-center w-full mt-4">
                                {displayMode ?
                                    <>
                                        <div className="flex md:ml-4 font-bold ml-8 md:ml-0">
                                            <div className="mr-6 md:ml-4 border-b-8 pb-2 border-indigo-buttonblue">
                                                ATHLETES
                                            </div>

                                            <div className="" onClick={() => {
                                                setDisplay(false)
                                            }}>
                                                PACKS
                                            </div>
                                        </div>
                                        <hr className="visible opacity-50 md:invisible"/>
                                        <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
                                            {filterMode ?
                                                playerList.map(function (player, i) {
                                                    const toFindName = player.name.toLowerCase()
                                                    const toFindTeam = player.team.toLowerCase()
                                                    const searchInfo = result.toLowerCase()
                                                    if (toFindName.includes(searchInfo) || toFindTeam.includes(searchInfo) || player.jersey.includes(searchInfo))
                                                        return (
                                                            <Link href={`/PlayerDetails?id=${player.id}`}>
                                                                <div className='mb-4' key={i}>
                                                                    <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                                </div>
                                                            </Link>
                                                    )
                                                })
                                                :
                                                playerList.map(function (player, i) {
                                                    // const toFindTeam = player.team.toLowerCase()
                                                    if (sortMode === "") {
                                                        // console.log("no sort")
                                                        return (
                                                            <Link href={`/PlayerDetails?id=${player.id}`}>
                                                                <div className='mb-4' key={i}>
                                                                    <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id}/>
                                                                </div>
                                                            </Link>
                                                        )
                                                    } else if (sortMode === "lowserial"){

                                                    }
                                                })
                                            }
                                        </div>
                                    </>
                                :
                                <>
                                    <div className="flex md:ml-4 font-bold ml-8 md:ml-0">
                                        <div className="md:ml-4 mr-6" onClick={() => {
                                            setDisplay(true)
                                        }}>
                                            ATHLETESs
                                        </div>

                                        <div className="border-b-8 pb-2 border-indigo-buttonblue">
                                            PACKS
                                        </div>
                                    </div>
                                    <hr className="visible opacity-50 md:invisible"/>
                                    <div className="md:ml-16 grid grid-cols-0 md:grid-cols-4 mt-12 justify-center">
                                        {packList.map(function(data,i){
                                            return(
                                                <div className='' key={i}>
                                                    <SquadPackComponent
                                                        imagesrc={data.image}
                                                        packName={data.name}
                                                        releaseValue={data.release}
                                                        link={data.key}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                                }
                            </div>
                        {/* </PortfolioContainer> */}
                        </div>
                    </div>
                    )}
                </Main>
                </div>
            </div>
        </>
    )
}
export default Portfolio;