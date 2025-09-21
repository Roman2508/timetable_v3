import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../common/input"
import { cn } from "@/lib/utils"

interface IInputPasswordProps {
  value?: string
  placeholder?: string
  wrapperClassName?: string
  [key: string]: any
}

const InputPassword: React.FC<IInputPasswordProps> = ({
  value = "",
  placeholder = "",
  wrapperClassName = "",
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        aria-label="Password"
        value={value}
        id="password"
        {...rest}
      />

      <button
        className="absolute inset-y-0 end-0 flex items-center z-20 px-2.5 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-primary transition-colors"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  )
}

export { InputPassword }
