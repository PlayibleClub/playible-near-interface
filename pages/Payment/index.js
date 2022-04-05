import React, { useEffect, useState } from 'react'
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Main from '../../components/Main';
import PackComponent from '../../components/PackComponent';
import Link from 'next/link';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import walletIcon from '../../public/images/walletBlue.png';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import 'regenerator-runtime/runtime';

const Payment = () => {
    const [isClosed, setClosed] = useState(true)

    return(
        <Container>
            <Main color="indigo-white overflow-y-scroll">
            <div className="mt-8 mb-16">
                <BackFunction prev=""/>
            </div>
                <PortfolioContainer title="PAYMENT METHOD" textcolor="indigo-black">
                    <div className="flex justify-center space-x-72 mt-8 ml-4">
                        <div className='flex flex-col w-56'>
                            <div className="font-bold text-lg">
                                PURCHASE DETAILS
                            </div>
                            <PackComponent type="BoosterPack3"/>
                            </div>
                        <div>


                        <div className='flex flex-col self-center justify-center'>
                            <div className='mb-10'>
                                AVILABLE BALANCE
                            </div>
                            <div className="flex border-bg-white border p-4 rounded-lg mt-6">
                                <img src={walletIcon} className="h-6 w-7 mt-3 mr-6 ml-2"/>
                                <div className="flex flex-row mt-3 space-x-4 font-thin">
                                    <div className='font-bold'>
                                        Wallet
                                    </div>
                                    <div>
                                        985 UST
                                    </div>
                                </div>
                            </div>
                        </div>
                            <div className="font-thin">
                                <div className='flex mt-20 justify-between pb-4 border-b-2 border-indigo-lightgray border-opacity-10'>
                                    <div className='font-bold'>
                                        + Tx Fees
                                    </div>
                                    <div>
                                        5 UST
                                    </div>
                                </div>
                                <div className='flex mt-5 justify-between'>
                                    <div className='font-bold'> 
                                        Total
                                    </div>
                                    <div>
                                        40 UST
                                    </div>
                                </div>
                                <div className='flex flex-col self-center justify-center mt-10'>
                                    <button className="bg-indigo-buttonblue mt-10 w-72 h-12 text-indigo-white font-bold text-center text-md">
                                        <div className="pt-1">
                                            PURCHASE NOW
                                        </div>
                                    </button>

                                    <Link href="/Marketplace">
                                        <div className="text-center font-bold text-md pt-6 pb-12 underline">
                                            CANCEL
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </PortfolioContainer>
            </Main>
        </Container>
    )
}

export default Payment;