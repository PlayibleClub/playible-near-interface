import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Main from '../components/Main';
import PerformerContainer from '../components/PerformerContainer';
import PortfolioContainer from '../components/PortfolioContainer';
import Container from '../components/Container';
import { useForm } from 'react-hook-form'
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'
import Link from 'next/link'
import MarketplaceContainer from '../components/MarketplaceContainer';

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
        rarity: 'silver',
        lowestask: '321 UST',
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
        rarity: 'gold',
        lowestask: '221 UST',
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
        rarity: 'silver',
        lowestask: '999 UST',
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
]



export default function Marketplace() {
    const { status, connect, disconnect, availableConnectTypes } = useWallet();

    const interactWallet = () => {
        if (status === WalletStatus.WALLET_CONNECTED) {
            disconnect();
        } else {
            connect(availableConnectTypes[1]);
        }
    };

    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [posFilter, setPosFilter] = useState("")
    const [filterMode, setMode] = useState(false)
    const [sortMode, setSort] = useState("")

    const onSubmit = (data) => {
        if (data.search)
            setResult(data.search)
        else setResult("")
    }

    const handleSort = (event) => {
        setSort(event.target.value)
        console.log(sortMode)
    }

    return (
        <Container>
            <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                <Main color="indigo-dark">
                    
                    <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-white-light">
                        <div className="md:ml-6 flex flex-col md:flex-row md:justify-between">
                            <PortfolioContainer title="MARKETPLACE"/>
                            <div>
                                <div className="flex md:mt-5 md:mr-6 invisible md:visible">
                                    <div className="bg-indigo-light mr-1 h-11 w-64 flex font-thin">
                                            <form onSubmit={handleSubmit(handleSort)}>
                                                <div>
                                                    <select value={sortMode} className="bg-indigo-light ml-3 mt-2 text-lg" onChange={handleSort}>
                                                        <option value="">Sort by</option>
                                                        <option value="lowserial">Lowest Serial Number</option>
                                                        <option value="highserial">Highest Serial Number</option>
                                                        <option value="newlisting">Newest Listing</option>
                                                        <option value="oldlisting">Oldest Listing</option>
                                                        <option value="team">Team</option>
                                                    </select>
                                                </div>
                                            </form>
                                            {/* {console.log("sort: "+sortMode)} */}
                                        <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                    </div>
                                    <div className="bg-indigo-light ml-1 h-11 w-60" onClick={() => setFilter(false)}>
                                        <div className="ml-1 mt-2">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <input {...register("search")} className="text-xl ml-3 appearance-none bg-indigo-light focus:outline-none w-40" placeholder="Search..." />
                                                <button className="">
                                                    <input type="image" src={searchIcon} className="object-none ml-8 mt-1" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full mb-4 self-center justify-center md:invisible">
                                    {filterMode ?
                                        <>
                                            <div className="rounded-md bg-indigo-light mr-1 w-12 h-11" onClick={() => {
                                                setMode(false)
                                                setResult("")
                                            }}>
                                                <div className="ml-3.5 mt-4">
                                                    <img src={filterIcon} />
                                                </div>
                                            </div>

                                            <div className="rounded-md bg-indigo-light ml-1 h-11 w-10/12 flex iphone5:w-56 iphoneX:w-64 md:w-80">
                                                <div className="ml-1 mt-2">
                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <input {...register("search")} className="text-xl ml-2 appearance-none bg-indigo-light focus:outline-none w-10/12" placeholder="Search..." />
                                                        <button className="w-1/12 md:w-9">
                                                            <input type="image" src={searchIcon} className="object-none md:ml-3 md:mt-1 iphone5:mt-1" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="flex">
                                                <div className="rounded-md bg-indigo-light mr-1 h-11 w-72 flex font-thin iphone5:w-56 iphoneX:w-64 md:w-80" 
                                                // onClick={() => {if(showFilter) setFilter(false) 
                                                //     else setFilter(true)}}
                                                >
                                                    {/* <div className="text-lg ml-4 mt-2 mr-24 w-10/12"> */}
                                                        <form onSubmit={handleSubmit(handleSort)}>
                                                            <div>
                                                                <select value={sortMode} className="bg-indigo-light ml-3 mt-2 text-lg" onChange={handleSort}>
                                                                    <option value="">Sort by</option>
                                                                    <option value="lowserial">Lowest Serial Number</option>
                                                                    <option value="highserial">Highest Serial Number</option>
                                                                    <option value="newlisting">Newest Listing</option>
                                                                    <option value="oldlisting">Oldest Listing</option>
                                                                    <option value="team">Team</option>
                                                                </select>
                                                            </div>
                                                        </form>
                                                    {/* </div> */}
                                                    <img src={filterIcon} className="object-none w-3/12 mr-4" />
                                                </div>

                                                <div className="rounded-md bg-indigo-light ml-1 w-12 h-11" onClick={() => {
                                                    setMode(true)
                                                    setFilter(false)
                                                    setResult("")
                                                }}>
                                                    <div className="ml-4 mt-3">
                                                        <img src={searchIcon} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="justify-center self-center w-full mt-4">
                                <div className="grid grid-cols-2 md:grid-cols-4">
                                    {playerList.map(function (player, i) {
                                        const toFindName = player.name.toLowerCase()
                                        // const toFindTeam = player.team.toLowerCase()
                                        const searchInfo = result.toLowerCase()
                                        if (toFindName.includes(searchInfo) || player.jersey.includes(searchInfo))
                                            return (
                                                // <Link href={`/AssetDetails?id=${player.id}`}>
                                                <Link href={{
                                                    pathname: '/AssetDetails',
                                                    query: { id: player.id, origin: 'marketplace' }                                                    
                                                }}>
                                                    <div className='mb-4' key={i}>
                                                        <MarketplaceContainer AthleteName={player.name} id={player.id} LowAsk={player.lowestask}/>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Main>
            </div>
        </Container>
    );
}
