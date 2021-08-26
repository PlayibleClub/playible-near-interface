import PropTypes from 'prop-types';

const TeamMemberContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, Averagescore, rank } = props;

  return (
    <div data-test="TeamMemberContainer" className={`bg-${color}  sx-${TeamName} w-full h-full overflow-hidden  flex flex-col  self-center `}>
      <div className="flex  self-center h-2/3">
        <img src={imagesrc} alt="Img" className="flex " />

      </div>
      {children}
      <div className="relative h-1/3">
        <div className="absolute flex flex-col bottom-0 left-1">
          <div className="  text-xs font-thin">#{rank}/25000</div>
          <div className="  pb-3 text-sm font-thick ">{AthleteName}</div>
          <div className="  text-xs font-thin">AVERAGE SCORE </div>
          <div className="  text-xs  font-thick">
            {Averagescore}
            {' '}

          </div>
        </div>
      </div>
    </div>
  );
};

TeamMemberContainer.propTypes = {
  color: PropTypes.string,
  rank: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  Averagescore: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TeamMemberContainer.defaultProps = {
  rank: '0',
  color: 'sds',
  Averagescore: '-',
  AthleteName: '-',
  imagesrc: 'images/token.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default TeamMemberContainer;
