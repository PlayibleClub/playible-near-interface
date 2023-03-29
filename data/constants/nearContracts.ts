export const MINTER_NFL = {
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
    changeMethods: ['storage_deposit', 'storage_withdraw_all', 'mint'],
  },
}; // Near Minter contract

export const MINTER_BASKETBALL = {
  mainnet: 'pack_minter.basketball.playible.near',
  testnet: 'pack_minter.basketball.playible.testnet',
  interface: {
    viewMethods: [
      'get_config',
      'get_account_whitelist',
      'get_storage_balance_of',
      'get_whitelist',
      'get_minting_of',
    ],
    changeMethods: ['storage_deposit', 'storage_withdraw_all', 'mint'],
  },
};
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

export const NEP141NEAR = {
  title: 'NEAR',
  mainnet: '',
  testnet: '',
  decimals: 1000000000000000000000000,
  interface: {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer_call', 'storage_deposit'],
  },
}; //Near NEP-141 equivalent CW-20 or ERC-20

export const PACK_NFL = {
  mainnet: 'pack.pack_minter.playible.near',
  testnet: 'pack.pack_minter.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_total_supply', 'nft_tokens', 'nft_supply_for_owner'],
    changeMethods: ['nft_transfer', 'nft_transfer_call', 'nft_resolve_transfer'],
  },
}; //Pack Contract
export const PACK_PROMO_NFL = {
  mainnet: 'pack.promotional.nfl.playible.near',
  testnet: 'pack.promotional.nfl.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_supply_for_owner'],
    changeMethods: [
      'nft_transfer',
      'nft_transfer_call',
      'nft_resolve_transfer',
      'claim_promo_pack',
    ],
  },
};
export const PACK_BASKETBALL = {
  mainnet: 'pack.pack_minter.basketball.playible.near',
  testnet: 'pack.pack_minter.basketball.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_total_supply', 'nft_tokens', 'nft_supply_for_owner'],
    changeMethods: ['nft_transfer', 'nft_transfer_call', 'nft_resolve_transfer'],
  },
};
export const PACK_PROMO_BASKETBALL = {
  mainnet: 'pack.promotional.basketball.playible.near',
  testnet: 'pack.promotional.basketball.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_supply_for_owner'],
    changeMethods: [
      'nft_transfer',
      'nft_transfer_call',
      'nft_resolve_transfer',
      'claim_promo_pack',
    ],
  },
};
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
export const ATHLETE_NFL = {
  mainnet: 'athlete.nfl.playible.near',
  testnet: 'athlete.nfl.playible.testnet',
  interface: {
    viewMethods: [
      'nft_tokens_for_owner',
      'nft_total_supply',
      'nft_tokens',
      'nft_supply_for_owner',
      'filter_tokens_for_owner',
      'filtered_nft_supply_for_owner',
    ],
    changeMethods: ['addMessage'],
  },
}; //Athlete Contract
export const ATHLETE_PROMO_NFL = {
  mainnet: 'athlete.promotional.nfl.playible.near',
  testnet: 'athlete.promotional.nfl.playible.testnet',
  interface: {
    viewMethods: [
      'nft_tokens_for_owner',
      'nft_total_supply',
      'nft_tokens',
      'nft_supply_for_owner',
      'filter_tokens_for_owner',
      'filtered_nft_supply_for_owner',
    ],
    changeMethods: ['addMessage'],
  },
};

export const ATHLETE_BASKETBALL = {
  mainnet: 'athlete.basketball.playible.near',
  testnet: 'athlete.basketball.playible.testnet',
  interface: {
    viewMethods: [
      'nft_tokens_for_owner',
      'nft_total_supply',
      'nft_tokens',
      'nft_supply_for_owner',
      'filter_tokens_for_owner',
      'filtered_nft_supply_for_owner',
    ],
    changeMethods: ['addMessage'],
  },
};
export const ATHLETE_PROMO_BASKETBALL = {
  mainnet: 'athlete.promotional.basketball.playible.near',
  testnet: 'athlete.promotional.basketball.playible.testnet',
  interface: {
    viewMethods: [
      'nft_tokens_for_owner',
      'nft_total_supply',
      'nft_tokens',
      'nft_supply_for_owner',
      'filter_tokens_for_owner',
      'filtered_nft_supply_for_owner',
    ],
    changeMethods: ['addMessage'],
  },
};
export const OPENPACK_NFL = {
  mainnet: 'open_pack.nfl.playible.near',
  testnet: 'open_pack.nfl.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['execute_add_athletes', 'execute_open_pack'],
  },
}; //OpenPack Contract
export const OPENPACK_PROMO_NFL = {
  mainnet: 'open_pack.promotional.nfl.playible.near',
  testnet: 'open_pack.promotional.nfl.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['execute_add_athletes', 'execute_open_pack'],
  },
};
export const OPENPACK_BASKETBALL = {
  mainnet: 'open_pack.basketball.playible.near',
  testnet: 'open_pack.basketball.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['execute_add_athletes', 'execute_open_pack'],
  },
};
export const OPENPACK_PROMO_BASKETBALL = {
  mainnet: 'open_pack.promotional.basketball.playible.near',
  testnet: 'open_pack.promotional.basketball.playible.testnet',
  interface: {
    viewMethods: ['getMessages'],
    changeMethods: ['execute_add_athletes', 'execute_open_pack'],
  },
};
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
export const GAME_NFL = {
  mainnet: 'game.nfl.playible.near',
  testnet: 'game.nfl.playible.testnet',
  interface: {
    viewMethods: ['get_games, get_game, get_total_games, get_player_team, get_player_lineup'],
    changeMethods: ['add_game'],
  },
}; //Game Contract
export const GAME_BASKETBALL = {
  mainnet: 'game.basketball.playible.near',
  testnet: 'game.basketball.playible.testnet',
  interface: {
    viewMethods: ['get_games, get_game, get_total_games, get_player_team, get_player_lineup'],
    changeMethods: ['add_game'],
  },
};

//baseball below

export const MINTER_BASEBALL = {
  mainnet: 'pack_minter.baseball.playible.near',
  testnet: 'pack_minter.baseball.playible.testnet',
  interface: {
    viewMethods: [
      'get_config',
      'get_account_whitelist',
      'get_storage_balance_of',
      'get_whitelist',
      'get_minting_of',
    ],
    changeMethods: ['storage_deposit', 'storage_withdraw_all', 'mint'],
  },
};

export const PACK_BASEBALL = {
  mainnet: 'pack.pack_minter.baseball.playible.near',
  testnet: 'pack.pack_minter.baseball.playible.testnet',
  interface: {
    viewMethods: ['nft_tokens_for_owner', 'nft_total_supply', 'nft_tokens', 'nft_supply_for_owner'],
    changeMethods: ['nft_transfer', 'nft_transfer_call', 'nft_resolve_transfer'],
  },
};