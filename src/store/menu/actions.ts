import { setMenuData } from ".";
import { setError } from "../content";
import { AppThunk } from "..";

import { ActionTypes, CoreEntities, RequestMethods } from "types/enums";

import { requestUrl, apiRequest } from "utils/apiRequest";

import { defaultError, tempMenuData } from "utils/consts";

export const requestMenuData = (): AppThunk => async (dispatch) => {
  try {
    const res = await apiRequest({
      data: {
        entity: CoreEntities.system_view,
        action: ActionTypes.left_menu,
        options: {},
      },
      method: RequestMethods.POST,
      url: requestUrl,
    });
    if (res.data?.data) {
      dispatch(setMenuData(res.data?.data));
    }

    if (!res.data?.success || !res.data?.data) {
      dispatch(setError(res.data?.error || defaultError));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.error || defaultError));
  }
};
