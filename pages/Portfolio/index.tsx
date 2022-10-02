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

const Portfolio = () => {
  const [searchText, setSearchText] = useState('');
  const [displayMode, setDisplay] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [packLimit, setPackLimit] = useState(10);
  const [packOffset, setPackOffset] = useState(0);
  const [packPageCount, setPackPageCount] = useState(0);
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
  // const walletConnection = useSelector((state) => state.external.playible.wallet.data);
  // const { list } = useSelector((state) => state.assets);

  const { selector, modal, accounts, accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  function query_nft_tokens_for_owner() {
    const query = JSON.stringify({ account_id: accountId, limit: 50 });

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

  const changeIndex = (index) => {
    switch (index) {
      case 'next':
        setOffset(offset + 1);
        break;
      case 'previous':
        setOffset(offset - 1);
        break;
      case 'first':
        setOffset(0);
        break;
      case 'last':
        setOffset(pageCount - 1);
        break;

      default:
        break;
    }
  };

  const changeIndexPack = (index) => {
    switch (index) {
      case 'next':
        setPackOffset(packOffset + 1);
        break;
      case 'previous':
        setPackOffset(packOffset - 1);
        break;
      case 'first':
        setPackOffset(0);
        break;
      case 'last':
        setPackOffset(packPageCount - 1);
        break;

      default:
        break;
    }
  };

  const canNext = () => {
    if (offset + 1 === pageCount) {
      return false;
    } else {
      return true;
    }
  };

  const canNextPack = () => {
    if (packOffset + 1 === packPageCount) {
      return false;
    } else {
      return true;
    }
  };

  const canPrevious = () => {
    if (offset === 0) {
      return false;
    } else {
      return true;
    }
  };

  const canPreviousPack = () => {
    if (packOffset === 0) {
      return false;
    } else {
      return true;
    }
  };

  const applySortFilter = (list, filter, search = '') => {
    let tempList = [...list];

    if (tempList.length > 0) {
      let filteredList = tempList.filter(
        (item) =>
          item.token_info.info.extension.attributes
            .filter((data) => data.trait_type === 'name')[0]
            .value.toLowerCase()
            .indexOf(search.toLowerCase()) > -1
      );
      switch (filter) {
        case 'name':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'name')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'name'
                )[0].value
              )
          );
          return filteredList;
        case 'team':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'team')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'team'
                )[0].value
              )
          );
          return filteredList;
        case 'position':
          filteredList.sort((a, b) =>
            a.token_info.info.extension.attributes
              .filter((data) => data.trait_type === 'position')[0]
              .value.localeCompare(
                b.token_info.info.extension.attributes.filter(
                  (data) => data.trait_type === 'position'
                )[0].value
              )
          );
          return filteredList;
        default:
          return filteredList;
      }
    } else {
      return tempList;
    }
  };

  const resetFilters = (type = 'athlete') => {
    if (type === 'pack') {
      setPackOffset(0);
    } else {
      setOffset(0);
    }
  };

  useEffect(() => {
    query_nft_tokens_for_owner();
    setSortedList([]);
  }, [dispatch]);

  useEffect(() => {}, [limit, offset, filter, search]);

  useEffect(() => {}, [packs, packLimit, packOffset]);

  return (
    // <Container activeName="SQUAD">
    //   <div className="flex flex-col w-full overflow-y-auto h-screen justify-center self-center md:pb-12">
    //     <Main color="indigo-white">
    //         <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden h-full self-center text-indigo-black">
    //           <div className="ml-6 flex flex-col md:flex-row md:justify-between">
    //             <PortfolioContainer title="SQUAD" textcolor="text-indigo-black" />
    //             {playerList &&
    //             (sortedList.length > 0 || playerList.tokens.length > 0) &&
    //             displayMode ? (
    //               <Sorter
    //                 list={sortedList}
    //                 setList={setSortedList}
    //                 resetOffset={() => setOffset(0)}
    //                 setSearchText={setSearch}
    //                 filterValue={filter}
    //                 filterHandler={(val) => setFilter(val)}
    //               />
    //             ) : (
    //               ''
    //             )}
    //           </div>
    //           <div className="flex flex-col w-full">
    //             <div className="justify-center self-center w-full md:mt-4">
    //               {displayMode ? (
    //                 <>
    //                   <div className="flex md:ml-4 font-bold ml-8 font-monument">
    //                     <div className="mr-6 md:ml-8 border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
    //                       ATHLETES
    //                     </div>

    //                     <div
    //                       className="cursor-pointer"
    //                       onClick={() => {
    //                         setDisplay(false);
    //                         setFilter(null);
    //                         resetFilters();
    //                       }}
    //                     >
    //                       PACKS
    //                     </div>
    //                   </div>
    //                   <hr className="opacity-50" />
    //                   {sortedList.length > 0 ? (
    //                     <>
    //                       <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
    //                         {sortedList.map(function (player, i) {
    //                           const path = player.token_info.info.extension;
    //                           return (
    //                             <Link
    //                               href={{
    //                                 pathname: '/AssetDetails',
    //                                 query: {
    //                                   id: path.attributes.filter(
    //                                     (item) => item.trait_type === 'athlete_id'
    //                                   )[0].value,
    //                                   origin: 'Portfolio',
    //                                   token_id: player.token_id,
    //                                 },
    //                               }}
    //                             >
    //                               <div className="mb-4" key={i}>
    //                                 <PerformerContainer
    //                                   AthleteName={
    //                                     path.attributes.filter(
    //                                       (item) => item.trait_type === 'name'
    //                                     )[0].value
    //                                   }
    //                                   AvgScore={player.fantasy_score}
    //                                   id={
    //                                     path.attributes.filter(
    //                                       (item) => item.trait_type === 'athlete_id'
    //                                     )[0].value
    //                                   }
    //                                   uri={
    //                                     player.nft_image || player.token_info
    //                                       ? player.nft_image
    //                                       : null
    //                                   }
    //                                   rarity={path.rarity}
    //                                   status={player.is_locked}
    //                                 />
    //                               </div>
    //                             </Link>
    //                           );
    //                         })}
    //                       </div>
    //                       <div className="flex justify-between md:mt-5 mb-12 md:mr-6 p-5 mx-10">
    //                         <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
    //                           {pageCount > 1 && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndex('first')}
    //                             >
    //                               First
    //                             </button>
    //                           )}
    //                           {pageCount !== 0 && canPrevious() && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndex('previous')}
    //                             >
    //                               Previous
    //                             </button>
    //                           )}
    //                           <p className="mr-2">
    //                             Page {offset + 1} of {pageCount}
    //                           </p>
    //                           {pageCount !== 0 && canNext() && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndex('next')}
    //                             >
    //                               Next
    //                             </button>
    //                           )}
    //                           {pageCount > 1 && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndex('last')}
    //                             >
    //                               Last
    //                             </button>
    //                           )}
    //                         </div>
    //                         <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
    //                           <select
    //                             value={limit}
    //                             className="bg-indigo-white text-lg w-full outline-none"
    //                             onChange={(e) => {
    //                               // setLimit(e.target.value);
    //                               setOffset(0);
    //                             }}
    //                           >
    //                             {limitOptions.map((option) => (
    //                               <option value={option}>{option}</option>
    //                             ))}
    //                           </select>
    //                         </div>
    //                       </div>
    //                     </>
    //                   ) : (
    //                     <div className="mt-7 ml-7 text-xl">There are no assets to show</div>
    //                   )}
    //                 </>
    //               ) : (
    //                 <div>
    //                   <div className="flex md:ml-4 font-bold ml-8 font-monument">
    //                     <div
    //                       className="md:ml-8 mr-6 cursor-pointer"
    //                       onClick={() => {
    //                         setDisplay(true);
    //                         resetFilters('pack');
    //                       }}
    //                     >
    //                       ATHLETES
    //                     </div>

    //                     <div className="border-b-8 pb-2 border-indigo-buttonblue cursor-pointer">
    //                       PACKS
    //                     </div>
    //                   </div>
    //                   <hr className="opacity-50" />

    //                   {sortedPacks.length > 0 ? (
    //                     <>
    //                       <div className="grid grid-cols-2 md:grid-cols-4 mt-12">
    //                         {athletes.map(({ metadata, token_id }) => (
    //                           <PackComponent image={metadata.media} id={token_id}></PackComponent>
    //                         ))}
    //                         {sortedPacks.map((data, i) => {
    //                           const path = data.token_info.info.extension;
    //                           return (
    //                             <div className="mb-4 cursor-pointer" key={i}>
    //                               <SquadPackComponent
    //                                 imagesrc={null}
    //                                 PackName={path.name}
    //                                 releaseValue={
    //                                   path.attributes.filter(
    //                                     (item) => item.trait_type === 'release'
    //                                   )[0].value[1]
    //                                 }
    //                                 link={`?token_id=${data.token_id}&origin=Portfolio`}
    //                                 type={
    //                                   path.attributes.filter(
    //                                     (item) => item.trait_type === 'pack_type'
    //                                   )[0].value
    //                                 }
    //                               />
    //                             </div>
    //                           );
    //                         })}
    //                       </div>
    //                       <div className="flex justify-between md:mt-5 mb-12 md:mr-6 p-5 mx-10">
    //                         <div className="bg-indigo-white mr-1 h-11 flex items-center font-thin border-indigo-lightgray border-opacity-40 p-2">
    //                           {packPageCount > 1 && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndexPack('first')}
    //                             >
    //                               First
    //                             </button>
    //                           )}
    //                           {packPageCount !== 0 && canPreviousPack() && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndexPack('previous')}
    //                             >
    //                               Previous
    //                             </button>
    //                           )}
    //                           <p className="mr-2">
    //                             Page {packOffset + 1} of {packPageCount}
    //                           </p>
    //                           {packPageCount !== 0 && canNextPack() && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndexPack('next')}
    //                             >
    //                               Next
    //                             </button>
    //                           )}
    //                           {packPageCount > 1 && (
    //                             <button
    //                               className="px-2 border mr-2"
    //                               onClick={() => changeIndexPack('last')}
    //                             >
    //                               Last
    //                             </button>
    //                           )}
    //                         </div>
    //                         <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40 p-2">
    //                           <select
    //                             value={packLimit}
    //                             className="bg-indigo-white text-lg w-full outline-none"
    //                             onChange={(e) => {
    //                               // setPackLimit(e.target.value)
    //                               setPackOffset(0);
    //                             }}
    //                           >
    //                             {limitOptions.map((option) => (
    //                               <option value={option}>{option}</option>
    //                             ))}
    //                           </select>
    //                         </div>
    //                       </div>
    //                     </>
    //                   ) : (
    //                     <div className="mt-7 ml-7 text-xl">There are no packs to show</div>
    //                   )}
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </Main>
    //   </div>
    // </Container>

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
            <div className="absolute bottom-10 right-10"></div>
          </div>
        </Main>
      </div>
    </Container>
  );
};
export default Portfolio;
