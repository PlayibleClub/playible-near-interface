import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PortfolioContainer from '../components/PortfolioContainer'
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PlayerContainer from '../components/PlayerContainer';
import PlayerStats from '../components/PlayerStats';
import filterIcon from '../public/images/filter.png';
import DesktopNavbar from '../components/DesktopNavbar';
import TitledContainer from '../components/TitledContainer';
import underlineIcon from '../public/images/blackunderline.png'
import Image from 'next/image'
import emptyToken from '../public/images/emptyToken.png'
import emptyGoldToken from '../public/images/emptyGoldToken.png'
import tokenOutline from '../public/images/tokenOutline.png'
import { useRouter } from 'next/router';
import Link from 'next/link';
import {BrowserView, MobileView} from 'react-device-detect';

const playerdata = [
    {
        key: 'sevendays',
        points: {
            score: 35,
            pos: "3rd",
        },
        rebounds: {
            score: 5.5,
            pos: "24th",
        },
        assists: {
            score: 23,
            pos: "55th",
        },
        blocks: {
            score: 5,
            pos: "5th",
        },
        steals: {
            score: 11,
            pos: "6th",
        },
    },
    {
        key: 'month',
        points: {
            score: 50,
            pos: "2nd",
        },
        rebounds: {
            score: 9,
            pos: "45th",
        },
        assists: {
            score: 44,
            pos: "24th",
        },
        blocks: {
            score: 13,
            pos: "9th",
        },
        steals: {
            score: 18,
            pos: "7th",
        },
    },
    {
        key: 'year',
        points: {
            score: 86,
            pos: "1st",
        },
        rebounds: {
            score: 19,
            pos: "37th",
        },
        assists: {
            score: 68,
            pos: "16th",
        },
        blocks: {
            score: 32,
            pos: "5th",
        },
        steals: {
            score: 23,
            pos: "3rd",
        },
    },
]

const playerList = [ // player list for testing purposes
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
        silvercost: '420 UST',
        goldcost: '521 UST',
        jersey: '30',
        positions: ['PG', 'SG'],
        avgscore: '86.3',
        stats: 86.5,
        data: playerdata,
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        rarity: 'silver',
    },
    {
        name: 'TAUREAN PRINCE',
        team: 'Minnesota Timberwolves',
        id: '14450',
        silvercost: '41 UST',
        goldcost: '55 UST',
        jersey: '12',
        positions: ['PG'],
        avgscore: '66.5',
        stats: 66.9,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'silver'
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers',
        id: '25',
        silvercost: '840 UST',
        goldcost: '1100 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        avgscore: '96.0',
        stats: 90.2,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'gold'
    },
    {
        name: 'DEVIN BOOKER',
        team: 'Phoenix Suns',
        id: '16450',
        silvercost: '21 UST',
        goldcost: '34 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        avgscore: '76.8',
        stats: 80.5,
        data: playerdata,
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
        rarity: 'silver'
    },
    {
        name: 'ARMONI BROOKS',
        team: 'Houston Rockets',
        id: '21300',
        silvercost: '45.5 UST',
        goldcost: '66.6 UST',
        jersey: '23',
        positions: ['SG', 'C'],
        avgscore: '81.0',
        stats: 76.2,
        data: playerdata,
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        rarity: 'silver'
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets',
        id: '12300',
        silvercost: '180 UST',
        goldcost: '220 UST',
        jersey: '07',
        positions: ['PG'],
        avgscore: '83.0',
        stats: 77.7,
        data: playerdata,
        grad1: 'indigo-black',
        grad2: 'indigo-red',
        rarity: 'gold'
    },
    {
        name: 'KOBE BRYANT',
        team: 'Los Angeles Lakers',
        id: '999',
        silvercost: '999 UST',
        goldcost: '1001 UST',
        jersey: '24',
        positions: ['SG'],
        avgscore: '96.0',
        stats: 99.9,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'silver'
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

const tokenList = [
    {
        id: '12300',
        rarity: 'gold'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '21300',
        rarity: 'silver'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '14450',
        rarity: 'silver'
    },
    {
        id: '320',
        rarity: 'silver'
    },
]

const PlayerDetails = () => {
    const { handleSubmit } = useForm()
    const [statfilter, setFilter] = useState("sevendays")
    const [displayModal, setModal] = useState(false);
    const [silverDropdown, displaySilver] = useState(false);
    const [goldDropdown, displayGold] = useState(false);
    const [congratsModal, displayCongrats] = useState(false);
    const { query } = useRouter();

    const playerToFind = playerList.find(playerList => playerList.id === query.id)
    const baseTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'base')
    }, 0)

    const silverTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'silver')
    }, 0)
    
    const filteredList = tokenList.filter((list,i) => {
        return tokenList[i].id === playerToFind.id
    })
    const baseFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'base'
    })
    const silverFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'silver'
    })

    // console.log(tokenCount)

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    const [isNarrowScreen, setIsNarrowScreen] = useState(false);

    return (
        <>
            <div className={`font-montserrat h-screen relative`}>
                { congratsModal ?
                    <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                        <div className="relative p-8 bg-indigo-white w-60 h-24 m-auto flex-col flex rounded-lg items-center">
                            <button onClick={()=>{displayCongrats(false)}}>
                                <div className="absolute top-0 right-0 p-4 font-black">
                                    X
                                </div>
                            </button>

                            <div className="font-bold flex flex-col">
                                CONGRATULATIONS!
                                <img src={underlineIcon} className="sm:object-none md:w-6" />
                            </div>
                        </div>
                    </div>
                :
                    <></>
                }
                { displayModal ?
                    <>
                        <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                            <div className="relative p-8 bg-indigo-white w-11/12 md:w-1/2 h-10/12 md:h-3/5 m-auto flex-col flex rounded-lg items-center">
                                <button onClick={()=>{setModal(false)}}>
                                    <div className="absolute top-0 right-0 p-4 font-black">
                                        X
                                    </div>
                                </button>

                                <div className="flex flex-col md:flex-row justify-center">
                                    <div className="flex flex-col mt-4">
                                        <div className="mr-12">
                                            <PlayerContainer playerID={playerToFind.id} rarity='base'/>
                                        </div>
                                        <div>
                                            <div>
                                                <div className="font-thin text-xs mt-4">
                                                    #{playerToFind.id}/25000
                                                </div>

                                                <div className="text-sm font-bold">
                                                    {playerToFind.name}
                                                </div>

                                                <div className="font-thin mt-4 text-xs">
                                                    AVERAGE SCORE
                                                </div>

                                                <div className="text-sm font-bold">
                                                    {playerToFind.avgscore}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    <div className="mt-4 md:mt-2">
                                        <div className="font-bold flex flex-col">
                                            UPGRADE TOKEN
                                            <img src={underlineIcon} className="sm:object-none w-6" />
                                        </div>

                                        <div className="mt-6 mb-6">
                                            { silverDropdown ?
                                                <div onClick={()=>displaySilver(false)} className="flex flex-col w-72">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <img src={emptyToken} />
                                                        </div>
                                                        <div className="font-bold">
                                                            Upgrade to Silver
                                                        </div>
                                                        <div className="font-bold text-xl">&#x5e;</div>
                                                    </div>

                                                    {baseTokenCount > 2 && baseFilteredList.length > 0 ?
                                                        <>
                                                            <div className="flex items-center self-center mt-4">
                                                                {[...Array(3)].map((element, i)=>{
                                                                    return (
                                                                        <img src={emptyToken} className="w-10 mr-2" key={i}/>
                                                                    )
                                                                })}
                                                            </div>

                                                            <button className="bg-indigo-buttonblue w-72 h-10 text-center font-bold rounded-md text-sm mt-4 self-center">
                                                                <div className="text-indigo-white" onClick={()=>{setModal(false);displayCongrats(true)}}>
                                                                    MINT BLACK COIN
                                                                </div>
                                                            </button>
                                                        </>
                                                    :
                                                        <>
                                                            <div className="flex items-center self-center mt-4">
                                                                {[...Array(baseTokenCount)].map((element, i)=>{
                                                                    return(
                                                                        <img src={emptyToken} className="w-10 mr-2" key={i}/>
                                                                    )
                                                                })}
                                                                <img src={tokenOutline} className="w-10 ml-2"/>
                                                            </div>

                                                            <button className="bg-indigo-lightgray w-72 h-10 text-center font-bold rounded-md text-sm mt-4 self-center">
                                                                <div className="text-indigo-white">
                                                                    MINT BLACK COIN
                                                                </div>
                                                            </button>
                                                        </>
                                                    }
                                                </div>
                                            :
                                                <div onClick={()=>{displaySilver(true);displayGold(false)}} className="flex justify-between items-center w-72">
                                                    <div>
                                                        <img src={emptyToken} />
                                                    </div>
                                                    <div className="font-bold">
                                                        Upgrade to Silver
                                                    </div>
                                                    <div className="font-bold">v</div>
                                                </div>
                                            }
                                        </div>

                                        <hr className="opacity-25"/>

                                        <div className="mt-6">
                                            { goldDropdown ?
                                                <div onClick={()=>displayGold(false)} className="flex flex-col w-72">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <img src={emptyGoldToken} />
                                                    </div>
                                                    <div className="font-bold">
                                                        Upgrade to Gold
                                                    </div>
                                                    <div className="font-bold text-xl">&#x5e;</div>
                                                </div>

                                                {silverTokenCount > 2 && silverFilteredList.length > 0 ?
                                                        <>
                                                            <div className="flex items-center self-center mt-4">
                                                                {[...Array(3)].map((element, i)=>{
                                                                    return (
                                                                        <img src={emptyToken} className="w-10 mr-2" key={i}/>
                                                                    )
                                                                })}
                                                            </div>

                                                            <button className="bg-indigo-buttonblue w-72 h-10 text-center font-bold rounded-md text-sm mt-4 self-center">
                                                                <div className="text-indigo-white" onClick={()=>{setModal(false);displayCongrats(true)}}>
                                                                    MINT SILVER COIN
                                                                </div>
                                                            </button>
                                                        </>
                                                    
                                                    :
                                                        <>
                                                            <div className="flex items-center self-center mt-4">
                                                                {[...Array(silverTokenCount)].map((element, i)=>{
                                                                    return(
                                                                        <img src={emptyToken} className="w-10 mr-2" key={i}/>
                                                                    )
                                                                })}
                                                                <img src={tokenOutline} className="w-10 ml-2"/>
                                                            </div>

                                                            <button className="bg-indigo-lightgray w-72 h-10 text-center font-bold rounded-md text-sm mt-4 self-center">
                                                                <div className="text-indigo-white">
                                                                    MINT SILVER COIN
                                                                </div>
                                                            </button>
                                                        </>
                                                    }
                                            </div>
                                            :
                                                <div onClick={()=>{displayGold(true);displaySilver(false)}} className="flex justify-between items-center w-72">
                                                    <div>
                                                        <img src={emptyGoldToken} />
                                                    </div>
                                                    <div className="font-bold">
                                                        Upgrade to Gold
                                                    </div>
                                                    <div className="font-bold">v</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                :
                    <></>
                }
                <div className="flex">
                    <div className="invisible w-0 md:visible md:w-1/4">
                        <DesktopNavbar/>
                    </div>

                    <div className="visible md:invisible">
                        <Navbar/>
                        <HeaderBase/>
                    </div>

                    <div className="flex flex-col w-full h-screen">
                        <Main color="indigo-dark">
                            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                                <div className="md:mt-20 md:ml-24">
                                    <PortfolioContainer title="PLAYER DETAILS">
                                        <div className="flex flex-col mt-2 mb-8">
                                            <div className="flex md:flex-row flex-col md:mt-8">
                                                <div>
                                                    <div className="ml-8 md:ml-0 mr-12">
                                                        <PlayerContainer playerID={playerToFind.id} rarity='base'/>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="ml-8 md:ml-0 mb-4 md:mb-0">
                                                        <div className="font-thin text-sm">
                                                            #{playerToFind.id}/25000
                                                        </div>

                                                        <div className="text-sm">
                                                            {playerToFind.name}
                                                        </div>

                                                        <div className="font-thin mt-4 text-sm">
                                                            AVERAGE SCORE
                                                        </div>

                                                        <div className="text-sm">
                                                            {playerToFind.avgscore}
                                                        </div>
                                                    </div>
                                                

                                                    <button className="bg-indigo-buttonblue w-5/6 md:w-60 h-10 text-center font-bold text-md mt-4 self-center justify-center">
                                                        <div className="" onClick={()=>{setModal(true)}}>
                                                            UPGRADE
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </PortfolioContainer>

                                    <PortfolioContainer title="OTHER TOKENS">
                                        <div className="flex mt-8 ml-8 grid grid-cols-2 md:grid-cols-4">
                                            <div className="flex flex-col">
                                                <div>
                                                    <PlayerContainer playerID={playerToFind.id} rarity='silver'/>
                                                </div>
                                                <div className="text-sm mt-2">
                                                    {playerToFind.name}
                                                </div>
                                                <div className="font-thin text-xs">
                                                    SILVER
                                                </div> 
                                                <div className="mt-4 text-sm">
                                                    {playerToFind.silvercost}
                                                </div>
                                            </div>
                                        

                                            <div className="flex flex-col">
                                                <div>
                                                    <PlayerContainer playerID={playerToFind.id} rarity='gold'/>
                                                </div>
                                                <div className="text-sm mt-2">
                                                    {playerToFind.name}
                                                </div>
                                                <div className="font-thin text-xs">
                                                    GOLD
                                                </div> 
                                                <div className="mt-4 text-sm">
                                                    {playerToFind.goldcost}
                                                </div>
                                            </div>

                                            {/* TEMPLATE FOR NEW RARITY */}
                                            {/* <div className="flex flex-col">
                                                <div>
                                                    <PlayerContainer playerID={playerToFind.id} rarity='gold'/>
                                                </div>
                                                <div className="text-sm mt-2">
                                                    {playerToFind.name}
                                                </div>
                                                <div className="font-thin text-xs">
                                                    GOLD
                                                </div> 
                                                <div className="mt-4 text-sm">
                                                    {playerToFind.goldcost}
                                                </div>
                                            </div> */}
                                        </div>
                                    </PortfolioContainer>

                                    <div className="mt-12 flex flex-col md:flex-row justify-between">
                                        <PortfolioContainer title="PLAYER STATS" stats={playerToFind.stats}/>
                                        <div className="self-center md:mr-24">
                                            <div className="rounded-md bg-indigo-light md:mr-7 h-11 w-80 flex justify-between self-center font-thin md:w-72 mt-4 md:mt-12">
                                                <div className="text-lg ml-4 mt-2 text-indigo-white">
                                                    <form onSubmit={handleSubmit(handleFilter)}>
                                                        <select value={statfilter} className='filter-select bg-indigo-light' onChange={handleFilter}>
                                                            <option name="sevendays" value="sevendays">Last 7 days</option>
                                                            <option name="month" value="month">Last month</option>
                                                            <option name="year" value="year">Last year</option>
                                                        </select>
                                                    </form>
                                                </div>
                                                <img src={filterIcon} className="object-none w-4 mr-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center self-center text-indigo-white md:mr-24 mb-8">
                                        <div className="mt-8 mb-6 self-center">
                                            {playerToFind.data.map(function(data, i){
                                                if(statfilter === data.key)
                                                    return <PlayerStats player={data} key={i} isNarrowScreen={isNarrowScreen}/>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Main>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlayerDetails;