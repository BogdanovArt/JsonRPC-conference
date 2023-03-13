import { createSlice } from "@reduxjs/toolkit";

import { PopupState } from "./types";
import reducers from "./reducers";

const initialState: PopupState = {
  showModal: true,
}

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers,
})

export const { setModal } = popupSlice.actions;

export default popupSlice.reducer;