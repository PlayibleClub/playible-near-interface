import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png';
import { assertDirective } from 'graphql';
import { getServerSideProps } from 'pages/PackDetails';
import Link from 'next/link';

const PackComponent = (props) => {
  const { image, id, owner } = props;  

  const selectedPack = id;
  
  function getSelectedId(id) {
    id = selectedPack;

    return id;
  }

  const handleClick = (e, path) => {
    if (path === "/") {
      console.log("Clicked on Pack#" + id);
    }
  }

  // as={`/PackDetails/${id}`}

  return (
    <div className="md:w-48">
      <div className="ml-5">NFL#{id}</div>
      <div className="pointer-events-auto">
        <Link href={{pathname: "/PackDetails", query: {token_id: id}}} as={`/PackDetails/${id}`}>
        <a onClick={(e) => handleClick(e, "/")}>
          <input type="image" src={image ? image : sampleImage} height={200} width={200}></input>
        </a>
        </Link>
      </div>
    </div>
  );
};

export default PackComponent;