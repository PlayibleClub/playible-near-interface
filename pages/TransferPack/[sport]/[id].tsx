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
import Modal from 'components/modals/Modal';
import PortfolioContainer from 'components/containers/PortfolioContainer';

export default function PackDetails(props) {
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const { query } = props;
  const [whitelistInfo, setWhitelistInfo] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [details, setDetails] = useState({
    receiverAccount: '',
  });
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

  async function execute_transfer_pack(selector) {
    const contract = getSportType(myPack.sport);
    const transferArgs = Buffer.from(
      JSON.stringify({
        msg: 'Transfer' + ' ' + myPack.sport.toLowerCase() + ' ' + myPack.packName.toLowerCase(),
        receiver_id: whitelistInfo?.toString(),
        token_id: myPack.id,
      })
    );

    const action_transfer_call = {
      type: 'FunctionCall',
      params: {
        methodName: 'nft_transfer',
        args: transferArgs,
        gas: DEFAULT_MAX_FEES,
        deposit: 1,
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line;
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId:
            myPack.packName === 'SOULBOUND PACK' || myPack.packName === 'PROMO PACK'
              ? contract.packPromoContract
              : contract.packContract,
          //@ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }

  const handleButtonClick = (e) => {
    e.preventDefault();
    execute_transfer_pack(selector);
  };

  const onChangeWhitelist = (e) => {
    if (e.target.name === 'receiverAccount') {
      if (e.target.value !== '') {
        const whitelistArray = e.target.value.split('\n').filter((n) => n);
        setWhitelistInfo(whitelistArray);
        setDetails({
          ...details,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.value.length === 0) {
        setWhitelistInfo(null);
        setDetails({
          ...details,
          [e.target.name]: e.target.value,
        });
      }
    }
  };
  useEffect(() => {
    get_pack_token_by_id();
  }, []);

  return (
    <Container activeName="TRANSFER PACK">
      <div className="md:ml-6 mt-12">
        <BackFunction
          prev={
            query.origin
              ? `/${query.origin}`
              : `PackDetails/${myPack.sport.toLowerCase()}/${encodeURIComponent(id)}/`
          }
        ></BackFunction>
      </div>
      <div className="iphone5:mt-20 md:ml-6 md:mt-0">
        <PortfolioContainer textcolor="indigo-black" title="TRANSFER PACK" />
      </div>
      <div className="iphone5:ml-15 md:ml-0 md:self-center">
        <div className="flex flex-col md:ml-24 iphone5:ml-4 md:mt-10 iphone5:mt-5">
          <div>
            {packDetails.map((x) => {
              return <Image src={x.metadata.media} height="200" width="200" alt="pack-image" />;
            })}
          </div>
          <div className="md:text-lg iphone5:text-sm md:h-10 iphone5:h-10 iphone5:ml-5 md:ml-5 font-bold">
            #{myPack.id}
          </div>
        </div>
        <div className="flex flex-col center md:mt-14">
          <input
            className="border outline-none rounded-lg px-3 p-2 iphone5:w-64 md:w-96"
            id="receiverAccount"
            name="receiverAccount"
            type="text"
            placeholder="Enter account name to transfer pack to."
            onChange={(e) => {
              onChangeWhitelist(e);
            }}
            value={details.receiverAccount}
          />
          <div className="mt-6">
            <button
              className=" flex text-center justify-center items-center iphone5:w-64 md:w-96 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs"
              onClick={(e) => setConfirmModal(true)}
            >
              TRANSFER
            </button>
          </div>
        </div>
      </div>
      <Modal
        title={'Confirm Details'}
        visible={confirmModal}
        onClose={() => setConfirmModal(false)}
      >
        <button
          className="fixed top-4 right-4 "
          onClick={() => {
            setConfirmModal(false);
          }}
        >
          <img src="/images/x.png" />
        </button>
        <p className="font-bold">PACK SPORT:</p> {myPack.sport}
        <p className="font-bold">PACK ID:</p> {myPack.id}
        <p className="font-bold">TRANSFER TO ACCOUNT NAME:</p> {whitelistInfo}
        <button
          className=" flex text-center justify-center items-center iphone5:w-64 md:w-full bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 iphone5:mt-2 md:mt-5 text-xs"
          onClick={(e) => handleButtonClick(e)}
        >
          CONFIRM
        </button>
      </Modal>
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query) {
    if (query.transactionHashes) {
      return {
        redirect: {
          destination: query.origin || `/Packs`,
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
