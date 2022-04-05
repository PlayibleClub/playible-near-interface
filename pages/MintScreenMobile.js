import React, { useState } from 'react'
import underline from '../public/images/underline.png'
import blackunderline from '../public/images/blackunderline.png'
import emptyToken from '../public/images/emptyToken.png'
import emptyGoldToken from '../public/images/emptyGoldToken.png'
import whiteTokenOutline from '../public/images/whiteTokenOutline.png'
import HeaderBack from '../components/headers/HeaderBack';
import { useRouter } from 'next/router';
import Main from '../components/Main';
import Link from 'next/link'
import PlayerContainer from '../components/containers/PlayerContainer'

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
    },
]

const tokenList = [
    {
        id: '12300',
        rarity: 'Gold'
    },
    {
        id: '320',
        rarity: 'Base'
    },
    {
        id: '320',
        rarity: 'Base'
    },
    {
        id: '21300',
        rarity: 'Silver'
    },
    {
        id: '320',
        rarity: 'Base'
    },
    {
        id: '14450',
        rarity: 'Silver'
    },
    {
        id: '320',
        rarity: 'Silver'
    },
]

const MintScreenMobile = () => {
    const [congratsModal, displayCongrats] = useState(false);    
    const { query } = useRouter();
    const [silverDropdown, displaySilver] = useState(false);
    const [goldDropdown, displayGold] = useState(false);

    const playerToFind = playerList.find(playerList => playerList.id === query.id)
    const baseTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'Base')
    }, 0)

    const silverTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'Silver')
    }, 0)
    
    const filteredList = tokenList.filter((list,i) => {
        return tokenList[i].id === playerToFind.id
    })
    const baseFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'Base'
    })
    const silverFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'Silver'
    })
    
    return (
        <>
            { congratsModal ?
                <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                    <div className="relative p-8 bg-indigo-white w-60 h-24 m-auto flex-col flex rounded-lg items-center">
                        <Link href={`/AssetDetails?id=${query.id}`}>
                        <button >
                            <div className="absolute top-0 right-0 p-4 font-black">
                                X
                            </div>
                        </button>
                        </Link>

                        <div className="font-bold flex flex-col">
                            CONGRATULATIONS!
                            <img src={blackunderline}/>
                        </div>
                    </div>
                </div>
            :
                <></>
            }
            <>
                <div className="flex flex-col overflow-auto">
                    <div className={`font-montserrat h-screen relative`}>
                        <HeaderBack link={`/PlayerDetails?id=${query.id}`}/>

                        <Main color="indigo-dark">
                            <div className="flex flex-col justify-center text-indigo-white ml-7 mt-6 mb-24">
                                <div className="flex flex-col mt-4 justify-center">
                                    <div className="mr-12">
                                        <PlayerContainer playerID={playerToFind.id}/>
                                    </div>

                                    <div className="text-xl font-bold mt-6">
                                        UPGRADE TOKEN
                                        <img src={underline} className=""/>
                                    </div>

                                    <div>
                                        <div>
                                            <div className="text-md font-bold">
                                                {playerToFind.name}
                                            </div>

                                            <div className="font-thin mt-4 text-sm">
                                                AVERAGE SCORE
                                            </div>

                                            <div className="text-md font-bold">
                                                {playerToFind.avgscore}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                

                                <div className="mt-2">
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
                                                            <div className="text-indigo-white" onClick={()=>{displayCongrats(true)}}>
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
                                                            <img src={whiteTokenOutline} className="w-10 ml-2"/>
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

                                    <hr className="opacity-25 w-5/6"/>

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
                                                            <div className="text-indigo-white" onClick={()=>{displayCongrats(true)}}>
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
                                                            <img src={whiteTokenOutline} className="w-10 ml-2"/>
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
                        </Main>
                    </div>
                </div>
            </>
        </>
    )
}
export default MintScreenMobile;
