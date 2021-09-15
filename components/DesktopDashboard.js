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
import AthleteGrid from './AthleteGrid';
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


















    return (
        <>

            <div className="font-montserrat h-screen relative bg-indigo-dark flex flex-row">


                <DesktopNavbar> </DesktopNavbar>

                <div className="w-full flex flex-col">
                    <DesktopHeaderBase></DesktopHeaderBase>

                    <div className="flex flex-row h-full w-full">
                        <div className="flex flex-col h-full w-1/2">
                            <div className="h-1/2">
                                <TitledContainer title="MARKETPLACE">

                                    <GameresultsComponent></GameresultsComponent>
                                </TitledContainer>
                            </div>
                            <div className="h-1/2">
                                <TitledContainer title="MARKETPLACE">

                                    <GameresultsComponent></GameresultsComponent>
                                </TitledContainer>
                            </div>

                        </div>


                        <div className="flex flex-col h-full w-1/2">
                            <div className="h-1/2">
                                <TitledContainer title="MARKETPLACE">

                                    <GameresultsComponent></GameresultsComponent>
                                </TitledContainer>
                            </div>
                            <div className="h-1/2">
                                <TitledContainer title="MARKETPLACE">

                                    <GameresultsComponent></GameresultsComponent>
                                </TitledContainer>
                            </div>

                        </div>





                    </div>




                </div>











            </div>
        </>
    );
}
