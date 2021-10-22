import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Main from '../components/Main';
import TokenComponent from '../components/TokenComponent';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import * as statusCode from '../data/constants/status'
import TokenGridCol3 from "../components/TokenGridCol3"
import DesktopNavbar from '../components/DesktopNavbar';

import { useDispatch, useSelector } from 'react-redux';
import { getLastRound, getRoundData, clearData } from '../redux/reducers/contract/pack';

const sampleList = [0,0,0,0,0]

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
                    <div className={`font-montserrat h-screen relative flex`}>
                        <DesktopNavbar/>
                        <div className="flex flex-col w-full h-screen">
                            
                            <Main color="indigo-dark">
                                
                                {loading ? (
                                    <Loading/>
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
                                                            <TokenComponent playerID={sampleList[0]}/>
                                                        </div>
                                                        <div className="col-start-3">
                                                            <TokenComponent playerID={sampleList[1]}/>
                                                        </div>
                                                        <div className="col-start-5">
                                                            <TokenComponent playerID={sampleList[2]}/>
                                                        </div>
                                                        <div className="col-start-2">
                                                            <TokenComponent playerID={sampleList[3]}/>
                                                        </div>
                                                        <div className="col-start-4">
                                                            <TokenComponent playerID={sampleList[4]}/>
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
                            </Main>
                        </div>
                    </div>
                </div>
            </>
    )
}

export default TokenDrawPage