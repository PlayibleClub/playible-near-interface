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








                            <TitledContainer align="justify-center" title="PLAY">
                                <div className="pl-2 w-5/6 grid gap-x-1 gap-y-2 grid-cols-2">
                                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/daily.png" alt="Italian Trulli" /></div>
                                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/weekly.png" alt="Italian Trulli" /></div>
                                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/seasonal.png" alt="Italian Trulli" /></div>

                                </div>

                            </TitledContainer>












                            <TitledContainer className=" flex " title="MY ACTIVITY">

                                <div className="flex rounded-md w-5/6 h-5/6">
                                    <select className="w-11/12 bg-indigo-light" name="games" id="cars">
                                        <option value="All Games">All Games</option>
                                        <option value="Some games">Some Games</option>
                                        <option value="Games this week">Games this week</option>
                                        <option value="Games for the month">Games for the month</option>
                                    </select>
                                </div>


                                <div className="mt-2">
                                    <div className="flex rounded-md w-5/6 h-5/6 bg-indigo-dark">

                                        <ul className="w-full">
                                            {animals.map((animal) => (
                                                <li><GameResultContainer></GameResultContainer></li>

                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </TitledContainer>



















                        </div>

                    </Main>

                </div>

            </div>
        </>
    );
}
