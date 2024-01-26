import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import { getNavigation } from './NavigationList';
import React, { useState } from 'react';
import { SPORT_NAME_LOOKUP, SPORT_TYPES } from 'data/constants/sportConstants';
import router from 'next/router';

var styles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '20px',
    height: '15px',
    left: '42px',
    top: '50px',
  },
  bmBurgerBars: {
    background: '#ffffff',
  },
  bmBurgerBarsHover: {
    background: '#a90000',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
  },
  bmMenu: {
    background: 'white',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmMorphShape: {
    fill: '#000000',
  },
  bmItemList: {
    color: 'black',
    padding: '0.8em',
  },
  bmItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

const Navbar = (props) => {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const sportObj = SPORT_TYPES.filter((x) => x.sport !== SPORT_NAME_LOOKUP.cricket && x.sport).map(
    (x) => ({
      name: x.sport,
      isActive: false,
    })
  );
  const handleMarketplaceButtonClick = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  const handleSportSelection = (selectedSport) => {
    setDropdownVisibility(false);

    switch (selectedSport) {
      case 'FOOTBALL':
        router.push('https://paras.id/collection/athlete.nfl.playible.near');
        break;
      case 'BASKETBALL':
        router.push('https://paras.id/collection/athlete.basketball.playible.near');
        break;
      case 'BASEBALL':
        router.push('https://paras.id/collection/athlete.baseball.playible.near');
        break;
      case 'CRICKET':
        router.push('https://paras.id/collection/athlete.cricket.playible.near');
        break;
    }
  };
  const { isAdmin, isLoggedIn } = props;
  return (
    <div className="font-monument">
      <Menu styles={styles}>
        {getNavigation(isAdmin, isLoggedIn).map(({ name, img, path }) => (
          <a className="menu-item" id={name.toLowerCase()} href={path} key={name}>
            {name}
          </a>
        ))}
        <button onClick={handleMarketplaceButtonClick}>
          <div>{'MARKETPLACE'}</div>
        </button>
        {isDropdownVisible && (
          <div className="absolute mt-2 w-48 bg-white overflow-hidden shadow-xl border-2 z-50">
            <div className="py-1">
              {sportObj.map((sport, index) => (
                <button
                  key={index}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 w-full text-left hover:bg-indigo-white hover:text-indigo-navbargrad1 "
                  onClick={() => handleSportSelection(sport.name)}
                >
                  {sport.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-20 mb-10">
          <div className="cursor-pointer">
            <Link href="https://twitter.com/playible?s=21&t=NSaPA2EQtw_5_WlcS3q53Q">
              <svg
                width="32"
                height="26"
                viewBox="0 0 32 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.1229 0.481699C30.6032 2.02803 29.6871 3.16028 28.4268 4.07902C28.8166 4.00785 29.2064 3.95286 29.5897 3.86228C29.9957 3.76846 30.3953 3.652 30.7948 3.52584C31.1782 3.40614 31.5517 3.25733 32 3.09882C31.4023 3.98521 30.7656 4.73573 30.0347 5.40861C29.6969 5.71917 29.3461 6.01679 28.9757 6.2853C28.7808 6.42764 28.7321 6.57645 28.7354 6.80613C28.8036 12.2959 26.9163 17.0126 22.9824 20.8655C20.244 23.5473 16.9339 25.1518 13.1365 25.7471C8.90712 26.407 4.88235 25.7859 1.09471 23.7608C0.721145 23.5602 0.360573 23.3402 0 23.0976C3.52127 23.3855 6.6982 22.5315 9.58278 20.377C6.57801 20.0923 4.57375 18.5816 3.45305 15.7833C4.45031 15.9159 5.3761 15.9224 6.29215 15.6733C4.80114 15.2754 3.557 14.5054 2.59872 13.3053C1.64369 12.1083 1.18242 10.7367 1.16618 9.15798C2.08547 9.60765 3.00152 9.91497 4.09299 9.94409C2.66044 8.88624 1.74764 7.57606 1.37732 5.91651C1.01025 4.25695 1.28962 2.70415 2.11796 1.19987C5.67821 5.3795 10.1675 7.68282 15.667 8.06132C15.6313 7.68929 15.5891 7.34314 15.5631 6.997C15.3065 3.56789 17.837 0.484934 21.2705 0.0579135C23.382 -0.204122 25.2076 0.426704 26.7473 1.87599C26.8903 2.01186 27.004 2.05715 27.2086 2.01186C28.5664 1.711 29.8431 1.21928 31.1229 0.481699Z"
                  fill="black"
                />
              </svg>
            </Link>
          </div>
          <div className="ml-14 -mt-7 cursor-pointer">
            <Link href="https://discord.com/invite/PwyCnysEFD">
              <svg
                width="31"
                height="33"
                viewBox="0 0 31 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30.4751 32.8172C30.4546 32.8172 30.4307 32.8172 30.4102 32.8172C30.3931 32.7933 30.3795 32.7625 30.3555 32.742C27.8133 30.5585 25.2676 28.3785 22.7219 26.195C22.6706 26.1505 22.6091 26.1232 22.4998 26.0515C22.8073 27.0561 23.0944 27.9992 23.3985 28.9833C23.2139 28.9833 23.0773 28.9833 22.9406 28.9833C16.7045 28.9833 10.465 28.9833 4.22892 28.9833C4.06832 28.9833 3.90772 28.9799 3.74712 28.973C1.77891 28.8978 0.360839 27.4456 0.357422 25.4876C0.357422 18.1615 0.357422 10.8354 0.360839 3.50929C0.360839 2.00238 1.24927 0.741496 2.66734 0.222107C2.91336 0.133264 3.17306 0.0751747 3.42592 0C11.3944 0 19.363 0 27.3349 0C27.3725 0.0170852 27.4066 0.0444214 27.4477 0.0546725C29.3134 0.433963 30.4649 1.84861 30.4649 3.75532C30.4649 13.3059 30.4649 22.8531 30.4649 32.4037C30.4649 32.5404 30.4717 32.6771 30.4751 32.8172ZM8.58905 9.9504C9.83285 8.92187 11.3022 8.3649 12.8433 7.90701C12.7134 7.83526 12.5836 7.78058 12.4571 7.78742C10.8409 7.89676 9.39205 8.47766 8.06966 9.39342C7.96032 9.4686 7.85439 9.57794 7.7963 9.69412C6.33039 12.5644 5.45563 15.5885 5.4078 18.8279C5.40438 19.009 5.47955 19.2345 5.59573 19.3712C6.84978 20.8747 8.52413 21.4726 10.424 21.5478C10.506 21.5512 10.6154 21.5034 10.6666 21.4419C11.0015 21.0421 11.3261 20.6355 11.637 20.2493C11.1142 19.9965 10.588 19.7675 10.0891 19.4908C9.58683 19.214 9.15286 18.8415 8.80774 18.346C13.2328 20.6218 17.6408 20.8439 22.0385 18.2777C21.2731 19.2311 20.2445 19.7436 19.0725 20.1263C19.4074 20.5398 19.7012 20.9259 20.0259 21.2881C20.1147 21.3872 20.2924 21.4692 20.4257 21.4624C22.3426 21.3565 24.0204 20.697 25.3496 19.2686C25.4521 19.1593 25.5375 18.9782 25.5341 18.8313C25.4521 15.5885 24.591 12.5473 23.1046 9.67362C23.067 9.60186 23.0123 9.52327 22.9474 9.47543C21.6079 8.52208 20.1386 7.91385 18.4848 7.82159C18.3447 7.81475 18.1977 7.91385 18.0542 7.9651C18.0611 7.99586 18.0679 8.02661 18.0747 8.05395C19.527 8.49474 20.9109 9.07564 22.1171 10.0324C17.6134 7.98902 13.1098 7.95827 8.58905 9.9504Z"
                  fill="black"
                />
                <path
                  d="M16.8087 15.6566C16.7984 14.6383 17.5775 13.8182 18.5685 13.7977C19.5082 13.7772 20.3317 14.6212 20.3419 15.6156C20.3522 16.6236 19.5457 17.471 18.5753 17.4745C17.6083 17.4745 16.8155 16.6612 16.8087 15.6566Z"
                  fill="black"
                />
                <path
                  d="M14.0157 15.616C14.0225 16.6411 13.24 17.468 12.2559 17.4714C11.3026 17.4782 10.4893 16.6445 10.4825 15.6536C10.4756 14.6319 11.2923 13.7913 12.2832 13.7947C13.2263 13.8015 14.0088 14.6216 14.0157 15.616Z"
                  fill="black"
                />
              </svg>
            </Link>
          </div>
          <div className="ml-28 -mt-8 cursor-pointer">
            <Link href="https://instagram.com/playible.io?igshid=Zjc2ZTc4Nzk=">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 24 24">
                <path d="M15.233 5.488c-.843-.038-1.097-.046-3.233-.046s-2.389.008-3.232.046c-2.17.099-3.181 1.127-3.279 3.279-.039.844-.048 1.097-.048 3.233s.009 2.389.047 3.233c.099 2.148 1.106 3.18 3.279 3.279.843.038 1.097.047 3.233.047 2.137 0 2.39-.008 3.233-.046 2.17-.099 3.18-1.129 3.279-3.279.038-.844.046-1.097.046-3.233s-.008-2.389-.046-3.232c-.099-2.153-1.111-3.182-3.279-3.281zm-3.233 10.62c-2.269 0-4.108-1.839-4.108-4.108 0-2.269 1.84-4.108 4.108-4.108s4.108 1.839 4.108 4.108c0 2.269-1.839 4.108-4.108 4.108zm4.271-7.418c-.53 0-.96-.43-.96-.96s.43-.96.96-.96.96.43.96.96-.43.96-.96.96zm-1.604 3.31c0 1.473-1.194 2.667-2.667 2.667s-2.667-1.194-2.667-2.667c0-1.473 1.194-2.667 2.667-2.667s2.667 1.194 2.667 2.667zm4.333-12h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm.952 15.298c-.132 2.909-1.751 4.521-4.653 4.654-.854.039-1.126.048-3.299.048s-2.444-.009-3.298-.048c-2.908-.133-4.52-1.748-4.654-4.654-.039-.853-.048-1.125-.048-3.298 0-2.172.009-2.445.048-3.298.134-2.908 1.748-4.521 4.654-4.653.854-.04 1.125-.049 3.298-.049s2.445.009 3.299.048c2.908.133 4.523 1.751 4.653 4.653.039.854.048 1.127.048 3.299 0 2.173-.009 2.445-.048 3.298z" />
              </svg>
            </Link>
          </div>
        </div>
        <div>
          <a href="https://sportsdata.io" target="_blank">
            <img
              src="https://sportsdata.io/assets/images/badges/sportsdataio_dark_100.png?v=1"
              alt="Sports Data Provider"
            ></img>
          </a>
        </div>
      </Menu>
    </div>
  );
};

export default Navbar;
