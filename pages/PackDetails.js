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
import { handleRequestResponse } from '../utils/general/index';

import { estimateFee, retrieveTxInfo } from '../utils/terra/index';
import { fantasyData } from '../data';
import * as statusCode from '../data/constants/status';
import * as actionType from '../data/constants/actions';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useDispatch, useSelector } from 'react-redux';
import { getPackPrice, purchasePack, getPurchasePackResponse, estimatePurchaseFee } from '../redux/reducers/contract/pack';
import PortfolioContainer from '../components/PortfolioContainer';
import BackFunction from '../components/BackFunction';

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

	const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("")
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);
	const [displayModal, setModal] = useState(false);
	const [price, setPrice] = useState(0);
	const [txFee, setTxFee] = useState(0);
	const [modalHeader, setModalHeader] = useState("");
	const [modalData, setModalData] = useState([]);
	const [modalStatus, setModalStatus] = useState(statusCode.IDLE);

	const { packPrice, txFee: txFeeEstimate, status, txInfo, action, message } = useSelector((state) => state.contract.pack);

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
      // router.push("/")
    }
		else if(packPrice != null) {
			setPrice(packPrice / 1_000_000);
      dispatch(estimatePurchaseFee({connectedWallet})).then(() => {
			  setLoading(false)
      })
		}
			
	}, [packPrice])

  
	useEffect(() => {
    setTxFee(txFeeEstimate)
	}, [txFeeEstimate])

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
		setModal(true)
			setModalHeader(message)
      setModalData([
        {
          name: "Tx Hash",
          value: "0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c"
        },
        {
          name: "Tx Fee",
          value: "0.143 UST"
        }
      ])
		  setModalStatus(status)
      setLoadingMessage("Retrieving Draw Results...")
    
    
    // dispatch(purchasePack({connectedWallet}))
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
            {packList.map(function(data, i){
                  if(router.query.id === data.key){
                    return(
                    <>
                      <div className="invisible">
                          <PortfolioContainer color="indigo-white" textcolor="indigo-black" title="PACKS"/>
                      </div>
                      <div className="visible">
                          <BackFunction prev="/Packs"/>
                      </div>
                      <div className="mt-8">
                          <PortfolioContainer  textcolor="indigo-black" title="Premium Pack"/>
                      </div>
                      <div className="mt-8 ml-7 flex flex-row" key={i}>
                          <div className="mr-16">
                          <Image
                          src={data.image}
                          // layout="fill"
                          height={325}
                          width={225}
                          />
                          </div>
                          <div className="mx-4 gird grid-col">
                              <div className="mt-5 font-bold text-base">{data.name}</div>
                              <div className="mb-10">Release {data.release}</div>
                              <div>Price</div>
                              <div className="font-bold text-base">{`${price} UST`}</div>
                              <button className="mt-10 bg-indigo-buttonblue hover:bg-indigo-bluegrad text-indigo-white font-bold py-2 px-24" onClick={() => {executePurchasePack()}}>
                                  BUY NOW - {`${price} UST`}
                              </button>
                          </div>
                      </div>
                      <div className="mt-8">
                          <PortfolioContainer  textcolor="indigo-black" title="Pack Details"/>
                      </div>
                      <div className="ml-7 mt-5 font-normal">
                          Each pack contains 5 tokens
                      </div>
                    </>
                    )
                  }
                }
              )
            }
          </BrowserView>
        </>
      )}
		</Container>
	)
}