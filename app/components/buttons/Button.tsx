// Button component

import { FunctionComponent } from "react";
import AnimatedLink from "./AnimatedLink";
import type { ButtonProps } from "@/app/types/global.t";

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  className,
  noY,
}) => {
  return (
    <AnimatedLink noY={noY && true}>
      <button
        onClick={onClick}
        className={`rounded-md bg-gray p-4 ${className}`}>
        {children}
      </button>
    </AnimatedLink>
  );
};

export default Button;
