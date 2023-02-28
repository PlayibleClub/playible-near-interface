import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from 'components/containers/Container';
import 'regenerator-runtime/runtime';
import BackFunction from 'components/buttons/BackFunction';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getContract, getRPCProvider } from 'utils/near';
import {
  OPENPACK_NFL,
  OPENPACK_PROMO_NFL,
  PACK_NFL,
  PACK_PROMO_NFL,
} from 'data/constants/nearContracts';
import { providers } from 'near-api-js';
import BigNumber from 'bignumber.js';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import Image from 'next/image';
import { getSportType } from 'data/constants/sportConstants';
import {
  query_nft_supply_for_owner,
  query_nft_tokens_by_id,
  query_nft_tokens_for_owner,
} from 'utils/near/helper';
import storage from 'redux-persist/lib/storage';
const sampleImage = '/images/packimages/Starter.png';
const sbImage = '/images/packimages/NFL-SB-Pack.png';
const DECIMALS_NEAR = 1000000000000000000000000;
export default function PackDetails(props) {
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [storageDepositAccountBalance, setStorageDepositAccountBalance] = useState(0);
  const [deposit, setDeposit] = useState('');
  const [existingDeposit, setExistingDeposit] = useState(null);
  const { query } = props;
  const { selector, accountId } = useWalletSelector();
  const router = useRouter();
  const id = query.id.toString();
  console.log(query.id);
  const myPack = {
    packName:
      id.length === 64 || id.includes('SB')
        ? 'SOULBOUND PACK'
        : id.includes('PR')
        ? 'PROMO PACK'
        : 'STARTER PACK',
    id: id,
    sport: query.sport.toString().toUpperCase(),
  };
  const contract =
    myPack.id.length === 64 || myPack.id.includes('SB') || myPack.id.includes('PR')
      ? getSportType(myPack.sport).packPromoContract
      : getSportType(myPack.sport).packContract;

  const openContract =
    myPack.id.length === 64 || myPack.id.includes('SB') || myPack.id.includes('PR')
      ? getSportType(myPack.sport).openPromoContract
      : getSportType(myPack.sport).openContract;

  const [packDetails, setPackDetails] = useState([]);
  const [totalPacks, setTotalPacks] = useState(0);

  async function get_pack_token_by_id() {
    await query_nft_tokens_by_id(myPack.id, contract).then((data) => {
      //@ts-ignore:next-lines
      const result = JSON.parse(Buffer.from(data.result).toString());
      console.log(result);
      if (result.owner_id !== accountId) {
        router.push('/Packs');
      }
      setPackDetails([result]);
    });
    // setPackDetails(await query_nft_tokens_for_owner(accountId, 0, parseInt(totalPacks), contract));
  }
  async function get_pack_supply_for_owner() {
    setTotalPacks(await query_nft_supply_for_owner(accountId, contract));
  }

  async function query_storage_deposit_account_id() {
    try {
      if (selector.isSignedIn()) {
        // Get storage deposit on minter contract
        const query = JSON.stringify({ account: accountId });
        const storage_balance = await provider.query({
          request_type: 'call_function',
          finality: 'optimistic',
          account_id: openContract,
          method_name: 'get_storage_balance_of',
          args_base64: Buffer.from(query).toString('base64'),
        });
        // @ts-ignore:next-line
        const storageDeposit = JSON.parse(Buffer.from(storage_balance.result).toString());
        setStorageDepositAccountBalance(storageDeposit);
        setExistingDeposit(true);
      }
    } catch (e) {
      // No account storage deposit found
      setStorageDepositAccountBalance(0);
      setExistingDeposit(true);
    }
  }
  function check_existing_deposit() {
    let storageDeposit;
    console.log('Storage Deposit Account Balance:', storageDepositAccountBalance);
    if (storageDepositAccountBalance / DECIMALS_NEAR >= 480000000000000000000000 / DECIMALS_NEAR) {
      storageDeposit = 1;
    } else {
      storageDeposit = new BigNumber(8).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();
    }
    return storageDeposit;
  }

  async function execute_open_pack() {
    const contract = getSportType(myPack.sport);

    const transferArgs = Buffer.from(
      JSON.stringify({
        receiver_id:
          myPack.packName === 'SOULBOUND PACK' || myPack.packName === 'PROMO PACK'
            ? contract.openPromoContract
            : contract.openContract,
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
        deposit: deposit,
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId:
            myPack.packName === 'SOULBOUND PACK' || myPack.packName === 'PROMO PACK'
              ? contract.packPromoContract
              : contract.packContract,
          // @ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }
  //can add to helper
  // useEffect(() => {
  //   get_pack_supply_for_owner();
  // }, []);
  // useEffect(() => {
  //   if (totalPacks !== 0) {
  //     get_pack_token_by_id();
  //   }
  // }, [totalPacks]);
  useEffect(() => {
    get_pack_token_by_id();
    query_storage_deposit_account_id();
  }, []);

  useEffect(() => {
    if (existingDeposit === true) {
      setDeposit(check_existing_deposit());
    }
  }, [storageDepositAccountBalance, existingDeposit]);
  return (
    <Container activeName="PACKS">
      <div className="md:ml-6 mt-12">
        <BackFunction prev={query.origin ? `/${query.origin}` : '/Packs'}></BackFunction>
      </div>
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
        <div className="flex flex-row ml-24 mt-10">
          <div>
            {packDetails.map((x) => {
              return <Image src={x.metadata.media} height="200" width="200" alt="pack-image" />;
            })}
          </div>
          <div className="grid grid-rows">
            <div className="text-2xl font-bold font-monument">
              {myPack.sport + ' ' + myPack.packName}
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="text-lg h-0 font-bold">#{myPack.id}</div>
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
          {query.sport.toString().toUpperCase() === 'FOOTBALL' ? (
            <div className="mt-10">
              This pack will contain 8 randomly generated <br></br>
              American Football players.
            </div>
          ) : (
            <div className="mt-10">
              This pack will contain 8 randomly generated <br></br>
              American Basketball players.
            </div>
          )}
          <div className="mt-5 mb-12">
            <div className="mb-5">1 for each of the positions below:</div>
            {query.sport.toString().toUpperCase() === 'FOOTBALL' ? (
              <ul className="marker list-disc pl-5 space-y-3 ">
                <li>1 Quarter Back (QB)</li>
                <li>2 Running Back (RB) </li>
                <li>2 Wide Receivers (WR) </li>
                <li>1 Tight End (TE)</li>
                <li>1 Flex (RB/WR/TE) </li>
                <li>1 Super Flex (QB/RB/WR/TE) </li>
              </ul>
            ) : (
              <ul className="marker list-disc pl-5 space-y-3 ">
                <li>1 Point Guard (PG)</li>
                <li>1 Shooting Guard (SG) </li>
                <li>1 Small Forward (SF) </li>
                <li>1 Power Forward (PF)</li>
                <li>1 Center (C) </li>
                <li>1 Guard (PG/SG) </li>
                <li>1 Forward (SF/PF) </li>
                <li>1 Any (ANY) </li>
              </ul>
            )}
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
