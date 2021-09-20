import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Main from '../components/Main';
import TokenComponent from '../components/TokenComponent';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

import * as statusCode from '../data/constants/status'

import { useDispatch, useSelector } from 'react-redux';
import { getLastRound, getRoundData, clearData } from '../redux/reducers/contract/pack';

const TokenDrawPage = () => {
    const dispatch = useDispatch();

    const [isClosed, setClosed] = useState(true)
    const [loading, setLoading] = useState(true)

    const { drawList: tokenList, status } = useSelector((state) => state.contract.pack);

    useEffect(() => {
        dispatch(getLastRound()).then((response) => {
            dispatch(getRoundData({lastRound: response.payload.response}))
        });

        return function cleanup() {
            dispatch(clearData());
        };
    }, [dispatch])

    useEffect(() => {
        if(status === statusCode.PENDING){
            setLoading(true)
        }
        else {
            setLoading(false)
        }
    }, [status])

    return (
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
                            
                            {loading ? (
                                <Loading/>
                            ) : (
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

                                        <div className='flex justify-center'> 
                                            <Link href="/Portfolio">
                                                <div className="bg-indigo-buttonblue w-72 h-12 mb-20 text-center rounded-md">
                                                    <div className="mt-3">
                                                        GO TO PORTFOLIO
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                </div>
                            )}
                        </Main>
                    </div>
                </div>
            </>
    )
}

export default TokenDrawPage