import React, { useEffect, useState } from 'react';
import Main from '../../components/Main';
import PortfolioContainer from '../../components/containers/PortfolioContainer';
import PerformerContainer from '../../components/containers/PerformerContainer';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPageDark from '../../components/loading/LoadingPageDark';
import Link from 'next/link';
import SquadPackComponent from '../../components/SquadPackComponent';
import Container from '../../components/containers/Container';
import Sorter from './components/Sorter';

import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import { PACK } from '../../data/constants/nearContracts';
import { axiosInstance } from '../../utils/playible';
import 'regenerator-runtime/runtime';
import { ProvidedRequiredArgumentsOnDirectivesRule } from 'graphql/validation/rules/ProvidedRequiredArgumentsRule';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { ATHLETE } from 'data/constants/nearContracts';
import PackComponent from 'pages/Packs/components/PackComponent';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';
import ReactPaginate from 'react-paginate';

const Portfolio = () => {
  const [searchText, setSearchText] = useState('');
  const [displayMode, setDisplay] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  // const [pageCount, setPageCount] = useState(0);
  // const [packLimit, setPackLimit] = useState(10);
  // const [packOffset, setPackOffset] = useState(0);
  // const [packPageCount, setPackPageCount] = useState(0);
  const [wallet, setWallet] = useState(null);

  const dispatch = useDispatch();
  const [sortedList, setSortedList] = useState([]);
  const [packs, setPacks] = useState([]);
  const [sortedPacks, setSortedPacks] = useState([]);
  const limitOptions = [5, 10, 30, 50];
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [playerList, setPlayerList] = useState(null);
  const [athletes, setAthletes] = useState([]);

  const [athleteCount, setAthleteCount] = useState(0);
  const [athleteOffset, setAthleteOffset] = useState(0);
  const [athleteLimit, setAthleteLimit] = useState(10);
  const [totalAthletes, setTotalAthletes] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [packOffset, setPackOffset] = useState(0);
  const [packLimit, setPackLimit] = useState(30);
  // const walletConnection = useSelector((state) => state.external.playible.wallet.data);
  // const { list } = useSelector((state) => state.assets);

  const { selector, modal, accounts, accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  function query_nft_supply_for_owner() {
    const query = JSON.stringify({ account_id: accountId });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'nft_supply_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const totalAthletes = JSON.parse(Buffer.from(data.result));

        setTotalAthletes(totalAthletes);
      })
  }

  function getAthleteLimit() {
    try {
      if (totalAthletes > 30) {
        const _athleteLimit = 15;
        console.log('Reloading packs');
        setAthleteLimit(_athleteLimit);
      }
    } catch (e) {
      setAthleteLimit(30);
    }
  }

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({ account_id: accountId, from_index: athleteOffset.toString(), limit: athleteLimit });

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

        setAthletes(await Promise.all(result.map(convertNftToAthlete).map(getAthleteInfoById)));
        setLoading(false);
      });
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * athleteLimit) % totalAthletes;
    setAthleteOffset(newOffset);
  }

  // const applySortFilter = (list, filter, search = '') => {
  //   let tempList = [...list];

  //   if (tempList.length > 0) {
  //     let filteredList = tempList.filter(
  //       (item) =>
  //         item.token_info.info.extension.attributes
  //           .filter((data) => data.trait_type === 'name')[0]
  //           .value.toLowerCase()
  //           .indexOf(search.toLowerCase()) > -1
  //     );
  //     switch (filter) {
  //       case 'name':
  //         filteredList.sort((a, b) =>
  //           a.token_info.info.extension.attributes
  //             .filter((data) => data.trait_type === 'name')[0]
  //             .value.localeCompare(
  //               b.token_info.info.extension.attributes.filter(
  //                 (data) => data.trait_type === 'name'
  //               )[0].value
  //             )
  //         );
  //         return filteredList;
  //       case 'team':
  //         filteredList.sort((a, b) =>
  //           a.token_info.info.extension.attributes
  //             .filter((data) => data.trait_type === 'team')[0]
  //             .value.localeCompare(
  //               b.token_info.info.extension.attributes.filter(
  //                 (data) => data.trait_type === 'team'
  //               )[0].value
  //             )
  //         );
  //         return filteredList;
  //       case 'position':
  //         filteredList.sort((a, b) =>
  //           a.token_info.info.extension.attributes
  //             .filter((data) => data.trait_type === 'position')[0]
  //             .value.localeCompare(
  //               b.token_info.info.extension.attributes.filter(
  //                 (data) => data.trait_type === 'position'
  //               )[0].value
  //             )
  //         );
  //         return filteredList;
  //       default:
  //         return filteredList;
  //     }
  //   } else {
  //     return tempList;
  //   }
  // };

  // const resetFilters = (type = 'athlete') => {
  //   if (type === 'pack') {
  //     setPackOffset(0);
  //   } else {
  //     setOffset(0);
  //   }
  // };

  useEffect(() => {
    query_nft_supply_for_owner();
    getAthleteLimit();
    setPageCount(Math.ceil(totalAthletes / athleteLimit));
    const endOffset = athleteOffset + athleteLimit;
    console.log(`Loading athletes from ${athleteOffset} to ${endOffset}`);
    query_nft_tokens_for_owner();
    // setSortedList([]);
  }, [totalAthletes, athleteLimit, athleteOffset]);

  //[dispatch]

  useEffect(() => {}, [limit, offset, filter, search]);

  return (

    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
        <Main color="indigo-white">
          <div className="md:ml-6">
            <PortfolioContainer textcolor="indigo-black" title="SQUAD">
              <div className="flex flex-col">
                {loading ? (
                  <LoadingPageDark />
                ) : (
                  <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                    {athletes.map((item) => {
                      return (
                        <PerformerContainer
                          key={item.athlete_id}
                          AthleteName={item.name}
                          AvgScore={item.fantasy_score}
                          id={item.athlete_id}
                          uri={item.image}
                          // rarity={path.rarity}
                          // status={player.is_locked}
                        ></PerformerContainer>
                      );
                    })}
                  </div>
                )}
              </div>
            </PortfolioContainer>
              <div className="absolute bottom-10 right-10">
              <ReactPaginate
                className="p-2 bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
                pageClassName="hover:font-bold"
                activeClassName="rounded-lg bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
                pageLinkClassName="rounded-lg hover:font-bold hover:bg-indigo-white hover:text-indigo-black pr-1 pl-1"
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< prev"
                renderOnZeroPageCount={null}
              />
              </div>
            <div className="absolute bottom-10 right-10"></div>
          </div>
        </Main>
      </div>
    </Container>
  );
};
export default Portfolio;
