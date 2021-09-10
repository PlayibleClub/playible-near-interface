import React, { useEffect, useState } from 'react'
import PortfolioContainer from '../components/PortfolioContainer'
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PlayerContainer from '../components/PlayerContainer';
import PlayerStats from '../components/PlayerStats';
import filterIcon from '../public/images/filter.png'

const player = 
    {
        id: 30,
        name: 'STEPHEN CURRY',
        avgscore: 86.3,
        silvercost: 78.9,
        goldcost: 80,
        stats: 86.5
    }

const playerdata = [
    {
        key: 'Last 7 days',
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
        key: 'Last month',
        points: {
            score: 50,
            pointspos: "2nd",
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
]

const PlayerDetails = () => {
    const [isClosed, setClosed] = useState(true)
    const [filter, handleFilter] = useState("Last 7 days")
    const list = playerdata[0]

    return(
        <>
            <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
                {isClosed ? null : 
                    <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                        <Navbar> </Navbar>
                        <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}/>
                    </div>
                }
                <HeaderBase isClosed={isClosed} setClosed={setClosed}/>

                <Main color="indigo-dark overflow-y-scroll">
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                        <div className="mt-8 ml-8">
                            <PlayerContainer playerID={player.id}/>
                        </div>
                        <PortfolioContainer title="PLAYER DETAILS">
                            <div className="flex flex-col justify-center self-center">
                                <div>
                                    <div className="font-thin mt-8">
                                        #{player.id}/25000
                                    </div>

                                    <div>
                                        {player.name}
                                    </div>

                                    <div className="font-thin mt-4">
                                        AVERAGE SCORE
                                    </div>

                                    <div>
                                        {player.avgscore}
                                    </div>
                                </div>
                                

                                <button className="bg-indigo-buttonblue w-72 h-12 text-center rounded-md text-lg mt-12">
                                    <div className="pt-1">
                                        UPGRADE
                                    </div>
                                </button>

                                <div className="flex justify-center self-center mt-8">
                                    <div className="flex flex-col mr-4">
                                        <div>
                                            <PlayerContainer playerID={player.id}/>
                                        </div>
                                        <div className="text-sm mt-2">
                                            {player.name}
                                        </div>
                                        <div className="font-thin text-xs">
                                            SILVER
                                        </div> 
                                        <div className="mt-4">
                                            {player.silvercost} UST
                                        </div>
                                    </div>

                                    <div className="flex flex-col ml-4">
                                        <div>
                                            <PlayerContainer playerID={player.id}/>
                                        </div>
                                        <div className="text-sm mt-2">
                                            {player.name}
                                        </div>
                                        <div className="font-thin text-xs">
                                            GOLD
                                        </div> 
                                        <div className="mt-4">
                                            {player.goldcost} UST
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PortfolioContainer>

                        <div className="mt-12">
                            <PortfolioContainer title="PLAYER STATS" stats={player.stats}>
                                <div className="flex flex-col justify-center self-center">
                                    <div className="rounded-md bg-indigo-light mr-1 h-11 w-80 flex justify-between self-center font-thin md:w-80 mt-6">
                                        <div className="text-lg ml-4 mt-2">
                                            {/* <select className='filter-select' onChange={handleFilter()}>
                                                <option value="Last 7 days">Last 7 days</option>
                                                <option value="Last month">Last month</option>
                                                <option value="Last year">Last year</option>
                                            </select> */}
                                            Last 7 days
                                        </div>
                                        <img src={filterIcon} className="object-none w-4 mr-4" />
                                    </div>

                                    <div className="mt-8 mb-6 flex justify-center">
                                        <PlayerStats player={list}/>
                                    </div>
                                </div>
                            </PortfolioContainer>
                        </div>
                    </div>
                </Main>

            </div>
        </>
    )
}

export default PlayerDetails;