import PropTypes from 'prop-types';
import Link from 'next/link';

const ViewTeamsContainer = (props) => {
  const { teamNames, gameId, accountId, onClickFn } = props;

  return (
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
  );
};

ViewTeamsContainer.propType = {
  gameId: PropTypes.string,
  teamNames: PropTypes.string,
  accountId: PropTypes.string,
  onClickFn: PropTypes.func,
};
export default ViewTeamsContainer;
