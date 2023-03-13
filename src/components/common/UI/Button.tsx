import React, { HTMLAttributes, MouseEventHandler } from "react";

import styles from "./Button.module.scss";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  color?: string;
  tooltip?: string;
  dark?: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: JSX.Element | JSX.Element[] | string;
}

export const Button = ({
  color,
  tooltip,
  disabled,
  children,
  dark,
  error,
  onClick,
  className,
  ...rest
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={[
        styles.Button,
        dark && styles.ButtonDark,
        error && styles.ButtonError,
        className,
      ].join(" ")}
      onClick={onClick}
      style={{ color, borderColor: color }}
      {...rest}
    >
      {children}
    </button>
  );
};
