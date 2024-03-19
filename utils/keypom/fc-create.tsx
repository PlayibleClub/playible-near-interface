import {
  FUNDING_ACCOUNT_ID,
  FUNDER_INFO,
  NETWORK_ID,
  NUM_KEYS,
  DROP_METADATA,
  DROP_CONFIG,
  KEYPOM_CONTRACT,
  FC_DATA,
  DEPOSIT_PER_USE_NEAR,
} from './configurations';

// NOTE: This script MUST be run on testnet and WILL NOT WORK ON MAINNET
// This is because the chosen NFT contract for this tutorial lives on testnet.

// import * as path from 'path';
// import { homedir } from 'os';
// import { writeFile, mkdir, readFile } from 'fs/promises';
import { initKeypom, createDrop, getDrops } from 'keypom-js';

// Funder is account to sign txns, can be changed in ./configurations.js
export async function createFCDrop(accountId) {
  // USER'S RESPONSIBILITY TO CHANGE DEFAULT CONSTS IN CONFIGURATIONS.JS

  // Init keypom, this takes care of the new NEAR connection
  console.log('Initiating NEAR connection');
  await initKeypom({ network: NETWORK_ID, funder: FUNDER_INFO });

  // Create drop, this generates the keys based on the number of keys passed in and uses funder's keypom balance if funderBalance is true (otherwise will sign a txn with an attached deposit)
  const { keys } = await createDrop({
    numKeys: NUM_KEYS,
    depositPerUseNEAR: DEPOSIT_PER_USE_NEAR,
    metadata: DROP_METADATA,
    config: DROP_CONFIG,
    fcData: FC_DATA,
  });
  const pubKeys = keys.publicKeys;

  var dropInfo = {};
  // Creating list of pk's and linkdrops; copied from orignal simple-create.js
  for (var i = 0; i < keys.keyPairs.length; i++) {
    let linkdropUrl =
      NETWORK_ID == 'testnet'
        ? `http://localhost:3000/#${accountId}/${keys.secretKeys[i]}`
        : `https://mynearwallet.com/linkdrop/${KEYPOM_CONTRACT}/${keys.secretKeys[i]}`;
    dropInfo[pubKeys[i]] = linkdropUrl;
    console.log(`linkdrop url: ${linkdropUrl}`);
    console.log(linkdropUrl);
    // window.location.href = linkdropUrl; // redirect to the linkdrop
  }
  //Write file of all pk's and their respective linkdrops
  console.log('curPks: ', pubKeys);

  // await writeFile(path.resolve(__dirname, `linkdrops.json`), JSON.stringify(dropInfo));
}

module.exports = { createFCDrop };
