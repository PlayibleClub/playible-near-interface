import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const ModalPortfolioContainer = (props) => {
  const { color, textcolor, size, title, children, align, stats, accountId } = props;
  const avgicon = '/../../public/images/avgscore.png';

  return (
    <>
      <div
        data-test="ModalPortfoliocontainer"
        className={`text-${textcolor} bg-${color} text-${size} font-bold ${align} flex flex-col `}
      >
        <div className="flex">
          {stats ? (
            <div className="flex w-full">
              <div className="w-2/3 text-2xl pb-3 pt-20 md:pt-14 justify-between align-center">
                {title} | {accountId}
                <div className="underlineBig" />
              </div>
              <div
                className="w-32 h-32"
                style={{
                  backgroundImage: `url('/images/avgscore.png')`,
                  backgroundRepeat: 'no-repeat',
                  width: '135px',
                  height: '135px',
                }}
              >
                <div className="text-center text-2xl w-full mt-14 text-indigo-white">{stats}</div>
              </div>
            </div>
          ) : (
            <div className="pb-3 pt-6 justify-start align-center text-2xl font-monument">
              {title} | {accountId}
              <div className="underlineBig" />
            </div>
          )}
        </div>
        <div className="flex justify-center flex-col">{children}</div>
      </div>
      {/* </BrowserView> */}
    </>
  );
};

ModalPortfolioContainer.propTypes = {
  title: PropTypes.string.isRequired,
  textcolor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  align: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  stats: PropTypes.number,
  accountId: PropTypes.string,
};

ModalPortfolioContainer.defaultProps = {
  textcolor: 'white-light',
  color: 'white',
  size: '1xl',
  align: 'justify-start',
  children: <div />,
};

export default ModalPortfolioContainer;
