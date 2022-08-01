import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DesktopHeader from './DesktopHeader.js';
import Button from '../buttons/Button.js';
import BaseModal from '../modals/BaseModal.js';
import * as contracts from '../../data/constants/nearContracts';
import { providers, utils } from "near-api-js";
import type { Account, Message } from '../../interfaces'
import type {
  AccountView,
  CodeResult,
} from "near-api-js/lib/providers/provider";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router.js';
import { getConnection } from '../../redux/reducers/external/playible/wallet/index.js';
import { useWalletSelector } from '../../contexts/WalletSelectorContext';

const DesktopHeaderBase: React.FC = (props) => {
  const { contractList = [] } = props;

  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { wallet } = useSelector((state) => state.external.playible);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  const logIn = () => {
    modal.show();
  };

  const logOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log('Failed to sign out');
      console.error(err);
    });
  };

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  return (
    <DesktopHeader>
      <Button
        rounded="rounded-sm "
        textColor="white-light"
        color="indigo-buttonblue"
        onClick={logIn}
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
