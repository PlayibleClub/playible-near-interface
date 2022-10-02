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
      <g clipPath="url(#a)"  fill={props.hardCodeMode? props.hardCodeMode : mode}>
        <path d="M1.676 0h14.33v3.826h-5.18v5.06s-2.166.067-3.951 0v-5.06h-5.2V0Z" />
        <path d="M6.96 6.538S2.575 6.803.923 7.8c0 0-1.633.702 4.013 1.485 0 0 7.241.789 11.945-.838 0 0 2.746-1.103-6.233-1.904l.104-.487s3.315 0 6.006.857c0 0 1.389.4 1.236 1.398-.153.998-3.872 1.787-7.242 1.818l-3.963-.025S.122 9.81-.001 8.11c-.121-1.7 5.695-2.046 7.26-2.114 1.56-.067-.299.543-.299.543Z" />
        <path d="M6.862 9.951v7.05h4.025v-7l-4.025-.05Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v17H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SvgComponent;
