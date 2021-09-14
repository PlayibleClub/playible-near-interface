import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import DesktopHeader from './DesktopHeader.js';
import Button from './Button.js';
const DesktopHeaderBase = (props) => {
  const { children, color, isClosed, setClosed } = props;


  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };





  return (
    <DesktopHeader>


      <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={interactWallet} size="py-1 px-1" >

        <div className="flex flex-row">
          Connect Wallet
          <img src="images/wallet.png" alt="Img" />
          {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
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
