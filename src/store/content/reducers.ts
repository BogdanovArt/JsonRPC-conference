import { PayloadAction } from "@reduxjs/toolkit";

import { TemplateBlockData, ContentState, ModalData, GenericAction } from "./types";

const reducers = {
  setContentData: (
    state: ContentState,
    action: PayloadAction<TemplateBlockData[]>
  ) => {
    state.data = action.payload;
  },
  setError: (state: ContentState, action: PayloadAction<string>) => {
    state.error = action.payload;
  },
  setModal: (state: ContentState, action: PayloadAction<ModalData | null>) => {
    state.modal = action.payload;
  },  
  setCurrentAction: (state: ContentState, action: PayloadAction<GenericAction | null>) => {
    state.currentAction = action.payload;
  },
  setFetching: (state: ContentState, action: PayloadAction<boolean>) => {
    state.fetching = action.payload;
  },  
};

export default reducers;
