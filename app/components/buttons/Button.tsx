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
        className={`bg-gray rounded-md py-[0.25em] px-[0.75em] ${className}`}>
        {children}
      </button>
    </AnimatedLink>
  );
};

export default Button;
