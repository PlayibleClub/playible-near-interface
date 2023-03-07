import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setSportTypeRedux } from 'redux/athlete/sportSlice';
const SportType = (props) => {
  const { sportTypes } = props;
  const dispatch = useDispatch();
  //TODO: set default value via redux instead of hard coded
  return (
    <>
      <form className="flex items-center align-middle justify-center">
        <select
          onChange={(e) => {
            e.preventDefault();
            dispatch(setSportTypeRedux(e.target.value));
          }}
          className="ml-20 mr-20 bg-filter-icon bg-no-repeat bg-right bg-indigo-white
       cursor-pointer text-xs md:w-24 w-6 ring-2 ring-offset-4 ring-indigo-black ring-opacity-25"
        >
          {sportTypes.map((type) => {
            return <option value={type}>{type}</option>;
          })}
        </select>
      </form>
    </>
  );
};
SportType.propTypes = {
  sportTypes: PropTypes.array,
};
export default SportType;
