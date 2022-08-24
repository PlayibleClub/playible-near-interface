const baseballPos = [
  {
    name: 'P',
    value: 'Pitcher',
  },
  {
    name: 'C',
    value: 'Catcher',
  },
  {
    name: '1B',
    value: 'First Baseman',
  },
  {
    name: '2B',
    value: 'Second Baseman',
  },
  {
    name: '3B',
    value: 'Third Baseman',
  },
  {
    name: 'SS',
    value: 'Short Stop',
  },
  {
    name: 'LF',
    value: 'Left Fielder',
  },
  {
    name: 'CF',
    value: 'Center Fielder',
  },
  {
    name: 'RF',
    value: 'Right Fielder',
  },
  {
    name: 'IF',
    value: 'InFielder',
  },
  {
    name: 'OF',
    value: 'OutFielder',
  },
  {
    name: 'SP',
    value: 'Starting Pitcher',
  },
  {
    name: 'MRP',
    value: 'Middle Relief Pitcher',
  },
  {
    name: 'LRP',
    value: 'Long Relief Pitcher',
  },
  {
    name: 'RP',
    value: 'Relief Pitcher',
  },
  {
    name: 'CP',
    value: 'Closing Pitcher',
  },
  {
    name: 'DH',
    value: 'Designated Hitter',
  },
  {
    name: 'PH',
    value: 'Pinch Hitter',
  },
  {
    name: 'PR',
    value: 'Pinch Runner',
  },
];

const nflPos = [
  {
    name: 'C',
    value: 'center',
  },
  {
    name: 'DB',
    value: 'defensive back',
  },
  {
    name: 'DE',
    value: 'defensive end',
  },
  {
    name: 'DL',
    value: 'defensive lineman',
  },
  {
    name: 'DT',
    value: 'defensive tackle',
  },
  {
    name: 'E',
    value: 'end',
  },
  {
    name: 'FB',
    value: 'fullback',
  },
  {
    name: 'FL',
    value: 'flanker',
  },
  {
    name: 'G',
    value: 'guard',
  },
  {
    name: 'HB',
    value: 'halfback',
  },
  {
    name: 'K',
    value: 'kicker',
  },
  {
    name: 'LB',
    value: 'linebacker',
  },
  {
    name: 'MLB',
    value: 'middle linebacker',
  },
  {
    name: 'NG',
    value: 'nose guard',
  },
  {
    name: 'NT',
    value: 'nose tackle',
  },
  {
    name: 'OG',
    value: 'offensive guard',
  },
  {
    name: 'OL',
    value: 'offensive lineman',
  },
  {
    name: 'OLB',
    value: 'outside linebacker',
  },
  {
    name: 'OT',
    value: 'offensive tackle',
  },
  {
    name: 'P',
    value: 'punter',
  },
  {
    name: 'QB',
    value: 'quarterback',
  },
  {
    name: 'RB',
    value: 'running back',
  },
  {
    name: 'S',
    value: 'safety',
  },
  {
    name: 'SE',
    value: 'split end',
  },
  {
    name: 'T',
    value: 'tackle',
  },
  {
    name: 'TB',
    value: 'tailback',
  },
  {
    name: 'TE',
    value: 'tight end',
  },
  {
    name: 'WB',
    value: 'wingback',
  },
  {
    name: 'WR',
    value: 'wide receiver',
  },
];

function positionsProvider(sport): Object {
  const list = [
    {
      name: 'baseball',
      positons: baseballPos,
    },
    {
      name: 'football',
      positons: nflPos,
    },
  ];

  const position = list.findIndex((item) => item.name === sport);
  if (position !== -1) {
    return list[position];
  }
  return null;
}

export const position = (sport, pos) => {
  if (positionsProvider(sport) !== null) {
    const filteredPos = positionsProvider(sport);

    return filteredPos[0].value;
  } else {
    return pos;
  }
};
