import { providers } from 'near-api-js';
import { getContract, getRPCProvider } from 'utils/near';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { GAME_NFL, ATHLETE_NFL, PACK_PROMO_NFL, PACK_NFL, ATHLETE_PROMO_NFL } from 'data/constants/nearContracts';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';
import React, { useEffect, useState } from 'react';
import { DEFAULT_MAX_FEES, MINT_STORAGE_COST } from 'data/constants/gasFees';
import BigNumber from 'bignumber.js';
import { getSportType } from 'data/constants/sportConstants';
import moment, {Moment} from 'moment';
const provider = new providers.JsonRpcProvider({
  url: getRPCProvider(),
});


async function query_game_data(game_id, contract) {
  const query = JSON.stringify({
    game_id: game_id,
  });

  return await provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'get_game',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then(async (data) => {
      // @ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      console.log(result);
      return result;
    });
}

async function query_nft_token_by_id(token_id, currentSport) {
  const query = JSON.stringify({
    token_id: token_id,
  });
  return provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: token_id.includes('SB') ? getSportType(currentSport).promoContract : getSportType(currentSport).regContract,
      method_name: 'nft_token_by_id',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then(async (data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      const result_two = await getAthleteInfoById(await convertNftToAthlete(result));
      return result_two;
    });
}

function checkIncludedWeeks(stats) {
  for (let i = 0; i < stats.length; i++) {
    console.log(stats[i][0].gameDate);
  }
}

async function query_all_players_lineup(game_id, week, currentSport, start_time, end_time) {
  const query = JSON.stringify({
    game_id: game_id,
  });

  return await provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: getSportType(currentSport).gameContract,
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
              return query_nft_token_by_id(item, currentSport);
            })
          );
          console.log(itemToReturn.lineup);
          itemToReturn.lineup = itemToReturn.lineup.map((lineupItem) => {
            return {
              ...lineupItem,
              stats_breakdown:
                lineupItem.stats_breakdown
                  .filter(
                    (statType) => { console.log(currentSport);console.log(lineupItem.name); console.log(statType.type == 'daily' && statType.played == 1 && moment.utc(statType.gameDate).unix()*1000 > start_time && moment.utc(statType.gameDate).unix() * 1000 < end_time);
                      currentSport === 'FOOTBALL' ? statType.type == 'weekly' && statType.played == 1 && statType.week == week
                      : statType.type == 'daily' && statType.played == 1 && moment.utc(statType.gameDate).unix() > start_time && moment.utc(statType.gameDate).unix() < end_time}
                  )
                  .map((item) => {
                    console.log("fs " + item.fantasyScore);
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

async function query_nft_tokens_by_id(token_id, contract) {
  const query = JSON.stringify({
    token_id: token_id,
  });

  return provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: contract,
    method_name: 'nft_token_by_id',
    args_base64: Buffer.from(query).toString('base64'),
  });
}


async function query_filter_supply_for_owner(accountId, position, team, name, contract) {
  const query = JSON.stringify({
    account_id: accountId,
    position: position,
    team: team,
    name: name,
  });

  return provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'filtered_nft_supply_for_owner',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      // @ts-ignore:next-line
      const totalAthletes = JSON.parse(Buffer.from(data.result));

      return totalAthletes;
    });
}

async function query_filter_tokens_for_owner(
  accountId,
  athleteOffset,
  athleteLimit,
  position,
  team,
  name,
  contract
) {
  const query = JSON.stringify({
    account_id: accountId,
    from_index: athleteOffset.toString(),
    limit: athleteLimit,
    position: position,
    team: team,
    name: name,
  });

  return await provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'filter_tokens_for_owner',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      const result_two = Promise.all(result.map(convertNftToAthlete).map(getAthleteInfoById));

      return result_two;
    });
}

async function query_player_teams(account, game_id, contract) {
  const query = JSON.stringify({
    account: account,
    game_id: game_id,
  });
  return await provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'get_player_team',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      // @ts-ignore:next-line
      const playerTeamNames = JSON.parse(Buffer.from(data.result));

      return playerTeamNames;
    });
}
async function query_mixed_tokens_pagination(
  accountId,
  isPromoPage,
  athleteOffset,
  promoOffset,
  promoSupply,
  athleteLimit,
  position,
  team,
  name,
  currentSport
) {
  return await query_filter_tokens_for_owner(
    accountId,
    isPromoPage ? athleteOffset + promoOffset : athleteOffset,
    athleteLimit,
    position,
    team,
    name,
    isPromoPage ? getSportType(currentSport).promoContract : getSportType(currentSport).regContract
  ).then(async (result) => {
    if (result.length < athleteLimit && !isPromoPage && promoSupply !== 0) {
      let sbLimit = athleteLimit - result.length;
      let arrayToReturn = await Promise.all(
        await query_filter_tokens_for_owner(
          accountId,
          0,
          sbLimit,
          position,
          team,
          name,
          getSportType(currentSport).promoContract
        )
      ).then((result2) => {
        result2.map((obj) => result.push(obj));
        return result;
      });
      return arrayToReturn;
      // query_filter_tokens_for_owner(
      //   accountId,
      //   0,
      //   sbLimit,
      //   position,
      //   team,
      //   name,
      //   getContract(ATHLETE_PROMO)
      // ).then((result2) => {
      //   result2.map((obj) => result.push(obj));
      //   return result;
      // })
    } else {
      return result;
    }
  });
}
async function query_game_supply(contract) {
  const query = JSON.stringify({});

  return provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'get_total_games',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      // @ts-ignore:next-line
      const totalGames = JSON.parse(Buffer.from(data.result)) + 1;

      return totalGames;
    });
}

async function query_games_list(totalGames, contract) {
  const query = JSON.stringify({
    from_index: 0,
    limit: totalGames,
  });
  return provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: contract,
    method_name: 'get_games',
    args_base64: Buffer.from(query).toString('base64'),
  });
}

function query_nft_supply_for_owner(accountId, contract) {
  const query = JSON.stringify({ account_id: accountId });

  return provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'nft_supply_for_owner',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      //@ts-ignore:next-line
      const total = JSON.parse(Buffer.from(data.result));
      return total;
    });
}

function query_nft_tokens_for_owner(accountId, packOffset, packLimit, contract) {
  const query = JSON.stringify({
    account_id: accountId,
    from_index: packOffset.toString(),
    limit: packLimit,
  });

  return provider.query({
    request_type: 'call_function',
    finality: 'optimistic',
    account_id: contract,
    method_name: 'nft_tokens_for_owner',
    args_base64: Buffer.from(query).toString('base64'),
  });
}

function query_claim_status(accountId, contract) {
  const query = JSON.stringify({
    account_id: accountId,
  });

  return provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: contract,
      method_name: 'check_claim_status',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then((data) => {
      //@ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result));
      return result;
    });
}

async function execute_claim_soulbound_pack(selector, contract) {
  const transferArgs = Buffer.from(
    JSON.stringify({
      msg: 'Claim promo pack',
    })
  );

  const deposit = new BigNumber(MINT_STORAGE_COST).toFixed();

  const action_transfer_call = {
    type: 'FunctionCall',
    params: {
      methodName: 'claim_promo_pack',
      args: transferArgs,
      gas: DEFAULT_MAX_FEES,
      deposit: deposit,
    },
  };

  const wallet = await selector.wallet();
  // @ts-ignore:next-line;
  const tx = wallet.signAndSendTransactions({
    transactions: [
      {
        receiverId: contract,
        //@ts-ignore:next-line
        actions: [action_transfer_call],
      },
    ],
  });
}

export {
  query_game_data,
  query_all_players_lineup,
  query_nft_tokens_by_id,
  query_filter_supply_for_owner,
  query_mixed_tokens_pagination,
  query_filter_tokens_for_owner,
  query_player_teams,
  query_game_supply,
  query_games_list,
  query_nft_supply_for_owner,
  query_nft_tokens_for_owner,
  query_claim_status,
  execute_claim_soulbound_pack,

};
