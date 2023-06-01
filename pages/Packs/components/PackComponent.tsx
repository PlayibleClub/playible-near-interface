import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png';
import { assertDirective } from 'graphql';
import Link from 'next/link';

const PackComponent = (props) => {
  const { image, id, owner, sport } = props;

  const selectedPack = id;

  function getSelectedId(id) {
    id = selectedPack;

    return id;
  }

  return (
    <div className="iphone5:w-36 md:w-48">
      <div className="iphone5:ml-5 md:ml-5">#{id}</div>
      <div className="pointer-events-auto cursor-pointer hover:-translate-y-1 transform transition-all">
        <button>
          <Link href={`/PackDetails/${sport.toLowerCase()}/${encodeURIComponent(id)}/`} passHref>
            <img src={image} height={200} width={200} />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default PackComponent;
