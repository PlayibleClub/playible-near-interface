import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectVerifyWallet } from '../redux/reducers/walletReducer';
import { Button } from '../components';

const testWallet = () => {
  const dispatch = useDispatch();
  const { accountNumber, coins } = useSelector((state) => state.wallet);
  const walletAddressRef = useRef();

  const connectWallet = () => {
    dispatch(connectVerifyWallet({ wallet: walletAddressRef.current.value }));
  };

  return (
    <div>
      <span>Test wallet page</span>
      <div className="mt-2">
        <span>Wallet ID: </span>
        <input
          ref={walletAddressRef}
          type="text"
          className="p-2
          transition duration-200
          focus:shadow-md focus:outline-none
          ring-offset-1 border border-gray-400
          rounded-md focus:ring-2
          focus:ring-purple-300"
        />
        <br />
        <Button onClick={connectWallet}>
          Connect Wallet
        </Button>
      </div>
      <span>Account Number: </span>
      <span>{accountNumber}</span>
      <div>
        {
          coins.map((coin) => (
            <p key={coin.denom}>{`${coin.denom}: ${coin.amount}`}</p>
          ))
        }
      </div>
      <div />
    </div>
  );
};

export default testWallet;
