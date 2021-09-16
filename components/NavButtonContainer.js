import PropTypes from 'prop-types';
import Link from 'next/link'
const NavButtonContainer = (props) => {
  const { children, color, imagesrc, Title, TeamName, CoinValue } = props;

  return (
    <Link href="/"><div data-test="NavButtonContainer" className="text-sm font-semibold flex flex-row justify-left mt-2"><img className="h-4 w-4 mr-3" src={imagesrc} alt="Img" /><a>{Title}</a></div></Link>
  );
};

NavButtonContainer.propTypes = {
  color: PropTypes.string,
  Title: PropTypes.string.isRequired,
  TeamName: PropTypes.string.isRequired,
  CoinValue: PropTypes.string.isRequired,
  imagesrc: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

NavButtonContainer.defaultProps = {
  color: 'sds',
  imagesrc: 'images/tokens/0.png',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default NavButtonContainer;
