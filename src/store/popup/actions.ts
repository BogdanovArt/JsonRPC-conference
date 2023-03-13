import { setError } from "../content";
import { AppThunk } from "..";

import { ActionTypes, CoreEntities } from "types/enums";

import apiRequest from "utils/apiRequest";

import { defaultError } from "utils/consts";
import { RequestPayloadOptions } from "types";

export const requestMenuData =
  ({ options }: { options: RequestPayloadOptions }): AppThunk =>
  async (dispatch) => {
    // try {
    //   const res = await apiRequest({
    //     entity: CoreEntities.popup,
    //     action: ActionTypes.press,
    //     options,
    //   });
    //   if (res.data?.data) {
    //     dispatch(setPopupData(res.data.data));
    //   }

    //   if (!res.data?.success || !res.data?.data) {
    //     dispatch(setError(res.data?.error || defaultError));
    //   }
    // } catch (error) {
    //   dispatch(setError(error.response?.data?.error || defaultError));
    // }
  };
