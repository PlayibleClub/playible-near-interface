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
import { query_filter_supply_for_owner, query_filter_tokens_for_owner } from 'utils/near/helper';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { isCompositeType } from 'graphql';
import { useRef } from 'react';
import { current } from '@reduxjs/toolkit';

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

  const [currPosition, setCurrPosition] = useState('');
  const [position, setPosition] = useState(['allPos']);
  const [team, setTeam] = useState(['allTeams']);
  const [name, setName] = useState(['allNames']);

  const [remountComponent, setRemountComponent] = useState(0);

  const { accountId } = useWalletSelector();

  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

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

  async function get_filter_supply_for_owner(accountId, position, team, name) {
    console.log(accountId)
    setTotalAthletes(await query_filter_supply_for_owner(accountId, position, team, name));
  }

  function handleDropdownChange() {
    setAthleteOffset(0);
    setAthleteLimit(10);
    setRemountComponent(Math.random());
  }

  function get_filter_tokens_for_owner(accountId, athleteOffset, athleteLimit, position, team, name) {
    query_filter_tokens_for_owner(accountId, athleteOffset, athleteLimit, position, team, name)
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        const result_two = await Promise.all(
          result.map(convertNftToAthlete).map(getAthleteInfoById)
        );

        // const sortedResult = sortByKey(result_two, 'fantasy_score');
        setCurrPosition(position);
        setAthletes(result_two);
        setLoading(false);
      });

  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * athleteLimit) % totalAthletes;
    setAthleteOffset(newOffset);
  };

  useEffect(() => {
    if (!isNaN(athleteOffset)) {
      console.log("loading");
      get_filter_supply_for_owner(accountId, position, team, name);
      //getAthleteLimit();
      // setAthleteList(getAthleteList());
      setPageCount(Math.ceil(totalAthletes / athleteLimit));
      const endOffset = athleteOffset + athleteLimit;
      console.log(`Loading athletes from ${athleteOffset} to ${endOffset}`);
      get_filter_tokens_for_owner(accountId, athleteOffset, athleteLimit, position, team, name);
    }

    // setSortedList([]);
  }, [totalAthletes, athleteLimit, athleteOffset, position, team, name]);

  useEffect(() => { }, [limit, offset, filter, search]);

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen pb-12 mb-12">
        <Main color="indigo-white">
          <div className="flex flex-row h-8 mt-24 md:mt-0">
            <div className="h-8 md:ml-10 lg:ml-12 flex justify-between mt-3">
              <form>
                <select
                  onChange={(e) => {
                    handleDropdownChange();
                    setPosition([e.target.value]);
                  }}
                  className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white iphone5:w-28 w-36 md:w-42 lg:w-60
                      ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                      focus:outline-none cursor-pointer text-xs md:text-base"
                >
                  <option value="allPos">ALL POSITIONS</option>
                  <option value="QB">QUARTER BACK</option>
                  <option value="RB">RUNNING BACK</option>
                  <option value="WR">WIDE RECEIVER</option>
                  <option value="TE">TIGHT END</option>
                </select>
              </form>

            </div>
            <div className="h-8 flex justify-between mt-3 ml-4 md:ml-12">
              <form>
                <select
                  onChange={(e) => {
                    handleDropdownChange();
                    setTeam([e.target.value]);
                  }}
                  className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white iphone5:w-28 w-36 md:w-42 lg:w-60
                      ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                      focus:outline-none cursor-pointer text-xs md:text-base"
                >
                  <option value="allTeams">ALL TEAMS</option>
                  <option value="ARI">Arizona</option>
                </select>
              </form>
            </div>

            <div className="h-8 flex justify-between mt-3 md:ml-24 lg:ml-80">
              <form
                onSubmit={(e) => {
                  handleDropdownChange();
                  search == '' ? setName(['allNames']) : setName([search]);
                  e.preventDefault();
                }}
              >
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300 lg:w-80">
                  Search
                </label>
                <div className="relative lg:ml-72">
                  <input
                    type="search"
                    id="default-search"
                    onChange={(e) => setSearch(e.target.value)}
                    className=" bg-indigo-white w-36 ml-4 pl-2 iphone5:w-36 md:w-60 lg:w-72 text-xs md:text-base
                            ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                            focus:outline-none"
                    placeholder="Search Athlete"
                  />
                  <button
                    type="submit"
                    className="invisible md:visible bg-search-icon bg-no-repeat bg-center absolute -right-12 bottom-0 h-full
                            pl-6 py-2 ring-2 ring-offset-4 ring-indigo-black ring-opacity-25
                            focus:ring-2 focus:ring-indigo-black"
                  ></button>
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
                  <div className="grid grid-cols-4 gap-y-8 mt-4 md:grid-cols-4 md:mt-4">
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
                          isInGame={item.isInGame}
                          fromPortfolio={true}
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
