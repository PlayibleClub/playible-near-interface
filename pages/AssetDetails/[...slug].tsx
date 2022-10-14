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
        id: slug[0],
        index: slug[1],
    }

    const athleteImage = athlete.map((item) => { return (item.image) }).toString();

    function query_nft_tokens_for_owner() {
        const query = JSON.stringify({ account_id: accountId, from_index: routerAthlete.index.toString(), limit: 1 })
    
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
    }, [])

    return (
        <Container activeName="ATHLETES">
        <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
          <div className="mt-8">
            <BackFunction prev={query.origin ? `/${query.origin}` : '/Portfolio'}></BackFunction>
          </div>

          <div className="flex flex-row ml-16 mt-10">
            <div className="mr-10">
              <object
              className=""
              type="image/svg+xml"
              data={athleteImage !== undefined ? athleteImage : '/images/tokensMLB/SP.png'}
              width={120}
              height={160}
              />
            </div>
            <div className="grid grid-rows">
              <div className="text-2xl font-bold font-monument">
                PLAYER DETAILS
                <hr className="w-10 border-4"></hr>
              </div>
              <div className="mt-10 text-m h-0 font-bold">
                {athlete.map((item) => { return (item.name)}).toString().toUpperCase()}
              </div>
              <div className="mt-10 text-sm grid grid-rows-2 grid-cols-2">
                <div>
                  FANTASY SCORE
                </div>
                <div>
                  PLAY TRACKER
                </div>
                <div>
                  {athlete.map((item) => { return (item.fantasy_score)})}
                </div>
                <div>
                  {athlete.map((item) => { return (item.usage)})} 
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
            
            <div className="flex flex-row ml-24 mt-20">
              <div className="grid grid-cols-2">
                <div className="text-2xl font-bold font-monument mt-16 mr-8">
                  PLAYER STATS
                  <hr className="w-10 border-4"></hr>
                </div>
                <div className="mb-14 relative">
                <Image src={'/images/avgscore.png'} width={133} height={135} />
                <div className="font-monument absolute text-3xl text-indigo-white top-14 left-8 
                -translate-x-1/2 -translate-y-1/2">
                  {athlete.map((item) => { return (item.fantasy_score)})}
                </div>


                </div>
              </div>
            </div>
        
            <StatsComponent
              id={athlete.map((item) => { return (item.primary_id) })} 
              position={athlete.map((item) => { return (item.position) })}
            />

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