import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TokenComponent from '../components/TokenComponent';
import * as statusCode from '../data/constants/status'

import { useDispatch, useSelector } from 'react-redux';
import { getLastRound, getRoundData, clearData } from '../redux/reducers/contract/pack';
import LoadingPageDark from '../components/loading/LoadingPageDark';
import Container from '../components/Container';

const sampleList = [0,0,0,0,0]

const TokenDrawPage = () => {
    const dispatch = useDispatch();

    const [isClosed, setClosed] = useState(true)
    const [loading, setLoading] = useState(false)

    const { drawList: tokenList, status } = useSelector((state) => state.contract.pack);

    return (
        <Container>                    
            {loading ? (
                <LoadingPageDark/>
            ) : (
                <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                        <div className="flex overflow-x-visible justify-center self-center mt-24">
                            <div className="flex">
                                {/* <TokenGridCol3>
                                    {sampleList.map(function(list, i){
                                        return (
                                            <div className="inline-block ml-2.5 mr-8" key={i}>
                                                <TokenComponent playerID={list}/>
                                            </div>
                                        )
                                    })}
                                </TokenGridCol3> */}
                                <div className="grid grid-cols-5 gap-1">
                                    <div className="col-start-1">
                                        <TokenComponent playerID={tokenList[0]}/>
                                    </div>
                                    <div className="col-start-3">
                                        <TokenComponent playerID={tokenList[1]}/>
                                    </div>
                                    <div className="col-start-5">
                                        <TokenComponent playerID={tokenList[2]}/>
                                    </div>
                                    <div className="col-start-2">
                                        <TokenComponent playerID={tokenList[3]}/>
                                    </div>
                                    <div className="col-start-4">
                                        <TokenComponent playerID={tokenList[4]}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='absolute bottom-0 right-12 flex justify-center'> 
                            <Link href="/Portfolio">
                                <div className="bg-indigo-buttonblue w-72 h-12 mb-20 text-center rounded-md text-indigo-white font-bold">
                                    <div className="mt-3">
                                        GO TO PORTFOLIO
                                    </div>
                                </div>
                            </Link>
                        </div>
                </div>
            )}
        </Container>
    )
}

export default TokenDrawPage