import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { SwitchBox } from "components/common/Inputs/SwitchBox";

import { setColorTheme } from "store/core";
import { getColorTheme } from "store/core/getters";

import { ColorThemes } from "types/enums";

import styles from "./MenuLeft.module.scss";

export const ThemeSwitch = () => {
  const dispatch = useDispatch();
  const theme = useSelector(getColorTheme);

  const changeTheme = (state: boolean) => {
    dispatch(setColorTheme(state ? ColorThemes.dark : ColorThemes.light));
  };
  return (
    <div className={styles.MenuLeftControls}>
      <SwitchBox
        name="theme"
        label="Тёмная тема"
        onChange={(name, value) => changeTheme(value)}
        initial={theme === ColorThemes.dark}
      />
    </div>
  );
};
