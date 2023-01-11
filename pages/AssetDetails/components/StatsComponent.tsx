import React, { useEffect, useState, useCallback } from 'react';
import {
  GET_ATHLETEDATA_QB,
  GET_ATHLETEDATA_RB,
  GET_ATHLETEDATA_WR,
  GET_ATHLETEDATA_TE,
  GET_ATHLETEDATA_NBA,
} from 'utils/queries';
import { useLazyQuery } from '@apollo/client';
import {
  qbStatNames,
  rbStatNames,
  wrStatNames,
  teStatNames,
  nbaStatNames,
} from 'data/constants/statNames';
import { getSportType } from 'data/constants/sportConstants';
const StatsComponent = (props) => {
  const { id, position, sport } = props;
  const [statNames, setStatNames] = useState([]);
  const [getAthleteQB] = useLazyQuery(GET_ATHLETEDATA_QB);
  const [getAthleteRB] = useLazyQuery(GET_ATHLETEDATA_RB);
  const [getAthleteWR] = useLazyQuery(GET_ATHLETEDATA_WR);
  const [getAthleteTE] = useLazyQuery(GET_ATHLETEDATA_TE);
  const [getAthleteNBA] = useLazyQuery(GET_ATHLETEDATA_NBA);
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
        // newState.push(Number.isNaN(avg) ? 0 : avg);
        newState.splice(4, 0, Number.isNaN(avg) ? 0 : avg);
        break;
      case 'WR':
      case 'TE':
        avg = Math.round((newState[4] / newState[3]) * 10 + Number.EPSILON) / 10;
        // newState.push(Number.isNaN(avg) ? 0 : avg);
        newState.splice(4, 0, Number.isNaN(avg) ? 0 : avg);
        break;
      // default:
      //   // nba shit??
      //   break;
    }
    return newState;
  }

  const query_stats = useCallback(async (position, id) => {
    let query;
    let state;
    switch (position) {
      case 'QB':
        query = await getAthleteQB({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setStatNames(qbStatNames);
        console.log(query.data.getAthleteById);
        //get the game where athlete last played and get the stats
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
          ).then((x) => {
            console.log(x);
            return Object.values(x[x.length - 1]);
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
              return Object.values(x[x.length - 1]);
            })
          )
        );
        setStatNames(rbStatNames);
        break;
      case 'WR':
        query = await getAthleteWR({ variables: { getAthleteById: parseFloat(id.toString()) } });
        console.log(query.data.getAthleteById);
        setAthleteData(
          getAverage(
            position,
            await Promise.all(
              query.data.getAthleteById.stats.filter((x) => x.type === 'weekly' && x.played === 1)
            ).then((x) => {
              return Object.values(x[x.length - 1]);
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
              return Object.values(x[x.length - 1]);
            })
          )
        );
        setStatNames(teStatNames);
        break;
      default:
        query = await getAthleteNBA({ variables: { getAthleteById: parseFloat(id.toString()) } });
        setAthleteData(
          await Promise.all(
            query.data.getAthleteById.stats.filter((x) => x.type === 'daily' && x.played === 1)
          ).then((x) => {
            console.log(x);
            return Object.values(x[x.length - 1]);
          })
        );
        setStatNames(nbaStatNames);
        break;
    }
  }, []);

  useEffect(() => {
    if (id !== undefined && position !== undefined) {
      query_stats(position, id).catch(console.error);
      setPositionDisplay(getSportType(sport).positionList.find((x) => x.key === position).name);
    }
  }, [id, position, query_stats]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (athleteData) {
      console.log(athleteData);
      /*
      slice athleteData array, removing 'AthleteStat', 'weekly/daily', and 'played' and 'opponent' objects
      for displaying purposes
      */
      const athlete = athleteData.slice(2, athleteData.length - 2);
      setAthleteStat(athlete);
    }
  }, [athleteData]);
  return (
    <>
      <div
        className="flex h-1/8 w-1/3 ml-24 -mt-16 justify-center content-center select-none text-center text-4xl 
            bg-indigo-black font-monument text-indigo-white p-2 pl-5"
      >
        <div className="">{positionDisplay}</div>
      </div>
      <div className="mt-10 ml-10 md:ml-24">
        <div className="font-monument md:text-xl">
          Most recent game stats &#40;against{' '}
          {athleteData[athleteData.length - 1] !== undefined
            ? athleteData[athleteData.length - 1].name
            : ''}
          &#41;
        </div>
      </div>
      <div className="mt-4 ml-10 md:ml-24 text-sm grid grid-rows-4 grid-cols-2 md:grid-cols-4 md:w-1/2 md:mt-4">
        {athleteStat?.map((x, index) => {
          return (
            <div>
              <div className="font-monument text-4xl -mb-6">{x.toFixed(2)}</div>
              <br></br>
              <div className="">{statNames[index]}</div>
            </div>
          );
        })}
        {/* <div>
          <div className="font-monument text-5xl -mb-6">{athleteData[2]?.toFixed(2)}</div>
          <br></br>
          <div className="">{statNames[1]}</div>
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6">{athleteData[3]?.toFixed(2)}</div>
          <br></br>
          {statNames[2]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6">{athleteData[4]?.toFixed(2)}</div>
          <br></br>
          {statNames[3]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6">{athleteData[5]?.toFixed(2)}</div>
          <br></br>
          {statNames[4]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6 mt-2">{athleteData[6]?.toFixed(2)}</div>
          <br></br>
          {statNames[5]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6 mt-2">{athleteData[7]?.toFixed(2)}</div>
          <br></br>
          {statNames[6]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6 mt-2">{athleteData[8]?.toFixed(2)}</div>
          <br></br>
          {statNames[7]}
        </div>
        <div>
          <div className="font-monument text-5xl -mb-6 mt-2">{athleteData[9]?.toFixed(2)}</div>
          <br></br>
          {statNames[8]}
        </div> */}
      </div>
    </>
  );
};

export default StatsComponent;
