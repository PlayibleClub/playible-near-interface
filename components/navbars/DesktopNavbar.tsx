import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Link from 'next/link';
import NavButtonContainer from '../containers/NavButtonContainer';
import { getNavigation } from './NavigationList';
import MarketplaceButtonContainer from '../containers/MarketplaceButtonContainer';
import { SPORT_TYPES } from 'data/constants/sportConstants';
import router from 'next/router';

const DesktopNavbar = (props) => {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const sportObj = SPORT_TYPES.map((x) => ({ name: x.sport }));

  const { color, secondcolor, isAdmin, activeName, isLoggedIn } = props;

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

  return (
    <div
      data-test="DesktopNavbar"
      className={`bg-gradient-to-b from-${color} to-${secondcolor} text-white-light flex flex-col w-1/5 h-screen`}
    >
      <div className="flex justify-left ml-12 pl-1 h-16 mt-10">
        <button>
          <Link href="/">
            <img className="w-8 h-8.5" src="/images/logo.png" alt="Img" />
          </Link>
        </button>
      </div>
      <div className="flex mt-10">
        <div className="flex flex-col h-1/5 w-4/6 font-monument">
          {getNavigation(isAdmin, isLoggedIn).map(({ name, img, path }) => (
            <button key={name} className="">
              <NavButtonContainer
                imagesrc={img}
                Title={name}
                path={path}
                activeName={activeName}
              ></NavButtonContainer>
            </button>
          ))}
          <div className="relative inline-block text-left">
            <button onClick={handleMarketplaceButtonClick}>
              <MarketplaceButtonContainer
                imagesrc="/images/navicons/icon_marketplace.png"
                Title="MARKETPLACE"
              />
            </button>
            {isDropdownVisible && (
              <div className="absolute left-20 mt-2 w-40 bg-white overflow-hidden shadow-xl border-2 z-10">
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
          </div>
        </div>
      </div>
      <div className="flex flex-row fixed bottom-16 w-1/6 justify-center gap-10">
        <div>
          <button>
            <Link href="https://twitter.com/playible/">
              <svg
                width="27"
                height="21"
                viewBox="0 0 26 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.2874 0.389065C24.8651 1.63803 24.1208 2.55254 23.0967 3.2946C23.4135 3.23711 23.7302 3.19269 24.0416 3.11953C24.3715 3.04376 24.6962 2.9497 25.0208 2.84779C25.3323 2.75112 25.6358 2.63092 26 2.50289C25.5144 3.21882 24.9971 3.82501 24.4032 4.36849C24.1287 4.61933 23.8437 4.85972 23.5428 5.07659C23.3844 5.19155 23.3448 5.31175 23.3475 5.49726C23.4029 9.93133 21.8695 13.7409 18.6732 16.8529C16.4483 19.019 13.7588 20.315 10.6734 20.7957C7.23703 21.3288 3.96691 20.8271 0.889453 19.1914C0.58593 19.0294 0.292965 18.8517 0 18.6558C2.86103 18.8883 5.44229 18.1985 7.78601 16.4583C5.34464 16.2284 3.71617 15.0082 2.8056 12.748C3.61588 12.8552 4.36808 12.8604 5.11237 12.6592C3.90092 12.3378 2.89006 11.7159 2.11146 10.7466C1.3355 9.77979 0.960715 8.67192 0.947518 7.39683C1.69445 7.76002 2.43874 8.00825 3.32555 8.03176C2.16161 7.17735 1.41996 6.11913 1.11907 4.77872C0.82083 3.43831 1.04781 2.18412 1.72084 0.969126C4.61354 4.34498 8.26109 6.20535 12.7295 6.51106C12.7004 6.21058 12.6661 5.931 12.645 5.65142C12.4365 2.88176 14.4925 0.391678 17.2823 0.0467763C18.9979 -0.164868 20.4812 0.344646 21.7322 1.51522C21.8483 1.62496 21.9407 1.66154 22.107 1.62496C23.2102 1.38196 24.2475 0.984803 25.2874 0.389065Z"
                  fill="white"
                />
              </svg>
            </Link>
          </button>
        </div>
        <div>
          <button>
            <Link href="https://discord.com/invite/PwyCnysEFD/">
              <svg
                width="25"
                height="27"
                viewBox="0 0 25 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.1378 26.165C24.1214 26.165 24.1024 26.165 24.086 26.165C24.0724 26.146 24.0615 26.1215 24.0424 26.1051C22.0155 24.3642 19.9858 22.6261 17.9561 20.8852C17.9153 20.8498 17.8662 20.828 17.7791 20.7708C18.0242 21.5717 18.2531 22.3237 18.4956 23.1083C18.3484 23.1083 18.2395 23.1083 18.1305 23.1083C13.1585 23.1083 8.18375 23.1083 3.21173 23.1083C3.08369 23.1083 2.95564 23.1056 2.8276 23.1001C1.25835 23.0402 0.127724 21.8823 0.125 20.3212C0.125 14.4801 0.125 8.63904 0.127724 2.79795C0.127724 1.59649 0.836066 0.591193 1.96669 0.177085C2.16284 0.106251 2.3699 0.0599366 2.5715 0C8.92478 0 15.2781 0 21.6341 0C21.664 0.013622 21.6913 0.0354171 21.724 0.0435903C23.2115 0.345998 24.1296 1.4739 24.1296 2.99411C24.1296 10.6088 24.1296 18.2207 24.1296 25.8354C24.1296 25.9444 24.1351 26.0533 24.1378 26.165ZM6.68806 7.93343C7.67974 7.11338 8.85122 6.66931 10.0799 6.30424C9.9764 6.24703 9.87287 6.20344 9.77207 6.20889C8.48343 6.29607 7.32829 6.75921 6.27395 7.48935C6.18677 7.54929 6.10231 7.63647 6.056 7.7291C4.88723 10.0176 4.18979 12.4287 4.15165 15.0114C4.14893 15.1558 4.20886 15.3356 4.30149 15.4446C5.30134 16.6433 6.63629 17.1201 8.15106 17.18C8.21644 17.1827 8.30362 17.1446 8.34449 17.0956C8.61148 16.7768 8.87029 16.4526 9.11821 16.1447C8.70138 15.9431 8.28183 15.7606 7.88406 15.5399C7.48358 15.3192 7.13758 15.0223 6.86242 14.6273C10.3905 16.4417 13.905 16.6188 17.4113 14.5728C16.801 15.3329 15.981 15.7415 15.0465 16.0467C15.3135 16.3763 15.5478 16.6842 15.8066 16.973C15.8774 17.052 16.0191 17.1173 16.1253 17.1119C17.6537 17.0274 18.9914 16.5016 20.0512 15.3628C20.1329 15.2757 20.201 15.1313 20.1983 15.0141C20.1329 12.4287 19.4464 10.004 18.2613 7.71275C18.2313 7.65554 18.1877 7.59288 18.1359 7.55473C17.068 6.79463 15.8965 6.30969 14.5779 6.23613C14.4662 6.23068 14.349 6.30969 14.2346 6.35055C14.2401 6.37507 14.2455 6.39959 14.251 6.42139C15.4088 6.77284 16.5122 7.23598 17.4739 7.99881C13.8832 6.36963 10.2924 6.34511 6.68806 7.93343Z"
                  fill="white"
                />
                <path
                  d="M13.2432 12.4828C13.2351 11.671 13.8562 11.0171 14.6463 11.0008C15.3955 10.9844 16.0521 11.6574 16.0603 12.4502C16.0684 13.2539 15.4255 13.9295 14.6518 13.9322C13.8808 13.9322 13.2487 13.2838 13.2432 12.4828Z"
                  fill="white"
                />
                <path
                  d="M11.0148 12.4504C11.0203 13.2677 10.3964 13.927 9.61175 13.9297C8.85164 13.9352 8.20324 13.2704 8.19779 12.4804C8.19234 11.6658 8.84347 10.9956 9.63354 10.9983C10.3855 11.0037 11.0094 11.6576 11.0148 12.4504Z"
                  fill="white"
                />
              </svg>
            </Link>
          </button>
        </div>
        <div>
          <button>
            <Link href="https://www.instagram.com/playible.io/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="27"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M15.233 5.488c-.843-.038-1.097-.046-3.233-.046s-2.389.008-3.232.046c-2.17.099-3.181 1.127-3.279 3.279-.039.844-.048 1.097-.048 3.233s.009 2.389.047 3.233c.099 2.148 1.106 3.18 3.279 3.279.843.038 1.097.047 3.233.047 2.137 0 2.39-.008 3.233-.046 2.17-.099 3.18-1.129 3.279-3.279.038-.844.046-1.097.046-3.233s-.008-2.389-.046-3.232c-.099-2.153-1.111-3.182-3.279-3.281zm-3.233 10.62c-2.269 0-4.108-1.839-4.108-4.108 0-2.269 1.84-4.108 4.108-4.108s4.108 1.839 4.108 4.108c0 2.269-1.839 4.108-4.108 4.108zm4.271-7.418c-.53 0-.96-.43-.96-.96s.43-.96.96-.96.96.43.96.96-.43.96-.96.96zm-1.604 3.31c0 1.473-1.194 2.667-2.667 2.667s-2.667-1.194-2.667-2.667c0-1.473 1.194-2.667 2.667-2.667s2.667 1.194 2.667 2.667zm4.333-12h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm.952 15.298c-.132 2.909-1.751 4.521-4.653 4.654-.854.039-1.126.048-3.299.048s-2.444-.009-3.298-.048c-2.908-.133-4.52-1.748-4.654-4.654-.039-.853-.048-1.125-.048-3.298 0-2.172.009-2.445.048-3.298.134-2.908 1.748-4.521 4.654-4.653.854-.04 1.125-.049 3.298-.049s2.445.009 3.299.048c2.908.133 4.523 1.751 4.653 4.653.039.854.048 1.127.048 3.299 0 2.173-.009 2.445-.048 3.298z" />
              </svg>
            </Link>
          </button>
        </div>
        <div className="flex flex-col fixed bottom-6 w-1/6 justify-center items-center gap-10">
          <a href="https://sportsdata.io" target="_blank">
            <img
              src="https://sportsdata.io/assets/images/badges/sportsdataio_light_100.png?v=1"
              alt="Sports Data Provider"
            ></img>
          </a>
        </div>
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  color: PropTypes.string,
  secondcolor: PropTypes.string,
  isAdmin: PropTypes.bool,
  activeName: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

DesktopNavbar.defaultProps = {
  color: 'indigo-light',
  secondcolor: 'indigo-light',
  isAdmin: false,
  isLoggedIn: false,
};

export default DesktopNavbar;
