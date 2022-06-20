import * as React from "react"
import {useState, useEffect} from 'react'

const SvgComponent = (props) => {
  const [mode,setMode] = useState("#000")
  return(
    <svg
      width={19}
      height={17}
      fill="none"
      onMouseEnter={()=>{setMode("#fff")}}
      onMouseLeave={()=>{setMode("#000")}}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#a)" fill={mode}>
        <path d="M4.103 1.774v13.44h4.589s4.394.247 6.188-3.656c1.795-3.902-.251-9.826-5.994-9.826h-6.6V.006H8.87s5.977-.348 8.046 5.467C18.983 11.288 14.686 17 9.2 17H2.286V.355l1.817 1.42Z" />
        <path d="M0 5.473v2.014h18.983V5.491L0 5.473ZM.018 9.52v2.014H19V9.538L.018 9.52Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v17H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SvgComponent