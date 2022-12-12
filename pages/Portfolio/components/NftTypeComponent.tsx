import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NftTypeComponent = (props) => {
  const { onChangeFn } = props;

  const [selected, setSelected] = useState(false);
  const [selected2, setSelected2] = useState(false);

  const handleChange = (event) => {
    if (event.target.value === selected) {
      setSelected(false);
    } else if (event.target.value === selected2) {
      setSelected2(false);
    } else if (event.target.value === 'Regular') {
      setSelected(event.target.value);
    } else if (event.target.value === 'Soulbound') {
      setSelected2(event.target.value);
    }
  };

  useEffect(() => {
    onChangeFn(selected, selected2);
  }, [selected, selected2]);
  return (
    <form>
      <div className="flex flex-col float-right mr-60">
        NFT Type
        <div className="ml-9">
          <div>
            <input type="radio" value="Regular" checked={selected} onChange={handleChange} />
            Regular
          </div>
          <div>
            <input type="radio" value="Soulbound" checked={selected2} onChange={handleChange} />
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
