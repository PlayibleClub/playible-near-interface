import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus, useConnectedWallet } from '@terra-money/wallet-provider';
import DesktopHeader from './DesktopHeader.js';
import Button from '../buttons/Button.js';
import BaseModal from '../modals/BaseModal.js';
const DesktopHeaderBase = () => {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

	const connectedWallet = useConnectedWallet();
  const [walletAddress, setWalletAddress] = useState("Connect Wallet")
	const [displayModal, setModal] = useState(false);

  useEffect(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      setWalletAddress(`${connectedWallet?.walletAddress.substring(0,6)}... ${connectedWallet?.walletAddress.substring(connectedWallet?.walletAddress.length - 6,connectedWallet?.walletAddress.length)}`)
    } else {
      setWalletAddress("Connect Wallet");
    }
	}, [status])

  const connectWallet = (connectionType) => {
    setModal(false)
    connect(availableConnectTypes[connectionType]);
  };

  const renderWalletModal = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      return (
        <>
          <div className="mt-2">
          {`${connectedWallet.walletAddress}`}
          </div>
          <button
            type="button"
            className="bg-indigo-buttonblue w-full h-12 text-center text-indigo-white font-bold rounded-md text-md mt-4 self-center"
            onClick={() => { 
              disconnect(); 
              setModal(false);
            }}
          >
            Disconnect
          </button>
        </>  
      )
    } else {
      return (
        <>
          {availableConnectTypes.includes("EXTENSION") &&
            <button
              type="button"
              className="bg-indigo-buttonblue w-full h-12 text-center text-indigo-white font-bold rounded-md text-md mt-4 self-center"
              onClick={() => { connectWallet(availableConnectTypes.indexOf("EXTENSION"))} }
            >
              Terra Station (Web Extension)
            </button>
          }

          {availableConnectTypes.includes("WALLETCONNECT") &&
            <button
              type="button"
              className="bg-indigo-buttonblue w-full h-12 text-center text-indigo-white font-bold rounded-md text-md mt-4 self-center"
              onClick={() => { connectWallet(availableConnectTypes.indexOf("WALLETCONNECT")) }}
            >
              Terra Station (Mobile)
            </button>
          }
        </>
      )
    }
  }

  return (
    <DesktopHeader>
      {displayModal &&
        <BaseModal 
          title={"Terra Wallet"} 
          visible={displayModal}
          onClose={() => {
            setModal(false)
          }}
        >
        {renderWalletModal()}
        </BaseModal>
      }

      <Button rounded="rounded-sm " textColor="white-light" color="indigo-buttonblue" onClick={() => {setModal(true)}} size="py-1 px-1 h-full" >
        <div className="flex flex-row text-sm h-12">
          <div className="text-xs text-light place-self-center"> 
            {walletAddress} 
          </div>
          <img className="ml-3 h-4 w-4 place-self-center" src="images/wallet.png" alt="Img" />
          {/*status === WalletStatus.WALLET_CONNECTED ? '*' : '+'*/}
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
