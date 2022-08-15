import React, { useState } from 'react';

import underlineIcon from '../../../public/images/blackunderline.png';

const CongratsModal = (props) => {
  const {
    onClose, //displayCongrats(false)
  } = props;

  return (
    <div className="fixed w-screen h-screen bg-opacity-70 z-50 overflow-auto bg-indigo-gray flex">
      <div className="relative p-8 bg-indigo-white w-60 h-24 m-auto flex-col flex rounded-lg items-center">
        <button
          onClick={() => {
            onClose();
          }}
        >
          <div className="absolute top-0 right-0 p-4 font-black">X</div>
        </button>

        <div className="font-bold flex flex-col">
          CONGRATULATIONS!
          <img src={underlineIcon} className="sm:object-none md:w-6" />
        </div>
      </div>
    </div>
  );
};
export default CongratsModal;
