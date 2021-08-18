import PropTypes from 'prop-types';
import Link from 'next/link'
const Navbar = (props) => {
  const { children, color } = props;

  return (
    <div data-test="Navbar" className={`bg-${color}  text-white-light flex flex-row justify-center  w-4/6 h-screen`}>
      <div className="flex flex-col h-1/2 w-1/2 justify-center">
        <Link href="/"><a>HOME</a></Link>
        <Link href="/Portfolio"><a>PORTFOLIO</a></Link>
        <Link href="/ContractInteraction"><a>PACKS</a></Link>
        <Link href="/ContractInteraction"><a>MARKETPLACE</a></Link>
        <Link href="/ContractInteraction"><a>PLAY</a></Link>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Navbar.defaultProps = {
  color: 'black-dark',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default Navbar;
