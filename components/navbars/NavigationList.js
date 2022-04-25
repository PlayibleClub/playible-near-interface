const navigation = [
  {
    name: 'PLAYIBLE CLUB',
    path: 'http://playible.club',
    img: '/images/navicons/icon_home.png',
  },
  {
    name: 'HOME',
    path: '/',
    img: '/images/navicons/icon_home.png',
  },
  {
    name: 'SQUAD',
    path: '/Portfolio',
    img: '/images/navicons/icon_portfolio.png',
  },
  {
    name: 'PLAY',
    path: '/Play',
    img: '/images/navicons/icon_play.png',
  },
  {
    name: 'GET PACKS',
    path: 'https://www.oneplanetnft.io/launchpad/randombox/624b0f4039ef0b06630a7cfd',
    img: '/images/navicons/icon_portfolio.png',
  },
];

const navigationAdmin = [
  {
    name: 'GAME',
    path: '/Admin/Game',
    img: '/images/navicons/icon_play.png',
  },
];

export const getNavigation = (admin = false) => {
  if (admin) {
    return navigationAdmin;
  } else {
    return navigation;
  }
};
