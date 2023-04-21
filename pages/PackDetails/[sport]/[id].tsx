import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from 'components/containers/Container';
import 'regenerator-runtime/runtime';
import BackFunction from 'components/buttons/BackFunction';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import BigNumber from 'bignumber.js';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import Image from 'next/image';
import { getSportType } from 'data/constants/sportConstants';
import { query_nft_tokens_by_id } from 'utils/near/helper';
const DECIMALS_NEAR = 1000000000000000000000000;
const MINT_10_COST = 600000000000000000000000;
const MINT_8_COST = 480000000000000000000000;
export default function PackDetails(props) {
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const [deposit, setDeposit] = useState('');
  const { query } = props;
  const { selector, accountId } = useWalletSelector();
  const router = useRouter();
  const id = query.id.toString();
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

  async function get_pack_token_by_id() {
    await query_nft_tokens_by_id(myPack.id, contract).then((data) => {
      //@ts-ignore:next-lines
      const result = JSON.parse(Buffer.from(data.result).toString());
      if (result.owner_id !== accountId) {
        router.push('/Packs');
      }
      setPackDetails([result]);
    });
  }

  async function query_storage_deposit_account_id() {
    try {
      if (selector.isSignedIn()) {
        // Get storage deposit on minter contract
        const query = JSON.stringify({ account: accountId });
        await provider
          .query({
            request_type: 'call_function',
            finality: 'optimistic',
            account_id: openContract,
            method_name: 'get_storage_balance_of',
            args_base64: Buffer.from(query).toString('base64'),
          })
          .then((data) => {
            //@ts-ignore:next-line
            const storageDeposit = JSON.parse(Buffer.from(data.result).toString());
            setDeposit(computeDeposit(storageDeposit));
          });
        // @ts-ignore:next-line
      }
    } catch (e) {
      console.log(e);
      // No account storage deposit found
      setDeposit(computeDeposit(0));
    }
  }

  // function computeDeposit(deposit) {
  //   if (deposit / DECIMALS_NEAR >= 480000000000000000000000 / DECIMALS_NEAR) {
  //     return '1';
  //   } else if (myPack.sport === 'BASEBALL') {
  //     return new BigNumber(10).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();
  //   } else {
  //     return new BigNumber(8).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();
  //   }
  // }

  function computeDeposit(deposit) {
    if (myPack.sport === 'BASEBALL') {
      if (deposit / DECIMALS_NEAR >= MINT_10_COST / DECIMALS_NEAR) {
        return '1';
      } else {
        // return new BigNumber((MINT_10_COST / DECIMALS_NEAR) - (deposit / DECIMALS_NEAR)).multipliedBy(new BigNumber(DECIMALS_NEAR)).toFixed();
        return new BigNumber(10).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();
      }
    } else {
      if (deposit / DECIMALS_NEAR >= MINT_8_COST / DECIMALS_NEAR) {
        return '1';
      } else {
        // return new BigNumber((MINT_8_COST / DECIMALS_NEAR) - (deposit / DECIMALS_NEAR)).multipliedBy(new BigNumber(DECIMALS_NEAR)).toFixed();
        return new BigNumber(8).multipliedBy(new BigNumber(MINT_STORAGE_COST)).toFixed();
      }
    }
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

  useEffect(() => {
    get_pack_token_by_id();
    query_storage_deposit_account_id();
  }, []);

  return (
    <Container activeName="PACKS">
      <div className="md:ml-6 mt-12">
        <BackFunction prev={query.origin ? `/${query.origin}` : '/Packs'}></BackFunction>
      </div>
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
        <div className="flex flex-row md:ml-24 iphone5:ml-4 md:mt-10 iphone5:mt-20">
          <div>
            {packDetails.map((x) => {
              return <Image src={x.metadata.media} height="200" width="200" alt="pack-image" />;
            })}
          </div>
          <div className="grid grid-rows">
            <div className="iphone5:text-base md:text-2xl font-bold font-monument">
              {myPack.sport + ' ' + myPack.packName}
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="md:text-lg iphone5:text-sm md:h-0 iphone5:h-5 font-bold">
              #{myPack.id}
            </div>
            <div className="text-sm">RELEASE 1</div>
            <button
              className="bg-indigo-buttonblue text-indigo-white w-5/6 md:w-80 h-10 text-center font-bold text-sm mt-4"
              onClick={() => execute_open_pack()}
            >
              OPEN PACK
            </button>
          </div>
        </div>
        <div className="ml-8 md:ml-28 mt-10">
          <div className="text-2xl font-bold font-monument ">
            PACK DETAILS
            <hr className="w-10 border-4"></hr>
          </div>
          {query.sport.toString().toUpperCase() === 'FOOTBALL' ? (
            <div className="mt-10">
              This pack will contain 8 randomly generated <br></br>
              American Football players.
            </div>
          ) : query.sport.toString().toUpperCase() === 'BASKETBALL' ? (
            <div className="mt-10">
              This pack will contain 8 randomly generated <br></br>
              American Basketball players.
            </div>
          ) : query.sport.toString().toUpperCase() === 'BASEBALL' ? (
            <div className="mt-10">
              This pack will contain 10 randomly generated <br></br>
              American Baseball players.
            </div>
          ) : (
            <div className="mt-10">
              This pack will contain 12 randomly generated <br></br>
              American Cricket players.
            </div>
          )}
          <div className="mt-5 mb-12">
            {query.sport.toString().toUpperCase() === 'BASEBALL' ? (
              <div className="mb-5">An amount for each of the positions below:</div>
            ) : (
              <div className="mb-5">1 for each of the positions below:</div>
            )}
            {query.sport.toString().toUpperCase() === 'FOOTBALL' ? (
              <ul className="marker list-disc pl-5 space-y-3 ">
                <li>1 Quarter Back (QB)</li>
                <li>2 Running Back (RB) </li>
                <li>2 Wide Receivers (WR) </li>
                <li>1 Tight End (TE)</li>
                <li>1 Flex (RB/WR/TE) </li>
                <li>1 Super Flex (QB/RB/WR/TE) </li>
              </ul>
            ) : query.sport.toString().toUpperCase() === 'BASKETBALL' ? (
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
            ) : query.sport.toString().toUpperCase() === 'BASEBALL' ? (
              <ul className="marker list-disc pl-5 space-y-3 ">
                <li>2 Pitchers (P)</li>
                <li>1 Catcher (C)</li>
                <li>1 First Baseman (1B) </li>
                <li>1 Second Baseman (2B)</li>
                <li>1 Third Baseman (3B)</li>
                <li>1 Shortstop (SS) </li>
                <li>2 Outfielder (OF) </li>
                <li>1 Designated Hitter (DH) </li>
              </ul>
            ) : (
              //Ask for the amount for each position
              <ul className="marker list-disc pl-5 space-y-3 ">
                <li>2 Bowlers (BOWL)</li>
                <li>1 Wicket Keeper (WK) </li>
                <li>2 Batsman (BAT) </li>
                <li>2 All rounders (AR)</li>
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
