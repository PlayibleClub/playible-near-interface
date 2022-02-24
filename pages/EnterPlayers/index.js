// import Image from 'next/image';
import React, { useState } from 'react';
import HeaderBack from '../../components/headers/HeaderBack';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import TokenGridCol2 from '../../components/grids/TokenGridCol2';
import TeamMemberContainer from '../../components/containers/TeamMemberContainer';
import { useRouter } from 'next/router';
import checkIcon from '../../public/images/check.png';
import Link from 'next/link';

const playerList = [ // sample player list
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
        averageScore: '40.2',
        cost: '420 UST',
        jersey: '30',
        positions: ['PG', 'SG', 'SF'],
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers',
        id: '25',
        averageScore: '25.6',
        cost: '840 UST',
        jersey: '23',
        positions: ['PF', 'C', 'SF'],
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets',
        id: '12300',
        averageScore: '45.1',
        cost: '180 UST',
        jersey: '07',
        positions: ['PG', 'SF'],
        grad1: 'indigo-black',
        grad2: 'indigo-red',
    },
    {
        name: 'BEN SIMMONS',
        team: 'Philadelphia 76ers',
        id: '21300',
        averageScore: '27.3',
        cost: '45.5 UST',
        jersey: '25',
        positions: ['SF', 'C'],
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
    },
]

export default function EnterPlayers(props) {
    const { query } = useRouter();
    const [selectedPlayer, setPlayer] = useState("")
    const PlayerPosition = query.pos;

    return (
        <>
            <div className={`font-montserrat h-screen relative `}>
                <HeaderBack link="/CreateLineup"/>
                <div className="flex flex-col w-full ">
                    <Main color="indigo-dark">
                        <div className="flex flex-col w-full h-screen overflow-y-scroll overflow-x-hidden mb-6">
                            <PortfolioContainer title={`
                                ${PlayerPosition === "SF" ? "SMALL FORWARD" : ""} 
                                ${PlayerPosition === "PF" ? "POWER FORWARD" : ""}
                                ${PlayerPosition === "SG" ? "SHOOTING GUARD" : ""}
                                ${PlayerPosition === "PG" ? "POINT GUARD" : ""}
                                ${PlayerPosition === "C" ? "CENTER" : ""}
                            `}>
                                <div className="flex flex-col">
                                    <div className="font-thin text-sm mt-8 mb-10 ml-6">Choose your {PlayerPosition} - 
                                    {PlayerPosition === "SF" ? " Small Forward" : ""}
                                    {PlayerPosition === "PF" ? " Power Forward" : ""}
                                    {PlayerPosition === "SG" ? " Shooting Guard" : ""}
                                    {PlayerPosition === "PG" ? " Point Guard" : ""}
                                    {PlayerPosition === "C" ? " Center" : ""}</div>
                                    <TokenGridCol2>
                                        {playerList.map(function(data){
                                            if (data.positions.includes(PlayerPosition)){
                                                return (
                                                    <div onClick={()=>setPlayer(data.id)}>
                                                        {selectedPlayer === data.id ?
                                                            <img src={checkIcon} className="float-right	w-4 h-4 mr-6"/>
                                                            :
                                                            <div className="w-4 h-4 rounded-lg bg-indigo-dark border-indigo-white border float-right mr-6"></div>
                                                        }
                                                        <TeamMemberContainer id={data.id} AthleteName={data.name} AverageScore={data.averageScore} />
                                                    </div>
                                                )
                                            }
                                        })}

                                        {/* {console.log("Selected Player ID: " + selectedPlayer)} */}
                                    </TokenGridCol2>
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
                                <Link href="/CreateLineup/">
                                    <div className="flex justify-center mt-5 font-black text-indigo-white">
                                        PROCEED
                                    </div>
                                </Link>
                            </div>
                        }
                        
                    </Main>
                </div>
            </div>
        </>
    );
}
