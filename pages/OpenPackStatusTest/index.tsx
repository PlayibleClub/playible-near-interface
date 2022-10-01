import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import TransactionModal from '../../components/modals/TransactionModal';
import { useRouter } from 'next/router';
import Image from 'next/image';
import 'regenerator-runtime/runtime';
import * as statusCode from '../../data/constants/status';
import { useDispatch, useSelector } from 'react-redux';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';
import claimreward from '../../public/images/claimreward.png';
import sampleImage from '../../public/images/packimages/Starter.png';

import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider, getContract } from 'utils/near';
import { OPENPACK, PACK } from '../../data/constants/nearContracts';
import { providers } from 'near-api-js';
import axios from 'axios';
import PackComponent from 'pages/Packs/components/PackComponent';

export default function OpenPackStatusTest() {

    //CW1WWW5VBYakm42VSvC3nJducQZ4kDNo486kbDkrNBSr
    const txHash = "CW1WWW5VBYakm42VSvC3nJducQZ4kDNo486kbDkrNBSr";
    const [data, setData] = useState(null);
    const [athletes, setAthletes] = useState([]);
    const [test, setTest] = useState("");
    const [sortedAthletes, setSortedAthletes] = useState([]);
    const provider = new providers.JsonRpcProvider({
        url: getRPCProvider(),
    })

    const { accountId } = useWalletSelector();

    //gets the token metadata title of the 8 minted athletes from txhash
    async function getStatus(txHash, accountId) {

        const result = JSON.stringify((await provider.txStatus(txHash, accountId)).receipts_outcome)
        .split(" ").filter(word => word.includes("CR"));

        const transaction = await provider.txStatus(txHash, accountId);

        const result = JSON.stringify(transaction)

        const result = JSON.stringify((await provider.txStatusReceipts(txHash, accountId)));

        setData(providers.getTransactionLastResult(transaction));
        console.log(JSON.stringify(providers.getTransactionLastResult(transaction)));
    }

    function query_test() {
        // const query = JSON.stringify({ accountId: accountId });

        provider
            .query({
                jsonrpc: "2.0",
                id: accountId,
                method: "txStatus",
                params: ["CW1WWW5VBYakm42VSvC3nJducQZ4kDNo486kbDkrNBSr", accountId],
            })
            .then((data) => {
                // @ts-ignore:next-line
                const result = JSON.parse(Buffer.from(data.result).toString());

                setTest(result);
            });
    }

    function query_nft_tokens_for_owner() {
        const query = JSON.stringify({ account_id: accountId, limit: 50 });
    
        provider
          .query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: 'athlete.nfl.playible.testnet',
            method_name: 'nft_tokens_for_owner',
            args_base64: Buffer.from(query).toString('base64'),
          })
          .then((data) => {
            // @ts-ignore:next-line
            const result = JSON.parse(Buffer.from(data.result).toString());
    
            setAthletes(result);
          });
      }

    useEffect(() => {
        getStatus(txHash, accountId);
        query_test();
        // query_nft_tokens_for_owner();
    })

    return (
        <Container activeName="SQUAD">
        <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
          <Main color="indigo-white">
            <div className="md:ml-6">
              <PortfolioContainer textcolor="indigo-black" title="SQUAD">
                <div className="flex flex-col">
                    {/* {test} */}
                <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                    {/* {athletes.map(({ metadata, token_id }) => (
                      <PackComponent image={metadata.media} id={token_id}></PackComponent>
                    ))} */}
                </div>
                </div>
              </PortfolioContainer>
              <div className="absolute bottom-10 right-10">
            </div>
            </div>
          </Main>
        </div>
      </Container>
    )
}