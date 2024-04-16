import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSportType } from 'data/constants/sportConstants';

const StatsCategoryComponent = (props) => {
  const { onChangeFn, currentSport } = props;
  const [selectedOptions, setSelectedOptions] = useState(['ALL']);
  const statOptions = getSportType(currentSport).statCategories;

  const handleCheckboxChange = (value) => {
    if (value === 'ALL') {
      setSelectedOptions(['ALL']);
    } else {
      setSelectedOptions((prevState) => {
        if (prevState.includes('ALL')) {
          return [value];
        } else {
          return prevState.includes(value)
            ? prevState.filter((item) => item !== value)
            : [...prevState, value];
        }
      });
    }
  };

  useEffect(() => {
    onChangeFn(selectedOptions);
  }, [selectedOptions]);

  return (
    <form>
      <label className="font-monument" htmlFor="positions">
        STAT CATEGORIES FOR {currentSport}
      </label>
      <div className="grid grid-cols-1 gap-1">
        {statOptions.map(({ label, value }, index) => (
          <div key={index}>
            <label className="flex items-center">
              <input
                type="checkbox"
                name={value}
                value={value}
                checked={selectedOptions.includes(value)}
                onChange={() => handleCheckboxChange(value)}
              />
              <span className="ml-2">{label}</span>
            </label>
          </div>
        ))}
      </div>
    </form>
  );
};

StatsCategoryComponent.propTypes = {
  onChangeFn: PropTypes.func,
  currentSport: PropTypes.string,
};

export default StatsCategoryComponent;
