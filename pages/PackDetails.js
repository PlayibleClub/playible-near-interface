import React, { useState, useEffect } from 'react';
import DesktopNavbar from '../components/DesktopNavbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import { useRouter } from 'next/router';
import Image from 'next/image'
import HeaderBack from '../components/HeaderBack';
import underlineIcon from '../public/images/blackunderline.png'
import Link from 'next/link';
import {BrowserView, MobileView} from 'react-device-detect'

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
    const { query } = useRouter();
    const [displayModal, setModal] = useState(false);

    return (
        <>
            <MobileView>
                <div className="font-montserrat h-screen relative bg-indigo-dark">
                    { displayModal ?
                        <>
                            <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                                <div className="relative p-8 bg-indigo-white w-80 h-96 m-auto flex-col flex rounded-lg">
                                    <button onClick={()=>{setModal(false)}}>
                                        <div className="absolute top-0 right-0 p-4 font-black">
                                            X
                                        </div>
                                    </button>

                                    <div className="font-bold flex flex-col">
                                        CONGRATULATIONS!
                                        <img src={underlineIcon} className="w-6" />
                                    </div>

                                    {packList.map(function(data,i){
                                        if(query.id === data.key){
                                            return (
                                                <div className="flex flex-col" key={i}>
                                                    <img src={data.image}/>

                                                    <div className="flex flex-col text-center">
                                                        <div className="font-bold">
                                                            {data.name}
                                                        </div>
                                                        <div className="font-thin text-sm mb-4">
                                                            Release {data.release}
                                                        </div>

                                                        <Link href="/TokenDrawPage">
                                                            <button className="bg-indigo-buttonblue w-60 h-10 text-center rounded-md text-md self-center text-indigo-white font-black">
                                                                <div className="">
                                                                    OPEN PACK
                                                                </div>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </>
                    :
                        <></>
                    }
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
                                                            <div className="" onClick={()=>{setModal(true)}}>
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
            </MobileView>
            <BrowserView>
                <div className="font-montserrat h-screen relative bg-indigo-dark">
                    { displayModal ?
                        <>
                            <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                                <div className="relative p-8 bg-indigo-white w-80 h-96 m-auto flex-col flex rounded-lg">
                                    <button onClick={()=>{setModal(false)}}>
                                        <div className="absolute top-0 right-0 p-4 font-black">
                                            X
                                        </div>
                                    </button>

                                    <div className="font-bold flex flex-col">
                                        CONGRATULATIONS!
                                        <img src={underlineIcon} className="sm:object-none md:w-6" />
                                    </div>

                                    {packList.map(function(data,i){
                                        if(query.id === data.key){
                                            return (
                                                <div className="flex flex-col" key={i}>
                                                    <img src={data.image}/>

                                                    <div className="flex flex-col text-center">
                                                        <div className="font-bold">
                                                            {data.name}
                                                        </div>
                                                        <div className="font-thin text-sm mb-4">
                                                            Release {data.release}
                                                        </div>

                                                        <Link href="/TokenDrawPage">
                                                            <button className="bg-indigo-buttonblue w-60 h-10 text-center rounded-md text-md self-center text-indigo-white font-black">
                                                                <div className="">
                                                                    OPEN PACK
                                                                </div>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </>
                    :
                        <></>
                    }
                    <div className="flex">
                        <DesktopNavbar/>
                        <div className="w-full">
                            <Main color="indigo-dark">
                                <div className="flex flex-col w-full h-full overflow-y-hidden overflow-x-hidden">
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
                                                                    <div className="" onClick={()=>{setModal(true)}}>
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
            </BrowserView>
        </>
    )
}