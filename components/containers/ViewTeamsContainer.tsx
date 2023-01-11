import PropTypes from 'prop-types';
import Link from 'next/link';

const ViewTeamsContainer = (props) => {
  const { teamNames, gameId, accountId, accountScore, accountPlacement, onClickFn, fromGames } =
    props;

  return (
    <div>
      {fromGames === false ? (
        <div>
          <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
            <p className="font-monument">{teamNames}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                onClickFn(teamNames, accountId, gameId);
              }}
            >
              <img src={'/images/arrow-top-right.png'} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center">
          <div className="w-10 font-monument text-2xl -mt-4">{'0' + accountPlacement}</div>
          <div className="p-5 px-6 ml-2 bg-black-dark text-indigo-white mb-5 flex justify-between flex-initial w-80">
            <p className="font-monument">{teamNames}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                onClickFn(teamNames, accountId, gameId);
              }}
            >
              <img src={'/images/arrow-top-right.png'} />
            </button>
          </div>
          <div className="font-monument ml-2 -mt-5">{accountScore}</div>
        </div>
      )}
    </div>
  );
};

ViewTeamsContainer.propType = {
  gameId: PropTypes.string,
  teamNames: PropTypes.string,
  accountId: PropTypes.string,
  accountScore: PropTypes.string,
  accountPlacement: PropTypes.string,
  onClickFn: PropTypes.func,
  fromGames: PropTypes.bool,
};
export default ViewTeamsContainer;
