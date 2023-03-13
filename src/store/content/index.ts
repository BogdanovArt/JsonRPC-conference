import { createSlice } from "@reduxjs/toolkit";

import { ContentState } from "./types";

import reducers from "./reducers";

const initialState: ContentState = {
  data: [],
  error: "",
  modal: null,
  currentAction: null,
  fetching: false,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers,
});

export const {
  setContentData,
  setError,
  setModal,
  setCurrentAction,
  setFetching,
} = contentSlice.actions;

export default contentSlice.reducer;
