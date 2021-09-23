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
import GameresultsComponent from './GameresultsComponent';


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

                    <div data-test="titledcontainer" className={`text-white-light bg-white text-1x1 font-bold justify-start flex flex-col w-full h-full `}>
                        <div className="flex flex-row justify-between">
                            <div className="pb-3 pt-6 ml-7 justify-start sm:text-2xl md:text-base">
                                PORTFOLIO
                                <img src="images/underline.png" className="sm:object-none md:w-6" />
                            </div>

                            <div className="place-self-center">


                                <div className="flex">


                                    <div className="rounded-md bg-indigo-light mr-1 h-11 flex font-thin w-9/12" onClick={() => setFilter(true)}>
                                        <div className="text-lg ml-4 mt-2 mr-36 w-9/12">
                                            Filter by
                                        </div>
                                        <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                    </div>




                                    <div className="rounded-md bg-indigo-light ml-1 h-11 w-9/12 flex justify-center">
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <input {...register("search")} className="text-xl ml-3 appearance-none bg-indigo-light focus:outline-none w-10/12" placeholder="Search..." />
                                                <button className="w-1/12 md:w-9">
                                                    <input type="image" src={searchIcon} className="object-none md:ml-3 md:mt-1" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>






                                </div>
                            </div>






                        </div>

                        <div className="flex justify-center">



                            <div className="bg-clear h-full w-11/12 mt-10">
                                <div data-test="2columngrid" className={`h-full grid  gap-x-5 gap-y-3 grid-cols-3 `}>

                                    {playerList.map(function (player, i) {
                                        const toFindName = player.name.toLowerCase()

                                        const searchInfo = result.toLowerCase()

                                        if (toFindName.includes(searchInfo))
                                            return (
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
                                            )
                                    })}




                                </div>


                            </div>

                        </div>







                    </div>







                </div>











            </div>
        </>
    );
}
