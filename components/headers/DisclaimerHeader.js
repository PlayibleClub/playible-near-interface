import PropTypes from 'prop-types';
import disclaimer from '../../public/images/disclaimer.png'
import Image from 'next/link'
import React from 'react'

const DisclaimerHeader = (props) => {
  const { children, color } = props;

  return (
    <div data-test="DisclaimerHeader" className={`flex flex-row h-16 w-full px-10 mt-14`}>
        <div className="w-full h-full flex items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-2 pl-5">
            <div className="mr-8">
                <img src={disclaimer} className=""/>
            </div>
            <div className="text-xs">
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
