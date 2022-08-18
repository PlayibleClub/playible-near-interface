import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

const NavButtonContainer = (props) => {
  const { children, color, imagesrc, Title, TeamName, CoinValue, path, activeName } = props;

  return (
    <Link href={path}>
      <div className={Title === activeName ? 'border-l-4' : 'pl-1'}>
        <div
          data-test="NavButtonContainer"
          className="text-sm font-thin flex flex-row justify-left mt-4 ml-12 py-2"
        >
          <img className="h-4 w-4 mr-5 place-self-center" src={imagesrc} alt="Img" />
          <a>{Title}</a>
        </div>
      </div>
    </Link>
  );
};

NavButtonContainer.propTypes = {
  color: PropTypes.string,
  Title: PropTypes.string,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string,
  imagesrc: PropTypes.string,
  path: PropTypes.string,
  activeName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

NavButtonContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default NavButtonContainer;
