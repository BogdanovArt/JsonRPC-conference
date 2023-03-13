import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import menuReducer from "./menu";
import contentReducer from "./content";
import coreReducer from "./core";
import popupReducer from "./popup";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    content: contentReducer,
    core: coreReducer,
    popup: popupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
  >;

export type AppDispatch = typeof store.dispatch;
