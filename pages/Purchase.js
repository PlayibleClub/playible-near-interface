import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PackComponent from '../components/PackComponent';
import TitledContainer from '../components/TitledContainer';

import { useDispatch, useSelector } from 'react-redux';
import { getLastRound, getRoundData, purchasePack } from '../redux/reducers/contract/pack';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import BaseDialog from '../components/dialogs/BaseDialog';
import * as statusCode from '../data/constants/status'
import * as actionType from '../data/constants/actions'

const Purchase = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const connectedWallet = useConnectedWallet();

    const { txInfo, status, message, action } = useSelector((state) => state.contract.pack);

    const [isClosed, setClosed] = useState(true)
    const [displayModal, setDisplayModal] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    useEffect(() => {
        if(status === statusCode.SUCCESS && action === actionType.EXECUTE){
            setDisplayModal(false)
            setModalMessage(message)
            router.push("/TokenDrawPage");
        }
        else if (status === statusCode.PENDING && action === actionType.EXECUTE) {
            setModalMessage("PENDING")
            setModalMessage(message)
            setDisplayModal(true)
        }
        else if (status === statusCode.ERROR && action === actionType.EXECUTE) {
            setModalMessage("ERROR")
            setModalMessage(message)
            setDisplayModal(true)
        }
    }, [connectedWallet, status, message, action])

    const closeModal = () => {
        setDisplayModal(false)
    }


    return (
        <>
            <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
                {isClosed ? null : 
                    <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                        <Navbar/>
                        <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}/>
                    </div>
                }
                <HeaderBase isClosed={isClosed} setClosed={setClosed}/>
                <BaseDialog 
                    title={"Purchase"}
                    visible={displayModal}
                    children={modalMessage}
                    closeModal={closeModal}
                />
                <Main color="indigo-dark overflow-y-scroll">
                    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                        <TitledContainer title="PURCHASE PACK">
                            <div className='flex flex-col justify-center'>
                                <div className="justify-center">
                                    <PackComponent type="PremiumRelease3"/>
                                </div>
                                <div className=''>
                                <button onClick={() => dispatch(purchasePack({connectedWallet}))} className="bg-indigo-buttonblue w-full h-12 text-center rounded-md text-lg">
                                    <div className="pt-2.5">
                                        BUY PACK
                                    </div>
                                </button>
                                </div>
                            </div>
                        </TitledContainer>
                    </div>
                </Main>
            </div>
        </>
    )
}
export default Purchase