import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PortfolioContainer from '../components/PortfolioContainer'
import Main from '../components/Main';
import PlayerContainer from '../components/PlayerContainer';
import PlayerStats from '../components/PlayerStats';
import filterIcon from '../public/images/filter.png';
import underlineIcon from '../public/images/blackunderline.png'

// import Image from 'next/image'
// import emptyToken from '../public/images/emptyToken.png'
// import emptyGoldToken from '../public/images/emptyGoldToken.png'
// import tokenOutline from '../public/images/tokenOutline.png'

import { useRouter } from 'next/router';
import Link from 'next/link';
import Container from '../components/Container';

import { estimateFee, retrieveTxInfo } from '../utils/terra/index';
import { marketplaceData } from '../data';
import * as statusCode from '../data/constants/status';
import * as actionType from '../data/constants/actions';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseToken, getPurchaseTokenResponse } from '../redux/reducers/contract/marketplace';
import { MsgExecuteContract } from '@terra-money/terra.js';


const playerdata = [
    {
        key: 'sevendays',
        points: {
            score: 35,
            pos: "3rd",
        },
        rebounds: {
            score: 5.5,
            pos: "24th",
        },
        assists: {
            score: 23,
            pos: "55th",
        },
        blocks: {
            score: 5,
            pos: "5th",
        },
        steals: {
            score: 11,
            pos: "6th",
        },
    },
    {
        key: 'month',
        points: {
            score: 50,
            pos: "2nd",
        },
        rebounds: {
            score: 9,
            pos: "45th",
        },
        assists: {
            score: 44,
            pos: "24th",
        },
        blocks: {
            score: 13,
            pos: "9th",
        },
        steals: {
            score: 18,
            pos: "7th",
        },
    },
    {
        key: 'year',
        points: {
            score: 86,
            pos: "1st",
        },
        rebounds: {
            score: 19,
            pos: "37th",
        },
        assists: {
            score: 68,
            pos: "16th",
        },
        blocks: {
            score: 32,
            pos: "5th",
        },
        steals: {
            score: 23,
            pos: "3rd",
        },
    },
]

const playerList = [ // player list for testing purposes
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
        silvercost: '420 UST',
        goldcost: '521 UST',
        jersey: '30',
        positions: ['PG', 'SG'],
        avgscore: '86.3',
        stats: 86.5,
        data: playerdata,
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        rarity: 'silver',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'TAUREAN PRINCE',
        team: 'Minnesota Timberwolves',
        id: '14450',
        silvercost: '41 UST',
        goldcost: '55 UST',
        jersey: '12',
        positions: ['PG'],
        avgscore: '66.5',
        stats: 66.9,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'silver',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers',
        id: '25',
        silvercost: '840 UST',
        goldcost: '1100 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        avgscore: '96.0',
        stats: 90.2,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'gold',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'DEVIN BOOKER',
        team: 'Phoenix Suns',
        id: '16450',
        silvercost: '21 UST',
        goldcost: '34 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        avgscore: '76.8',
        stats: 80.5,
        data: playerdata,
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
        rarity: 'silver',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'ARMONI BROOKS',
        team: 'Houston Rockets',
        id: '21300',
        silvercost: '45.5 UST',
        goldcost: '66.6 UST',
        jersey: '23',
        positions: ['SG', 'C'],
        avgscore: '81.0',
        stats: 76.2,
        data: playerdata,
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
        rarity: 'silver',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets',
        id: '12300',
        silvercost: '180 UST',
        goldcost: '220 UST',
        jersey: '07',
        positions: ['PG'],
        avgscore: '83.0',
        stats: 77.7,
        data: playerdata,
        grad1: 'indigo-black',
        grad2: 'indigo-red',
        rarity: 'gold',
        lowestask: '120 UST',
        highestask: '550 UST'
    },
    {
        name: 'KOBE BRYANT',
        team: 'Los Angeles Lakers',
        id: '999',
        silvercost: '999 UST',
        goldcost: '1001 UST',
        jersey: '24',
        positions: ['SG'],
        avgscore: '96.0',
        stats: 99.9,
        data: playerdata,
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
        rarity: 'silver',
        lowestask: '120 UST',
        highestask: '550 UST'
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

const tokenList = [
    {
        id: '12300',
        rarity: 'gold'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '21300',
        rarity: 'silver'
    },
    {
        id: '320',
        rarity: 'base'
    },
    {
        id: '14450',
        rarity: 'silver'
    },
    {
        id: '320',
        rarity: 'silver'
    },
]

export default function PlayerDetail() {

    const dispatch = useDispatch();
	const router = useRouter();
	const connectedWallet = useConnectedWallet();

    const { register, handleSubmit } = useForm()
    const [sign, setSign] = useState("")
    const [tokenCongrats, setTokenCongrats] = useState(false)

    const [statfilter, setFilter] = useState("sevendays")
    const [displayModal, setModal] = useState(false);
    const [silverDropdown, displaySilver] = useState(false);
    const [goldDropdown, displayGold] = useState(false);
    const [congratsModal, displayCongrats] = useState(false);
    const [postingModal, setPostingModal] = useState(false);
    const { query } = useRouter();

    const [contract_addr, setContractAddr] = useState("")
    const [owner_addr, setOwnerAddr] = useState("")
    const [buyer_addr, setBuyerAddr] = useState("")
    const [token_id, setTokenId] = useState("")
    const [price, setPrice] = useState("")
    const { status, txInfo, action, message } = useSelector((state) => state.contract.marketplace);

    // console.log("status: " + status)

    const playerToFind = playerList.find(playerList => playerList.id === query.id)
    const baseTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'base')
    }, 0)

    const silverTokenCount = tokenList.reduce(function(n, list){
        return n + (list.id === playerToFind.id && list.rarity === 'silver')
    }, 0)
    
    const filteredList = tokenList.filter((list,i) => {
        return tokenList[i].id === playerToFind.id
    })
    const baseFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'base'
    })
    const silverFilteredList = filteredList.filter((list,i)=>{
        return filteredList[i].rarity === 'silver'
    })

    useEffect(() => {
        if(typeof(connectedWallet) == 'undefined' || connectedWallet == null){
        //   router.push("/")
        }
            else if(price != null) {
                setPrice(price / 1_000_000);
                const executeContractMsg = [
                    new MsgExecuteContract(
                        connectedWallet.walletAddress,         // Wallet Address
                        marketplaceData.contract_addr,             // Contract Address
                        JSON.parse(`{
                            "temp_execute_transaction": {
                                "contract_addr": ${contract_addr},
                                "owner_addr": ${owner_addr},
                                "token_id": ${token_id},
                                "buyer_addr": ${buyer_addr},
                                "price": ${price}
                            }
                        }`), // ExecuteMsg
                        { uusd: price }
                    ),  
                ]
                estimateFee(connectedWallet.walletAddress, executeContractMsg)
                .then((response) => {
                            const amount = response.amount._coins.uusd.amount
                            setTxFee(amount.d / 10**amount.e)
                        setLoading(false)
                        })
                .catch((error) => {
                            setTxFee(0)
                        setLoading(false)
                })
            }
        }, [price])
    
    //TODO: Handle status mix ups when transactions are executed simultaneously.
    useEffect(async () => {
        if(action == actionType.EXECUTE && status == statusCode.PENDING){
            // setModal(true)
            // setModalHeader(message)
            // setModalStatus(status)
        }
        else if(action == actionType.EXECUTE && status == statusCode.SUCCESS){
            // setModal(true)
            // setModalHeader(message)
            const amount = txInfo.txResult.fee.amount._coins.uusd.amount;
            //const amount = txResponse.tx.fee.amount._coins.uusd.amount;
            const txFeeResponse = amount.d / 10**amount.e
            // setModalData([
            //     {
            //         name: "Tx Hash",
            //         value: txInfo.txHash
            //     },
            //     {
            //         name: "Tx Fee",
            //         value: txFeeResponse
            //     }
            // ])
            // setModalStatus(status)
            // setLoading(true)
            // setLoadingMessage("Posting Token for Sale...")
            dispatch(getPurchaseTokenResponse()).then(() => {
            // router.push("/TokenDrawPage")
            })
        }
        else if(action == actionType.EXECUTE && status == statusCode.ERROR){
            // setModal(true)
            //     setModalHeader("Transaction Failed")
            //TODO: Proper error handling an display on redux
            // setModalData([{
            //     name: "Error",
            //     value: message
            // }])
            //     setModalStatus(status)
            }
        else if(status != statusCode.CONFIRMED){
            // setModalStatus(statusCode.IDLE);
        }
    }, [status, action, txInfo, message])

    const executePurchaseToken = () => {
        dispatch(purchaseToken({connectedWallet}))
    }

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    const onSubmit = (data) => {
        if(data.price)
            setPrice(data.price)

        if(data.sign)
            setSign(data.sign)

        setPostingModal(false)
        displayCongrats(true)
    }

    const signSubmit = (event) => {
        setSign(event.target.value)
    }

    // console.log("Price: " + price)
    // console.log("Sign: " + sign)

    return (
        <div className={`font-montserrat`}>
            { tokenCongrats &&
                <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                    <div className="relative p-8 bg-indigo-white w-80 h-10/12 m-auto flex-col flex rounded-lg">
                        <button onClick={()=>{setTokenCongrats(false)}}>
                            <div className="absolute top-0 right-0 p-4 font-black">
                                X
                            </div>
                        </button>

                        <div className="font-bold flex flex-col">
                            CONGRATULATIONS!
                            <img src={underlineIcon} className="sm:object-none md:w-6" />
                        </div>

                        <div className="flex flex-col mt-4 items-center">
                            <div className="">
                                <PlayerContainer playerID={playerToFind.id} rarity='base'/>
                            </div>
                            <div>
                                <div>
                                    <div className="font-thin text-xs mt-4">
                                        #{playerToFind.id}/25000
                                    </div>

                                    <div className="text-sm font-bold">
                                        {playerToFind.name}
                                    </div>

                                    <div className="font-thin mt-4 text-xs">
                                        AVERAGE SCORE
                                    </div>

                                    <div className="text-sm font-bold">
                                        {playerToFind.avgscore}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/Portfolio">
                            <button className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-6 self-center">
                                <div className="text-indigo-white">
                                    GO TO SQUAD
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            }
            { congratsModal &&
                <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                    <div className="relative p-8 bg-indigo-white w-60 h-24 m-auto flex-col flex rounded-lg items-center">
                        <button onClick={()=>{displayCongrats(false)}}>
                            <div className="absolute top-0 right-0 p-4 font-black">
                                X
                            </div>
                        </button>

                        <div className="font-bold flex flex-col">
                            CONGRATULATIONS!
                            <img src={underlineIcon} className="sm:object-none md:w-6" />
                        </div>
                    </div>
                </div>
            }
            { postingModal &&
                <>
                    <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                        <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-96 m-auto flex-col flex rounded-lg">
                            <button onClick={()=>{setPostingModal(false)}}>
                                <div className="absolute top-0 right-0 p-4 font-black">
                                    X
                                </div>
                            </button>

                            <div className="flex flex-col md:flex-row">
                                <div className="font-bold flex flex-col text-2xl">
                                    LIST ITEM FOR SALE
                                    <img src={underlineIcon} className="sm:object-none w-6" />
                                </div>
                            </div>

                            <div className="flex flex-col mt-2">
                                <div className="flex">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mt-4 text-xl font-bold">
                                        Price
                                    </div>
                                    <div className="mt-1">
                                        <input {...register("price")} className="text-base w-36 border text-white rounded-md px-2 py-1 mr-2" placeholder="Amount..." />
                                        UST
                                    </div>

                                    <div className="mt-4 text-xl font-bold">
                                        Sign message
                                    </div>
                                    <div className="mt-1">
                                        <input {...register("sign")} className="text-base w-full h-24 border text-white rounded-md px-2 py-1 mr-2" placeholder="Sign a message to continue." />
                                    </div>
                                    <button className="bg-indigo-buttonblue w-80 h-12 text-center font-bold rounded-md text-sm mt-4 items-center justify-center flex" onClick={()=>executePurchaseToken()}>
                                        <input type="button"/>
                                        <div className="text-center text-indigo-white">CONFIRM LISTING</div>
                                    </button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            { displayModal &&
                <>
                    <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                        <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
                            <button onClick={()=>{setModal(false)}}>
                                <div className="absolute top-0 right-0 p-4 font-black">
                                    X
                                </div>
                            </button>

                            <div className="flex flex-col md:flex-row">
                                <div className="font-bold flex flex-col text-2xl">
                                    PURCHASE NOW
                                    <img src={underlineIcon} className="sm:object-none w-6" />
                                </div>
                            </div>

                            <div className="flex flex-col mt-4 items-center">
                                <div className="">
                                    <PlayerContainer playerID={playerToFind.id} rarity='base'/>
                                </div>
                            </div>

                            <div className="flex justify-between mt-4">
                                <div>
                                    <div className="font-bold">
                                    #{playerToFind.id}/25000
                                    </div>

                                    <div className="font-thin">
                                        SERIAL NUMBER
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-bold">
                                        {playerToFind.silvercost}
                                    </div>

                                    <div className="font-thin">
                                        PRICE
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <div>
                                    <div className="font-bold">
                                        @masterworm
                                    </div>

                                    <div className="font-thin">
                                        OWNER
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-bold">
                                        0x2d95...a02c
                                    </div>

                                    <div className="font-thin">
                                        CONTACT ADDRESS
                                    </div>
                                </div>
                            </div>

                            <button className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center" onClick={()=>{setModal(false);setTokenCongrats(true)}}>
                                <div className="text-indigo-white">
                                    PURCHASE NOW - {playerToFind.silvercost}
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            }
            
            <Container>
                <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <div className="flex">
                        <div className="flex flex-col w-full h-screen">
                            <Main color="indigo-dark">
                                <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                                    <div className="md:mt-12 md:ml-8">
                                        { query.origin === 'portfolio' &&
                                            <Link href="/Portfolio/">
                                                <div className="text-indigo-white flex mt-6 ml-6 mb-2">
                                                    <div className="font-bold mr-2">&#x3c;</div><div>Back</div>
                                                </div>
                                            </Link>
                                        }

                                        { query.origin === 'marketplace' &&
                                            <Link href="/Marketplace/">
                                                <div className="text-indigo-white flex mt-6 ml-6 mb-2">
                                                    <div className="font-bold mr-2">&#x3c;</div><div>Back</div>
                                                </div>
                                            </Link>
                                        }
                                        
                                        <PortfolioContainer title="PLAYER DETAILS">
                                            <div className="flex flex-col mt-2 mb-8">
                                                <div className="flex md:flex-row flex-col md:mt-8">
                                                    <div>
                                                        <div className="ml-8 md:ml-6 mr-16">
                                                            <PlayerContainer playerID={playerToFind.id} rarity='base'/>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="ml-8 md:ml-0 mb-4 md:mb-0">
                                                            { query.origin === 'portfolio' &&
                                                                <div className="font-thin text-sm">
                                                                    #{playerToFind.id}/25000
                                                                </div>
                                                            }
                                                            
                                                            <div className="text-sm">
                                                                {playerToFind.name}
                                                            </div>

                                                            <div className="font-thin mt-4 text-sm">
                                                                AVERAGE SCORE
                                                            </div>

                                                            <div className="text-sm">
                                                                {playerToFind.avgscore}
                                                            </div>
                                                        </div>

                                                        { query.origin === 'portfolio' &&
                                                            <div className="flex justify-between mt-6 mb-2 text-sm">
                                                                <div>
                                                                    <div className="font-thin">
                                                                        LOWEST ASK
                                                                    </div>

                                                                    <div>
                                                                        {playerToFind.lowestask}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="font-thin">
                                                                        HIGHEST ASK
                                                                    </div>

                                                                    <div>
                                                                        {playerToFind.highestask}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        { query.origin === 'marketplace' &&
                                                            <div className="flex justify-between mt-6 mb-2 text-sm">
                                                                <div>
                                                                    <div className="font-thin">
                                                                        PRICE
                                                                    </div>

                                                                    <div>
                                                                        {playerToFind.silvercost}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    

                                                        <button className="bg-indigo-buttonblue w-5/6 md:w-60 h-10 text-center font-bold text-md mt-4 self-center justify-center">
                                                            { query.origin === 'portfolio' &&
                                                                <div className="" onClick={()=>{setPostingModal(true)}}>
                                                                    POST FOR SALE
                                                                </div>
                                                            }

                                                            { query.origin === 'marketplace' &&
                                                                <div className="" onClick={()=>{setModal(true)}}>
                                                                    PURCHASE TOKEN
                                                                </div>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </PortfolioContainer>

                                        { query.origin === 'portfolio' &&
                                            <PortfolioContainer title="OTHER TOKENS">
                                                <div className="flex mt-8 ml-8 grid grid-cols-2 md:grid-cols-4">
                                                    <div className="flex flex-col">
                                                        <div>
                                                            <PlayerContainer playerID={playerToFind.id} rarity='silver'/>
                                                        </div>
                                                        <div className="text-sm mt-2">
                                                            {playerToFind.name}
                                                        </div>
                                                        <div className="font-thin text-xs">
                                                            SILVER
                                                        </div> 
                                                        <div className="mt-4 text-sm">
                                                            {playerToFind.silvercost}
                                                        </div>
                                                    </div>
                                                

                                                    <div className="flex flex-col">
                                                        <div>
                                                            <PlayerContainer playerID={playerToFind.id} rarity='gold'/>
                                                        </div>
                                                        <div className="text-sm mt-2">
                                                            {playerToFind.name}
                                                        </div>
                                                        <div className="font-thin text-xs">
                                                            GOLD
                                                        </div> 
                                                        <div className="mt-4 text-sm">
                                                            {playerToFind.goldcost}
                                                        </div>
                                                    </div>

                                                    {/* TEMPLATE FOR NEW RARITY */}
                                                    {/* <div className="flex flex-col">
                                                        <div>
                                                            <PlayerContainer playerID={playerToFind.id} rarity='gold'/>
                                                        </div>
                                                        <div className="text-sm mt-2">
                                                            {playerToFind.name}
                                                        </div>
                                                        <div className="font-thin text-xs">
                                                            GOLD
                                                        </div> 
                                                        <div className="mt-4 text-sm">
                                                            {playerToFind.goldcost}
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </PortfolioContainer>
                                        }
                                        
                                        <div className="mt-10 flex flex-col md:flex-row justify-between">
                                            <PortfolioContainer title="PLAYER STATS" stats={playerToFind.stats}/>
                                            <div className="self-center md:mr-24">
                                                <div className="rounded-md bg-indigo-light md:mr-7 h-11 w-80 flex justify-between self-center font-thin md:w-72 mt-4 md:mt-12">
                                                    <div className="text-lg ml-4 mt-2 text-indigo-white">
                                                        <form onSubmit={handleSubmit(handleFilter)}>
                                                            <select value={statfilter} className='filter-select bg-indigo-light' onChange={handleFilter}>
                                                                <option name="sevendays" value="sevendays">Last 7 days</option>
                                                                <option name="month" value="month">Last month</option>
                                                                <option name="year" value="year">Last year</option>
                                                            </select>
                                                        </form>
                                                    </div>
                                                    <img src={filterIcon} className="object-none w-4 mr-4" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center self-center text-indigo-white md:mr-24 mb-8">
                                            <div className="mt-8 mb-6 self-center">
                                                {playerToFind.data.map(function(data, i){
                                                    if(statfilter === data.key)
                                                        return <PlayerStats player={data} key={i}/>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Main>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}