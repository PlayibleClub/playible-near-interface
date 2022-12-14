import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NftTypeComponent = (props) => {
  const { onChangeFn } = props;

  const [selectedRegular, setSelectedRegular] = useState('Regular');
  const [selectedPromo, setSelectedPromo] = useState(false);

  const handleChange = (event) => {
    if (event.target.value === selectedRegular) {
      // @ts-ignore:next-line
      setSelectedRegular(false);
    } else if (event.target.value === selectedPromo) {
      setSelectedPromo(false);
    } else if (event.target.value === 'Regular') {
      setSelectedRegular(event.target.value);
    } else if (event.target.value === 'Promo') {
      setSelectedPromo(event.target.value);
    }
  };

  useEffect(() => {
    onChangeFn(selectedRegular, selectedPromo);
  }, [selectedRegular, selectedPromo]);
  return (
    <form>
      <div className="flex flex-col float-right mr-60">
        NFT Type
        <div className="ml-9">
          <div>
            <input
              type="radio"
              name="Regular"
              value="Regular"
              // @ts-ignore:next-line
              checked={selectedRegular}
              onChange={handleChange}
            />
            Regular
          </div>
          <div>
            <input
              type="radio"
              name="Promo"
              value="Promo"
              checked={selectedPromo}
              onChange={handleChange}
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
