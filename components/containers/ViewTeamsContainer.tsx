import PropTypes from 'prop-types';
import Link from 'next/link';

const ViewTeamsContainer = (props) =>{
const {
teamNames,
gameId,
} = props;

return (
        <div className="p-5 px-6 bg-black-dark text-indigo-white mb-5 flex justify-between">
            <p className="font-monument">{teamNames}</p>
            <Link
            href={{
                pathname: '/EntrySummary/[game_id]',
                query: {
                team_id: teamNames,
                game_id: gameId,
                },
            }}
            as={`/EntrySummary/${gameId}/${teamNames}`}
            >
            <a>
                <img src={'/images/arrow-top-right.png'} />
            </a>
            </Link>
        </div>
    )
}

ViewTeamsContainer.propType = {
gameId: PropTypes.string,
teamNames: PropTypes.string,
};
export default ViewTeamsContainer;

