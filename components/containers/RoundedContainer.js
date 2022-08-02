import PropTypes from 'prop-types';
import React from 'react';

const RoundedContainer = (props) => {
  const { children, color } = props;

  return (
    <div
      data-test="RoundedContainer"
      className={`bg-${color} flex justify-center relative rounded-md w-full  `}
    >
      {children}
    </div>
  );
};

RoundedContainer.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

RoundedContainer.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default RoundedContainer;
