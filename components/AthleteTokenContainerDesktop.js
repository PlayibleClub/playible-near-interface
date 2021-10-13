import PropTypes from 'prop-types';

const AthleteTokenContainerDesktop = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, CoinValue } = props;

  return (
    <div data-test="AthleteTokenContainerDesktop" className={`bg-${color} sx-${TeamName} w-full h-full overflow-hidden flex flex-col`}>
      <div className="h-2/3 w-3/4 flex place-self-center">
        <img src={imagesrc} alt="Img" className="object-non " />

      </div>
      {children}
      <div className=" h-1/3 ml-4">
        <div className=" flex flex-col ">
          <div className="pb-3 text-sm font-extrabold ">{AthleteName}</div>
          <div className="text-xs font-thin">LOWEST ASK </div>
          <div className="text-xs font-extrabold">
            {CoinValue}
            {' '}
            UST
          </div>
        </div>
      </div>
    </div>
  );
};

AthleteTokenContainerDesktop.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteTokenContainerDesktop.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteTokenContainerDesktop;
