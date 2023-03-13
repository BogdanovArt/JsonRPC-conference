import { useEffect, useState } from "react";

import styles from "./CheckBox.module.scss";
import { CheckBoxProps } from "./types";

export function CheckBox({
  name,
  initial = false,
  disabled = false,
  label = "",
  reverse,
  big = false,
  onChange = () => null,
  days = false,
}: CheckBoxProps) {
  const [checked, setChecked] = useState(initial);

  const toggle = () => {
    const newState = !checked;
    setChecked(newState);
    onChange(name, newState, "manual");
  };

  useEffect(() => {
    if (checked !== initial) {
      setChecked(initial);
    }
    onChange(name, initial, "auto");
  }, [initial]);

  if (days) {
    return (
      <div className={[styles.Wrapper, styles.Days, checked && styles.Active].join(" ")} onClick={() => toggle()}>
        <span className={styles.DaysLabel}>
          { label }
        </span>
      </div>
    )
  }

  return (
    <div className={[styles.Wrapper, reverse && styles.Reverse].join(" ")}>
      {label && <div className={styles.Label}>{label}</div>}
      <div
        className={[
          styles.Box,
          checked && styles.Active,
          disabled && styles.Disabled,
          big && styles.Big,
        ].join(" ")}
        onClick={() => toggle()}
      >
        <img className={styles.Dot} src="svg/check.svg" alt="checkmark" />
      </div>
    </div>
  );
}
