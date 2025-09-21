import type { FC } from "react"
import { cn } from "@/lib/utils"

interface Props {
  size?: number
  classNames?: string
}

const LoadingSpinner: FC<Props> = ({ size = 40, classNames = "" }) => {
  return (
    <div className={cn("flex justify-center", classNames)}>
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: `${size}px`, height: `${size}px`, contentVisibility: "visible", overflow: "visible" }}
      >
        <defs>
          <clipPath id="clip">
            <rect width="240" height="240" x="-20" y="-20" />
          </clipPath>
        </defs>

        <g clipPath="url(#clip)">
          {/* Статичне кільце */}
          <g transform="translate(100,100)" opacity="0.2">
            <path
              fill="none"
              strokeWidth="40"
              strokeOpacity="1"
              strokeLinecap="round"
              strokeLinejoin="miter"
              className="stroke-primary"
              d="M0,-100 C55.19,-100 100,-55.19 100,0 C100,55.19 55.19,100 0,100 C-55.19,100 -100,55.19 -100,0 C-100,-55.19 -55.19,-100 0,-100z"
            />
          </g>

          {/* Коло, що обертається */}
          <g
            style={{
              animation: "spin 1s linear infinite",
              transformOrigin: "100px 100px",
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
  )
}

export default LoadingSpinner
