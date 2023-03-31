import PropTypes from 'prop-types';
import React from 'react';
// import RoundedContainer from './containers/RoundedContainer';
// import GameResultContainer from './containers/GameResultContainer';

const list = [
  {
    win: 'yes',
    date: '07/12/21',
    rank: '02',
    points: '96.5',
  },
  {
    win: 'no',
    date: '07/05/21',
    rank: '07',
    points: '78.4',
  },
  {
    win: 'yes',
    date: '06/28/21',
    rank: '01',
    points: '98.7',
  },
  {
    win: 'no',
    date: '07/05/21',
    rank: '09',
    points: '55.0',
  },
  {
    win: 'no',
    date: '07/13/21',
    rank: '03',
    points: '23.0',
  },
];

const GameResultsComponent = (props) => {
  const { children, color, date, rank, points } = props;

  return (
    <div data-test="GameResultsComponent" className={`w-10/12 mt-5`}>
      {/* <RoundedContainer>
        <select className="w-5/6 bg-indigo-light p-2" name="games" id="cars">
          <option value="All Games">All Games</option>
          <option value="Some games">Some Games</option>
          <option value="Games this week">Games this week</option>
          <option value="Games for the month">Games for the month</option>
        </select>
      </RoundedContainer>

      <div className="mt-6">
        <RoundedContainer>
          <ul className="w-11/12">
            {list.map((data) => (
              <li>
                <GameResultContainer
                  date={data.date}
                  rank={data.rank}
                  points={data.points}
                  win={data.win}
                ></GameResultContainer>
              </li>
            ))}
          </ul>
        </RoundedContainer>
      </div> */}
    </div>
  );
};

GameResultsComponent.propTypes = {
  color: PropTypes.string,
  date: PropTypes.string,
  rank: PropTypes.string,
  points: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

GameResultsComponent.defaultProps = {
  color: 'indigo-light',
  date: '07/12/21',
  rank: '07',
  points: '78.4',

  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default GameResultsComponent;
