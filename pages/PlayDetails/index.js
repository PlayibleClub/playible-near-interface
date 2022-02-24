import React, { useState, useEffect } from 'react';
import Container from '../../components/containers/Container';
import { useRouter } from 'next/router';
import Image from 'next/image'
import Main from '../../components/Main';

import PortfolioContainer from '../../components/containers/PortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';

import { playList, leaderboard } from '../../pages/PlayDetails/data/index.js'

import PlayDetailsComponent from './components/PlayDetailsComponent.js';

export default function PlayDetails() {

    const router = useRouter();

	return (
    
		<Container>
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
            <Main color="indigo-white">
              <div className="md:ml-6">
              <div className="mt-8">
                <BackFunction prev="/Play"/>
              </div>
                {playList.map(function(data, i){
                      if(router.query.id === data.key){
                        return(
                        <>
                          {/* <div className="invisible">
                              <PortfolioContainer color="indigo-white" textcolor="indigo-black" title="PACKS"/>
                          </div> */}
                          <div className="md:ml-7 flex flex-row md:flex-row">
                              <div className='md:mr-12'>
                                    <div className="mt-7 justify-center md:self-left md:mr-8">
                                        <Image
                                        src={data.image}
                                        width={550}
                                        height={220}
                                        />
                                    </div>
                                    <div className='flex space-x-14 mt-4'>
                                        <div>
                                            <div>
                                                PRIZE POOL
                                            </div>
                                            <div className='text-base font-monument text-lg'>
                                                ${data.prizePool}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                START DATE
                                            </div>
                                            <div className='text-base font-monument text-lg'>
                                                {data.month}/{data.date}/{data.year}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div>
                                            REGISTRATION ENDS IN
                                        </div>
                                        <PlayDetailsComponent
                                        type="new"
                                        icon={data.icon}
                                        prizePool={data.prizePool}
                                        timeLeft={data.timeLeft}
                                        startDate={data.startDate}
                                        />

                                        <div className='flex'>
                                            <button className={
                                                data.team === true || data.status === 'ongoing' ? 'bg-indigo-lightblue text-indigo-buttonblue w-4/6 md:w-64 h-12 text-center font-bold text-md mt-8 mr-4' : 'bg-indigo-lightblue text-indigo-buttonblue w-4/6 md:w-64 h-12 text-center font-bold text-md mt-8 hidden'} >
                                                VIEW TEAM
                                            </button>
                                            <a href={`/CreateLineup?id=${data.key}`}>
                                            <button className='bg-indigo-buttonblue text-indigo-white w-4/6 md:w-64 h-12 text-center font-bold text-md mt-8'>
                                                ENTER GAME
                                            </button>
                                            </a>
                                        </div>
                                    </div>
                              </div>
                              <div className="flex flex-col">
                                <PortfolioContainer textcolor="indigo-black" title='LEADERBOARD'/>
                                    <div className="ml-12 md:ml-10 mt-4 md:mt-0">
                                        <div>
                                            {leaderboard.map(function(data,key)
                                            {
                                                return(
                                                    <div className='flex text-center'>
                                                        <div className='w-10 mt-4 mr-2 font-monument text-xl'>
                                                            {
                                                                key+1 <= 9 ? '0'+(key+1) : key+1
                                                            }
                                                        </div>
                                                        <div className='bg-indigo-black text-indigo-white w-40 mt-3 text-center p-1 text-base font-monument'>
                                                            {data.wallet}
                                                        </div>
                                                        <div className='ml-16 w-10 text-center mt-3 font-black'>
                                                            {data.score}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                              </div>
                          </div>
                          <div className="mt-4">
                              <PortfolioContainer  textcolor="indigo-black" title="GAMEPLAY"/>
                          </div>
                          <div className="ml-7 mt-5 font-normal">
                              Enter a team into the Alley-oop tournament to compete for cash prizes.
                          </div><div className="ml-7 mt-2 font-normal">
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