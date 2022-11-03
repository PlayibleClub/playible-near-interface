export const MINTER = {
  mainnet: 'pack_minter.playible.near',
  testnet: 'pack_minter.playible.testnet',
  interface: {
    viewMethods: [
      'get_config',
      'get_account_whitelist',
      'get_storage_balance_of',
      'get_whitelist',
      'get_minting_of',
    ],
    changeMethods: ['storage_deposit', 'storage_withdraw_all'],
  },
}; // Near Minter contract
export const NEP141USDC = {
  title: 'USDC',
  mainnet: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
  testnet: 'usdc.fakes.testnet',
  decimals: 1000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20

export const NEP141USDT = {
  title: 'USDT',
  mainnet: 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near',
  testnet: 'usdt.fakes.testnet',
  decimals: 1000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20
export const NEP141USN = {
  title: 'USN',
  mainnet: 'usn',
  testnet: 'usdn.testnet',
  decimals: 1000000000000000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20

export const PACK = {
  mainnet: 'pack.pack_minter.playible.near',
  testnet: 'pack.pack_minter.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_total_supply', 'nft_tokens', 'nft_supply_for_owner'],
    changeMethods: ['nft_transfer', 'nft_transfer_call', 'nft_resolve_transfer'],
  },
}; //Pack Contract

export const PLAYIBLE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
}; //Playible/Fantasy Contract

export const MARKETPLACE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
}; //Marketplace Contract
export const ATHLETE = {
  mainnet: 'athlete.nfl.playible.near',
  testnet: 'athlete.nfl.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_total_supply', 'nft_tokens', 'nft_supply_for_owner','filter_tokens_by_position','filter_supply_for_owner'],
    changeMethods: ['addMessage'],
  },
}; //Athlete Contract

export const OPENPACK = {
  mainnet: 'open_pack.nfl.playible.near',
  testnet: 'open_pack.nfl.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['execute_add_athletes, execute_open_pack'],
  },
}; //OpenPack Contract
export const ORACLE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
}; //Oracle Contract
export const CONTROLLER = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
}; // Controller Contract
export const GAME = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
}; //Game Contract
