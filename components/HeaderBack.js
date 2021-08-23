import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Header from './Header.js';
import Button from './Button.js';
const HeaderBack = (props) => {
  const { children, color } = props;
  const { status, connect, disconnect, availableConnectTypes } = useWallet();







  return (
    <Header>

      <Button color="indigo-light" saturation="0" textColor="white-light" textSaturation="500" size="py-1 px-1">  Back</Button>









      <div></div>
      <div></div>

    </Header>
  );
};

HeaderBack.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HeaderBack.defaultProps = {
  color: 'indigo-navy',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default HeaderBack;
