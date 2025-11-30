import type { FC } from "react"
import { cn } from "@/lib/utils"

interface Props {
  classNames?: string
  onClick?: () => void
}

const AbsentIcon: FC<Props> = ({ classNames = "", onClick }) => {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      className={cn("iconify iconify--noto", classNames)}
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onClick && onClick()}
    >
      <path
        d="M109.48 16.34H84.84c-1.28 0-2.33 1.04-2.33 2.33v36.27H45.5V18.68c0-1.29-1.04-2.33-2.34-2.33H18.53a2.34 2.34 0 0 0-2.34 2.33v99.96c0 1.29 1.05 2.33 2.34 2.33h24.63a2.34 2.34 0 0 0 2.34-2.33V76.15h37.02v42.48c0 1.29 1.05 2.33 2.33 2.33h24.64c1.29 0 2.33-1.05 2.33-2.33V18.68a2.35 2.35 0 0 0-2.34-2.34z"
        fill="#0046e0"
        // fill="#8a05ff"
        // fill="#1677ff"
      ></path>
    </svg>
  )
}

export default AbsentIcon
