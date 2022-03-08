import Image from 'next/image';
import React, { useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Link from 'next/link';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';

import { playList } from '../../pages/PlayDetails/data/index.js'

import { useRouter } from 'next/router';

import Lineup from '../../pages/CreateLineup/components/Lineup.js';

import Data from "../../data/teams.json"

export default function CreateLineup() { 
    const { query } = useRouter();

    return (
        <>
        <Container>
            <BackFunction prev={`/CreateTeam?id=${query.id}`}/>
            <PortfolioContainer title="CREATE LINEUP" textcolor="text-indigo-black">
                <div className="flex flex-col">
            <PortfolioContainer title={`Team ${Data[0].gameId}`} textcolor="text-indigo-black"/>
                <div className="grid grid-cols-4 gap-y-4 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                    {Data[0].roster[0].athletes.map(function (data, i) {
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
                </div>
            </PortfolioContainer>
		</Container>
        </>
    );
}
