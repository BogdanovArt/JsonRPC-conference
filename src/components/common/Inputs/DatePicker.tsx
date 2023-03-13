import React, { useState, useRef, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
  KeyboardDatePicker as DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

import { isDate } from "utils/index";

import { DatePickerProps } from "./types";

import { getFormattedDate } from "utils/index";

import { Overrides } from "./DatePickerStyleOverrides";

const styleOverrides = makeStyles(Overrides);

export const YearMonthPicker = ({
  name = "",
  disabled,
  initial,
  onChange = () => null,
}: DatePickerProps) => {
  const wrapper = useRef(null);
  const classes = styleOverrides();
  const [value, setValue] = useState(null);

  const setDateFromString = (ref: string) => {
    const newValue = new Date(ref);

    if (isDate(newValue)) {
      valueSetter(newValue);
    }
  };

  const valueSetter = (date: Date | null) => {
    if (isDate(date)) {
      setValue(date);
      onChange(name, getFormattedDate(date));
    } else {
      setValue(null);
      onChange(name, null);
    }
  }

  useEffect(() => {
    if (initial) setDateFromString(initial);
    if (value && !initial) valueSetter(null);
  }, [initial]);

  return (
    <div id={`${name}-datepicker`} ref={wrapper} className={classes.Wrapper}>
      <MuiPickersUtilsProvider locale={ruLocale} utils={DateFnsUtils}>
        <DatePicker
          variant="inline"
          inputVariant="outlined"
          value={value}
          format="dd/MM/yyyy"
          readOnly={disabled}
          autoOk
          className={classes.Picker}
          invalidDateMessage=""
          maxDateMessage="Укажите корректную дату"
          minDateMessage="Укажите корректную дату"
          keyboardIcon={
            <div>
              <img className={classes.Img} src="svg/calendarNew.svg" alt="calendar-icon" />
            </div>
          }
          InputProps={{
            className: [classes.Input, !value && classes.Dimmed].join(" "),
            disabled,
            placeholder: "Дата",
          }}
          PopoverProps={{
            container: wrapper.current,
            className: classes.Pop,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          ToolbarComponent={() => null}
          onChange={valueSetter}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

