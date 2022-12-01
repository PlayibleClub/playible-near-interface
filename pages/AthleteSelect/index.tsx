import React, { useEffect, useState } from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import BackFunction from 'components/buttons/BackFunction';
import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import router, { useRouter } from 'next/router';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import { convertNftToAthlete, getAthleteInfoById } from 'utils/athlete/helper';
import { ATHLETE } from 'data/constants/nearContracts';
import AthleteSelectContainer from 'components/containers/AthleteSelectContainer';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import PerformerContainer from 'components/containers/PerformerContainer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { selectAthleteLineup, selectGameId, selectIndex, selectPosition, selectTeamName } from 'redux/athlete/athleteSlice';
import { setAthleteLineup, setGameId, setIndex, setPosition, setTeamNameRedux } from 'redux/athlete/athleteSlice';
import { query_filter_supply_for_owner, query_filter_tokens_for_owner } from 'utils/near/helper';

const AthleteSelect = (props) => {
  const { query } = props;

  //const teamName = query.teamName;

  //const position = query.position;
  const router = useRouter();
  const data = router.query;
  let pass = data;
  const dispatch = useDispatch();
  //Get the data from redux store
  const gameId = useSelector(selectGameId);
  const position = useSelector(selectPosition);
  const index = useSelector(selectIndex);
  console.log(position);
  console.log(useSelector(selectAthleteLineup));
  const reduxLineup = useSelector(selectAthleteLineup);
  let passedLineup = [...reduxLineup];
  const [athletes, setAthletes] = useState([]);
  const [athleteOffset, setAthleteOffset] = useState(0);
  const [athleteLimit, setAthleteLimit] = useState(7);
  const [totalAthletes, setTotalAthletes] = useState(0);
  const [radioSelected, setRadioSelected] = useState(null);
  const [team, setTeam] = useState('allTeams');
  const [name, setName] = useState('allNames');
  const [lineup, setLineup] = useState([]);
  const { accountId } = useWalletSelector();
  const [pageCount, setPageCount] = useState(0);
  const [remountComponent, setRemountComponent] = useState(0);
  const [search, setSearch] = useState('');
  const [currPosition, setCurrPosition] = useState('');
  const [loading, setLoading] = useState(true);
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  async function get_filter_supply_for_owner(accountId, position, team, name) {
    console.log(accountId)
    setTotalAthletes(await query_filter_supply_for_owner(accountId, position, team, name));
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

  //TODO: might encounter error w/ loading duplicate athlete
  function setAthleteRadio(radioIndex) {
    passedLineup.splice(index, 1, {
      position: position,
      isAthlete: true,
      athlete: athletes[radioIndex],
    });
    console.table(passedLineup);
    setLineup(passedLineup);
  }
  function getPositionDisplay(position) {
    switch (position) {
      case 'QB':
        return 'QUARTER BACK';
      case 'RB':
        return 'RUNNING BACK';
      case 'WR':
        return 'WIDE RECEIVER';
      case 'TE':
        return 'TIGHT END';
      case 'FLEX':
        return 'FLEX (RB/WR/TE)';
      case 'SUPERFLEX':
        return 'SUPERFLEX (QB/RB/WR/TE)';
    }
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

  function handleDropdownChange() {
    setAthleteOffset(0);
    setAthleteLimit(7);
    setRemountComponent(Math.random());
  }

  const handlePageClick = (e) => {
    const newOffset = (e.selected * athleteLimit) % totalAthletes;
    //add reset of lineup
    passedLineup.splice(index, 1, {
      position: position,
      isAthlete: false,
    });
    setRadioSelected(null);
    setAthleteOffset(newOffset);
  };
  const handleRadioClick = (value) => {
    console.log(value);
    setRadioSelected(value);
    setAthleteRadio(value);
  };

  const handleProceedClick = (game_id, lineup) => {
    dispatch(setGameId(game_id));
    dispatch(setAthleteLineup(lineup));
    router.push({
      pathname: '/CreateTeam/[game_id]',
      query: { game_id: game_id },
    });
  }
  useEffect(() => {
    if (!isNaN(athleteOffset)) {
      get_filter_supply_for_owner(accountId, position, team, name);
      setPageCount(Math.ceil(totalAthletes / athleteLimit));
      const endOffset = athleteOffset + athleteLimit;
      console.log(`Loading athletes from ${athleteOffset} to ${endOffset}`);
      get_filter_tokens_for_owner(accountId, athleteOffset, athleteLimit, position, team, name);
    }
  }, [totalAthletes, athleteLimit, athleteOffset, position, team, name]);

  useEffect(() => { }, [search]);

  return (
    <>
      <Container activeName="PLAY">
        <div className="md:ml-6 md:mt-12">
          <BackFunction prev={`/CreateTeam/${gameId}`} />
          <PortfolioContainer
            title={'SELECT YOUR ' + getPositionDisplay(position)}
            textcolor="text-indigo-black"
          />
        </div>

        <div className="h-8 flex relative w-32">
          <form
            onSubmit={(e) => {
              handleDropdownChange();
              search == '' ? setName('allNames') : setName(search);
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
                            pl-6 py-2 ring-2 ring-offset-4 ring-indigo-black ring-opacity-25
                            focus:ring-2 focus:ring-indigo-black"
              ></button>
            </div>
          </form>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-4 mt-1 md:grid-cols-4 md:ml-7 md:mt-2">
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
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
            />
            <button className="bg-indigo-buttonblue text-indigo-white w-full ml-7 mt-4 md:w-60 h-14 text-center font-bold text-md" onClick={() => handleProceedClick(gameId, lineup)}>
              PROCEED
            </button>
          </div>
        </div>
      </Container>
    </>
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
