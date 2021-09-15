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
import AthleteGrid from '../components/AthleteGrid';
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
import filterIcon from '../public/images/filter.png'
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
    avgscore: "86.3",
    id: "320",
  },
  {
    name: "LEBRON JAMES",
    avgscore: "96.0",
    id: "25",
  },
  {
    name: "DEVIN BOOKER",
    avgscore: "76.8",
    id: "16450",
  },
  {
    name: "ARMONI BROOKS",
    avgscore: "83.0",
    id: "21300",
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

                <TitledContainer align="justify-start" className="flex flex-col w-full justify-start" title="TOP PERFORMERS">
                  {/* <div className="flex flex-col justify-center self-center">
                    <div className="rounded-md bg-indigo-light mr-1 h-11 w-80 flex justify-between self-center font-thin md:w-80 mt-6">
                        <div className="text-lg ml-4 mt-2">
                            <form onSubmit={handleSubmit(handleFilter)}>
                                <select value={statfilter} className='filter-select bg-indigo-light' onChange={handleFilter}>
                                <select className='filter-select bg-indigo-light' >
                                    <option name="sevendays" value="sevendays">Last 7 days</option>
                                    <option name="month" value="month">Last month</option>
                                    <option name="year" value="year">Last year</option>
                                </select>
                            </form>
                        </div>
                        <img src={filterIcon} className="object-none w-4 mr-4" />
                    </div>
                  </div> */}

                  <TokenGridCol2>
                    {topPerformerList.map(function(data, i){
                      return (
                        <div className="mt-2 mb-4">
                          <PerformerContainer AthleteName={data.name} CoinValue={data.value} id={data.id} AvgScore={data.avgscore}/>
                        </div>
                      )
                    })}
                  </TokenGridCol2>
                </TitledContainer>

                <TitledContainer title="PACKS">
                  <HorizontalScrollContainer>
                    {packList.map(function(data, i){
                      return(
                        <HorizontalContainer><PackContainer AthleteName={data.name} releaseValue={data.release} CoinValue={data.value}/></HorizontalContainer>
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
    return (<div>This is what you see on desktop!</div>);
  }


}






