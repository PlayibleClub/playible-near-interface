import React from 'react';

const Main = (props) => {
  const { children, color } = props;

  return (
    <div
      data-test="Main"
      className={`bg-${color} overflow-y-auto flex flex-col w-full h-full order-last mt-4 md:mb-20 z-0`}
    >
      {children}
    </div>
  );
};

export default Main;
