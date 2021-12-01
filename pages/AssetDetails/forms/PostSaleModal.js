import React, { useState } from 'react'

import underlineIcon from '../../../public/images/blackunderline.png'

const PostSaleModal = (props) => {
  const {
    asset,
    onClose, //setPostingModal(false)
    onSubmit
  } = props
  const [state, setState] = useState({
    contractAddr: "",
    tokenID: "",
    price: 0,
    message: ""
  })
  
  const handleSubmit = () => {

    //execute approve 
    onSubmit()
  }

  return (
    <>
      <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
        <div className="relative p-8 bg-indigo-white w-11/12 md:w-96 h-10/12 md:h-96 m-auto flex-col flex rounded-lg">
          <button onClick = {() => { onClose()}}>
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
                value={state.price} 
                onChange={(e) => {
                  setState({
                    ...state, 
                    price: e.target.value
                  })
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