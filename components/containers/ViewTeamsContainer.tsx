import PropTypes from 'prop-types';
import Link from 'next/link';
import useViewport  from 'utils/address/helper';

const ViewTeamsContainer = (props) => {
  const { teamNames, gameId, accountId, accountScore, accountPlacement, onClickFn, fromGames } =
    props;
    const { cutTeam } = useViewport();

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
          <div
            className={`w-12 flex items-center justify-center font-monument text-2xl ${
              accountPlacement > 3 ? 'text-indigo-white font-outline-1' : ''
            }`}
          >
            <div className="w-10 font-monument text-2xl -mt-4 -ml-3">
              {accountPlacement <= 9 ? '0' + accountPlacement : accountPlacement}
            </div>
          </div>
          <div className="p-5 px-6 ml-2 bg-black-dark text-indigo-white mb-5 flex justify-between flex-initial w-80">
            <p className="font-monument">{cutTeam(teamNames)}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                onClickFn(teamNames, accountId, gameId);
              }}
            >
              <img src={'/images/arrow-top-right.png'} />
            </button>
          </div>
          <div className="font-bold font-monument ml-2 -mt-5">
            {accountScore}
          </div>
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
