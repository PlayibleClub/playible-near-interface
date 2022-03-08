// import Image from 'next/image';
import React, { useState } from 'react';
import HeaderBack from '../../components/headers/HeaderBack';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import TokenGridCol4 from '../../components/grids/TokenGridCol4';
import TeamMemberContainer from '../../components/containers/TeamMemberContainer';
import { useRouter } from 'next/router';
import checkIcon from '../../public/images/check.png';
import Link from 'next/link';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import Lineup from '../../pages/CreateLineup/components/Lineup.js';

import {playerList} from './data/index.js'
import { CommunityPoolSpendProposal } from '@terra-money/terra.js';

export default function EnterPlayers(props) {
    const { query } = useRouter();
    const [selectedPlayer, setPlayer] = useState("")
    const PlayerPosition = query.pos;

    const router = useRouter();

    async function createGameData(){

        if(!router.query.id) 
        {
            return
        }

        const response = await fetch('/api/team/',
        {method:'PUT',
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
        {console.log(query)}
            <Container>
                <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
                    <Main color="indigo-white">
                        <div className="flex flex-col w-full h-screen overflow-y-scroll overflow-x-hidden mb-6">
                            <PortfolioContainer title={`SELECT YOUR 
                                ${PlayerPosition === "P" ? "PITCHER" : ""} 
                                ${PlayerPosition === "C" ? "CATCHER" : ""}
                                ${PlayerPosition === "1B" ? "FIRST BASEMAN" : ""}
                                ${PlayerPosition === "2B" ? "SECOND BASEMAN" : ""}
                                ${PlayerPosition === "3B" ? "THIRD BASEMAN" : ""}
                                ${PlayerPosition === "SS" ? "SHORTSTOP" : ""} 
                                ${PlayerPosition === "LF" ? "LEFT FIELDER" : ""}
                                ${PlayerPosition === "CF" ? "CENTER FIELDER" : ""}
                                ${PlayerPosition === "RF" ? "RIGHT FIELDER" : ""}
                                ${PlayerPosition === "IF" ? "INFIELD" : ""}
                                ${PlayerPosition === "OF" ? "OUTFIELD" : ""}
                                ${PlayerPosition === "SP" ? "STARTING PITCHER" : ""} 
                                ${PlayerPosition === "MRP" ? "MIDDLE RELIEF PITCHER" : ""}
                                ${PlayerPosition === "LRP" ? "LONG RELIEVER PITCHER" : ""}
                                ${PlayerPosition === "CL" ? "CLOSER/CLOSING PITCHER" : ""}
                                ${PlayerPosition === "DH" ? "DESIGNATED HITTER" : ""}
                                ${PlayerPosition === "PH" ? "PINCH HITTER" : ""}
                                ${PlayerPosition === "PR" ? "PINCH RUNNER" : ""}
                            `}
                            textcolor="text-indigo-black">
                                <div className="flex flex-col mt-8">
                                    <TokenGridCol4>
                                        {playerList.map(function(data){
                                            if (data.position.includes(PlayerPosition)){
                                                return (
                                                    <div onClick={()=>setPlayer(data.id)}>
                                                        {selectedPlayer === data.id ?
                                                            <img src={checkIcon} className="float-right	w-4 h-4"/>
                                                            :
                                                            <div className="w-4 h-4 rounded-lg bg-indigo-dark border-indigo-white border float-right"></div>
                                                        }
                                                        <Lineup
                                                            position={data.position}
                                                            player={data.player}
                                                            id={data.id}
                                                            score={data.score} />
                                                    </div>
                                                )
                                            }
                                        })}
                                    </TokenGridCol4>
                                </div>
                            </PortfolioContainer>
                        </div>
                        {selectedPlayer === "" ?
                            <div className="w-full h-16 bg-indigo-lightgray fixed bottom-0">
                                <div className="flex justify-center mt-5 font-black text-indigo-white">
                                    PROCEED
                                </div>
                            </div>
                        :
                            <div className="w-full h-16 bg-indigo-buttonblue fixed bottom-0">
                                {/* <a href={`/CreateLineup?id=${query.id}`} > */}
                                <button onClick={createGameData}> 
                                    <div className="flex justify-center mt-5 font-black text-indigo-white">
                                        PROCEED
                                    </div>
                                </button>
                                {/* </a> */}
                            </div>
                        }
                        
                    </Main>
                </div>
            </Container>
        </>
    );
}
