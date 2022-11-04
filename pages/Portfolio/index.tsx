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

import filterIcon from '../../public/images/filterBlack.png';
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
import Select from 'react-select';
import { isCompositeType } from 'graphql';

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

  const [filteredTotal, setFilteredTotal] = useState(30);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [athleteList, setAthleteList] = useState([]);
  
  const [currPosition, setCurrPosition] = useState("");
  const [position, setPosition] = useState("allPos");

  const [remountComponent, setRemountComponent] = useState(0);
  // const listQB = athletes.filter(athlete => athlete.position === "QB");
  // const listRB = athletes.filter(athlete => athlete.position === "RB");
  // const listWR = athletes.filter(athlete => athlete.position === "WR");
  // const listTE = athletes.filter(athlete => athlete.position === "TE");
  // const walletConnection = useSelector((state) => state.external.playible.wallet.data);
  // const { list } = useSelector((state) => state.assets);

  const { accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  // function getAthleteList() {
  //   if (isFiltered) {
  //     if (filterOption.length == 0)
  //     {
  //       return listQB;
  //     }
  //     if (filterOption == "QB") {
  //       return listQB;
  //     }
  //     if (filterOption == "RB") {
  //       return listRB;
  //     }
  //     if (filterOption == "WR") {
  //       return listWR;
  //     }
  //     if (filterOption == "TE") {
  //       return listTE;
  //     }
  //   }
  // }

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

  function query_nft_supply_for_owner(position) {
    const query = JSON.stringify({ account_id: accountId, position: position });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'filtered_nft_supply_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        // @ts-ignore:next-line
        const totalAthletes = JSON.parse(Buffer.from(data.result));

        setTotalAthletes(totalAthletes);
      });
  }

  function handleDropdownChange(position){
    setAthleteOffset(0);
    setAthleteLimit(10);
    setPosition(position);
    setRemountComponent(Math.random());
  }
  function query_nft_tokens_for_owner(position) {
    const query = JSON.stringify({
      account_id: accountId,
      from_index: athleteOffset.toString(),
      limit: athleteLimit,
      position: position,
    });
    
    provider
    .query({
      request_type: 'call_function',
      finality: 'optimistic',
      account_id: getContract(ATHLETE),
      method_name: 'filter_tokens_by_position',
      args_base64: Buffer.from(query).toString('base64'),
    })
    .then(async (data) => {
      // @ts-ignore:next-line
      const result = JSON.parse(Buffer.from(data.result).toString());
      const result_two = await Promise.all(
        result.map(convertNftToAthlete).map(getAthleteInfoById)
      );

      // const sortedResult = sortByKey(result_two, 'fantasy_score');
      setCurrPosition(position)
      setAthletes(result_two);
      setLoading(false);
    });
    
    
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * athleteLimit) % totalAthletes;
    setAthleteOffset(newOffset);
  };

  

  useEffect(() => {
    if(!isNaN(athleteOffset)){
      console.log("loading");
      query_nft_supply_for_owner(position);
      //getAthleteLimit();
      // setAthleteList(getAthleteList());
      setPageCount(Math.ceil(totalAthletes / athleteLimit));
      const endOffset = athleteOffset + athleteLimit;
      console.log(`Loading athletes from ${athleteOffset} to ${endOffset}`);
      query_nft_tokens_for_owner(position);
    }
    
    // setSortedList([]);
  }, [totalAthletes, athleteLimit, athleteOffset, position]);

  //[dispatch]

  useEffect(() => {}, [limit, offset, filter, search]);

  //filtering functions
  // async function checkIfFiltered() {
  //   try {
  //     if (filterOption != "All Positions") {
  //       setIsFiltered(true);
  //     }
  //   } catch (e) {
  //     setIsFiltered(false);
  //   }
  // }

  // function selectFilter() {
  //   const filterOptions = ["All Positions", "QB", "RB", "WR", "TE"];
  //   let filterList = [];
  //   filterOptions.forEach(function(element) {
  //     filterList.push({ label:element, value: element})
  //   });
  //   return (
  //     <>
  //       <Select
  //         onChange={(event) => setFilterOption(event.value)}
  //         options={filterList}
  //         className="md:w-1/5"
  //       />
  //     </>
  //   );
  // }

  //   function sortByKey(athletes, key) {
  //     return athletes.sort(function(a, b) {
  //         const x = a[key];
  //         const y = b[key];
  //         return (
  //           (x < y) ? 1 : ((x > y) ? -1 : 0)
  //         );
  //     });
  // }

  // console.log("sorted id: " + JSON.stringify(sortedAthletes));

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
        <Main color="indigo-white">
          {totalAthletes}
          <div className="flex flex-row h-8">
                <div className="bg-indigo-white h-8 flex justify-between self-center 
                    font-thin w-72 mt-6 border-2 border-indigo-lightgray border-opacity-50">
                    <form>
                      <select onChange={(e) => handleDropdownChange(e.target.value)} className="filter-select bg-white">
                        <option value="allPos">
                          ALL
                        </option>
                        <option value="QB">
                          QB
                        </option>
                        <option value="RB">
                          RB
                        </option>
                        <option value="WR">
                          WR
                        </option>
                        <option value="TE">
                          TE
                        </option>
                      </select>
                    </form>
                    {/* <form>
                      <select onChange={(e) => console.log(e)} className="filter-select bg-white">
                        <option value="allTeams">
                          ALL
                        </option>
                        <option value="TEN">
                          Tennessee
                        </option>
                      </select>
                    </form> */}

                    

                    <img src={filterIcon} className="object-none w-4 mr-4" />
                </div>
                <div className="bg-indigo-white h-8 flex justify-between center w-72 mt-3 font-thin border-2 border-indigo-lightgray border-opacity-50 ml-3">
                    <form>
                      <select onChange={(e) => console.log(e)} className="filter-select bg-white">
                        <option value="allTeams">
                          ALL
                        </option>
                        <option value="TEN">
                          Tennessee
                        </option>
                      </select>
                    </form>
                </div>
                <div className="bg-indigo-white pl-8 h-8 flex justify-between center mt-3 w-96">
                    <form>   
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                        <div className="relative">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""/>
                            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>
                </div>
              </div>

          <div className="md:ml-6">
            <PortfolioContainer textcolor="indigo-black" title="SQUAD">
              <div className="flex flex-col">
                {loading ? (
                  <LoadingPageDark />
                ) : (
                  <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:ml-7 md:mt-12">
                    {athletes.map((item) => {
                      const accountAthleteIndex = athletes.indexOf(item, 0) + athleteOffset;
                      return (
                        <PerformerContainer
                          key={item.athlete_id}
                          AthleteName={item.name}
                          AvgScore={item.fantasy_score.toFixed(2)}
                          id={item.athlete_id}
                          uri={item.image}
                          index={accountAthleteIndex}
                          athletePosition={item.position}
                          // rarity={path.rarity}
                          // status={player.is_locked}
                        ></PerformerContainer>
                      );
                    })}
                  </div>
                )}
              </div>
            </PortfolioContainer>
            <div className="absolute bottom-10 right-10 iphone5:bottom-4 iphone5:right-2 iphone5:fixed iphoneX:bottom-4 iphoneX:right-4 iphoneX-fixed">
                <div key={remountComponent}>
                  <ReactPaginate
                    className="p-2 bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
                    pageClassName="hover:font-bold"
                    activeClassName="rounded-lg bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
                    pageLinkClassName="rounded-lg hover:font-bold hover:bg-indigo-white hover:text-indigo-black pr-1 pl-1"
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                  />
                </div>
                
            </div>
            <div className="absolute bottom-10 right-10"></div>
          </div>
        </Main>
      </div>
    </Container>
  );
};
export default Portfolio;
