import PropTypes from 'prop-types';
import Link from 'next/link'
const NavButtonContainer = (props) => {
  const { children, color, imagesrc, Title, TeamName, CoinValue } = props;

  return (
    <Link href="/">
      <div data-test="NavButtonContainer" className="text-sm font-thin flex flex-row justify-left mt-4">
        <img className="h-3 w-3 mr-5 place-self-center" src={imagesrc} alt="Img" />
        <a>{Title}</a>
      </div>
    </Link>
  );
};

NavButtonContainer.propTypes = {
  color: PropTypes.string,
  Title: PropTypes.string,
  TeamName: PropTypes.string,
  CoinValue: PropTypes.string,
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
