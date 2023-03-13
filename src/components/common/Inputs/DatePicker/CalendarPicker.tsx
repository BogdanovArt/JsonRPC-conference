import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@oktell/icons";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { MuiPickersUtilsProvider, Calendar } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

import { Day } from "./CalendarDay";

import { isDate } from "utils/index";
import { DatePickerProps } from "./types";
import { Overrides } from "./DatePickerStyleOverrides";

const styleOverrides = makeStyles(Overrides);

// @TODO вынести в @oktell/inputs

export const CalendarPicker = ({
  name = "",
  disabled,
  view,
  initial,
  onChange = () => null,
}: DatePickerProps) => {
  const wrapper = useRef(null);
  const classes = styleOverrides();
  const [header, setHeader] = useState("");
  const [value, setValue] = useState(null);
  const [selected, setSelected] = useState(null);

  const setInitialDate = (stringDate?: string) => {
    const newValue = stringDate ? new Date(stringDate) : new Date();

    if (isDate(newValue)) {
      setValue(newValue);
      setHeader(getHeader(newValue));
      setSelected(newValue);
    }
  };

  const getFormattedDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const getHeader = (date: Date) => {
    return format(date, "LLLL yyyy", { locale: ruLocale });
  };

  const monthChangeHandler = (date: Date) => {
    setHeader(getHeader(date));
  };

  const dayClickHandler = (date: Date) => {
    setSelected(date);
    onChange(name, getFormattedDate(date));
  };

  const changeHandler = (date: Date) => {};

  useEffect(() => {
    setInitialDate(initial);
  }, [initial]);

  return (
    <div ref={wrapper} id={`${name}-datepicker`} className={classes.Wrapper}>
      <MuiPickersUtilsProvider locale={ruLocale} utils={DateFnsUtils}>
        <div className={classes.Header}>
          <span>{header}</span>
        </div>
        <Calendar
          date={value || new Date()}
          onChange={changeHandler}
          onMonthChange={monthChangeHandler}
          renderDay={(date) => (
            <Day
              date={date}
              view={view}
              selected={selected}
              onDayClick={dayClickHandler}
            />
          )}
          leftArrowIcon={
            <Icon name="chevron" className="month-arrow left-arrow" />
          }
          rightArrowIcon={
            <Icon name="chevron" className="month-arrow right-arrow" />
          }
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};
