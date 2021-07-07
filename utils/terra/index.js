import { LCDClient } from '@terra-money/terra.js';
// import { MsgExecuteContract } from '@terra-money/terra.js'
// let connectedWallet = {}
// // if (typeof document !== 'undefined') {
// //   connectedWallet = require('@terra-money/wallet-provider').useConnectedWallet();
// // }

const TerraEnv = () => {
  const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev',
    chainID: 'tequila-0004',
  });

  return { terra };
};

export default TerraEnv;
