export const MINTER = {
  testnet: 'pack_minter.playible.near',
  mainnet: 'pack_minter.playible.near',
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
  title: "USDC",
  testnet: 'usdc.fakes.testnet',
  mainnet: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
  decimals: 1000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20

export const NEP141USDT = {
  title: "USDT",
  testnet: 'usdt.fakes.testnet',
  mainnet: 'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near',
  decimals: 1000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20
export const NEP141USN = {
  title: "USN",
  testnet: 'usdn.testnet',
  mainnet: 'usn',
  decimals: 1000000000000000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20

export const CW721 = {
  mainnet: 'guest-book.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const PLAYIBLE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const MARKETPLACE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const ATHLETE = {
  mainnet: 'guest-book.testnet',
  testnet: 'athlete.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    // '{"token_id": "athlete_1", "receiver_id": "'vincegnzls.testnet'", "token_metadata": { "extra": "[{\"trait_type\":\"athlete_id\",\"value\":\"1\"},{\"trait_type\":\"rarity\",\"value\":\"C\"},{\"trait_type\":\"usage\",\"value\":\"20\"},{\"trait_type\":\"name\",\"value\":JordanCameron},{\"trait_type\":\"team\",\"value\":\"Saints\"},{\"trait_type\":\"position\",\"value\":\"QB\"},{\"trait_type\":\"release\",\"value\":\"R1\"}]"}}' --accountId athlete.playible.testnet --deposit 0.1
    changeMethods: ['nft_mint '],
  },
};
export const PACK = {
  mainnet: 'guest-book.testnet',
  testnet: 'pack.playible.testnet',
  interface: {
    // '{"token_id":"pack_1"}' '{"account_id": "'vincegnzls.testnet'"}'
    viewMethods: ['nft_token', 'nft_tokens_for_owner', 'nft_metadata'],
    changeMethods: ['addMessage'],
  },
};
export const OPENPACK = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const ORACLE = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const CONTROLLER = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
export const GAME = {
  mainnet: 'guest-book.testnet',
  testnet: 'guest-book.mainnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['addMessage'],
  },
};
