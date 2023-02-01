import { utils, providers } from 'near-api-js';
import Container from '../../components/containers/Container';
import Main from '../../components/Main';
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import 'regenerator-runtime/runtime';
import Head from 'next/head';
import Select from 'react-select';
import ProgressBar from '@ramonak/react-progress-bar';
import Usdt from '../../public/images/SVG/usdt';
import Usdc from '../../public/images/SVG/usdc';
import USN from '../../public/images/SVG/usn';
import NEAR from '../../public/images/SVG/near';
import { useWalletSelector } from '../../contexts/WalletSelectorContext';
import BigNumber from 'bignumber.js';
import { getConfig, getContract, getRPCProvider, get_near_connection } from '../../utils/near';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/modals/Modal';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import {
  MINTER_NFL,
  NEP141USDC,
  NEP141USDT,
  NEP141USN,
  NEP141NEAR,
  PACK_PROMO_NFL,
} from '../../data/constants/nearContracts';

import { MINT_STORAGE_COST, DEFAULT_MAX_FEES } from 'data/constants/gasFees';
import { execute_claim_soulbound_pack, query_claim_status } from 'utils/near/helper';
import Link from 'next/link';
import { SPORT_TYPES, getSportType, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
import ModalPortfolioContainer from 'components/containers/ModalPortfolioContainer';
import {
  getIsPromoRedux,
  getSportTypeRedux,
  setSportTypeRedux,
  setIsPromoRedux,
} from 'redux/athlete/sportSlice';
import { persistor } from 'redux/athlete/store';
import { getUTCDateFromLocal } from 'utils/date/helper';
import moment from 'moment';
import Button from 'components/buttons/Button';
import { number } from 'prop-types';
const DECIMALS_NEAR = 1000000000000000000000000;
const RESERVED_AMOUNT = 200;
const NANO_TO_SECONDS_DENOMINATOR = 1000000;

// const discountDate = 0;
// const launchDate = 0;
export default function Home(props) {
  const { selector, modal, accounts, accountId } = useWalletSelector();

  //const { network } = selector.options;
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });
  const { contract } = selector.store.getState();
  const dispatch = useDispatch();
  const [positionList, setPositionList] = useState(SPORT_TYPES[0].positionList);
  const sportObj = SPORT_TYPES.map((x) => ({ name: x.sport, isActive: false }));
  const [sportFromRedux, setSportFromRedux] = useState(useSelector(getSportTypeRedux));
  const [isPromoFromRedux, setIsPromoFromRedux] = useState(useSelector(getIsPromoRedux));
  const [categoryList, setCategoryList] = useState([...sportObj]);
  const [currentSport, setCurrentSport] = useState(sportObj[0].name);
  const options = [
    { value: 'national', label: 'National Football League' },
    { value: 'local', label: 'Local Football League' },
    { value: 'international', label: 'International Football League' },
  ];
  // Re-use this data to display the state
  const [minterConfig, setMinterConfig] = useState({
    minting_price_in_near: '',
    minting_price_decimals_6: '',
    minting_price_decimals_18: '',
    admin: '',
    usdc_account_id: '',
    usdt_account_id: '',
    private_sale_start: 0,
    public_sale_start: 0,
    nft_pack_contract: '',
    nft_pack_supply_index: 0,
    nft_pack_max_sale_supply: 0,
    nft_pack_mint_counter: 0,
  });
  // Storage deposit is used to check if balance available to mint NFT and pay the required storage fee
  const [storageDepositAccountBalance, setStorageDepositAccountBalance] = useState(0);
  const [selectedMintAmount, setSelectedMintAmount] = useState(0);
  const [minted, setMinted] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [mintedNba, setMintedNba] = useState(0);
  const [useNEP141, setUseNEP141] = useState(NEP141USDT);
  const [intervalSale, setIntervalSale] = useState(0);
  const [balanceErrorMsg, setBalanceErrorMsg] = useState('');
  const [isClaimedFootball, setIsClaimedFootball] = useState(false);
  const [isClaimedBasketball, setIsClaimedBasketball] = useState(false);
  const router = useRouter();
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [discountDay, setDiscountDay] = useState(0);
  const [discountHour, setDiscountHour] = useState(0);
  const [discountMinute, setDiscountMinute] = useState(0);
  const [discountSecond, setDiscountSecond] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const nflRegImage = '/images/packimages/nflStarterPack.png';
  const nbaRegImage = '/images/packimages/nbaStarterPack.png';
  const nflSbImage = '/images/packimages/NFL-SB-Pack.png';
  const nbaSbImage = '/images/packimages/nbaStarterPackSoulbound.png';
  const [modalImage, setModalImage] = useState(nflSbImage);
  async function get_claim_status(accountId) {
    setIsClaimedFootball(
      await query_claim_status(accountId, getSportType('FOOTBALL').packPromoContract)
    );
    setIsClaimedBasketball(
      await query_claim_status(accountId, getSportType('BASKETBALL').packPromoContract)
    );
  }
  function query_config_contract() {
    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).mintContract,
        method_name: 'get_config',
        args_base64: '',
      })
      .then((data) => {
        // @ts-ignore:next-line
        const config = JSON.parse(Buffer.from(data.result).toString());
        // Save minter config into state
        setMinterConfig({ ...config });
      });
  }

  async function query_minting_of() {
    try {
      if (selector.isSignedIn()) {
        const query = JSON.stringify({ account: accountId });
        const minting_of = await provider.query({
          request_type: 'call_function',
          finality: 'optimistic',
          account_id: getSportType(currentSport).mintContract,
          method_name: 'get_minting_of',
          args_base64: Buffer.from(query).toString('base64'),
        });
        // @ts-ignore:next-line
        const _minted = JSON.parse(Buffer.from(minting_of.result).toString());
        setMinted(_minted);
        {
          currentSport === 'FOOTBALL' ? setMinted(_minted) : setMintedNba(_minted);
        }
      }
    } catch (e) {
      // define default minted
      {
        currentSport === 'FOOTBALL' ? setMinted(0) : setMintedNba(0);
      }
    }
  }

  async function query_storage_deposit_account_id() {
    try {
      if (selector.isSignedIn()) {
        // Get storage deposit on minter contract
        const query = JSON.stringify({ account: accountId });

        const storage_balance = await provider.query({
          request_type: 'call_function',
          finality: 'optimistic',
          account_id: getSportType(currentSport).mintContract,
          method_name: 'get_storage_balance_of',
          args_base64: Buffer.from(query).toString('base64'),
        });
        // @ts-ignore:next-line
        const storageDeposit = JSON.parse(Buffer.from(storage_balance.result).toString());
        setStorageDepositAccountBalance(storageDeposit);
      }
    } catch (e) {
      // No account storage deposit found
      setStorageDepositAccountBalance(0);
    }
  }

  async function get_near_account_balance(account_id) {
    // gets account balance

    const connection = await get_near_connection();

    const wallet = await (await connection.account(accountId)).getAccountBalance();
    setAccountBalance(Number(wallet.available) / DECIMALS_NEAR);
  }

  async function execute_near_storage_deposit_and_mint_token() {
    const amount_to_deposit_near = new BigNumber(selectedMintAmount)
      .multipliedBy(new BigNumber(minterConfig.minting_price_in_near))
      .toFixed();

    const data_one = Buffer.from(
      JSON.stringify({
        mint_amount: selectedMintAmount,
      })
    );
    const action_deposit_near_price = {
      type: 'FunctionCall',
      params: {
        methodName: 'mint',
        args: data_one,
        gas: DEFAULT_MAX_FEES,
        deposit: amount_to_deposit_near,
      },
    };

    let mint_cost =
      (Number(minterConfig.minting_price_in_near) * selectedMintAmount) / DECIMALS_NEAR;

    console.log(mint_cost);
    try {
      if (accountBalance < mint_cost) {
        setBalanceErrorMsg(
          'Error you need ' +
            selectedMintAmount * 30 +
            ' ' +
            useNEP141.title +
            ', You have ' +
            accountBalance.toFixed(2) +
            ' ' +
            useNEP141.title
        );
        return;
      }
      setBalanceErrorMsg('');
    } catch (e) {
      console.log(e);
      return;
    }

    if (selectedMintAmount == 0) {
      return;
    }

    dispatch(setSportTypeRedux(currentSport));
    const amount_deposit_storage = new BigNumber(selectedMintAmount)
      .multipliedBy(new BigNumber(MINT_STORAGE_COST))
      .toFixed();

    const data_two = Buffer.from(JSON.stringify({}));
    const action_deposit_storage_near_token = {
      type: 'FunctionCall',
      params: {
        methodName: 'storage_deposit',
        args: data_two,
        gas: DEFAULT_MAX_FEES,
        deposit: amount_deposit_storage,
      },
    };
    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: getSportType(currentSport).mintContract,
          // @ts-ignore:next-line
          actions: [action_deposit_storage_near_token],
        },
        {
          receiverId: getSportType(currentSport).mintContract,
          // @ts-ignore:next-line
          actions: [action_deposit_near_price],
        },
      ],
    });
  }

  async function execute_batch_transaction_storage_deposit_and_mint_token() {
    const amount_to_deposit_near = new BigNumber(selectedMintAmount)
      .multipliedBy(new BigNumber(MINT_STORAGE_COST))
      .toFixed();

    const data_one = Buffer.from(JSON.stringify({}));
    const action_deposit_storage_near_token = {
      type: 'FunctionCall',
      params: {
        methodName: 'storage_deposit',
        args: data_one,
        gas: DEFAULT_MAX_FEES,
        deposit: amount_to_deposit_near,
      },
    };

    // FT amount to deposit for minting NFT
    const mint_cost =
      selectedMintAmount *
      Number(
        useNEP141.decimals == 1000000
          ? minterConfig.minting_price_decimals_6
          : minterConfig.minting_price_in_near
      );

    try {
      const query = JSON.stringify({ account_id: accountId });
      const ft_balance_of = await provider.query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(useNEP141),
        method_name: 'ft_balance_of',
        args_base64: Buffer.from(query).toString('base64'),
      });
      // @ts-ignore:next-line

      const balance = JSON.parse(Buffer.from(ft_balance_of.result).toString());
      if (balance < mint_cost && currentSport === 'FOOTBALL') {
        setBalanceErrorMsg(
          'Error you need ' +
            selectedMintAmount * 200 +
            ' ' +
            useNEP141.title +
            ', You have ' +
            balance +
            ' ' +
            useNEP141.title
        );
        return;
      } else if (balance < mint_cost && currentSport === 'BASKETBALL') {
        setBalanceErrorMsg(
          'Error you need ' +
            selectedMintAmount * 50 +
            ' ' +
            useNEP141.title +
            ', You have ' +
            balance +
            ' ' +
            useNEP141.title
        );
        return;
      }
      setBalanceErrorMsg('');
    } catch (e) {
      console.log(e);
      return;
    }

    if (selectedMintAmount == 0) {
      return;
    }

    dispatch(setSportTypeRedux(currentSport));
    const data_two = Buffer.from(
      JSON.stringify({
        receiver_id: getSportType(currentSport).mintContract,
        amount: Math.floor(mint_cost).toString(),
        msg: JSON.stringify({ mint_amount: selectedMintAmount }),
      })
    );
    //const register = Buffer.from(JSON.stringify({account_id:  _minter.contractList[0].contractId}))

    const action_transfer_call = {
      type: 'FunctionCall',
      params: {
        methodName: 'ft_transfer_call',
        args: data_two,
        gas: DEFAULT_MAX_FEES,
        deposit: '1',
      },
    };

    const wallet = await selector.wallet();
    // @ts-ignore:next-line
    const tx = wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: getSportType(currentSport).mintContract,
          // @ts-ignore:next-line
          actions: [action_deposit_storage_near_token],
        },
        {
          receiverId: getContract(useNEP141),
          // @ts-ignore:next-line
          actions: [action_transfer_call],
        },
      ],
    });
  }

  async function execute_mint_token() {
    // Init minter contract
    //const _minter = await initNear([MINTER, useNEP141]);

    // FT amount to deposit for minting NFT
    const mint_cost =
      selectedMintAmount *
      Number(
        useNEP141.decimals == 1000000
          ? minterConfig.minting_price_decimals_6
          : minterConfig.minting_price_in_near
      );

    if (selectedMintAmount == 0) {
      return;
    }

    const data = Buffer.from(
      JSON.stringify({
        receiver_id: selector.store.getState().contract.contractId,
        amount: Math.floor(mint_cost).toString(),
        msg: JSON.stringify({ mint_amount: selectedMintAmount }),
      })
    );
    //const register = Buffer.from(JSON.stringify({account_id:  _minter.contractList[0].contractId}))

    const action_transfer_call = {
      functionCall: 'FunctionCall',
      params: {
        methodName: 'ft_transfer_call',
        args: data,
        gas: DEFAULT_MAX_FEES,
        deposit: '1',
      },
    };

    const wallet = await selector.wallet();
    const tx = wallet
      .signAndSendTransaction({
        signerId: accountId,
        receiverId: getContract(useNEP141),
        actions: [
          // @ts-ignore:next-line
          action_transfer_call,
        ],
      })
      .catch((e) => {
        console.log('error');
        console.log(e);
      });
  }

  const changeCategoryList = (name) => {
    const tabList = [...categoryList];
    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
    setCategoryList([...tabList]);
    setCurrentSport(name);
  };

  async function execute_storage_deposit() {
    // Calculate amount to deposit for minting process
    const amount_to_deposit_near = BigInt(selectedMintAmount * MINT_STORAGE_COST).toString();

    const _data = Buffer.from(JSON.stringify({}));
    const action_deposit_storage_near_token = {
      type: 'FunctionCall',
      params: {
        methodName: 'storage_deposit',
        args: _data,
        gas: DEFAULT_MAX_FEES,
        deposit: amount_to_deposit_near,
      },
    };

    const wallet = await selector.wallet();
    const tx = wallet
      .signAndSendTransaction({
        signerId: accountId,
        receiverId: getSportType(currentSport).mintContract,
        actions: [
          // @ts-ignore:next-line
          action_deposit_storage_near_token,
        ],
      })
      .catch((e) => {
        console.log('error');
        console.log(e);
      });
  }

  function selectMint() {
    let optionMint = [];
    for (let x = 1; x < 11; x++) {
      optionMint.push({ value: x, label: `${x} ${x > 1 ? 'packs' : 'pack'}` });
    }
    return (
      <Select
        onChange={(event) => setSelectedMintAmount(event.value)}
        options={optionMint}
        className="md:w-1/3 w-4/5 mr-9 mt-5"
      />
    );
  }

  function selectMintNba() {
    let optionMint = [];
    let limit = 11 - mintedNba;
    for (let x = 1; x < limit; x++) {
      optionMint.push({ value: x, label: `${x} ${x > 1 ? 'packs' : 'pack'}` });
    }
    return (
      <Select
        onChange={(event) => setSelectedMintAmount(event.value)}
        options={optionMint.splice(0, 5)}
        className="md:w-1/3 w-4/5 mr-9 mt-5"
      />
    );
  }

  function format_price() {
    let price = Math.floor(
      Number(
        useNEP141.decimals === 1000000
          ? minterConfig.minting_price_decimals_6
          : minterConfig.minting_price_in_near
      ) / useNEP141.decimals
    );
    return price;
  }
  const launchTimer = 1675296000000;
  // 1675296000000
  const launchDate = moment().unix() - launchTimer / 1000;
  // const launchDate = 1;
  const discountTimer = 1677715200000;
  const discountDate = moment().unix() - discountTimer / 1000;

  function counter() {
    const seconds = Math.floor((intervalSale / 1000) % 60);
    const minutes = Math.floor((intervalSale / 1000 / 60) % 60);
    const hours = Math.floor((intervalSale / (1000 * 60 * 60)) % 24);
    const days = Math.floor(intervalSale / (1000 * 60 * 60 * 24));

    let format_seconds = seconds < 0 ? 0 : seconds < 10 ? '0' + seconds : seconds;
    let format_minutes = minutes < 0 ? 0 : minutes < 10 ? '0' + minutes : minutes;
    let format_hours = hours < 0 ? 0 : hours < 10 ? '0' + hours : hours;
    let format_days = days < 0 ? 0 : days < 10 ? '0' + days : days;

    return {
      minute: format_minutes,
      seconds: format_seconds,
      hours: format_hours,
      days: format_days,
    };
  }

  const handleButtonClick = (e, sport) => {
    e.preventDefault();
    // new Promise(() => setTimeout(() => persistor.purge(), 200)).then(() => {
    //   dispatch(setSportTypeRedux(sport));
    // });
    dispatch(setSportTypeRedux(sport));
    dispatch(setIsPromoRedux(true));
    execute_claim_soulbound_pack(selector, getSportType(sport).packPromoContract);
  };

  async function get_soulbound_pack(selector) {}

  useEffect(() => {
    query_config_contract();
    query_storage_deposit_account_id();
    query_minting_of();
    if (currentSport === 'BASKETBALL') {
      setUseNEP141(NEP141NEAR);
    }
  }, [currentSport, useNEP141]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIntervalSale(
        Math.floor(minterConfig.public_sale_start / NANO_TO_SECONDS_DENOMINATOR) - Date.now()
      );
      if (intervalSale > 0) {
        counter();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [intervalSale]);

  useEffect(() => {
    get_claim_status(accountId);
    get_near_account_balance(accountId);
  }, [currentSport, accountBalance]);

  useEffect(() => {
    if (router.asPath.indexOf('transactionHashes') > -1 && isPromoFromRedux === false) {
      sportFromRedux === SPORT_NAME_LOOKUP.basketball
        ? setModalImage(nbaRegImage)
        : setModalImage(nflRegImage);
      setTimeout(() => persistor.purge(), 200);
      setEditModal(true);
    } else if (router.asPath.indexOf('transactionHashes') > -1) {
      {
        sportFromRedux === 'BASKETBALL' ? setModalImage(nbaSbImage) : setModalImage(nflSbImage);
      }
      setTimeout(() => persistor.purge(), 200);
      setEditModal(true);
    }
  }, []);

  function formatTime(time) {
    return time < 10 ? '0' + time : time;
  }
  const logIn = () => {
    modal.show();
  };

  useEffect(() => {
    setDay(0);
    setHour(0);
    setMinute(0);
    setSecond(0);
    const id = setInterval(() => {
      const currentDate = getUTCDateFromLocal();
      // const end = moment.utc(1674144000000);
      const end = moment.utc(launchTimer);
      setDay(formatTime(Math.floor(end.diff(currentDate, 'second') / 3600 / 24)));
      setHour(formatTime(Math.floor((end.diff(currentDate, 'second') / 3600) % 24)));
      setMinute(formatTime(Math.floor((end.diff(currentDate, 'second') / 60) % 60)));
      setSecond(formatTime(Math.floor(end.diff(currentDate, 'second') % 60)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setDay(0);
    setHour(0);
    setMinute(0);
    setSecond(0);
    const id = setInterval(() => {
      const currentDate = getUTCDateFromLocal();
      // const end = moment.utc(1674144000000);
      const end = moment.utc(discountTimer);
      setDiscountDay(formatTime(Math.floor(end.diff(currentDate, 'second') / 3600 / 24)));
      setDiscountHour(formatTime(Math.floor((end.diff(currentDate, 'second') / 3600) % 24)));
      setDiscountMinute(formatTime(Math.floor((end.diff(currentDate, 'second') / 60) % 60)));
      setDiscountSecond(formatTime(Math.floor(end.diff(currentDate, 'second') % 60)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Container activeName="MINT">
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center text-indigo-black">
          <Main color="indigo-white">
            <div className="flex-initial iphone5:mt-20 md:ml-6 md:mt-8">
              <div className="flex md:flex-row md:float-right iphone5:flex-col md:mt-0">
                <div className="md:mr-5 md:mt-4 iphone5:mt-10">
                  <form>
                    <select
                      onChange={(e) => {
                        setCurrentSport(e.target.value);
                        setUseNEP141(NEP141USDT);
                      }}
                      className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white ring-2 ring-offset-8 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                        focus:outline-none cursor-pointer text-xs iphone5:ml-8 iphone5:w-4/6 md:text-base md:ml-8 md:mt-0 md:w-72 md:p-2 md:block lg:block"
                    >
                      {categoryList.map((x) => {
                        return <option value={x.name}>{x.name}</option>;
                      })}
                    </select>
                  </form>
                </div>
              </div>
              <div className="ml-8">
                <ModalPortfolioContainer title="MINT PACKS" textcolor="text-indigo-black" />
              </div>
              {selector.isSignedIn() ? (
                <div className="ml-12 mt-4 md:flex md:flex-row md:ml-8">
                  {isClaimedFootball ? (
                    <button
                      className={`bg-indigo-gray bg-opacity-40 text-indigo-white w-12 text-center hidden justify-center items-center font-montserrat p-4 text-xs mt-8`}
                    >
                      CLAIM FOOTBALL PACK
                    </button>
                  ) : (
                    <button
                      className="w-60 flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs "
                      onClick={(e) => handleButtonClick(e, 'FOOTBALL')}
                    >
                      CLAIM FOOTBALL PACK
                    </button>
                  )}
                  {isClaimedBasketball ? (
                    <button
                      className={`bg-indigo-gray bg-opacity-40 text-indigo-white w-12 text-center hidden justify-center items-center font-montserrat p-4 text-xs mt-8`}
                    >
                      CLAIM BASKETBALL PACK
                    </button>
                  ) : (
                    <button
                      className="w-60 flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 text-xs "
                      onClick={(e) => handleButtonClick(e, 'BASKETBALL')}
                    >
                      CLAIM BASKETBALL PACK
                    </button>
                  )}
                </div>
              ) : (
                <div className="ml-12 mt-4 md:flex md:flex-row md:ml-8">
                  {isClaimedFootball ? (
                    <button
                      className={`bg-indigo-gray bg-opacity-40 text-indigo-white w-12 text-center hidden justify-center items-center font-montserrat p-4 text-xs mt-8`}
                    >
                      CLAIM FOOTBALL PACK
                    </button>
                  ) : (
                    <button
                      className="w-60 flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 md:mr-4 text-xs "
                      onClick={logIn}
                    >
                      CLAIM FOOTBALL PACK
                    </button>
                  )}
                  {isClaimedBasketball ? (
                    <button
                      className={`bg-indigo-gray bg-opacity-40 text-indigo-white w-12 text-center hidden justify-center items-center font-montserrat p-4 text-xs mt-8`}
                    >
                      CLAIM BASKETBALL PACK
                    </button>
                  ) : (
                    <button
                      className="w-60 flex text-center justify-center items-center iphone5:w-64 bg-indigo-buttonblue font-montserrat text-indigo-white p-3 mb-4 text-xs "
                      onClick={logIn}
                    >
                      CLAIM BASKETBALL PACK
                    </button>
                  )}
                </div>
              )}

              <div className="md:mr- md:mt-0 ml-6 mt-4">
                <form>
                  <select
                    onChange={(e) => {
                      setCurrentSport(e.target.value);
                    }}
                    className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white ring-2 ring-offset-8 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                        focus:outline-none cursor-pointer text-xs iphone5:ml-8 hidden iphone5:w-60 md:hidden lg:hidden md:text-base md:ml-8 md:mt-5 md:w-36"
                  >
                    {categoryList.map((x) => {
                      return <option value={x.name}>{x.name}</option>;
                    })}
                  </select>
                </form>
              </div>
              {/* <div className="flex font-bold max-w-full ml-5 md:ml-6 font-monument overflow-y-auto no-scrollbar">
                {categoryList.map(({ name, isActive }) => (
                  <div
                    className={`cursor-pointer mr-6 ${
                      isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                    }`}
                    onClick={() => {
                      changeCategoryList(name);
                    }}
                  >
                    {name}
                  </div>
                ))}
                
              </div>
              <hr className="opacity-10 iphone5:w-screen md:w-auto" /> */}
            </div>
            <div className="flex flex-col md:flex-row md:ml-12">
              <div className="md:w-full overflow-x-hidden">
                {/* <div className="flex-col flex w-full mt-8">
                  <div className="align-center justify-center border-2 p-8 iphone5:ml-2 iphone5:mr-2 md:mr-8 rounded-lg">
                    <div className="text-m">
                      Early Bird Offer: The first 500 minted will receive an additional free
                      promotional pack.
                    </div>
                  </div>
                </div> */}
                <div className="flex md:flex-row flex-col md:ml-2 mt-12">
                  {currentSport === 'FOOTBALL' ? (
                    <div className="md:w-1/2 w-full ">
                      <Image
                        src={'/images/mintpage.png'}
                        width={400}
                        height={400}
                        alt="pack-image"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/2 w-full ">
                      <Image
                        src={'/images/mintpagebasketball.png'}
                        width={400}
                        height={400}
                        alt="pack-image"
                      />
                    </div>
                  )}
                  <div className="md:w-1/2 w-full md:mt-0 mt-5 ml-8 ">
                    <div className="text-xl font-bold font-monument ml-0">
                      <ModalPortfolioContainer
                        title="STARTER PACK MINT"
                        textcolor="text-indigo-black"
                      />
                    </div>
                    {currentSport === 'BASKETBALL' ? '' : ''}

                    <div className="flex justify-between w-4/5 md:w-1/2 mt-5">
                      <div>
                        <div className="text-xs">PRICE</div>

                        {useNEP141 === NEP141NEAR ? (
                          <div className="font-black text-xl"> {format_price()}N</div>
                        ) : useNEP141 === NEP141USDT ? (
                          <div className="font-black"> {format_price()}USDT</div>
                        ) : (
                          <div className="font-black"> {format_price()}USDC</div>
                        )}
                      </div>

                      <div className="border">
                        {currentSport === 'BASKETBALL' ? (
                          ''
                        ) : (
                          <div>
                            <button
                              onClick={() => setUseNEP141(NEP141USDT)}
                              className={
                                'p-3 ' +
                                (useNEP141.title == NEP141USDT.title
                                  ? 'bg-indigo-black'
                                  : 'hover:bg-indigo-slate')
                              }
                            >
                              <Usdt
                                hardCodeMode={useNEP141.title == NEP141USDT.title ? '#fff' : '#000'}
                              ></Usdt>
                            </button>
                            <button
                              onClick={() => setUseNEP141(NEP141USDC)}
                              className={
                                'p-3 ' +
                                (useNEP141.title == NEP141USDC.title
                                  ? 'bg-indigo-black'
                                  : 'hover:bg-indigo-slate')
                              }
                            >
                              <Usdc
                                hardCodeMode={useNEP141.title == NEP141USDC.title ? '#fff' : '#000'}
                              ></Usdc>
                            </button>
                          </div>
                        )}

                        {currentSport === 'BASKETBALL' ? (
                          <button
                            onClick={() => setUseNEP141(NEP141NEAR)}
                            className={
                              'p-3 ' +
                              (useNEP141.title == NEP141NEAR.title
                                ? 'bg-indigo-black'
                                : 'hover:bg-indigo-slate')
                            }
                          >
                            <NEAR
                              hardCodeMode={useNEP141.title == NEP141NEAR.title ? '#fff' : '#000'}
                            ></NEAR>
                          </button>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    {useNEP141.title === 'NEAR' ? (
                      discountDate > 0 ? (
                        <div className="line-through hidden decoration-4 text-xs font-black static">
                          (45N)
                        </div>
                      ) : currentSport === 'FOOTBALL' ? (
                        ''
                      ) : (
                        <div className=" text-xs">
                          <div className="line-through decoration-8 text-lg font-black static">
                            (45N)
                          </div>

                          {launchDate > 0 ? (
                            <div className="text-xs">
                              Discounted Until: 12am UTC{' '}
                              {moment.utc(discountTimer).local().format('MMMM D')}
                              <div className="flex space-x-1 mt-2">
                                <div className="bg-indigo-darkgray text-indigo-white w-6 h-6 rounded justify-center flex pt-1">
                                  {discountDay || ''}
                                </div>
                                <div className="bg-indigo-darkgray text-indigo-white w-6 h-6 rounded justify-center flex pt-1">
                                  {discountHour || ''}
                                </div>
                                <div className="bg-indigo-darkgray text-indigo-white w-6 h-6 rounded justify-center flex pt-1">
                                  {discountMinute || ''}
                                </div>
                                <div className="bg-indigo-darkgray text-indigo-white w-6 h-6 rounded justify-center flex pt-1">
                                  {discountSecond || ''}
                                </div>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      )
                    ) : (
                      ''
                    )}

                    {(counter().days > 0 ||
                      counter().hours > 0 ||
                      counter().minute > 0 ||
                      counter().seconds > 0) && (
                      <>
                        <div className="text-xs mt-8">MINT STARTS IN</div>
                        <div className="flex mt-3">
                          <div className="p-3 rounded-lg bg-indigo-black text-indigo-white">
                            {counter().hours}
                          </div>
                          <div className="p-3 ">:</div>
                          <div className="p-3 rounded-lg  bg-indigo-black text-indigo-white">
                            {counter().minute}
                          </div>
                          <div className="p-3 ">:</div>
                          <div className="p-3  rounded-lg bg-indigo-black text-indigo-white">
                            {counter().seconds}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex gap-16">
                      <div className="border border-indigo-lightgray rounded-2xl text-center p-4 w-40 flex flex-col justify-center  mt-8">
                        <div className="text-2xl font-black font-monument ">
                          {currentSport === 'FOOTBALL' ? minted : mintedNba}
                        </div>
                        <div className="text-xs">YOU HAVE MINTED</div>
                      </div>
                    </div>
                    <div className="mt-8 mb-0 p-0 w-9/12">
                      {/* <ProgressBar
                        completed={parseInt(
                          (
                            ((minterConfig.nft_pack_max_sale_supply -
                              minterConfig.nft_pack_mint_counter -
                              262) *
                              100) /
                            (minterConfig.nft_pack_max_sale_supply + RESERVED_AMOUNT)
                          ).toFixed(2)
                        )}
                        maxCompleted={100}
                        bgColor={'#3B62F6'}
                      /> */}
                    </div>
                    <div className="text-xs ">
                      {/* {' '}
                      {minterConfig.nft_pack_max_sale_supply -
                        minterConfig.nft_pack_mint_counter -
                        262}
                      /{minterConfig.nft_pack_max_sale_supply + RESERVED_AMOUNT} packs remaining */}
                    </div>
                    <div>{currentSport === 'FOOTBALL' ? selectMint() : selectMintNba()}</div>
                    {currentSport === 'FOOTBALL' ? (
                      <div className="ml-3"></div>
                    ) : (
                      <div>
                        <div className="mt-4">Limit: 10 packs per wallet</div>
                      </div>
                    )}
                    {/*TODO: start styling */}
                    {/*<div>*/}
                    {/*  <p>Receipt total price ${Math.floor((selectedMintAmount * parseInt(minterConfig.minting_price)) / STABLE_DECIMAL)}</p>*/}
                    {/*  <p>Gas price {utils.format.formatNearAmount(BigInt(selectedMintAmount * MINT_STORAGE_COST).toString()).toString()}N</p>*/}
                    {/*</div>*/}
                    {Math.floor(minterConfig.public_sale_start / NANO_TO_SECONDS_DENOMINATOR) <=
                      Date.now() && selector.isSignedIn() ? (
                      {
                        /*parseInt(String(storageDepositAccountBalance)) >= selectedMintAmount * MINT_STORAGE_COST*/
                      } ? (
                        <>
                          {currentSport === 'FOOTBALL' ? (
                            <button
                              className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 "
                              onClick={() =>
                                execute_batch_transaction_storage_deposit_and_mint_token()
                              }
                            >
                              Mint {Math.floor(selectedMintAmount * format_price())}N + fee{' '}
                              {utils.format.formatNearAmount(
                                new BigNumber(selectedMintAmount)
                                  .multipliedBy(new BigNumber(MINT_STORAGE_COST))
                                  .toFixed()
                              )}
                              N
                            </button>
                          ) : launchDate > 0 ? (
                            <button
                              className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 "
                              onClick={() =>
                                useNEP141.title === 'NEAR'
                                  ? execute_near_storage_deposit_and_mint_token()
                                  : execute_batch_transaction_storage_deposit_and_mint_token()
                              }
                            >
                              Mint {Math.floor(selectedMintAmount * format_price())}N + fee{' '}
                              {utils.format.formatNearAmount(
                                new BigNumber(selectedMintAmount)
                                  .multipliedBy(new BigNumber(MINT_STORAGE_COST))
                                  .toFixed()
                              )}
                              N
                            </button>
                          ) : (
                            <button
                              className="w-9/12 hidden text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 "
                              onClick={() =>
                                useNEP141.title === 'NEAR'
                                  ? execute_near_storage_deposit_and_mint_token()
                                  : execute_batch_transaction_storage_deposit_and_mint_token()
                              }
                            >
                              Mint {Math.floor(selectedMintAmount * format_price())}N + fee{' '}
                              {utils.format.formatNearAmount(
                                new BigNumber(selectedMintAmount)
                                  .multipliedBy(new BigNumber(MINT_STORAGE_COST))
                                  .toFixed()
                              )}
                              N
                            </button>
                          )}
                          {currentSport === 'FOOTBALL' ? (
                            <div className="flex-col mt-10 hidden">
                              <div>
                                Launching: 12am UTC{' '}
                                {moment.utc(launchTimer).local().format('MMMM D')}
                              </div>
                              <div>
                                <div className="flex space-x-2 mt-2">
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {day || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {hour || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {minute || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {second || ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : launchDate > 0 ? (
                            <div className="flex-col mt-10 hidden">
                              <div>
                                Launching: 12am UTC{' '}
                                {moment.utc(launchTimer).local().format('MMMM D')}
                              </div>
                              <div>
                                <div className="flex space-x-2 mt-2">
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {day || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {hour || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {minute || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {second || ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col mt-10">
                              <div>
                                Launching: 12am UTC{' '}
                                {moment.utc(launchTimer).local().format('MMMM D')}
                              </div>
                              <div>
                                <div className="flex space-x-2 mt-2">
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {day || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {hour || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {minute || ''}
                                  </div>
                                  <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                    {second || ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // {minted > "10" }
                        <button
                          className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 "
                          onClick={() => execute_storage_deposit()}
                        >
                          Storage deposit required{' '}
                          {utils.format.formatNearAmount(
                            BigInt(
                              selectedMintAmount * MINT_STORAGE_COST - storageDepositAccountBalance
                            ).toString()
                          )}
                          N
                        </button>
                      )
                    ) : selector.isSignedIn() ? (
                      //Change "MINT BASKETBALL STARTER PACK SOON" based on new sport that will be added
                      <div className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 ">
                        MINT BASKETBALL STARTER PACK SOON
                      </div>
                    ) : (
                      <div className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 ">
                        WALLET CONNECTION REQUIRED
                      </div>
                    )}
                    <p className="text-xs text-indigo-red font-bold">{balanceErrorMsg}</p>
                    {/*TODO: end */}
                  </div>
                </div>
                <div className="iphone5:mt-5 md:mt-0 ml-8 md:ml-2">
                  <div className="text-xl font-bold font-monument ml-0 md:-mt-14 w-1/3">
                    <ModalPortfolioContainer title="PACK DETAILS" textcolor="text-indigo-black" />
                  </div>
                  {currentSport === 'FOOTBALL' ? (
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
                    {currentSport === 'FOOTBALL' ? (
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
              <Modal
                title={'CONGRATULATIONS'}
                visible={editModal}
                onClose={() => {
                  setEditModal(false);
                }}
              >
                Your pack has been minted successfully!
                <div className="flex flex-wrap flex-col mt-10 mb-5 bg-opacity-70 z-50 w-full">
                  <div className="ml-20 mb-12">
                    <img width={240} height={340} src={modalImage}></img>
                  </div>
                  <Link href={'/Packs'}>
                    <button
                      className="bg-indigo-buttonblue text-indigo-white w-full h-14 text-center tracking-widest text-md font-monument"
                      onClick={() => {
                        setEditModal(false);
                      }}
                    >
                      CONFIRM
                    </button>
                  </Link>
                </div>
              </Modal>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
}
