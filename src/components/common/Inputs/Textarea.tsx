import { useEffect, useState } from "react";

import { TextInputProps } from "./types";

import styles from "./Textarea.module.scss";

export function Textarea({
  name,
  placeholder = "Введите значение",
  label = "",
  initial = "",
  before,
  after,
  centered,
  dimmed,
  emptyValue = "",
  allowedCharacters = "",
  disabled,
  onChange = () => null,
  onEnter = () => null,
}: TextInputProps) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState(initial);

  function changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    const error = !checkForAllowedChars(value); // other validations will go here too;

    if (!error || !value) {
      setValue(value || emptyValue);
      onChange(name, value || emptyValue);
    }
  }

  function keyPressHandler(e: React.KeyboardEvent) {
    if (e && (e.code === "Enter" || e.code === "NumpadEnter")) {
      onEnter(name, value);
    }
  }

  function checkForAllowedChars(value: string) {
    if (!allowedCharacters || !value) {
      return true;
    }
    const reg = new RegExp(allowedCharacters);
    return reg.test(value);
  }

  useEffect(() => {
    if (initial.toString() !== value.toString()) setValue(initial);
  }, [initial]);

  return (
    <>
      <div className={styles.Container}>
        {label && <label className={styles.Label} htmlFor={name}>{label}</label>}
        <div
          className={[
            styles.Wrapper,
            focus && styles.Focus,
            dimmed && styles.Dimmed,
          ].join(" ")}
        >
          {before && before}
          <textarea
            value={value}
            name={name}
            placeholder={placeholder}
            className={[
              styles.Textarea,
              before && styles.TextareaBefore,
              after && styles.TextareaAfter,
              centered && styles.TextareaCentered,
            ].join(" ")}
            disabled={disabled}
            onChange={changeHandler}
            onKeyPress={keyPressHandler}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          {after && after}
        </div>
      </div>
    </>
  );
}
