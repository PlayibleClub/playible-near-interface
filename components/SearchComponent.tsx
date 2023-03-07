import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SearchComponent = (props) => {
  const { onChangeFn, onSubmitFn } = props;
  const [search, setSearch] = useState('');

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log(search);
      onChangeFn([search]);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitFn(search === '' ? ['allNames'] : [search]);
        }}
      >
        <div className="relative">
          <input
            type="search"
            id="default-search"
            onChange={(e) => setSearch(e.target.value !== '' ? e.target.value : 'allNames')}
            className=" bg-indigo-white w-36  pl-2 iphone5:w-11/12 md:w-60 lg:w-72 text-xs md:text-base
                  ring-2 ring-offset-4 ring-indigo-black ring-opacity-25 focus:ring-2 focus:ring-indigo-black 
                  focus:outline-none"
            placeholder="Search Athlete"
          />
          <button
            type="submit"
            className="invisible md:visible  bg-search-icon bg-no-repeat bg-center absolute -right-12 bottom-0 h-full
                  pl-6 py-2 ring-2 ring-offset-4 ring-indigo-black ring-opacity-25
                  focus:ring-2 focus:ring-indigo-black"
          ></button>
        </div>
      </form>
    </>
  );
};
SearchComponent.propTypes = {
  onChangeFn: PropTypes.func,
  onSubmitFn: PropTypes.func,
};
export default SearchComponent;
