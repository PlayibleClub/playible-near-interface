import { useCallback, useState } from 'react';
import { MsgExecuteContract } from '@terra-money/terra.js';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
  useWallet,
  WalletStatus
} from '@terra-money/wallet-provider';
import { 
  Client, 
  Transaction, 
  Message, 
  Wallet 
} from '@bandprotocol/bandchain.js';

const ContractInteraction = () => {
  const [offeredCoin, setOfferedCoin] = useState('');
  const [memo, setMemo] = useState('');
  const [txResults, setTxResults] = useState(null);
  const [txError, setTxError] = useState(null);

  const send = useCallback(() => {
    setTxResults(null);
    setTxError(null);
    connectedWallet.post({
      msgs: [
        new MsgExecuteContract(
          connectedWallet.walletAddress,
          'terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal', // Change contract address here
          {
            deposit_stable: {},
          },
          { uusd: parseFloat(offeredCoin) * 1000000 },
        ),
      ],
      memo,
    }).then((result) => {
      setTxResults(result);
      setOfferedCoin('');
      setMemo('');
    }).catch((error) => {
      if (error instanceof UserDenied) {
        setTxError('User Denied');
      } else if (error instanceof CreateTxFailed) {
        setTxError(`Create Tx Failed: ${error.message}`);
      } else if (error instanceof TxFailed) {
        setTxError(`Tx Failed: ${error.message}`);
      } else if (error instanceof Timeout) {
        setTxError('Timeout');
      } else if (error instanceof TxUnspecifiedError) {
        setTxError(`Unspecified Error: ${error.message}`);
      } else {
        setTxError(
          `Unknown Error: ${
            error instanceof Error ? error.message : String(error)}`,
        );
      }
    });
  }, [offeredCoin, connectedWallet, memo]);

  return (
    <>
      <h1>
        Tx Sample
      </h1>
      <div className="flex flex-col p-4 max-w-md gap-1">
        <div className="flex flex-col gap-2">
          <label htmlFor="coins">
            <span>Coins: </span>
            <input id="coins" type="number" placeholder="Enter coins here" value={offeredCoin} onChange={(e) => setOfferedCoin(e.target.value)} />
          </label>

        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="memo">
            <span>Transaction Message: </span>
            <input id="memo" type="text" placeholder="Enter memo here" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </label>
        </div>
        <button onClick={send}>Submit Contract</button>
      </div>
      <div className="mt-2 p-4 max-w-md">
        <h1>
          Transaction results:
        </h1>
        <div className="overflow-auto border-1 border-gray-300 bg-gray-100 p-4 rounded">
          {txResults && (
            <>
              <code className="text-justify">{JSON.stringify(txResults, null, 2)}</code>
            </>
          )}
          {txError && (
            <>
              <p>{txError}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractInteraction;
