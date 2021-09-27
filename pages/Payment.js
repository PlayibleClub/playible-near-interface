import React, { useEffect, useState } from 'react'
import PortfolioContainer from '../components/PortfolioContainer'
import Main from '../components/Main';
import PackComponent from '../components/PackComponent';
import Link from 'next/link';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import walletIcon from '../public/images/wallet.png';

const Payment = () => {
    const [isClosed, setClosed] = useState(true)

    return(
        <>
            <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
                <Navbar/>
                <HeaderBase/>

                <Main color="indigo-dark overflow-y-scroll">
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden mt-24">
                        <PortfolioContainer title="PAYMENT METHOD">
                            <div className='flex flex-col self-center justify-center mt-8'>
                                <div className="ml-4">
                                    PURCHASE DETAILS
                                </div>
                                <PackComponent type="PremiumRelease3"/>
                            </div>

                            <div className='flex flex-col self-center justify-center mt-8 mb-8'>
                                <div>
                                    CHOOSE PAYMENT METHOD
                                </div>

                                <div className="flex border-bg-white border p-4 rounded-lg mt-6">
                                    <img src={walletIcon} className="h-6 w-7 mt-3 mr-6 ml-2"/>
                                    <div className="font-thin">
                                        <div>
                                            Wallet Balance
                                        </div>
                                        <div>
                                            985 UST
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-indigo-white mt-4 ml-10 w-4 h-4"/>
                                </div>
                            </div>

                            <div className="flex justify-center self-center w-72 mt-8 mb-12 border border-l-0 border-r-0 p-4 font-thin">
                                <div className="w-36 text-left">
                                    Total
                                </div>
                                <div className="w-36 text-right">
                                    35 UST
                                </div>
                            </div>

                            <div className='flex flex-col self-center justify-center'>
                                <button className="bg-indigo-buttonblue w-72 h-12 text-center rounded-md text-lg">
                                    <div className="pt-1">
                                        PURCHASE NOW
                                    </div>
                                </button>

                                <Link href="/Marketplace">
                                    <div className="text-center pt-6 pb-12 underline">
                                        CANCEL
                                    </div>
                                </Link>
                            </div>
                        </PortfolioContainer>
                    </div>
                </Main>
            </div>
        </>
    )
}

export default Payment;