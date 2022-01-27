import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Container from '../components/containers/Container';
import Main from '../components/Main';
import React, { useEffect, useState } from 'react'
import underlineIcon from '../public/images/blackunderline.png'
import viewall from '../public/images/viewall.png'
import PrizePoolComponent from '../components/PrizePoolComponent';
import Link from 'next/link'
import MarketplaceContainer from '../components/containers/MarketplaceContainer';
import LargePackContainer from '../components/containers/LargePackContainer';
import filterIcon from '../public/images/filter.png';
import PerformerContainer from '../components/containers/PerformerContainer';
import progressBar from '../public/images/progressbar.png'
import Image from 'next/image'

const playerList = [ // player list for testing purposes
  {
      name: 'STEPHEN CURRY',
      team: 'Golden State Warriors', //2
      id: '320',
      cost: '420 UST',
      jersey: '30',
      positions: ['PG', 'SG'],
      avgscore: '86.3',
      grad1: 'indigo-blue',
      grad2: 'indigo-bluegrad',
      listing: '12/12/2024', //4
      rarity: 'base',
      lowestask: '120 UST',
  },
  {
      name: 'TAUREAN PRINCE',
      team: 'Minnesota Timberwolves', //6
      id: '14450',
      cost: '41 UST',
      jersey: '12',
      positions: ['PG'],
      avgscore: '66.5',
      grad1: 'indigo-purple',
      grad2: 'indigo-purplegrad',
      listing: '12/12/2021', //3
      rarity: 'silver',
      lowestask: '45 UST',
  },
  {
      name: 'LEBRON JAMES',
      team: 'Los Angeles Lakers', //5
      id: '25',
      cost: '840 UST',
      jersey: '23',
      positions: ['PG', 'SG'],
      avgscore: '96.0',
      grad1: 'indigo-purple',
      grad2: 'indigo-purplegrad',
      listing: '11/12/2025', //6
      rarity: 'gold',
      lowestask: '3 UST',
  },
  {
      name: 'DEVIN BOOKER',
      team: 'Phoenix Suns', //7
      id: '16450',
      cost: '21 UST',
      jersey: '01',
      positions: ['SF', 'C'],
      avgscore: '76.8',
      grad1: 'indigo-darkblue',
      grad2: 'indigo-darkbluegrad',
      listing: '12/11/2025', //5
      rarity: 'silver',
      lowestask: '354 UST',
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
      name: 'PREMIUM PACK',
      key: 'prem2',
      release: '2',
      price: '20 UST',
      image: '/images/packimages/packs1.png',

  },
  {
      name: 'PREMIUM PACK',
      key: 'prem3',
      release: '3',
      price: '35 UST',
      image: '/images/packimages/packs1.png',

  },
  {
      name: 'BASE PACK',
      key: 'base2',
      release: '2',
      price: '20 UST',
      image: '/images/packimages/packs1.png',
  },
]

const prizePoolSample = [
  {
    icon: '1',
    prizePool: '7,484.10',
    level: '1',
  },
  {
    icon: '2',
    prizePool: '16,923.98',
    level: '2',
  },
]

export default function Home() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const [playibleValue, setPlayibleValue] = useState("1,287,632.98");

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };

  return (
    <Container>
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center md:pb-12 text-indigo-black">
          <Main color="indigo-white">
              <div className="flex flex-col md:flex-row md:ml-12 mt-12">
                <div className="md:w-2/3">
                  
                  <div className="flex flex-col md:border rounded-lg md:p-6 md:mr-8">
                    <div className="flex">
                        <div className="ml-8 md:ml-0">
                          <div className="text-l font-bold font-monument">
                            PLAYIBLE TOTAL VALUE
                          </div>
                          <div className="text-3xl font-bold font-monument mt-2 whitespace-nowrap">
                            $ 1,750,990.00
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <Image
                              src={"/images/promotionheader.png"}
                              width={375}
                              height={200}
                              objectFit={'fill'}
                            />
                            
                  </div>
                  
                  <div className="flex flex-col md:border rounded-lg md:p-6 md:mr-8 mt-8">
                  <div className="flex">
                      <div className="ml-8 md:ml-0">
                        <div className="text-xl font-bold font-monument">
                          ACTIVE GAMES
                        </div>
                        <img src={underlineIcon} className="mt-1"/>
                  </div>

                      <Link href="/Play">
                        <button className="ml-12 md:ml-16">
                          <div className="text-indigo-black underline text-xs font-bold md:mb-2">
                            VIEW ALL
                          </div>
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-8 self-center">
                        {prizePoolSample.map(function(data,i){
                          return(
                            <div className="" key={i}>
                              <PrizePoolComponent icon={data.icon} prizePool={data.prizePool} level={data.level} />
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {/* <div className="flex flex-col md:border rounded-lg md:p-6 mt-12 md:mt-8 md:mr-8">
                    <div className="flex">
                      <div className="ml-8 md:ml-0">
                        <div className="text-xl font-bold font-monument">
                          MARKETPLACE
                        </div>
                        <img src={underlineIcon} className="mt-1"/>
                      </div>

                      <Link href="/Marketplace">
                        <button className="ml-12 md:ml-16">
                          <div className="text-indigo-black underline text-xs font-bold md:mb-2">
                            VIEW ALL
                          </div>
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 mt-8">
                      {playerList.map(function(data,i){
                        return(
                          <div className='' key={i}>
                              <MarketplaceContainer AthleteName={data.name} id={data.id} LowAsk={data.lowestask}/>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col md:border rounded-lg md:p-6 mt-12 md:mt-8 mr-8 md:mb-8">
                    <div className="flex">
                      <div className="ml-8 md:ml-0">
                        <div className="text-xl font-bold font-monument">
                          PACKS
                        </div>
                        <img src={underlineIcon} className="mt-1"/>
                      </div>

                      
                      <Link href="/Packs">
                        <button className="ml-12 md:ml-16">
                          <div className="text-indigo-black underline text-xs font-bold md:mb-2">
                            VIEW ALL
                          </div>
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 mt-8 self-center">
                      {packList.map(function(pack,i){
                        return(
                          <div className='mb-4' key={i}>
                              <LargePackContainer
                                  PackName={pack.name}
                                  CoinValue={pack.price}
                                  releaseValue={pack.release}
                                  imagesrc={pack.image} />
                          </div>
                        )
                      })}
                    </div>
                  </div> */}
                </div>

                <div className="flex flex-col rounded-lg md:w-1/3 md:border md:p-6 md:mr-8 md:mt-0 mt-8">
                  <div className="ml-8 md:ml-0">
                    <div className="text-xl font-bold font-monument">
                      TOP PERFORMERS
                    </div>
                    <img src={underlineIcon} className="mt-1"/>
                  </div>

                  <div className="bg-indigo-white h-11 flex justify-between self-center font-thin w-72 mt-6 border-2 border-indigo-lightgray border-opacity-50">
                    <div className="text-lg ml-4 mt-1.5 md:mb-1.5 text-indigo-black">
                        <form>
                            <select className='filter-select bg-white'>
                              {/* change filterIcon icon black */}
                                <option name="sevendays" value="sevendays">Last 7 days</option>
                                <option name="month" value="month">Last month</option>
                                <option name="year" value="year">Last year</option>
                            </select>
                        </form>
                    </div>
                    <img src={filterIcon} className="object-none w-4 mr-4" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 mt-8">
                    {playerList.map(function(player,i){
                      return(
                        <div className='' key={i}>
                            <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id} rarity={player.rarity}/>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
          </Main>
        </div>
    </Container>
  );
}






