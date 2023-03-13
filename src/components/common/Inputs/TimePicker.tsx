import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { isDate } from "utils/index";

import { TimePickerProps } from "./types";

import { Overrides } from "./TimePickerStyleOverrides";
import styles from "./TimePicker.module.scss";

const styleOverrides = makeStyles(Overrides);


export const TimeSelect = ({
  name = "",
  initial,
  disabled,
  step = 5,
  onChange = () => null,
}: TimePickerProps) => {
  const [value, setValue] = useState(null);
  const classes = styleOverrides();

  const cloneDate = (date: null | Date) => {
    let referenceDate, newDate;
    if (date) {
      referenceDate = new Date(date.getTime());
    } else {
      referenceDate = new Date();
      referenceDate.setHours(0, 0, 0, 0);
    }
    newDate = new Date(referenceDate);
    return { referenceDate, newDate };
  };

  const increment = () => {
    const { referenceDate, newDate } = cloneDate(value);
    newDate.setMinutes(referenceDate.getMinutes() + step);
    setValue(newDate);
  };

  const decrement = () => {
    const { referenceDate, newDate } = cloneDate(value);
    newDate.setMinutes(referenceDate.getMinutes() - step);
    setValue(newDate);
  };

  const addZeroes = useCallback((num: number) => {
    return ("0" + num).slice(-2);
  }, []);

  const getTimeValue = () => {
    return isDate(value)
      ? `${addZeroes(value.getHours())}:${addZeroes(value.getMinutes())}`
      : null;
  };

  const setDateFromString = (data: string) => {
    const [hours, mins] = data.split(":");
    const newDate = new Date();
    if (hours && mins) {
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(mins, 10));
    }
    if (isDate(newDate)) {
      setValue(newDate);
    }
  };

  useEffect(() => {
    onChange(name, getTimeValue());
  }, [value]);

  useEffect(() => {
    if (initial !== getTimeValue()) setDateFromString(initial);
  }, []);

  return (
    <div className={styles.Wrapper}>
      <MuiPickersUtilsProvider locale={ruLocale} utils={DateFnsUtils}>
        <KeyboardTimePicker
          ampm={false}
          variant="inline"
          value={value}
          onChange={setValue}
          inputVariant="outlined"
          className={[classes.Picker].join(" ")}
          keyboardIcon={null}
          invalidDateMessage=""
          inputProps={{
            disabled,
            placeholder: "00:00",
            className: classes.Input,
          }}
        />
      </MuiPickersUtilsProvider>
      <div
        className={[styles.Controls, disabled && styles.ControlsDisabled].join(
          " "
        )}
      >
        <div className={styles.ControlsIncrement} onClick={increment}>
          <img src="svg/chevron.svg" alt="calendar-icon" />
        </div>

        <div className={styles.ControlsDecrement} onClick={decrement}>
          <img src="svg/chevron.svg" alt="calendar-icon" />
        </div>
      </div>
    </div>
  );
};
