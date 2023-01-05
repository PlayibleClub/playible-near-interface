import React, { useState } from 'react';
import Container from '../../components/containers/Container';
import 'regenerator-runtime/runtime';
import BackFunction from '../../components/buttons/BackFunction';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getContract } from 'utils/near';
import {
  OPENPACK_NFL,
  OPENPACK_PROMO_NFL,
  PACK_NFL,
  PACK_PROMO_NFL,
} from '../../data/constants/nearContracts';
import { providers } from 'near-api-js';
import BigNumber from 'bignumber.js';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import Image from 'next/image';

const sampleImage = '/images/packimages/Starter.png';
const sbImage = '/images/packimages/NFL-SB-Pack.png';
export default function PackDetails(props) {
  const { query } = props;

  const { selector } = useWalletSelector();
  const id = query.id.toString();
  console.log(query.id);
  const myPack = {
    packName: id.length === 64 || id.includes('SB') ? 'SOULBOUND PACK' : 'STARTER PACK',
    id: id,
  };

  async function execute_open_pack() {
    const transferArgs = Buffer.from(
      JSON.stringify({
        receiver_id:
          myPack.packName === 'SOULBOUND PACK'
            ? getContract(OPENPACK_PROMO_NFL)
            : getContract(OPENPACK_NFL),
        token_id: myPack.id,
        msg: 'Pack ' + myPack.id.toString() + ' sent.',
      })
    );

    const deposit = new BigNumber(8).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();

    const action_transfer_call = {
      type: 'FunctionCall',
      params: {
        methodName: 'nft_transfer_call',
        args: transferArgs,
        gas: DEFAULT_MAX_FEES,
        deposit: deposit,
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId:
            myPack.packName === 'SOULBOUND PACK'
              ? getContract(PACK_PROMO_NFL)
              : getContract(PACK_NFL),
          // @ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }
  //can add to helper

  return (
    <Container activeName="PACKS">
      <div className="md:ml-6 mt-12">
        <BackFunction prev={query.origin ? `/${query.origin}` : '/Packs'}></BackFunction>
      </div>
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
        <div className="flex flex-row ml-24 mt-10">
          <div>
            {myPack.packName === 'SOULBOUND PACK' ? (
              <Image src={sbImage} height="200" width="200" alt="pack-image" />
            ) : (
              <Image src={sampleImage} height="200" width="200" alt="pack-image" />
            )}
          </div>
          <div className="grid grid-rows">
            <div className="text-2xl font-bold font-monument">
              {myPack.packName}
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="text-lg h-0 font-bold">#{query.id}</div>
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
      </div>
    </Container>
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
    } else if (!query.id) {
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