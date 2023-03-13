import { PayloadAction } from "@reduxjs/toolkit";

import { MenuItemSchema, MenuState, MenuStateData } from "./types";
import sortMenuData from "./utils";

const reducers = {
  setMenuData: (state: MenuState, action: PayloadAction<MenuStateData>) => {
    const sorted = sortMenuData(action.payload);
    state.data = sorted;
  },
  setActiveItem: (state: MenuState, action: PayloadAction<MenuItemSchema>) => {
    state.active = action.payload;
  },
  setMenuVisibility: (state: MenuState, action: PayloadAction<boolean>) => {
    state.show = action.payload;
  }
};

export default reducers;
