import PropTypes from 'prop-types';
import Link from 'next/link'
const Navbar = (props) => {
  const { children, color } = props;

  return (
    <div data-test="Navbar" className={`bg-${color} absolute top-0 left-0 text-white-light  w-3/6 h-full`}>
      <div className="flex flex-col justify-center">
        <Link href="/"><a>HOME</a></Link>
        <Link href="/ContractInteraction"><a>PORTFOLIO</a></Link>
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
