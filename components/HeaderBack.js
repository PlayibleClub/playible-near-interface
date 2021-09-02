import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Header from './Header.js';
import Button from './Button.js';
import Link from 'next/link'
const HeaderBack = (props) => {
  const { link, color } = props;
  const { status, connect, disconnect, availableConnectTypes } = useWallet();







  return (
    <Header>
      <Link href={link}>
        <Button color="clear" saturation="0" textColor="white-light" textSaturation="500" size="py-1 px-1"> &lt;  Back</Button>
      </Link>







      <div></div>
      <div></div>
      <div></div>

    </Header>
  );
};

HeaderBack.propTypes = {
  link: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HeaderBack.defaultProps = {
  link: '/',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default HeaderBack;
