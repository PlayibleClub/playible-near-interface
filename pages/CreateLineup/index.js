import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import ModalPortfolioContainer from '../../components/containers/ModalPortfolioContainer';
import Container from '../../components/containers/Container';
import BackFunction from '../../components/buttons/BackFunction';
import { playList } from '../../pages/PlayDetails/data/index.js';
import { useRouter } from 'next/router';
import Teams from '../../pages/CreateLineup/components/Teams.js';
import Data from '../../data/teams.json';
import { axiosInstance } from '../../utils/playible/';

export default function CreateLineup() {
  const router = useRouter();
  const [gameData, setGameData] = useState(null);
  const [teamModal, setTeamModal] = useState(false)

  async function fetchGameData() {
    const res = await axiosInstance.get(`/fantasy/game/${router.query.id}/`);
    if (res.status === 200) {
      setGameData(res.data);
    } else {
    }
  }

  useEffect(() => {
    if (router && router.query.id) {
      fetchGameData();
    }
  }, [router]);

  return (
    <>
      <Container>
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            {gameData ? (
              <>
                <div className="mt-8">
                  <BackFunction prev={`/PlayDetails?id=${gameData.id}`} />
                </div>
                <div className="md:ml-7 flex flex-row md:flex-row">
                  <div className="md:mr-12">
                    <div className="mt-7 justify-center md:self-left md:mr-8">
                      <Image
                        // src={gameData.image}
                        src="/images/game.png"
                        width={550}
                        height={220}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex ml-7 mb-10 w-2/5 justify-between">
                  <ModalPortfolioContainer title="CREATE TEAM" textcolor="text-indigo-black" />
                  {/* <a href={`/CreateTeam?id=${query.id}&number=${query.number}`}> */}
                  <button className="bg-indigo-buttonblue text-indigo-white whitespace-nowrap h-14 px-14 mt-4 text-center font-bold">
                    CREATE YOUR LINEUP +
                  </button>
                  {/* </a> */}
                </div>
                <div className="ml-7 mr-7 border-b-2 border-indigo-lightgray border-opacity-30 w-2/5" />
                <div className="ml-7 mt-4 w-2/5">
                  Create a team and shocase your collection. Enter a team into the tournament and
                  compete for cash prizes.
                </div>
                <div className="mt-7 ml-7 w-2/5">
                  {/* {Data[query.number - 1].roster.map(function (data, i) {
                  return (
                    <div className="">
                      <a
                        href={`/EntrySummary?team=${data.teamName}&id=${
                          Data[query.number - 1].gameId
                        }&number=${i + 1}`}
                      >
                        <div className="" key={i}>
                          {console.log(data.teamName)}
                          <Teams teamName={data.teamName} />
                        </div>
                      </a>
                    </div>
                  );
                })} */}
                </div>
              </>
            ) : (
              ''
            )}
          </Main>
        </div>
      </Container>
    </>
  );
}
