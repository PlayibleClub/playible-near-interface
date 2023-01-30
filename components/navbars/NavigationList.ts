import Play from 'pages/Play';

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

const learn = {
  name: 'LEARN',
  path: 'http://playible.club',
  img: '/images/icons/Clubhouse.svg',
};

const adminGame = {
  name: 'GAME',
  path: '/Admin/Game',
  img: '/images/icons/Play.svg',
};

const adminOpenPack = {
  name: 'OPENPACK',
  path: '/Admin/OpenPack',
  img: '/images/icons/Play.svg',
};

export const getNavigation = (admin = false, loggedIn = false) => {
  if (admin) {
    return [adminGame, adminOpenPack, home, mySquad, myPacks, play];
  } else if (loggedIn) {
    return [home, mint, mySquad, myPacks, play, learn];
  } else {
    return [home, mint, learn];
  }
};
