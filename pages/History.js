import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React, { useEffect, useState } from 'react'
import HeaderBack from '../components/HeaderBack';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import PortfolioContainer from '../components/PortfolioContainer';
import TokenGridCol2 from '../components/TokenGridCol2';
import PerformerContainer from '../components/PerformerContainer';
import { useRouter } from 'next/router';
import { MobileView, BrowserView } from 'react-device-detect';
import DesktopNavbar from '../components/DesktopNavbar';
import Link from 'next/link'

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
    },
]

const gameInfo = [ // sample game info
    {
        id: '1',
        isActivePlay: true,
        type: 'Daily',
        week: '',
        entry: '3', 
        desc: 'Successful Daily Play entry.', // active play
        date: 'July 2, 2021', // active play
        rank: '', // history
        score: '', // history
        prize: '', // history
        tokenList: playerList,
    },
    {
        id: '2',
        isActivePlay: true,
        type: 'Daily',
        week: '',
        entry: '', 
        desc: 'Successful Daily Play entry.', // active play
        date: 'July 8, 2021', // active play
        rank: '', // history
        score: '', // history
        prize: '', // history
        tokenList: playerList,
    },
    {
        id: '3',
        isActivePlay: true,
        type: 'Seasonal',
        week: '3',
        entry: '', 
        desc: 'Successful Daily Play entry.', // active play
        date: 'July 14, 2021', // active play
        rank: '', // history
        score: '', // history
        prize: '', // history
        tokenList: playerList,
    },
    {
        id: '4',
        isActivePlay: false,
        type: 'Seasonal',
        week: '1',
        entry: '', 
        desc: '', // active play
        date: '', // active play
        rank: '2', // history
        score: '96.5', // history
        prize: '15', // history
    },
    {
        id: '5',
        isActivePlay: false,
        type: 'Daily',
        week: '',
        entry: '5', 
        desc: '', // active play
        date: '', // active play
        rank: '1', // history
        score: '98.7', // history
        prize: '30', // history
        tokenList: playerList,
    },
    {
        id: '6',
        isActivePlay: false,
        type: 'Weekly',
        week: '',
        entry: '3', 
        desc: '', // active play
        date: '', // active play
        rank: '10', // history
        score: '70.3', // history
        prize: '1', // history
        tokenList: playerList,
    },
]

export default function History(props) {
    const [isActivePlay, setActive] = useState(false)
    const [isClosed, setClosed] = useState(true)
    const { query } = useRouter();
    // console.log("Game ID: "+query.id)
    
    return (
        <>
            <BrowserView>
                <div className={`font-montserrat h-screen relative flex`}>
                    <DesktopNavbar/>

                    <div className="flex flex-col w-full h-screen">
                        <Main color="indigo-dark">
                            <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">
                                <Link href="/Play/">
                                    <div className="text-indigo-white flex ml-6 mt-12">
                                        <div className="font-bold mr-2">&#x3c;</div><div>Back</div>
                                    </div>
                                </Link>
                                <PortfolioContainer align="justify-center" title="ENTRY SUMMARY">
                                    {gameInfo.map(function(data,i){
                                        if(query.id === data.id){
                                            if(data.isActivePlay){
                                                return(
                                                    <>
                                                        <div className="ml-7 mt-7 text-sm">
                                                            <div className="flex text-sm">
                                                                <div>
                                                                    {data.type.toUpperCase()} PLAY {data.entry}
                                                                </div>
                                                                {data.week ?
                                                                    <div className="ml-2">
                                                                        (WEEK {data.week})
                                                                    </div>
                                                                :
                                                                    <></>
                                                                }
                                                            </div>

                                                            <div className="font-thin mt-4">
                                                                Successful {data.type} Play entry.
                                                            </div>

                                                            <div className="font-thin">
                                                                {data.date}
                                                            </div>
                                                        </div>

                                                        <div className="justify-center flex w-full self-center mt-10">
                                                            <div className="grid grid-cols-4">
                                                                {playerList.map(function(data,i){
                                                                    return(
                                                                        <div className='mb-12 mr-16' key={i}>
                                                                            <PerformerContainer AthleteName={data.name} AvgScore={data.avgscore} id={data.id}/>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            } else {
                                                return(
                                                    <>
                                                        <div className="ml-7 mt-7 text-sm">
                                                            <div className="flex justify-between text-sm">
                                                                <div>
                                                                    {data.type.toUpperCase()} PLAY {data.entry}
                                                                </div>
                                                                {data.week ?
                                                                    <div className="mr-16">
                                                                        (WEEK {data.week})
                                                                    </div>
                                                                :
                                                                    <></>
                                                                }
                                                            </div>

                                                            <div className="flex font-thin mt-4 text-sm">
                                                                <div className="flex flex-col mr-10">
                                                                    <div>
                                                                        Rank
                                                                    </div>
                                                                    <div>
                                                                        {data.rank}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col mr-10">
                                                                    <div>
                                                                        Score
                                                                    </div>
                                                                    <div>
                                                                        {data.score}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col">
                                                                    <div>
                                                                        Prize
                                                                    </div>
                                                                    <div>
                                                                        {data.prize} UST
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="justify-center flex w-full self-center mt-10">
                                                            <div className="grid grid-cols-4">
                                                                {playerList.map(function(data,i){
                                                                    return(
                                                                        <div className='mb-12 mr-16' key={i}>
                                                                            <PerformerContainer AthleteName={data.name} AvgScore={data.avgscore} id={data.id}/>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }   
                                        }            
                                    })}
                                </PortfolioContainer>

                            </div>
                        </Main>
                    </div>
                </div>
            </BrowserView>
            <MobileView>
                <div className={`font-montserrat h-screen relative`}>
                    <HeaderBack link="/Play"/>

                    <div className="flex flex-col w-full h-screen">
                        <Main color="indigo-dark">
                            <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">
                                <PortfolioContainer align="justify-center" title="ENTRY SUMMARY">
                                    {gameInfo.map(function(data,i){
                                        if(query.id === data.id){
                                            if(data.isActivePlay){
                                                return(
                                                    <>
                                                        <div className="ml-7 mt-7 text-sm">
                                                            <div className="flex justify-between text-sm">
                                                                <div>
                                                                    {data.type.toUpperCase()} PLAY {data.entry}
                                                                </div>
                                                                {data.week ?
                                                                    <div className="mr-16">
                                                                        (WEEK {data.week})
                                                                    </div>
                                                                :
                                                                    <></>
                                                                }
                                                            </div>

                                                            <div className="font-thin mt-4">
                                                                Successful {data.type} Play entry.
                                                            </div>

                                                            <div className="font-thin">
                                                                {data.date}
                                                            </div>
                                                        </div>

                                                        <div className="justify-center flex md:w-96 md:self-center mt-10">
                                                            <TokenGridCol2>
                                                                {playerList.map(function(data,i){
                                                                    return(
                                                                        <div className='mb-12' key={i}>
                                                                            <PerformerContainer AthleteName={data.name} AvgScore={data.avgscore} id={data.id}/>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </TokenGridCol2>
                                                        </div>
                                                    </>
                                                )
                                            } else {
                                                return(
                                                    <>
                                                        <div className="ml-7 mt-7 text-sm">
                                                            <div className="flex justify-between text-sm">
                                                                <div>
                                                                    {data.type.toUpperCase()} PLAY {data.entry}
                                                                </div>
                                                                {data.week ?
                                                                    <div className="mr-16">
                                                                        (WEEK {data.week})
                                                                    </div>
                                                                :
                                                                    <></>
                                                                }
                                                            </div>

                                                            <div className="flex font-thin mt-4 text-sm">
                                                                <div className="flex flex-col mr-10">
                                                                    <div>
                                                                        Rank
                                                                    </div>
                                                                    <div>
                                                                        {data.rank}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col mr-10">
                                                                    <div>
                                                                        Score
                                                                    </div>
                                                                    <div>
                                                                        {data.score}
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col">
                                                                    <div>
                                                                        Prize
                                                                    </div>
                                                                    <div>
                                                                        {data.prize} UST
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }   
                                        }            
                                    })}

                                    <div className="justify-center flex md:w-96 md:self-center mt-10">
                                        <TokenGridCol2>
                                            {playerList.map(function(data,i){
                                                return(
                                                    <div className='mb-12' key={i}>
                                                        <PerformerContainer AthleteName={data.name} AvgScore={data.avgscore} id={data.id}/>
                                                    </div>
                                                )
                                            })}
                                        </TokenGridCol2>
                                    </div>
                                </PortfolioContainer>

                            </div>
                        </Main>
                    </div>
                </div>
            </MobileView>
        </>
    )
}