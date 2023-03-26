import Container from 'components/containers/Container';
import { useState } from 'react';
import { SPORT_TYPES, getSportType, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import BigNumber from 'bignumber.js';

export default function Promotional(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [whitelistInfoNFL, setWhitelistInfoNFL] = useState(null);
  const [whitelistInfoNBA, setWhitelistInfoNBA] = useState(null);
  const [whitelistInfoMLB, setWhitelistInfoMLB] = useState(null);
  const [whitelistInfoCRICKET, setWhitelistInfoCRICKET] = useState(null);
  const [currentSport, setCurrentSport] = useState(null);
  const [detailsNFL, setDetailsNFL] = useState({
    receiverAccount: '',
  });
  const [detailsNBA, setDetailsNBA] = useState({
    receiverAccount: '',
  });
  const [detailsMLB, setDetailsMLB] = useState({
    receiverAccount: '',
  });
  const [detailsCRICKET, setDetailsCRICKET] = useState({
    receiverAccount: '',
  });
  async function execute_send_type_1_pack(selector) {
    const transferArgs = Buffer.from(
      JSON.stringify({
        msg: 'Promotional pack',
        receiver_id:
          currentSport === SPORT_NAME_LOOKUP.football
            ? whitelistInfoNFL?.toString()
            : whitelistInfoNBA?.toString(),
      })
    );

    const deposit = new BigNumber(MINT_STORAGE_COST).toFixed();

    const action_transfer_call = {
      type: 'FunctionCall',
      params: {
        methodName: 'send_type_1_pack',
        args: transferArgs,
        gas: DEFAULT_MAX_FEES,
        deposit: deposit,
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line;
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: getSportType(currentSport).packPromoContract,
          //@ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }

  const onChangeWhitelistNFL = (e) => {
    if (e.target.name === 'receiverAccount') {
      if (e.target.value !== '') {
        const whitelistArray = e.target.value.split('\n').filter((n) => n);
        setWhitelistInfoNFL(whitelistArray);
        setDetailsNFL({
          ...detailsNFL,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.value.length === 0) {
        setWhitelistInfoNFL(null);
        setDetailsNFL({
          ...detailsNFL,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const onChangeWhitelistNBA = (e) => {
    if (e.target.name === 'receiverAccount') {
      if (e.target.value !== '') {
        const whitelistArray = e.target.value.split('\n').filter((n) => n);
        setWhitelistInfoNBA(whitelistArray);
        setDetailsNBA({
          ...detailsNBA,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.value.length === 0) {
        setWhitelistInfoNBA(null);
        setDetailsNBA({
          ...detailsNBA,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const onChangeWhitelistMLB = (e) => {
    if (e.target.name === 'receiverAccount') {
      if (e.target.value !== '') {
        const whitelistArray = e.target.value.split('\n').filter((n) => n);
        setWhitelistInfoMLB(whitelistArray);
        setDetailsMLB({
          ...detailsMLB,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.value.length === 0) {
        setWhitelistInfoMLB(null);
        setDetailsMLB({
          ...detailsMLB,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const onChangeWhitelistCRICKET = (e) => {
    if (e.target.name === 'receiverAccount') {
      if (e.target.value !== '') {
        const whitelistArray = e.target.value.split('\n').filter((n) => n);
        setWhitelistInfoCRICKET(whitelistArray);
        setDetailsCRICKET({
          ...detailsCRICKET,
          [e.target.name]: e.target.value,
        });
      } else if (e.target.value.length === 0) {
        setWhitelistInfoCRICKET(null);
        setDetailsCRICKET({
          ...detailsCRICKET,
          [e.target.name]: e.target.value,
        });
      }
    }
  };
  
  const handleButtonClick = (e) => {
    e.preventDefault();
    execute_send_type_1_pack(selector);
  };

  return (
    <Container>
      <div className='grid grid-cols-2'>
      <div className="flex flex-col w-1/2 ml-24 mt-24">
        <label className="font-monument" htmlFor="duration">
          SEND TYPE 1 FOOTBALL PACK
        </label>
        <input
          className="border outline-none rounded-lg px-3 p-2"
          id="receiverAccount"
          name="receiverAccount"
          type="text"
          placeholder="Enter account to send type 1 pack to."
          onChange={(e) => {
            setCurrentSport('FOOTBALL'), onChangeWhitelistNFL(e);
          }}
          value={detailsNFL.receiverAccount}
        />
        <div className="  mt-6">
          <button
            className=" flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs"
            onClick={(e) => handleButtonClick(e)}
          >
            Send
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/2 ml-24 mt-24">
        <label className="font-monument" htmlFor="duration">
          SEND TYPE 1 BASKETBALL PACK
        </label>
        <input
          className="border outline-none rounded-lg px-3 p-2"
          id="receiverAccount"
          name="receiverAccount"
          type="text"
          placeholder="Enter account to send type 1 pack to."
          onChange={(e) => {
            setCurrentSport('BASKETBALL'), onChangeWhitelistNBA(e);
          }}
          value={detailsNBA.receiverAccount}
        />
        <div className="  mt-6">
          <button
            className=" flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs"
            onClick={(e) => handleButtonClick(e)}
          >
            Send
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/2 ml-24 mt-24">
        <label className="font-monument" htmlFor="duration">
          SEND TYPE 1 BASEBALL PACK
        </label>
        <input
          className="border outline-none rounded-lg px-3 p-2"
          id="receiverAccount"
          name="receiverAccount"
          type="text"
          placeholder="Enter account to send type 1 pack to."
          onChange={(e) => {
            setCurrentSport('BASEBALL'), onChangeWhitelistMLB(e);
          }}
          value={detailsMLB.receiverAccount}
        />
        <div className="  mt-6">
          <button
            className=" flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs"
            onClick={(e) => handleButtonClick(e)}
          >
            Send
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/2 ml-24 mt-24">
        <label className="font-monument" htmlFor="duration">
          SEND TYPE 1 CRICKET PACK
        </label>
        <input
          className="border outline-none rounded-lg px-3 p-2"
          id="receiverAccount"
          name="receiverAccount"
          type="text"
          placeholder="Enter account to send type 1 pack to."
          onChange={(e) => {
            setCurrentSport('BASEBALL'), onChangeWhitelistMLB(e);
          }}
          value={detailsMLB.receiverAccount}
        />
        <div className="  mt-6">
          <button
            className=" flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs"
            onClick={(e) => handleButtonClick(e)}
          >
            Send
          </button>
        </div>
      </div>
      </div>
    </Container>
  );
}
