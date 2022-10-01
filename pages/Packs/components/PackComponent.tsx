import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png';
import { assertDirective } from 'graphql';
import Link from 'next/link';

const PackComponent = (props) => {
  const { image, id, owner } = props;

  const selectedPack = id;

  function getSelectedId(id) {
    id = selectedPack;

    return id;
  }

  return (
    <div className="md:w-48">
      <div className="ml-5">NFL#{id}</div>
      <div className="pointer-events-auto">
        <button>
          <Link href={`/PackDetails/${id}`} passHref>
            <img src={image} height={200} width={200} />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default PackComponent;
