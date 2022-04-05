import PropTypes from 'prop-types';
import React from 'react'

const TokenGridCol4 = (props) => {
  const { children, color } = props;

  return (
    <div data-test="TokenGridCol4" className={`bg-${color} grid justify-items-center  gap-x-1 gap-y-2 grid-cols-4 w-full h-full`}>
      {children}
    </div>
  );
};

TokenGridCol4.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TokenGridCol4.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default TokenGridCol4;
