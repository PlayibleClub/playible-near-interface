import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png';
import { assertDirective } from 'graphql';
import Link from 'next/link';

const PackComponent = (props) => {
  const { image, id, owner, sport, media } = props;

  let href = '';

  switch (true) {
    case media.includes('nfl'):
      href = `/PackDetails/football/${encodeURIComponent(id)}/`;
      break;
    case media.includes('nba'):
      href = `/PackDetails/basketball/${encodeURIComponent(id)}/`;
      break;
    case media.includes('ipl'):
      href = `/PackDetails/cricket/${encodeURIComponent(id)}/`;
      break;
    case media.includes('mlb'):
      href = `/PackDetails/baseball/${encodeURIComponent(id)}/`;
      break;
    default:
      href = `/PackDetails/${sport.toLowerCase()}/${encodeURIComponent(id)}/`;
  }

  return (
    <div className="iphone5:w-36 md:w-48">
      <div className="iphone5:ml-5 md:ml-5">#{id}</div>
      <div className="pointer-events-auto cursor-pointer hover:-translate-y-1 transform transition-all">
        <button>
          <Link href={href} passHref>
            <img src={image} height={200} width={200} />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default PackComponent;
