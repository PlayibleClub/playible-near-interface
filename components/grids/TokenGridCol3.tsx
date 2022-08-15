import PropTypes from 'prop-types';
import React from 'react';

const TokenGridCol3 = (props) => {
  const { children, color } = props;

  return (
    <div
      data-test="TokenGridCol3"
      className={`bg-${color} grid justify-items-center gap-x-1 gap-y-2 grid-cols-3 w-full h-full`}
    >
      {children}
    </div>
  );
};

TokenGridCol3.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TokenGridCol3.defaultProps = {
  color: 'pink',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default TokenGridCol3;
