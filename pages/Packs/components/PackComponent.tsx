import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png';
import { assertDirective } from 'graphql';

const PackComponent = (props) => {
  const { image, id } = props;  

  const selectedPack = id;
  
  function getSelectedId(id) {
    id = selectedPack;

    return id;
  }

  return (
    <div className="md:w-48">
      <div className="ml-5">NFL#{id}</div>
      <div className="pointer-events-auto">
        <button onClick={() => console.log("You clicked on Pack#" , getSelectedId(selectedPack))}>
          <input type="image" src={image ? image : sampleImage} height={200} width={200}></input>
        </button>
      </div>
    </div>
  );
};

export default PackComponent;
