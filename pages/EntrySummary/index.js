import Image from 'next/image';
import React, { useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
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
    const [name, setName] = useState("");

    const [changeNameModal, setchangeNameModal] = useState(false);

    function reset (){
        setName("")
        return
    }

        
    // const data5 = JSON.parse(Data);

    return (
        <>
        { changeNameModal === true &&
        <>
        <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex font-montserrat">
            <div className="relative p-8 bg-indigo-white w-11/12 md:w-4/12 h-10/12 md:h-auto m-auto flex-col flex rounded-lg">
                <button onClick={()=>{setchangeNameModal(false)}}>
                    <div className="absolute top-0 right-0 p-4 font-black">
                        X
                    </div>
                </button>
                    <ModalPortfolioContainer  textcolor="indigo-black" title="EDIT TEAM NAME"/>
                <div className='ml-7'>
                    <div>
                       Enter Team Name 
                    </div>
                    <div className='flex border justify-between p-4 text-bold font-monument'>
                    <form>
                            <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        /> 
                    </form>
                    <button className='mr-4' onClick={reset}>
                        X
                    </button>
                    </div>
                    <button className='bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 self-center text-indigo-white' onClick={()=>{setchangeNameModal(false)}}>
                            PROCEED
                        </button>
                </div>
            </div>
        </div>
        </>
        }
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
                              <div className='mt-4 flex'>
                                <PortfolioContainer title={`Team ${query.number}`} textcolor="text-indigo-black" className/>
                                
                                <button className='flex mt-12 ml-4 text-sm underline' onClick={()=>setchangeNameModal(true)}>
                                    Edit team name
                                </button>
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
