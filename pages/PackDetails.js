import React, { useState, useEffect } from 'react';
import DesktopNavbar from '../components/DesktopNavbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import { useRouter } from 'next/router';
import Image from 'next/image'
import HeaderBack from '../components/HeaderBack';

const packList = [
    {
        name: 'PREMIUM PACK',
        key: 'prem2',
        release: '2',
        price: '20 UST',
        image: '/images/packimages/PremiumRelease2.png',

    },
    {
        name: 'PREMIUM PACK',
        key: 'prem3',
        release: '3',
        price: '35 UST',
        image: '/images/packimages/PremiumRelease3.png',

    },
    {
        name: 'BASE PACK',
        key: 'base2',
        release: '2',
        price: '20 UST',
        image: '/images/packimages/BaseRelease1.png',
    },
]

export default function PackDetails(props) {

    const [isNarrowScreen, setIsNarrowScreen] = useState(false);
    const { query } = useRouter();

    useEffect(() => {
        // set initial value
        const mediaWatcher = window.matchMedia("(max-width: 500px)")
    
        //watch for updates
        function updateIsNarrowScreen(e) {
          setIsNarrowScreen(e.matches);
        }
        mediaWatcher.addEventListener('change', updateIsNarrowScreen)
    
        // clean up after ourselves
        return function cleanup() {
          mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
        }
      })
    
    if (isNarrowScreen) {
        return (
            <>
            <div className="font-montserrat h-screen relative bg-indigo-dark">
                    <HeaderBack link="/Packs"/>
                    <div className="flex">
                        <div className="w-full">
                            <Main color="indigo-dark">
                                <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden text-indigo-white font-bold">
                                    {packList.map(function(data,i){
                                        if(query.id === data.key){
                                            return (
                                                <div className="flex flex-col" key={i}>
                                                    <Image
                                                        src={data.image}
                                                        width={300}
                                                        height={300}
                                                    />

                                                    <div className="flex flex-col">
                                                        <div className="ml-10">
                                                            <div className="">
                                                                {data.name}
                                                            </div>
                                                            <div className="font-thin text-sm mb-4">
                                                                Release {data.release}
                                                            </div>
                                                            <div className="mt-1 text-lg">
                                                                {data.price}
                                                            </div>
                                                            <div className="font-thin text-sm">
                                                                PRICE
                                                            </div>
                                                        </div>
                                                        

                                                        <button className="bg-indigo-buttonblue w-80 h-12 text-center rounded-md text-md mt-4 mb-8 self-center">
                                                            <div className="">
                                                                BUY NOW
                                                            </div>
                                                        </button>
                                                    </div>

                                                    
                                                </div>
                                            )
                                        }
                                    })}

                                        <TitledContainer title="PACK DETAILS">
                                            <div className="flex w-full">
                                                <div className="font-thin justify-start ml-7">
                                                    Each pack contains 5 cards.
                                                </div>
                                            </div>
                                        </TitledContainer>
                                </div>
                            </Main>
                        </div>
                    </div>
                </div>
            </>
        )
    } else return (
            <>
                <div className="font-montserrat h-screen relative bg-indigo-dark">
                    <div className="flex">
                        <DesktopNavbar/>
                        <div className="w-full">
                            <Main color="indigo-dark">
                                <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden">
                                    <div className="mt-20 ml-24">
                                        <TitledContainer title={`
                                            ${query.id.includes("prem") ? "PREMIUM PACK" : ""} 
                                            ${query.id.includes("base") ? "BASE PACK" : ""}`}>

                                            {packList.map(function(data,i){
                                                if(query.id === data.key){
                                                    return (
                                                        <div className="flex" key={i}>
                                                            <Image
                                                                src={data.image}
                                                                width={350}
                                                                height={300}
                                                            />

                                                            <div className="flex flex-col">
                                                                <div className="mt-12">
                                                                    {data.name}
                                                                </div>
                                                                <div className="font-thin text-sm mb-4">
                                                                    Release {data.release}
                                                                </div>
                                                                <div className="font-thin mt-4 text-sm">
                                                                    PRICE
                                                                </div>
                                                                <div>
                                                                    {data.price}
                                                                </div>

                                                                <button className="bg-indigo-buttonblue w-72 h-10 text-center rounded-md text-md mt-12">
                                                                    <div className="">
                                                                        BUY NOW
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </TitledContainer>

                                        <TitledContainer title="PACK DETAILS">
                                            <div className="flex w-full">
                                                <div className="font-thin justify-start ml-7">
                                                    Each pack contains 5 cards.
                                                </div>
                                            </div>
                                        </TitledContainer>
                                    </div>
                                </div>
                            </Main>
                        </div>
                    </div>
                </div>
            </>
    )
}