//import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { transactions, utils } from 'near-api-js';
import Container from '../../components/containers/Container';
import Main from '../../components/Main';
import React, { useEffect, useState } from 'react';
import banner from '../../public/images/promotionheader.png';
import 'regenerator-runtime/runtime';
import Head from 'next/head';
import Select from 'react-select';
import mint from '../../public/images/mintpage.png';
import ProgressBar from '@ramonak/react-progress-bar';
import Usdt from '../../public/images/SVG/usdt';
import Usdc from '../../public/images/SVG/usdc';
import Dai from '../../public/images/SVG/dai';

import usdtcoin from '../../public/images/usdt.svg';
import usdccoin from '../../public/images/usdc.svg';
import daicoin from '../../public/images/dai.svg';

import { initNear } from '../../utils/near';

import { MINTER, NEP141USDC, NEP141USDT, NEP141USN } from '../../data/constants/nearDevContracts';

const MINT_STORAGE_COST = 5870000000000000000000;
const STABLE_DECIMAL = 1000000;
const DEFAULT_MAX_FEES = "300000000000000";

export default function Home(props) {
  const options = [
    { value: 'national', label: 'National Football League' },
    { value: 'local', label: 'Local Football League' },
    { value: 'international', label: 'International Football League' },
  ];
  // Re-use this data to display the state
  const [minterConfig, setMinterConfig] = useState({
    minting_price: '',
    admin: '',
    usdc_account_id: '',
    usdt_account_id: '',
    private_sale_start: 0,
    public_sale_start: 0,
    nft_pack_contract: '',
    nft_pack_supply: 0,
  });
  // Storage deposit is used to check if balance available to mint NFT and pay the required storage fee
  const [storageDepositAccountBalance, setStorageDepositAccountBalance] = useState(0);
  const [selectedMintAmount, setSelectedMintAmount] = useState(0);
  const [minted, setMinted] = useState(0);
  const [useNEP141, setUseNEP141] =  useState(NEP141USDT)

  async function query_config_contract() {
    // Init minter contract
    const _minter = await initNear([MINTER]);
    // Query minter contract for config info
    const config = await _minter.contractList[0].get_config();
    // Save minter config into state
    setMinterConfig({ ...config });
  }

  async function query_minting_of() {
    try {
      // Init minter contract
      const _minter = await initNear([MINTER]);
      // Query minter contract for config info
      const _minted = await _minter.contractList[0].get_minting_of({account: _minter.currentUser.accountId});
      // Save minted into state
      setMinted(_minted)
    }catch (e) {
      // define default minted
      setMinted(0)
    }
  }

  async function query_storage_deposit_account_id() {
    // Init minter contract
    const _minter = await initNear([MINTER]);
    // Query minter contract for config info
    try {
      // Get storage deposit on minter contract
      const storageDeposit = await _minter.contractList[0].get_storage_balance_of({account: _minter.currentUser.accountId});
      // Set storage deposit of current minter account
      setStorageDepositAccountBalance(storageDeposit)
    }catch (e) {
      // No account storage deposit found
      setStorageDepositAccountBalance(0)
    }
  }

  async function execute_mint_token(){

    // Init minter contract
    const _minter = await initNear([MINTER, useNEP141]);

    // FT amount to deposit for minting NFT
    const mint_cost = selectedMintAmount * Number(minterConfig.minting_price)

    if (selectedMintAmount == 0) {
      return
    }
    const data = Buffer.from(JSON.stringify({receiver_id: _minter.contractList[0].contractId, amount: Math.floor(mint_cost).toString(), msg: JSON.stringify({ mint_amount: selectedMintAmount}) }))
    //const register = Buffer.from(JSON.stringify({account_id:  _minter.contractList[0].contractId}))
    const tx = await _minter.contractList[1].ft_transfer_call(data, DEFAULT_MAX_FEES, "1");
    //console.log(c)
    // let res = await _minter.currentUser.account.signAndSendTransaction({
    //   receiverId: _minter.contractList[1].contractId,
    //   actions: [transactions.functionCall("storage_deposit", register,"100000000000000", utils.format.parseNearAmount("0.008").toString()),
    //     transactions.functionCall("ft_transfer_call", data,"100000000000000", "1" )
    //     ]
    // })
    // console.log(res)
  }

  async function execute_storage_deposit() {
    // Init minter contract
    const _minter = await initNear([MINTER]);
    // Calculate amount to deposit for minting process
    const amount_to_deposit_near = BigInt(selectedMintAmount * MINT_STORAGE_COST).toString();
    const tx = await _minter.contractList[0].storage_deposit({}, DEFAULT_MAX_FEES, amount_to_deposit_near);
    console.log(tx)
  }

  function selectMint() {
    let optionMint = []
    for (let x = 1; x < 21; x++){
      optionMint.push( { value: x, label: `Get ${x} ${x > 1 ? 'packs': 'pack'}` })
    }
    return (<Select  onChange={event => setSelectedMintAmount(event.value)} options={optionMint} className="md:w-1/3 w-4/5 mr-9 mt-5" />)
  }

  useEffect(() => {
    query_config_contract();
    query_storage_deposit_account_id();
    query_minting_of();
  }, []);

  return (
    <>
      <Head>
        <title>Playible - Next Generation of Sports Collectibles</title>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon.png" />
      </Head>
      <Container activeName="MINT">
        <div className="flex flex-col w-screen md:w-full overflow-y-auto h-screen justify-center self-center md:pb-12 text-indigo-black">
          <Main color="indigo-white">
            <div className="flex flex-col md:flex-row md:ml-12">
              <div className="md:w-full ">
                <div className="flex-col flex justify-center align-center md:flex-row md:flex md:justify-between w-full ml-4 mt-8">
                  <div className="text-xl mt-5 font-bold font-monument ">
                    MINT PACKS
                    <hr className="w-10 border-4"></hr>
                  </div>

                  <Select options={options} className="md:w-1/3 w-4/5 mr-9 mt-5" />
                </div>
                <div className="flex md:flex-row flex-col mt-12">
                  <div className="md:w-1/2 w-full ">
                    <img src={mint}></img>
                  </div>
                  <div className="md:w-1/2 w-full md:mt-0 mt-5 ml-8  ">
                    <div className="text-xl font-bold font-monument ">
                      WHITELIST MINT
                      <hr className="w-10 border-4"></hr>
                    </div>
                    <div className="flex justify-between w-4/5 md:w-1/2 mt-5">
                      <div>
                        <div className="text-xs">PRICE</div>
                        <div className="font-black"> ${Math.floor(minterConfig.minting_price / STABLE_DECIMAL)}</div>
                      </div>
                      <div className="border">
                        <button onClick={() => setUseNEP141(NEP141USDT)} className=" p-3 hover:bg-indigo-black">
                          <Usdt></Usdt>
                        </button>
                        <button onClick={() => setUseNEP141(NEP141USDC)} className=" p-3 hover:bg-indigo-black">
                          <Usdc></Usdc>
                        </button>
                        <button onClick={() => setUseNEP141(NEP141USN)} className=" p-3 hover:bg-indigo-black">
                          <Dai></Dai>
                        </button>
                        {/*<button className=" p-3 hover:bg-indigo-black">*/}
                        {/*  <Dai></Dai>*/}
                        {/*</button>*/}
                      </div>
                    </div>
                    <div className="text-xs mt-8">MINT STARTS IN</div>
                    <div className="flex mt-3">
                      <div className="p-3 rounded-lg bg-indigo-black text-indigo-white">02</div>
                      <div className="p-3 ">:</div>
                      <div className="p-3 rounded-lg  bg-indigo-black text-indigo-white">29</div>
                      <div className="p-3 ">:</div>
                      <div className="p-3  rounded-lg bg-indigo-black text-indigo-white">01</div>
                    </div>
                    <div className="border border-indigo-lightgray rounded-2xl text-center p-4 w-40 flex flex-col justify-center  mt-8">
                      <div className="text-2xl font-black font-monument ">{minted}/{minterConfig.nft_pack_supply}</div>
                      <div className="text-xs">YOU HAVE MINTED</div>
                    </div>
                    <div className="mt-8 mb-0 p-0 w-4/5">
                      <ProgressBar completed={10} maxCompleted={100} bgColor={'#3B62F6'} />
                    </div>
                    <div className="text-xs ">
                      {' '}
                      {minterConfig.nft_pack_supply}/5,000 packs remaining
                    </div>
                    <div>
                      {selectMint()}
                    </div>
                    {/*TODO: start styling */}
                    {/*<div>*/}
                    {/*  <p>Receipt total price ${Math.floor((selectedMintAmount * parseInt(minterConfig.minting_price)) / STABLE_DECIMAL)}</p>*/}
                    {/*  <p>Gas price {utils.format.formatNearAmount(BigInt(selectedMintAmount * MINT_STORAGE_COST).toString()).toString()}N</p>*/}
                    {/*</div>*/}
                    {
                      parseInt(storageDepositAccountBalance) >= selectedMintAmount * MINT_STORAGE_COST ?
                        <button className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 " onClick={() => execute_mint_token()}>
                          Mint ${Math.floor((selectedMintAmount * parseInt(minterConfig.minting_price)) / STABLE_DECIMAL)} + fee {utils.format.formatNearAmount(BigInt(selectedMintAmount * MINT_STORAGE_COST).toString())}N
                        </button> : <button className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 " onClick={() => execute_storage_deposit()}>
                          Storage deposit required {utils.format.formatNearAmount(BigInt( (selectedMintAmount * MINT_STORAGE_COST) - parseInt(storageDepositAccountBalance)).toString())}N
                        </button>
                    }

                    {/*TODO: end */}
                    <div className="w-9/12 flex text-center justify-center items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 text-xs mt-8 ">
                      MINT NFL STARTER PACK SOON
                    </div>
                  </div>
                </div>
                <div className="ml-8 md:ml-2">
                  <div className="text-xl font-bold font-monument mt-12 ">
                    PUBLIC MINT
                    <hr className="w-10 border-4"></hr>
                  </div>
                  <div className="mt-10 mb-10">Open: 14:00 UTC 25/08/22</div>
                  <div className="text-xl font-bold font-monument ">
                    PACK DETAILS
                    <hr className="w-10 border-4"></hr>
                  </div>
                  <div className="mt-10">
                    This pack will contain 8 randomly generated <br></br>
                    NFL players.
                  </div>
                  <div className="mt-5 mb-12">
                    <div className="mb-5">1 for each of the positions below:</div>
                    <ul className="marker list-disc pl-5 space-y-3 ">
                      <li> 1 Quarter Back (QB)</li>
                      <li>2 Running Back (RB) </li>
                      <li> 2 Wide Receivers (WR) </li>
                      <li>1 Tight End (TE)</li>
                      <li>1 Flex (RB/WR/TE) </li>
                      <li>1 Super Flex (QB/RB/WR/TE) </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Main>
        </div>
      </Container>
    </>
  );
}
