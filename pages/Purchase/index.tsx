import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Main from '../../components/Main';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import PackComponent from '../../components/PackComponent';
import TitledContainer from '../../components/containers/TitledContainer';

import { useDispatch, useSelector } from 'react-redux';
import BaseModal from '../../components/modals/BaseModal';
import * as statusCode from '../../data/constants/status';
import * as actionType from '../../data/constants/actions';
import 'regenerator-runtime/runtime';

const Purchase = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // @ts-ignore:next-line
  const { txInfo, status, message, action } = useSelector();
  const connectedWallet = {}
  const [isClosed, setClosed] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (status === statusCode.SUCCESS && action === actionType.EXECUTE) {
      setDisplayModal(false);
      setModalMessage(message);
      router.push('/TokenDrawPage');
    } else if (status === statusCode.PENDING && action === actionType.EXECUTE) {
      setModalMessage('PENDING');
      setModalMessage(message);
      setDisplayModal(true);
    } else if (status === statusCode.ERROR && action === actionType.EXECUTE) {
      setModalMessage('ERROR');
      setModalMessage(message);
      setDisplayModal(true);
    }
  }, [connectedWallet, status, message, action]);

  const closeModal = () => {
    setDisplayModal(false);
  };

  return (
    <>
      <div className={`font-montserrat h-screen relative`}>
        <Navbar />
        <HeaderBase />
        <BaseModal
          title={'Purchase'}
          visible={displayModal}
          children={modalMessage}
          closeModal={closeModal}
        />
        <div className="flex flex-col w-full h-screen">
          <Main color="indigo-dark overflow-y-scroll">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
              <TitledContainer title="PURCHASE PACK">
                <div className="flex flex-col justify-center">
                  <div className="justify-center">
                    <PackComponent type="PremiumRelease3" />
                  </div>
                  <div className="">
                    <button
                      // onClick={}
                      className="bg-indigo-buttonblue w-full h-12 text-center rounded-md text-lg mt-8"
                    >
                      <div className="pt-2.5">BUY PACK</div>
                    </button>
                  </div>
                </div>
              </TitledContainer>
            </div>
          </Main>
        </div>
      </div>
    </>
  );
};
export default Purchase;
