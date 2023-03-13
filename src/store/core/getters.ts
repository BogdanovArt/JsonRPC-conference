import { RootState } from "store";

export const getColorTheme = (state: RootState) => state.core.colorTheme;
export const getBreakPoint = (state: RootState) => state.core.breakpoint;