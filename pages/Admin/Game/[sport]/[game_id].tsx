import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import { query_all_players_lineup, query_game_data } from 'utils/near/helper';
import { getNflWeek, getNflSeason, formatToUTCDate } from 'utils/date/helper';
import { getSportType, SPORT_TYPES, SPORT_NAME_LOOKUP } from 'data/constants/sportConstants';
import moment, { Moment } from 'moment';

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

  async function get_all_players_lineup() {
    let gameData = await query_game_data(gameId, getSportType(currentSport).gameContract);
    // setNflSeason(await getNflSeason(gameData.start_time / 1000));
    // setWeek(await getNflWeek(gameData.start_time / 1000));
    // console.log(nflSeason);

    const startTimeFormatted = formatToUTCDate(gameData.start_time);
    const endTimeFormatted = formatToUTCDate(gameData.end_time);

    setPlayerLineups(
      await query_all_players_lineup(gameId, currentSport, startTimeFormatted, endTimeFormatted)
    );
  }

  useEffect(() => {
    get_all_players_lineup();
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
