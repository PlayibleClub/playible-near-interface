import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';

import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import HeaderBase from '../components/HeaderBase';
import HeaderBack from '../components/HeaderBack';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import RoundedContainer from '../components/RoundedContainer';
import DesktopDashboard from '../components/DesktopDashboard';
import TokenGridCol2 from '../components/TokenGridCol2';
// import Roundedinput from '../components/Roundedinput';
import AthleteContainer from '../components/AthleteContainer';
import PerformerContainer from '../components/PerformerContainer';
import GameresultsComponent from '../components/GameresultsComponent';
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

const marketplaceList = [
  {
    name: "STEPHEN CURRY",
    value: "54",
  },
  {
    name: "LEBRON JAMES",
    value: "43",
  },
  {
    name: "STEPHEN CURRY",
    value: "54",
  },
  {
    name: "STEPHEN CURRY",
    value: "54",
  },
]

const topPerformerList = [
  {
    name: "STEPHEN CURRY",
    value: "86.3",
  },
  {
    name: "LEBRON JAMES",
    value: "96.0",
  },
  {
    name: "DEVIN BOOKER",
    value: "76.8",
  },
  {
    name: "ARMONI BROOKS",
    value: "83.0",
  },
]

const packList = [
  {
    name: "PREMIUM PACK",
    value: "54",
    release: "2",
  },
  {
    name: "PREMIUM PACK",
    value: "84",
    release: "5",
  },
  {
    name: "PREMIUM PACK",
    value: "54",
    release: "3",
  },
  {
    name: "PREMIUM PACK",
    value: "54",
    release: "10",
  },
]

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
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    // set initial value
    const mediaWatcher = window.matchMedia("(max-width: 500px)")

    //watch for updates
    function updateIsNarrowScreen(e) {
      setIsNarrowScreen(e.matches);
    }
    mediaWatcher.addEventListener('change', updateIsNarrowScreen)

    // clean up after ourselves
    return function cleanup() {
      mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
    }
  })

  if (isNarrowScreen) {
    return (
      <>
        <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
          {isClosed ? null : <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
            <Navbar> </Navbar>
            <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}></div>
          </div>}

          <div className="flex flex-col w-full ">
            <HeaderBase isClosed={isClosed} setClosed={setClosed} />

            <Main color="indigo-dark overflow-y-scroll">
              <div className="flex flex-col w-full h-full overflow-x-hidden">
                <TitledContainer title="MARKETPLACE">
                    <HorizontalScrollContainer>
                      <div className="ml-3 mt-4 flex">
                        {marketplaceList.map(function(data, i){
                          return (
                              <HorizontalContainer> 
                                <AthleteTokenContainer AthleteName={data.name} CoinValue={data.value} />
                              </HorizontalContainer>
                          )
                        })}
                      </div>
                    </HorizontalScrollContainer>
                </TitledContainer>

                <TitledContainer title="PLAY">
                  <div className="p-10 w-full grid gap-x-0 gap-y-6 grid-cols-2 self-center">
                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/daily.png" alt="Italian Trulli" /></div>
                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/weekly.png" alt="Italian Trulli" /></div>
                    <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/seasonal.png" alt="Italian Trulli" /></div>
                  </div>

                </TitledContainer>

                <TitledContainer className="flex" title="GAME RESULTS">
                  <GameresultsComponent/>
                </TitledContainer>

                <TitledContainer align="justify-start" className=" flex w-full justify-start" title="TOP PERFORMERS">
                  <TokenGridCol2>
                    {topPerformerList.map(function(data, i){
                      return (
                        <PerformerContainer AthleteName={data.name} CoinValue={data.value} />
                      )
                    })}
                  </TokenGridCol2>
                </TitledContainer>

                <TitledContainer title="PACKS">
                  <HorizontalScrollContainer>
                    {packList.map(function(data, i){
                      return(
                        <HorizontalContainer><PackContainer AthleteName={data.name} CoinValue={data.value} releaseValue={data.release} /></HorizontalContainer>
                      )
                    })}
                  </HorizontalScrollContainer>
                </TitledContainer>
              </div>
            </Main>
          </div>
        </div>
      </>
    );



  } else {
    return (<DesktopDashboard></DesktopDashboard>);
  }


}






