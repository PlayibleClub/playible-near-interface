import PropTypes from 'prop-types';
import disclaimer from '../../public/images/disclaimer.png'
import Image from 'next/link'
import React from 'react'

const DisclaimerHeader = (props) => {
  const { children, color } = props;

  return (
    <div data-test="DisclaimerHeader" className={`bg-${color} flex flex-row h-16 w-full mt-24 md:mt-0`}>
        <div className="w-full h-full flex align-middle bg-indigo-buttonblue font-montserrat text-indigo-white p-2">
            <div className="mr-2">
                <img src={disclaimer} className="w-12 md:w-6 h-4 mt-4"/>
            </div>
            <div className="text-xs md:text-base">
              WE ARE IN CONTACT WITH SECURITY AUDIT, UNTIL A FULL AUDIT REPORT WE 
              RECOMMEND TO USE PLAYIBLE AT YOUR OWN DISCRETION AND RISK.
            </div>
      </div>
    </div>
  );
};

DisclaimerHeader.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DisclaimerHeader.defaultProps = {
  color: 'indigo-navy',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DisclaimerHeader;
