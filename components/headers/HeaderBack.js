import * as React from 'react';
import PropTypes from 'prop-types';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Header from '../headers//Header.js';
import Button from '../buttons/Button.js';
import Link from 'next/link'
const HeaderBack = (props) => {
  const { link, color } = props;
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  return (
    <Header>
      <div className="w-full">
        <div className="mb-3 ml-3 float-left">
          <Link href={link}>
            <Button color="clear" saturation="0" textColor="white-light" textSaturation="500"> &lt; Back</Button>
          </Link>
        </div>
      </div>
    </Header>
  );
};

HeaderBack.propTypes = {
  link: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HeaderBack.defaultProps = {
  link: '/',
  children: <div />,
};

export default HeaderBack;
