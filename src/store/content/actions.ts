import {
  setContentData,
  setCurrentAction,
  setError,
  setFetching,
  setModal,
} from ".";
import { AppThunk } from "..";

import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  RequestMethods,
} from "types/enums";

import { apiRequest, requestUrl } from "utils/apiRequest";

import { defaultError, pollingMessage } from "utils/consts";

import { GenericAction } from "./types";
import { ModalContexts } from "./enums";
import { MenuItemTypes } from "store/menu/enums";
import { FormKeys } from "components/pages/blocks/TemplateModal/enums";
import { initialSelectorFormEmpty } from "components/pages/blocks/SelectorModal/consts";

const pageEntities: Array<CoreEntities | ButtonEntities> = [
  CoreEntities.content,
  CoreEntities.selector_grid,
  CoreEntities.archived_grid,
  ButtonEntities.SELECTOR_START,
];

export type ActionReturn = Promise<{
  success: boolean;
  error?: string;
  data?: unknown;
}>;

export const requestContentData =
  ({
    options,
    entity = CoreEntities.content,
    action = ActionTypes.get,
    polling = false,
    cancelToken,
  }: GenericAction): AppThunk<ActionReturn> =>
  async (dispatch, getState) => {
    try {
      const currentAction: GenericAction = {
        options,
        entity,
        action,
      };

      if (!polling) {
        dispatch(setFetching(true));
      }

      const res = await apiRequest({
        data: currentAction,
        method: RequestMethods.POST,
        cancelToken,
        url: requestUrl,
      });

      // console.log(res.data, typeof res.data)

      let data = res.data?.data;

      if (!polling) {
        dispatch(setError(""));
      }

      if (!res.data?.success || !data) {
        const error = res.data?.error || defaultError;
        console.error(error);
        dispatch(setError(error));
        return;
      }

      if (pageEntities.includes(entity)) {
        /* router history emulation */

        const code =
          currentAction.entity === CoreEntities.content
            ? currentAction.options.code
            : currentAction.entity;
        const hash = `#${code}`;
        if (hash === location.hash) {
          history.replaceState(currentAction, "lastAction", hash);
        } else {
          history.pushState(currentAction, "lastAction", hash);
        }

        /* router history emulation end */
        if (!polling) {
          dispatch(setCurrentAction(currentAction)); // "emulation" of router navigation through page dispatcher
          dispatch(setModal(null));
        }
      }

      switch (entity) {
        case CoreEntities.content:
          switch (currentAction.options?.code) {
            // case "current":
            //   data = JSON.parse(JSON.stringify(tempCurrentSelectorData));
            //   break;
            default:
              break;
          }
          break;
        // case CoreEntities.selector_grid:
        //   data = JSON.parse(JSON.stringify(tempSelectorData));
        //   break;
        case ButtonEntities.TEMPLATE_EDIT:
          switch (action) {
            case ActionTypes.share:
              break;
            default:
              const currentCode =
                getState().content.currentAction?.options?.code;
              let context = ModalContexts.readonly;
              switch (currentCode) {
                case MenuItemTypes.mine:
                  context = ModalContexts.edit;
                  break;
                default:
                  break;
              }
              dispatch(setModal({ ...data.template, context }));
              return res?.data; // return after setting modal data to prevent setContentData firing
          }
          break;
        case ButtonEntities.TEMPLATE_CREATE:
        case ButtonEntities.TEMPLATE_UPDATE:
        case ButtonEntities.TEMPLATE_DELETE:
        case ButtonEntities.TEMPLATE_CLOSE:
        case ButtonEntities.SELECTOR_DELETE:
        case ButtonEntities.SELECTOR_SAVE:
        case ButtonEntities.SELECTOR_UPDATE:
        case ButtonEntities.SELECTOR_ADD_VOTING:
          dispatch(setModal(null));
          break;
        case ButtonEntities.SELECTOR_CREATE:
          // data = initialSelectorForm[FormKeys.templates]; // @TODO tmp line - remove later
          const initialFormData = {
            ...initialSelectorFormEmpty,
            [FormKeys.templates]: data,
          };
          dispatch(setModal(initialFormData));
          return res?.data;
        case ButtonEntities.ARCHIVED_REPORT:
          // data = { log: JSON.parse(JSON.stringify(tempSelectorData.selector.log)) };
          dispatch(setModal({ ...data, context: ModalContexts.logs }));
          return;
        case ButtonEntities.ARCHIVED_SETTINGS:
        case ButtonEntities.SELECTOR_EDIT:
          // data = initialSelectorFormData; // @TODO tmp line - remove later
          dispatch(setModal({ ...data, context: ModalContexts.edit }));
          return;
        case ButtonEntities.DOWNLOAD:
          return res?.data;
        default:
          break;
      }
      if (data) {
        if (
          action !== ActionTypes.create ||
          options.code !== MenuItemTypes.lists
        ) {
          dispatch(setContentData(data));
        }

        return res?.data;
      }
    } catch (error) {
      console.error(error);
      if (error.message && error.message === pollingMessage) {
        return;
      }
      dispatch(setError(error.response?.data?.error || defaultError));
    } finally {
      if (!polling) dispatch(setFetching(false));
    }
  };

export const requestLocalData =
  ({
    options,
    entity = CoreEntities.content,
    action = ActionTypes.get,
    polling = false,
    cancelToken,
  }: GenericAction): AppThunk<ActionReturn> =>
  async (dispatch, getState) => {
    try {
      const currentAction: GenericAction = {
        options,
        entity,
        action,
      };

      const res = await apiRequest({
        data: currentAction,
        method: RequestMethods.POST,
        url: requestUrl,
        cancelToken,
      });

      // console.log(res.data, typeof res.data)

      let data = res.data?.data;

      dispatch(setError(""));

      if (!res.data?.success || !data) {
        const error = res.data?.error || defaultError;
        console.error(error);
        dispatch(setError(error));
        return;
      }
      return res.data;
    } catch (error) {
      console.error(error);
      if (error.message && error.message === pollingMessage) {
        return;
      }
      dispatch(setError(error.response?.data?.error || defaultError));
    } finally {
      dispatch(setFetching(false));
    }
  };
