import React, { useEffect, useState, useCallback} from 'react';
import { GET_ATHLETEDATA_QB, GET_ATHLETEDATA_RB, GET_ATHLETEDATA_WR, GET_ATHLETEDATA_TE } from 'utils/queries';
import { useLazyQuery } from '@apollo/client';
import { qbStatNames, rbStatNames, wrStatNames, teStatNames } from 'data/constants/statNames';

const StatsComponent = (props) => {
    const {
        id, 
        position,
    } = props;

    const [statNames, setStatNames] = useState([]);
    const [getAthleteQB] = useLazyQuery(GET_ATHLETEDATA_QB);
    const [getAthleteRB] = useLazyQuery(GET_ATHLETEDATA_RB);
    const [getAthleteWR] = useLazyQuery(GET_ATHLETEDATA_WR);
    const [getAthleteTE] = useLazyQuery(GET_ATHLETEDATA_TE);
    const [athleteData, setAthleteData] = useState([]);
    
    const query_stats = useCallback(async (position, id) => {
        let query;
        switch(position){
            case 'QB':
                query = await getAthleteQB({ variables: { getAthleteById: parseFloat(id.toString())}});
                setStatNames(qbStatNames);
                console.log(query.data.getAthleteById);
                break;
            case 'RB':
                query = await getAthleteRB({ variables: { getAthleteById: parseFloat(id.toString())}});
                setStatNames(rbStatNames);
                break;
            case 'WR':
                query = await getAthleteWR({ variables: { getAthleteById: parseFloat(id.toString())}});
                setStatNames(wrStatNames);
                break;
            case 'TE':
                query = await getAthleteTE({ variables: {getAthleteById: parseFloat(id.toString())}});
                setStatNames(teStatNames);
                break;
        }
        setAthleteData(await Promise.all(Object.values(query.data.getAthleteById.stats[0])));

    }, []);
    useEffect(() => {
        if(id[0] !== undefined && position[0] !== undefined){
            query_stats(position[0], id[0]).catch(console.error);
        }
    }, [id, position, query_stats]);

    return (
        <>
            <div className="flex h-1/8 w-1/3 ml-24 -mt-8 justify-center content-center select-none text-center text-4xl 
            bg-indigo-black font-monument text-indigo-white p-2 pl-5">
            <div className="">
                {statNames[0]}
            </div>
            </div>

            <div className="mt-10 ml-24 w-1/2 text-sm grid grid-rows-4 grid-cols-4">
                <div>
                    {athleteData[1]} 
                    <br></br>
                    {statNames[1]}
                </div>
                <div>
                    {athleteData[2]}
                    <br></br>
                    {statNames[2]}
                    
                </div>
                <div>
                    {athleteData[3]}
                    <br></br>
                    {/* PASSING TOUCHDOWNS */}
                    {statNames[3]}
                </div>
                <div>
                    {athleteData[4]}
                    <br></br>
                    {/* INTERCEPTIONS */}
                    {statNames[4]}
                </div>
                <div>
                    {athleteData[5]}
                    <br></br>
                    {/* RUSHING YARDS */}
                    {statNames[5]}
                </div>
                <div>
                    {athleteData[6]}
                    <br></br>
                    {/* RUSHING TOUCHDOWNS */}
                    {statNames[6]}
                </div>
                <div>
                    {athleteData[7]}
                    <br></br>
                    {/* CARRIES */}
                    {statNames[7]}
                </div>
                <div>
                    {athleteData[8]}
                    <br></br>
                    {/* FREE SPACE */}
                    {statNames[8]}
                </div>
            </div>
        </>
    )
}

export default StatsComponent;