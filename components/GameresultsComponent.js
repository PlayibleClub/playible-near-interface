import PropTypes from 'prop-types';
import RoundedContainer from './RoundedContainer';
import GameResultContainer from './GameResultContainer';
const animals = ['Dog', 'Bird', 'Cat', 'Mouse', 'Horse'];

const GameResultsComponent = (props) => {
  const { children, color, date, rank, points } = props;

  return (
    <div data-test="GameResultsComponent" className={`w-9/12 mt-5`}>

      <RoundedContainer>
        <select className="w-5/6 bg-indigo-light p-2" name="games" id="cars">
          <option value="All Games">All Games</option>
          <option value="Some games">Some Games</option>
          <option value="Games this week">Games this week</option>
          <option value="Games for the month">Games for the month</option>
        </select>
      </RoundedContainer>

      <div className="mt-2">
        <RoundedContainer >

          <ul className="w-11/12">
            {animals.map((animal) => (
              <li><GameResultContainer></GameResultContainer></li>

            ))}
          </ul>
        </RoundedContainer>
      </div>

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
