import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PortfolioContainer from '../components/PortfolioContainer'
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PlayerContainer from '../components/PlayerContainer';
import PlayerStats from '../components/PlayerStats';
import filterIcon from '../public/images/filter.png'

const player = 
    {
        id: 320,
        name: 'STEPHEN CURRY',
        avgscore: 86.3,
        silvercost: 78.9,
        goldcost: 80,
        stats: 86.5
    }

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

const PlayerDetails = () => {
    const { handleSubmit } = useForm()
    const [isClosed, setClosed] = useState(true)
    const [statfilter, setFilter] = useState("sevendays")

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    return(
        <>
            <div className={`font-montserrat h-screen relative`}>
                <Navbar/>
                <HeaderBase/>

                <div className="flex flex-col w-full h-screen">
                    <Main color="indigo-dark">
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

                                        <div className="mt-8 mb-6 flex justify-center">
                                            {playerdata.map(function(data, i){
                                                if(statfilter === data.key)
                                                    return <PlayerStats player={data} key={i}/>
                                            })}
                                        </div>
                                    </div>
                                </PortfolioContainer>
                            </div>
                        </div>
                    </Main>
                </div>

            </div>
        </>
    )
}

export default PlayerDetails;