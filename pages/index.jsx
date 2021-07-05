import Header from '../components/Header';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Main from '../components/Main';
import Roundedinput from '../components/Roundedinput';

let useWallet = {};
if (typeof document !== 'undefined') {
  useWallet = require('@terra-money/wallet-provider').useWallet;
}

export default function Home() {
  let wallet = '';
  if (typeof document !== 'undefined') {
    wallet = useWallet();
  }

  const interactWallet = () => {
    if (wallet.status === 'WALLET_CONNECTED') {
      wallet.disconnect(wallet.availableConnectTypes[1]);
    } else {
      wallet.connect(wallet.availableConnectTypes[1]);
    }
  };

  return (
    <>
      <Header>
        <div className="flex flex-row">
          <Button rounded="rounded-full  " onClick={interactWallet} size="py-1 px-6">
            {wallet.status === 'WALLET_CONNECTED' ? 'Disconnect Wallet' : 'Connect Wallet'}
          </Button>
          <Button rounded="rounded-full h-12 w-10 flex items-center justify-center" />
        </div>

      </Header>
      <div div className="flex flex-row">
        <Navbar color="white">
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Home</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Trade</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Farms</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Pools</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Prediction</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Lottery</Button>
          <Button color="white" saturation="100" textColor="blue" textSaturation="500" size="py-1 px-6">Collectibles</Button>
        </Navbar>

        <Main color="green">
          <Roundedinput rounded="rounded-full" />
        </Main>
      </div>

    </>
  );
}
