import React, { useEffect, useState } from 'react';
import Container from '../../components/containers/Container';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import Image from 'next/image';
import BackFunction from '../../components/buttons/BackFunction';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { ATHLETE } from 'data/constants/nearContracts';
import StatsComponent from './components/StatsComponent';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Link from 'next/link';

const AssetDetails = (props) => {
  const { query } = props;
  const athleteIndex = query.id;
  const { accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [athlete, setAthlete] = useState([]);
  const athleteImage = athlete
    .map((item) => {
      return item.image;
    })
    .toString();

  function get_dateOfGame(gameDate) {
    let date = new Date(Date.parse(gameDate));
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months[date.getMonth()] + '. ' + date.getDate();
  }

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({
      account_id: accountId,
      from_index: athleteIndex.toString(),
      limit: 1,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'nft_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        const result_two = await Promise.all(
          result.map(convertNftToAthlete).map(getAthleteInfoById)
        );
        setAthlete(result_two);
      });
  }

  useEffect(() => {
    query_nft_tokens_for_owner();
  }, []);

  function getGamesPlayed() {
    let totalGames = 0;
    athlete[0].stats_breakdown.forEach((game) => {
      if (game.type === 'weekly' && game.played == 1) {
        totalGames++;
      }
    });
    return totalGames;
  }
  return (
    <Container activeName="ATHLETES">
      <div className="mt-8">
        <BackFunction prev={query.origin ? `/${query.origin}` : '/Portfolio'}></BackFunction>
      </div>
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40">
        <div className="flex flex-row ml-16 mt-10">
          <div className="mr-10">
            <object
              className=""
              type="image/svg+xml"
              data={athleteImage !== undefined ? athleteImage : '/images/tokensMLB/SP.png'}
              width={120}
              height={160}
            />
          </div>
          <div className="grid grid-rows">
            <div className="text-2xl font-bold font-monument">
              PLAYER DETAILS
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="mt-10 text-m h-0 font-bold">
              {athlete
                .map((item) => {
                  return item.name;
                })
                .toString()
                .toUpperCase()}
            </div>
            <div className="mt-10 text-sm grid grid-rows-2 grid-cols-2">
              <div>FANTASY SCORE</div>
              <div>
                PLAY BALANCE
                <Popup
                  trigger={
                    <button className="ml-2 font-bold border rounded-full relative px-2">
                      {' '}
                      i{' '}
                    </button>
                  }
                  position="right center"
                >
                  <div className="mt-2 mb-2 ml-2 mr-2">
                    PLAY BALANCE: Amount of PLAY remaining to join weekly cash contests
                  </div>
                </Popup>
              </div>
              <div>
                {athlete.map((item) => {
                  return item.fantasy_score.toFixed(2);
                })}
              </div>
              <div>
                {athlete.map((item) => {
                  return item.usage;
                })}
              </div>
            </div>
            <Link href="https://paras.id/collection/athlete.nfl.playible.near">
              <button
                className="bg-indigo-lightblue text-indigo-buttonblue w-5/6 md:w-80 h-10 
                  text-center font-bold text-md mt-12 self-center justify-center"
              >
                PLACE FOR SALE
              </button>
            </Link>
            <div></div>
          </div>
        </div>

        <div className="text-2xl font-bold font-monument ml-24 mt-16 mr-8 align-baseline">
          SEASON STATS
          <hr className="w-10 border-4"></hr>
        </div>
        <div className="grid grid-cols-2 ml-24 mt-10 mb-20 w-5/12">
          <div className="mr-2 p-4 border border-indigo-slate rounded-lg text-center">
            <div className="font-monument text-3xl">
              {athlete.map((item) => {
                return item.fantasy_score.toFixed(2);
              })}
            </div>
            <div className="text-sm">AVG.FANTASY SCORE</div>
          </div>
          <div className="ml-4 mr-5 p-4 border border-indigo-slate rounded-lg text-center">
            <div className="font-monument text-3xl">
              {athlete[0] === undefined ? '' : getGamesPlayed()}
            </div>
            <div className="text-sm">GAMES PLAYED</div>
          </div>
        </div>

        <StatsComponent
          id={athlete.map((item) => {
            return item.primary_id;
          })}
          position={athlete.map((item) => {
            return item.position;
          })}
        />

        <div className="text-2xl font-bold font-monument -mt-14 ml-24 mb-10 mr-8 align-baseline">
          GAME SCORES
          <hr className="w-10 border-4"></hr>
        </div>
        <table className="table-auto ml-24 mr-24 mb-40 border border-indigo-slate">
          <thead>
            <tr className="border border-indigo-slate">
              <th> </th>
              <th> </th>
              <th> </th>
              <th className="font-monument text-xs text-right pr-24 p-2">FANTASY SCORE</th>
            </tr>
          </thead>
          <tbody>
            {athlete[0] == undefined
              ? 'LOADING GAMES....'
              : athlete[0].stats_breakdown
                  .filter((statType) => statType.type == 'weekly' && statType.played == 1)
                  .map((item, index) => {
                    9;
                    return (
                      <tr key={index} className="border border-indigo-slate">
                        <td className="text-sm text-center w-6 pl-4 pr-4">
                          {get_dateOfGame(item.gameDate)}
                        </td>
                        <td className="text-sm w-px">vs.</td>
                        <td className="text-sm pl-2 font-black w-96">{item.opponent.name}</td>
                        <td className="text-sm text-right font-black p-3 pr-24 w-12">
                          {item.fantasyScore.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default AssetDetails;

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query.id != query.id) {
    return {
      desination: query.origin || '/Portfolio',
    };
  }

  return {
    props: { query },
  };
}
