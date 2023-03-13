import { createSlice } from "@reduxjs/toolkit";

import { ColorThemes, LSkeys } from "types/enums";
import { CoreState } from "./types";

import reducers from "./reducers";
import { getMediaBreakPoint } from "utils/getMediaBreakPoint";

const initialTheme = localStorage.getItem(LSkeys.colorTheme) as
  | ColorThemes
  | undefined;

const initialState: CoreState = {
  colorTheme: initialTheme || ColorThemes.light,
  breakpoint: getMediaBreakPoint(window.innerWidth),
};

export const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers,
});

export const { setColorTheme, setBreakPoint } = coreSlice.actions;

export default coreSlice.reducer;
