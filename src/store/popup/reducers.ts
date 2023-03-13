import { PayloadAction } from "@reduxjs/toolkit";

import { PopupState } from "./types";

const reducers = {
  setModal: (state: PopupState, action: PayloadAction<boolean>) => {
    state.showModal = action.payload;
  },
};

export default reducers;
