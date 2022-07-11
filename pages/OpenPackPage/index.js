import React from 'react';
import { useRouter } from 'next/router';
import Main from '../../components/Main';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import PackComponent from '../../components/PackComponent';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import { useDispatch } from 'react-redux';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  getPackPrice,
  purchasePack,
  getLastRound,
  getRoundData,
} from '../../redux/reducers/contract/pack';
import 'regenerator-runtime/runtime';

export default function OpenPackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const connectedWallet = useConnectedWallet();

  const executePurchasePack = async () => {
    dispatch(getPackPrice()).then((response) => {
      dispatch(purchasePack({ connectedWallet })).then(() => {
        dispatch(getLastRound()).then((response) => {
          dispatch(getRoundData({ lastRound: response.payload })).then(() => {
            router.push('/TokenDrawPage');
          });
        });
      });
    });
  };

  const [isClosed, setClosed] = React.useState(true);

  return (
    <div className={`font-montserrat h-screen relative ${isClosed ? '' : 'overflow-y-hidden'}`}>
      <Navbar />
      <HeaderBase />
      <div className="flex flex-col w-full h-screen">
        <Main color="indigo-white overflow-y-scroll">
          <div className="flex flex-col overflow-y-auto overflow-x-hidden">
            <PortfolioContainer title="CONGRATULATIONS!" textcolor="text-indigo-black">
              <div className="flex justify-center">
                <div className="flex overflow-x-scroll pt-16 pb-32 hide-scroll-bar snap snap-x snap-mandatory">
                  <div className="flex flex-nowrap pt-16">
                    <PackComponent type="PremiumRelease3" />
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={executePurchasePack}
                    className="bg-indigo-buttonblue w-full h-12 text-center rounded-md text-lg"
                  >
                    <div className="pt-2.5">OPEN PACK</div>
                  </button>
                </div>
              </div>
            </PortfolioContainer>
          </div>
        </Main>
      </div>
    </div>
  );
}
