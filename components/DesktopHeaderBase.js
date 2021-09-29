import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import DesktopHeader from './DesktopHeader.js';
import Button from './Button.js';
const DesktopHeaderBase = (props) => {
  const { children, color, buttoncolor, isClosed, setClosed } = props;


  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }
  };





  return (
    <div data-test="DesktopHeader" className={`bg-${color}   flex flex-row  h-12 w-full`}>
      <div className="w-full h-full flex flex-row justify-end ">




        <Button rounded="rounded-sm " textColor="white-light" color={buttoncolor} onClick={interactWallet} size="py-1 px-1 h-full" >

          <div className="flex flex-row text-sm h-12">
            <div className="text-xs text-light place-self-center"> Connect Wallet </div>
            <img className="ml-3 h-4 w-4 place-self-center" src="images/wallet.png" alt="Img" />
            {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
          </div>
        </Button>

      </div>
    </div>
  );
};

DesktopHeaderBase.propTypes = {
  color: PropTypes.string,
  buttoncolor: PropTypes.string,
  isClosed: PropTypes.bool,
  setClosed: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopHeaderBase.defaultProps = {
  color: 'indigo-navy',
  buttoncolor: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopHeaderBase;
