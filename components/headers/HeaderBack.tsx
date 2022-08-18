import React from 'react';
import PropTypes from 'prop-types';
import Header from '../headers//Header';
import Button from '../buttons/Button';
import Link from 'next/link';
const HeaderBack = (props) => {
  const { link, color } = props;

  return (
    <Header>
      <div className="w-full">
        <div className="mb-3 ml-3 float-left">
          <Link href={link}>
            <Button color="clear" saturation="0" textColor="white-light" textSaturation="500">
              {' '}
              &lt; Back
            </Button>
          </Link>
        </div>
      </div>
    </Header>
  );
};

HeaderBack.propTypes = {
  link: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

HeaderBack.defaultProps = {
  link: '/',
  children: <div />,
};

export default HeaderBack;
