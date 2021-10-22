import React, { useState, useEffect } from 'react';
import DesktopNavbar from '../components/DesktopNavbar';
import HeaderBack from '../components/HeaderBack';
import TitledContainer from '../components/TitledContainer';
import Main from '../components/Main';
import LoadingPageDark from '../components/loading/LoadingPageDark';
import TransactionModal from '../components/modals/TransactionModal';

import { useRouter } from 'next/router';
import Image from 'next/image';


import { estimateFee, retrieveTxInfo } from '../utils/terra/index';
import { fantasyData } from '../data';
import * as statusCode from '../data/constants/status';
import * as actionType from '../data/constants/actions';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useDispatch, useSelector } from 'react-redux';
import { getPackPrice, purchasePack } from '../redux/reducers/contract/pack';
import { MsgExecuteContract } from '@terra-money/terra.js';

const packList = [
	{
		name: 'PREMIUM PACK',
		key: 'prem2',
		release: '2',
		price: '20 UST',
		image: '/images/packimages/PremiumRelease2.png',

	},
{
		name: 'PREMIUM PACK',
		key: 'prem3',
		release: '3',
		price: '35 UST',
		image: '/images/packimages/PremiumRelease3.png',

	},
	{
		name: 'BASE PACK',
		key: 'base2',
		release: '2',
		price: '20 UST',
		image: '/images/packimages/BaseRelease1.png',
	},
]

export default function PackDetails() {

	const dispatch = useDispatch();
	const { query } = useRouter();
	const connectedWallet = useConnectedWallet();

	const [loading, setLoading] = useState(true);
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);
	const [displayModal, setModal] = useState(false);
	const [price, setPrice] = useState(0);
	const [txFee, setTxFee] = useState(0);
	const [modalHeader, setModalHeader] = useState("");
	const [modalData, setModalData] = useState([]);
	const [modalStatus, setModalStatus] = useState(statusCode.IDLE);

	const { packPrice, status, txInfo, action } = useSelector((state) => state.contract.pack);

	useEffect(() => {
		//screen setup
		const mediaWatcher = window.matchMedia("(max-width: 500px)")

		function updateIsNarrowScreen(e) {
			setIsNarrowScreen(e.matches);
		}
		mediaWatcher.addEventListener('change', updateIsNarrowScreen)

		//compute tx fee
		dispatch(getPackPrice())

		return function cleanup() {
		mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
		}
	}, [])

	useEffect(() => {
		if(packPrice != null) {
			setPrice(packPrice / 1_000_000);
			const executeContractMsg = [
				new MsgExecuteContract(
					connectedWallet.walletAddress,         // Wallet Address
					fantasyData.contract_addr,              // Contract Address
					JSON.parse(`{ "purchase_pack": {} }`), // ExecuteMsg
					{ uusd: packPrice }
				),  
			]

			estimateFee(connectedWallet.walletAddress, executeContractMsg).then((response) => {
				const amount = response.amount._coins.uusd.amount;
				setTxFee(amount.d / 10**amount.e)
			  setLoading(false);
			})
		}
			
	}, [packPrice])

	useEffect(async () => {
		if(action == actionType.EXECUTE && status == statusCode.PENDING){
			setModalHeader("Waiting for Approval...")
		  setModalStatus(status);
		}
		else if(action == actionType.EXECUTE && status == statusCode.SUCCESS){
			setModalHeader("Waiting for Receipt...")
      setModalData([
        {
          name: "Tx Hash",
          value: txInfo.txHash
        }
      ])
		  setModalStatus(status)
      const txResponse = await retrieveTxInfo(txInfo.txHash)
      //TODO: redux handler for purchase pack response data
      const amount = txResponse.tx.fee.amount._coins.uusd.amount;
      const txFeeResponse = amount.d / 10**amount.e
      console.log(txResponse)
			setModalHeader("Transaction Complete")
      setModalData([
        {
          name: "Tx Hash",
          value: txInfo.txHash
        },
        {
          name: "Tx Fee",
          value: txFeeResponse
        }
      ])
      setModalStatus(statusCode.CONFIRMED)
		}
		else if(action == actionType.EXECUTE && status == statusCode.ERROR){
			setModalHeader("Transaction Failed")
      //TODO: Proper error handling an display on redux
      setModalData([
        {
          name: "Error",
          value: "An Error has occured"
        }
      ])
		  setModalStatus(status)
		}
    else {
		  setModalStatus(statusCode.IDLE);
    }
	}, [status, action, txInfo])

	const executePurchasePack = () => {
		setModal(true)
		dispatch(purchasePack({connectedWallet}))
	}

	return (
    
		<>
      {loading ? (
          <LoadingPageDark/>
        ) : (
          <>
            {isNarrowScreen ? (
            <div className="font-montserrat h-screen relative bg-indigo-dark">
              <HeaderBack link="/Packs"/>
              <div className="flex">
                <div className="w-full">
                  <Main color="indigo-dark">
                    <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden text-indigo-white font-bold">
                        {packList.map(function(data,i){
                          if(query.id === data.key){
                            return (
                              <div className="flex flex-col" key={i}>
                                <Image
                                  src={data.image}
                                  width={300}
                                  height={300}
                                />

                                <div className="flex flex-col">
                                  <div className="ml-10">
                                    <div className="">
                                      {data.name}
                                    </div>
                                    <div className="font-thin text-sm mb-4">
                                      Release {data.release}
                                    </div>
                                    <div className="mt-1 text-lg">
                                      {price}
                                    </div>
                                    <div className="font-thin text-sm">
                                      PRICE
                                    </div>
                                  </div>
                                  
                                  <button className="bg-indigo-buttonblue w-80 h-12 text-center rounded-md text-md mt-4 mb-8 self-center">
                                    <div className="">
                                      BUY NOW
                                    </div>
                                  </button>
                                </div>

                              </div>
                            )
                          }
                        })}

                          <TitledContainer title="PACK DETAILS">
                            <div className="flex w-full">
                              <div className="font-thin justify-start ml-7">
                                Each pack contains 5 cards.
                              </div>
                            </div>
                          </TitledContainer>
                    </div>
                  </Main>
                </div>
              </div>
            </div>
          ) : (
            <div className="font-montserrat h-screen relative bg-indigo-dark">
                { displayModal &&
                    <TransactionModal 
                      title={modalHeader} 
                      visible={displayModal}
                      modalData={modalData}
                      modalStatus={modalStatus}
                      onClose={() => {
                        setModal(false)
                      }}
                    />

                    /*<div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
                        <div className="relative p-8 bg-indigo-white w-80 h-96 m-auto flex-col flex rounded-lg">
                            <button onClick={()=>{setModal(false)}}>
                                <div className="absolute top-0 right-0 p-4 font-black">
                                    X
                                </div>
                            </button>

                            <div className="font-bold flex flex-col">
                                {modalHeader}
                                <img src={underlineIcon} className="sm:object-none md:w-6" />
                            </div>

                            {packList.map(function(data,i){
                                if(query.id === data.key){
                                    return (
                                        <div className="flex flex-col" key={i}>
                                            <img src={data.image}/>

                                            <div className="flex flex-col text-center">
                                                <div className="font-bold">
                                                    {data.name}
                                                </div>
                                                <div className="font-thin text-sm mb-4">
                                                    Release {data.release}
                                                </div>

                                                <Link href="/TokenDrawPage">
                                                    <button className="bg-indigo-buttonblue w-60 h-10 text-center rounded-md text-md self-center text-indigo-white font-black">
                                                        <div className="">
                                                            OPEN PACK
                                                        </div>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        </div>*/
                }
                <div className="flex">
                  <DesktopNavbar/>
                  <div className="w-full">
                    <Main color="indigo-dark">
                      <div className="flex flex-col w-full h-full overflow-y-hidden overflow-x-hidden">
                        <div className="mt-20 ml-24">
                          <TitledContainer title={`
                            ${query.id.includes("prem") ? "PREMIUM PACK" : ""} 
                            ${query.id.includes("base") ? "BASE PACK" : ""}`}>

                            {packList.map(function(data, i){
                              if(query.id === data.key){
                                return (
                                  <div className="flex" key={i}>
                                    <Image
                                      src={data.image}
                                      width={350}
                                      height={300}
                                    />

                                    <div className="flex flex-col">
                                      <div className="mt-12">
                                        {data.name}
                                      </div>
                                      <div className="font-thin text-sm mb-4">
                                        Release {data.release}
                                      </div>
                                      <div className="font-thin mt-4 text-sm">
                                        PRICE
                                      </div>
                                      <div>
                                        {`${price} UST`}
                                      </div>
                                      <div className="font-thin mt-4 text-xs">
                                        Tx Fee
                                      </div>
                                      <div className="text-xs">
                                        {`${txFee} UST`}
                                      </div>

                                      <button className="bg-indigo-buttonblue w-72 h-10 text-center rounded-md text-md mt-12" onClick={() => {executePurchasePack()}}>
                                        BUY NOW
                                      </button>
                                    </div>
                                  </div>
                                )
                              }
                            })}
                          </TitledContainer>

                        <TitledContainer title="PACK DETAILS">
                          <div className="flex w-full">
                            <div className="font-thin justify-start ml-7">
                              Each pack contains 5 cards.
                            </div>
                          </div>
                        </TitledContainer>
                      </div>
                    </div>
                  </Main>
                </div>
              </div>
            </div>
          
          )}
        </>
        )
      }
		</>
	)
}