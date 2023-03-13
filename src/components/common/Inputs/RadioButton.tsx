import React, { useEffect, useState } from "react";
import { Icon } from "@oktell/icons";

import styles from "./RadioButton.module.scss";
import { RadioButtonProps } from "./types";
import clsx from "clsx";

export function RadioButton({
  name,
  initial = false,
  disabled = false,
  label = "",
  onChange = () => null,
  value,
  icon,
  iconView,
  readonlyRadio,
}: RadioButtonProps) {
  const click = (event: any) => {
    onChange(event.target.name, event.target.value, event.target.checked);
  };

  if (icon) {
    return (
      <div className={styles.Wrapper}>
        <label>
          <input
            disabled={disabled}
            className={clsx(styles.Input, { [styles.InputDisabled]: disabled })}
            type="radio"
            value={value}
            name={name}
            onChange={click}
            checked={initial}
          />
          <div
            className={clsx(styles.RadioIcon, {
              [styles.Active]: initial,
              [styles.Disabled]: readonlyRadio,
            })}
          >
            <Icon name={iconView} className={styles.Icon} />
            {label && <div className={styles.Label}>{label}</div>}
          </div>
        </label>
      </div>
    );
  }

  return (
    <div className={styles.Wrapper}>
      <label>
        <input
          className={styles.Input}
          type="radio"
          value={value}
          name={name}
          checked={initial}
          onChange={click}
        />
        <span
          className={clsx(styles.Radio, { [styles.Disabled]: readonlyRadio })}
        />
      </label>
      {label && <div className={styles.Label}>{label}</div>}
    </div>
  );
}
