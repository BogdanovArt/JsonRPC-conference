import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

import { PopUpStyles } from "./PopUpDateStyleOverrides";

const styleOverrides = makeStyles(PopUpStyles);

interface Props {
  initial?: Date;
  children?: JSX.Element | JSX.Element[];
  onChange?: (date: Date) => void;
}

export const PopUpDatePicker = ({
  initial,
  onChange = () => null,
  children,
}: Props) => {
  const wrapper = useRef(null);
  const classes = styleOverrides();
  const [value, setValue] = useState(null);

  const changeHandler = (date: Date) => {
    onChange(date);
    setValue(date);
  }

  useEffect(() => {
    if (initial) setValue(initial);
  }, []);

  useEffect(() => {
    if (value && !initial) setValue(null);
  }, [initial]);

  return (
    <div ref={wrapper} className={[classes.Wrapper].join(" ")}>
      <div className={classes.Container}>{children}</div>
      <MuiPickersUtilsProvider locale={ruLocale} utils={DateFnsUtils}>
        <DatePicker
          variant="inline"
          inputVariant="outlined"
          value={value}
          format="dd/MM/yyyy"
          autoOk
          className={classes.Button}
          invalidDateMessage=""
          maxDateMessage="Укажите корректную дату"
          minDateMessage="Укажите корректную дату"
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
          onChange={changeHandler}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};
