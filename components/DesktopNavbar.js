import PropTypes from 'prop-types';
import Link from 'next/link'
const DesktopNavbar = (props) => {
  const { children, color } = props;

  return (
    <div data-test="DesktopNavbar" className={`bg-${color}  text-white-light flex flex-row justify-center  w-2/6 h-screen`}>
      <div className="flex flex-col h-1/2 w-1/2 justify-center">
        <img src="images/fantasyinvestar.png" alt="Img" />
        <Link href="/"><div className="flex flex-row"><img className="h-5 w-5" src="images/navicons/icon_home.png" alt="Img" /><a>DASHBOARD</a></div></Link>
        <Link href="/"><div className="flex flex-row"><img className="h-5 w-5" src="images/navicons/icon_portfolio.png" alt="Img" /><a>PORTFOLIO</a></div></Link>
        <Link href="/"><div className="flex flex-row"><img className="h-5 w-5" src="images/navicons/icon_packs.png" alt="Img" /><a>PACKS</a></div></Link>
        <Link href="/"><div className="flex flex-row"><img className="h-5 w-5" src="images/navicons/icon_marketplace.png" alt="Img" /><a>MARKETPLACE</a></div></Link>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  // children: <div>Fantasy investr</div>
  children: <div />,
};

export default DesktopNavbar;
