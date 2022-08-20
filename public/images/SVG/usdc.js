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
      <g clipPath="url(#a)" fill={props.hardCodeMode? props.hardCodeMode : mode}>
        <path d="M9.85 15.266h-.628a.481.481 0 0 1-.483-.475V3.157c0-.26.218-.474.483-.474h.628c.264 0 .482.214.482.474v11.634c0 .26-.218.475-.482.475Z" />
        <path d="M10.98 6.503s-.224-.63-.72-.754c-.496-.13.053-1.461.053-1.461s1.93.279 2.413 2.026c0 0 .185.682-.602.682h-.548s-.456.02-.595-.493ZM8.786 5.742s-.833.117-.939.988c-.105.87 1.098 1.143 1.098 1.143v1.832l-1.11-.357s-1.958-.436-1.693-2.846c.264-2.41 3.378-2.306 3.378-2.306l-.734 1.546ZM10.234 8.166s1.904.181 2.519 1.253c.614 1.079.899 3.807-2.546 4.385l.067-1.604s.78-.079.978-.67c.198-.59.08-1.37-1.097-1.526-1.17-.143.079-1.838.079-1.838ZM8.812 12.264s-.78-.143-1.124-1.143c0 0-.04-.461-.47-.461h-.885s-.549.052-.456.78c.092.727.86 2.078 3.04 2.318l-.105-1.494Z" />
        <path d="M6.803.02S0 1.845 0 9.056c0 7.21 6.915 8.925 6.915 8.925s.245.071.245-.351v-1.033s-.014-.175-.278-.273c-.264-.104-5.024-1.637-5.302-7.333 0 0-.152-5.476 5.421-7.36 0 0 .165-.052.165-.312V.189s.06-.26-.363-.17ZM12.19 17.987s6.803-1.832 6.803-9.036S12.085.026 12.085.026s-.251-.071-.251.35V1.41s.013.175.277.273c.265.103 5.025 1.636 5.302 7.333 0 0 .152 5.476-5.42 7.36 0 0-.166.052-.166.312v1.13s-.06.253.364.17Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SvgComponent;
