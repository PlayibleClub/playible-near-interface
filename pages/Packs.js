import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import * as React from 'react';
import Header from '../components/Header';
import HeaderBase from '../components/HeaderBase';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import PackContainer from '../components/PackContainer';

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

                <div className="flex flex-col w-full ">


                    <div className="text-white-light">
                        {' '}
                        <img src="images/fantasyinvestar.png" alt="Img" />
                    </div>
                    <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={interactWallet} size="py-1 px-1">
                        <img src="images/wallet.png" alt="Img" />
                        {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
                    </Button>


                    <Main color="indigo-dark">
                        <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">
                            <TitledContainer title="PACKS">
                                <PackContainer AthleteName="PREMIUM PACK" CoinValue="54" releaseValue="2" />
                            </TitledContainer>
                        </div>
                    </Main>
                </div>
            </div>
        </>
    );
}
