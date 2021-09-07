import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import * as React from 'react';
import Header from '../components/Header';
import HeaderBase from '../components/HeaderBase';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import RoundedContainer from '../components/RoundedContainer';
import AthleteGrid from '../components/AthleteGrid';
// import Roundedinput from '../components/Roundedinput';
import AthleteContainer from '../components/AthleteContainer';
import PerformerContainer from '../components/PerformerContainer';
import GameResultContainer from '../components/GameResultContainer';
import RowContainer from '../components/RowContainer';
import HorizontalScrollContainer from '../components/HorizontalScrollContainer';
import HorizontalContainer from '../components/HorizontalContainer';
import LargePackContainer from '../components/LargePackContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'

import AthleteTokenContainer from '../components/AthleteTokenContainer';


export default function Home() {
    const { status, connect, disconnect, availableConnectTypes } = useWallet();

    const interactWallet = () => {
        if (status === WalletStatus.WALLET_CONNECTED) {
            disconnect();
        } else {
            connect(availableConnectTypes[1]);
        }
    };




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










    return (
        <>

            <div className="font-montserrat h-screen relative bg-indigo-dark">


                {isClosed ? null : <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                    <Navbar> </Navbar>
                    <div className="w-2/6 h-screen" onClick={() => setClosed(true)}></div>
                </div>}

                <HeaderBase isClosed={isClosed} setClosed={setClosed} ></HeaderBase>
                <div className="flex flex-col w-full ">









                    <Main color="indigo-dark">




                        <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">

















                            <TitledContainer title="PACKS">
                                <div>



                                    <div className="flex w-11/12 mb-4 mt-4">
                                        {filterMode ?
                                            <>
                                                <div className="rounded-md bg-indigo-light mr-1 w-12 h-11" onClick={() => {
                                                    setMode(false)
                                                    setResult("")
                                                }}>
                                                    <div className="ml-3.5 mt-4">
                                                        <img src={filterIcon} />
                                                    </div>
                                                </div>

                                                <div className="rounded-md bg-indigo-light ml-1 h-11 w-9/12 flex">
                                                    <div className="ml-1 mt-2">
                                                        <form onSubmit={handleSubmit(onSubmit)}>
                                                            <input {...register("search")} className="text-xl ml-3 appearance-none bg-indigo-light focus:outline-none w-10/12" placeholder="Search..." />
                                                            <button className="w-1/12">
                                                                <input type="image" src={searchIcon} className="object-none" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="flex">
                                                    <div className="rounded-md bg-indigo-light mr-1 h-11 w-9/12 flex font-thin" onClick={() => setFilter(true)}>
                                                        <div className="text-lg ml-4 mt-2 mr-36 w-9/12">
                                                            Filter by
                                                        </div>
                                                        <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                                    </div>

                                                    <div className="rounded-md bg-indigo-light ml-1 w-12 h-11" onClick={() => {
                                                        setMode(true)
                                                        setFilter(false)
                                                        setResult("")
                                                    }}>
                                                        <div className="ml-4 mt-3">
                                                            <img src={searchIcon} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>









                                    {packList.map((pack) => (
                                        <LargePackContainer PackName={pack.name} CoinValue={pack.price} releaseValue={pack.release} imagesrc={pack.image} />

                                    ))}

                                </div>

                            </TitledContainer>


                        </div>

                    </Main>

                </div>

            </div>
        </>
    );
}
