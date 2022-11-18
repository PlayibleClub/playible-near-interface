import React, { useEffect, useState } from 'react';
import { transactions, utils, WalletConnection, providers } from 'near-api-js';
import { getRPCProvider, getContract } from 'utils/near';
import BackFunction from 'components/buttons/BackFunction';
import Container from 'components/containers/Container';
import PortfolioContainer from 'components/containers/PortfolioContainer';
import router, { useRouter } from 'next/router';
import { useWalletSelector } from 'contexts/WalletSelectorContext';
import {
  convertNftToAthlete,
  getAthleteInfoById,
  getAthleteInfoNoStats,
} from 'utils/athlete/helper';
import { ATHLETE } from 'data/constants/nearContracts';
import AthleteSelectContainer from 'components/containers/AthleteSelectContainer';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';

const AthleteSelect = (props) => {
  const { query } = props;

  const gameId = query.game_id;
  const teamName = query.teamName;

  const position = query.position;
  const router = useRouter();
  const data = router.query;
  let pass = data;
  // @ts-ignore:next-line
  let passedLineup = JSON.parse(data.athleteLineup);
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
  const provider = new providers.JsonRpcProvider({
    url: getRPCProvider(),
  });

  function query_nft_supply_for_owner(position, team, name) {
    const query = JSON.stringify({
      account_id: accountId,
      position: position,
      team: team,
      name: name,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'filtered_nft_supply_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then((data) => {
        //@ts-ignore:next-line
        const totalAthletes = JSON.parse(Buffer.from(data.result));
        console.log(totalAthletes);
        setTotalAthletes(totalAthletes);
      });
  }

  function query_nft_tokens_for_owner(position, team, name) {
    const query = JSON.stringify({
      account_id: accountId,
      from_index: athleteOffset.toString(),
      limit: athleteLimit,
      position: position,
      team: team,
      name: name,
    });

    provider
      .query({
        request_type: 'call_function',
        finality: 'optimistic',
        account_id: getContract(ATHLETE),
        method_name: 'filter_tokens_for_owner',
        args_base64: Buffer.from(query).toString('base64'),
      })
      .then(async (data) => {
        // @ts-ignore:next-line
        const result = JSON.parse(Buffer.from(data.result).toString());
        console.log(result);
        const result_two = await Promise.all(
          result.map(convertNftToAthlete).map(getAthleteInfoNoStats)
        );

        console.log(result_two);
        // const sortedResult = sortByKey(result_two, 'fantasy_score');
        setAthletes(result_two);
      });
  }
  //TODO: might encounter error w/ loading duplicate athlete
  function setAthleteRadio(index) {
    passedLineup.splice(pass.index, 1, {
      position: position,
      isAthlete: true,
      athlete: athletes[index],
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

  const handlePageClick = (e) => {
    const newOffset = (e.selected * athleteLimit) % totalAthletes;
    //add reset of lineup
    passedLineup.splice(pass.index, 1, {
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
  useEffect(() => {
    if (!isNaN(athleteOffset)) {
      query_nft_supply_for_owner(position, team, name);
      setPageCount(Math.ceil(totalAthletes / athleteLimit));
      const endOffset = athleteOffset + athleteLimit;
      query_nft_tokens_for_owner(position, team, name);
    }
  }, [totalAthletes, athleteLimit, athleteOffset]);

  return (
    <>
      <Container activeName="PLAY">
        <div className="mt-4">
          <BackFunction prev={`/CreateTeam/${gameId}`} />
        </div>
        <PortfolioContainer
          title={'SELECT YOUR ' + getPositionDisplay(position)}
          textcolor="text-indigo-black"
        >
          <div className="flex flex-col">
            <div className="grid grid-cols-4 mt-1 md:grid-cols-4 md:ml-7 md:mt-2">
              {athletes.map((item, i) => {
                const accountAthleteIndex = athletes.indexOf(item, 0) + athleteOffset;

                return (
                  <>
                    {checkIfAthleteExists(item.athlete_id) ? (
                      <div className="w-4/5 h-5/6 border-transparent opacity-50 pointer-events-none">
                        <div className="mt-1.5 w-full h-14px mb-1"></div>
                        <AthleteSelectContainer
                          key={item.athlete_id}
                          athleteName={item.name}
                          avgScore={item.fantasy_score.toFixed(2)}
                          id={item.athlete_id}
                          uri={item.image}
                          index={accountAthleteIndex}
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
                          <AthleteSelectContainer
                            key={item.athlete_id}
                            athleteName={item.name}
                            avgScore={item.fantasy_score.toFixed(2)}
                            id={item.athlete_id}
                            uri={item.image}
                            index={accountAthleteIndex}
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
        </PortfolioContainer>
        <div className="absolute z-0 bottom-10 right-10 iphone5:bottom-4 iphone5:right-2 iphone5:fixed iphoneX:bottom-4 iphoneX:right-4 iphoneX-fixed">
          <div key={remountComponent}>
            <ReactPaginate
              className="p-2 text-center bg-indigo-buttonblue text-indigo-white flex flex-row space-x-4 select-none ml-7"
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
            <Link
              href={{
                pathname: '/CreateTeam/[game_id]',
                query: {
                  game_id: gameId,
                  testing: JSON.stringify(lineup),
                  teamName: teamName,
                },
              }}
              as={`/CreateTeam/${gameId}`}
            >
              <button className="bg-indigo-buttonblue text-indigo-white w-full ml-7 mt-4 md:w-60 h-14 text-center font-bold text-md">
                PROCEED
              </button>
            </Link>
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
