import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { GAME } from 'data/constants/nearContracts';

const provider = new providers.JsonRpcProvider({
  url: getRPCProvider(),
});

async function query_game_data(game_id) {
  const query = JSON.stringify({
    game_id: game_id,
  })

  return await provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: getContract(GAME),
    method_name: 'get_game',
    args_base64: Buffer.from(query).toString('base64'),
  });
}

export { query_game_data }