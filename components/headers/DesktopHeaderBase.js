import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus, useConnectedWallet } from '@terra-money/wallet-provider';
import DesktopHeader from './DesktopHeader.js';
import Button from '../buttons/Button.js';
import BaseModal from '../modals/BaseModal.js';
import { initNear, signIn, signOut } from '../../utils/near';
import * as contracts from '../../data/constants/nearContracts';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router.js';
import { getConnection } from '../../redux/reducers/external/playible/wallet/index.js';

const DesktopHeaderBase = (props) => {
  // const { status, connect, disconnect, availableConnectTypes } = useWallet();

  const { contractList = [] } = props;

  const connectedWallet = useConnectedWallet();
  const [walletAddress, setWalletAddress] = useState('Connect Wallet');
  const [displayModal, setModal] = useState(false);

  const { wallet } = useSelector((state) => state.external.playible);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const getNear = async () => {
    const near = await initNear(contractList);
    dispatch(getConnection({ connection: near }));
  };

  const logIn = () => {
    if (wallet.data) {
      signIn(wallet.data.walletConnection);
    }
  };

  const logOut = () => {
    if (wallet.data) {
      signOut(wallet.data.walletConnection);
      getNear();
    }
  };

  useEffect(async () => {
    if (dispatch && router) {
      getNear();

      const params = Object.keys(router.query);
      const toRemove = ['account_id', 'public_key', 'all_keys'];
      if (params.length > 0) {
        let ctr = 0;
        params.forEach((param) => {
          if (toRemove.indexOf(param) !== -1) {
            delete router.query[param];
            ctr++;
          }
        });
        if (ctr > 0) {
          router.replace({ pathname: router.pathname, query: router.query }, undefined);
        }
      }
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (wallet?.data) {
      setIsLoggedIn(wallet.data.walletConnection.isSignedIn());
    } else {
      setIsLoggedIn(false);
    }
  }, [wallet]);


  const connectWallet = (connectionType) => {
    setModal(false);
    connect(availableConnectTypes[connectionType]);
  };

  console.log('wallet', wallet)

  const renderWalletModal = () => {
    if (isLoggedIn) {
      return (
        <>
          {/* <div className="mt-2">{`${connectedWallet.walletAddress}`}</div> */}
          <button
            type="button"
            className="bg-indigo-buttonblue w-full h-12 text-center text-indigo-white font-bold rounded-md text-md mt-4 self-center"
            onClick={() => {
              logOut();
              setModal(false);
            }}
          >
            Disconnect
          </button>
        </>
      );
    } else {
      return (
        <>
          {/* <div className="mt-2">{`${connectedWallet.walletAddress}`}</div> */}
          <button
            type="button"
            className="bg-indigo-buttonblue w-full h-12 text-center text-indigo-white font-bold rounded-md text-md mt-4 self-center"
            onClick={() => {
              logIn();
              setModal(false);
            }}
          >
            Connect
          </button>
        </>
      );
    }
  };

  return (
    <DesktopHeader>
      {displayModal && (
        <BaseModal
          title={'NEAR Wallet'}
          visible={displayModal}
          onClose={() => {
            setModal(false);
          }}
        >
          {renderWalletModal()}
        </BaseModal>
      )}

      <Button
        rounded="rounded-sm "
        textColor="white-light"
        color="indigo-buttonblue"
        onClick={() => {
          setModal(true);
        }}
        size="py-1 px-1 h-full"
      >
        <div className="flex flex-row text-sm h-12 items-center">
          <div className="text-xs text-light">
            {wallet.data && wallet.data.currentUser ? wallet.data.currentUser.accountId : 'Sign In'}
          </div>
          <img className="ml-3 h-4 w-4" src="/images/wallet.png" alt="Img" />
        </div>
      </Button>
    </DesktopHeader>
  );
};

DesktopHeaderBase.propTypes = {
  color: PropTypes.string,
  isClosed: PropTypes.bool,
  setClosed: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopHeaderBase.defaultProps = {
  color: 'indigo-navy',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopHeaderBase;
