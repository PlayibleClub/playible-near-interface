import PropTypes from 'prop-types';

const LargePackContainer = (props) => {
  const { children, color, imagesrc, PackName, releaseValue, CoinValue } = props;

  return (
    <div data-test="LargePackContainer" className={`bg-${color}   overflow-hidden  flex flex-col  w-full  `}>
      <div className="flex">
        <img src={imagesrc} alt="Img" />

      </div>
      {children}
      <div className="flex w-full justify-center">
        <div className=" flex flex-col w-4/5">
          <div className="flex flex-row justify-between w-full">
            <div className="  pb-3  ">{PackName}</div>
            <div>{CoinValue}</div>
          </div>
          <div className="  text-md font-light">Release {releaseValue}</div>
          <div className="  text-xs font-bold">

            {' '}

          </div>
        </div>
      </div>
    </div>
  );
};

LargePackContainer.propTypes = {
  color: PropTypes.string,
  PackName: PropTypes.string.isRequired,
  releaseValue: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

LargePackContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/yellow.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default LargePackContainer;
