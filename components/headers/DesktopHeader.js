import PropTypes from 'prop-types';
import React from 'react'

const DesktopHeader = (props) => {
  const { children, color } = props;

  return (
    <div data-test="DesktopHeader" className={`bg-${color} flex flex-row h-12 w-full`}>
      <div className="w-full h-full flex flex-row justify-end border-indigo-lightgray border-opacity-10 bg-indigo-white">
        {children}
      </div>
    </div>
  );
};

DesktopHeader.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopHeader.defaultProps = {
  color: 'indigo-navy',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopHeader;
