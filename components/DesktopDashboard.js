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

            <div className="font-montserrat h-screen relative bg-indigo-dark flex flex-row">


                <DesktopNavbar> </DesktopNavbar>

                <div className="w-full flex flex-col">
                    <DesktopHeaderBase></DesktopHeaderBase>

                    <div className="flex flex-row h-full w-full">
                        <div className="flex flex-col h-full w-1/2">
                            <div className="h-1/2">
                                <TitledContainer title="DASHBOARD">
                                    <div className="w-11/12 h-4/5">
                                        <RoundedContainer className="">

                                            <div className="flex flex-row  text-xs">
                                                <div className="relative">
                                                    <img className="h-40 w-40 mt-5 mb-3" src="images/PieChart.png" alt="Img" />
                                                    <div className="absolute left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                                        <div className="font-normal">Net Worth</div>
                                                        <div >$44,023.00</div>
                                                    </div>
                                                </div>


                                                <div className="h-full flex justify-center items-center">
                                                    <div className="h-1/4 ">
                                                        <div data-test="TokenGridCol2" className={`font-extralight grid  gap-x-1 gap-y-0 grid-cols-2 `}>
                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-2" src="images/Ellipse.png" alt="Img" />
                                                                <div className="mb-5">Lakers</div>
                                                            </div>

                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-2" src="images/Ellipse.png" alt="Img" />
                                                                <div className="mb-5">Rockets</div>
                                                            </div>
                                                            <div className="flex flex-row">
                                                                <img className="h-3 w-3 mr-2" src="images/Ellipse.png" alt="Img" />
                                                                <div className="mb-5">Warriors</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </RoundedContainer>



                                    </div>
                                </TitledContainer>
                            </div>
                            <div className="h-1/2">
                                <TitledContainer title="GAME RESULTS">

                                    <GameresultsComponent></GameresultsComponent>
                                </TitledContainer>
                            </div>

                        </div>


                        <div className="flex flex-col h-full w-1/2">
                            <div className="h-1/2">
                                <TitledContainer title="WALLET">

                                    <div className="w-11/12">
                                        <RoundedContainer>
                                            <div className="flex flex-col h-48 w-1/2">
                                                <div>998 UST
                                                </div>
                                            </div>
                                            <div className="relative h-11/12 w-3/12">
                                                <img className="absolute right-0 top-0 h-40 w-40 mr-2" src="images/terra-logo.png" alt="Img" />
                                            </div>


                                        </RoundedContainer>
                                    </div>
                                </TitledContainer>
                            </div>
                            <div className="h-1/2">
                                <TitledContainer title="TOP PERFORMERS">

                                    <TokenGridCol2>

                                        {playerList.map((player) => (



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

                                        ))}

                                    </TokenGridCol2>

                                </TitledContainer>
                            </div>

                        </div>





                    </div>




                </div>











            </div>
        </>
    );
}
