// import Image from 'next/image';
import React from 'react';
import HeaderBack from '../../components/headers/HeaderBack';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import TokenGridCol2 from '../../components/grids/TokenGridCol2';
import TeamMemberContainer from '../../components/containers/TeamMemberContainer';
import Link from 'next/link';

const playerList = [
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
        averageScore: '40',
        cost: '420 UST',
        jersey: '30',
        positions: ['PG', 'SG'],
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
    },
    {
        name: 'LEBRON JAMES',
        team: 'Los Angeles Lakers',
        id: '25',
        averageScore: '25',
        cost: '840 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
    },
    {
        name: 'DEVIN BOOKER',
        team: 'Phoenix Suns',
        id: '16450',
        averageScore: '27',
        cost: '21 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
    },
    {
        name: 'KEVIN DURANT',
        team: 'Brooklyn Nets',
        id: '12300',
        averageScore: '45',
        cost: '180 UST',
        jersey: '07',
        positions: ['PG'],
        grad1: 'indigo-black',
        grad2: 'indigo-red',
    },
    {
        name: 'BEN SIMMONS',
        team: 'Philadelphia 76ers',
        id: '21300',
        averageScore: '27',
        cost: '45.5 UST',
        jersey: '25',
        positions: ['SG', 'C'],
        grad1: 'indigo-blue',
        grad2: 'indigo-bluegrad',
    },

    // {
    //     name: '',
    //     team: '',
    //     id: '',
    //     cost: '',
    //     jersey: '',
    //     positions: [],
    //     grad1: '',
    //     grad2: '',
    // },
]

const playerLineup = [
    {
        userid: '',
        shootingGuard: '',
        pointGuard: '',
        shortForward: '',
        pointForward: '',
        center: ''
    }
]

export default function CreateLineup() { 
    return (
        <>
            <div className={`font-montserrat h-screen relative `}>
                <div className="flex flex-col w-full ">
                    <HeaderBack link="/Play"/>
                    <Main color="indigo-dark">
                        <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden">
                            <PortfolioContainer title="CREATE LINEUP">
                                <div className="flex flex-col">
                                    <div className="font-thin text-sm mt-8 mb-10 ml-6">Create your own Fantasy Team</div>
                                    <TokenGridCol2>
                                        <Link href="/EnterPlayers?pos=SF">
                                            <div>
                                                <TeamMemberContainer pos="SF" />
                                            </div>
                                        </Link>

                                        <Link href="/EnterPlayers?pos=PF">
                                            <div>
                                                <TeamMemberContainer pos="PF"/>
                                            </div>
                                        </Link>

                                        <Link href="/EnterPlayers?pos=SG">
                                            <div>
                                                <TeamMemberContainer pos="SG"/>
                                            </div>
                                        </Link>

                                        <Link href="/EnterPlayers?pos=PG">
                                            <div>
                                                <TeamMemberContainer pos="PG"/>
                                            </div>
                                        </Link>

                                        <Link href="/EnterPlayers?pos=C">
                                            <div>
                                                <TeamMemberContainer pos="C"/>
                                            </div>
                                        </Link>
                                    </TokenGridCol2>
                                </div>
                            </PortfolioContainer>
                        </div>

                        <div className='flex justify-center'> 
                            <Link href="/Play">
                                <div className="bg-indigo-lightgray w-80 h-12 mb-16 text-center rounded-md">
                                    <div className="mt-3 text-indigo-white font-black">
                                        PROCEED
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Main>
                </div>
            </div>
        </>
    );
}
