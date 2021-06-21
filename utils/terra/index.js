import { LCDClient } from '@terra-money/terra.js';

const TerraEnv = () => {
  const terra = new LCDClient({
    URL: 'https://tequila-lcd.terra.dev',
    chainID: 'tequila-0004',
  });

  return { terra };
};

export default TerraEnv;
