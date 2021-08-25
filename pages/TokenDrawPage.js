import React, { useEffect } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Main from '../components/Main';
import TokenComponent from '../components/TokenComponent';
import TitledContainer from '../components/TitledContainer';
import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { getDrawData } from '../redux/reducers/contract/pack';


const TokenDrawPage = () => {
    const { drawList: tokenList } = useSelector((state) => state.contract.pack);
    const dispatch = useDispatch()

    return(
        <>
            <div>
                <div className="">
                        <div className="flex flex-col w-full">
                        <Header>

                        <Button color="indigo-light" saturation="0" textColor="white-light" textSaturation="500" size="py-1 px-1">=</Button>
                            <div className="text-white-light">
                            {' '}
                            <img src="images/fantasyinvestar.png" alt="Img" />
                        </div>
                        </Header>
                        </div>

                        <Main color="indigo-dark">
                            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                                <TitledContainer title="DRAW">
                                    <div className="flex overflow-x-scroll pt-16 pb-32 hide-scroll-bar snap snap-x snap-mandatory">
                                        <div className="flex flex-nowrap ml-16 pt-16">
                                            {tokenList.map(function(list, i){
                                                return (
                                                    <div className="inline-block px-3" key={i}>
                                                        <TokenComponent playerID={tokenList[i]}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    
                                    <button onClick={() => { dispatch(getDrawData())}}>Draw</button>

                                    <Link href="/portfolio">
                                        <div className="bg-indigo-buttonblue w-72 h-12 mb-20 text-center rounded-md text-lg ml-6">
                                            <div className="mt-2.5">
                                                GO TO PORTFOLIO
                                            </div>
                                        </div>
                                    </Link>
                                </TitledContainer>
                            </div>
                        </Main>
                    </div>
            </div>
        </>
    )
}

export default TokenDrawPage