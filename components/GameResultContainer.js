import PropTypes from 'prop-types';

const GameResultContainer = (props) => {
  const { children, color, date, rank, points } = props;

  return (
    <div data-test="GameResultContainer" className={`bg-${color} flex flex-row justify-between  w-full `}>

      {children}

      <div>{date}</div>
      <div>{rank}</div>
      <div>{points}</div>

      <br></br>

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
