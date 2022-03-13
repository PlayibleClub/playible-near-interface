import React, { useState, useEffect } from 'react';
import TitledContainer from '../../components/containers/TitledContainer';
import Main from '../../components/Main';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import TransactionModal from '../../components/modals/TransactionModal';
import { useRouter } from 'next/router';
import Image from 'next/image'
import {BrowserView, MobileView} from 'react-device-detect'
import { handleRequestResponse } from '../../utils/general/index';

import * as statusCode from '../../data/constants/status';
import * as actionType from '../../data/constants/actions';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import { useDispatch, useSelector } from 'react-redux';
import { getPackPrice, purchasePack, getPurchasePackResponse, estimatePurchaseFee } from '../../redux/reducers/contract/pack';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import BackFunction from '../../components/buttons/BackFunction';

import { packList } from './data'
import { executeContract } from '../../utils/terra';
import { OPENPACK, PACK } from '../../data/constants/contracts';

export default function PackDetails(props) {
  const { queryObj } = props;
	const dispatch = useDispatch();
	const router = useRouter();
	const connectedWallet = useConnectedWallet();
  const lcd = useLCDClient()

	const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("")
	const [isNarrowScreen, setIsNarrowScreen] = useState(false);
	const [displayModal, setModal] = useState(false);
	const [price, setPrice] = useState(0);
	const [txFee, setTxFee] = useState(0);
	const [modalHeader, setModalHeader] = useState("");
	const [modalData, setModalData] = useState([]);
	const [modalStatus, setModalStatus] = useState(statusCode.IDLE);
  const [data, setData] = useState(null)

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

  const fetchPacks = async (token_id) => {
    const formData = { 
      all_nft_info: {
        token_id
      }
    }
    const res = await lcd.wasm.contractQuery(PACK, formData)
    if (res.info) {
      setData(res)
    }
  }

  useEffect(() => {
    if (connectedWallet && queryObj.token_id) {
      fetchPacks(queryObj.token_id)
    }
  }, [connectedWallet])

  const openPack = async () => {
    if (connectedWallet && queryObj.token_id) {
        const res = await executeContract(connectedWallet, PACK, [{ 
            contractAddr: PACK,
            msg: {
                approve: {
                    spender: OPENPACK,
                    token_id: queryObj.token_id
                }
            }
        },
        {
            contractAddr: OPENPACK,
            msg: {
                open_pack: {
                    pack_id: queryObj.token_id
                }
            }
        }])
        if (res.txHash) {
            router.replace(`/TokenDrawPage/?txHash=${res.txHash}`)
        }
    }
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
          <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
            <Main color="indigo-white">
              <div className="md:ml-6">
                <div className="mt-8">
                    <BackFunction prev={queryObj.origin ? `/${queryObj.origin}` : '/Portfolio'} />
                </div>
                {
                  data && <>
                    <div className="mt-8 md:ml-7 flex flex-row md:flex-row">
                      <div className="mt-7 justify-center md:self-left md:mr-16">
                        <Image
                        src={data.info.extension.pack_type === 'booster' ? '/images/packimages/BoosterPack1.png' : '/images/packimages/StarterPack1.png'}
                        width={125}
                        height={160}
                        />
                      </div>
                      <div className="flex flex-col">
                        <PortfolioContainer textcolor="indigo-black" title={`${data.info.extension.sport} ${data.info.extension.pack_type.toUpperCase()} Pack`}/>
                          <div className="ml-12 md:ml-0 mt-4 md:mt-0">
                            <div className="ml-7 mt-7 font-bold text-base">{`${data.info.extension.sport} ${data.info.extension.pack_type.toUpperCase()} Pack`}</div>
                            <div className="ml-7 mb-6">Release {data.info.extension.release[1]}</div>
                          </div>
                          <button className="bg-indigo-buttonblue ml-7 text-indigo-white w-5/6 md:w-80 h-10 text-center font-bold text-sm mt-4" onClick={openPack}>
                              OPEN PACK
                          </button>
                      </div>
                    </div>
                    <div className="mt-8">
                        <PortfolioContainer  textcolor="indigo-black" title="PACK DETAILS"/>
                    </div>
                    <div className="ml-7 mt-5 font-normal">
                        Each pack contains X tokens.
                    </div>
                  </>
                }
              </div>
            </Main>
          </div>
      )}
		</Container>
	)
}

export async function getServerSideProps(ctx) {
  const { query } = ctx
  let queryObj = null 
  if (query) {
    queryObj = query
  }
  return {
    props: { queryObj }
  }
}