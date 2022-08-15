import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { tokenDrawData } from '../data/index.js';

const TokenComponent = (props) => {
  const { athlete_id, usage, name, rarity, release, team, isOpen, fantasy_score, img } = props;
  const picLink = img || '/images/tokensMLB/SP.png';
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <div className={`w-32 h-48 transform ${!isOpen ? 'cursor-pointer' : ''} relative`}>
      <div style={{ maxHeight: '210px', maxWidth: '150px', height: '210px', width: '150px' }}>
        {!isOpen ? (
          <object
            data="/images/tokens/0.png"
            style={{ maxHeight: '210px', maxWidth: '150px', height: '210px', width: '150px' }}
          />
        ) : (
          <object
            data={picLink}
            type="image/svg+xml"
            style={{ maxHeight: '210px', maxWidth: '150px' }}
          ></object>
        )}
      </div>
      {isOpen ? (
        <div className="flex whitespace-nowrap text-sm flex-col font-thin">
          <div className="font-black mt-2 text-center">{name.toUpperCase()}</div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

TokenComponent.propTypes = {
  athlete_id: PropTypes.string.isRequired,
  usage: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  rarity: PropTypes.string.isRequired,
  release: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default TokenComponent;
