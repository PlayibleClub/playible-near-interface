import { useCallback, useState } from 'react';
import {
  useWallet, WalletStatus, useConnectedWallet
} from '@terra-money/wallet-provider';

import { useDispatch, useSelector } from 'react-redux';
import { execute } from '../redux/reducers/contract/wallet';
import WalletHelper from '../helpers/wallet-helper';


const ContractInteraction = () => {
  
  const [codeID, setCodeID] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [queryMsg, setQueryMsg] = useState('');
  const [executeMsg, setExecuteMsg] = useState('');
  const [offeredCoin, setOfferedCoin] = useState('');
  const [initMsg, setInitMsg] = useState('');

  const [txResults, setTxResults] = useState(null);
  const [txError, setTxError] = useState(null);
  const { queryContract, executeContract } = WalletHelper();
  
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    connect,
    disconnect,
  } = useWallet();


  const interactWallet = () => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(availableConnectTypes[1]);
    } else if (status === WalletStatus.WALLET_CONNECTED){
      disconnect();
    }
  };

  const performQueryContract = async () => {
    const result = await queryContract(contractAddr, queryMsg);
    setTxResults(result);
  }

  const performExecuteContract = async () => {
    const result = await executeContract(contractAddr, executeMsg, offeredCoin);
    result.txError == null ? setTxResults(result.txResult) : setTxResults(result.txError);
    //dispatch(executeContract({contractAddr, executeMsg, connectedWallet}));
  }

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

        <button onClick={performQueryContract}>Query Contract</button>

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

        <button onClick={performExecuteContract}>Submit Contract</button>

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
