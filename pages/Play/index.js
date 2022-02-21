import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import PlayComponent from './components/PlayComponent';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import Container from '../../components/containers/Container';
import BaseModal from '../../components/modals/BaseModal'
import claimreward from '../../public/images/claimreward.png';

import { newPlaylist, ongoingPlaylist, completedPlaylist } from './data';

const Play = () => {
    const { status, connect, disconnect, availableConnectTypes } = useWallet();
    const [activeCategory, setCategory] = useState("new")
    const [claimModal, showClaimModal] = useState(false)

    const interactWallet = () => {
        if (status === WalletStatus.WALLET_CONNECTED) {
            disconnect();
        } else {
            connect(availableConnectTypes[1]);
        }
    };
    const dispatch = useDispatch();
    const connectedWallet = useConnectedWallet();


    useEffect(() => {
        if(typeof connectedWallet !== 'undefined')
        dispatch(getPortfolio({walletAddr: connectedWallet.walletAddress}))
    }, [connectedWallet])
    
    return (
        <>
            { claimModal === true &&
                <>
                    <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
                        <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
                            <button onClick={()=>{showClaimModal(false)}}>
                                <div className="absolute top-0 right-0 p-4 font-black">
                                    X
                                </div>
                            </button>

                            <div className="mt-2">
                                <img src={claimreward}/>

                                <div className="mt-4 bg-indigo-yellow p-2 text-center font-bold text-xl">
                                    CONGRATULATIONS
                                </div>

                                <div className="text-3xl font-bold font-monument mt-2">4,000 UST</div>
                                <div className="font-monument text-1xl">EARNED</div>
                            </div>
                        </div>
                    </div>
                </>
            }
            <Container>
                <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <Main color="indigo-white">
                        <div className="flex flex-col">
                            <div className="flex">
                                <div className="flex-initial">
                                <PortfolioContainer title="PLAY" textcolor="text-indigo-black"/>
                                </div>
                                <div className="ml-6 mt-8 text-xs underline">MY ACTIVITY</div>
                            </div>

                            <div className="flex flex-col mt-6">
                                { activeCategory === "new" &&
                                    <>
                                        <div className="flex font-bold ml-8 md:ml-0 font-monument">
                                            <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue">
                                                NEW
                                            </div>

                                            <div className="mr-6" onClick={() => {setCategory("ongoing")}}>
                                                ON-GOING
                                            </div>

                                            <div className="" onClick={() => {setCategory("completed")}}>
                                                COMPLETED
                                            </div>
                                        </div>

                                        <hr className="opacity-50"/>
                                    
                                        <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                                                {newPlaylist.map(function(data,i){
                                                    return (
                                                        <div className="mr-6">
                                                            <PlayComponent
                                                                type="new"
                                                                icon={data.icon}
                                                                prizePool={data.prizePool}
                                                                timeLeft={data.timeLeft}
                                                                startDate={data.startDate}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </>
                                }
                                { activeCategory === "ongoing" &&
                                    <>
                                        <div className="flex font-bold ml-8 md:ml-0 font-monument">
                                            <div className="mr-6 md:ml-8" onClick={() => {setCategory("new")}}>
                                                NEW
                                            </div>

                                            <div className="mr-6 border-b-8 pb-2 border-indigo-buttonblue">
                                                ON-GOING
                                            </div>

                                            <div className="" onClick={() => {setCategory("completed")}}>
                                                COMPLETED
                                            </div>
                                        </div>

                                        <hr className="opacity-50"/>
                                    
                                        <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                                                {ongoingPlaylist.map(function(data,i){
                                                    return (
                                                        <div className="mr-6">
                                                            <PlayComponent
                                                                type="ongoing"
                                                                icon={data.icon}
                                                                prizePool={data.prizePool}
                                                                timeLeft={data.timeLeft}
                                                                startDate={data.startDate}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    </>
                                }
                                { activeCategory === "completed" &&
                                    <>
                                        <div className="flex font-bold ml-8 md:ml-0 font-monument">
                                            <div className="mr-6 md:ml-8" onClick={() => {setCategory("new")}}>
                                                NEW
                                            </div>

                                            <div className="mr-6" onClick={() => {setCategory("ongoing")}}>
                                                ON-GOING
                                            </div>

                                            <div className="border-b-8 pb-2 border-indigo-buttonblue" >
                                                COMPLETED
                                            </div>
                                        </div>

                                        <hr className="opacity-50"/>
                                    
                                        <div className="mt-4 flex ml-6 grid grid-cols-0 md:grid-cols-3">
                                                {completedPlaylist.map(function(data,i){
                                                    return (
                                                        <div className="flex">                                                    
                                                            <div className="mr-6">
                                                                <PlayComponent
                                                                    type="completed"
                                                                    icon={data.icon}
                                                                    prizePool={data.prizePool}
                                                                    startDate={data.startDate}
                                                                    timeLeft={data.timeLeft}
                                                                />

                                                                <div className="">
                                                                    <button className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center" onClick={()=>showClaimModal(true)}>
                                                                        <div className="text-indigo-white">
                                                                            CLAIM REWARD
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    )
                                                })}
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </Main>
                </div>
            </Container>
        </>
    );
}
export default Play;