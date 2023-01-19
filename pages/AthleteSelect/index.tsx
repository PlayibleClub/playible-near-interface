import React, { useEffect, useState } from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import BackFunction from 'components/buttons/BackFunction';
import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import router, { useRouter } from 'next/router';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';

import AthleteSelectContainer from 'components/containers/AthleteSelectContainer';
import Link from 'next/link';
import SearchComponent from 'components/SearchComponent';
import ReactPaginate from 'react-paginate';
import PerformerContainer from 'components/containers/PerformerContainer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  getAthleteLineup,
  getGameId,
  getIndex,
  getPosition,
  getTeamName,
  getSport,
} from 'redux/athlete/athleteSlice';
import {
  setAthleteLineup,
  setGameId,
  setIndex,
  setPosition,
  setTeamNameRedux,
} from 'redux/athlete/athleteSlice';
import {
  query_filter_supply_for_owner,
  query_filter_tokens_for_owner,
  query_mixed_tokens_pagination,
} from 'utils/near/helper';
import { getSportType } from 'data/constants/sportConstants';
import NftTypeComponent from 'pages/Portfolio/components/NftTypeComponent';
import { getPositionDisplay } from 'utils/athlete/helper';
const AthleteSelect = (props) => {
  const { query } = props;

  //const teamName = query.teamName;

  //const position = query.position;
  const router = useRouter();
  const data = router.query;
  const dispatch = useDispatch();
  //Get the data from redux store
  const gameId = useSelector(getGameId);
  const position = useSelector(getPosition);
  console.log(position);
  const index = useSelector(getIndex);
  const reduxLineup = useSelector(getAthleteLineup);
  const currentSport = useSelector(getSport);
  let passedLineup = [...reduxLineup];
  const [athletes, setAthletes] = useState([]);
  const [selectedRegular, setSelectedRegular] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(false);
  const [athleteOffset, setAthleteOffset] = useState(0);
  const [regularOffset, setRegularOffset] = useState(0);
  const [promoOffset, setPromoOffset] = useState(0);
  const [isPromoPage, setIsPromoPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [athleteLimit, setAthleteLimit] = useState(7);
  const [totalRegularSupply, setTotalRegularSupply] = useState(0);
  const [totalPromoSupply, setTotalPromoSupply] = useState(0);
  const [radioSelected, setRadioSelected] = useState(null);
  const [team, setTeam] = useState(['allTeams']);
  const [name, setName] = useState(['allNames']);
  const [lineup, setLineup] = useState([]);
  const { accountId } = useWalletSelector();
  const [pageCount, setPageCount] = useState(0);
  const [remountComponent, setRemountComponent] = useState(0);
  const [search, setSearch] = useState('');
  const [currPosition, setCurrPosition] = useState('');
  const [loading, setLoading] = useState(true);
  const [remountAthlete, setRemountAthlete] = useState(0);
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

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

  //TODO: might encounter error w/ loading duplicate athlete
  function setAthleteRadio(radioIndex) {
    passedLineup.splice(index, 1, {
      position: position,
      isAthlete: true,
      isPromo: athletes[radioIndex].athlete_id.includes('SB') ? true : false,
      athlete: athletes[radioIndex],
    });
    setLineup(passedLineup);
  }

  function checkIfAthleteExists(athlete_id) {
    for (let i = 0; i < passedLineup.length; i++) {
      if (passedLineup[i].isAthlete === true) {
        if (athlete_id === passedLineup[i].athlete.athlete_id) {
          return true;
        }
      }
    }
    return false;
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
    //setRemountAthlete(Math.random() + 1);
    // query_filter_tokens_for_owner(
    //   accountId,
    //   isPromoPage ? athleteOffset + promoOffset : athleteOffset,
    //   athleteLimit,
    //   position,
    //   team,
    //   name,
    //   isPromoPage ? getContract(ATHLETE_PROMO) : getContract(ATHLETE)
    // ).then((result) => {
    //   console.log(result);
    //   if (result.length < athleteLimit && !isPromoPage && totalPromo !== 0) {
    //     let sbLimit = athleteLimit - result.length;
    //     query_filter_tokens_for_owner(
    //       accountId,
    //       0,
    //       sbLimit,
    //       position,
    //       team,
    //       name,
    //       getContract(ATHLETE_PROMO)
    //     ).then((result2) => {
    //       result2.map((obj) => result.push(obj));
    //       setAthletes(result);
    //     });
    //   } else {
    //     setAthletes(result);
    //   }
    // });
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
    passedLineup.splice(index, 1, {
      position: position,
      isAthlete: false,
      isPromo: false,
    });

    setRadioSelected(null);
    setAthleteOffset(newOffset);
    setCurrentPage(e.selected);
  };
  function handleDropdownChange() {
    setAthleteOffset(0);
    setAthleteLimit(7);
    setRemountComponent(Math.random());
  }

  // const handlePageClick = (e) => {
  //   let newOffset;
  //   console.log(e.selected);
  //   //soulbound athlete not needed yet
  //   if (soulPage === false) {
  //     //skipping to last page that has soulbound athletes
  //     if (e.selected * athleteLimit >= totalAthletes) {
  //       setSoulPage(true);
  //       //newOffset = (athleteLimit * Math.floor(totalSoulbound / athleteLimit) - )
  //       //newOffset = (athleteLimit * Math.ceil(totalSoulbound / athleteLimit) - (totalAthletes % athleteLimit));
  //       if (totalAthletes % athleteLimit === 0) {
  //         newOffset =
  //           (Math.floor(totalSoulbound / athleteLimit) - Math.abs(e.selected - pageCount)) *
  //             athleteLimit -
  //           athleteLimit;
  //       } else {
  //         //prettier-ignore
  //         newOffset = athleteLimit - (totalAthletes % athleteLimit) + (Math.floor(totalSoulbound / athleteLimit) - Math.abs(e.selected - pageCount)) * athleteLimit - athleteLimit;
  //       }
  //     } else {
  //       newOffset = ((e.selected * athleteLimit) % totalAthletes) + soulOffset;
  //     }
  //   } else if (soulPage > true) {
  //     let newPage = e.selected;
  //     let compute = newPage - currentPage;
  //     console.log(compute);
  //     //getting page offset for soulbound
  //     // if (soulPage - compute <= -1) {
  //     //   console.log(soulPage + ' + ' + compute);
  //     //   newOffset = (soulPage + (compute - 1)) * athleteLimit + soulOffset;
  //     // } else {
  //     //   console.log('test');
  //     //   newOffset = (e.selected * athleteLimit) % totalAthletes;
  //     //   setSoulPage(-1);
  //     //   setSoulOffset(0);
  //     // }
  //   }
  //   // const newOffset = (e.selected * athleteLimit) % totalAthletes;
  //   //add reset of lineup
  //   passedLineup.splice(index, 1, {
  //     position: position,
  //     isAthlete: false,
  //     isPromo: false,
  //   });
  //   setRadioSelected(null);
  //   setAthleteOffset(newOffset);
  //   setCurrentPage(e.selected);
  // };

  const handleRadioClick = (value) => {
    setRadioSelected(value);
    setAthleteRadio(value);
  };

  const handleProceedClick = (game_id, lineup) => {
    dispatch(setGameId(game_id));
    dispatch(setAthleteLineup(lineup));
    router.push({
      pathname: '/CreateTeam/[sport]/[game_id]',
      query: { sport: currentSport, game_id: game_id },
    });
  };

  const handlePageClick = (event) => {
    let total = selectedRegular ? totalRegularSupply : selectedPromo ? totalPromoSupply : 0;
    const newOffset = (event.selected * athleteLimit) % total;

    passedLineup.splice(index, 1, {
      position: position,
      isAthlete: false,
      isPromo: false,
    });
    setAthleteOffset(newOffset);
    setCurrentPage(event.selected);
  };

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

    //else
    // if (!isNaN(athleteOffset)) {
    //   //if normal radio button is selected
    //   get_filter_supply_for_owner(accountId, position, team, name, getContract(ATHLETE));
    //   //if sb radio button is selected
    //   //get_filter_supply_for_owner(accountId, position, team, name, getContract(ATHLETE_SOULBOUND));
    //   setPageCount(Math.ceil(totalAthletes / athleteLimit));
    //   const endOffset = athleteOffset + athleteLimit;
    //   console.log(`Loading athletes from ${athleteOffset} to ${endOffset}`);
    //   get_filter_tokens_for_owner(
    //     accountId,
    //     athleteOffset,
    //     athleteLimit,
    //     position,
    //     team,
    //     name,
    //     getContract(ATHLETE)
    //   );
    // }
  }, [totalRegularSupply, totalPromoSupply, athleteOffset, currentPage]);

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
  }, [team, name, totalRegularSupply, totalPromoSupply, selectedRegular, selectedPromo]);
  // useEffect(() => {
  //   console.log(totalAthletes);
  //   console.log(totalSoulbound);
  // }, [totalAthletes, totalSoulbound]);
  useEffect(() => {}, [search]);

  return (
    <Container activeName="PLAY">
      <div className="mt-44 md:ml-6 md:mt-6 mb-2">
        <BackFunction prev={`/CreateTeam/${currentSport.toLowerCase()}/${gameId}`} />
        <PortfolioContainer
          title={'SELECT YOUR ' + getPositionDisplay(position, currentSport)}
          textcolor="text-indigo-black"
        />
        <div className='grid grid-cols-2 md:grid-cols-none'>
        <NftTypeComponent
          onChangeFn={(selectedRegular, selectedPromo) => {
            setSelectedRegular(selectedRegular);
            setSelectedPromo(selectedPromo);
            setRemountComponent(Math.random());
          }}
        />
        </div>
      </div>

      <div className="h-8 flex absolute ml-3 top-32 mr-8 md:top-24 md:right-20 md:-mt-5 ">
        <SearchComponent
          onChangeFn={(search) => setName(search)}
          onSubmitFn={(search) => setName(search)}
        />
        {/* <form
            onSubmit={(e) => {
              handleDropdownChange();
              search == '' ? setName(['allNames']) : setName([search]);
              e.preventDefault();
            }}
          >
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
              Search
            </label>
            <div className="relative lg:ml-80">
              <input
                type="search"
                id="default-search"
                onChange={(e) => setSearch(e.target.value)}
                className=" bg-indigo-white w-72 pl-2
                            ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                            focus:outline-none"
                placeholder="Search Athlete"
              />
              <button
                type="submit"
                className="bg-search-icon bg-no-repeat bg-center absolute -right-12 bottom-0 h-full
                            pl-8 md:pl-6 py-2 ring-2 ring-offset-4 ring-indigo-black ring-opacity-25
                            focus:ring-2 focus:ring-indigo-black"
              ></button>
            </div>
          </form> */}
      </div>

      <div key={remountAthlete} className="flex flex-col overflow-y-none">
        <div className="grid grid-cols-2 mt-1 ml-4 md:grid-cols-4 md:ml-7 md:mt-2">
          {athletes.map((item, i) => {
            const accountAthleteIndex = athletes.indexOf(item, 0) + athleteOffset;
            return (
              <>
                {checkIfAthleteExists(item.athlete_id) || item.isInGame ? (
                  <div className="w-4/5 h-5/6 border-transparent pointer-events-none">
                    <div className="mt-1.5 w-full h-14px mb-1"></div>
                    <PerformerContainer
                      key={item.athlete_id}
                      AthleteName={item.name}
                      AvgScore={item.fantasy_score.toFixed(2)}
                      id={item.athlete_id}
                      uri={item.image}
                      index={accountAthleteIndex}
                      isSelected={true}
                      isInGame={item.isInGame}
                      fromPortfolio={false}
                      isActive={item.isActive}
                      isInjured={item.isInjured}
                    />
                  </div>
                ) : (
                  <label className="w-4/5 h-5/6">
                    <div className="w-full h-full border-transparent focus:border-transparent focus:ring-2 focus:ring-blue-300 focus:border-transparent">
                      <input
                        className="justify-self-end"
                        type="radio"
                        checked={radioSelected == i}
                        value={i}
                        onChange={(e) => handleRadioClick(e.target.value)}
                      ></input>
                      <PerformerContainer
                        key={item.athlete_id}
                        AthleteName={item.name}
                        AvgScore={item.fantasy_score.toFixed(2)}
                        id={item.athlete_id}
                        uri={item.image}
                        index={accountAthleteIndex}
                        fromPortfolio={false}
                        isActive={item.isActive}
                        isInjured={item.isInjured}
                      />
                    </div>
                  </label>
                )}
              </>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-10 right-10"></div>
      <div className="absolute z-0 bottom-10 right-10 iphone5:bottom-4 iphone5:right-2 iphone5:fixed iphoneX:bottom-4 iphoneX:right-4 iphoneX-fixed">
        <div key={remountComponent}>
          <ReactPaginate
            className="p-2 content-center justify-center bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
            pageClassName="hover:font-bold"
            activeClassName="rounded-lg text-center bg-indigo-white text-indigo-black pr-1 pl-1 font-bold"
            pageLinkClassName="rounded-lg text-center hover:font-bold hover:bg-indigo-white hover:text-indigo-black"
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
          <button
            className="bg-indigo-buttonblue text-indigo-white w-full ml-7 mt-4 md:w-60 h-14 text-center font-bold text-md"
            onClick={() => handleProceedClick(gameId, lineup)}
          >
            PROCEED
          </button>
        </div>
      </div>
    </Container>
  );
};
export default AthleteSelect;

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  if (query.id != query.id) {
    return {
      desination: query.origin || '/CreateTeam',
    };
  }

  return {
    props: { query },
  };
}
