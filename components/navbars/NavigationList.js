const navigation = [
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
