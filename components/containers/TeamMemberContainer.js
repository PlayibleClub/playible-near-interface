import PropTypes from 'prop-types';

const TeamMemberContainer = (props) => {
  const { children, color, imagesrc, AthleteName, TeamName, AverageScore, id, pos } = props;
  // const image url for SF
  // const image url for PF
  // const image url for SG
  // const image url for PG
  // const image url for C

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
          <div className="text-xs font-thin">#{id}/25000</div>
          <div className="mb-5 text-sm ">{AthleteName}</div>
          <div className="text-xs font-thin">AVERAGE SCORE </div>
          <div className="text-xs">{AverageScore}</div>
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
