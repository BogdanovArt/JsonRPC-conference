import { ModalContexts } from "store/content/enums";
import { MenuItemTypes } from "store/menu/enums";
import { IBasicObject, RequestPayloadOptions } from "types/index";
import {
  ActionTypes,
  ButtonEntities,
  CoreEntities,
  PayloadKeys,
} from "types/enums";

export type Modify<T, R> = Omit<T, keyof R> & R;

export type ModalTitles = {
  [key in MenuItemTypes]?: {
    [key in ModalContexts]?: string;
  };
};

export type ActionMap = {
  [key: string]: DefinedAction;
}

export type DefinedAction = {
  entity: ButtonEntities | CoreEntities;
  action?: ActionTypes;
  data?: IBasicObject;
  options?: RequestPayloadOptions;
  payloadKey?: PayloadKeys;
  payloadMap?: {
    [key in PayloadKeys]?: string;
  };
};

export type Orientation = "portrait" | "landscape";
