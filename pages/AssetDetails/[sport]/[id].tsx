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
import { checkInjury } from 'utils/athlete/helper';
import moment from 'moment';
const AssetDetails = (props) => {
  const { query } = props;

  const athleteIndex = query.id;
  const currentSport = query.sport.toString().toUpperCase();
  const isSoulbound = athleteIndex.includes('SB') || athleteIndex.includes('PR') ? true : false;
  const { accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [athlete, setAthlete] = useState(null);
  const [sortedGames, setSortedGames] = useState([]);
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
      const result_two = await getAthleteInfoById(await convertNftToAthlete(result), null, null);
      let games = result_two.stats_breakdown.slice();
      console.log(result_two);
      setAthlete(result_two);
      setSortedGames(
        games
          .filter((x) => x.type === 'weekly' || x.type === 'daily')
          .sort((a, b) => {
            return moment.utc(a.gameDate).unix() - moment.utc(b.gameDate).unix();
          })
      );
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
      } else if (game.type === 'daily' && game.played == 1) {
        totalGames++;
      }
    });
    return totalGames;
  }

  function getGamesPlayedNba() {
    let totalGames = 0;
    athlete?.stats_breakdown.forEach((game) => {
      if (game.type === 'season') {
        totalGames = game.played;
      }
    });
    return totalGames;
  }
  useEffect(() => {
    console.log(sortedGames);
  }, [sortedGames]);
  console.log(athlete?.primary_id);

  return (
    <Container activeName="ATHLETES">
      <div className="md:ml-6 mt-12">
        <BackFunction prev={query.origin ? `/${query.origin}` : '/Portfolio'}></BackFunction>
      </div>
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-40 md:ml-14">
        <div className="ml-10 mt-24 md:hidden">
          <object
            className=""
            type="image/svg+xml"
            data={athleteImage !== undefined ? athleteImage : '/images/tokensMLB/SP.png'}
            width={120}
            height={160}
          />
        </div>
        <div className="flex flex-row ml-10 mt-10">
          <div className="ml-10 mt-24 md:-ml-8 md:mt-0 lg:block iphone5:hidden md:block">
            <object
              className=""
              type="image/svg+xml"
              data={athleteImage !== undefined ? athleteImage : '/images/tokensMLB/SP.png'}
              width={120}
              height={160}
            />
          </div>
          <div className="grid grid-rows md:ml-10">
            <div className="text-2xl font-bold font-monument">
              PLAYER DETAILS
              <hr className="w-10 border-4"></hr>
            </div>
            <div className="mt-10 text-m h-0 font-bold">{athlete?.name}</div>
            <div className="mt-10 text-sm grid grid-rows-2">
              <div className="">
                <div className="group relative ml-32">
                  {/* {athlete?.isInjured ? (
                    <div className="rounded-full mt-1 bg-indigo-red w-3 h-3 absolute "></div>
                  ) : athlete?.isActive ? (
                    <div className="mt-1 rounded-full bg-indigo-green w-3 h-3  absolute"></div>
                  ) : (
                    <div className="mt-1 rounded-full bg-indigo-green w-3 h-3  absolute"></div>
                  )} */}
                  <div
                    className={`rounded-full mt-1 w-3 h-3 absolute ${athlete?.isInjured && checkInjury(athlete?.isInjured) === 1
                        ? 'bg-indigo-yellow'
                        : athlete?.isInjured && checkInjury(athlete?.isInjured) === 2
                          ? 'bg-indigo-red'
                          : 'bg-indigo-green'
                      }`}
                  ></div>
                  <span className="pointer-events-none absolute -top-7 -left-8 w-max rounded px-2 py-1 bg-indigo-gray text-indigo-white text-sm font-medium text-gray-50 shadow opacity-0 transition-opacity group-hover:opacity-100">
                    {athlete?.isInjured !== null ? athlete?.isInjured : 'Active'}
                  </span>
                </div>
                <div>FANTASY SCORE</div>
              </div>
              <div className="font-bold">{athlete?.fantasy_score.toFixed(2)}</div>
            </div>
            {currentSport === 'FOOTBALL'
              ? <Link href="https://paras.id/collection/athlete.nfl.playible.near">
                <button
                  className="bg-indigo-lightblue text-indigo-buttonblue w-full md:w-80 h-10 
                text-center font-bold text-md mt-12 self-center justify-center"
                >
                  PLACE FOR SALE
                </button>
              </Link>
              : <Link href="https://paras.id/collection/athlete.basketball.playible.near">
                <button
                  className="bg-indigo-lightblue text-indigo-buttonblue w-full md:w-80 h-10 
              text-center font-bold text-md mt-12 self-center justify-center"
                >
                  PLACE FOR SALE
                </button>
              </Link>}
            <div></div>
          </div>
        </div>
        <div className="text-2xl font-bold font-monument ml-10 mt-16 mr-8 align-baseline">
          SEASON STATS
          <hr className="w-10 border-4"></hr>
        </div>

        <div className="grid grid-cols-2 ml-10 mt-10 mb-20 w:3/4 md:w-5/12 md:text-center">
          <div className="mr-2 p-4 border border-indigo-slate rounded-lg ">
            <div className="font-monument text-3xl">{athlete?.fantasy_score.toFixed(2)}</div>
            <div className="text-sm">AVG.FANTASY SCORE</div>
          </div>
          <div className="ml-4 mr-5 p-4 border border-indigo-slate rounded-lg text-center">
            <div className="font-monument text-3xl">
              {currentSport === 'FOOTBALL'
                ? athlete === undefined
                  ? ''
                  : getGamesPlayed()
                : athlete === undefined
                  ? ''
                  : getGamesPlayedNba()}
            </div>
            <div className="text-sm">GAMES PLAYED</div>
          </div>
        </div>

        <StatsComponent
          id={athlete?.primary_id}
          position={athlete?.position}
          sport={currentSport}
        />
        <div className="text-2xl font-bold font-monument mt-3 ml-10 mb-10 mr-8 align-baseline md:-mt-14">
          GAME SCORES
          <hr className="w-10 border-4"></hr>
        </div>
        <table className="table-auto ml-2 mr-24 md:mr-40 mb-40 border border-indigo-slate md:ml-10">
          <thead>
            <tr className="border border-indigo-slate">
              <th> </th>
              <th> </th>
              <th> </th>
              <th className="font-monument text-xs text-right pr-24 p-2">FANTASY SCORE</th>
            </tr>
          </thead>
          <tbody>
            {sortedGames == undefined
              ? 'LOADING GAMES....'
              : sortedGames
                .filter(
                  (statType) =>
                    (statType.type == 'weekly' || statType.type == 'daily') &&
                    statType.played == 1
                )
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
