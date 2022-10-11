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
    
            setAthlete(result_two);
          })
      }

    return (

    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;

    return {
        props: { query },
    };
}