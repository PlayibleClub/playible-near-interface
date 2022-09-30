import React, { useState } from 'react';
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

const DEFAULT_MAX_FEES = '300000000000000';

export default function PackDetails(props) {
  const { query } = props;

  const { selector, accountId } = useWalletSelector();

  const myPack = {
    packName: 'STARTER PACK',
    id: query.id,
  };

  async function execute_open_pack() {
    const transferArgs = Buffer.from(
      JSON.stringify({
        receiver_id: OPENPACK.testnet,
        token_id: myPack.id,
        msg: 'Pack ' + myPack.id.toString() + ' sent.',
      })
    );

    const action_transfer_call = {
      type: 'FunctionCall',
      params: {
        methodName: 'nft_transfer_call',
        args: transferArgs,
        gas: DEFAULT_MAX_FEES,
        deposit: '1',
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: PACK.testnet,
          // @ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }

  return (
    <>
      <Container activeName="PACKS">
        <div className="mt-8">
          <BackFunction prev={query.origin ? `/${query.origin}` : '/Packs'}></BackFunction>
        </div>
        <div className="flex flex-row ml-24 mt-10">
          <div>
            <img src={sampleImage} height={200} width={200}></img>
          </div>
          <div className="grid grid-rows">
            <div className="text-2xl font-bold font-monument">
              {myPack.packName}
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="text-lg h-0 font-bold">#NFL{query.id}</div>
            <div className="text-sm">RELEASE 1</div>
            <button
              className="bg-indigo-buttonblue text-indigo-white w-5/6 md:w-80 h-10 text-center font-bold text-sm mt-4"
              onClick={() => execute_open_pack()}
            >
              OPEN PACK
            </button>
          </div>
        </div>

        <div className="ml-8 md:ml-28 mt-16">
          <div className="text-2xl font-bold font-monument ">
            PACK DETAILS
            <hr className="w-10 border-4"></hr>
          </div>
          <div className="mt-10">
            This pack will contain 8 randomly generated <br></br>
            American Football players.
          </div>
          <div className="mt-5 mb-12">
            <div className="mb-5">1 for each of the positions below:</div>
            <ul className="marker list-disc pl-5 space-y-3 ">
              <li>1 Quarter Back (QB)</li>
              <li>2 Running Back (RB) </li>
              <li>2 Wide Receivers (WR) </li>
              <li>1 Tight End (TE)</li>
              <li>1 Flex (RB/WR/TE) </li>
              <li>1 Super Flex (QB/RB/WR/TE) </li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query) {
    if (query.transactionHashes) {
      return {
        redirect: {
          destination: query.origin || `/TokenDrawPage/${query.transactionHashes}`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: query.origin || '/Packs',
          permanent: false,
        },
      };
    }
  }

  return {
    props: { query },
  };
}
