import Image from 'next/image';
import React, { useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';

import { playList } from '../../pages/PlayDetails/data/index.js'

import { useRouter } from 'next/router';

import Lineup from '../../pages/CreateLineup/components/Lineup.js';

import Data from "../../data/teams.json"

import PlayDetailsComponent from '../../pages/PlayDetails/components/PlayDetailsComponent.js';

export default function EntrySummary() { 
    const { query } = useRouter();
    const router = useRouter();

    // const data5 = JSON.parse(Data);

    console.log(query)
        
    async function createGameData(){

        if(!router.query.id) 
        {
            return
        }

        const response = await fetch('/api/team/',
        {method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({gameId:router.query.id})
    })
    const res = await response.json()
    console.log(res)

    }

    return (
        <>
        <Container>
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <Main color="indigo-white">
                        {playList.map(function(data1, i){
                    if(router.query.id === data1.key){
                        return(
                        <>
                        <div className="mt-8">
                    <BackFunction prev={`/CreateLineup?id=${data1.key}&number=${data1.number}`}/>
                        </div>
                    <PortfolioContainer  textcolor="indigo-black" title="ENTRY SUMMARY"/>
                    <div className="md:ml-7 flex flex-row md:flex-row">
                              <div className='md:mr-12'>
                                    <div className="mt-7 justify-center md:self-left md:mr-8">
                                        <Image
                                        src={data1.image}
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
                                                ${data1.prizePool}
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                START DATE
                                            </div>
                                            <div className='text-base font-monument text-lg'>
                                                {data1.month}/{data1.date}/{data1.year}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div>
                                            REGISTRATION ENDS IN
                                        </div>
                                        <PlayDetailsComponent
                                        type="new"
                                        icon={data1.icon}
                                        prizePool={data1.prizePool}
                                        timeLeft={data1.timeLeft}
                                        startDate={data1.startDate}
                                        />
                                    </div>
                              </div>
                              </div>
                              <div className='mt-4'>
                                <PortfolioContainer title={`Team ${query.number}`} textcolor="text-indigo-black" className/>
                              </div>
                              <div className="grid grid-cols-4 gap-y-4 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                                 {Data[0].roster[(query.number)-1].athletes.map(function (data, i) {
                                              return (
                                                  <div className="">
                                                      <a href={`/EnterPlayers?pos=${data.position}`+`&id=${Data[0].gameId}`}>
                                                          <div className="" key={i}>
                                                              <Lineup
                                                                  position={data.position}
                                                                  player={data.player}
                                                                  id={data.id}
                                                                  score={data.score}
                                                                  />
                                                          </div>
                                                      </a>
                                                  </div>
                                              )
                                          }
                                      )
                                  }
                              </div>
                                </>
                                )
                            }
                            }
                        )
                        }
                    </Main>
                    </div>
		</Container>
        </>
    );
}
