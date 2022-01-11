import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Main from '../../components/Main'
import PortfolioContainer from '../../components/containers/PortfolioContainer'
import PerformerContainer from '../../components/containers/PerformerContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountAssets, clearData } from '../../redux/reducers/external/playible/assets';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Link from 'next/link'
import SquadPackComponent from '../../components/SquadPackComponent'
import Container from '../../components/containers/Container';
import Sorter from './components/Sorter';


/*const playerList = [ // player list for testing purposes
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
        rarity: 'silver'
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
        rarity: 'gold'
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
        rarity: 'silver'
    },
    {
        name: 'ARMONI BROOKS',
        team: 'Houston Rockets', //3
        id: '21300',
        cost: '45.5 UST',
        jersey: '23',
        positions: ['SG', 'C'],
        avgscore: '81.0',
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        listing: '12/12/2001', //1
        rarity: 'silver'
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets', //1
        id: '12300',
        cost: '180 UST',
        jersey: '07',
        positions: ['PG'],
        avgscore: '83.0',
        grad1: 'indigo-black',
        grad2: 'indigo-red',
        listing: '10/12/2004', //2
        rarity: 'gold'
    },
    {
        name: 'KOBE BRYANT',
        team: 'Los Angeles Lakers', //4
        id: '999',
        cost: '999 UST',
        jersey: '24',
        positions: ['SG'],
        avgscore: '96.0',
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        listing: '12/12/2025', //7
        rarity: 'silver'
    },
    // {
    //     name: '',
    //     team: '',
    //     id: '',
    //     cost: '',
    //     jersey: '',
    //     positions: [],
    //     grad1: '',
    //     grad2: '',
    // },
]*/


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

const Portfolio = () => {
  const [searchText, setSearchText] = useState("")
  const [displayMode, setDisplay] = useState(true)
  const [loading, setLoading] = useState(true)
  
  const { list: playerList, status } = useSelector((state) => state.external.playible.assets);

  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const [sortedList, setSortedList] = useState([]);


  useEffect(() => {
    if (typeof connectedWallet !== 'undefined') {
      dispatch(getAccountAssets({walletAddr: connectedWallet.walletAddress}))
    }
  }, [dispatch, connectedWallet])

  useEffect(() => {
    if(typeof playerList !== "undefined"){
      setSortedList(playerList)
      setLoading(false)
    }
  }, [playerList])

  return (
    <Container>
      <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
        <Main color="indigo-white">
          {loading ? (
              <LoadingPageDark/>
          ) : (
            <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-indigo-black">
              <div className="ml-6 flex flex-col md:flex-row md:justify-between">
                  <PortfolioContainer title="SQUAD" textcolor="text-indigo-black"/>
                  <Sorter
                    list={sortedList}
                    setList={setSortedList}
                    setSearchText={setSearchText}
                  />
              </div>

              <div className="flex flex-col w-full">
                <div className="justify-center self-center w-full md:mt-4">
                  {displayMode ?
                    <>
                      <div className="flex md:ml-4 font-bold ml-8 md:ml-0 font-monument">
                        <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue">
                          ATHLETES
                        </div>

                        <div className="" onClick={() => {setDisplay(false)}}>
                          PACKS
                        </div>
                      </div>
                      <hr className="visible opacity-50 md:invisible"/>
                      <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
                        {sortedList.length > 0 ? (
                          sortedList.map(function (player, i) {
                          const toFindName = player.name.toLowerCase()
                          // const toFindTeam = player.team.toLowerCase()
                          const searchInfo = searchText.toLowerCase()
                          if (toFindName.includes(searchInfo) || player.jersey.includes(searchInfo))
                            return (
                              <Link href={{
                                pathname: '/AssetDetails',
                                query: { id: player.id, origin: 'portfolio' }                                                    
                              }}>
                                <div className='mb-4' key={i}>
                                  <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id} rarity={player.rarity}/>
                                </div>
                              </Link>
                            )
                          })
                        ):(
                          <div>No assets in your portfolio</div>
                        )}
                      </div>
                    </>
                    :
                    <>
                      <div className="flex md:ml-4 font-bold ml-8 md:ml-0 font-monument">
                        <div className="md:ml-8 mr-6" onClick={() => {
                          setDisplay(true)
                        }}>
                          ATHLETES
                        </div>

                        <div className="border-b-8 pb-2 border-indigo-buttonblue">
                          PACKS
                        </div>
                      </div>
                      <hr className="visible opacity-50 md:invisible"/>
                      <div className="md:ml-16 grid grid-cols-0 md:grid-cols-4 mt-12 justify-center">
                        {packList.map(function(data,i){
                          return(
                            <div className='' key={i}>
                              <SquadPackComponent
                                imagesrc={data.image}
                                packName={data.name}
                                releaseValue={data.release}
                                link={data.key}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          )}
        </Main>
      </div>
    </Container>
  )
}
export default Portfolio;