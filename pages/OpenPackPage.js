import React, { Component, useState } from 'react';
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PackComponent from '../components/PackComponent';
import PortfolioContainer from '../components/PortfolioContainer';
import Link from 'next/link'

export default function OpenPackPage() {

    const [isClosed, setClosed] = React.useState(true)

    return(
        <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
            {isClosed ? null : 
                <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                    <Navbar> </Navbar>
                    <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}/>
                </div>
            }
            <HeaderBase isClosed={isClosed} setClosed={setClosed}/>

            <Main color="indigo-dark overflow-y-scroll">
                <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                    <PortfolioContainer title="CONGRATULATIONS!">
                        <div className='flex justify-center'>
                            <div className="flex overflow-x-scroll pt-16 pb-32 hide-scroll-bar snap snap-x snap-mandatory">
                                <div className="flex flex-nowrap pt-16">
                                    <PackComponent type="PremiumRelease3"/>
                                </div>
                            </div>    
                        </div>        
                        <div className='flex justify-center'>
                        <Link href="/TokenDrawPage">
                            <div className="bg-indigo-buttonblue w-72 h-12 text-center rounded-md text-lg">
                                <div className="pt-2.5">
                                    OPEN PACK
                                </div>
                            </div>
                        </Link>
                        </div>
                    </PortfolioContainer>
                </div>
            </Main>
        </div>
    )
}