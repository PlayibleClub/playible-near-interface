import React from 'react';
import { useRouter } from 'next/router'
import Main from '../components/Main';
import HeaderBase from '../components/HeaderBase';
import Navbar from '../components/Navbar';
import PackComponent from '../components/PackComponent';
import TitledContainer from '../components/TitledContainer';

import { useDispatch } from 'react-redux';
import { getLastRound, getRoundData, purchasePack } from '../redux/reducers/contract/pack';
import { executeContract } from '../utils/terra';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export default function OpenPackPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const connectedWallet = useConnectedWallet();

    const executePurchasePack = async () => {
        dispatch(purchasePack({connectedWallet})).then(() => {
            dispatch(getLastRound()).then((response) => {
                dispatch(getRoundData({lastRound: response.payload})).then(() => {
                    router.push("/TokenDrawPage");
                });
            });
        })
        
    }

    const [isClosed, setClosed] = React.useState(true)

    return (
        <div className={`font-montserrat h-screen relative ${isClosed ? "" : "overflow-y-hidden"}`}>
            {isClosed ? null : 
                <div className="flex flex-row w-full absolute z-50 top-0 left-0 ">
                    <Navbar> </Navbar>
                    <div className="w-2/6 h-screen" onMouseDown={() => setClosed(true)}/>
                </div>
            }
            <HeaderBase isClosed={isClosed} setClosed={setClosed}/>

            <Main color="indigo-dark overflow-y-scroll">
                <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                    <TitledContainer title="CONGRATULATIONS!">
                        <div className='flex flex-col justify-center'>
                            <div className="justify-center">
                                <PackComponent type="PremiumRelease3"/>
                            </div>    
                            <div className=''>
                            <button onClick={executePurchasePack} className="bg-indigo-buttonblue w-full h-12 text-center rounded-md text-lg">
                                <div className="pt-2.5">
                                    OPEN PACK
                                </div>
                            </button>
                            </div>
                        </div>        
                        
                    </TitledContainer>
                </div>
            </Main>
        </div>
    )
}