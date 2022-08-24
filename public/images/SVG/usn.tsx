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
      <g clipPath="url(#a)" fill={props.hardCodeMode ? props.hardCodeMode : mode}>
        <path d="M0 0V16.9725H2.45065V3.91673L11.6543 16.9725H14.1049V0H11.8176V13.219L2.45065 0H0Z" />
        <path d="M14.6631 7.01306H11.2005C10.8257 7.01306 10.522 6.70962 10.522 6.33527C10.522 5.96091 10.8257 5.65747 11.2005 5.65747H14.6631C15.0379 5.65747 15.3416 5.96091 15.3416 6.33527C15.3417 6.70962 15.0379 7.01306 14.6631 7.01306Z" />
        <path d="M14.6631 10.1893H11.2005C10.8257 10.1893 10.522 9.88589 10.522 9.51154C10.522 9.13718 10.8257 8.83374 11.2005 8.83374H14.6631C15.0379 8.83374 15.3416 9.13718 15.3416 9.51154C15.3417 9.88589 15.0379 10.1893 14.6631 10.1893Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v17H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SvgComponent;
