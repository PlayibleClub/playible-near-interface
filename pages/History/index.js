import React, { useEffect, useState } from 'react'
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import PerformerContainer from '../../components/containers/PerformerContainer';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Container from '../../components/containers/Container';
import Image from 'next/image';

const playerList = [ // player list for testing purposes
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors', //2
        id: '320',
        cost: '420 UST',
        jersey: '30',
        positions: ['PG', 'SG'],
        avgscore: '86.3',
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        listing: '12/12/2024', //4
        rarity: 'base',
    },
    {
        name: 'TAUREAN PRINCE',
        team: 'Minnesota Timberwolves', //6
        id: '14450',
        cost: '41 UST',
        jersey: '12',
        positions: ['PG'],
        avgscore: '66.5',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: '12/12/2021', //3
        rarity: 'silver'
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers', //5
        id: '25',
        cost: '840 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        avgscore: '96.0',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: '11/12/2025', //6
        rarity: 'gold'
    },
    {
        name: 'DEVIN BOOKER',
        team: 'Phoenix Suns', //7
        id: '16450',
        cost: '21 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        avgscore: '76.8',
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
        listing: '12/11/2025', //5
        rarity: 'silver'
    },
    {
        name: 'ARMONI BROOKS',
        team: 'Houston Rockets', //3
        id: '21300',
        cost: '45.5 UST',
        jersey: '23',
        positions: ['SG', 'C'],
        avgscore: '81.0',
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        listing: '12/12/2001', //1
        rarity: 'silver'
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets', //1
        id: '12300',
        cost: '180 UST',
        jersey: '07',
        positions: ['PG'],
        avgscore: '83.0',
        grad1: 'indigo-black',
        grad2: 'indigo-red',
        listing: '10/12/2004', //2
        rarity: 'gold'
    },
    {
        name: 'KOBE BRYANT',
        team: 'Los Angeles Lakers', //4
        id: '999',
        cost: '999 UST',
        jersey: '24',
        positions: ['SG'],
        avgscore: '96.0',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: '12/12/2025', //7
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

const gameInfo = [
    {
        title: 'BEST OF THE EAST',
        date: '2 days ago',
        id: '1',
        icon: 'beastoftheeast',
        prizePool: '7,484.00',
        currPlayers: '100',
        maxPlayers: '100',
        timeLeft: '06:23:05',
        isActive: true,
        description: 'Go head-to-head with the best of the East. Select 5 players and create your fantasy lineup now.'
    },
    {
        title: 'CERTIFIED BALLER',
        date: '6 days ago',
        id: '2',
        icon: 'baller',
        prizePool: '2,398.90',
        currPlayers: '77',
        maxPlayers: '100',
        timeLeft: '05:38:09',
        isActive: true,
        description: 'Go head-to-head with the best of the East. Select 5 players and create your fantasy lineup now.'
    },
    {
        title: 'TRIPLE DOUBLE',
        date: '2 weeks ago',
        id: '3',
        icon: 'tripledouble',
        prizePool: '9,300.00',
        currPlayers: '100',
        maxPlayers: '100',
        timeLeft: '00:13:54',
        isActive: false,
        tokenList: playerList,
        description: 'Go head-to-head with the best of the East. Select 5 players and create your fantasy lineup now.'
    },
    {
        title: 'EAST VS. WEST',
        date: '3 weeks ago',
        id: '4',
        icon: 'tripledouble',
        prizePool: '1,300.00',
        currPlayers: '100',
        maxPlayers: '100',
        timeLeft: '00:13:54',
        isActive: false,
        tokenList: playerList,
        description: 'Go head-to-head with the best of the East. Select 5 players and create your fantasy lineup now.'
    },
    {
        title: 'BEST ROOKIE YEAR',
        date: '1 month ago',
        id: '5',
        icon: 'baller',
        prizePool: '112,300.00',
        currPlayers: '100',
        maxPlayers: '100',
        timeLeft: '00:03:54',
        isActive: false,
        tokenList: playerList,
        description: 'Go head-to-head with the best of the East. Select 5 players and create your fantasy lineup now.'
    },
]

export default function History(props) {
    const [isActivePlay, setActive] = useState(false)
    const [isClosed, setClosed] = useState(true)
    const { query } = useRouter();
    // console.log("Game ID: "+query.id)
    
    return (
        <Container>
            <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                <Main color="indigo-white">
                    <div className="flex flex-col ml-6">
                        <Link href="/Play/">
                            <div className="text-indigo-black flex mt-6 md:mt-12">
                                <div className="font-bold mr-2">&#x3c;</div><div>Back</div>
                            </div>
                        </Link>
                        <PortfolioContainer title="ENTRY SUMMARY" textcolor="text-indigo-black">
                            {gameInfo.map(function(data,i){
                                if(query.id === data.id){
                                    if(!data.isActivePlay){
                                        const playicon = "/../public/images/playthumbnails/"+data.icon+".png"
                                        return(
                                            <div className="mt-6">
                                                <div className="flex flex-col md:flex-row justify-center md:justify-between">
                                                    <div className="md:w-1/2 mr-6">
                                                        <Image
                                                            src={playicon}
                                                            width={420}
                                                            height={225}
                                                        />
                                                    </div>

                                                    <div className="md:w-1/2 mt-8 md:mt-0">
                                                        <div className="font-thin">
                                                            PRIZE POOL
                                                        </div>

                                                        <div className="text-3xl">
                                                            ${data.prizePool}
                                                        </div>

                                                        <div className="md:w-3/4 mt-8 font-thin mr-4">
                                                            {data.description}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="justify-center flex self-center mt-10">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 w-full">
                                                        {playerList.map(function(data,i){
                                                            return(
                                                                <div className='mb-4' key={i}>
                                                                    <PerformerContainer AthleteName={data.name} AvgScore={data.avgscore} id={data.id} rarity={data.rarity}/>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return(
                                            <>
                                            hello
                                            </>
                                        )
                                    }   
                                }            
                            })}
                        </PortfolioContainer>

                    </div>
                </Main>
            </div>
        </Container>
    )
}