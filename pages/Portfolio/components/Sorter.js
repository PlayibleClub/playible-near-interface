import React, { useState } from 'react'
import { sortOptions } from '../data';

import filterIcon from '../../../public/images/filter.png'
import searchIcon from '../../../public/images/search.png'

const Sorter = (props) => {
  const {
    list, //current value of the state
    setList, //set state for the sorter/filtered list
    setSearchText
  } = props

  const handleSort = (mode) => {
    const tempList = list;
    const sortMode = sortOptions.filter((option) => option.key == mode)[0]
    tempList.sort(sortMode.sorter)
    setList([...tempList])
  }

  return (
    <div className="flex md:mt-5 md:mr-6 invisible md:visible">
      <div className="bg-indigo-white mr-1 h-11 w-64 flex font-thin border-2 border-indigo-lightgray border-opacity-40">
          <select value={"default"} className="bg-indigo-white ml-3 text-lg" onChange={(e) => handleSort(e.target.value)}>
            {sortOptions.map((option) => <option value={option.key}>{option.name}</option>)}
          </select>
          <img src={filterIcon} className="object-none w-3/12 mr-4" />
      </div>
        <div className="bg-indigo-white border-2 border-indigo-lightgray border-opacity-40 ml-1 h-11 w-60">
            <div className="mt-1.5">
              <input onChange={(e) => { setSearchText(e.target.value) }} className="text-xl text-indigo-black ml-3 appearance-none bg-indigo-white focus:outline-none w-40" placeholder="Search..." />
              <button className="">
                  <input type="image" src={searchIcon} className="object-none ml-8 mt-1" />
              </button>
            </div>
        </div>
    </div>
  )
}
export default Sorter;