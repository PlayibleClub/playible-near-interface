import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
// import Image from 'next/image';
import Header from '../components/Header';
import Button from '../components/Button';
// import Navbar from '../components/Navbar';
import Main from '../components/Main';
import TitledContainer from '../components/TitledContainer';
import RoundedContainer from '../components/RoundedContainer';
import AthleteGrid from '../components/AthleteGrid';
// import Roundedinput from '../components/Roundedinput';
import AthleteContainer from '../components/AthleteContainer';
import RowContainer from '../components/RowContainer';
// import fantasyLogo from '../public/fantasyinvestar.png';
// import daily from '../public/daily.png';
// import weekly from '../public/weekly.png';
// import seasonal from '../public/seasonal.png';
// import wallet from '../public/wallet.png';
import AthleteTokenContainer from '../components/AthleteTokenContainer';

export default function Home() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(availableConnectTypes[1]);
    }

    console.log(status);
  };
  const animals = ['Dog', 'Bird', 'Cat', 'Mouse', 'Horse'];

  return (
    <>
      <link href="https://fonts.googleapis.com/css?family=Nunito:400,700&display=swap" rel="stylesheet"></link>
      <div className=" h-screen">

        <div className="flex flex-col w-full ">
          <Header>

            <Button color="indigo-light" saturation="0" textColor="white-light" textSaturation="500" size="py-1 px-1">=</Button>
            <div className="text-white-light">
              {' '}
              <img src="images/fantasyinvestar.png" alt="Img" />
            </div>
            <Button rounded="rounded-sm " textColor="white-light" color="null" onClick={interactWallet} size="py-1 px-1">
              <img src="images/wallet.png" alt="Img" />
              {status === WalletStatus.WALLET_CONNECTED ? '*' : '+'}
            </Button>

          </Header>

          <Main color="indigo-dark">

            <div className="flex flex-col  w-full h-full overflow-y-auto">
              <TitledContainer title="MARKETPLACE">
                <RowContainer>
                  <AthleteTokenContainer AthleteName="STEPHEN CURRY" CoinValue="54" />
                  <AthleteTokenContainer AthleteName="LEBRON JAMES" CoinValue="106" />

                </RowContainer>
              </TitledContainer>
              <TitledContainer align="justify-center" title="PLAY">
                <div className="pl-2 w-5/6 grid gap-x-1 gap-y-2 grid-cols-2">
                  <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/daily.png" alt="Italian Trulli" /></div>
                  <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/weekly.png" alt="Italian Trulli" /></div>
                  <div className="rounded-md  flex justify-center"><img className="rounded-md" src="images/seasonal.png" alt="Italian Trulli" /></div>

                </div>

              </TitledContainer>

              <TitledContainer className=" flex w-1/2" title="GAME RESULTS">
                <RoundedContainer>
                  <select className="w-11/12 bg-indigo-light" name="games" id="cars">
                    <option value="All Games">All Games</option>
                    <option value="Some games">Some Games</option>
                    <option value="Games this week">Games this week</option>
                    <option value="Games for the month">Games for the month</option>
                  </select>
                </RoundedContainer>

                <RoundedContainer>

                  <ul>
                    {animals.map((animal) => (
                      <li>{animal}</li>
                    ))}
                  </ul>
                </RoundedContainer>
              </TitledContainer>

              <TitledContainer align="justify-start" className=" flex w-1/2 justify-start" title="TOP PERFORMERS">
                <AthleteGrid>
                  <AthleteContainer AthleteName="STEPHEN CURRY" TeamName="GOLDEN STATE WARRIORS" CoinValue="420 UST" />
                  <RoundedContainer>bant</RoundedContainer>
                  <RoundedContainer>bant</RoundedContainer>
                  <RoundedContainer>bant</RoundedContainer>
                </AthleteGrid>
              </TitledContainer>
            </div>

          </Main>

        </div>

      </div>
    </>
  );
}
