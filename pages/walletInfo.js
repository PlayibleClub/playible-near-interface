import { useDispatch, useSelector } from 'react-redux';
import ConnectWallet from '../container/ConnectWallet';
import { connectVerifyWallet } from '../redux/reducers/walletReducer';

const walletInfo = () => {
  const dispatch = useDispatch();
  const { accountNumber, coins } = useSelector((state) => state.wallet);

  const connectWallet = (data) => {
    dispatch(connectVerifyWallet({ wallet: data.walletAddress }));
  };

  return (
    <>
      <div className="flex flex-col p-3 gap-2">
        <ConnectWallet onDispatch={connectWallet} />
        <h3>Account Number: </h3>
        <p>{accountNumber}</p>
        <h3>Coins:</h3>
        {
          coins.map((coin) => (
            <p key={coin.denom}>{`${coin.denom}: ${coin.amount}`}</p>
          ))
        }
      </div>
    </>
  );
};

export default walletInfo;
