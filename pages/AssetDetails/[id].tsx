import React, { useEffect, useState } from 'react';
import Container from '../../components/containers/Container';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import Image from 'next/image';
import BackFunction from '../../components/buttons/BackFunction';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { ATHLETE } from 'data/constants/nearContracts';
import StatsComponent from './components/StatsComponent';
import Link from 'next/link';

const AssetDetails = (props) => {

    const { query } = props;
    const athleteIndex = query.id;
    const { accountId } = useWalletSelector();

    const provider = new providers.JsonRpcProvider({
        url: getRPCProvider(),
    })

    const [athlete, setAthlete] = useState([]);
    const athleteImage = athlete.map((item) => { return (item.image) }).toString();

    function query_nft_tokens_for_owner() {
        const query = JSON.stringify({ account_id: accountId, from_index: athleteIndex.toString(), limit: 1 })
    
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
            const result_two = await Promise.all(result.map(convertNftToAthlete).map(getAthleteInfoById));
            setAthlete(result_two);
          })
      }

    useEffect(() => {
        query_nft_tokens_for_owner();
    }, [])

    return (
        <Container activeName="ATHLETES">
        <div className="mt-8">
            <BackFunction prev={query.origin ? `/${query.origin}` : '/Portfolio'}></BackFunction>
        </div>
        <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
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
              <Link href="https://paras.id/collection/athlete.nfl.playible.near">
                <button className="bg-indigo-lightblue text-indigo-buttonblue w-5/6 md:w-80 h-10 
                  text-center font-bold text-md mt-12 self-center justify-center">
                    PLACE FOR SALE
                </button>
              </Link>
              <div>
            </div>
            </div>
            </div>

            <div className="grid grid-cols-2 ml-24 mt-20 mb-20 w-2/5">
              <div className="text-2xl font-bold font-monument mt-16 mr-8 align-baseline">
                PLAYER STATS
                <hr className="w-10 border-4"></hr>
              </div>
              {athlete.map((item) => {
                  const fantasyScore = item.fantasy_score;

                  if(fantasyScore.toString().length >= 5) {
                    return (
                      <div className="bg-avg-icon w-133px h-135px text-center">
                        <div className="ml-1 mt-15 font-monument text-xl text-indigo-white">
                          {fantasyScore}
                        </div>
                    </div>
                    )
                  } else {
                    return (
                      <div className="bg-avg-icon w-133px h-135px text-center">
                        <div className="ml-1 mt-14 font-monument text-3xl text-indigo-white">
                          {fantasyScore}
                        </div>
                      </div>
                    )
                  }
              })}
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

    if (query.id != query.id) {
      return {
        desination: query.origin || '/Portfolio'
      }
    }
    
    return {
        props: { query },
    };
}