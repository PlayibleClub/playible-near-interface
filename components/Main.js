import React from 'react'

const Main = (props) => {
  const { children, color } = props;

  return (
    <div data-test="Main" className={`bg-${color} flex flex-col w-full h-full iphone5:overflow-y-scroll lg:overflow-y-auto order-last mt-4 mb-20 z-0`}>
      {children}
    </div>
  );
};


export default Main;
