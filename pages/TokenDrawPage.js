import React, { useState } from 'react';
import Main from '../components/Main';
import TokenComponent from '../components/TokenComponent';
import Link from 'next/link';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';

import { useDispatch, useSelector } from 'react-redux';
import { getLastRound, getRoundData } from '../redux/reducers/contract/pack';
import WalletHelper from '../helpers/wallet-helper';
import { fantasyData } from '../data';

const tokenList = [1, 7, 12, 23, 30] 

const TokenDrawPage = () => {
    const { drawList: tokenList, latestRound } = useSelector((state) => state.contract.pack);
    const dispatch = useDispatch();
    const [isClosed, setClosed] = useState(true)

    const { executeContract } = WalletHelper();

    const executePurchasePack = async () => {
        const executeMsg = `{ "purchase_pack": {} }`;
        const result = await executeContract(fantasyData.contract_addr, executeMsg);
        dispatch(getLastRound()).then((response) => {
            console.log(response);
            dispatch(getRoundData({lastRound: response.payload}));
        });
    }

    return(
            <>
                <div>
                    <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
                        {isClosed ? null : 
                            <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                                <Navbar> </Navbar>
                                <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}/>
                            </div>
                        }
                        <HeaderBase isClosed={isClosed} setClosed={setClosed}/>

                        <Main color="indigo-dark">
                                <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                                        <div className="flex overflow-x-scroll pt-16 pb-32 hide-scroll-bar snap snap-x snap-mandatory">
                                            <div className="flex flex-nowrap ml-16 pt-16">
                                                {tokenList.map(function(list, i){
                                                    return (
                                                        <div className="inline-block px-3 ml-2.5" key={i}>
                                                            <TokenComponent playerID={tokenList[i]}/>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                    
                                    <button onClick={executePurchasePack}>Draw</button>

                                        <div className='flex justify-center'> 
                                            <Link href="/portfolio">
                                                <div className="bg-indigo-buttonblue w-72 h-12 mb-20 text-center rounded-md">
                                                    <div className="mt-3">
                                                        GO TO PORTFOLIO
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                </div>
                            </Main>
                        </div>
                </div>
            </>
    )
}