import React, { useState } from 'react';
import filterIcon from '../../../public/images/filterBlack.png';
import searchIcon from '../../../public/images/searchBlack.png';

const Sorter = (props) => {
  const {
    list, //current value of the state
    setList, //set state for the sorter/filtered list
    setSearchText,
    filterHandler,
    filterValue
  } = props;

  const [sortMode, setSortMode] = useState(null);

  const sortOptions = [
    {
      name: 'By Name',
      value: 'name',
    },
    {
      name: 'By Team',
      value: 'team',
    },
    {
      name: 'By Position',
      value: 'position',
    },
  ];

  const handleSort = (mode) => {
    setSortMode(mode);
  };

  return (
    <>
      <div className="flex md:mt-5 md:mr-6 invisible md:visible">
        <div className="bg-indigo-white mr-2 h-11 w-64 flex items-center font-thin border-2 border-indigo-lightgray border-opacity-40 relative">
          <select
            value={filterValue}
            className="bg-indigo-white px-3 text-lg w-full outline-none"
            onChange={(e) => {
              // handleSort(e.target.value);
              filterHandler(e.target.value);
            }}
          >
            <option value={null}>All</option>
            {sortOptions.map((option) => (
              <option value={option.value}>{option.name}</option>
            ))}
          </select>
          <img src={filterIcon} className="object-none w-1/12 absolute right-0 mr-2" />
        </div>
        <div className="bg-indigo-white border-2 border-indigo-lightgray border-opacity-40 ml-1 h-11 w-60">
          <div className="mt-1.5">
            <input
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="text-xl text-indigo-black ml-3 appearance-none bg-indigo-white focus:outline-none w-40"
              placeholder="Search..."
            />
            <button className="">
              <input type="image" src={searchIcon} className="object-none ml-8 mt-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sorter;
