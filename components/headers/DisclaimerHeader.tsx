import PropTypes from 'prop-types';
import disclaimer from '../../public/images/disclaimer.png';
import Image from 'next/link';
import React, { useState } from 'react';

const DisclaimerHeader = (props) => {
  const { children, color } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      data-test="DisclaimerHeader"
      className={
        `flex flex-row h-20 md:h-16 w-full px-6 md:px-10 mt-28 md:mt-14 md:ml-2 ` +
        (isOpen ? '' : 'hidden')
      }
    >
      <div className="w-full h-full flex items-center bg-indigo-buttonblue font-montserrat text-indigo-white p-4 pl-5">
        <div className="mr-8 flex justify-center md:h-auto md:w-auto h-auto w-20">
          <img src={disclaimer} className="" />
        </div>
        <div className="text-xs">
          WE ARE IN CONTACT WITH SECURITY AUDIT, UNTIL A FULL AUDIT REPORT WE RECOMMEND TO USE
          PLAYIBLE AT YOUR OWN DISCRETION AND RISK.
        </div>
        <button type="button" className="" onClick={() => setIsOpen(false)}>
          x
        </button>
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
