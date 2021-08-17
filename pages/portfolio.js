import React, { Component, useState } from 'react'
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Header from '../components/Header';
import Button from '../components/Button';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import RoundedContainer from '../components/RoundedContainer';
import AthleteGrid from '../components/AthleteGrid';
import AthleteContainer from '../components/AthleteContainer';
import RowContainer from '../components/RowContainer';
import AthleteTokenContainer from '../components/AthleteTokenContainer';
import filterIcon from '../public/images/filter.png'
import searchIcon from '../public/images/search.png'

const playerList = [
    {
        name: 'STEPHEN CURRY',
        team: 'Golden State Warriors',
        id: '320',
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
        cost: '840 UST',
        jersey: '23',
        positions: ['PG', 'SG'],
        grad1: 'indigo-purple',
        grad2: 'indigo-purplegrad',
    },
    {
        name: 'Devin Booker',
        team: 'Phoenix Suns',
        id: '16450',
        cost: '21 UST',
        jersey: '01',
        positions: ['SF', 'C'],
        grad1: 'indigo-darkblue',
        grad2: 'indigo-darkbluegrad',
    },
    // {
    //     name: '',
    //     team: '',
    //     cost: '',
    //     jersey: '',
    //     positions: [],
    //     grad1: '',
    //     grad2: '',
    // },
]

const Portfolio = () =>{

    const [filterMode, setMode] = React.useState(false)

    return(
            <>
                <div className="">
                    <div className="flex flex-col w-full">
                    <Header>

                    <Button color="indigo-light" saturation="0" textColor="white-light" textSaturation="500" size="py-1 px-1">=</Button>
                        <div className="text-white-light">
                        {' '}
                        <img src="images/fantasyinvestar.png" alt="Img" />
                    </div>
                    </Header>
                    </div>

                    <Main color="indigo-dark">

                    <div className="flex flex-col w-full overflow-y-auto">
                        <TitledContainer title="PORTFOLIO" className="flex w-1/2 justify-items-center">

                            <div className="flex w-11/12 mb-4 mt-4">
                                { filterMode ?
                                    <>
                                        <div className="rounded-md bg-indigo-light mr-1 w-12 h-11" onClick={()=>setMode(false)}>
                                            <div className="ml-3.5 mt-4">
                                                <img src={filterIcon}/>
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-indigo-light ml-1 h-11 w-9/12 flex">
                                            <input className="text-xl ml-4 appearance-none bg-indigo-light focus:outline-none w-10/12" type="text" placeholder="Search..." />
                                            <img src={searchIcon} className="object-none w-2/12"/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="rounded-md bg-indigo-light mr-1 h-11 w-9/12 flex font-thin">
                                            <div className="text-lg ml-4 mt-2 w-9/12">
                                                Filter by
                                            </div>
                                            <img src={filterIcon} className="object-none w-3/12"/>
                                        </div>

                                        <div className="rounded-md bg-indigo-light ml-1 w-12 h-11" onClick={()=>setMode(true)}>
                                            <div className="ml-4 mt-3">
                                                <img src={searchIcon}/>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>

                            <AthleteGrid>
                                {playerList.map(function(player, i){
                                    return (
                                        <div className='mb-4' key={i}>
                                            <AthleteContainer 
                                                AthleteName={player.name} 
                                                TeamName={player.team}
                                                ID={player.id}
                                                CoinValue={player.cost} 
                                                Jersey={player.jersey} 
                                                Positions={player.positions} 
                                                colorgrad1={player.grad1} 
                                                colorgrad2={player.grad2} 
                                            />
                                        </div>
                                    )
                                })}
                            </AthleteGrid>
                        </TitledContainer>
                    </div>

                    </Main>
                </div>
            </>
        )
}