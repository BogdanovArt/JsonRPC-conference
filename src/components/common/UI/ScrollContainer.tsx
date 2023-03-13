import { HTMLAttributes } from "react";
import { isDesktop } from "react-device-detect";
import clsx from "clsx";

import styles from "./ScrollContainer.module.scss";

export const ScrollContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {

  return (
    <div
      className={clsx(
        styles.Container,
        { [styles.ContainerDesktop]: isDesktop },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
