import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React, { Component, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import LargePackContainer from '../../components/containers/LargePackContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';

export default function Packs() {
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

    const packList = [
        {
            name: 'PREMIUM PACK',
            key: 'prem2',
            release: '2',
            price: '20 UST',
            image: '/images/packimages/PremiumRelease2.png',

        },
        {
            name: 'PREMIUM PACK',
            key: 'prem3',
            release: '3',
            price: '35 UST',
            image: '/images/packimages/PremiumRelease3.png',

        },
        {
            name: 'BASE PACK',
            key: 'base2',
            release: '2',
            price: '20 UST',
            image: '/images/packimages/BaseRelease1.png',
        },
    ]

    const [isNarrowScreen, setIsNarrowScreen] = useState(false);

    // useEffect(() => {
    //     // set initial value
    //     const mediaWatcher = window.matchMedia("(max-width: 500px)")
    
    //     //watch for updates
    //     function updateIsNarrowScreen(e) {
    //       setIsNarrowScreen(e.matches);
    //     }
    //     mediaWatcher.addEventListener('change', updateIsNarrowScreen)
    
    //     // clean up after ourselves
    //     return function cleanup() {
    //       mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
    //     }
    //   })
    
    // if (isNarrowScreen) {
    return (
        <>
            <Container>
                <PortfolioContainer color="indigo-white" textcolor="indigo-black" title="PACKS">
                    <div className="invisible">
                        <BackFunction prev="/Packs"/>
                    </div>
                    <div className="grid grid-cols-4 pl-10">
                        {
                            packList.map(function (pack, i) {
                                const toFindName = pack.name.toLowerCase()
                                const searchInfo = result.toLowerCase()
                                if (toFindName.includes(searchInfo))
                                    return (
                                        <div className="mx-4 py-4 mr-40">
                                            <a href={`/PackDetails?id=${pack.key}`}>
                                                <div className="mx-left" key={i}>
                                                    <LargePackContainer
                                                        PackName={pack.name}
                                                        CoinValue={pack.price}
                                                        releaseValue={pack.release}
                                                        imagesrc={pack.image} />
                                                </div>
                                            </a>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </PortfolioContainer>
            </Container>
        </>
    )
}
