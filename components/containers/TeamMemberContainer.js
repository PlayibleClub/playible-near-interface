import PropTypes from 'prop-types';

const TeamMemberContainer = (props) => {
  const { children, color, imagesrc, player, TeamName, score, id, pos } = props;

  return (
    <div data-test="TeamMemberContainer" className={`bg-${color}  sx-${TeamName} w-full h-full overflow-hidden flex flex-col`}>
      <div className="flex justify-center h-2/4">
        <img src={imagesrc} alt="Img" className="flex" />

        {/* conditional div for SF */}
        {/* conditional div for PF */}
        {/* conditional div for SG */}
        {/* conditional div for PG */}
        {/* conditional div for C */}

      </div>
      {children}
      <div className="flex justify-center" >
        <div className="flex flex-col mt-4">
        <div className="text-xs font-thin">
            #{id === '' ? '0' : id}
        </div>
        <div className="mb-3 text-sm ">{player === '' ? '-' : player}</div>
        <div className="text-xs font-thin">FANTASY SCORE </div>
        <div className="text-xs">{score === '' ? '-' : score}</div>
        </div>
      </div>
    </div>
  );
};

TeamMemberContainer.propTypes = {
  color: PropTypes.string,
  id: PropTypes.string,
  AthleteName: PropTypes.string,
  TeamName: PropTypes.string,
  AverageScore: PropTypes.string,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

TeamMemberContainer.defaultProps = {
  id: '0',
  color: '',
  AverageScore: '-',
  AthleteName: '-',
  imagesrc: 'images/tokens/0.png',
  children: <div />,
};

export default TeamMemberContainer;
