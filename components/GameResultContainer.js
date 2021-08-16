import PropTypes from 'prop-types';

const GameResultContainer = (props) => {
  const { children, color, date, rank, points } = props;

  return (
    <div data-test="GameResultContainer" className={`bg-${color} mt-4 flex flex-col justify-center  w-full `}>


      <div className="  flex flex-row justify-between mb-4   w-full">
        <div className="font-thin">{date}</div>
        <div className="flex flex-col">
          <p className="font-thin">RANK</p>
          {rank}
        </div>
        <div className="flex flex-col">
          <p className="font-thin">POINTS</p>
          {points}
        </div>


      </div>
      <hr className="w-5/6 " />

    </div>
  );
};

GameResultContainer.propTypes = {
  color: PropTypes.string,
  date: PropTypes.string,
  rank: PropTypes.string,
  points: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

GameResultContainer.defaultProps = {

  color: 'indigo-light',
  date: '07/12/21',
  rank: '07',
  points: '78.4',

  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default GameResultContainer;
