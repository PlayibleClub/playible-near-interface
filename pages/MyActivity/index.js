import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { getPortfolio } from '../../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import Link from 'next/link';
import PlayComponent from '../Play/components/PlayComponent';
import Container from '../../components/containers/Container';
import myactivityicon from '../../public/images/myactivity.png'
import win from '../../public/images/myactivitywin.png'
import BackButton from '../../components/buttons/BackFunction'
import 'regenerator-runtime/runtime';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'
TimeAgo.addDefaultLocale(en)

const Play = () => {
    const { status, connect, disconnect, availableConnectTypes } = useWallet();
    const [activeCategory, setCategory] = useState("activeplays")

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
            <Container>
                <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <Main color="indigo-white">
                        <div className="flex flex-col">
                            <div className="flex">
                                {/* <BackButton prev="/Play"/> */}
                                <PortfolioContainer title="MY ACTIVITY" textcolor="text-indigo-black">
                                    <div className="flex flex-col mt-6 mb-12">
                                        { activeCategory === "activeplays" &&
                                            <>
                                                <div className="flex font-bold ml-6 md:ml-0 font-monument">
                                                    <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue">
                                                        ACTIVE PLAYS
                                                    </div>

                                                    <div className="" onClick={() => {setCategory("playhistory")}}>
                                                        PLAY HISTORY
                                                    </div>
                                                </div>

                                                <hr className="opacity-50"/>
                                            
                                            </>
                                        }
                                        { activeCategory === "playhistory" &&
                                            <>
                                                <div className="flex font-bold ml-6 md:ml-0 font-monument">
                                                    <div className="mr-6 md:ml-8" onClick={() => {setCategory("activeplays")}}>
                                                        ACTIVE PLAYS
                                                    </div>

                                                    <div className="border-b-8 pb-2 border-indigo-buttonblue">
                                                        PLAY HISTORY
                                                    </div>
                                                </div>

                                                <hr className="opacity-50"/>
                                            
                                                <div className="mt-8 ml-12 mr-8 md:mr-32">
                                                </div>
                                            </>
                                        }
                                    </div>
                                </PortfolioContainer>
                            </div>
                        </div>
                    </Main>
                </div>
            </Container>
        </>
    );
}
export default Play;