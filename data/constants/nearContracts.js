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
