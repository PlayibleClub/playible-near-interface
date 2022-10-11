import React, { useEffect, useState } from 'react';
import Container from '../../components/containers/Container';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import { useRouter } from 'next/router';
import Image from 'next/image';
import BackFunction from '../../components/buttons/BackFunction';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { ATHLETE } from 'data/constants/nearContracts';
import StatsComponent from './components/StatsComponent';
import PerformerContainer from 'components/containers/PerformerContainer';

const AssetDetails = (props) => {
    const { accountId } = useWalletSelector();
    const { query } = props;
    const router = useRouter();
    const { slug } = router.query;
    const provider = new providers.JsonRpcProvider({
        url: getRPCProvider(),
    })

    const [athlete, setAthlete] = useState([]);

    const routerAthlete = {
        id: query.id,
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
    
            setAthlete(result_two);
          })
      }

    useEffect(() => {
        query_nft_tokens_for_owner();
    })

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
                ATHLETE NAME
              </div>
              <div className="mt-10 text-sm grid grid-rows-2 grid-cols-2">
                <div>
                  FANTASY SCORE
                </div>
                <div>
                  PLAY TRACKER
                </div>
                <div>
                  ATHLETE SCORE
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
              
          {athlete.filter(athlete => athlete.athlete_id === routerAthlete.id).map((item) => {
            return (
              <PerformerContainer
                            key={item.athlete_id}
                            AthleteName={item.name}
                            AvgScore={item.fantasy_score}
                            id={item.athlete_id}
                            uri={item.image}
              ></PerformerContainer>
            );
          })}
  
          {/* {athlete.filter(athlete => athlete.athlete_id === routerAthlete.id).map} */}
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

            <StatsComponent passingYards="placeholder"></StatsComponent>
  
            </div>
      </Container>
    )
}

export default AssetDetails;

export async function getServerSideProps(ctx) {
    const { query } = ctx;

    return {
        props: { query },
    };
}