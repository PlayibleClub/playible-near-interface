import Image from 'next/image';
import React, { useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Link from 'next/link';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';

import { playList } from '../../pages/PlayDetails/data/index.js'

import { useRouter } from 'next/router';

import Teams from '../../pages/CreateLineup/components/Teams.js';

import Data from "../../data/teams.json"

export default function CreateLineup() { 
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
                              <BackFunction prev={`/PlayDetails?id=${data1.key}`}/>
                        </div>
                          <div className="md:ml-7 flex flex-row md:flex-row">
                              <div className='md:mr-12'>
                                    <div className="mt-7 justify-center md:self-left md:mr-8">
                                        <Image
                                        src={data1.image}
                                        width={550}
                                        height={220}
                                        />
                                    </div>
                              </div>
                            <div className="flex flex-col">
                                <div className="mt-4">
                                    <PortfolioContainer  textcolor="indigo-black" title="GAMEPLAY"/>
                                </div>
                                <div className="ml-7 mt-5 font-normal">
                                    Enter a team into the Alley-oop tournament to compete for cash prizes.
                                </div><div className="ml-7 mt-2 font-normal">
                                    Create a lineup by selecting five Playible Athlete Tokens now.
                                </div>
                            </div>
                          </div>
                        {(Data[(query.number)-1]) ? 
                        (
                            <>
                            <div className='flex mb-10'>
                                <PortfolioContainer title='CREATE TEAM' textcolor="text-indigo-black"/>
                                <a href={`/CreateTeam?id=${query.id}&number=${query.number}`}>
                                    <button className='mr-20 bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-20 bottom-0 mt-4 text-center font-bold' onClick={createGameData}>CREATE YOUR LINEUP +</button>
                                </a>
                            </div>
                            <div className='ml-7 mr-7 border-b-2 border-indigo-lightgray border-opacity-30'/>
                            <div className='ml-7 mt-4'>
                                Create a team and shocase your collection. Enter a team into the tournament and compete for cash prizes.
                            </div>
                            <div className="mt-7 ml-7">
                                 {Data[(query.number)-1].roster.map(function (data, i) {
                                              return (
                                                  <div className="">
                                                      <a href={`/EntrySummary?team=${data.teamName}&id=${Data[(query.number)-1].gameId}&number=${(i+1)}`}>
                                                          <div className="" key={i}>
                                                              {console.log(data.teamName)}
                                                              <Teams
                                                                  teamName={data.teamName}
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
                        :
                        (
                            <>
                            <div className='flex mb-10'>
                                <PortfolioContainer title='Create Team' textcolor="text-indigo-black"/>
                                <a href={`/CreateTeam?id=${query.id}&number=${query.number}`}>
                                    <button className='mr-20 bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-20 bottom-0 mt-4 text-center font-bold' onClick={createGameData}>CREATE YOUR LINEUP +</button>
                                </a>
                            </div>
                            <div className='ml-7 mr-7 border-b-2 border-indigo-lightgray border-opacity-30'/>
                            <div className='ml-7 mt-4'>
                                Create a team and shocase your collection. Enter a team into the tournament and compete for cash prizes.
                            </div>
                            </>
                        )
                            
                      }
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
