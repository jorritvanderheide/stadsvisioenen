// AnimatedLink component

"use client";

import { FunctionComponent } from "react";
import { motion } from "framer-motion";
import type { AnimatedLinkProps } from "@/app/types/global.t";

const AnimatedLink: FunctionComponent<AnimatedLinkProps> = ({
  children,
  className,
  scale,
  noY,
}) => {
  const scaleValue = scale ? scale : 0.95; // Default scale value
  const yValue = noY ? 0 : 2; // Default y value

  return (
    <motion.div
      className={`pointer-events-auto ${className}`}
      whileHover={{
        scale: scaleValue,
        transition: { duration: 0.4 },
        y: yValue,
      }}
      whileTap={{ scale: 0.95, y: yValue + 1 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedLink;
