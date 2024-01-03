import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../buttons/Button';
import { providers } from 'near-api-js';
import BaseModal from '../modals/BaseModal';
import { Account, Message } from '../../interfaces';

import Header from '../headers/Header';
import { useWalletSelector } from '../../contexts/WalletSelectorContext';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { getRPCProvider } from 'utils/near';
import useViewport from 'utils/address/helper';
import Modal from 'components/modals/Modal';

const HeaderBase = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const { entryCut } = useViewport();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectNetwork, setSelectNetwork] = useState(false);

  const getAccount = useCallback(async () => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: getRPCProvider() });

    return provider
      .query<AccountView>({
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  const logOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log('Failed to sign out');
      console.error(err);
    });
  };

  const logIn = () => {
    modal.show();
  };

  const handleOptionChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    const env = process.env.NEAR_ENV;
    let url;
    switch (env) {
      case 'production':
        url = 'mainnet';
        break;
      case 'development':
        url = 'testnet';
        break;
    }

    if (selectedValue === 'Near Protocol') {
      window.location.href =
        url === 'mainnet' ? 'https://app.playible.io/' : 'https://dev.app.playible.io/';
    } else if (selectedValue === 'Polygon Matic') {
      window.location.href =
        url === 'mainnet' ? 'https://polygon.playible.io/' : 'https://dev.polygon.playible.io/';
    }
  };

  const handleClick = () => {
    setSelectNetwork(true);
  };
  const renderWallet = () => {
    {
      if (accountId) {
        return (
          <Button
            textColor="white-light font-bold"
            color="indigo-buttonblue"
            rounded="rounded-md"
            size="h-full py-1 px-1"
            onClick={logOut}
          >
            {entryCut(accountId)}
          </Button>
        );
      } else {
        return (
          <Button
            rounded="rounded-sm"
            textColor="white-light"
            color="indigo-buttonblue"
            onClick={logIn}
            size="py-1 px-1 h-full"
          >
            <div className="flex flex-row text-sm h-12 items-center">
              <img className="ml-3 h-4 w-4" src="/images/wallet.png" alt="Img" />
            </div>
          </Button>
        );
      }
    }
  };
  const renderNetwork = () => {
    return (
      <div className="mt-6">
        <button
          className="bg-indigo-buttonblue hover:bg-indigo-light text-white font-bold py-1 px-2 rounded mr-2 mt-2 flex items-center"
          onClick={handleClick}
        >
          <img src="/images/near.png" width="25" height="25" className="mr-1" />

          <div className="text-white-light mr-2  text-sm">Near</div>
          <img src="/images/arrowNE.png" width="16" height="16" className="mt-0.5" />
        </button>
        <Modal title={'Select Network'} visible={selectNetwork}>
          <div className="flex items-center justify-center ml-6">
            <div className="fixed top-4 right-4 transform scale-100">
              <button onClick={() => setSelectNetwork(false)}>
                <img src="/images/x.png" />
              </button>
            </div>
            <div className="flex flex-col items-start justify-center mr-8">
              <a
                href="#"
                onClick={() => handleOptionChange('Near Protocol')}
                className="hover:bg-indigo-slate p-2 rounded-md text-center mb-2 border-2 border-indigo-navbargrad2"
              >
                <div className="flex items-center">
                  <button>
                    <img src="/images/near.png" width="45" height="40" className="ml-1 mr-2.5" />
                  </button>
                  <div className="mr-8 text-sm">Near Protocol</div>
                </div>
              </a>

              <a
                href="#"
                onClick={() => handleOptionChange('Polygon Matic')}
                className="hover:bg-indigo-slate p-2 rounded-md text-center mb-2 border-2"
              >
                <div className="flex items-center">
                  <button>
                    <img src="/images/polygon.png" width="40" height="40" className="ml-2 mr-2" />
                  </button>
                  <div className="mr-8 text-sm">Polygon Matic</div>
                </div>
              </a>
            </div>
          </div>
        </Modal>
      </div>
    );
  };
  return (
    <Header>
      {renderNetwork()}
      {renderWallet()}
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
