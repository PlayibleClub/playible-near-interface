import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Container from '../../components/containers/Container';
import Main from '../../components/Main'
import React, { useEffect, useState } from 'react';
import banner from '../../public/images/promotionheader.png';
import 'regenerator-runtime/runtime';
import Head from 'next/head';
import Select from 'react-select'
import mint from '../../public/images/mintpage.png';
import ProgressBar from "@ramonak/react-progress-bar";



export default function Home(props) {

  const options = [
    { value: 'national', label: 'National Football League' },
    { value: 'local', label: 'Local Football League' },
    { value: 'international', label: 'International Football League' }
  ]

  return (
    <>
      <Head>
        <title>Playible - Next Generation of Sports Collectibles</title>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png" />
   
      </Head>
      <Container activeName="MINT">
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center md:pb-12 text-indigo-black">
          <Main color="indigo-white">
            <div className="flex flex-col md:flex-row md:ml-12">
              <div className="md:w-full">
                <div className="flex justify-between w-full bg-lime-600 mt-8">
                  <div className="text-xl font-bold font-monument ">
                    MINT PACKS
                    <hr className="w-10 border-4"></hr>
                  </div>
                  <Select options={options} className='w-1/3 mr-9' />
                </div>
                <div className="flex flex-row mt-12">
                  <div className="w-1/2">
                    <img src={mint}></img>
                  </div>
                  <div className="w-1/2 ml-8  ">
                    <div className="text-xl font-bold font-monument ">
                    WHITELIST MINT
                    <hr className="w-10 border-4"></hr>
                    </div>
                    <div className="flex justify-between w-1/2 mt-5">
                      <div>
                        <div className="text-xs">PRICE</div>
                        <div className="font-black"> $200 USDT</div>
                      </div>
                      <div className=""> hii </div>
                    </div>
                    <div className="text-xs mt-8">MINT STARTS IN</div>
                    <div className="border border-gray-100 rounded-2xl text-center p-4 w-40 flex flex-col justify-center  mt-8" >
                      <div className="text-2xl font-black font-monument ">0/7</div>
                      <div className="text-xs">YOU HAVE MINTED</div>
                    </div>
                    <div className="mt-8 mb-0 p-0 w-4/5"><ProgressBar completed={10} maxCompleted={100} bgColor={'#3B62F6'}/></div>
                    <div className="text-xs ">10,000/10,000 packs remaining</div>

                    <div className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 ">
                      MINT NFL STARTER PACK SOON
                      </div>
                  </div>
                </div>
                

                <div className="text-xl font-bold font-monument mt-12 ">
                    PUBLIC MINT
                    <hr className="w-10 border-4"></hr>
                </div>
                <div className="mt-10 mb-10">
                  Open: 14:00 UTC 25/08/22
                </div>
                <div className="text-xl font-bold font-monument ">
                    PACK DETAILS
                    <hr className="w-10 border-4"></hr>
                </div>
                <div className="mt-10">
                  This pack will contain 8 randomly generated <br></br>
                  NFL players.
                </div>
                <div className="mt-5 mb-12">
                  <div className="mb-5">1 for each of the positions below:</div>
                  <ul className="marker list-disc pl-5 space-y-3 ">
                    <li> 1 Quarter Back (QB)</li>
                    <li>2 Running Back (RB) </li>
                    <li> 2 Wide Receivers (WR) </li>
                    <li>1 Tight End (TE)</li>
                    <li>1 Flex (RB/WR/TE) </li>
                    <li>1 Super Flex (QB/RB/WR/TE) </li>
                  </ul>


                  
                </div>
                
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
}


