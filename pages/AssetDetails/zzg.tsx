import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import 'regenerator-runtime/runtime';

import PortfolioContainer from '../../components/containers/PortfolioContainer';
import Main from '../../components/Main';
import PlayerContainer from '../../components/containers/PlayerContainer';
import PlayerStats from '../../components/PlayerStats';
import Container from '../../components/containers/Container';

import filterIcon from '../../public/images/filterBlack.png';
import underlineIcon from '../../public/images/blackunderline.png';

import { connect, useDispatch, useSelector } from 'react-redux';

import CongratsModal from './components/CongratsModal';
import LoadingPageDark from '../../components/loading/LoadingPageDark';

import { position } from '../../utils/athlete/position';
import { axiosInstance } from '../../utils/playible';

import {
  GET_ATHLETEDATA_QB
} from '../../utils/queries';
import { useLazyQuery } from '@apollo/client';

//newer shit that i actually use
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import { useRouter } from 'next/router';
import Image from 'next/image';
import BackFunction from '../../components/buttons/BackFunction';
import Link from 'next/link';
import client from 'apollo-client';
import PerformerContainer from '../../components/containers/PerformerContainer'
import { Provider } from '@near-wallet-selector/core/lib/services';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { ATHLETE } from 'data/constants/nearContracts';
// import { getQBInfoById } from 'utils/athlete/helper';
//placeholder image


const AssetDetailsOld2 = (props) => {
  const { query } = props;

  const { accountId } = useWalletSelector();
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  })

  const [athleteData, setAthleteData] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [tezt, setTezt] = useState([]);
  const [getAthleteQB] = useLazyQuery(GET_ATHLETEDATA_QB);

  const router = useRouter();
  const { slug } = router.query;

  console.log("slug: " + slug[0]);
  console.log("ath data: " + athleteData);

  const myAthlete = {
    id: slug[0],
    athleteName: slug[1],
    fantasyScore: slug[2],
  }

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({ account_id: accountId, from_index: "0", limit: 1 })

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'nft_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64',)
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        const result_two = await Promise.all(result.map(convertNftToAthlete).map(getAthleteInfoById));;

        setAthletes(result_two);
      })
  }

  //start - enumgettoken query
  // function query_nft_by_id() {
  //   const query = JSON.stringify({ owner_id: accountId, token_id: myAthlete.id })

  //   provider
  //     .query({
  //       request_type: 'call_function',
  //       finality: 'optimistic',
  //       account_id: getContract(ATHLETE),
  //       method_name: 'enum_get_token',
  //       args_base64: Buffer.from(query).toString('base64'),
  //     })
  //     .then((data) => {
  //       // @ts-ignore:next-line
  //       const result = JSON.parse(Buffer.from(data.result));

  //       setTezt(result);
  //     })
  // }

  // console.log("asdasdasd:" + tezt);

  useEffect(() => {
    // query_nft_by_id();
    query_nft_tokens_for_owner();
  })
  //end - enumgettoken query

  //display stats for player. placeholder, will make another component
  const tempPos = "QB";
  //param should be position
  function displayStats(pos) {
    //if qb, etc
    //should probably make another component for this 
    return (
      <>
      <div className="flex h-1/8 w-1/3 ml-24 -mt-8 justify-center content-center select-none text-center text-4xl 
      bg-indigo-black font-monument text-indigo-white p-2 pl-5">
        <div className="">
          QUARTER BACK
        </div>
      </div>

      <div className="mt-10 ml-24 w-1/2 text-sm grid grid-rows-4 grid-cols-4">
        <div>
          1 
          <br></br>
          COMPLETIONS/ATTEMPTS
        </div>
        <div>
          2
          <br></br>
          PASSING YARDS
        </div>
        <div>
          3
          <br></br>
          PASSING TOUCHDOWNS
        </div>
        <div>
          4
          <br></br>
          INTERCEPTIONS
        </div>
        <div>
          5
          <br></br>
          RUSHING YARDS
        </div>
        <div>
          6
          <br></br>
          RUSHING TOUCHDOWNS
        </div>
        <div>
          7 
          <br></br>
          CARRIES
        </div>
        <div>
          8
          <br></br>
          FREE SPACE
        </div>
      </div>
      </>
    )
  }

  return (
    <Container activeName="ATHLETES">
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
        <div className="mt-8">
          <BackFunction prev={query.origin ? `/${query.origin}` : '/Portfolio'}></BackFunction>
        </div>
        <div className="flex flex-row ml-24 mt-10">
          <div className="mr-10">
            <Image src={'/images/tokensMLB/SP.png'} width={120} height={160} />
            
          </div>
          <div className="grid grid-rows">
            <div className="text-2xl font-bold font-monument">
              PLAYER DETAILS
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="mt-10 text-m h-0 font-bold">
              {myAthlete.athleteName.toUpperCase()}
            </div>
            <div className="mt-10 text-sm grid grid-rows-2 grid-cols-2">
              <div>
                FANTASY SCORE
              </div>
              <div>
                PLAY TRACKER
              </div>
              <div>
                {myAthlete.fantasyScore}
              </div>
              <div>
                (PLACEHOLDER) 
                {/* {data.getAthletes.map(function ({ passingYards}, i){
                  return(
                    <div className="" key={i}>
                      {passingYards}
                      test
                    </div>
                  );
                })} */}
              </div>
            </div>
            <button className="bg-indigo-lightblue text-indigo-buttonblue w-5/6 md:w-80 h-10 
              text-center font-bold text-md mt-12 self-center justify-center cursor-not-allowed">
                PLACE FOR SALE - COMING SOON
            </button>

            <div>
          </div>
          </div>
          </div>

          <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
        {/* {athletes.filter(athlete => athlete.athlete_id === myAthlete.id).map((item) => {
          return (
            <PerformerContainer
                          key={item.athlete_id}
                          AthleteName={item.name}
                          AvgScore={item.fantasy_score}
                          id={item.athlete_id}
                          uri={item.image}
            ></PerformerContainer>
          );
        })} */}

        {athletes.filter(athlete => athlete.athlete_id === myAthlete.id).map}
      </div>
          
          <div className="flex flex-row ml-24 mt-20">
            <div className="grid grid-cols-2">
              <div className="text-2xl font-bold font-monument mt-16 mr-8">
                PLAYER STATS
                <hr className="w-10 border-4"></hr>
              </div>
              <div className="mb-14">
                <Image src={'/images/avgscore.png'} width={133} height={135} />
              </div>
            </div>
          </div>

          {/* {displayStats()} */}

          </div>
    </Container>
  )
}

export default AssetDetailsOld2;

// export async function getServerSideProps(ctx) {
//   const { query } = ctx;
  
  // if (query) {
  //   if (query.id && query.token_id) {
  //     queryObj = query;
  //   } else {
  //     return {
  //       redirect: {
  //         destination: query.origin || '/Portfolio',
  //         permanent: false,
  //       },
  //     };
  //   }
  // }

  // let playerStats = null;
  // const res = await axiosInstance.get(`/fantasy/athlete/${parseInt(queryObj.id)}/stats/`);

  // if (res.status === 200) {
  //   playerStats = res.data;
  // }

  // return {
  //   props: { query },
  // };
// }
