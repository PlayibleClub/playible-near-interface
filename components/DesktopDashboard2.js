import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';

import React, { Component, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import DesktopHeaderBase from './DesktopHeaderBase';
import DesktopHeader from './DesktopHeader';

import Button from './Button';
import DesktopNavbar from './DesktopNavbar';
import Main from './Main';
import TitledContainer from './TitledContainer';
import RoundedContainer from './RoundedContainer';
import DashboardRoundedContainer from './DashboardRoundedContainer';
import TokenGridCol2 from './TokenGridCol2';
import Roundedinput from '../components/Roundedinput';
import AthleteContainer from './AthleteContainer';
import PerformerContainer from './PerformerContainer';
import GameResultContainer from './GameResultContainer';
import GameresultsComponentDesktop from './GameresultsComponentDesktop';
import PackContainer from './PackContainer';


import RowContainer from './RowContainer';
import HorizontalScrollContainer from './HorizontalScrollContainer';
import HorizontalContainer from './HorizontalContainer';
import LargePackContainer from './LargePackContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'

import AthleteTokenContainer from './AthleteTokenContainer';
import AthleteTokenContainerDesktop from './AthleteTokenContainerDesktop';

export default function Home() {
    const { status, connect, disconnect, availableConnectTypes } = useWallet();

    const interactWallet = () => {
        if (status === WalletStatus.WALLET_CONNECTED) {
            disconnect();
        } else {
            connect(availableConnectTypes[1]);
        }
    };





    const [filterInfo, handleFilter] = React.useState(false)

    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [posFilter, setPosFilter] = useState("")
    const [isClosed, setClosed] = React.useState(true)
    const [filterMode, setMode] = React.useState(false)
    const [showFilter, setFilter] = React.useState(false)
    const [colormode, setColor] = useState("light");


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

        console.log(data)
    }
    const key1 = 'team'



    const resultlist = [
        {
            win: 'yes',
            date: '07/12/21',
            rank: '02',
            points: '96.5',
        },
        {
            win: 'no',
            date: '07/05/21',
            rank: '07',
            points: '78.4',
        },
        {
            win: 'yes',
            date: '06/28/21',
            rank: '01',
            points: '98.7',
        },
        {
            win: 'no',
            date: '07/05/21',
            rank: '09',
            points: '55.0',
        },
        {
            win: 'no',
            date: '07/13/21',
            rank: '03',
            points: '23.0',
        },
    ]

    const packList = [
        {
            name: 'PREMIUM PACK',
            release: '2',
            price: '20 UST',
            image: 'images/packimages/PremiumRelease2.png',

        },
        {
            name: 'PREMIUM PACK',
            release: '3',
            price: '35 UST',
            image: 'images/packimages/PremiumRelease3.png',

        },
        {
            name: 'BASE PACK',
            release: '2',
            price: '20 UST',
            image: 'images/packimages/BaseRelease1.png',
        },



    ]

    const playerList = [
        {
            name: 'STEPHEN CURRY',
            team: 'Golden State Warriors',
            id: '320',
            averageScore: '40',
            cost: '420 UST',
            jersey: '30',
            positions: ['PG', 'SG'],
            grad1: 'indigo-blue',
            grad2: 'indigo-bluegrad',
        },
        {
            name: 'LEBRON JAMES',
            team: 'Los Angeles Lakers',
            id: '25',
            averageScore: '25',
            cost: '840 UST',
            jersey: '23',
            positions: ['PG', 'SG'],
            grad1: 'indigo-purple',
            grad2: 'indigo-purplegrad',
        },
        {
            name: 'DEVIN BOOKER',
            team: 'Phoenix Suns',
            id: '16450',
            averageScore: '27',
            cost: '21 UST',
            jersey: '01',
            positions: ['SF', 'C'],
            grad1: 'indigo-darkblue',
            grad2: 'indigo-darkbluegrad',
        },

    ]














    return (
        <>

            <div className={`font-montserrat h-screen pb-2 relative bg-${colormode}-defaultcolor3 flex flex-row`}>


                <DesktopNavbar colormode={colormode} setColor={setColor}> </DesktopNavbar>

                <div className="w-full flex flex-col">
                    <DesktopHeaderBase color={`${colormode}-defaultcolor2`} buttoncolor={`${colormode}-defaultcolor1`}  ></DesktopHeaderBase>

                    <div className={`flex flex-row h-full w-full overflow-y-scroll overflow-x-hidden     ${colormode == 'dark' ? 'text-white-light' : 'text-black-dark'}   `}>
                        <div className="flex flex-col h-full w-7/12">
                            <div className="h-7/12">

                                <div className=" h-4/5">



                                    <DashboardRoundedContainer margin="ml-6" colormode={colormode} title="MARKETPLACE">
                                        <div className=" h-80 flex justify-center mt-10">

                                            <div className="h-3/4 w-10/12 ">
                                                <div className="flex flex-row justify-center">



                                                    {playerList.map((player) => (
                                                        <AthleteTokenContainerDesktop AthleteName={player.name} CoinValue={player.cost} />


                                                    ))}


                                                </div>
                                            </div>
                                        </div>
                                    </DashboardRoundedContainer>

                                </div>

                            </div>
                            <div className="">

                                <DashboardRoundedContainer margin="ml-6" colormode={colormode} title="PLAY">
                                    <div className=" h-52 flex justify-center mt-10">

                                        <div className="h-3/4 w-11/12 ">
                                            <div className="flex flex-row justify-between">



                                                <div className=" flex justify-center m-2"><img className="rounded-" src="images/daily.png" alt="Italian Trulli" /></div>
                                                <div className=" flex justify-center m-2"><img className="rounded-" src="images/weekly.png" alt="Italian Trulli" /></div>
                                                <div className=" flex justify-center m-2"><img className="rounded-" src="images/seasonal.png" alt="Italian Trulli" /></div>


                                            </div>
                                        </div>
                                    </div>
                                </DashboardRoundedContainer>


                            </div>

                            <div className="">

                                <DashboardRoundedContainer margin="ml-6" colormode={colormode} title="PACKS">

                                    <HorizontalScrollContainer>
                                        <div className="flex mt-1">
                                            {packList.map(function (data, i) {
                                                return (
                                                    <HorizontalContainer><PackContainer AthleteName={data.name} releaseValue={data.release} CoinValue={data.value} /></HorizontalContainer>
                                                )
                                            })}
                                        </div>
                                    </HorizontalScrollContainer>


                                </DashboardRoundedContainer>


                            </div>

                        </div>


                        <div className="flex flex-col h-full w-5/12">

                            <DashboardRoundedContainer margin="ml-1" colormode={colormode} title="GAME RESULTS">
                                <div className="flex justify-center mt-4 h-auto w-full">
                                    <GameresultsComponentDesktop></GameresultsComponentDesktop>

                                </div>

                            </DashboardRoundedContainer>
                            <div className=" h-auto">
                                <DashboardRoundedContainer margin="ml-1" colormode={colormode} title="TOP PERFORMERS">
                                    <div className=" flex flex-col justify-center mt-10 ">
                                        <div data-test="2columngrid" className={`h-full grid  gap-x-2 gap-y-2 grid-cols-2 `}>

                                            {playerList.map((player) => (
                                                <div className="h-64">

                                                    <PerformerContainer AthleteName={player.name} CoinValue={player.cost} id={player.id} AvgScore={player.cost} />
                                                </div>
                                            ))}

                                        </div>

                                        <div className="h-24"></div>

                                    </div>
                                </DashboardRoundedContainer>



                            </div>

                        </div>





                    </div>




                </div>











            </div>
        </>
    );
}
