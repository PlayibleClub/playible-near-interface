import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const AdminGameFilter = (props) => {
    const { onChangeFn } = props;
  
    const [selectedRegular, setSelectedRegular] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(true);
    const [selectedSoulbound, setSelectedSoulbound] = useState(true);
  
    const handleRegularChange = (event) => {
      setSelectedRegular(event.target.checked);
      console.log("Selected Regular:", event.target.checked);
      onChangeFn(selectedRegular, selectedPromo, selectedSoulbound);
    };
  
    const handlePromoChange = (event) => {
      setSelectedPromo(event.target.checked);
      console.log("Selected Promo:", event.target.checked);
      onChangeFn(selectedRegular, selectedPromo, selectedSoulbound);
    };

    const handleSoulboundChange = (event) => {
      setSelectedSoulbound(event.target.checked);
      console.log("Selected Soulbound:", event.target.checked);
      onChangeFn(selectedRegular, selectedPromo, selectedSoulbound);
    };
  
  
    useEffect(() => {
      onChangeFn(selectedRegular, selectedPromo, selectedSoulbound);
    }, [selectedRegular, selectedPromo, selectedSoulbound]);
  
    return (
      <form>
        <div className="flex text-sm md:text-base flex-col iphone5:float-left iphone5:ml-5 md:float-right md:mr-10 md:mr-40 mt-0 md:mt-0">
          NFT Type
          <div className="flex iphone5:flex-row md:flex-col md:ml-9 iphone5:mt-2">
            <div className="iphone5:mr-4 ">
              <input
                type="checkbox"
                name="Promo"
                value="Promo"
                checked={selectedPromo}
                onChange={handlePromoChange}
              />
              Promotional
            </div>
            <div>
              <input
                type="checkbox"
                name="Regular"
                value="Regular"
                // @ts-ignore:next-line
                checked={selectedRegular}
                onChange={handleRegularChange}
              />
              Regular
            </div>
            <div>
            <input
              type="checkbox"
              name="Soulbound"
              value="Soulbound"
              // @ts-ignore:next-line
              checked={selectedSoulbound}
              onChange={handleSoulboundChange}
            />
            Soulbound
          </div>
          </div>
        </div>
      </form>
    );
  };
  AdminGameFilter.propTypes = {
    onChangeFn: PropTypes.func,
  };
  export default AdminGameFilter;