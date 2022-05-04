const navigation = [
  {
    name: 'CLUBHOUSE',
    path: 'http://playible.club',
    img: '/images/icons/Home.svg',
  },
  {
    name: 'HOME',
    path: '/',
    img: '/images/icons/Home.svg',
  },
  {
    name: 'SQUAD',
    path: '/Portfolio',
    img: '/images/icons/Play.svg',
  },
  {
    name: 'PLAY',
    path: '/Play',
    img: '/images/icons/My_Squad.svg',
  },
  {
    name: 'GET PACKS',
    path: 'https://www.oneplanetnft.io/launchpad/randombox/624b0f4039ef0b06630a7cfd',
    img: '/images/icons/My_Squad.svg',
  },
];

const navigationAdmin = [
  {
    name: 'GAME',
    path: '/Admin/Game',
    img: '/images/icons/Play.svg',
  },
];

export const getNavigation = (admin = false) => {
  if (admin) {
    return navigationAdmin;
  } else {
    return navigation;
  }
};
