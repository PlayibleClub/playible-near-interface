import { useWallet, useConnectedWallet, WalletStatus, ConnectType } from '@terra-money/wallet-provider';
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
import axios from 'axios';


import {
  encodeRelayCandidateBlockInput,
  encodeAppendSignatureInput,
  encodeVerifyAndSaveResultInput,
  encodeCalldata,
} from '../utils/band';
import { 
  MsgExecuteContract, 
  StdFee, 
} from '@terra-money/terra.js';

export default function Home() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
  const connectedWallet = useConnectedWallet();

  const interactWallet = () => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      disconnect();
    } else {
      connect(ConnectType.CHROME_EXTENSION);
    }
  };

  // gas limit
  const GAS = 2_000_000;

  const bridgeAddress = "terra14kfq7r56ewrv4pk5fldy23mkg6xd9sq8ujgzcp";
  const consumerAddress = "terra1r8yt89e77vdg7jlllazvkav3g2a2vhznusatnl";
  const animals = ['Dog', 'Bird', 'Cat', 'Mouse', 'Horse'];

  const requestData = async () => {
    try {
      const result = await axios.get(
        "https://laozi-testnet2.bandchain.org/oracle/proof/50"
      );
      console.log(result);
      if (result.status == 200) {
        relayAndVerify(result.data.result.proof);
      }
    } catch(err) {
      if (err.isAxiosError && err.response && err.response.status !== 404) {
        console.error(err.response.data);
      } else if (!err.isAxiosError) {
        console.error(err.message);
      }
    }
  }

  const relayAndVerify = async (proof) => {
    console.log(proof);
    console.log(connectedWallet);
    console.log(status);
    const encodedBlockHeader = encodeRelayCandidateBlockInput(proof);
    const encodedSigs = encodeAppendSignatureInput(proof);
    const encodeVerifyAndSaveResult = encodeVerifyAndSaveResultInput(proof);
    console.log("Encoded Block Header: ", encodedBlockHeader);
    console.log("Encoded Sigs: ", encodedSigs);
    console.log("Encoded Verify And Save Result: ", encodeVerifyAndSaveResult);
  
    // create msgs
    const msg1 = new MsgExecuteContract(connectedWallet.walletAddress, bridgeAddress, {
      relay_candidate_block: { data: encodedBlockHeader },
    });
    const msg2 = new MsgExecuteContract(connectedWallet.walletAddress, bridgeAddress, {
      append_signature: { data: encodedSigs },
    });
    const msg3 = new MsgExecuteContract(connectedWallet.walletAddress, bridgeAddress, {
      verify_and_save_result: { data: encodeVerifyAndSaveResult },
    });
    const msg4 = new MsgExecuteContract(connectedWallet.walletAddress, consumerAddress, {
      save_verified_result: { request_id: parseInt(proof.oracle_data_proof.result.request_id, 10) }
    });
  
    console.log("executing");
    // sign tx
    const signedTx = await connectedWallet.post({
      msgs: [ msg1 ],
      gasPrices: new StdFee(10_000_000, { uusd: 2000000 }).gasPrices(),
      gasAdjustment: 1.1,
    }).then(e => {
      console.log(e);
    }).catch(e =>{
      console.log(e);
    });

    console.log("executed contract");
  
    // broadcast tx
    const { txhash } = await terra.tx.broadcastSync(signedTx);
    console.log("broadcast tx to terra chain: ", txhash);
  
    const txResult = await validateTx(txhash);
    console.log("\n");
    if (!txResult) {
      throw "Fail to get result from chain";
    }
  };

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
            <Button rounded="rounded-full" onClick={requestData} size="py-1 px-6">
              { 'band' }
            </Button>

            <div className="flex flex-col  w-full h-full overflow-y-auto">
              <TitledContainer title="MARKETPLACE">
                <RowContainer>
                  <AthleteTokenContainer AthleteName="STEPHEN CURRY" TeamName="GOLDEN STATE WARRIORS" CoinValue="54" />
                  <AthleteTokenContainer AthleteName="LEBRON JAMES" TeamName="LOS ANGELES LAKERS" CoinValue="106" />

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
