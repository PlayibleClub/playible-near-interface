import { useWallet, WalletStatus } from '@terra-money/wallet-provider';

import React from 'react'
import TitledContainer from '../components/TitledContainer';
import Container from '../components/Container';
import TokenGridCol2 from '../components/TokenGridCol2';
import PerformerContainer from '../components/PerformerContainer';
import GameresultsComponent from '../components/GameresultsComponent';
import HorizontalScrollContainer from '../components/HorizontalScrollContainer';
import HorizontalContainer from '../components/HorizontalContainer';
import PackContainer from '../components/PackContainer';
import AthleteTokenContainer from '../components/AthleteTokenContainer';
import {BrowserView, MobileView} from 'react-device-detect';

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

const resultlist = [
  {
      win: 'yes',
      date: '07/12/21',
      rank: '02',
      points: '96.5',
  },
  {
      win: 'no',
      date: '07/05/21',
      rank: '07',
      points: '78.4',
  },
  {
      win: 'yes',
      date: '06/28/21',
      rank: '01',
      points: '98.7',
  },
  {
      win: 'no',
      date: '07/05/21',
      rank: '09',
      points: '55.0',
  },
  {
      win: 'no',
      date: '07/13/21',
      rank: '03',
      points: '23.0',
  },
]

const playerList = [
  {
      name: 'STEPHEN CURRY',
      team: 'Golden State Warriors',
      id: '320',
      averageScore: '40',
      cost: '420 UST',
      jersey: '30',
      positions: ['PG', 'SG'],
      grad1: 'indigo-blue',
      grad2: 'indigo-bluegrad',
  },
  {
      name: 'LEBRON JAMES',
      team: 'Los Angeles Lakers',
      id: '25',
      averageScore: '25',
      cost: '840 UST',
      jersey: '23',
      positions: ['PG', 'SG'],
      grad1: 'indigo-purple',
      grad2: 'indigo-purplegrad',
  },
  {
      name: 'DEVIN BOOKER',
      team: 'Phoenix Suns',
      id: '16450',
      averageScore: '27',
      cost: '21 UST',
      jersey: '01',
      positions: ['SF', 'C'],
      grad1: 'indigo-darkblue',
      grad2: 'indigo-darkbluegrad',
  },
  {
      name: 'KEVIN DURANT',
      team: 'Brooklyn Nets',
      id: '12300',
      averageScore: '45',
      cost: '180 UST',
      jersey: '07',
      positions: ['PG'],
      grad1: 'indigo-black',
      grad2: 'indigo-red',
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
    return (
      <Container>
        <MobileView>
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
        </MobileView>

      <BrowserView>
        <Container>
          <div className="flex flex-row h-full w-full">
              <div className="flex flex-col h-full w-5/12">
                  <div className="h-5/12">
                      <TitledContainer title="DASHBOARD">
                          <div className="w-11/12 h-4/5">
                              <div className="ml-3 flex justify-center relative rounded-md w-full bg-indigo-light">

                                  <div className="flex flex-row  text-xs h-48 ">
                                      <div className="relative mr-2">
                                          <img className="h-35 w-35 mt-5 mb-3" src="images/PieChart.png" alt="Img" />
                                          <div className="absolute left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                              <div className="font-normal">Net Worth</div>
                                              <div >$44,023.00</div>
                                          </div>
                                      </div>


                                      <div className="h-full flex justify-center items-center">
                                          <div className="h-1/4 ">
                                              <div data-test="TokenGridCol2" className={`font-extralight text-xs grid  gap-x-3 gap-y-1 grid-cols-2 `}>
                                                  <div className="flex flex-row">
                                                      <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                      <div className=" place-self-center">Lakers</div>
                                                  </div>

                                                  <div className="flex flex-row">
                                                      <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                      <div className=" place-self-center">Warriors</div>
                                                  </div>
                                                  <div className="flex flex-row">
                                                      <img className="h-3 w-3 mr-1 place-self-center" src="images/Ellipse.png" alt="Img" />
                                                      <div className=" place-self-center">Rockets</div>
                                                  </div>

                                              </div>
                                          </div>
                                      </div>


                                  </div>
                              </div>



                          </div>
                      </TitledContainer>
                  </div>
                  <div className="h-1/2">
                      <TitledContainer title="GAME RESULTS">
                          <div className="ml-6 h-64 w-11/12">
                              <div className=" flex justify-center relative rounded-md w-full h-full bg-indigo-light">

                                  <ul className="w-11/12">
                                      {resultlist.map((data) => (
                                          <li>
                                              <div>
                                                  <div className="flex flex col justify-between w-full text-xs font-thin mb-3 mt-5">
                                                      <div>{data.date}</div>
                                                      <div> {data.points}</div>

                                                  </div>
                                                  <hr className="w-full self-center opacity-25 mb-4" />
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      </TitledContainer>
                  </div>
              </div>
              <div className="flex flex-col h-full w-7/12">
                  <div className="h-5/12">
                      <TitledContainer title="WALLET">

                          <div className="w-full flex justify-left">
                              <div className="ml-6 flex justify-center relative rounded-md w-8/12 bg-indigo-light">
                                  <img className="object-none absolute right-0 top-0  w-full m-0 pr-0 z-0 " src="images/terra-maskgroup.png" alt="Img" />
                                  <div className="relative flex flex-col h-48 w-full ml-4">

                                      <div className="mt-10">
                                          <div className="text-2xl font-medium">
                                              998 UST
                                          </div>
                                          <div className="mt-2 text-xs font-thin">
                                              994 USD
                                          </div>
                                      </div>

                                      <div className="flex flex-row mt-8 justify-around w-8/12">
                                          <Button rounded="rounded-full " textColor="white-light" color="green-pastel" size="py-1 px-1">
                                              <p className="text-xs font-thin ml-3 mr-3">Deposit</p>
                                          </Button>
                                          <Button rounded="rounded-full " textColor="white-light" color="red-pastel" size="py-1 px-1">
                                              <p className="text-xs font-thin ml-3 mr-3">Widraw</p>
                                          </Button>

                                      </div>



                                  </div>


                              </div>
                          </div>



                      </TitledContainer>
                  </div>
                  <div className="h-5/12">
                      <TitledContainer title="TOP PERFORMERS">
                          <div className="ml-2 h-64 w-11/12">



                              <div className="bg-clear h-full w-130">
                                  <div data-test="2columngrid" className={`h-full grid  gap-x-2 gap-y-2 grid-cols-2 `}>

                                      {playerList.map((player) => (
                                          <div className="h-32">
                                              <AthleteContainer
                                                  AthleteName={player.name}
                                                  TeamName={player.team}
                                                  ID={player.id}
                                                  CoinValue={player.cost}
                                                  Jersey={player.jersey}
                                                  Positions={player.positions}
                                                  colorgrad1={player.grad1}
                                                  colorgrad2={player.grad2}
                                              />
                                          </div>
                                      ))}

                                  </div>


                              </div>

                          </div>

                      </TitledContainer>
                  </div>

              </div>
          </div>
        </Container>
      </BrowserView>
      </Container>
    );
}






