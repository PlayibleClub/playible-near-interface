import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NftTypeComponent = (props) => {
  const { onChangeFn } = props;

  const [selectedRegular, setSelectedRegular] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState(true);

  const handleRegularChange = (event) => {
    setSelectedRegular(event.target.checked);
    onChangeFn(selectedRegular, selectedPromo);
  };

  const handlePromoChange = (event) => {
    setSelectedPromo(event.target.checked);
    onChangeFn(selectedRegular, selectedPromo);
  };

  useEffect(() => {
    onChangeFn(selectedRegular, selectedPromo);
  }, [selectedRegular, selectedPromo]);

  return (
    <form>
      <div className="flex flex-col float-right mr-40">
        NFT Type
        <div className="ml-9">
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
              name="Promo"
              value="Promo"
              checked={selectedPromo}
              onChange={handlePromoChange}
            />
            Soulbound
          </div>
        </div>
      </div>
    </form>
  );
};
NftTypeComponent.propTypes = {
  onChangeFn: PropTypes.func,
};
export default NftTypeComponent;
