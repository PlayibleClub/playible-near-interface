import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import * as React from 'react';
import Header from '../components/Header';
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
import PackContainer from '../components/PackContainer';
// import fantasyLogo from '../public/fantasyinvestar.png';
// import daily from '../public/daily.png';
// import weekly from '../public/weekly.png';
// import seasonal from '../public/seasonal.png';
// import wallet from '../public/wallet.png';
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
    const animals = ['Dog', 'Bird', 'Cat', 'Mouse', 'Horse'];




    const [isClosed, setClosed] = React.useState(true)






    return (
        <>
            <link href="https://fonts.googleapis.com/css?family=Nunito:400,700&display=swap" rel="stylesheet"></link>
            <div className=" h-screen relative">


                {isClosed ? null : <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                    <Navbar> </Navbar>
                    <div className="w-2/6 h-screen" onClick={() => setClosed(true)}></div>
                </div>}


                <div className="flex flex-col w-full ">
                    <Header>

                        <Button color="indigo-light" saturation="0" textColor="white-light" textSaturation="500" onClick={() => setClosed(false)} size="py-1 px-1">=</Button>









                        <div className="text-white-light">
                            {' '}
                            <img src="images/fantasyinvestar.png" alt="Img" />
                        </div>
                        <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={interactWallet} size="py-1 px-1">
                            <img src="images/wallet.png" alt="Img" />
                            {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
                        </Button>

                    </Header>








                    <Main color="indigo-dark">




                        <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">

















                            <TitledContainer title="PACKS">

                                <PackContainer AthleteName="PREMIUM PACK" CoinValue="54" releaseValue="2" />
                                <PackContainer AthleteName="PREMIUM PACK" CoinValue="54" releaseValue="2" />
                                <PackContainer AthleteName="PREMIUM PACK" CoinValue="54" releaseValue="2" />
                                <PackContainer AthleteName="PREMIUM PACK" CoinValue="54" releaseValue="2" />

                            </TitledContainer>


                        </div>

                    </Main>

                </div>

            </div>
        </>
    );
}
