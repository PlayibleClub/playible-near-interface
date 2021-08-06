import { useCallback, useState } from 'react';
import { MsgExecuteContract, MsgInstantiateContract } from '@terra-money/terra.js';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  useConnectedWallet,
  UserDenied,
  useWallet, WalletStatus
} from '@terra-money/wallet-provider';

const ContractInteraction = () => {
  
  const [codeID, setCodeID] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [contractMsg, setContractMsg] = useState('');
  const [migratable, setMigratable] = useState(false);

  const [offeredCoin, setOfferedCoin] = useState('');
  const [memo, setMemo] = useState('');

  const [txResults, setTxResults] = useState(null);
  const [txError, setTxError] = useState(null);
  
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const connectedWallet = useConnectedWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }

    console.log(status);
  };

  const executeMsg = useCallback(() => {
    setTxResults(null);
    setTxError(null);

    connectedWallet.post({
      msgs: [
        new MsgExecuteContract(
          connectedWallet.walletAddress,  // Wallet Address
          contractAddr,                   // Contract Address
          JSON.parse(contractMsg),        // ExecuteMsg
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

  const instatiateContract = useCallback(() => {
    setTxResults(null);
    setTxError(null);

    connectedWallet.post({
      msgs: [
        new MsgInstantiateContract(
          connectedWallet.walletAddress,  // Owner Address
          codeID,                         // Contract Code ID
          JSON.parse(contractMsg),        // ExecuteMsg
          { uusd: parseFloat(offeredCoin) * 1000000 },
          migratable,                     
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
        <button onClick={interactWallet}>Connect Wallet</button>

        <div className="flex flex-col gap-2">
          <label htmlFor="codeID">
            <span>Code ID: </span>
            <input id="codeID" type="text" placeholder="Enter Contract Code ID here" value={codeID} onChange={(e) => setCodeID(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="initMsg">
            <span>Init Message: </span>
            <input id="initMsg" type="text" placeholder="Enter Init Message here" value={contractMsg} onChange={(e) => setContractMsg(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="initCoins">
            <span>Init Coins: </span>
            <input id="initCoins" type="number" placeholder="Enter coins here" value={offeredCoin} onChange={(e) => setOfferedCoin(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="migratable">
            <span>Migratable: </span>
            <form>
              <input id="true" type="radio" value={true} name="migratable" onChange={(e) => setMigratable(e.target.value)} />
              <label for="true">TRUE</label><br></br>
              <input id="false" type="radio" value={false} name="migratable" onChange={(e) => setMigratable(e.target.value)} />
              <label for="false">FALSE</label><br></br>
            </form>      
          </label>
        </div>

        <button onClick={instatiateContract}>Instantiate Contract</button>

        <div className="flex flex-col gap-2">
          <label htmlFor="contractAddr">
            <span>Contract Address: </span>
            <input id="contractAddr" type="text" placeholder="Enter Contract Address here" value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contractMsg">
            <span>Execute Message: </span>
            <input id="contractMsg" type="text" placeholder="Enter Execute Message here" value={contractMsg} onChange={(e) => setContractMsg(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="coins">
            <span>Coins: </span>
            <input id="coins" type="number" placeholder="Enter coins here" value={offeredCoin} onChange={(e) => setOfferedCoin(e.target.value)} />
          </label>
        </div>

        <button onClick={executeMsg}>Submit Contract</button>
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
