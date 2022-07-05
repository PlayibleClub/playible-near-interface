import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import moment from 'moment';
import sampleImage from '../../../public/images/packimages/Starter.png'


const PackComponent = (props) => {
    const { type, id } = props

    return (
        <div>
            <div>
                <Image
                    src={sampleImage}
                    height={200}
                    width={200}
                />
            </div>
            <div className="ml-6">
                #{id}
            </div>
        </div>
    )
}

export default PackComponent;