import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import { compute_scores, query_game_data, query_player_lineup } from 'utils/near/helper';
import { getNflWeek, getNflSeason, formatToUTCDate } from 'utils/date/helper';
import { getSportType, SPORT_TYPES, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';

export default function AdminPlayerLineup(props) {
  const { query } = props;
  const router = useRouter();
  const [week, setWeek] = useState(0);
  const [nflSeason, setNflSeason] = useState('');
  const sportObj = SPORT_TYPES.map((x) => ({ name: x.sport, isActive: false }));
  sportObj[0].isActive = true;
  const currentSport = query.sport.toString().toUpperCase();
  console.log(currentSport);
  const gameId = query.game_id;

  const [playerLineups, setPlayerLineups] = useState([]);

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  async function get_all_players_lineup_chunkify() {
    let gameData = await query_game_data(gameId, getSportType(currentSport).gameContract);
    const startTimeFormatted = formatToUTCDate(gameData.start_time);
    const endTimeFormatted = formatToUTCDate(gameData.end_time);

    const lineupLen = await get_player_lineup_length();
    const halfLen = Math.ceil(lineupLen / 2);
    let result = [];
    for (let i = 0; i < lineupLen; i += halfLen) {
      await get_all_player_keys_chunk(i, halfLen).then(async (halfResult) => {
        if (result.length === 0) {
          result = halfResult;
        } else {
          result = result.concat(halfResult);
        }
      });
    }
    let filteredResult = result.filter((data) => data[1] === gameId);
    let lineups = [];
    for (const entry of filteredResult) {
      await query_player_lineup(currentSport, entry[0], entry[1], entry[2]).then((lineup) => {
        if (lineups.length === 0) {
          lineups = [lineup];
        } else {
          lineups = lineups.concat([lineup]);
        }
      });
    }
    let computedLineup = await compute_scores(
      lineups,
      currentSport,
      startTimeFormatted,
      endTimeFormatted
    );
    setPlayerLineups(computedLineup);
  }

  async function get_player_lineup_length() {
    const query = JSON.stringify({});
    return await provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup_length',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        return result;
      });
  }
  async function get_all_player_keys_chunk(start, limit) {
    const query = JSON.stringify({
      from_index: start,
      limit: limit,
    });
    return await provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getSportType(currentSport).gameContract,
        method_name: 'get_player_lineup_keys_chunk',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        //@ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        return result;
      });
  }
  // async function get_all_player_keys() {
  //   const query = JSON.stringify({});
  //   return await provider
  //     .query({
  //       request_type: 'call_function',
  //       finality: 'optimistic',
  //       account_id: getSportType(currentSport).gameContract,
  //       method_name: 'get_player_lineup_keys',
  //       args_base64: Buffer.from(query).toString('base64'),
  //     })
  //     .then(async (data) => {
  //       //@ts-ignore:next-line
  //       const result = JSON.parse(Buffer.from(data.result).toString());
  //       //console.log(result);
  //       return result;
  //     });
  // }

  // async function get_all_players_lineup_with_index() {
  //   let gameData = await query_game_data(gameId, getSportType(currentSport).gameContract);
  //   const startTimeFormatted = formatToUTCDate(gameData.start_time);
  //   const endTimeFormatted = formatToUTCDate(gameData.end_time);
  //   // console.log('    TEST start date: ' + startTimeFormatted);
  //   // console.log('    TEST end date: ' + endTimeFormatted);

  //   await get_all_player_keys().then(async (result) => {
  //     let filteredResult = result.filter((data) => data[1] === gameId);
  //     //console.log(filteredResult);
  //     let lineups = [];

  //     for (const entry of filteredResult) {
  //       await query_player_lineup(currentSport, entry[0], entry[1], entry[2]).then((lineup) => {
  //         if (lineups.length === 0) {
  //           lineups = [lineup];
  //         } else {
  //           lineups = lineups.concat([lineup]);
  //         }
  //       });
  //     }
  //     let computedLineup = await compute_scores(
  //       lineups,
  //       currentSport,
  //       startTimeFormatted,
  //       endTimeFormatted
  //     );
  //     setPlayerLineups(computedLineup);
  //   });
  // }

  useEffect(() => {
    get_all_players_lineup_chunkify();
  }, [currentSport, week, nflSeason]);

  return (
    <div>
      {playerLineups.length > 0
        ? playerLineups.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  Account Id: <b>{item.accountId}</b>
                </div>
                <div>Team Name: {item.teamName}</div>
                <div>Overall Fantasy Score: {item.sumScore}</div>
                {currentSport === SPORT_NAME_LOOKUP.football ? <div>Week: {week}</div> : null}
                <div>
                  Lineup:{' '}
                  {item.lineup.map((item, index) => {
                    return (
                      <div key={index}>
                        <div>Player: {item.name}</div>
                        <div>
                          Fantasy Score:
                          {item.stats_breakdown}
                        </div>
                      </div>
                    );
                  })}{' '}
                </div>
              </div>
            );
          })
        : ''}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query.game_id != query.game_id) {
    return {
      desination: query.origin || '/Play',
    };
  }

  return {
    props: { query },
  };
}
