import * as React from 'react';
import { useState, useEffect } from 'react';

const SvgComponent = (props) => {
  const [mode, setMode] = useState('#000');

  return (
    <svg
      width={19}
      height={18}
      fill="none"
      onMouseEnter={() => {
        setMode('#fff');
      }}
      onMouseLeave={() => {
        setMode('#000');
      }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(0.000000,384.000000) scale(0.100000,-0.100000)"
fill={mode} stroke="none">
<path d="M1710 3829 c-790 -89 -1452 -663 -1649 -1432 -85 -327 -78 -701 18
-1022 250 -837 1035 -1404 1901 -1372 484 18 918 198 1262 526 580 552 756
1399 444 2143 -227 544 -728 970 -1306 1112 -207 51 -465 68 -670 45z m-229
-1025 c41 -21 64 -51 449 -598 l365 -518 3 566 2 566 185 0 185 0 0 -245 0
-245 215 0 215 0 0 -185 0 -185 -215 0 -215 0 0 -100 0 -100 215 0 215 0 -2
-182 -3 -183 -212 -3 -213 -2 0 -98 c0 -118 -11 -161 -53 -209 -79 -90 -229
-96 -303 -12 -11 13 -187 260 -390 549 l-369 525 -3 -568 -2 -567 -185 0 -185
0 0 210 0 210 -212 2 -213 3 -3 183 -2 182 215 0 215 0 0 80 0 80 -212 2 -213
3 -3 183 -2 182 215 0 215 0 0 159 c0 167 7 204 47 259 54 73 171 99 254 56z"/>
</g>
    </svg>
  );
};

export default SvgComponent;
