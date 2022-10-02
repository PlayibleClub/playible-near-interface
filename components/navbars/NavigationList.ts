import Play from 'pages/Play';

const clubhouse = {
  name: 'CLUBHOUSE',
  path: 'http://playible.club',
  img: '/images/icons/Clubhouse.svg',
};

const home = {
  name: 'HOME',
  path: '/',
  img: '/images/icons/Home.svg',
};

const mint = {
  name: 'MINT',
  path: '/MintPage',
  img: '/images/icons/Mint.svg',
};

const mySquad = {
  name: 'MY SQUAD',
  path: '/Portfolio',
  img: '/images/icons/My_Squad.svg',
};

const myPacks = {
  name: 'MY PACKS',
  path: '/Packs',
  img: '/images/icons/My_Packs.svg',
};

const play = {
  name: 'PLAY',
  path: '/Play',
  img: '/images/icons/Play.svg',
};

const navigationGuest = [clubhouse, home, mint];

const navigationLoggedIn = [
  clubhouse,
  home,
  mint,
  mySquad,
  myPacks,
  //play,
];

const navigationAdmin = [
  {
    name: 'GAME',
    path: '/Admin/Game',
    img: '/images/icons/Play.svg',
  },
  {
    name: 'OPENPACK',
    path: '/Admin/OpenPack',
    img: '/images/icons/Play.svg',
  },
];

export const getNavigation = (admin = false, loggedIn = false) => {
  if (admin) {
    return navigationAdmin;
  } else if (loggedIn) {
    return navigationLoggedIn;
  } else {
    return navigationGuest;
  }
};
