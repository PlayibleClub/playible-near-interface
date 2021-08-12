import PropTypes from 'prop-types';
import Link from 'next/link'
const Navbar = (props) => {
  const { children, color } = props;

  return (
    <div data-test="Navbar" className={`bg-${color} absolute top-0 left-0 text-white-light flex flex-col w-3/6 h-full`}>
      <Link href="/">
        <a>HOME</a>
      </Link>
      <Link href="/ContractInteraction">
        <a>PORTFOLIO</a>
      </Link>
      <div href="/PACKS">PACKS</div>
      <div href="/MARKETPLACE">MARKETPLACE</div>
      <div href="/PLAY">PLAY</div>
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
