import { PayloadAction } from "@reduxjs/toolkit";
import { isMobile, isTablet } from "react-device-detect";

import {
  BreakPoints,
  BreakPointValues,
  ColorThemes,
  LSkeys,
} from "types/enums";
import { getMediaBreakPoint } from "utils/getMediaBreakPoint";
import { CoreState } from "./types";

const reducers = {
  setColorTheme: (state: CoreState, action: PayloadAction<ColorThemes>) => {
    state.colorTheme = action.payload;
    localStorage.setItem(LSkeys.colorTheme, action.payload);
  },
  setBreakPoint: (state: CoreState, action: PayloadAction<number>) => {
    const newBreakPoint = getMediaBreakPoint();
    if (state.breakpoint !== newBreakPoint) state.breakpoint = newBreakPoint;
  },
};

export default reducers;
