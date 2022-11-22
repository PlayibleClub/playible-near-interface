import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getContract, getRPCProvider } from 'utils/near';
import { GAME, ATHLETE } from 'data/constants/nearContracts';
import { providers } from 'near-api-js';
import { getAthleteInfoById, convertNftToAthlete } from 'utils/athlete/helper';
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

  function get_all_players_lineup() {
    const query = JSON.stringify({
      game_id: gameId,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(GAME),
        method_name: 'get_all_players_lineup',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());

        const arrayToReturn = await Promise.all(
          result.map(async (item) => {
            let itemToReturn = {
              accountId: item[0][0],
              teamName: item[0][2],
              lineup: item[1].lineup,
              sumScore: 0,
            };

            itemToReturn.lineup = await Promise.all(
              itemToReturn.lineup.map((item) => {
                return query_nft_token_by_id(item);
              })
            );

            itemToReturn.lineup = itemToReturn.lineup.map((lineupItem) => {
              return {
                ...lineupItem,
                stats_breakdown:
                  lineupItem.stats_breakdown
                    .filter(
                      (statType) =>
                        statType.type == 'weekly' && statType.played == 1 && statType.week == week
                    )
                    .map((item) => {
                      return item.fantasyScore;
                    })[0] || 0,
              };
            });

            itemToReturn.sumScore = itemToReturn.lineup.reduce((accumulator, object) => {
              return accumulator + object.stats_breakdown;
            }, 0);

            return itemToReturn;
          })
        );

        arrayToReturn.sort(function (a, b) {
          return b.sumScore - a.sumScore;
        });

        setPlayerLineups(arrayToReturn);
      });
  }

  function query_nft_token_by_id(item) {
    const query = JSON.stringify({
      token_id: item,
    });

    return provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'nft_token_by_id',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        const result_two = await getAthleteInfoById(await convertNftToAthlete(result));
        return result_two;
      });
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
                <div>Account Id: {item.accountId}</div>
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
