import React, { useEffect, useState } from 'react';
import Container from 'components/containers/Container';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import Image from 'next/image';
import BackFunction from 'components/buttons/BackFunction';
import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import StatsComponent from '../components/StatsComponent';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { query_nft_tokens_by_id } from 'utils/near/helper';
import { getSportType, SPORT_TYPES } from 'data/constants/sportConstants';
const AssetDetails = (props) => {
  const { query } = props;

  const athleteIndex = query.id;
  const currentSport = query.sport.toString().toUpperCase();
  const isSoulbound = athleteIndex.includes('SB') ? true : false;
  const { accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [athlete, setAthlete] = useState(null);
  const athleteImage = athlete?.image;

  function getDateOfGame(gameDate) {
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

  function get_nft_tokens_by_id(athleteIndex, contract) {
    query_nft_tokens_by_id(athleteIndex, contract).then(async (data) => {
      // @ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      const result_two = await getAthleteInfoById(await convertNftToAthlete(result));
      setAthlete(result_two);
    });
  }
  useEffect(() => {
    get_nft_tokens_by_id(
      athleteIndex,
      isSoulbound
        ? getSportType(currentSport).promoContract
        : getSportType(currentSport).regContract
    );
  }, []);

  function getGamesPlayed() {
    let totalGames = 0;
    athlete?.stats_breakdown.forEach((game) => {
      if (game.type === 'weekly' && game.played == 1) {
        totalGames++;
      }
      else if (game.type === 'daily' && game.played == 1) {
        totalGames++;
      }
    });
    return totalGames;
  }

  console.log(athlete?.primary_id);

  return (
    <Container activeName="ATHLETES">
      <div className="md:ml-6 mt-12">
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
            <div className="mt-10 text-m h-0 font-bold">{athlete?.name}</div>
            <div className="mt-10 text-sm grid grid-rows-2">
              <div className="">
                <div className="relative ml-32">
                  {athlete?.isInjured ? (
                    <div className="rounded-full mt-1 bg-indigo-red w-3 h-3 absolute "></div>
                  ) : athlete?.isActive ? (
                    <div className="mt-1 rounded-full bg-indigo-green w-3 h-3  absolute"></div>
                  ) : (
                    <div className="mt-1 rounded-full bg-indigo-green w-3 h-3  absolute"></div>
                  )}
                </div>
                <div>FANTASY SCORE</div>
              </div>
              <div className="font-bold">{athlete?.fantasy_score.toFixed(2)}</div>
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

        <div className="grid grid-cols-2 ml-24 mt-10 mb-24 w-5/12">
          <div className="mr-2 p-4 border border-indigo-slate rounded-lg text-center">
            <div className="font-monument text-3xl">{athlete?.fantasy_score.toFixed(2)}</div>
            <div className="text-sm">AVG.FANTASY SCORE</div>
          </div>
          <div className="ml-4 mr-5 p-4 border border-indigo-slate rounded-lg text-center">
            <div className="font-monument text-3xl">
              {athlete === undefined ? '' : getGamesPlayed()}
            </div>
            <div className="text-sm">GAMES PLAYED</div>
          </div>
        </div>

        <StatsComponent
          id={athlete?.primary_id}
          position={athlete?.position}
          sport={currentSport}
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
            {athlete == undefined
              ? 'LOADING GAMES....'
              : athlete.stats_breakdown
                  .filter((statType) => statType.type == 'weekly' || 'daily' && statType.played == 1)
                  .map((item, index) => {
                    return (
                      <tr key={index} className="border border-indigo-slate">
                        <td className="text-sm text-center w-6 pl-4 pr-4">
                          {getDateOfGame(item.gameDate)}
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
