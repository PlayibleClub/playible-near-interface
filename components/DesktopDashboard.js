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
import TokenGridCol2 from './TokenGridCol2';
// import Roundedinput from '../components/Roundedinput';
import AthleteContainer from './AthleteContainer';
import PerformerContainer from './PerformerContainer';
import GameResultContainer from './GameResultContainer';
import GameresultsComponent from '../components/GameresultsComponent';


import RowContainer from './RowContainer';
import HorizontalScrollContainer from './HorizontalScrollContainer';
import HorizontalContainer from './HorizontalContainer';
import LargePackContainer from './LargePackContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'

import AthleteTokenContainer from './AthleteTokenContainer';


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
        {
            name: 'KEVIN DURANT',
            team: 'Brooklyn Nets',
            id: '12300',
            averageScore: '45',
            cost: '180 UST',
            jersey: '07',
            positions: ['PG'],
            grad1: 'indigo-black',
            grad2: 'indigo-red',
        },
    ]














    return (
        <>

            <div className={`font-montserrat h-screen relative bg-${colormode}-defaultcolor3 flex flex-row`}>


                <DesktopNavbar colormode={colormode} setColor={setColor}> </DesktopNavbar>

                <div className="w-full flex flex-col">
                    <DesktopHeaderBase color={`${colormode}-defaultcolor2`} buttoncolor={`${colormode}-defaultcolor1`} ></DesktopHeaderBase>

                    <div className="flex flex-row h-full w-full">
                        <div className="flex flex-col h-full w-5/12">
                            <div className="h-5/12">
                                <TitledContainer title="DASHBOARD">
                                    <div className="w-11/12 h-4/5">
                                        <div className="ml-3 flex justify-center relative rounded-md w-full bg-indigo-light">

                                            <div className="flex flex-row  text-xs h-48 ">
                                                <div className="relative mr-2">
                                                    <img className="h-35 w-35 mt-5 mb-3" src="images/PieChart.png" alt="Img" />
                                                    <div className="absolute left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                                        <div className="font-normal">Net Worth</div>
                                                        <div >$44,023.00</div>
                                                    </div>
                                                </div>


                                                <div className="h-full flex justify-center items-center">
                                                    <div className="h-1/4 ">
                                                        <div data-test="TokenGridCol2" className={`font-extralight text-xs grid  gap-x-3 gap-y-1 grid-cols-2 `}>
                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                                <div className=" place-self-center">Lakers</div>
                                                            </div>

                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                                <div className=" place-self-center">Warriors</div>
                                                            </div>
                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                                <div className=" place-self-center">Rockets</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>



                                    </div>
                                </TitledContainer>
                            </div>
                            <div className="h-1/2">
                                <TitledContainer title="GAME RESULTS">
                                    <div className="ml-6 h-64 w-11/12">
                                        <div className=" flex justify-center relative rounded-md w-full h-full bg-indigo-light">

                                            <ul className="w-11/12">
                                                {resultlist.map((data) => (
                                                    <li>
                                                        <div>
                                                            <div className="flex flex col justify-between w-full text-xs font-thin mb-3 mt-5">
                                                                <div>{data.date}</div>
                                                                <div> {data.points}</div>

                                                            </div>
                                                            <hr className="w-full self-center opacity-25 mb-4" />
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </TitledContainer>
                            </div>

                        </div>


                        <div className="flex flex-col h-full w-7/12">
                            <div className="h-5/12">
                                <TitledContainer title="WALLET">

                                    <div className="w-full flex justify-left">
                                        <div className="ml-6 flex justify-center relative rounded-md w-8/12 bg-indigo-light">
                                            <img className="object-none absolute right-0 top-0  w-full m-0 pr-0 z-0 " src="images/terra-maskgroup.png" alt="Img" />
                                            <div className="relative flex flex-col h-48 w-full ml-4">

                                                <div className="mt-10">
                                                    <div className="text-2xl font-medium">
                                                        998 UST
                                                    </div>
                                                    <div className="mt-2 text-xs font-thin">
                                                        994 USD
                                                    </div>
                                                </div>

                                                <div className="flex flex-row mt-8 justify-around w-8/12">
                                                    <Button rounded="rounded-full " textColor="white-light" color="green-pastel" size="py-1 px-1">
                                                        <p className="text-xs font-thin ml-3 mr-3">Deposit</p>
                                                    </Button>
                                                    <Button rounded="rounded-full " textColor="white-light" color="red-pastel" size="py-1 px-1">
                                                        <p className="text-xs font-thin ml-3 mr-3">Widraw</p>
                                                    </Button>

                                                </div>



                                            </div>


                                        </div>
                                    </div>



                                </TitledContainer>
                            </div>
                            <div className="h-5/12">
                                <TitledContainer title="TOP PERFORMERS">
                                    <div className="ml-2 h-64 w-11/12">



                                        <div className="bg-clear h-full w-130">
                                            <div data-test="2columngrid" className={`h-full grid  gap-x-2 gap-y-2 grid-cols-2 `}>

                                                {playerList.map((player) => (
                                                    <div className="h-32">
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
                                                ))}

                                            </div>


                                        </div>

                                    </div>

                                </TitledContainer>
                            </div>

                        </div>





                    </div>




                </div>











            </div>
        </>
    );
}
