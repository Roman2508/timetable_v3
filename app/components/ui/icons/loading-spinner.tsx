import { type FC } from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center">
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "80px", height: "80px", contentVisibility: "visible" }}
      >
        <defs>
          <clipPath id="clip">
            <rect width="400" height="400" x="0" y="0" />
          </clipPath>
        </defs>

        <g clipPath="url(#clip)">
          {/* Статичне кільце */}
          <g transform="translate(200,200)" opacity="0.2">
            <path
              strokeLinecap="round"
              strokeLinejoin="miter"
              fill="none"
              className="stroke-primary"
              strokeOpacity="1"
              strokeWidth="40"
              d="M0,-100 C55.19,-100 100,-55.19 100,0 C100,55.19 55.19,100 0,100 C-55.19,100 -100,55.19 -100,0 C-100,-55.19 -55.19,-100 0,-100z"
            />
          </g>

          {/* Коло, що обертається */}
          <g
            style={{
              animation: "spin 1s linear infinite",
              transformOrigin: "200px 200px",
            }}
          >
            <circle cx="200" cy="100" r="20" fill="rgb(51,133,239)" className="fill-primary" />
          </g>
        </g>

        {/* Вбудовані keyframes */}
        <style>
          {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
        </style>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
