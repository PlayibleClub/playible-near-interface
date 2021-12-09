import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { createSalesOrder } from '../../../redux/reducers/external/playible/salesOrder';
import { approveMarketplace, clearData } from '../../../redux/reducers/contract/nft';
import * as statusCode from '../../../data/constants/status';

import underlineIcon from '../../../public/images/blackunderline.png'

const PostSaleModal = (props) => {
  const {
    asset,
    onClose, //setPostingModal(false)
    onSubmit
  } = props
  const dispatch = useDispatch()
  const connectedWallet = useConnectedWallet();
  const [price, setPrice] = useState(0)

  const { status } = useSelector((state) => state.contract.nft)

  useEffect(() => {
    dispatch(clearData())
  }, [])
 
  useEffect(() => {
    //NFT approval is succesful
    if(status == statusCode.SUCCESS){
      const data = {
        collection: asset.collection,
        token_id: asset.tokenID,
        price: price,
        message: "sample message",
        signed_message: "sample signed message"
      }
      dispatch(clearData())
      dispatch(createSalesOrder(data)).then(onSubmit)
    }
  }, [status])

  const handleSubmit = () => {
    dispatch(approveMarketplace({
      connectedWallet: connectedWallet,
      tokenID: asset.tokenID
    })).then(() => {
      onClose()
    })
  }

  return (
    <>
      <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
        <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-96 m-auto flex-col flex rounded-lg">
          <button onClick = {() => { onClose() }}>
            <div className="absolute top-0 right-0 p-4 font-black">
              X
            </div>
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="font-bold flex flex-col text-2xl">
              LIST ITEM FOR SALE
              <img src={underlineIcon} className="sm:object-none w-6" />
            </div>
          </div>

          <div className="flex flex-col mt-2">
            <div className="mt-4 text-xl font-bold">
              Price
            </div>
            <div className="mt-1">
              <input 
                value={price} 
                onChange={(e) => {
                  setPrice(e.target.value)
                }
              } 
                className="text-base w-36 border text-white rounded-md px-2 py-1 mr-2" 
                placeholder="Amount..." 
              />
              UST
            </div>

            <div className="mt-4 text-xl font-bold">
              Sign message
            </div>
            <div className="mt-1">
              {"Sign a message to continue."}
            </div>
            <button  onClick = {() => { handleSubmit()}} className="bg-indigo-buttonblue w-80 h-12 text-center font-bold rounded-md text-sm mt-4 items-center justify-center flex">
              <div className="text-center text-indigo-white">CONFIRM LISTING</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostSaleModal;