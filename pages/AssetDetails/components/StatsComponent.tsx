import React from 'react';

const StatsComponent = (props) => {
    const { 
        passingYards,
        // position,
        // completions,
        // passingTouchdowns,
        // interceptions,
        // rushingYards,
        // rushingTouchdowns,
        // carries,
        // freeSpace, 
    } = props;

    return (
        <>
            <div className="flex h-1/8 w-1/3 ml-24 -mt-8 justify-center content-center select-none text-center text-4xl 
            bg-indigo-black font-monument text-indigo-white p-2 pl-5">
            <div className="">
                QUARTER BACK
            </div>
            </div>

            <div className="mt-10 ml-24 w-1/2 text-sm grid grid-rows-4 grid-cols-4">
            <div>
                1 
                <br></br>
                COMPLETIONS/ATTEMPTS
            </div>
            <div>
                2
                <br></br>
                PASSING YARDS
            </div>
            <div>
                3
                <br></br>
                PASSING TOUCHDOWNS
            </div>
            <div>
                4
                <br></br>
                INTERCEPTIONS
            </div>
            <div>
                5
                <br></br>
                RUSHING YARDS
            </div>
            <div>
                6
                <br></br>
                RUSHING TOUCHDOWNS
            </div>
            <div>
                7 
                <br></br>
                CARRIES
            </div>
            <div>
                8
                <br></br>
                FREE SPACE
            </div>
            </div>
        </>
    )
}

export default StatsComponent;