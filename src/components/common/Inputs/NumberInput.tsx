import { useEffect, useState } from "react";

import { Input } from "./Input";

import styles from "./NumberInput.module.scss";
import { NumberInputProps } from "./types";

export const NumberInput = ({
  name,
  label,
  initial,
  dimmed,
  step = 5,
  width = "auto",
  max,
  min = 0,
  disabled,
  onChange = () => null,
}: NumberInputProps) => {
  const [value, setValue] = useState(initial || 0);

  function increment() {
    if (max && value + step > max) {
      setValue(max);
      return;
    }
    setValue(value + step);
  }

  function decrement() {
    const newVal = value - step;
    if (newVal > min) {
      setValue(newVal);
      return;
    }
    setValue(min);
  }

  function changeHandler(name: string, value: string) {
    const val = value ? parseInt(value, 10) : 0;
    if (max && val > max) {
      setValue(max);
      return;
    }
    setValue(val);
  }

  useEffect(() => {
    onChange(name, value);
  }, [value]);

  useEffect(() => {
    if ((initial || value) && initial !== value) {
      setValue(initial);
    }
  }, [initial]);

  return (
    <div className={styles.Wrapper}>
      {label && <div className={styles.Label}>{label}</div>}
      <div
        className={[styles.Input, dimmed && styles.Dimmed].join(" ")}
        style={{ width }}
      >
        <Input
          name={name}
          initial={value.toString()}
          emptyValue={min.toString()}
          disabled={disabled}
          allowedCharacters={`^[0-9]{0,${max.toString().length}}$`}
          after={
            <div
              className={[styles.Controls, disabled && styles.Readonly].join(
                " "
              )}
            >
              <div
                className={[
                  styles.ControlsButton,
                  styles.ControlsButtonReversed,
                ].join(" ")}
                onClick={() => increment()}
              >
                <img src="svg/chevron.svg" />
              </div>
              <div
                className={styles.ControlsButton}
                onClick={() => decrement()}
              >
                <img src="svg/chevron.svg" />
              </div>
            </div>
          }
          dimmed={dimmed}
          onChange={changeHandler}
        />
      </div>
    </div>
  );
};
