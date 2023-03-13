import { useEffect, useState } from "react";
import styles from "./SwitchBox.module.scss";
import { SwitchBoxProps } from "./types";

export function SwitchBox({
  name = "",
  initial = false,
  disabled,
  label = "",
  onChange = () => null,
  reverse,
}: SwitchBoxProps) {
  const [checked, setChecked] = useState(initial);

  const toggle = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    onChange(name, checked);
  }, [checked]);

  useEffect(() => {
    if (initial !== checked) setChecked(initial);
  }, [initial]);

  return (
    <div
      className={[
        styles.Wrapper,
        reverse && styles.Reverse,
        disabled && styles.Readonly,
      ].join(" ")}
    >
      {label && <div className={styles.Label}>{label}</div>}
      <div
        className={[
          styles.Box,
          checked && styles.Active,
          disabled && styles.Disabled,
        ].join(" ")}
        onClick={() => toggle()}
      >
        <div className={styles.Dot}></div>
      </div>
    </div>
  );
}
