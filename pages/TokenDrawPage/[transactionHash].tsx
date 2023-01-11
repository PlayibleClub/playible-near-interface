import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Container from '../../components/containers/Container';
import HeaderBase from '../../components/headers/HeaderBase';
import Navbar from '../../components/navbars/Navbar';
import HorizontalScrollContainer from '../../components/containers/HorizontalScrollContainer';
import TokenComponent from '../../components/TokenComponent';
import Main from '../../components/Main';

import 'regenerator-runtime/runtime';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { decode } from 'js-base64';
import { useLazyQuery, useQuery } from '@apollo/client';
import client from 'apollo-client';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';

interface responseExperimentalTxStatus {
  receipts: Array<receipt>;
}

interface receipt {
  receipt: {
    Action: {
      actions: Array<{
        FunctionCall: {
          args: string;
        };
      }>;
    };
  };
}

const TokenDrawPage = (props) => {
  const { query, result } = props;

  const dispatch = useDispatch();

  const [videoPlaying, setVideoPlaying] = useState(true);
  const [sport, setSport] = useState('');
  const [loading, setLoading] = useState(true);

  const [assets, setassets] = useState([]);
  const [athletes, setAthletes] = useState([]);

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const { selector, accountId } = useWalletSelector();

  const query_transaction = useCallback(async () => {
    const queryFromNear = await provider.sendJsonRpc<responseExperimentalTxStatus>(
      'EXPERIMENTAL_tx_status',
      [query.transactionHash, accountId]
    );
    //@ts-ignore:next-line
    const receiver_id = queryFromNear.receipts[1].receiver_id;
    setSport(
      receiver_id.includes('.nfl.')
        ? 'FOOTBALL'
        : receiver_id.includes('.basketball.')
        ? 'BASKETBALL'
        : ''
    );
    // See https://docs.near.org/api/rpc/transactions
    setAthletes(
      await Promise.all(
        // filter out all receipts, and find those that array of 8 actions (since 8 nft_mints)
        queryFromNear.receipts
          .filter((item) => {
            return item.receipt.Action.actions.length == 8;
          })[0]
          // decode the arguments of nft_mint, and determine the json
          .receipt.Action.actions.map((item) => {
            return JSON.parse(decode(item.FunctionCall.args));
          })
          // get metadata
          .map(convertNftToAthlete)
          .map(getAthleteInfoById)
      )
    );
    setLoading(false);
  }, []);

  const activeChecker = () => {
    if (athletes.length > 0) {
      const notRevealed = athletes.filter((item) => !item.isOpen);

      if (notRevealed.length > 0) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  };

  const revealAll = () => {
    const tempAthletes = athletes.map((item) => {
      return {
        ...item,
        isOpen: true,
      };
    });

    setAthletes(tempAthletes);
  };

  const changeCard = (position) => {
    if (athletes[position].isOpen === false) {
      const updatedList = [...athletes];
      const updatedAthlete = {
        ...athletes[position],
        isOpen: true,
      };
      updatedList.splice(position, 1, updatedAthlete);
      setAthletes(updatedList);
    }
  };

  useEffect(() => {
    query_transaction().catch(console.error);
  }, [query_transaction]);

  const onVideoEnded = () => {
    setVideoPlaying(false);
  };

  useEffect(() => {
    if (isMobile) {
      setVideoPlaying(false);
    }
  }, []);

  useEffect(() => {
    console.log(sport);
  }, [sport]);

  const walletConnection = () => {
    return <p className="ml-12 mt-5">{'Waiting for wallet connection...'}</p>;
  };

  const error = () => {
    return <p className="ml-12 mt-5">{'Transaction encountered error.'}</p>;
  };

  const tokenRevealPage = () => {
    return (
      <>
        {athletes.length > 0 && activeChecker() && (
          <div className="flex justify-center my-2 w-full">
            <button
              className="bg-indigo-buttonblue cursor-pointer text-indigo-white w-5/6 md:w-80 h-14 text-center font-bold text-md uppercase"
              onClick={revealAll}
            >
              Reveal all
            </button>
          </div>
        )}
        <div className="flex justify-center self-center" style={{ backgroundColor: 'white' }}>
          <div className="flex flex-row flex-wrap justify-center">
            {athletes.length > 0
              ? athletes.map((data, key) => (
                  <div className="flex px-14 py-10 m-10" key={key}>
                    <div
                      onClick={() => {
                        changeCard(key);
                      }}
                    >
                      <TokenComponent
                        athlete_id={data.athlete_id}
                        position={data.position}
                        release={data.release}
                        rarity={data.rarity}
                        team={data.team}
                        usage={data.usage}
                        name={data.name}
                        isOpen={data.isOpen}
                        img={data.image}
                        animation={data.animation}
                      />
                    </div>
                  </div>
                ))
              : ''}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Container activeName="SQUAD">
        <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
          <Main color="indigo-white">
            {videoPlaying ? (
              <div className="player-wrapper">
                <video className="open-pack-video" autoPlay muted onEnded={onVideoEnded}>
                  <source src="/videos/starter-pack-white.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            ) : (
              <>
                {loading ? (
                  <LoadingPageDark />
                ) : (
                  <>
                    {!result ? (
                      error()
                    ) : (
                      <div className="mb-10">
                        <div>{!accountId ? walletConnection() : tokenRevealPage()}</div>
                        <div className="flex h-14 mt-16">
                          <div className="w-full justify-end"></div>
                          <Link href="/Portfolio" replace>
                            <button className="bg-indigo-buttonblue cursor-pointer text-indigo-white w-5/6 md:w-80 h-14 text-center font-bold text-md">
                              GO TO MY SQUAD
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Main>
        </div>
      </Container>
    </>
  );
};

export default TokenDrawPage;

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  let result = false;

  if (!query.transactionHash) {
    return {
      redirect: {
        destination: '/Portfolio',
        permanent: false,
      },
    };
  } else {
    const provider = new providers.JsonRpcProvider({
      url: getRPCProvider(),
    });
    const transaction = await provider.txStatus(query.transactionHash, 'unnused');
    // true if successful
    // false if unsuccessful
    result = providers.getTransactionLastResult(transaction);
  }

  return {
    props: { query, result },
  };
}
