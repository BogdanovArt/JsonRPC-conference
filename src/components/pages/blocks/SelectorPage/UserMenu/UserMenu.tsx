import React, { MouseEventHandler, useRef, useState } from "react";
import Popover from "@material-ui/core/Popover";
import { Icon } from "@oktell/icons";
import clsx from "clsx";

import { CallUser, PopOptions } from "../types";

import styles from "./UserMenu.module.scss";

interface Props {
  anchor: JSX.Element;
  popoptions?: PopOptions;
  compact?: boolean;
}

export const UserMenu: React.FC<Props> = ({
  anchor,
  popoptions,
  compact,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const anchorEl = useRef<HTMLDivElement>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    if (!open) {
      document.body.style.overflow = "hidden";
      setOpen(true);
    }
  };

  const handleClose = () => {
    document.body.style.overflow = "auto";
    setOpen(false);
  };

  return (
    <div
      ref={anchorEl}
      className={clsx(styles.Menu, "readonly")}
      onClick={handleClick}
    >
      <div className={styles.Toggler}>{anchor}</div>
      <Popover
        open={open}
        anchorEl={anchorEl?.current}
        onClose={handleClose}
        PaperProps={{
          className: clsx(styles.MenuWrapper, {
            [styles.Shifted]: !popoptions,
          }),
        }}
        container={anchorEl?.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        {...popoptions}
      >
        <div className={styles.MenuWrapper}>
          <div className={styles.Close} onClick={handleClose}>
            <Icon name="close" />
          </div>
          <div
            onClick={handleClose}
            className={clsx(styles.MenuContent, {
              [styles.MenuContentCompact]: compact,
            })}
          >
            {children}
          </div>
        </div>
      </Popover>
    </div>
  );
};
