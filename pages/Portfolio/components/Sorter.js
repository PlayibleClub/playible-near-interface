import React, { useRef, useState } from 'react';
import filterIcon from '../../../public/images/icons/Filter.svg';
import searchIcon from '../../../public/images/icons/Search.svg';

const Sorter = (props) => {
  const {
    list, //current value of the state
    setList, //set state for the sorter/filtered list
    setSearchText,
    filterHandler,
    filterValue,
    resetOffset
  } = props;

  const [sortMode, setSortMode] = useState(null);
  const searchRef = useRef('')

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
  
  const searchHandler = () => {
    if (searchRef.current.value) {
      setSearchText(searchRef.current.value)
    } else {
      setSearchText('')
    }
    resetOffset()
  }

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
          <img src={filterIcon} className="w-6 h-6 mr-2" />
        </div>
        <div className="bg-indigo-white border-2 border-indigo-lightgray border-opacity-40 ml-1 h-11 w-60">
          <div className="mt-1.5 relative flex items-center">
            <input
              ref={searchRef}
              className="text-xl text-indigo-black ml-3 appearance-none bg-indigo-white focus:outline-none w-40"
              placeholder="Search..."
            />
            <button className="flex items-center absolute right-0 mr-5" onClick={searchHandler}>
              <img className="ml-2 w-6 h-6" src={searchIcon} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sorter;
