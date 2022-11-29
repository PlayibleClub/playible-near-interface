import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import { GAME, ATHLETE } from 'data/constants/nearContracts';
import { providers } from 'near-api-js';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
import { query_all_players_lineup } from 'utils/near/helper';
import { array } from 'prop-types';

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
    setPlayerLineups(await query_all_players_lineup(gameId, week));
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
