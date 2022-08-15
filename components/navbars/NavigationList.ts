const navigationGuest = [
  {
    name: 'MINT',
    path: '/MintPage',
    img: '/images/icons/Mint.svg',
  }
];

const navigationLoggedIn = [
  {
    name: 'CLUBHOUSE',
    path: 'http://playible.club',
    img: '/images/icons/Clubhouse.svg',
  },
  {
    name: 'HOME',
    path: '/',
    img: '/images/icons/Home.svg',
  },
  {
    name: 'MINT',
    path: '/MintPage',
    img: '/images/icons/Mint.svg',
  },
  {
    name: 'MY SQUAD',
    path: '/Portfolio',
    img: '/images/icons/My_Squad.svg',
  },
  {
    name: 'MY PACKS',
    path: '/Packs',
    img: '/images/icons/My_Packs.svg',
  },
  {
    name: 'PLAY',
    path: '/Play',
    img: '/images/icons/Play.svg',
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
    return navigationGuest;
  }
};
