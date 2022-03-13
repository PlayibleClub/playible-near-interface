import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CommunityPoolSpendProposal } from '@terra-money/terra.js';


const Teams = (props) =>{
    const {teamName} = props;

    return (
        <>
            <div className="flex mr-20 bg-indigo-black text-indigo-white py-4 text-2xl p-10 font-monument flex justify-between mb-5" >
                {teamName}
                <div className='p-3 bg-indigo-white content-center flex'>
                    <img src='/images/arrowNE.png'/>
                    
                </div>
            </div>
        </>
    )
}

export default Teams;