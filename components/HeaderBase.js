import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Header from './Header.js';
import Button from './Button.js';

const HeaderBase = (props) => {
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
    <Header>
      <Button color="clear" saturation="0" textColor="white-light" textSaturation="500" onClick={() => setClosed(false)} size="py-1 px-1">
        <img src="images/Hamburger.png" alt="Img" />
      </Button>

      {/* <div className="flex justify-between"> */}
        {/* <div className="transform w-24 h-12 bg-indigo-navy rotate-45 rounded-md"/> */}

        <div className="text-white-light">
          {' '}
          <img src="images/fantasyinvestar.png" alt="Img" />
        </div>
      {/* </div> */}

      <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={interactWallet} size="py-1 px-1">
        <img src="images/wallet.png" alt="Img"/>
        {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
      </Button>

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
