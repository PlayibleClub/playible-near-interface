import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import * as React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import RoundedContainer from '../components/RoundedContainer';
import AthleteGrid from '../components/AthleteGrid';
import TokenGridCol2 from '../components/TokenGridCol2';
import TeamMemberContainer from '../components/TeamMemberContainer';
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

            <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>


                {isClosed ? null : <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                    <Navbar> </Navbar>
                    <div className="w-2/6 h-screen" onClick={() => setClosed(true)}></div>
                </div>}


                <div className="flex flex-col w-full ">



                    <HeaderBase isClosed={isClosed} setClosed={setClosed} ></HeaderBase>





                    <Main color="indigo-dark">




                        <div className="flex flex-col  w-full h-full overflow-y-scroll overflow-x-hidden">
                            <TitledContainer title="CREATE LINEUP">

                                <div className="font-thin mb-12 mt-8"> create your own Fantasy Team</div>


                                <TokenGridCol2>
                                    <TeamMemberContainer AthleteName="STEPHEN CURRY" Averagescore="54" />
                                    <TeamMemberContainer AthleteName="STEPHEN CURRY" Averagescore="54" />
                                    <TeamMemberContainer AthleteName="STEPHEN CURRY" Averagescore="54" />
                                    <TeamMemberContainer AthleteName="STEPHEN CURRY" Averagescore="54" />
                                    <TeamMemberContainer AthleteName="STEPHEN CURRY" Averagescore="54" />

                                </TokenGridCol2>

                            </TitledContainer>










                        </div>

                    </Main>

                </div>

            </div>
        </>
    );
}
