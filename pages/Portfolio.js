import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Main from '../components/Main'
import PortfolioContainer from '../components/PortfolioContainer'
import PerformerContainer from '../components/PerformerContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio, clearData } from '../redux/reducers/contract/portfolio';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import LoadingPageDark from '../components/loading/LoadingPageDark';
import * as statusCode from '../data/constants/status'
import Link from 'next/link'
import SquadPackComponent from '../components/SquadPackComponent'
import Container from '../components/Container';

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

const Portfolio = () => {

    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [teamFilter, setTeamFilter] = useState("")
    const [posFilter, setPosFilter] = useState("")
    const [filterMode, setMode] = useState(false)
    const [sortMode, setSort] = useState("")
    const [showFilter, setFilter] = useState(false)
    const [displayMode, setDisplay] = useState(true)
    const [loading, setLoading] = useState(false)
    
    // const { tokenList: playerList, status } = useSelector((state) => state.contract.portfolio);

    const dispatch = useDispatch();
    const connectedWallet = useConnectedWallet();
    const [sortedList, setList] = useState(playerList);


    useEffect(() => {
        if (typeof connectedWallet !== 'undefined') {
            dispatch(getPortfolio({walletAddr: connectedWallet.walletAddress}))
        }
        return function cleanup() {
            dispatch(clearData());
        };
    }, [dispatch, connectedWallet])

    /*useEffect(() => {
        if (typeof connectedWallet === 'undefined' ) {
            setLoading(false)
        }
        else if(status === statusCode.PENDING){
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [connectedWallet, status])*/

    const onSubmit = (data) => {
        if (data.search)
            setResult(data.search)
        else setResult("")

        console.log(result)

        // if (data.teamName)
        //     setTeamFilter(data.teamName)
        // else setTeamFilter("")

        // if (data.positions)
        //     setPosFilter(data.positions)
        // else setPosFilter("")
    }

    const handleSort = (event) => {
        setSort(event.target.value)
        console.log(sortMode)

        console.log("pre-sort list: "+ sortedList[0].name)
        const tempList = sortedList;

        if(sortMode === "")
            setList([...tempList])
        else if (sortMode === "lowserial"){
            tempList.sort((a,b) => a.id - b.id)
            setList([...tempList])
            console.log("low serial player list: " + sortedList[0].name)
        }
        else if (sortMode === "highserial"){
            tempList.sort((a,b) => b.id - a.id)
            setList([...tempList])
            console.log("high serial player list: " + sortedList[0].name)
        }
        else if (sortMode === "oldlisting"){
            [...tempList].sort((a,b) => new Date(...a.listing.split('/').reverse()) - new Date(...b.listing.split('/').reverse()))
            setList([...tempList])
            console.log("old list player list: " + sortedList[0].name)
        }
        else if (sortMode === "newlisting"){
            [...tempList].sort((a,b) => new Date(...b.listing.split('/').reverse()) - new Date(...a.listing.split('/').reverse()))
            setList([...tempList])
            console.log("new list player list: " + sortedList[0].name)
        }
        else if (sortMode === "team"){
            tempList.sort((a,b) => a.team.localeCompare(b.team))
            setList([...tempList])
        }

        // console.log("sorted list: "+ sortedList[0].name)
    }

    // const key1 = 'team'
    // const uniqueTeams = [...new Map(playerList.map(i => [i[key1], i])).values()]

    return (
        <Container>
            <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                <Main color="indigo-dark">
                    
                    {loading ? (
                        <LoadingPageDark/>
                    ) : (
                    <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-screen self-center text-white-light">
                        <div className="ml-6 flex flex-col md:flex-row md:justify-between">
                            <PortfolioContainer title="SQUAD"/>
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
                                {displayMode ?
                                    <>
                                        <div className="flex md:ml-4 font-bold ml-8 md:ml-0">
                                            <div className="mr-6 md:ml-4 border-b-8 pb-2 border-indigo-buttonblue">
                                                ATHLETES
                                            </div>

                                            <div className="" onClick={() => {
                                                setDisplay(false)
                                            }}>
                                                PACKS
                                            </div>
                                        </div>
                                        <hr className="visible opacity-50 md:invisible"/>
                                        <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
                                            {sortedList.map(function (player, i) {
                                                const toFindName = player.name.toLowerCase()
                                                // const toFindTeam = player.team.toLowerCase()
                                                const searchInfo = result.toLowerCase()
                                                if (toFindName.includes(searchInfo) || player.jersey.includes(searchInfo))
                                                    return (
                                                        <Link href={{
                                                            pathname: '/PlayerDetails',
                                                            query: { id: player.id, origin: 'portfolio' }                                                    
                                                        }}>
                                                            <div className='mb-4' key={i}>
                                                                <PerformerContainer AthleteName={player.name} AvgScore={player.avgscore} id={player.id} rarity={player.rarity}/>
                                                            </div>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                :
                                <>
                                    <div className="flex md:ml-4 font-bold ml-8 md:ml-0">
                                        <div className="md:ml-4 mr-6" onClick={() => {
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
                        {/* </PortfolioContainer> */}
                        </div>
                    </div>
                    )}
                </Main>
            </div>
        </Container>
    )
}
export default Portfolio;