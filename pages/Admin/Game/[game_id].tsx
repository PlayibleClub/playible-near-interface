import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import { providers } from 'near-api-js';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import { query_all_players_lineup, query_game_data } from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';
import moment, { Moment } from 'moment';

export default function AdminPlayerLineup(props) {
  const { query } = props;
  const router = useRouter();
  const week = router.query.week;
  const gameId = query.game_id;

  const [playerLineups, setPlayerLineups] = useState([]);

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  async function get_all_players_lineup() {
    let gameData = await query_game_data(gameId, getSportType('FOOTBALL').gameContract);
    const startTimeFormatted = moment(gameData.start_time).format('YYYY-MM-DD');
    const endTimeFormatted = moment(gameData.end_time).format('YYYY-MM-DD');

    setPlayerLineups(
      await query_all_players_lineup(gameId, week, 'FOOTBALL', startTimeFormatted, endTimeFormatted)
    );
  }

  useEffect(() => {
    get_all_players_lineup();
  }, []);

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
                <div>Week: {week}</div>
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
