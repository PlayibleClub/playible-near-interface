import React, { useState, useEffect } from 'react';
import HeaderBack from '../components/HeaderBack';
import TitledContainer from '../components/TitledContainer';
import Main from '../components/Main';
import LoadingPageDark from '../components/loading/LoadingPageDark';
import Button from '../components/Button';
import Container from '../components/Container';
import TransactionModal from '../components/modals/TransactionModal';
import { useRouter } from 'next/router';
import Image from 'next/image'
import underlineIcon from '../public/images/blackunderline.png'
import Link from 'next/link';
import {BrowserView, MobileView} from 'react-device-detect'
import { estimateFee, retrieveTxInfo } from '../utils/terra/index';
import { handleRequestResponse } from '../utils/general/index';
import { fantasyData } from '../data';
import * as statusCode from '../data/constants/status';
import * as actionType from '../data/constants/actions';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useDispatch, useSelector } from 'react-redux';
import { getPackPrice, purchasePack, getPurchasePackResponse } from '../redux/reducers/contract/pack';
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
	const router = useRouter();
	const connectedWallet = useConnectedWallet();

	const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("")
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);
	const [displayModal, setModal] = useState(false);
	const [price, setPrice] = useState(0);
	const [txFee, setTxFee] = useState(0);
	const [modalHeader, setModalHeader] = useState("");
	const [modalData, setModalData] = useState([]);
	const [modalStatus, setModalStatus] = useState(statusCode.IDLE);

	const { packPrice, status, txInfo, action, message } = useSelector((state) => state.contract.pack);

	useEffect(() => {
		//screen setup
		const mediaWatcher = window.matchMedia("(max-width: 500px)")

		function updateIsNarrowScreen(e) {
			setIsNarrowScreen(e.matches);
		}
		mediaWatcher.addEventListener('change', updateIsNarrowScreen)

		//compute tx fee
		dispatch(getPackPrice()).then((response) => {
      const onFail = () => {
        //TODO: Add modal on error
        setLoading(false)
        //router.push("/")
      }
      handleRequestResponse([response], () => {}, onFail)
    })

		return function cleanup() {
		mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
		}
	}, [])

	useEffect(() => {
    if(typeof(connectedWallet) == 'undefined' || connectedWallet == null){
      router.push("/")
    }
		else if(packPrice != null) {
			setPrice(packPrice / 1_000_000);
			const executeContractMsg = [
				new MsgExecuteContract(
					connectedWallet.walletAddress,         // Wallet Address
					fantasyData.contract_addr,             // Contract Address
					JSON.parse(`{ "purchase_pack": {} }`), // ExecuteMsg
					{ uusd: packPrice }
				),  
			]

			estimateFee(connectedWallet.walletAddress, executeContractMsg)
      .then((response) => {
				const amount = response.amount._coins.uusd.amount
				setTxFee(amount.d / 10**amount.e)
			  setLoading(false)
			})
      .catch((error) => {
				setTxFee(0)
			  setLoading(false)
      })
		}
			
	}, [packPrice])

  //TODO: Handle status mix ups when transactions are executed simultaneously.
	useEffect(async () => {
		if(action == actionType.EXECUTE && status == statusCode.PENDING){
      setModal(true)
			setModalHeader(message)
		  setModalStatus(status)
		}
		else if(action == actionType.EXECUTE && status == statusCode.SUCCESS){
      setModal(true)
			setModalHeader(message)
      const amount = txInfo.txResult.fee.amount._coins.uusd.amount;
      //const amount = txResponse.tx.fee.amount._coins.uusd.amount;
      const txFeeResponse = amount.d / 10**amount.e
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
		  setModalStatus(status)
      setLoading(true)
      setLoadingMessage("Retrieving Draw Results...")
      dispatch(getPurchasePackResponse()).then(() => {
        router.push("/TokenDrawPage")
      })
		}
		else if(action == actionType.EXECUTE && status == statusCode.ERROR){
      setModal(true)
			setModalHeader("Transaction Failed")
      //TODO: Proper error handling an display on redux
      setModalData([
        {
          name: "Error",
          value: message
        }
      ])
		  setModalStatus(status)
		}
    else if(status != statusCode.CONFIRMED){
		  setModalStatus(statusCode.IDLE);
    }
	}, [status, action, txInfo, message])

	const executePurchasePack = () => {
		dispatch(purchasePack({connectedWallet}))
	}

	return (
    
		<Container>
      {displayModal &&
        <TransactionModal 
          title={modalHeader} 
          visible={displayModal}
          modalData={modalData}
          modalStatus={modalStatus}
          onClose={() => {
            setModal(false)
          }}
        />
      }
      {loading ? (
            <LoadingPageDark message={loadingMessage}/>
        ) : (
          <>
            <MobileView>
              <div className="font-montserrat h-screen relative bg-indigo-dark">
                {/*<HeaderBack link="/Packs"/>*/}
                <div className="flex">
                  <div className="w-full">
                    <Main color="indigo-dark">
                      <div className="flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden text-indigo-white font-bold">
                          {packList.map(function(data,i){
                            if(router.query.id === data.key){
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
                                        {`${price} UST`}
                                      </div>
                                      <div className="font-thin text-sm">
                                        PRICE
                                      </div>
                                      <div className="text-xs">
                                        {`${txFee} UST`}
                                      </div>
                                      <div className="font-thin mt-4 text-xs">
                                        Tx Fee
                                      </div>
                                    </div>
                                    
                                    <button className="bg-indigo-buttonblue w-80 h-12 text-center rounded-md text-md mt-4 mb-8 self-center" onClick={() => {executePurchasePack()}}>
                                        BUY NOW
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
            </MobileView>
            <BrowserView>
              <TitledContainer title={`
                ${router.query.id.includes("prem") ? "PREMIUM PACK" : ""} 
                ${router.query.id.includes("base") ? "BASE PACK" : ""}`}>

                {packList.map(function(data, i){
                  if(router.query.id === data.key){
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
          </BrowserView>
        </>
      )}
		</Container>
	)
}