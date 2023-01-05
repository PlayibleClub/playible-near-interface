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
import SearchComponent from 'components/SearchComponent';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import { PACK_NFL } from '../../data/constants/nearContracts';
import { axiosInstance } from '../../utils/playible';
import 'regenerator-runtime/runtime';
import { ProvidedRequiredArgumentsOnDirectivesRule } from 'graphql/validation/rules/ProvidedRequiredArgumentsRule';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { ATHLETE_NFL, ATHLETE_PROMO_NFL } from 'data/constants/nearContracts';
import PackComponent from 'pages/Packs/components/PackComponent';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';
import {
  query_filter_supply_for_owner,
  query_filter_tokens_for_owner,
  query_mixed_tokens_pagination,
} from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { isCompositeType } from 'graphql';
import { useRef } from 'react';
import { current } from '@reduxjs/toolkit';
import NftTypeComponent from './components/NftTypeComponent';
import { getAthleteLineup, getIndex } from 'redux/athlete/athleteSlice';
import { GET_ATHLETE_BY_ID } from 'utils/queries';
import { SPORT_TYPES } from 'data/constants/sportConstants';

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
  const [loading, setLoading] = useState(false);
  const [playerList, setPlayerList] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [selectedRegular, setSelectedRegular] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(false);
  const [athleteCount, setAthleteCount] = useState(0);
  const [athleteOffset, setAthleteOffset] = useState(0);
  const [athleteLimit, setAthleteLimit] = useState(10);
  const [totalRegularSupply, setTotalRegularSupply] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [promoOffset, setPromoOffset] = useState(0);
  const [isPromoPage, setIsPromoPage] = useState(false);
  const [totalPromoSupply, setTotalPromoSupply] = useState(0);
  const index = useSelector(getIndex);
  const [currentPage, setCurrentPage] = useState(0);

  const [filteredTotal, setFilteredTotal] = useState(30);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterOption, setFilterOption] = useState('');
  const [athleteList, setAthleteList] = useState([]);
  const [currPosition, setCurrPosition] = useState('');
  const [position, setPosition] = useState(['allPos']);
  const [team, setTeam] = useState(['allTeams']);
  const [name, setName] = useState(['allNames']);
  const [remountComponent, setRemountComponent] = useState(0);
  const [remountAthlete, setRemountAthlete] = useState(0);
  const { accountId } = useWalletSelector();
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  const [positionList, setPositionList] = useState(SPORT_TYPES[0].positionList);
  const sportObj = SPORT_TYPES.map((x) => ({ name: x.sport, isActive: false }));
  sportObj[0].isActive = true;
  const [categoryList, setCategoryList] = useState([...sportObj]);
  const [currentSport, setCurrentSport] = useState(sportObj[0].name);
  // const [contractList, setContractList] = useState([
  //   {
  //     name: 'FOOTBALL',
  //     regContract: getContract(ATHLETE),
  //     promoContract: getContract(ATHLETE_PROMO),
  //   },
  //   {
  //     name: 'BASKETBALL',
  //     regContract: getContract(ATHLETE),
  //     promoContract: getContract(ATHLETE_PROMO),
  //   },
  // ]);

  const changeCategoryList = (name) => {
    const tabList = [...categoryList];
    tabList.forEach((item) => {
      if (item.name === name) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
    setCategoryList([...tabList]);
    setCurrentSport(name);
  };
  function getAthleteLimit() {
    try {
      if (totalRegularSupply > 30) {
        const _athleteLimit = 15;
        console.log('Reloading packs');
        setAthleteLimit(_athleteLimit);
      }
    } catch (e) {
      setAthleteLimit(30);
    }
  }

  async function get_filter_soulbound_supply_for_owner() {
    setTotalPromoSupply(
      await query_filter_supply_for_owner(
        accountId,
        position,
        team,
        name,
        getSportType(currentSport).promoContract
      )
    );
  }

  async function get_filter_supply_for_owner() {
    setTotalRegularSupply(
      await query_filter_supply_for_owner(
        accountId,
        position,
        team,
        name,
        getSportType(currentSport).regContract
      )
    );
  }

  function handleDropdownChange() {
    setAthleteOffset(0);
    setAthleteLimit(10);
    setRemountComponent(Math.random());
  }

  async function get_mixed_tokens_for_pagination() {
    await query_mixed_tokens_pagination(
      accountId,
      isPromoPage,
      athleteOffset,
      promoOffset,
      totalPromoSupply,
      athleteLimit,
      position,
      team,
      name,
      currentSport
    ).then((result) => {
      setAthletes(result);
    });
  }

  async function get_filter_tokens_for_owner(contract) {
    setAthletes(
      await query_filter_tokens_for_owner(
        accountId,
        athleteOffset,
        athleteLimit,
        position,
        team,
        name,
        contract
      )
    );
  }

  const mixedPaginationHandling = (e) => {
    let newOffset;
    if (e.selected * athleteLimit >= totalRegularSupply) {
      let offset;
      if (
        athleteLimit - totalRegularSupply < 0 &&
        (athleteLimit - totalRegularSupply) % athleteLimit !== 0
      ) {
        offset = ((athleteLimit - totalRegularSupply) % athleteLimit) + athleteLimit;
      } else offset = (athleteLimit - totalRegularSupply) % athleteLimit;
      let extra = 0;
      if (totalPromoSupply >= offset + athleteLimit + 1) extra = 1;
      newOffset = Math.abs(Math.abs(e.selected + 1 - pageCount) - extra) * athleteLimit;
      setPromoOffset(offset);
      setIsPromoPage(true);
    } else {
      setIsPromoPage(false);
      newOffset = (e.selected * athleteLimit) % totalRegularSupply;
    }
    setAthleteOffset(newOffset);
    setCurrentPage(e.selected);
  };

  useEffect(() => {
    setAthleteOffset(0);
    setRemountComponent(Math.random());
  }, [selectedRegular, selectedPromo]);

  useEffect(() => {
    //if regular and soulbound radio buttons are enabled
    if (selectedRegular !== false && selectedPromo === false) {
      get_filter_tokens_for_owner(getSportType(currentSport).regContract);
    } else if (selectedRegular === false && selectedPromo !== false) {
      get_filter_tokens_for_owner(getSportType(currentSport).promoContract);
    } else if (selectedRegular !== false && selectedPromo !== false) {
      get_mixed_tokens_for_pagination();
    } else {
      setAthletes([]);
    }
  }, [totalRegularSupply, totalPromoSupply, athleteOffset, currentPage]);

  const handleSearchDynamic = (value) => {
    setName(value);
  };
  const handleSearchSubmit = (value) => {
    handleDropdownChange();
    setName(value);
  };
  const handlePageClick = (event) => {
    let total = selectedRegular ? totalRegularSupply : selectedPromo ? totalPromoSupply : 0;
    const newOffset = (event.selected * athleteLimit) % total;
    setAthleteOffset(newOffset);
    setCurrentPage(event.selected);
  };
  // const startCountdown = (value) => {
  //   setSearch(value);
  //   setCountdown(1);
  //   //setIsTyping(true);
  // }
  useEffect(() => {
    setAthleteOffset(0);
    setRemountComponent(Math.random());
  }, [selectedRegular, selectedPromo]);
  useEffect(() => {
    setRemountAthlete(Math.random() + 1);
  }, [athletes]);
  useEffect(() => {
    if (selectedRegular !== false && selectedPromo === false) {
      get_filter_supply_for_owner();
      setTotalPromoSupply(0);
    } else if (selectedRegular === false && selectedPromo !== false) {
      get_filter_soulbound_supply_for_owner();
      setTotalRegularSupply(0);
    } else if (selectedRegular !== false && selectedPromo !== false) {
      get_filter_supply_for_owner();
      get_filter_soulbound_supply_for_owner();
    } else {
      setTotalRegularSupply(0);
      setTotalPromoSupply(0);
    }
    setPageCount(Math.ceil((totalRegularSupply + totalPromoSupply) / athleteLimit));
    //setup regular_offset, soulbound_offset
  }, [
    position,
    team,
    name,
    totalRegularSupply,
    totalPromoSupply,
    selectedRegular,
    selectedPromo,
    currentSport,
  ]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setName([search]);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    //getting positionList value from sportConstants
    const list = SPORT_TYPES.find((x) => x.sport === currentSport);

    setPositionList(list.positionList);
  }, [currentSport]);
  useEffect(() => {}, [limit, offset, filter, search, selectedRegular, selectedPromo]);

  return (
    <Container activeName="SQUAD">
      <div className="flex flex-col w-full overflow-y-auto h-screen">
        <Main color="indigo-white">
          <div className="flex flex-row h-8 mt-24 justify-end md:mt-0">
            {/* <div className="h-8 flex justify-between mt-3 ml-4 md:ml-12">
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
            </div> */}
            {/* <div className="h-8 flex mt-3">
              <SportType sportTypes={SPORT_TYPES} />
            </div> */}
            {/* <div className="flex mt-15 md:mr-20">
              <SearchComponent
                onChangeFn={(search) => handleSearchDynamic(search)}
                onSubmitFn={(search) => handleSearchSubmit(search)}
              />
            </div> */}

            {/* <div className="h-8 flex justify-between mt-3 md:ml-24 lg:ml-80">
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
                    onChange={(e) => setSearch(e.target.value !== "" ? e.target.value : "allNames")}
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
            </div> */}
          </div>
          {/* <div className="md:pt-20 z-0">
                <NftTypeComponent
                  onChangeFn={(selectedRegular, selectedPromo) => {
                    setSelectedRegular(selectedRegular);
                    setSelectedPromo(selectedPromo);
                    setRemountComponent(Math.random());
                  }}
                />
          </div> */}
          <div className="md:ml-6 overflow-x-hidden">
            <PortfolioContainer
              textcolor="indigo-black"
              title="SQUAD"
              searchbar={
                <SearchComponent
                  onChangeFn={(search) => handleSearchDynamic(search)}
                  onSubmitFn={(search) => handleSearchSubmit(search)}
                />
              }
            >
              {/* <div className="flex justify-end">
                <div className="flex md:mr-20">
                  <SearchComponent
                    onChangeFn={(search) => handleSearchDynamic(search)}
                    onSubmitFn={(search) => handleSearchSubmit(search)}
                  />
                </div>
              </div> */}
              <div className="flex font-bold max-w-full ml-5 md:ml-6 font-monument ">
                {categoryList.map(({ name, isActive }) => (
                  <div
                    className={`cursor-pointer mr-6 ${
                      isActive ? 'border-b-8 border-indigo-buttonblue' : ''
                    }`}
                    onClick={() => {
                      changeCategoryList(name);
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
              <hr className="opacity-10 iphone5:w-screen md:w-auto" />
              <div className="md:mt-4 font-normal">
                <div className="float-left h-8 ml-7 md:ml-10 lg:ml-12 flex justify-between mt-3">
                  <form>
                    <select
                      onChange={(e) => {
                        handleDropdownChange();
                        setPosition([e.target.value]);
                      }}
                      className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white iphone5:w-36 w-36 md:w-42 lg:w-60
                      ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                      focus:outline-none cursor-pointer text-xs md:text-base"
                    >
                      <option value="allPos">ALL POSITIONS</option>
                      {/* <option value="QB">QUARTER BACK</option>
                      <option value="RB">RUNNING BACK</option>
                      <option value="WR">WIDE RECEIVER</option>
                      <option value="TE">TIGHT END</option> */}
                      {positionList.map((x) => {
                        return <option value={x.key}>{x.name}</option>;
                      })}
                    </select>
                  </form>
                  <form>
                    <select
                      onChange={(e) => {
                        handleDropdownChange();
                        setTeam([e.target.value]);
                      }}
                      className="bg-filter-icon bg-no-repeat bg-right bg-indigo-white iphone5:w-28 w-36 md:w-42 lg:w-60
                      ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                      focus:outline-none cursor-pointer text-xs md:text-base ml-8"
                    >
                      <option value="allTeams">ALL TEAMS</option>
                      <option value="ARI">Arizona</option>
                    </select>
                  </form>
                </div>
                <NftTypeComponent
                  onChangeFn={(selectedRegular, selectedPromo) => {
                    setSelectedRegular(selectedRegular);
                    setSelectedPromo(selectedPromo);
                    setRemountComponent(Math.random());
                  }}
                />
              </div>
              <div key={remountAthlete} className="flex flex-col">
                {loading ? (
                  <LoadingPageDark />
                ) : (
                  <div className="grid grid-cols-2 gap-x-12 md:gap-x-0 gap-y-8 iphone5:mt-0 md:grid-cols-4 md:mt-4 md:mr-12">
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
                  onPageChange={
                    selectedRegular !== false && selectedPromo !== false
                      ? mixedPaginationHandling
                      : handlePageClick
                  }
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
