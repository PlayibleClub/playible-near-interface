import React, { useEffect, useState, useCallback } from 'react';
import {
  GET_ATHLETEDATA_QB,
  GET_ATHLETEDATA_RB,
  GET_ATHLETEDATA_WR,
  GET_ATHLETEDATA_TE,
  GET_ATHLETEDATA_NBA,
  GET_ATHLETEDATA_HITTER,
  GET_ATHLETEDATA_PITCHER,
  GET_ATHLETEDATA_BOWL,
  GET_ATHLETEDATA_WK,
  GET_ATHLETEDATA_BAT,
} from 'utils/queries';
import { useLazyQuery } from '@apollo/client';
import {
  qbStatNames,
  rbStatNames,
  wrStatNames,
  teStatNames,
  nbaStatNames,
  pitcherStatNames,
  hitterStatNames,
  batsmanStatNames,
  bowlingStatNames,
  wicketKeeperStatNames,
  allRounderStatNames,
} from 'data/constants/statNames';
import { getSportType } from 'data/constants/sportConstants';
import moment from 'moment';
import {} from 'data/constants/statNames';
import {} from 'data/constants/statNames';
const StatsComponent = (props) => {
  const { id, position, sport, mlbSeason } = props;
  const [statNames, setStatNames] = useState([]);

  const [getAthleteQB] = useLazyQuery(GET_ATHLETEDATA_QB);
  const [getAthleteRB] = useLazyQuery(GET_ATHLETEDATA_RB);
  const [getAthleteWR] = useLazyQuery(GET_ATHLETEDATA_WR);
  const [getAthleteTE] = useLazyQuery(GET_ATHLETEDATA_TE);
  const [getAthletePitcher] = useLazyQuery(GET_ATHLETEDATA_PITCHER);
  const [getAthleteHitter] = useLazyQuery(GET_ATHLETEDATA_HITTER);
  const [getAthleteNBA] = useLazyQuery(GET_ATHLETEDATA_NBA);
  const [getAthleteBOWL] = useLazyQuery(GET_ATHLETEDATA_BOWL);
  const [getAthleteWK] = useLazyQuery(GET_ATHLETEDATA_WK);
  const [getAthleteBAT] = useLazyQuery(GET_ATHLETEDATA_BAT);

  const [athleteData, setAthleteData] = useState([]);
  const [athleteStat, setAthleteStat] = useState([]);
  const [positionDisplay, setPositionDisplay] = useState('');

  function getAverage(position, athleteData) {
    let newState = athleteData;
    console.log(newState);
    let avg;
    switch (position) {
      case 'RB':
        avg = Math.round((newState[3] / newState[2]) * 10 + Number.EPSILON) / 10;
        newState.splice(4, 0, Number.isNaN(avg) ? 0 : avg);
        break;
      case 'WR':
      case 'TE':
        avg = Math.round((newState[4] / newState[3]) * 10 + Number.EPSILON) / 10;
        newState.splice(4, 0, Number.isNaN(avg) ? 0 : avg);
        break;
    }
    return newState;
  }

  const query_stats = useCallback(async (position, id) => {
    let query;
    switch (position) {
      case 'QB':
        query = await getAthleteQB({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setStatNames(qbStatNames);
        //get the game where athlete last played and get the stats
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
          ).then((x) => {
            console.log(x);
            let sorted = x.sort((a, b) => {
              return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        break;
      case 'RB':
        query = await getAthleteRB({ variables: { getAthleteById: parseFloat(id.toString()) } });

        setAthleteData(
          getAverage(
            position,
            await Promise.all(
              query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
            ).then((x) => {
              let sorted = x.sort((a, b) => {
                return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
              });
              return Object.values(sorted[0]);
            })
          )
        );
        setStatNames(rbStatNames);
        break;
      case 'WR':
        query = await getAthleteWR({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setAthleteData(
          getAverage(
            position,
            await Promise.all(
              query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
            ).then((x) => {
              let sorted = x.sort((a, b) => {
                return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
              });
              return Object.values(sorted[0]);
            })
          )
        );
        setStatNames(wrStatNames);
        break;
      case 'TE':
        query = await getAthleteTE({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setAthleteData(
          getAverage(
            position,
            await Promise.all(
              query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
            ).then((x) => {
              let sorted = x.sort((a, b) => {
                return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
              });
              return Object.values(sorted[0]);
            })
          )
        );
        setStatNames(teStatNames);
        break;
      case 'SP':
      case 'RP':
        query = await getAthletePitcher({
          variables: { getAthleteById: parseFloat(id.toString()), season: mlbSeason },
        });
        if (query.data.getAthleteById.stats.length > 0) {
          console.log('Stats is Empty');
        }
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'daily' && x.played === 1)
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(pitcherStatNames);
        break;
      case 'CF':
      case 'C':
      case 'SS':
      case 'LF':
      case 'RF':
      case '1B':
      case '2B':
      case '3B':
        query = await getAthleteHitter({
          variables: { getAthleteById: parseFloat(id.toString()), season: mlbSeason },
        });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'daily' && x.played === 1)
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(hitterStatNames);
        break;
      case 'BOWL':
        query = await getAthleteBOWL({
          // variables: { getAthleteMatchResults: playerKey, matchKey: matchKey },
        });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteMatchResults.stats.filter(
              (x) => x.type === 'daily' && x.played === 1
            )
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.match.start_at).unix() - moment.utc(a.match.start_at).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(bowlingStatNames);
        break;
      case 'WK':
        query = await getAthleteWK({
          // variables: { getAthleteMatchResults: playerKey, matchKey: matchKey },
        });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteMatchResults.stats.filter(
              (x) => x.type === 'daily' && x.played === 1
            )
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.match.start_at).unix() - moment.utc(a.match.start_at).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(wicketKeeperStatNames);
        break;
      case 'BAT':
        query = await getAthleteBAT({
          // variables: { getAthleteMatchResults: playerKey, matchKey: matchKey },
        });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteMatchResults.stats.filter(
              (x) => x.type === 'daily' && x.played === 1
            )
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.match.start_at).unix() - moment.utc(a.match.start_at).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(batsmanStatNames);
        break;
      case 'AR':
        query = await getAthleteBAT({
          // variables: { getAthleteMatchResults: playerKey, matchKey: matchKey },
        });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteMatchResults.stats.filter(
              (x) => x.type === 'daily' && x.played === 1
            )
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.match.start_at).unix() - moment.utc(a.match.start_at).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(allRounderStatNames);
        break;
      default:
        query = await getAthleteNBA({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'daily' && x.played === 1)
          ).then((x) => {
            let sorted = x.sort((a, b) => {
              return moment.utc(b.gameDate).unix() - moment.utc(a.gameDate).unix();
            });
            return Object.values(sorted[0]);
          })
        );
        setStatNames(nbaStatNames);
        break;
    }
  }, []);

  useEffect(() => {
    if (id !== undefined && position !== undefined && mlbSeason !== '') {
      query_stats(position, id).catch(console.error);
      if (sport === 'BASEBALL') {
        setPositionDisplay(
          getSportType(sport).assetPositionList.find((x) => x.key === position).name
        );
      } else {
        setPositionDisplay(getSportType(sport).positionList.find((x) => x.key === position).name);
      }
    }
  }, [id, position, mlbSeason, query_stats]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (athleteData) {
      /*
      slice athleteData array, removing 'AthleteStat', 'weekly/daily', and 'played' and 'opponent' objects
      for displaying purposes
      */
      const athlete = athleteData.slice(2, athleteData.length - 3);
      setAthleteStat(athlete);
    }
  }, [athleteData]);

  return (
    <>
      <div
        className="flex h-1/8 w-3/4 ml-10 md:w-1/3 -mt-16 justify-center content-center select-none text-center text-4xl 
            bg-indigo-black font-monument text-indigo-white p-2 pl-5"
      >
        <div className="">{positionDisplay}</div>
      </div>
      <div className="mt-10 ml-10 md:ml-10">
        <div className="font-monument md:text-xl">
          Most recent game stats &#40;against{' '}
          {athleteData[athleteData.length - 2] !== undefined
            ? athleteData[athleteData.length - 2].name
            : ''}
          &#41;
        </div>
      </div>
      <div className="mt-4 ml-10 md:ml-10 text-sm grid grid-rows-4 grid-cols-2 md:grid-cols-4 md:w-1/2 md:mt-4">
        {athleteStat?.map((x, index) => {
          return (
            <div>
              <div className="font-monument text-4xl -mb-6">{x.toFixed(2)}</div>
              <br></br>
              <div className="">{statNames[index]}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default StatsComponent;
