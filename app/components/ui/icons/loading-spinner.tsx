import React from "react";

const LoadingSpinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 400 400"
      width="400"
      height="400"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", transform: "translate3d(0px, 0px, 0px)", contentVisibility: "visible" }}
    >
      <defs>
        <clipPath id="__lottie_element_18">
          <rect width="400" height="400" x="0" y="0"></rect>
        </clipPath>
      </defs>
      <g clip-path="url(#__lottie_element_18)">
        <g transform="matrix(1,0,0,1,200,200)" opacity="0.2" style={{ display: "block" }}>
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path
              stroke-linecap="round"
              stroke-linejoin="miter"
              fill-opacity="0"
              stroke-miterlimit="4"
              stroke="rgb(51,133,239)"
              stroke-opacity="1"
              stroke-width="30"
              d=" M0,-100 C55.189998626708984,-100 100,-55.189998626708984 100,0 C100,55.189998626708984 55.189998626708984,100 0,100 C-55.189998626708984,100 -100,55.189998626708984 -100,0 C-100,-55.189998626708984 -55.189998626708984,-100 0,-100z"
            ></path>
          </g>
        </g>
        <g
          transform="matrix(0.9829554557800293,-0.18384383618831635,0.18384383618831635,0.9829554557800293,200,200)"
          opacity="1"
          style={{ display: "block" }}
        >
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path
              stroke-linecap="round"
              stroke-linejoin="miter"
              fill-opacity="0"
              stroke-miterlimit="4"
              stroke="rgb(51,133,239)"
              stroke-opacity="1"
              stroke-width="30"
              d=" M-4.209000110626221,-99.91300201416016 C-2.812999963760376,-99.97100067138672 -1.409999966621399,-100 0,-100"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default LoadingSpinner;
