import React, { useState, useRef, useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import { Select, FormControl, MenuItem, Typography } from "@material-ui/core";

import styles from "./Select.module.scss";
import { Overrides } from "./SelectStyleOverrides";
import { DropDownProps } from "./types";
import clsx from "clsx";

const styleOverrides = makeStyles(Overrides);

export const DropDown = ({
  name = "",
  placeholder = "Выберите значение",
  disabled,
  initial,
  titleKey = "title",
  valueKey = "value",
  subtitleKey = "subtitle",
  compact,
  slim,
  label,
  time,
  items = [],
  menu = false,
  popoptions,
  onChange = () => null,
}: DropDownProps) => {
  const classes = styleOverrides();
  const wrapper = useRef(null);

  const [selected, setSelected] = useState<string | number>("");

  const changeHandler = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (menu) {
      onChange(name, e.target.value as string);
      return;
    }
    setSelected(e.target.value as string);
  };

  useEffect(() => {
    onChange(name, selected);
  }, [selected]);

  useEffect(() => {
    if (initial != selected) {
      setSelected(initial);
    }
  }, [initial]);

  return (
    <div className={styles.Container}>
      {label && <label htmlFor={name}>{label}</label>}
      <div ref={wrapper} className={styles.Wrapper}>
        <FormControl variant="outlined" style={{ width: "100%" }}>
          <Select
            value={selected}
            onChange={changeHandler}
            displayEmpty
            className={clsx(classes.Select, {
              [classes.Dimmed]: !selected,
              [classes.Slim]: slim,
              [classes.Compact]: compact,
            })}
            IconComponent={() =>
              !compact ? (
                <div className={styles.Icon}>
                  <img src="svg/chevron.svg" />
                </div>
              ) : null
            }
            inputProps={{
              disabled,
            }}
            MenuProps={{
              container: wrapper.current,
              anchorOrigin: popoptions?.anchorOrigin || {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: popoptions?.transformOrigin || {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
              className: time ? classes.Time : classes.Menu,
            }}
          >
            <MenuItem value={""} className="disabled">
              <Typography variant="inherit" noWrap>
                {placeholder}
              </Typography>
            </MenuItem>
            {items.map((item) => (
              <MenuItem
                key={item[valueKey] as string}
                value={item[valueKey] as string}
              >
                <Typography variant="inherit" noWrap>
                  {item[titleKey]}{" "}
                  {item[subtitleKey] ? (
                    <span className="subtitle">({item[subtitleKey]})</span>
                  ) : null}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
