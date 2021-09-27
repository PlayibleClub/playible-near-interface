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
                    <div className={`font-montserrat h-screen relative `}>
                        <Navbar/>
                        <HeaderBase/>

                        <Main color="indigo-dark">
                            
                            {loading ? (
                                <Loading/>
                            ) : (
                                <div className="flex flex-col overflow-y-auto overflow-x-hidden mt-24">
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