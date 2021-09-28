import PropTypes from 'prop-types';
import warriorLogo from '../public/images/warriors.png';

const AthleteContainer = (props) => {
  const { children, colorgrad1, colorgrad2, AthleteName, TeamName, CoinValue, Positions, Jersey, ID } = props;
  const pos = Positions;


  function getLastWord(words) {
    var n = words.split(" ");
    return n[n.length - 1];

  }

  return (
    <div data-test="AthleteContainer" className={`bg-gradient-to-r from-${colorgrad1} to-${colorgrad2} flex flex-col rounded-md h-full`}>
      <div className="flex flex-col h-10/12">
        {children}
        <div className="mt-4 ml-4 text-xs">#{ID}/25000</div>
        <div className="flow-root">
          <div className=" mt-1 ml-4 text-lg float-left">{AthleteName}</div>
          <div className=" text-3xl mr-4 float-right">{Jersey}</div>
        </div>
        <div className="ml-4 text-xs">{TeamName}</div>
        <div className="float-right">


          <svg viewBox="0 0 500 50">

            <text y="50">{getLastWord(TeamName)}</text>

          </svg>

        </div>
      </div>
      <div className="relative h-2/12 bg-indigo-gray rounded-br-md rounded-bl-md">
        <div className="flex ml-2 mb-2 mt-2">
          {pos.map(function (position, i) {
            return <div className="ml-2 mr-1 w-8 h-8 rounded-full text-center bg-indigo-navy" key={i}>
              <div className="mt-1">
                {position}
              </div>
            </div>
          })}
        </div>
        <div className="absolute bottom-3 right-4 text-xs font-thin">{CoinValue}</div>
      </div>
    </div>
  );
};

AthleteContainer.propTypes = {
  color: PropTypes.string,
  AthleteName: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AthleteContainer.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default AthleteContainer;
