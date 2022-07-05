import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React, { Component, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import LargePackContainer from '../../components/containers/LargePackContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import Main from '../../components/Main'
import 'regenerator-runtime/runtime';
import Link from 'next/link';
import PackComponent from './components/PackComponent'
import PlayComponent from '../Play/components/PlayComponent';

const categoryList = ['starter', 'booster'];
const starterList = ['NFL130','NFL420','NFL999'];
const boosterList = ['NFL000','NFL555','NFL234'];


export default function Packs() {

    const [activeCategory, setCategory] = useState('starter');

    return (
        <div>
            <Container>
                <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <Main color="indigo-white">
                        <div className="flex flex-col">
                            <div className="flex">
                                <div className="flex-initial">
                                    <PortfolioContainer title="PLAY" textcolor="text-indigo-black" />
                                </div>
                            </div>

                            <div className="flex flex-col mt-6">
                                <div className="flex font-bold ml-8 md:ml-0 font-monument">
                                    { activeCategory === 'starter' ?
                                        <div>
                                            <div className="w-screen">
                                                <div className="ml-8 flex">
                                                    <div className="border-b-8 pb-2 border-indigo-buttonblue mr-6">
                                                        STARTER
                                                    </div>
                                                    <div onClick={()=>setCategory('booster')}>
                                                        BOOSTER
                                                    </div>
                                                </div>
                                                <hr className="opacity-50"/>

                                                <div className="mt-6 ml-6 grid grid-cols-2 md:grid-cols-3 gap-y-6">
                                                    {starterList.map(function(data,i){
                                                        return (
                                                            <Link href='/PackDetails'>
                                                                <a>
                                                                    <PackComponent
                                                                        type='starter'
                                                                        id={data}
                                                                    />
                                                                </a>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <></>
                                    }

                                    { activeCategory === 'booster' ?
                                        <div>
                                            <div className="w-screen">
                                                <div className="ml-8 flex">
                                                    <div className="mr-6" onClick={()=>setCategory('starter')}>
                                                        STARTER
                                                    </div>
                                                    <div className="border-b-8 pb-2 border-indigo-buttonblue">
                                                        BOOSTER
                                                    </div>
                                                </div>
                                                <hr className="opacity-50"/>

                                                <div className="mt-6 ml-6 grid grid-cols-2 md:grid-cols-3 gap-y-6">
                                                    {boosterList.map(function(data,i){
                                                        return (
                                                            <Link href='/PackDetails'>
                                                                <a>
                                                                    <PackComponent
                                                                        type='booster'
                                                                        id={data}
                                                                    />
                                                                </a>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <></>
                                    }

                                    {/* {categoryList.map((type) => (
                                        <div
                                        key={type}
                                        className={`mr-6 uppercase cursor-pointer md:ml-8 ${
                                            activeCategory === type ? 'border-b-8 pb-2 border-indigo-buttonblue' : ''
                                        }`}
                                        onClick={() => {
                                            setCategory(type);
                                        }}
                                        >
                                        {type}
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </Main>     
                </div>           
            </Container>
        </div>
    )
}
