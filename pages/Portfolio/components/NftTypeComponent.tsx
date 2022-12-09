import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NftTypeComponent = (props) => {
  return (
    <form>
      <div className="flex flex-col float-right mr-60">
        NFT Type
        <div className="ml-9">
          <div>
            <input type="checkbox" value="Regular"></input>
            <label>Regular</label>
          </div>
          <div>
            <input type="checkbox" value="Soulbound"></input>
            <label>Soulbound</label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NftTypeComponent;
