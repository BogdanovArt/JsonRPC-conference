import { RootState } from "..";

export const getContentData = (state: RootState) => state.content.data;
export const getError = (state: RootState) => state.content.error;
export const getModal = (state: RootState) => state.content.modal;
export const getCurrentAction = (state: RootState) => state.content.currentAction;
export const getFetching = (state: RootState) => state.content.fetching;