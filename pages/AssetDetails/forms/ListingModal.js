import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { createSalesOrder } from '../../../redux/reducers/external/playible/salesOrder';
import { approveMarketplace, clearData } from '../../../redux/reducers/contract/nft';
import * as statusCode from '../../../data/constants/status';
import { UserDenied } from '@terra-money/wallet-provider';

import underlineIcon from '../../../public/images/blackunderline.png';
import BaseModal from '../../../components/modals/BaseModal';
import LoadingModal from '../../../components/loading/LoadingModal';

const ListingModal = (props) => {
  const {
    asset,
    onClose, //setPostingModal(false)
    onSubmit,
  } = props;
  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState('LIST ITEM FOR SALE');
  const [status, setStatus] = useState(statusCode.IDLE);
  const [errorMessage, setErrorMessage] = useState('An error has occurred');
  const { signBytes } = useWallet();

  const { status: approvalStatus, message } = useSelector((state) => state.contract.nft);

  useEffect(() => {
    dispatch(clearData());
  }, []);

  const signMessage = async (message) => {
    try {
      return await signBytes(Buffer.from(JSON.stringify(message)));
    } catch (error) {
      if (error instanceof UserDenied) {
        throw 'User Denied';
      } else {
        throw `Unknown Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
  };

  useEffect(() => {
    //NFT approval is succesful
    if (approvalStatus === statusCode.SUCCESS) {
      const data = {
        collection: asset.collection,
        token_id: asset.tokenID,
        price: price,
        message: 'sample message',
      };
      const { result: signed_data, success } = signMessage(data);
      dispatch(clearData());
      dispatch(
        createSalesOrder({
          ...data,
          signed_message: signed_data,
        })
      )
        .then(() => {
          setStatus(statusCode.SUCCESS);
          onSubmit();
        })
        .catch(() => {
          setStatus(statusCode.ERROR);
        });
    } else if (approvalStatus === statusCode.ERROR) {
      setStatus(statusCode.ERROR);
      setTitle('Error');
      setErrorMessage(message);
    }
  }, [approvalStatus]);

  const handleSubmit = () => {
    setStatus(statusCode.PENDING);
    setTitle('Waiting for approval');
    dispatch(
      approveMarketplace({
        connectedWallet: connectedWallet,
        tokenID: asset.tokenID,
      })
    );
  };

  return (
    <BaseModal
      title={title}
      visible={true}
      onClose={() => {
        onClose();
      }}
    >
      {status === statusCode.IDLE && (
        <>
          <div className="flex flex-col mt-2">
            <div className="mt-4 text-xl font-bold">Price</div>
            <div className="mt-1">
              <input
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                className="text-base w-36 border text-white rounded-md px-2 py-1 mr-2"
                placeholder="Amount..."
              />
              UST
            </div>

            <div className="mt-4 text-xl font-bold">Sign message</div>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-indigo-buttonblue w-full h-12 text-center font-bold rounded-md text-sm mt-4 items-center justify-center flex"
            >
              <div className="text-center text-indigo-white">CONFIRM LISTING</div>
            </button>
          </div>
        </>
      )}
      {status === statusCode.PENDING && <LoadingModal />}

      {status === statusCode.ERROR && errorMessage}
    </BaseModal>
  );
};
export default ListingModal;
