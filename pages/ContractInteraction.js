import { useCallback, useState } from 'react';
import { MsgExecuteContract, MsgInstantiateContract, StdFee} from '@terra-money/terra.js';
import {
  useWallet, WalletStatus,
  useConnectedWallet,
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxResult,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-money/wallet-provider';

import { terra } from '../utils/terra';

const ContractInteraction = () => {
  
  const [codeID, setCodeID] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [queryMsg, setQueryMsg] = useState('');
  const [executeMsg, setExecuteMsg] = useState('');
  const [offeredCoin, setOfferedCoin] = useState('');
  const [initMsg, setInitMsg] = useState('');
  const [migratable, setMigratable] = useState(false);

  const [txResults, setTxResults] = useState(null);
  const [txError, setTxError] = useState(null);
  
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    connect,
    disconnect,
  } = useWallet();

  const connectedWallet = useConnectedWallet();

  const interactWallet = () => {
    console.log("CONNECT");
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(availableConnectTypes[1]);
    } else if (status === WalletStatus.WALLET_CONNECTED){
      disconnect();
    }
    console.log("STATUS: ", status);
  };

  const queryContract = async () => {
    setTxResults(null);
    setTxError(null);

    try {
      const result = await terra.wasm.contractQuery(
        contractAddr,
        JSON.parse(queryMsg),
      );
      setTxResults(result);
    } catch (e) {
      setTxError(e);
      console.log("Fail to get latest result from consumer contract");
      console.log(e);
    }
    return null;
  };

  const executeContract = useCallback(() => {
    setTxResults(null);
    setTxError(null);

    connectedWallet.post({
      msgs: [
        new MsgExecuteContract(
          connectedWallet.walletAddress,  // Wallet Address
          contractAddr,                   // Contract Address
          JSON.parse(executeMsg),         // ExecuteMsg
          { uluna: parseFloat(offeredCoin) * 1_000_000 },
        ),  
      ],
      // gasPrices: new StdFee(10_000_000, { uluna: 2000000 }).gasPrices(),
      // gasAdjustment: 1.1,
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
  }, [offeredCoin, connectedWallet]);

  const initContract = useCallback(() => {

    if (!connectedWallet) {
      return;
    }

    setTxResults(null);
    setTxError(null);

    connectedWallet.post({
      msgs: [
        new MsgInstantiateContract(
          connectedWallet.walletAddress,  // Owner Address
          codeID,                         // Contract Code ID
          JSON.parse(initMsg),        // ExecuteMsg
          { uluna: parseFloat(offeredCoin) * 1000000 },
          migratable,                     
        ),
      ],
      // gasPrices: new StdFee(10_000_000, { uusd: 2000000 }).gasPrices(),
      // gasAdjustment: 1.1,
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
  }, [offeredCoin, connectedWallet]);

  return (
    <>
      <h1>Connect Sample</h1>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
              availableConnectTypes,
            },
            null,
            2,
          )}
        </pre>
      </section>
      <div className="flex flex-col p-4 max-w-md gap-1">
        {status === WalletStatus.WALLET_NOT_CONNECTED && (
          <button
            key={'connect-' + availableConnectTypes[1]}
            onClick={interactWallet}
          >
            Connect {availableConnectTypes[1]}
          </button>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <button onClick={interactWallet}>Disconnect</button>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="contractAddr">
            <span>Contract Address: </span>
            <input id="contractAddr" type="text" placeholder="Enter Contract Address here" value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="queryMsg">
            <span>Query Message: </span>
            <input id="queryMsg" type="text" placeholder="Enter Query Message here" value={queryMsg} onChange={(e) => setQueryMsg(e.target.value)} />
          </label>
        </div>

        <button onClick={queryContract}>Query Contract</button>

        <div className="flex flex-col gap-2">
          <label htmlFor="contractAddr">
            <span>Contract Address: </span>
            <input id="contractAddr" type="text" placeholder="Enter Contract Address here" value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="executeMsg">
            <span>Execute Message: </span>
            <input id="executeMsg" type="text" placeholder="Enter Execute Message here" value={executeMsg} onChange={(e) => setExecuteMsg(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="coins">
            <span>Coins: </span>
            <input id="coins" type="number" placeholder="Enter coins here" value={offeredCoin} onChange={(e) => setOfferedCoin(e.target.value)} />
          </label>
        </div>

        <button onClick={executeContract}>Submit Contract</button>

        <div className="flex flex-col gap-2">
          <label htmlFor="codeID">
            <span>Code ID: </span>
            <input id="codeID" type="text" placeholder="Enter Contract Code ID here" value={codeID} onChange={(e) => setCodeID(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="initMsg">
            <span>Init Message: </span>
            <input id="initMsg" type="text" placeholder="Enter Init Message here" value={initMsg} onChange={(e) => setInitMsg(e.target.value)} />
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

        <button onClick={initContract}>Instantiate Contract</button>
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
