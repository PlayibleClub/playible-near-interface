import React, { useState, useEffect } from 'react';
import Container from '../../components/containers/Container';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Main from '../../components/Main';

import PortfolioContainer from '../../components/containers/PortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';

import { playList } from '../../pages/PlayDetails/data/index.js'

export default function PackDetails() {

    const router = useRouter();

	return (
    
		<Container>
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
            <Main color="indigo-white">
              <div className="md:ml-6">
                {playList.map(function(data, i){
                      if(router.query.id === data.key){
                        return(
                        <>
                          {/* <div className="invisible">
                              <PortfolioContainer color="indigo-white" textcolor="indigo-black" title="PACKS"/>
                          </div> */}
                          <div className="mt-8">
                              <BackFunction prev="/Packs"/>
                          </div>
                          <div className="mt-8 md:ml-7 flex flex-row md:flex-row" key={i}>
                              <div>
                                    <div className="mt-7 justify-center md:self-left md:mr-16">
                                        <Image
                                        src={data.image}
                                        width={600}
                                        height={300}
                                        />
                                    </div>
                                    <div className='flex space-x-14 mt-4'>
                                        <div>
                                            <div>
                                                PRIZE POOL
                                            </div>
                                            <div className='font-black font-monument text-lg'>
                                                ${data.prize}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                START DATE
                                            </div>
                                            <div className='font-black font-monument text-lg'>
                                                {data.month}/{data.date}/{data.year}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div>
                                            REGISTRATION ENDS IN
                                        </div>
                                        <div className='flex space-x-2 mt-2'>
                                            <div className='bg-indigo-darkgray text-indigo-white p-2 rounded'> 
                                                01
                                            </div>
                                            <div className='bg-indigo-darkgray text-indigo-white p-2 rounded'>
                                                02
                                            </div>
                                            <div className='bg-indigo-darkgray text-indigo-white p-2 rounded'>
                                                03
                                            </div>
                                        </div>
                                    </div>
                              </div>
                              <div className="flex flex-col">
                                <PortfolioContainer textcolor="indigo-black" title={data.name}/>
                                  <div className="ml-12 md:ml-0 mt-4 md:mt-0">
                                    <div className="ml-7 mt-7 font-bold text-base">{data.name}</div>
                                    <div className="ml-7 mb-6">Release {data.release}</div>
                                    <div className="ml-7 ">Price</div>
                                    <div className="ml-7 font-bold text-base"></div>
                                  </div>
                                  <button className="bg-indigo-buttonblue ml-7 text-indigo-white w-5/6 md:w-60 h-10 text-center font-bold text-md mt-4" onClick={() => {executePurchasePack()}}>
                                      BUY NOW - 
                                  </button>
                              </div>
                          </div>
                          <div className="mt-8">
                              <PortfolioContainer  textcolor="indigo-black" title="GAMEPLAY"/>
                          </div>
                          <div className="ml-7 mt-5 font-normal">
                              Enter a team into the Alley-oop tournament to compete for cash prizes.
                          </div><div className="ml-7 mt-5 font-normal">
                              Create a lineup by selecting five Playible Athlete Tokens now.
                          </div>
                        </>
                        )
                      }
                    }
                  )
                }
              </div>
            </Main>
          </div>
		</Container>
	)
}