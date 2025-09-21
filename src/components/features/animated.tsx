import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import type { ReactNode, ElementType } from "react";

const defaultAnimation: MotionProps = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & MotionProps;

export const Animated = ({ children, as: Component = motion.div, className = "", ...motionProps }: Props) => {
  return (
    <Component layout {...defaultAnimation} className={className} {...motionProps}>
      {children}
    </Component>
  );
};
