import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'


const PlayComponent = (props) =>{
    const {icon, prizePool, timeLeft, startDate, endsin, type, children} = props;
    // const playicon = "/../../../public/images/playthumbnails/"+icon+".png"
    const playicon = "/../public/images/playthumbnails/"+icon+".png"
    const time = timeLeft.split(':')

    const [day, setDay] = useState(0);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    
    const [deadline, setDeadline] = useState('01 Jan 2023');
    
    function formatTime(time)
        {
            return time < 10 ? ('0'+time) : time;
        }
    
    useEffect(() => {
        setInterval(() => {
          
    
          const currentDate = new Date();
          const endDate = new Date(deadline);
    
          const totalSeconds = (endDate - currentDate) / 1000;
    
          const days = Math.floor(totalSeconds/2600/24);
          const hours = Math.floor(totalSeconds/3600) % 24;
          const minutes = Math.floor(totalSeconds/60) % 60;
          const seconds = Math.floor(totalSeconds) % 60;
    
          setDay(formatTime(days));
          setHour(formatTime(hours));
          setMinute(formatTime(minutes));
          setSecond(formatTime(seconds));
    
    
    
        }, 1000);
      }, []);
    

    return (
        <>
            { type === "completed" ?
                <div className="w-84 h-84">
                    <div className="w-full p-3">
                        <div className="w-full">
                            <Image src={playicon}
                                width="300px"
                                height="263px"
                            />
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                            <div className="">
                                <div className="font-thin text-sm">
                                    PRIZE POOL
                                </div>
                                <div className="text-base font-monument">
                                    ${prizePool}
                                </div>
                            </div>
                            <div className="">
                                <div className="font-thin text-sm">
                                    STATUS
                                </div>
                                <div className="text-base font-monument">
                                    COMPLETE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="w-84 h-96 mb-12">
                    <div className="w-full p-3">
                        <div className="w-full">
                            <Image src={playicon}
                                width="300px"
                                height="263px"
                            />
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                            <div className="">
                                <div className="font-thin text-sm">
                                    PRIZE POOL
                                </div>
                                <div className="text-base font-monument">
                                    ${prizePool}
                                </div>
                            </div>
                            <div className="">
                                <div className="font-thin text-sm">
                                    START DATE
                                </div>
                                <div className="text-base font-monument">
                                    {startDate}
                                </div>
                            </div>
                        </div>

                        <div className="flex mt-2">
                            { type === "new" &&
                                <>
                                    <div className="">
                                        <div className="font-thin text-sm">
                                            REGISTRATION ENDS IN
                                        </div>
                                        <div className="text-sm font-montserrat font-normal flex mt-2 space-x-2">
                                            <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                                {day}
                                            </div>
                                            <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                                {hour}
                                            </div>
                                            <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                                {minute}
                                            </div>
                                            <div className="bg-indigo-darkgray text-indigo-white w-9 h-9 rounded justify-center flex pt-2">
                                                {second}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            { type === "ongoing" &&
                                <>
                                    <div className="">
                                        <div className="font-thin text-sm">
                                            ENDS IN
                                        </div>
                                        <div className="text-sm font-montserrat font-bold flex mt-2">
                                            <div className="bg-indigo-gray rounded-lg py-1.5 px-2 text-indigo-white mr-2">
                                                {time[0]}
                                            </div>
                                            <div className="bg-indigo-gray rounded-lg py-1.5 px-2 text-indigo-white mr-2">
                                                {time[1]}
                                            </div>
                                            <div className="bg-indigo-gray rounded-lg py-1.5 px-2 text-indigo-white">
                                                {time[2]}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
            
        </>
    )
}

PlayComponent.propTypes = {
    icon: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    prizePool: PropTypes.string.isRequired,
    currPlayers: PropTypes.string.isRequired,
    maxPlayers: PropTypes.string.isRequired,
    timeLeft: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

export default PlayComponent;