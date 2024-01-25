import PropTypes from 'prop-types';
import React from 'react';

const MarketplaceButtonContainer = (props) => {
  const { imagesrc, Title } = props;

  return (
    <div>
      <div
        data-test="MarketplaceButtonContainer"
        className="text-sm font-thin flex flex-row justify-left mt-4 ml-12 py-2"
      >
        <img className="h-4 w-4 mr-5 place-self-center" src={imagesrc} alt="Img" />
        <a>{Title}</a>
      </div>
    </div>
  );
};

MarketplaceButtonContainer.propTypes = {
  imagesrc: PropTypes.string,
  Title: PropTypes.string,
  activeName: PropTypes.string,
};

MarketplaceButtonContainer.defaultProps = {
  imagesrc: 'images/tokens/0.png',
  children: <div />,
};

export default MarketplaceButtonContainer;
