import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../buttons/Button.js';
import BaseModal from '../modals/BaseModal.js';
import Header from '../headers/Header.js';

const HeaderBase = () => {
  
  const [walletAddress, setWalletAddress] = useState('Connect Wallet');
  const [displayModal, setModal] = useState(false);

  useEffect(() => {
    if (status === "") {
      setWalletAddress(
      );
    } else {
      setWalletAddress('Connect Wallet');
    }
  }, [status, ""]);

  const connectWallet = (connectionType) => {
    setModal(false);
    connect(availableConnectTypes[connectionType]);
  };

  const renderWalletModal = () => {
    if (status === "") {
      return (
        <>
          <div className="mt-2"></div>
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
      );
    } else {
      return (
        <>
        </>
      );
    }
  };

  return (
    <Header>
      {displayModal && (
        <BaseModal
          title={'Near Wallet'}
          visible={displayModal}
          onClose={() => {
            setModal(false);
          }}
        >
          {renderWalletModal()}
        </BaseModal>
      )}
      <div className="mr-16" />

      <div className="text-white-light mt-11">
        {' '}
        <img src="/images/playibleheader.png" alt="Img" />
      </div>

      <div className="mt-10">
        <Button
          rounded="rounded-sm"
          textColor="white-light"
          color="null"
          onClick={() => {
            setModal(true);
          }}
          size="py-1 px-1"
        >
          <img src="/images/icons/Wallet.svg" alt="Img" className="w-10 h-8"/>
        </Button>
      </div>
    </Header>
  );
};

HeaderBase.propTypes = {
  color: PropTypes.string,
  isClosed: PropTypes.bool,
  setClosed: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HeaderBase.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default HeaderBase;
