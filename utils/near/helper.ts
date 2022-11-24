import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { GAME, ATHLETE } from 'data/constants/nearContracts';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';

const provider = new providers.JsonRpcProvider({
  url: getRPCProvider(),
});

async function query_game_data(game_id) {
  const query = JSON.stringify({
    game_id: game_id,
  })

  return await provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: getContract(GAME),
    method_name: 'get_game',
    args_base64: Buffer.from(query).toString('base64'),
  });
}
async function query_nft_token_by_id(token_id) {
  const query = JSON.stringify({
    token_id: token_id,
  });
  return provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: getContract(ATHLETE),
    method_name: 'nft_token_by_id',
    args_base64: Buffer.from(query).toString('base64'),
  })
    .then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      const result_two = await getAthleteInfoById(await convertNftToAthlete(result));
      return result_two;
    })
}
async function query_all_players_lineup(game_id, week) {
  const query = JSON.stringify({
    game_id: game_id,
  });

  return await provider.query({
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

      return arrayToReturn;
    });
}

function query_nft_tokens_for_owner(athleteIndex) {
  const query = JSON.stringify({
    token_id: athleteIndex
  });

  return provider.query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: getContract(ATHLETE),
      method_name: 'nft_token_by_id',
      args_base64: Buffer.from(query).toString('base64'),
    })
  }

export { query_game_data, query_all_players_lineup,query_nft_tokens_for_owner }